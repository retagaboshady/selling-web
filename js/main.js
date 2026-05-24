var cart = JSON.parse(localStorage.getItem('cart')) || [];

function toggleCartView() {
    const cartEl = document.querySelector('.cart');
    if (cartEl) cartEl.classList.toggle('active');
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
        const price = parseFloat(item.price) || 0;
        total += price * item.quantity;
        count += item.quantity;
        
        cartItemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img || 'assests/icon.png'}" alt="">
                <div class="content">
                    <h4>${item.name || 'SHE OUT Product'}</h4>
                    <p class="price_cart">$${price}</p>
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
    const button = e.target.closest('.btn_add_cart');
    if (button) {
        const productCard = button.closest('.product') || button.closest('[class*="product"]');
        if (productCard) {
            const id = button.getAttribute('data-id') || Math.random().toString();
            const nameElement = productCard.querySelector('.name_product') || productCard.querySelector('h3');
            const name = nameElement ? nameElement.innerText.trim() : 'SHE OUT Product';
            
            const priceElement = productCard.querySelector('.price span') || productCard.querySelector('.price');
            let rawPrice = priceElement ? priceElement.innerText : '0';
            rawPrice = rawPrice.replace(/[^0-9.]/g, '');
            const price = parseFloat(rawPrice) || 0;
            
            const imgElement = productCard.querySelector('.img_product img') || productCard.querySelector('img');
            const img = imgElement ? imgElement.getAttribute('src') : 'assests/icon.png';
            
            addToCart({ id, name, price, img });
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    const searchInput = document.getElementById('search-input') || document.querySelector('input[type="search"]');
    const categorySelect = document.getElementById('category') || document.querySelector('select');
    const searchForm = document.querySelector('.search_box') || document.querySelector('form');

    function superLiveFilter() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCategory = categorySelect ? categorySelect.value.toLowerCase() : 'all';
        
        // بيلقط كروت المنتجات بأي طريقة كلاس سليم
        const products = document.querySelectorAll('.product, [class*="product"]');

        products.forEach(product => {
            if (product.classList.contains('cart') || product.classList.contains('item_cart') || product.closest('footer') || product.closest('.cart')) return;

            const productText = product.innerText.toLowerCase();
            let productCategory = 'all';
            
            if (productText.includes('hoodie') || productText.includes('pants') || productText.includes('jacket') || productText.includes('tee') || productText.includes('sneakers')) {
                productCategory = 'clothes';
            } else if (productText.includes('lipstick') || productText.includes('serum') || productText.includes('palette') || productText.includes('oil') || productText.includes('mist') || productText.includes('mask') || productText.includes('brush') || productText.includes('sponge')) {
                productCategory = 'beauty';
            } else if (productText.includes('bag') || productText.includes('necklace') || productText.includes('clips') || productText.includes('sunglasses') || productText.includes('scrunchies') || productText.includes('case') || productText.includes('light') || productText.includes('headphones') || productText.includes('organizer')) {
                productCategory = 'accessories';
            }

            const matchesSearch = productText.includes(searchTerm);
            const matchesCategory = (selectedCategory === 'all' || productCategory === selectedCategory);

            if (matchesSearch && matchesCategory) {
                product.style.setProperty('display', 'block', 'important');
            } else {
                product.style.setProperty('display', 'none', 'important');
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', superLiveFilter);
    if (categorySelect) categorySelect.addEventListener('change', superLiveFilter);
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            superLiveFilter();
        });
    }
});