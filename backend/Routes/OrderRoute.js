const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/Auth");
const {
  newOrder,
  GetsingleOrder,
  getmyOrder,
  getAllOrders,
  UpdateOrderStatus,
  DeleteOrder,
  CencelOrder,
} = require("../Controllers/OrderController");
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), GetsingleOrder);
router.route("/myorders").get(isAuthenticatedUser, getmyOrder);
router
  .route("/admin/orders/")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), UpdateOrderStatus)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), DeleteOrder);
router.route("/cencelOrder/:orderId/:productId").put(isAuthenticatedUser, CencelOrder);
module.exports = router;
