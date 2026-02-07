import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  weight: String,
  rating: Number,
  inStock: Boolean
});

export default mongoose.model("Product", productSchema);

