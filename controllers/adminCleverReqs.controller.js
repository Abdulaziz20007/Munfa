const Order = require("../schemas/Order");
const Product = require("../schemas/Product");
const User = require("../schemas/User");

const dashboard = async (req, res) => {
  const orders = await Order.find({});
  const products = await Product.find({});
  const users = await User.find({});

  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
  const fiveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const fourMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 4, 1);
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate profits and orders for each month
  const profitSixMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= sixMonthsAgo &&
      orderDate < fiveMonthsAgo &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitFiveMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= fiveMonthsAgo &&
      orderDate < fourMonthsAgo &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitFourMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= fourMonthsAgo &&
      orderDate < threeMonthsAgo &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitThreeMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= threeMonthsAgo &&
      orderDate < twoMonthsAgo &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitTwoMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= twoMonthsAgo &&
      orderDate < oneMonthAgo &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitOneMonthAgo = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= oneMonthAgo &&
      orderDate < thisMonthStart &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitThisMonth = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thisMonthStart &&
      orderDate <= today &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const profitPersent = (
    profitOneMonthAgo === 0
      ? profitThisMonth > 0
        ? 100
        : 0
      : ((profitThisMonth - profitOneMonthAgo) / profitOneMonthAgo) * 100
  ).toFixed(2);

  const currentMonthSoldTotal = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thisMonthStart &&
      orderDate <= today &&
      order.status === "sold"
      ? acc + order.total
      : acc;
  }, 0);

  const currentMonthPendingTotal = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thisMonthStart &&
      orderDate <= today &&
      order.status === "pending"
      ? acc + order.total
      : acc;
  }, 0);

  const currentMonthCancelledTotal = orders.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thisMonthStart &&
      orderDate <= today &&
      (order.status === "cancelled by admin" ||
        order.status === "cancelled by user")
      ? acc + order.total
      : acc;
  }, 0);

  const totalSoldAmount = orders.reduce((acc, order) => {
    return order.status === "sold" ? acc + order.total : acc;
  }, 0);
  const totalPendingAmount = orders.reduce((acc, order) => {
    return order.status === "pending" ? acc + order.total : acc;
  }, 0);
  const totalCancelledAmount = orders.reduce((acc, order) => {
    return order.status === "cancelled by admin" ||
      order.status === "cancelled by user"
      ? acc + order.total
      : acc;
  }, 0);

  // Calculate users for each month
  const usersSixMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= sixMonthsAgo && createdAt < fiveMonthsAgo;
  }).length;

  const usersFiveMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= fiveMonthsAgo && createdAt < fourMonthsAgo;
  }).length;

  const usersFourMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= fourMonthsAgo && createdAt < threeMonthsAgo;
  }).length;

  const usersThreeMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= threeMonthsAgo && createdAt < twoMonthsAgo;
  }).length;

  const usersTwoMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= twoMonthsAgo && createdAt < oneMonthAgo;
  }).length;

  const usersOneMonthAgo = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= oneMonthAgo && createdAt < thisMonthStart;
  }).length;

  const usersThisMonth = users.filter((user) => {
    const createdAt = new Date(user.createdAt);
    return createdAt >= thisMonthStart && createdAt <= today;
  }).length;

  const usersPersent = (
    usersOneMonthAgo === 0
      ? usersThisMonth > 0
        ? 100
        : 0
      : ((usersThisMonth - usersOneMonthAgo) / usersOneMonthAgo) * 100
  ).toFixed(2);

  const activeUsers = users.filter((user) => user.isVerified).length;
  const deactiveUsers = users.filter((user) => !user.isVerified).length;

  // Calculate products for each month
  const productsSixMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= sixMonthsAgo && createdAt < fiveMonthsAgo;
  }).length;

  const productsFiveMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= fiveMonthsAgo && createdAt < fourMonthsAgo;
  }).length;

  const productsFourMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= fourMonthsAgo && createdAt < threeMonthsAgo;
  }).length;

  const productsThreeMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= threeMonthsAgo && createdAt < twoMonthsAgo;
  }).length;

  const productsTwoMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= twoMonthsAgo && createdAt < oneMonthAgo;
  }).length;

  const productsOneMonthAgo = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= oneMonthAgo && createdAt < thisMonthStart;
  }).length;

  const productsThisMonth = products.filter((product) => {
    const createdAt = new Date(product.createdAt);
    return createdAt >= thisMonthStart && createdAt <= today;
  }).length;

  const productsPersent = (
    productsOneMonthAgo === 0
      ? productsThisMonth > 0
        ? 100
        : 0
      : ((productsThisMonth - productsOneMonthAgo) / productsOneMonthAgo) * 100
  ).toFixed(2);

  const deletedProducts = products.filter((product) => product.deleted).length;
  const activeProducts = products.filter((product) => !product.deleted).length;
  const outOfStockProducts = products.filter(
    (product) => product.stock <= 0 && !product.deleted
  ).length;
  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 10 && !product.deleted
  ).length;
  const inStockProducts = products.filter(
    (product) => product.stock > 10 && !product.deleted
  ).length;

  // Calculate orders for each month
  const ordersSixMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= sixMonthsAgo && createdAt < fiveMonthsAgo;
  }).length;

  const ordersFiveMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= fiveMonthsAgo && createdAt < fourMonthsAgo;
  }).length;

  const ordersFourMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= fourMonthsAgo && createdAt < threeMonthsAgo;
  }).length;

  const ordersThreeMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= threeMonthsAgo && createdAt < twoMonthsAgo;
  }).length;

  const ordersTwoMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= twoMonthsAgo && createdAt < oneMonthAgo;
  }).length;

  const ordersOneMonthAgo = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= oneMonthAgo && createdAt < thisMonthStart;
  }).length;

  const ordersThisMonth = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= thisMonthStart && createdAt <= today;
  }).length;

  const ordersPersent = (
    ordersOneMonthAgo === 0
      ? ordersThisMonth > 0
        ? 100
        : 0
      : ((ordersThisMonth - ordersOneMonthAgo) / ordersOneMonthAgo) * 100
  ).toFixed(2);

  const soldOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= thisMonthStart &&
      orderDate <= today &&
      order.status === "sold"
    );
  }).length;
  const pendingOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= thisMonthStart &&
      orderDate <= today &&
      order.status === "pending"
    );
  }).length;
  const cancelledOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate >= thisMonthStart &&
      orderDate <= today &&
      (order.status === "cancelled by admin" ||
        order.status === "cancelled by user")
    );
  }).length;

  const totalSoldOrders = orders.filter((order) => {
    return order.status === "sold";
  }).length;
  const totalPendingOrders = orders.filter((order) => {
    return order.status === "pending";
  }).length;
  const totalCancelledOrders = orders.filter((order) => {
    return (
      order.status === "cancelled by admin" ||
      order.status === "cancelled by user"
    );
  }).length;

  res.status(200).send({
    allProducts: products.length,
    allUsers: users.length,
    allOrders: orders.length,
    profit: {
      profitSixMonthAgo,
      profitFiveMonthAgo,
      profitFourMonthAgo,
      profitThreeMonthAgo,
      profitTwoMonthAgo,
      profitOneMonthAgo,
      profitThisMonth,
      profitPersent,
      currentMonthSoldTotal,
      currentMonthPendingTotal,
      currentMonthCancelledTotal,
      totalSoldAmount,
      totalPendingAmount,
      totalCancelledAmount,
    },
    users: {
      usersSixMonthAgo,
      usersFiveMonthAgo,
      usersFourMonthAgo,
      usersThreeMonthAgo,
      usersTwoMonthAgo,
      usersOneMonthAgo,
      usersThisMonth,
      usersPersent,
      activeUsers,
      deactiveUsers,
    },
    products: {
      productsSixMonthAgo,
      productsFiveMonthAgo,
      productsFourMonthAgo,
      productsThreeMonthAgo,
      productsTwoMonthAgo,
      productsOneMonthAgo,
      productsThisMonth,
      productsPersent,
      deletedProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      inStockProducts,
    },
    orders: {
      ordersSixMonthAgo,
      ordersFiveMonthAgo,
      ordersFourMonthAgo,
      ordersThreeMonthAgo,
      ordersTwoMonthAgo,
      ordersOneMonthAgo,
      ordersThisMonth,
      ordersPersent,
      soldOrders,
      pendingOrders,
      cancelledOrders,
      totalSoldOrders,
      totalPendingOrders,
      totalCancelledOrders,
    },
  });
};

module.exports = { dashboard };
