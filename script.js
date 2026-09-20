// Product Data (High-Quality Direct Cloud CDN Images)
const products = [
    { id: 1, name: "Cartoon Astronaut T-Shirt", price: 499, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 2, name: "Tropical Print Hawaiian Shirt", price: 699, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 3, name: "Vintage Floral Summer Shirt", price: 599, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 4, name: "White Floral Casual Shirt", price: 549, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 5, name: "Navy Blue Floral Print Shirt", price: 649, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 6, name: "Corduroy Dual Pocket Jacket", price: 1299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 7, name: "Casual Khaki Chino Pants", price: 899, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60", brand: "adidas" },
    { id: 8, name: "Cat Pattern Linen Blouse", price: 499, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=60", brand: "adidas" }
];

// Cart State (Stored in LocalStorage)
let cart = JSON.parse(localStorage.getItem('cara_cart')) || [];

// 1. Render Products onto HTML Grid
function renderProducts() {
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
            <a href="javascript:void(0)" onclick="addToCart(${product.id})" class="cart-btn" title="Add to Cart">
                <i class="fa-solid fa-cart-shopping"></i>
            </a>
        </div>
    `).join('');
}

// 2. Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification(`${product.name} added to bag!`);
}

// 3. Update Cart State & Sync
function updateCart() {
    localStorage.setItem('cara_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartDrawer();
}

// 4. Cart Icon Badge Synchronizer (Desktop & Mobile)
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badgeDesktop = document.getElementById('cart-badge');
    const badgeMobile = document.getElementById('mobile-cart-badge');
    const badgeCount = document.getElementById('cart-count');

    if (badgeDesktop) badgeDesktop.innerText = totalItems;
    if (badgeMobile) badgeMobile.innerText = totalItems;
    if (badgeCount) badgeCount.innerText = totalItems;
}

// 5. Render Items in Cart Drawer / Modal
function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('bill-subtotal');
    const totalEl = document.getElementById('cart-total-price');
    const payTotalAmount = document.getElementById('pay-total-amount');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Your shopping bag is empty!</p>';
        if (subtotalEl) subtotalEl.innerText = "₹0";
        if (totalEl) totalEl.innerText = "₹0";
        if (payTotalAmount) payTotalAmount.innerText = "₹0";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                <img src="${item.image}" alt="${item.name}" style="width: 45px; height: 50px; object-fit: cover; border-radius: 4px;">
                <div style="flex: 1; margin-left: 10px; font-size: 13px;">
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="color: #666;">₹${item.price} × ${item.quantity} = <strong>₹${itemTotal}</strong></div>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff5252; cursor: pointer; font-size: 16px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    const tax = Math.round(subtotal * 0.05);
    const finalTotal = subtotal + tax;

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
    const taxEl = document.getElementById('bill-tax');
    if (taxEl) taxEl.innerText = `₹${tax}`;
    if (totalEl) totalEl.innerText = `₹${finalTotal}`;
    if (payTotalAmount) payTotalAmount.innerText = `₹${finalTotal}`;
}

// 6. Remove Item from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// 7. Backend Live Cloud Database Order Checkout
async function checkoutOrder() {
    if (cart.length === 0) {
        alert("Aapka bag khali hai! Pehle kuch add kijiye.");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + tax;
    const customerEmailInput = document.getElementById('pay-customer-email');
    const customerEmail = customerEmailInput ? customerEmailInput.value : "customer@cara.com";

    const orderData = {
        orderId: "ORD-" + Date.now(),
        customerEmail: customerEmail,
        items: cart,
        totalAmount: totalAmount
    };

    try {
        const response = await fetch('https://cara-store-fdui.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            alert(`🎉 Payment & Order Successful!\nOrder ID: ${orderData.orderId}\nData MongoDB Atlas cloud database me save ho gaya.`);
            cart = [];
            updateCart();

            const payModal = document.getElementById('payment-modal');
            if (payModal) payModal.style.display = 'none';
        } else {
            alert("Order save karne me problem aayi: " + result.error);
        }
    } catch (error) {
        console.error("Checkout Error:", error);
        alert("Render backend wake up ho raha hai (Spinning up). Kripya 20-30 second baad dubara click karein!");
    }
}

// 8. Visual Toast Feedback
function showNotification(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = msg;
        toast.className = "toast show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 2500);
    }
}

// 9. Initial Page Mount Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();

    // Sliding Cart Open/Close Handlers
    const openCartBtn = document.getElementById('open-cart-btn');
    const mobileCartBtn = document.getElementById('mobile-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');

    function toggleCart(show) {
        if (cartDrawer && cartOverlay) {
            if (show) {
                cartDrawer.classList.add('active');
                cartOverlay.classList.add('active');
            } else {
                cartDrawer.classList.remove('active');
                cartOverlay.classList.remove('active');
            }
        }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
    if (mobileCartBtn) mobileCartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    // UPI Payment Modal Handlers
    const proceedCheckoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closePayModal = document.getElementById('close-pay-modal');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener('click', () => {
            toggleCart(false);
            if (paymentModal) paymentModal.style.display = 'flex';
        });
    }

    if (closePayModal) {
        closePayModal.addEventListener('click', () => {
            if (paymentModal) paymentModal.style.display = 'none';
        });
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', checkoutOrder);
    }
});