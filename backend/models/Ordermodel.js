const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    Address: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    Zipcode: {
      type: Number,
      required: true,
    },
    PopularPlaceNear:{
      type: String,
      required: false
    },
    Name:{
      type: String,
      required: true,
    },
    Email:{
      type: String,
      required: true,
    },
    Phoneno:{
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      orderCenceled:{
        type:Boolean,
        required:true,
        default: false,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentMethod: {
    type :String,
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice:{
    type: Number,
    required: true,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);