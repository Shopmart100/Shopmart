const Order = require("../models/Ordermodel");
const Productmodel = require("../models/productModels");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const ErrorHandler = require("../Utils/errorhandler");
// For Creating Orders
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
// For Getting Singel Order
exports.GetsingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order Not Found By this id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});
// For Getting UserOrders
exports.getmyOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new ErrorHandler("You have 0 orders", 404));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((curElem) => {
    totalAmount += curElem.totalPrice;
  });
  return res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update Order Status Admin
exports.UpdateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order Not Found By This id", 404));
  }
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("The Order Is Already Delivered"));
  }
  order.orderItems.forEach(async (curElem) => {
    await updateStock(curElem.product, curElem.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
  });
});
const updateStock = async (id, quantity) => {
  const product = await Productmodel.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
};
// Delete Order --Admin
exports.DeleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order Not Found By This id", 404));
  }
  await order.deleteOne();
  return res.status(200).json({
    success: true,
  });
});
// Cencel Order
exports.CencelOrder = catchAsyncError(async (req, res, next) => {
  const { orderId, productId } = req.params;

  // Find the order and update the specific orderItem's orderCenceled field
  const order = await Order.findOneAndUpdate(
    { _id: orderId, "orderItems.product": productId },
    { $set: { "orderItems.$[elem].orderCenceled": true } },
    { arrayFilters: [{ "elem.product": productId }], new: true }
  );

  if (!order) {
    return next(new ErrorHandler("Order not found or product not found in order", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order item has been canceled",
    order,
  });
});

