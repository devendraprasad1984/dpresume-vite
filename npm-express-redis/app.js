import express from 'express';
import mongoose from 'mongoose';

const mongoConStr = "mongodb://localhost:27017";
// const mongoConStr = "mongodb://localhost:27017/node_cache?authSource=admin"
const app = express();
mongoose.connect(mongoConStr);
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  specs: Object
});
//insert data manually into mongodb and in get it in ProductModel
const Product = mongoose.model("Product", productSchema);

app.get("/api/product", async (req, res) => {
  const products = await Product.find();
  res.write(products);
});

app.listen(4000, () => console.log("local app server listening on 4000"));
