const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plese Enter Product Name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Plese Enter Product Price"],
    maxLength: [8, "Price Cannot Exceed 8 Characters"],
  },
  onSale:{
    type: Boolean,
    required: false,
  },
  oldPrice:{
    type: Number,
    required: false,
  },
  return:{
    type: String,
    required: false,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Plese Enter Product Category"],
  },
  subcategory: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  label: {
    type: String,
    required: false,
    default: "Others",
  },
  colors: [
    {
      colorname: {
        type: String,
        required:false
      },
      colorvalue: {
        type: String,
        required:false
      },
      otheroptsnotavalibel: {
        type: Array,
        required:false
      },
    },
  ],
  sizes: [
    {
      sizename: {
        type: String,
        required: false,
      },
      otheroptsnotavalibel: {
        type: Array,
        required:false
      },
    },
  ],
  moreoptions: [
    {
      filtername: {
        type: String,
        required: false,
      },
      filtervalues: [
        {
          valname: {
            type: String,
            required: false,
          },
          otheroptsnotavalibel: {
            type: Array,
          },
        },
      ],
    },
  ],
  variations: [
    {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: false
    },
  ],
  description:[
    {
      heading: {
        type: String,
        required: false,
      },
      paragraph:{
        type: String,
        required: false,
      }
    }
  ],
  points:[
    {
      point:{
          type: String,
          required: false
      }
    }
  ],
  specifications:[
    {
      key:{
        type: String,
        required: false
      },
      value:{
        type: String,
        required: false
      }
    }
  ],
  Totalstock: {
    type: Number,
    required: [true, "Plese Enter Product Stock"],
    maxLength: [4, "Product Stock Cannot Exceed 4 Characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      name: {
        type: String,
        require: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  topdeal:{
    type: String,
    required: false,
  },
  CreatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Product", productSchema);
