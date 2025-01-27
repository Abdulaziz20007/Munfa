const router = require("express").Router();
const {
  getProducts,
  getProductById,
  getProductsByIds,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.post("/ids", getProductsByIds);
router.get("/:id", getProductById);

module.exports = router;
