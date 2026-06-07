import utils from "./utils.js";

const getAllProducts = (connectionContext) => async (req, res) => {
  const {
    redisConn,
    mongoose,
  } = connectionContext;
  const redisCacheKey = utils.generateRedisCacheKey(req);
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
  const products = utils.getProductModal(mongoose);
  const productData = await products.find(query);
  if (productData) {
    await redisConn.set(redisCacheKey, JSON.stringify(productData));
  }
  res.json(productData);
};

const updateProductById = (connectionContext) => async (req, res) => {
  const {
    redisConn,
    mongoose,
  } = connectionContext;
  const products = utils.getProductModal(mongoose);
  const productId = req.params.id;
  const updateData = req.body;
  const updatedProduct = await products.findByIdAndUpdate(productId, {$set: updateData}, {new: true});
  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "product not found"
    });
  }
  const listCacheKey = "api:products*";
  const keys = await redisConn.keys(listCacheKey);
  if (keys.length > 0) {
    await redisConn.del(keys);
  }
  res.json({
    success: true,
    message: "product updated successfully"
  });
};

const products = {
  getAllProducts,
  updateProductById
};
export default products;
