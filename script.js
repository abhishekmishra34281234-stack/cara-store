// Render Products
function renderProducts() {
    // products-grid ya product-container dono ko check karega
    const container = document.getElementById('products-grid') || document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="pro">
            <img src="${product.image}" alt="${product.name}">
            <div class="des">
                <span>${product.brand}</span>
                <h5>${product.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>₹${product.price}</h4>
            </div>
            <a href="javascript:void(0)" onclick="addToCart(${product.id})" class="cart-btn"><i class="fa-solid fa-cart-shopping"></i></a>
        </div>
    `).join('');
}

// Cart Icon Badge Counter
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // HTML me do alag badges hain (Desktop + Mobile)
    const badge1 = document.getElementById('cart-badge');
    const badge2 = document.getElementById('mobile-cart-badge');
    const badge3 = document.getElementById('cart-count');

    if (badge1) badge1.innerText = totalItems;
    if (badge2) badge2.innerText = totalItems;
    if (badge3) badge3.innerText = totalItems;
}