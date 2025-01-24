const Order = require("../schemas/Order");
const { errorHandler } = require("../helpers/error_handler");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.status(200).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = { getOrders, getOrderById, updateOrderStatus };
