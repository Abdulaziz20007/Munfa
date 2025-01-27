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
  getOrderByOrderNumber,
  updateOrderStatus,
} = require("../controllers/adminOrder.controller");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} = require("../controllers/adminProduct.controller");

const { dashboard } = require("../controllers/adminCleverReqs.controller");
const upload = require("../middlewares/upload");

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
router.post("/product", AdminGuard, upload.array("photos", 5), createProduct);
router.put(
  "/product/:id",
  AdminGuard,
  upload.array("photos", 5),
  updateProductById
);
router.delete("/product/:id", AdminGuard, deleteProductById);

router.get("/order", AdminGuard, getOrders);
router.get("/order/:orderNumber", AdminGuard, getOrderByOrderNumber);
router.put("/order/:orderNumber/status", AdminGuard, updateOrderStatus);

router.get("/dashboard", dashboard);

module.exports = router;
