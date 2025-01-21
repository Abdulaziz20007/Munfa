const Product = require("../schemas/Product");

const getProducts = async (req, res) => {
  const products = await Product.find({ deleted: false });
  res.status(200).send(products);
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.status(200).send(product);
};

module.exports = { getProducts, getProduct };
