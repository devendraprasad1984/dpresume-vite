const generateRedisCacheKey = (req) => {
  const baseUrl = req.path.replace(/^\/+|\/+$/g, "").replace(/\//g, ":");
  const params = req.query;
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
  return sortedParams ? `${baseUrl}:${sortedParams}` : baseUrl;
};

const getProductModal = (mongoose) => {
  const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    specs: Object
  });
  return mongoose.model("products", productSchema);
};

const utils = {
  getProductModal,
  generateRedisCacheKey
};
export default utils;