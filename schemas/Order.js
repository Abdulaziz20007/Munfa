const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    orderNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
    },
    userSurname: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtOrder: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "sold", "cancelled by user", "cancelled by admin"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;
