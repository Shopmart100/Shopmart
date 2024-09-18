const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserdetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../Controllers/UserController");
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/Auth");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/myAccount").get(isAuthenticatedUser, getUserdetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/MyAc/update").put(isAuthenticatedUser,updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser);
module.exports = router;
