const sideCartElement = document.querySelector('.cart');
const categoryMenu = document.querySelector(".category_nav_list");
const mobileNavLinks = document.querySelector(".nav_links");
const cartItemsContainer = document.getElementById("cart_items");
const totalElement = document.querySelector(".price_cart_total");
const countElement = document.querySelector(".Count_item_cart");

function toggleCartView() {
    if(sideCartElement) sideCartElement.classList.toggle("active");
}
// لدعم الاسم القديم في الـ HTML
function open_close_cart() {
    toggleCartView();
}

function toggleCategoryMenu() {
    if(categoryMenu) categoryMenu.classList.toggle("active");
}

function toggleMobileMenu() {
    if(mobileNavLinks) mobileNavLinks.classList.toggle("active");
}

fetch('products.json')
    .then(res => res.json())
    .then(productsData => {
        setupAddToCartListeners(productsData);
    })
    .catch(err => console.error("Error:", err));

function setupAddToCartListeners(productsData) {
    document.addEventListener("click", (e) => {
        const button = e.target.closest(".btn_add_cart");
        if (button) {
            const pId = button.getAttribute('data-id');
            const targetProduct = productsData.find(item => item.id == pId);
            
            if (targetProduct) {
                addItemToCart(targetProduct);
                
                const matches = document.querySelectorAll(`.btn_add_cart[data-id="${pId}"]`);
                matches.forEach(btn => {
                    btn.classList.add("active");
                    btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> In Cart`;
                });
            }
        }
    });
}

function getCartFromStorage() {
    return JSON.parse(localStorage.getItem('user_cart')) || [];
}

function saveCartToStorage(cartData) {
    localStorage.setItem('user_cart', JSON.stringify(cartData));
}

function addItemToCart(product) {
    let currentCart = getCartFromStorage();
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentCart.push({ ...product, quantity: 1 });
    }
    
    saveCartToStorage(currentCart);
    refreshCartUI();
}

function modifyQuantity(index, action) {
    let currentCart = getCartFromStorage();
    
    if (action === 'increase') {
        currentCart[index].quantity += 1;
    } else if (action === 'decrease' && currentCart[index].quantity > 1) {
        currentCart[index].quantity -= 1;
    }
    
    saveCartToStorage(currentCart);
    refreshCartUI();
}

function deleteFromCart(index) {
    let currentCart = getCartFromStorage();
    const removedItem = currentCart.splice(index, 1)[0];
    
    saveCartToStorage(currentCart);
    refreshCartUI();
    resetButtonState(removedItem.id);
}

function resetButtonState(productId) {
    const actionButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`);
    actionButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to cart`;
    });
}

function refreshCartUI() {
    const cartItems = getCartFromStorage();
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    let totalCount = 0;

    cartItems.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="item_cart" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid var(--border_color); padding-bottom: 10px;">
                <img src="${item.img}" alt="" style="width: 50px; height: auto;">
                <div class="content" style="flex: 1; margin-left: 10px;">
                    <h4 style="font-size: 14px; margin-bottom: 5px;">${item.name}</h4>
                    <p class="price_cart" style="font-weight: bold; color: var(--main_color);">$${item.price * item.quantity}</p>
                    <div class="qty" style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                        <button onclick="modifyQuantity(${index}, 'decrease')" style="width: 20px; height: 20px; cursor:pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="modifyQuantity(${index}, 'increase')" style="width: 20px; height: 20px; cursor:pointer;">+</button>
                    </div>
                </div>
                <button onclick="deleteFromCart(${index})" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    if (totalElement) totalElement.innerText = `$${totalPrice}`;
    if (countElement) countElement.innerText = totalCount;
}

// تشغيل السلة تلقائياً عند تحميل الصفحة لقراءة البيانات المحفوظة
document.addEventListener("DOMContentLoaded", refreshCartUI);