const mongoose = require('mongoose')
// Model For PosterDeals
const PosterInfo = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    redirect: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    isDeal: {
        type: Boolean,
        required: true,
    },
    label:{
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true
        },
    createdAt: {
          type: Date,
          default: Date.now(),
    },
})
// For Store
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image:{
        public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true
        },
    createdAt: {
          type: Date,
          default: Date.now(),
    },
})
const sellerRequest = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
    },
    bussinessName:{
        type: String,
        required: true,
    },
    bussinessType:{
        type: String,
        required: true,
    },
    productsCategory:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    createdAt: {
          type: Date,
          default: Date.now(),
    },
})
module.exports = {
    Storemodel: mongoose.model("Store", storeSchema),
    PosterInfomodel: mongoose.model("PosterInfo", PosterInfo),
    sellerRequestModel: mongoose.model("sellerRequest", sellerRequest)
};