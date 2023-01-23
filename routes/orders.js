const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders");

router.route("/orders").get(getAllOrders).post(createOrder);

router
  .route("/orders/:id")
  .get(getSingleOrder)
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;
