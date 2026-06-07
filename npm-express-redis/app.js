import express from 'express';
import mongoose from 'mongoose';
import {createClient} from 'redis';
import productApis from './products.js';

const mongoConStr = "mongodb://localhost:27017/testdb";
// const mongoConStr = "mongodb://localhost:27017/node_cache?authSource=admin"
const app = express();
const redisConn = await createClient()
  .on("error", (err) => console.log("redis client error", err))
  .connect(); //connecting on default port

mongoose.connect(mongoConStr);
const connectionContext = {
  redisConn,
  mongoose,
};
//insert data manually into mongodb and in get it in ProductModel
//api routes
app.get("/api/products", (req, res) => productApis.getAllProducts(connectionContext)(req, res));
app.put("/api/products/:id", (req, res) => productApis.updateProductById(connectionContext)(req, res));

app.listen(4000, () => console.log("local app server listening on 4000"));
