const router = require("express").Router();
const {
  identify,
  create,
  register,
  authenticate,
  logoutUser,
  refreshUserToken,
  requestOtp,
  verifyOtp,
  changePassword,
  updateUser,
} = require("../controllers/user.controller");
const UserGuard = require("../middlewares/user.guard");

router.post("/identify", identify);
router.post("/create", create);
router.post("/register", register);
router.post("/login", authenticate);
router.post("/logout", logoutUser);
router.post("/refresh", refreshUserToken);
router.post("/send", requestOtp);
router.post("/verify", verifyOtp);
router.post("/change", UserGuard, changePassword);
router.post("/update", UserGuard, updateUser);

module.exports = router;
