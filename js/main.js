var cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCartView() {
    document.querySelector('.cart').classList.toggle('active');
}

function addToCart(product) {
    const exist = cart.find(item => item.id == product.id);
    if (exist) {
        exist.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart_items');
    const cartCountElement = document.querySelector('.Count_item_cart');
    const cartTotalElement = document.querySelector('.price_cart_total');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        cartItemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">$${item.price}</p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="delete_item"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });
    
    if (cartCountElement) cartCountElement.innerText = count;
    if (cartTotalElement) cartTotalElement.innerText = `$${total}`;
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id != id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

document.addEventListener('click', function(e) {
    if (e.target && (e.target.classList.contains('btn_add_cart') || e.target.closest('.btn_add_cart'))) {
        const button = e.target.classList.contains('btn_add_cart') ? e.target : e.target.closest('.btn_add_cart');
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');
        
        addToCart({ id, name, price, img });
    }
});

document.addEventListener('DOMContentLoaded', updateCartUI);