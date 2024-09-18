const express = require("express");
const app = express();
const errorMiddleware = require("./Middleware/Error");
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
dotenv.config({path: "backend/config/config.env"})
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  }));
// Middle Ware For Error
// Using Produts Routes
const productsRoute = require("./Routes/ProductRoute");
const userRoute = require("./Routes/UserRoute");
const OrderRoute = require("./Routes/OrderRoute");
const PaymentRoute = require("./Routes/PaymentRoute");
const Moreroute = require("./Routes/MoreRoutes");
app.use("/api/shopnest", productsRoute);
app.use("/api/shopnest", userRoute);
app.use("/api/shopnest", OrderRoute);
app.use("/api/shopnest", PaymentRoute);
app.use("/api/shopnest", Moreroute);
app.use(errorMiddleware);
module.exports = app;
     