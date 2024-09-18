const catchAsyncError = require('../Middleware/CatchAsyncError')
const dotenv = require('dotenv')
dotenv.config({path: "backend/config/config.env"})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
exports.processPayment = catchAsyncError(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata:{
            company: "HomeMart",

        }
    });
    res.status(200).json({
        success:true,
        client_secret: myPayment.client_secret
    })
})
//Sending api key to frontEnd
exports.sendStripeApiKey = catchAsyncError(async(req,res,next)=>{
    res.status(200).json({
       stripeApiKey: process.env.STRIPE_API_KEY
    })
})