const router = require("express").Router();
const {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");
const AdminGuard = require("../middlewares/admin.guard");

const {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserPassword,
  updateUserPassword,
} = require("../controllers/adminUser.controller");

const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrderByAdmin,
} = require("../controllers/adminOrder.controller");

const {
  getProducts,
  getProductById,
} = require("../controllers/product.controller");

router.post("/create", AdminGuard, createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);

router.get("/user", AdminGuard, getUsers);
router.get("/user/:id", AdminGuard, getUserById);
router.put("/user/:id", AdminGuard, updateUserById);
router.get("/user/:id/password", AdminGuard, getUserPassword);
router.put("/user/:id/password", AdminGuard, updateUserPassword);
router.delete("/user/:id", AdminGuard, deleteUserById);

router.get("/product", AdminGuard, getProducts);
router.get("/product/:id", AdminGuard, getProductById);

router.get("/order", AdminGuard, getOrders);
router.get("/order/:id", AdminGuard, getOrderById);
router.put("/order/:id/cancel", AdminGuard, cancelOrderByAdmin);

module.exports = router;
