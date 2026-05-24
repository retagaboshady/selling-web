document.addEventListener('DOMContentLoaded', function() {
    renderCheckoutSummary();
});

function renderCheckoutSummary() {
    const itemsListContainer = document.getElementById('checkout_items_list');
    const subtotalElement = document.getElementById('summary_subtotal');
    const totalElement = document.getElementById('summary_total');
    
    if (!itemsListContainer || !subtotalElement || !totalElement) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || 
               JSON.parse(localStorage.getItem('cart_items')) || 
               JSON.parse(localStorage.getItem('productInCart')) || [];
    
    if (cart.length === 0) {
        itemsListContainer.innerHTML = `
            <div class="empty_checkout_msg">
                <p>Your cart is empty!</p>
                <a href="index.html">Go back to shop and add products.</a>
            </div>
        `;
        subtotalElement.innerText = "$0";
        totalElement.innerText = "$5";
        return;
    }
    
    let subtotal = 0;
    itemsListContainer.innerHTML = '';
    
    cart.forEach(item => {
        let rawPrice = item.price ? item.price.toString() : "0";
        rawPrice = rawPrice.replace(/[^0-9.]/g, '');
        
        const price = parseFloat(rawPrice) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        
        const itemImg = item.img || item.image || 'assests/icon.png';
        const itemName = item.name || item.title || 'SHE OUT Product';
        
        itemsListContainer.innerHTML += `
            <div class="checkout_item">
                <img src="${itemImg}" alt="${itemName}">
                <div class="checkout_item_info">
                    <h4>${itemName}</h4>
                    <p>Qty: ${quantity} (Price: $${price})</p>
                </div>
                <span style="font-weight: bold; color: #333;">$${itemTotal}</span>
            </div>
        `;
    });
    
    const shipping = 5; 
    const total = subtotal + shipping;
    
    subtotalElement.innerText = "$" + subtotal;
    totalElement.innerText = "$" + total;
}

function handlePlaceOrder(event) {
    event.preventDefault();
    
    let cartKey = 'cart';
    if (localStorage.getItem('cart_items')) cartKey = 'cart_items';
    if (localStorage.getItem('productInCart')) cartKey = 'productInCart';
    
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const fullName = document.getElementById('full_name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    
    alert(`Thank you, ${fullName}! Your order has been placed successfully. 🎉\nWe will contact you on ${phone} for delivery to ${city}.`);
    
    localStorage.removeItem('cart');
    localStorage.removeItem('cart_items');
    localStorage.removeItem('productInCart');
    
    window.location.href = 'index.html';
}