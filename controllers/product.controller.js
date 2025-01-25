const Product = require("../schemas/Product");
const { errorHandler } = require("../helpers/error_handler");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ deleted: false });
    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { getProducts, getProductById };
