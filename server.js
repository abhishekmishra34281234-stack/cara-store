require('dotenv').config(); // .env se password load karne ke liye
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Frontend se aane wale data ke liye middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection URI (.env file se aayegi)
const MONGO_URI = process.env.MONGO_URI;

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("--------------------------------------------------");
        console.log("✅ Live MongoDB Atlas Database Connected Successfully!");
        console.log("--------------------------------------------------");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

// Order Schema (Database Structure)
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerEmail: { type: String, default: "customer@cara.com" },
    items: Array,
    totalAmount: Number,
    paymentStatus: { type: String, default: "Paid" },
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Home route to verify server is running
app.get('/', (req, res) => {
    res.send("🚀 Cara Backend Server chal raha hai!");
});

// Naya Order Save Karne Ka Route (POST)
app.post('/api/orders', async (req, res) => {
    try {
        const { orderId, customerEmail, items, totalAmount } = req.body;
        const newOrder = new Order({
            orderId,
            customerEmail,
            items,
            totalAmount
        });
        await newOrder.save();
        console.log(`📦 Naya Order Database me Save Hua: ${orderId} | Total: ₹${totalAmount}`);
        res.status(201).json({ success: true, message: "Order MongoDB me save ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Purane Orders Dekhne Ka Route (GET)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`🚀 Server chalu hai: http://localhost:${PORT}`);
});