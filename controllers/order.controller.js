const Order = require("../schemas/Order");
const Product = require("../schemas/Product");
const { errorHandler } = require("../helpers/error_handler");
const { sendOrderMessage } = require("../service/sendBot");
const User = require("../schemas/User");

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

    // Check product stock levels first
    const stockCheck = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          return {
            error: true,
            msg: `Mahsulot topilmadi ${item.productId}`,
          };
        }
        if (item.quantity > product.stock) {
          return {
            error: true,
            msg: `${product.name} mahsuloti uchun yetarli miqdor mavjud emas. So'ralgan: ${item.quantity}, Mavjud: ${product.stock}`,
          };
        }
        return {
          error: false,
          product,
          quantity: item.quantity,
        };
      })
    );

    // Check if any products had errors
    const stockError = stockCheck.find((result) => result.error);
    if (stockError) {
      return res.status(400).send({ msg: stockError.msg });
    }

    const products = stockCheck.map(({ product, quantity }) => ({
      product: product._id,
      quantity: quantity,
      priceAtOrder: product.price,
    }));

    products.forEach((product) => {
      total += product.priceAtOrder * product.quantity;
    });

    const user = await User.findById(userId);
    const orderNumber =
      (
        (await Order.findOne()
          .sort({ orderNumber: -1 })
          .limit(1)
          .select("orderNumber")
          .lean()) || { orderNumber: 0 }
      ).orderNumber + 1;

    const order = await Order.create({
      orderNumber,
      user: userId,
      userName: user.name,
      userSurname: user.surname,
      userPhone: user.phone,
      products,
      total,
      address,
      comment,
    });

    const newOrder = await Order.findById(order._id).populate([
      { path: "products.product" },
      { path: "user" },
    ]);

    await sendOrderMessage(newOrder);

    res.status(201).send(newOrder);
  } catch (error) {
    errorHandler(error, res);
  }
};

const cancelOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
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

const updateCommentAndAddress = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { comment, address } = req.body;
    if (!comment && !address) {
      return res.status(400).send({ msg: "Izoh va manzil kiritilishi shart" });
    }
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { comment, address },
      { new: true }
    );
    res.status(200).send(order);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  cancelOrderById,
  updateCommentAndAddress,
};
