fetch('products.json')
    .then(response => response.json())
    .then(products => {
        const savedCart = JSON.parse(localStorage.getItem('user_cart')) || [];
        
        const containers = {
            sale: document.getElementById("swiper_items_sale"),
            electronics: document.getElementById("swiper_elctronics"),
            appliances: document.getElementById("swiper_appliances"),
            mobiles: document.getElementById("swiper_mobiles")
        };

        products.forEach(item => {
            const alreadyInCart = savedCart.some(cartItem => cartItem.id === item.id);
            
            let discountBadge = '';
            let priceHTML = `<p><span>$${item.price}</span></p>`;

            if (item.old_price) {
                const discountPercentage = Math.floor(((item.old_price - item.price) / item.old_price) * 100);
                discountBadge = `<span class="sale_present">%${discountPercentage}</span>`;
                priceHTML += `<p class="old_price"><span>$${item.old_price}</span></p>`;
            }

            const itemHTML = `
                <div class="swiper-slide product">
                    ${discountBadge}
                    <div class="img_product">
                        <a href="#"><img src="${item.img}" alt="${item.name}"></a>
                    </div>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <p class="name_product"><a href="#">${item.name}</a></p>
                    <div class="price">
                        ${priceHTML}
                    </div>
                    <div class="icons">
                        <span class="btn_add_cart ${alreadyInCart ? 'active' : ''}" data-id="${item.id}">
                            <i class="fa-solid fa-cart-shopping"></i> ${alreadyInCart ? 'In Cart' : 'Add to cart'}
                        </span>
                        <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                    </div>
                </div>
            `;

            if (item.old_price && containers.sale) {
                containers.sale.innerHTML += itemHTML;
            }

            if (containers[item.category]) {
                containers[item.category].innerHTML += itemHTML;
            }
        });
    })
    .catch(error => console.error("Error loading home items:", error));