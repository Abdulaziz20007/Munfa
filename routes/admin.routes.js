const router = require("express").Router();
const {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");
const AdminGuard = require("../middlewares/admin.guard");

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", AdminGuard, logoutAdmin);
router.post("/refresh", AdminGuard, refreshAdminToken);

module.exports = router;
