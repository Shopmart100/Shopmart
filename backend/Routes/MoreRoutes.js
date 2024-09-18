const express = require("express");
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/Auth");
const { CreateCategory, updateCategory, deleteCategory, getCategories } = require("../Controllers/CategoryController");
const { createAd, getAds, updateAd, deleteAd } = require("../Controllers/AdController");
const { createPosterDeal, createPosterInfo, getPosterInfo, updatePosterInfo, DeletePosterInfo, createRequestSeller } = require("../Controllers/MoreController");
const Router = express.Router()
Router.route("/admin/createCatgory").post(isAuthenticatedUser, authorizedRoles("admin"), CreateCategory)
Router.route("/getCategories").get(getCategories)
Router.route("/admin/updateCategory/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updateCategory)
Router.route("/admin/deleteCategory/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteCategory)
Router.route("/admin/createAd").post(isAuthenticatedUser, authorizedRoles("admin"), createAd)
Router.route("/getAds").get(getAds)
Router.route("/admin/updateAd/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updateAd)
Router.route("/admin/deleteAd/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteAd)
Router.route("/admin/createPosterInfo").post(isAuthenticatedUser, authorizedRoles("admin"), createPosterInfo)
Router.route("/getPosterInfo").get(getPosterInfo)
Router.route("/admin/UpdatePosterInfo/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updatePosterInfo)
Router.route("/admin/DeletePosterInfo/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), DeletePosterInfo)
Router.route("/RequestSeller").post(isAuthenticatedUser, createRequestSeller)
module.exports = Router;