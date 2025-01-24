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
} = require("../controllers/adminUser.controller");

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", AdminGuard, logoutAdmin);
router.post("/refresh", AdminGuard, refreshAdminToken);

router.get("/users", AdminGuard, getUsers);
router.get("/users/:id", AdminGuard, getUserById);
router.put("/users/:id", AdminGuard, updateUserById);
router.delete("/users/:id", AdminGuard, deleteUserById);

module.exports = router;
