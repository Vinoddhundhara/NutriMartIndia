import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";

import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/contact", contactRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
