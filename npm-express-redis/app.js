import express from 'express';
import mongoose from 'mongoose';

const mongoConStr = "mongodb://localhost:27017/testdb";
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
const products = mongoose.model("products", productSchema);

app.get("/api/products", async (req, res) => {
  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  const productData = await products.find(query);
  res.json(productData);
});

app.listen(4000, () => console.log("local app server listening on 4000"));
