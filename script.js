// ==========================================
// 1. DUMMY PRODUCTS DATA
// ==========================================
const products = [
    {
        id: 1,
        brand: "PETER ENGLAND",
        name: "Classic Cotton White T-Shirt",
        price: 699,
        originalPrice: 1299,
        category: "tshirt",
        rating: 4.5,
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
    },
    {
        id: 2,
        brand: "ROADSTER",
        name: "Hawaiian Summer Floral Shirt",
        price: 999,
        originalPrice: 1999,
        category: "shirt",
        rating: 4.8,
        img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"
    },
    {
        id: 3,
        brand: "BEWAKOOFS",
        name: "Oversized Streetwear Graphic Tee",
        price: 799,
        originalPrice: 1499,
        category: "tshirt",
        rating: 4.2,
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"
    },
    {
        id: 4,
        brand: "RAYMOND",
        name: "Slim Fit Casual Oxford Shirt",
        price: 1299,
        originalPrice: 2499,
        category: "shirt",
        rating: 4.7,
        img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"
    }
];

// App State
let cart = JSON.parse(localStorage.getItem('cart')) || [
    { id: 1, name: "Classic Cotton White T-Shirt", price: 699, quantity: 1 }
];
let wishlistCount = 0;
let discountPercent = 0;

// ==========================================
// 2. RENDER PRODUCTS
// ==========================================
function renderProducts(itemsToRender) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = itemsToRender.map(p => `
        <div class="pro" data-id="${p.id}">
            <img src="${p.img}" alt="${p.name}" class="pro-img" onclick="openQuickView(${p.id})">
            <div class="des">
                <span>${p.brand}</span>
                <h5>${p.name}</h5>
                <div class="star">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                </div>
                <h4>₹${p.price} <del>₹${p.originalPrice}</del></h4>
            </div>
            <button class="cart-add-btn" onclick="addToCart(${p.id})">
                <i class="fa-solid fa-cart-shopping"></i> Add
            </button>
        </div>
    `).join('');
}

// ==========================================
// 3. CART SYSTEM & UI UPDATE
// ==========================================
function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const mobBadge = document.getElementById('mobile-cart-badge');
    const itemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('bill-subtotal');
    const taxEl = document.getElementById('bill-tax');
    const totalEl = document.getElementById('cart-total-price');
    const payTotalEl = document.getElementById('pay-total-amount');

    const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
    if (badge) badge.innerText = totalItems;
    if (mobBadge) mobBadge.innerText = totalItems;

    localStorage.setItem('cart', JSON.stringify(cart));

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart-msg">Your shopping cart is empty!</p>';
        if (subtotalEl) subtotalEl.innerText = "₹0";
        if (taxEl) taxEl.innerText = "₹0";
        if (totalEl) totalEl.innerText = "₹0";
        if (payTotalEl) payTotalEl.innerText = "₹0";
        return;
    }

    itemsContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-drawer-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
            <div>
                <p style="font-weight:600; margin:0; font-size:14px;">${item.name}</p>
                <small style="color:#666;">₹${item.price} x ${item.quantity}</small>
            </div>
            <button onclick="removeFromCart(${idx})" style="border:none; background:none; color:red; cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = Math.round(subtotal * (discountPercent / 100));
    const finalPayable = subtotal - discount + tax + (subtotal > 999 ? 0 : 70);

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
    if (taxEl) taxEl.innerText = `₹${tax}`;
    if (totalEl) totalEl.innerText = `₹${finalPayable}`;
    if (payTotalEl) payTotalEl.innerText = `₹${finalPayable}`;
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    updateCartUI();
    toggleCartDrawer(true);
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// ==========================================
// 4. DRAWER & MODAL TOGGLES
// ==========================================
function toggleCartDrawer(show) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        if (show) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
}

window.openQuickView = function(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('modal-img').src = prod.img;
    document.getElementById('modal-brand').innerText = prod.brand;
    document.getElementById('modal-title').innerText = prod.name;
    document.getElementById('modal-price').innerText = `₹${prod.price}`;

    const addBtn = document.getElementById('modal-add-cart-btn');
    addBtn.onclick = () => {
        addToCart(prod.id);
        document.getElementById('quickview-modal').style.display = 'none';
    };

    document.getElementById('quickview-modal').style.display = 'flex';
};

// ==========================================
// 5. EVENT LISTENERS SETUP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();

    // Sliding Cart Open/Close
    document.getElementById('open-cart-btn')?.addEventListener('click', () => toggleCartDrawer(true));
    document.getElementById('mobile-cart-btn')?.addEventListener('click', () => toggleCartDrawer(true));
    document.getElementById('close-cart-btn')?.addEventListener('click', () => toggleCartDrawer(false));
    document.getElementById('cart-overlay')?.addEventListener('click', () => toggleCartDrawer(false));

    // Close Modals
    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        document.getElementById('quickview-modal').style.display = 'none';
    });

    document.getElementById('close-pay-modal')?.addEventListener('click', () => {
        document.getElementById('payment-modal').style.display = 'none';
    });

    // Proceed to UPI Button
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Aapka shopping bag khali hai!");
            return;
        }
        toggleCartDrawer(false);
        document.getElementById('payment-modal').style.display = 'flex';
    });

    // Coupon Code Apply
    document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
        const input = document.getElementById('coupon-input').value.trim();
        const msg = document.getElementById('coupon-message');
        if (input.toUpperCase() === 'CARA10') {
            discountPercent = 10;
            msg.style.color = 'green';
            msg.innerText = 'Promo applied: 10% Discount!';
            document.getElementById('discount-row').style.display = 'flex';
            updateCartUI();
        } else {
            msg.style.color = 'red';
            msg.innerText = 'Invalid Promo Code!';
        }
    });

    // ==========================================
    // 6. LIVE BACKEND & MONGODB ATLAS ORDER SAVE
    // ==========================================
    const confirmPayBtn = document.getElementById('confirm-payment-btn');
    if (confirmPayBtn) {
        confirmPayBtn.addEventListener('click', async () => {
            const rawPrice = document.getElementById('pay-total-amount')?.innerText || "0";
            const amount = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 804;
            const customerEmail = document.getElementById('pay-customer-email')?.value.trim() || "customer@cara.com";

            confirmPayBtn.innerText = "Processing...";
            confirmPayBtn.disabled = true;

            const orderPayload = {
                orderId: "CARA-" + Math.floor(100000 + Math.random() * 900000),
                customerEmail: customerEmail,
                items: cart.length > 0 ? cart : [{ name: "Classic Cotton White T-Shirt", price: 699, quantity: 1 }],
                totalAmount: amount
            };

            try {
                const response = await fetch("http://localhost:5000/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderPayload)
                });

                const data = await response.json();

                if (data.success) {
                    alert(`🎉 Order Placed Successfully!\nSaved in MongoDB Atlas!\nOrder ID: ${orderPayload.orderId}`);
                    cart = [];
                    updateCartUI();
                    document.getElementById('payment-modal').style.display = 'none';
                } else {
                    alert("Order save nahi ho paya!");
                }
            } catch (err) {
                console.error("Database connection error:", err);
                alert("❌ Backend se connection fail hua! Terminal me 'node server.js' verify karein.");
            } finally {
                confirmPayBtn.innerText = "Simulate Payment Success";
                confirmPayBtn.disabled = false;
            }
        });
    }
});