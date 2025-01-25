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

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(product);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProductById = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Mahsulot o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProductById, deleteProductById };
