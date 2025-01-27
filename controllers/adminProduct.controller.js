const Product = require("../schemas/Product");
const { errorHandler } = require("../helpers/error_handler");
const fs = require("fs");
const path = require("path");

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
    // Get uploaded file paths
    const imagePaths = req.files
      ? req.files.map((file) => `uploads/${file.filename}`)
      : [];

    // Create product with image paths
    const product = await Product.create({
      ...req.body,
      images: imagePaths,
    });

    res.status(201).send(product);
  } catch (error) {
    // If error occurs, delete uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    errorHandler(error, res);
  }
};

const updateProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ msg: "Mahsulot topilmadi" });
    }

    // If new images are uploaded, delete old ones
    if (req.files && req.files.length > 0) {
      // Delete old images
      if (product.images && product.images.length > 0) {
        product.images.forEach((imagePath) => {
          fs.unlink(path.join(__dirname, "..", imagePath), (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        });
      }

      // Add new image paths
      req.body.images = req.files.map((file) => `uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    // If error occurs, delete uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    errorHandler(error, res);
  }
};

const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ msg: "Mahsulot topilmadi" });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach((imagePath) => {
        fs.unlink(path.join(__dirname, "..", imagePath), (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Mahsulot o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
