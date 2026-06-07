import express from 'express';
import mongoose from 'mongoose';
import {createClient} from 'redis';

const mongoConStr = "mongodb://localhost:27017/testdb";
// const mongoConStr = "mongodb://localhost:27017/node_cache?authSource=admin"
const app = express();
const redisConn = await createClient()
  .on("error", (err) => console.log("redis client error", err))
  .connect(); //connecting on default port

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
  const redisCacheKey = generateRedisCacheKey(req);
  const cachedProducts = await redisConn.get(redisCacheKey);
  if (cachedProducts) {
    console.log("cache hit for " + redisCacheKey);
    res.json(JSON.parse(cachedProducts));
    return;
  }
  console.log("cache miss for " + redisCacheKey);
  const query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  const productData = await products.find(query);
  if (productData) {
    await redisConn.set(redisCacheKey, JSON.stringify(productData));
  }
  res.json(productData);
});

const generateRedisCacheKey = (req) => {
  const baseUrl = req.path.replace(/^\/+|\/+$/g, "").replace(/\//g, ":");
  const params = req.query;
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
  return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
};

app.listen(4000, () => console.log("local app server listening on 4000"));
