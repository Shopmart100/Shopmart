const mongoose = require("mongoose");
const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  value: {
    type: String,
    required: true,
  },
  subcategories: [
    {
      subcategoryname: {
        type: String,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("Categories", categoriesSchema);
