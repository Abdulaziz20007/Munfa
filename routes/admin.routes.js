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

router.post("/create", AdminGuard, createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);

router.get("/users", AdminGuard, getUsers);
router.get("/users/:id", AdminGuard, getUserById);
router.put("/users/:id", AdminGuard, updateUserById);
router.get("/users/:id/password", AdminGuard, getUserPassword);
router.put("/users/:id/password", AdminGuard, updateUserPassword);
router.delete("/users/:id", AdminGuard, deleteUserById);

module.exports = router;
