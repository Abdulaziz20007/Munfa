const Order = require("../schemas/Order");
const Product = require("../schemas/Product");
const { errorHandler } = require("../helpers/error_handler");

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );
    res.status(200).send(orders);
  } catch (error) {
    errorHandler(error, res);
  }
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address, comment } = req.body;
    let total = 0;
    const products = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .send({ msg: `Mahsulot topilmadi ${item.productId}` });
        }

        return {
          product: item.productId,
          quantity: item.quantity,
          priceAtOrder: product.price,
        };
      })
    );

    products.forEach((product) => {
      total += product.priceAtOrder * product.quantity;
    });

    const order = await Order.create({
      user: userId,
      products,
      total,
      address,
      comment,
    });

    res.status(201).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

const cancelOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .send({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled by user";
    await order.save();

    res.status(200).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  cancelOrderById,
};
