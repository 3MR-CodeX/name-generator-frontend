// components/payment.js

function initializePaymentSystem() {
    // Event listeners are now in the HTML via onclick, this function can be simplified or removed
    // but we'll keep it as a placeholder for future logic if needed.
}

// UPDATED: Now accepts tierLevel and passes it to the confirmation modal
function purchasePlan(planName, tierLevel, credits, price) {
    const planTitle = planName.charAt(0).toUpperCase() + planName.slice(1) + " Pack";
    confirmPurchase(planTitle, price, credits, tierLevel);
}

// UPDATED: Now accepts just credits and price for top-ups
function purchaseCredits(credits, price) {
    const creditTitle = `${credits.toLocaleString()} Credits`;
    confirmPurchase(creditTitle, price, credits, null); // Pass null for tierLevel
}


// UPDATED: Handles the optional tierLevel
function confirmPurchase(itemName, price, credits, tierLevel = null) {
    const user = window.auth.currentUser;
    if (!user) {
        if (typeof openSignUpModal === 'function') openSignUpModal();
        document.getElementById("error").textContent = "Please create an account to make a purchase.";
        return;
    }

    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    document.getElementById('payment-item-name').textContent = itemName;
    document.getElementById('payment-item-price').textContent = `$${price.toFixed(2)}`;
    document.getElementById('payment-item-credits').textContent = `${credits.toLocaleString()} Credits`;
    
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.dataset.creditAmount = credits;
    // Store tierLevel in the button's dataset if it exists
    if (tierLevel !== null) {
        confirmBtn.dataset.tierLevel = tierLevel;
    } else {
        delete confirmBtn.dataset.tierLevel;
    }

    modal.classList.add('active');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('active');
        const confirmBtn = document.getElementById('payment-confirm-btn');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Purchase';
    }
}

// UPDATED: Sends tierLevel to the backend if present
async function processPurchase() {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    const creditAmount = parseInt(confirmBtn.dataset.creditAmount, 10);
    // Retrieve tierLevel if it was set
    const tierLevel = confirmBtn.dataset.tierLevel ? parseInt(confirmBtn.dataset.tierLevel, 10) : null;
    
    try {
        const token = await getUserToken();
        if (!token) {
            throw new Error("You must be signed in to complete a purchase.");
        }
        
        const payload = { credits: creditAmount };
        if (tierLevel !== null) {
            payload.tier_level = tierLevel;
        }

        const response = await fetch(`${BACKEND_URL}/purchase-credits`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Purchase failed. Please try again.");
        }

        const data = await response.json();
        
        if (window.updateUserStatusUI && window.auth.currentUser) {
            // Force a refresh of the user status from the backend
            window.updateUserStatusUI(window.auth.currentUser, true);
        }

        confirmBtn.textContent = 'Success!';
        setTimeout(() => {
            closePaymentModal();
            // If it was a plan purchase, redirect to the main page
            if (tierLevel !== null) {
                showView('generator');
            }
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


// Self-initialize the listeners when the script loads
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    const cancelBtn = document.getElementById('payment-cancel-btn');
    const closeBtn = document.querySelector('#payment-modal .close-button');
    const paymentModal = document.getElementById('payment-modal');

    if (confirmBtn) confirmBtn.addEventListener('click', processPurchase);
    if (cancelBtn) cancelBtn.addEventListener('click', closePaymentModal);
    if (closeBtn) closeBtn.addEventListener('click', closePaymentModal);
    if (paymentModal) window.addEventListener('click', (event) => { 
        if (event.target == paymentModal) closePaymentModal(); 
    });
});
