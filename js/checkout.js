document.addEventListener('DOMContentLoaded', fuction() {
    renderCheckoutSummary();
});

function renderCheckoutSummary() {
    const itemListContainer = document.getElementById('checkout_items_list');
    const subtotalElement = document.getElementById('summary_subtotal');
    const totalElement = document.getElementById('summary_total');
    if (!itemListContainer || !subtotalElement || !totalElement) return;
    let cart =  JSON.parse(localStorage.getItem('cart')) || 
                JSON.parse(loacalStorage.getItem('cart_items')) || 
                JSON.parse(localStorage.getItem('productInCart')) || [];
    if (cart.length === 0) {
        itemListContainer.innerHTML = `
            <div class="empty_checkout_msg">
                <p>Your cart is empty!</p>
                <a href="index.html">Go back to shop and add products.</a>
            </div>
        `;
        subtotalElement.innerText = "0";
        totalElement.innerText = "50$";
        return;
    }
    let subtotal = 0;
    itemsListContainer.innerHTML = '';
    cart.forEach(item =>)
}