const router = require("express").Router();
const userRoutes = require("./user.routes");
const productRoutes = require("./product.routes");
const adminRoutes = require("./admin.routes");

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
