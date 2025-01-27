const Order = require("../schemas/Order");
const User = require("../schemas/User");
const Product = require("../schemas/Product");
const { errorHandler } = require("../helpers/error_handler");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.status(200).send(orders);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOrderByOrderNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate("user")
      .populate("products.product");
    res.status(200).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("products.product");

    if (req.body.status === "sold") {
      // Check if any product would go negative
      const missingProducts = [];
      for (const orderProduct of order.products) {
        const product = orderProduct.product;
        const newQuantity = product.stock - orderProduct.quantity;
        if (newQuantity < 0) {
          missingProducts.push({
            name: product.name,
            requested: orderProduct.quantity,
            available: product.stock,
          });
        }
      }

      if (missingProducts.length > 0) {
        return res.status(400).json({
          message: "Not enough products in stock",
          missingProducts,
        });
      }

      // Update product quantities
      for (const orderProduct of order.products) {
        const product = orderProduct.product;
        await Product.findByIdAndUpdate(product._id, {
          $inc: { stock: -orderProduct.quantity },
        });
      }
    }

    order.status = req.body.status;
    await order.save();

    const updatedOrder = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).populate("products.product");
    res.status(200).send(updatedOrder);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getOrders,
  getOrderByOrderNumber,
  updateOrderStatus,
};
