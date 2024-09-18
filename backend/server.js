const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary")
const connectdb = require("./config/Database");
// Uncaugth Exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting Down The Server Due to Uncaugth Exception `);
  process.exit(1);
});
dotenv.config({ path: "backend/config/config.env" });
connectdb();
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET
})
const server = app.listen(process.env.PORT, () => {
  console.log(`Your Port is Running On ${process.env.PORT}`);
});
// Unhandled Event Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting Down The Server Due to unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
// Things To Understand
// 1) Error Handeling Class
