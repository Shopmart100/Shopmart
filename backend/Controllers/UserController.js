const ErrorHandler = require("../Utils/errorhandler");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const User = require("../models/Usermodel");
const sendToken = require("../Utils/jwttoken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
//Register A User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.files.avatar.tempFilePath; 
  const mycloud = await cloudinary.v2.uploader.upload(file, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  sendToken(user, 200, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Plese Enter Email And Password", 401));
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password"));
  }
  const ispasswordMatched = await user.comparePassword(password);
  if (!ispasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }
  sendToken(user, 200, res);
});
// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
// ForGot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("Email is Incorrect", 404));
  }
  // Get Reset Password Token
  const resettoken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `http://localhost:3000/password/reset/${resettoken}`;
  const message = `Your Password Reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please Ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Shopnest Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email Sent To ${user.email} Successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpier = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpier: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expire",
        404
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password dosent match", 404));
  }
  user.password = req.body.password;
  (user.resetPasswordToken = undefined), (user.resetPasswordExpier = undefined);
  await user.save();
  sendToken(user, 200, res);
});
// Get User Deatails
exports.getUserdetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if(!user){
    return next(new ErrorHandler("User is not login yet"))
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// Update Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const ispasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!ispasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("confirm password dosent match", 404));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
// Update Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar !== undefined) {
    const user = await User.findById(req.user.id);
    const imgId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imgId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});
// For Getting All User
exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// For Getting Signle Users Admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist width Id: ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: false,
    useFindAndModify: false,
  });
  if (!user) {
    return next(new ErrorHandler(`User Not Found`));
  }
  res.status(200).json({
    success: true,
  });
});

// Delete User  Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User does not exist with ${req.params.id}`));
  }
  const imgId = user.avatar.public_id
  await cloudinary.v2.uploader.destroy(imgId)
  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
