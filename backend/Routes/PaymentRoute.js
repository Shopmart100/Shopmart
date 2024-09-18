const express = require('express')
const router = express.Router()
const {isAuthenticatedUser, authorizedRoles} = require("../Middleware/Auth")
const { processPayment, sendStripeApiKey } = require('../Controllers/PaymentController')
router.route("/payment/process").post(isAuthenticatedUser, processPayment)
router.route("/stripeApiKey").get(isAuthenticatedUser, sendStripeApiKey)
module.exports = router