const router = require("express").Router();
const {
  identify,
  register,
  authenticate,
  logoutUser,
  refreshUserToken,
  requestOtp,
  verifyOtp,
  changePassword,
  updateUser,
  getUserById,
} = require("../controllers/user.controller");
const UserGuard = require("../middlewares/user.guard");

const {
  createOrder,
  cancelOrderById,
  getMyOrders,
  updateCommentAndAddress,
} = require("../controllers/order.controller");

router.post("/identify", identify);
router.post("/register", register);
router.post("/login", authenticate);
router.post("/logout", logoutUser);
router.post("/refresh", refreshUserToken);
router.post("/send", requestOtp);
router.post("/verify", verifyOtp);
router.post("/change", UserGuard, changePassword);
router.post("/update", UserGuard, updateUser);
router.get("/me", UserGuard, getUserById);

router.get("/order", UserGuard, getMyOrders);
router.post("/order", UserGuard, createOrder);
router.put("/order/:orderNumber/cancel", UserGuard, cancelOrderById);
router.put("/order/:orderNumber/update", UserGuard, updateCommentAndAddress);

module.exports = router;
