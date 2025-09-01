// components/payment.js

function initializePaymentSystem() {
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
        const plan = confirmBtn.dataset.planName;
        
        if (plan && plan !== 'null') {
            processPlanPurchase(plan);
        } else if (!isNaN(amount)) {
            processCreditPurchase(amount);
        }
    });
}

// Global function to be called from index.html
function purchasePlan(planName, price, credits) {
    confirmPurchase(`${planName.charAt(0).toUpperCase() + planName.slice(1)} Pack`, price, credits, planName);
}

// Global function for credit top-ups
function purchaseCredits(credits, price) {
    const itemName = credits > 100 ? `${credits.toLocaleString()} Credits` : `Quick Top-up`;
    confirmPurchase(itemName, price, credits, null);
}

function confirmPurchase(itemName, price, credits, planName = null) {
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
    document.getElementById('payment-confirm-btn').dataset.creditAmount = credits;
    document.getElementById('payment-confirm-btn').dataset.planName = planName;

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

async function processPlanPurchase(planName) {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Upgrading...';

    try {
        const token = await getUserToken();
        if (!token) throw new Error("Authentication session expired. Please sign in again.");

        const response = await fetch(`${BACKEND_URL}/purchase-plan`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ plan: planName })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Upgrade failed.");
        }

        const data = await response.json();
        
        // Let the auth state listener handle the UI update for a consistent experience
        await window.auth.currentUser.reload(); // This will trigger onAuthStateChanged

        confirmBtn.textContent = 'Success!';
        setTimeout(closePaymentModal, 1500);

    } catch (error) {
        handlePurchaseError(error);
    }
}

async function processCreditPurchase(creditAmount) {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Processing...';

    try {
        const token = await getUserToken();
        if (!token) throw new Error("You must be signed in to complete a purchase.");

        const response = await fetch(`${BACKEND_URL}/purchase-credits`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ credits: creditAmount })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Purchase failed. Please try again.");
        }

        const data = await response.json();
        
        if (window.updateGenerationCountUI) {
            window.updateGenerationCountUI(data.newTotalCredits);
        }

        confirmBtn.textContent = 'Success!';
        setTimeout(closePaymentModal, 1500);

    } catch (error) {
        handlePurchaseError(error);
    }
}

function handlePurchaseError(error) {
    const confirmBtn = document.getElementById('payment-confirm-btn');
    console.error("Purchase Error:", error);
    confirmBtn.textContent = `Error: ${error.message}`;
    setTimeout(() => {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Purchase';
    }, 3000);
}
