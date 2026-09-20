// Product Data
const products = [
    { id: 1, name: "Cartoon Astronaut T-Shirt", price: 499, image: "https://i.postimg.cc/850xMZ64/f1.jpg", brand: "adidas" },
    { id: 2, name: "Tropical Print Hawaiian Shirt", price: 699, image: "https://i.postimg.cc/BvY78kZj/f2.jpg", brand: "adidas" },
    { id: 3, name: "Vintage Floral Summer Shirt", price: 599, image: "https://i.postimg.cc/4442Wj27/f3.jpg", brand: "adidas" },
    { id: 4, name: "White Floral Casual Shirt", price: 549, image: "https://i.postimg.cc/2jh40xMw/f4.jpg", brand: "adidas" },
    { id: 5, name: "Navy Blue Floral Print Shirt", price: 649, image: "https://i.postimg.cc/mDybvN2n/f5.jpg", brand: "adidas" },
    { id: 6, name: "Corduroy Dual Pocket Jacket", price: 1299, image: "https://i.postimg.cc/kgvW302W/f6.jpg", brand: "adidas" },
    { id: 7, name: "Casual Khaki Chino Pants", price: 899, image: "https://i.postimg.cc/8zDx4Mct/f7.jpg", brand: "adidas" },
    { id: 8, name: "Cat Pattern Linen Blouse", price: 499, image: "https://i.postimg.cc/90Gvj8r5/f8.jpg", brand: "adidas" }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cara_cart')) || [];

// Render Products
function renderProducts() {
    const container = document.getElementById('product-container');
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
            <a href="javascript:void(0)" onclick="addToCart(${product.id})" class="cart-btn"><i class="fal fa-shopping-cart cart"></i></a>
        </div>
    `).join('');
}

// Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification(`${product.name} cart me add ho gaya!`);
}

// Update Cart State & LocalStorage
function updateCart() {
    localStorage.setItem('cara_cart', JSON.stringify(cart));
    updateCartCount();
    renderCartTable();
}

// Cart Icon Badge Counter
function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// Render Cart Table on Cart Page / Modal
function renderCartTable() {
    const tbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-subtotal');
    if (!tbody) return;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Aapka Cart Khali Hai!</td></tr>`;
        if (totalEl) totalEl.innerText = "₹0";
        return;
    }

    let subtotal = 0;
    tbody.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <tr>
                <td><a href="javascript:void(0)" onclick="removeFromCart(${index})"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt="" style="width: 50px;"></td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td><input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${index}, this.value)" style="width: 50px;"></td>
                <td>₹${itemTotal}</td>
            </tr>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = `₹${subtotal}`;
}

// Quantity Change
function changeQuantity(index, newQty) {
    const qty = parseInt(newQty);
    if (qty > 0) {
        cart[index].quantity = qty;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

// Remove Single Item
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Live Backend Database Checkout Integration
async function checkoutOrder() {
    if (cart.length === 0) {
        alert("Aapka cart khali hai! Pehle product add kijiye.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = {
        orderId: "ORD-" + Date.now(),
        customerEmail: "customer@cara.com",
        items: cart,
        totalAmount: totalAmount
    };

    try {
        // Render Live Cloud Backend URL
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
        } else {
            alert("Order save karne me problem aayi: " + result.error);
        }
    } catch (error) {
        console.error("Checkout Error:", error);
        alert("Server connect nahi ho paya. Render backend chalu ho raha hai, 30 seconds baad dobara try karein.");
    }
}

// Simple Toast Notification
function showNotification(msg) {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#088178';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.zIndex = '1000';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    renderCartTable();

    // Checkout button listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkoutOrder);
    }
});