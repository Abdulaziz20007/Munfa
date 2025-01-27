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

const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).send({ error: "Invalid IDs format" });
    }

    const mongoose = require("mongoose");
    const validIds = ids
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (!validIds.length) {
      return res.status(400).send({ error: "No valid IDs" });
    }

    const products = await Product.find({
      _id: { $in: validIds },
      deleted: false,
    });
    if (!products.length) {
      return res.status(404).send({ error: "Products not found" });
    }

    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { getProducts, getProductById, getProductsByIds };
