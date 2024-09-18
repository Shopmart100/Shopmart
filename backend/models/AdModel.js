const mongoose = require('mongoose')
const Adschema = new mongoose.Schema({
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
    adtype:{
     type: String,
     required: true
    },
    advaltype:{
        type: String,
        required: true
    },
    storename:{
        type: String,
    },
    valuediscount:{
        type: String,
    },
    valuecategory:{
     type: String
    },
    valueSubcategory:{
        type: String
    },
    valuelabel:{
        type: String
    },
    redirect:{
        type: String,
    }
})
module.exports = mongoose.model("Admodel", Adschema);