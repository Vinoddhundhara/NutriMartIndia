import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productId: String,
    quantity: Number,
    totalPrice: Number,
    user: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
