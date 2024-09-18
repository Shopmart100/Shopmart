const ErrorHandler = require("../Utils/errorhandler");
const catchAsyncError = require("./CatchAsyncError")
const jwt =  require("jsonwebtoken")
const User = require("../models/Usermodel")
exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({ success: false})
    }
    const decodeddata = jwt.verify(token, process.env.JWT_SECRET)
   req.user = await User.findById(decodeddata.id)
   next()
})
exports.authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403))
        }
        next()
    }
}