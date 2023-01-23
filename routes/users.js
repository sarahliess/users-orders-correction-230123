const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUserOrders,
  setUserInactive,
} = require("../controllers/users");

router.route("/users").get(getAllUsers).post(createUser);
router
  .route("/users/:id")
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

router.route("/users/:id/orders").get(getAllUserOrders);

router.route("/users/:id/check-inactive").put(setUserInactive);

module.exports = router;
