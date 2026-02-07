import { Router } from "express";
import Order from "../models/order.model";

const router = Router();

// Create Order
router.post("/", async (req, res) => {
    const order = await Order.create(req.body);
    res.json(order);
});

// Get all orders
router.get("/", async (_, res) => {
    const orders = await Order.find();
    res.json(orders);
});

export default router;
