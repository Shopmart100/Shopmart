const ErrorHandler = require("../Utils/errorhandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  // Wrong MongoDb id Error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // Dupalicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong JWT TOKEN ERROR
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid please try again later`;
    err = new ErrorHandler(message, 400);
  }
  // JWT EXPIRE  ERROR
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired , Login Again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
