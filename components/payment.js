// components/payment.js

// This function initializes all payment-related event listeners.
function initializePaymentSystem() {
    // Event listeners for Premium Pack purchases
    const starterBtn = document.querySelector('.pricing-card button[onclick="purchasePlan(\'starter\')"]');
    const proBtn = document.querySelector('.pricing-card button[onclick="purchasePlan(\'pro\')"]');
    const businessBtn = document.querySelector('.pricing-card button[onclick="purchasePlan(\'business\')"]');

    if (starterBtn) starterBtn.addEventListener('click', () => confirmPurchase('Starter Pack', 4.99, 1000));
    if (proBtn) proBtn.addEventListener('click', () => confirmPurchase('Pro Pack', 9.99, 2500));
    if (businessBtn) businessBtn.addEventListener('click', () => confirmPurchase('Business Pack', 19.99, 6000));

    // Event listeners for Credit Top-up purchases
    const creditBtn1 = document.querySelector('.pricing-card button[onclick="purchaseCredits(100)"]');
    const creditBtn2 = document.querySelector('.pricing-card button[onclick="purchaseCredits(500)"]');
    const creditBtn3 = document.querySelector('.pricing-card button[onclick="purchaseCredits(1200)"]');
    const creditBtn4 = document.querySelector('.pricing-card button[onclick="purchaseCredits(3000)"]');

    if (creditBtn1) creditBtn1.addEventListener('click', () => confirmPurchase('Quick Top-up', 0.99, 100));
    if (creditBtn2) creditBtn2.addEventListener('click', () => confirmPurchase('Refill', 2.99, 500));
    if (creditBtn3) creditBtn3.addEventListener('click', () => confirmPurchase('Boost', 4.99, 1200));
    if (creditBtn4) creditBtn4.addEventListener('click', () => confirmPurchase('Mega Pack', 9.99, 3000));

    // Event listeners for the confirmation modal itself
    const cancelBtn = document.getElementById('payment-cancel-btn');
    const confirmBtn = document.getElementById('payment-confirm-btn');
    const closeBtn = document.querySelector('#payment-modal .close-button');
    const paymentModal = document.getElementById('payment-modal');

    if (cancelBtn) cancelBtn.addEventListener('click', closePaymentModal);
    if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
    if (paymentModal) window.addEventListener('click', (event) => { if (event.target == paymentModal) closePaymentModal(); });

    if (confirmBtn) confirmBtn.addEventListener('click', () => {
        const amount = parseInt(confirmBtn.dataset.creditAmount, 10);
        if (!isNaN(amount)) {
            processPurchase(amount);
        }
    });
}

// Shows the confirmation modal with details about the selected item.
function confirmPurchase(itemName, price, credits) {
    const user = window.auth.currentUser;
    if (!user) {
        // If user is not logged in, prompt them to sign up/in
        if (typeof openSignUpModal === 'function') openSignUpModal();
        document.getElementById("error").textContent = "Please create an account to make a purchase.";
        return;
    }

    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    document.getElementById('payment-item-name').textContent = itemName;
    document.getElementById('payment-item-price').textContent = `$${price.toFixed(2)}`;
    document.getElementById('payment-item-credits').textContent = `${credits.toLocaleString()} Credits`;
    document.getElementById('payment-confirm-btn').dataset.creditAmount = credits;

    modal.classList.add('active');
}

// Closes the payment confirmation modal.
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('active');
        const confirmBtn = document.getElementById('payment-confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Purchase';
    }
}

// Simulates processing the purchase by calling the backend.
async function processPurchase(creditAmount) {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    try {
        const token = await getUserToken(); // This function should be available from main.js
        if (!token) {
            throw new Error("You must be signed in to complete a purchase.");
        }

        const response = await fetch(`${BACKEND_URL}/purchase-credits`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ credits: creditAmount })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Purchase failed. Please try again.");
        }

        const data = await response.json();
        
        // Update UI with new credit balance
        if (window.updateUserStatusUI) {
            // We refetch the user status from the auth state change listener
            // which gets triggered after a successful backend update.
            // For an immediate visual update, we can call it directly:
            window.updateGenerationCountUI(data.newTotalCredits);
        }

        confirmBtn.textContent = 'Success!';
        setTimeout(() => {
            closePaymentModal();
        }, 1500);

    } catch (error) {
        console.error("Purchase Error:", error);
        confirmBtn.textContent = `Error: ${error.message}`;
        setTimeout(() => {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Confirm Purchase';
        }, 3000);
    }
}
