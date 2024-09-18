const {PosterInfomodel, sellerRequestModel} = require("../models/MoreModels");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const ErrorHandler = require("../Utils/errorhandler");
const cloudinary = require("cloudinary");

// =======For Poster PosterInfo========

// Creating Poster Info
exports.createPosterInfo = catchAsyncError(async(req,res,next)=>{
    const {name, redirect, type, isDeal, label, category} = req.body
    const createdBy = req.user._id
    const mycloud = await cloudinary.v2.uploader.upload(
        req.body.image,
        {
            folder: "PosterDeal",
            width: "378",
            heigth: "472", 
            crop: "scale"
        }
      );
    const PosterInfo = await PosterInfomodel.create({
        name, createdBy, redirect, isDeal, label, type, category, image: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        }
    })
    res.status(200).json({ success: true, PosterInfo});
})
// Getting Poster Info
exports.getPosterInfo = catchAsyncError(async(req,res,next)=>{
    const PosterInfo = await PosterInfomodel.find({category: req.query.name})
    if(!PosterInfo){
      return next(new ErrorHandler(`PosterInfo Not Found By Name ${req.params.name}`))
    }
    res.status(200).json({
      success: true,
      PosterInfo
    })
})
// Update Poster Info
exports.updatePosterInfo = catchAsyncError(async(req,res,next)=>{
    let PosterInfo = await PosterInfomodel.findById(req.params.id)
    if(!PosterInfo){
     return next(new ErrorHandler(`PosterInfo Not Found By Id ${req.params.id}`))
    }
    let newPosterInfoData = {
     name : req.body.name,
     redirect : req.body.redirect,
     type : req.body.type,
     isDeal : req.body.isDeal,
     label : req.body.label
    }
    if(req.body.image !== ""){
     const ImageId = PosterInfo.image.public_id
     await cloudinary.v2.uploader.destroy(ImageId)
     const mycloud = await cloudinary.v2.uploader.upload(
         req.body.image,
         {
            folder: "PosterDeal",
            width: "378",
            heigth: "472", 
            crop: "scale"
         }
       );
       newPosterInfoData.image = {
         public_id: mycloud.public_id,
         url: mycloud.secure_url,
       }
    }
    store = await PosterInfomodel.findByIdAndUpdate(req.params.id, newPosterInfoData, {
     new: true,
     runValidators: true,
     useFindAndModify: false,
   })
    res.status(200).json({
     success: true,
     PosterInfo
    })
 })
 // Delete Product
 exports.DeletePosterInfo = catchAsyncError(async (req, res, next) => {
    const PosterInfo = await PosterInfomodel.findByIdAndDelete(req.params.id)
    if(!PosterInfo){
      return next(new ErrorHandler(`Store Not Found By Id ${req.params.id}`))
    }
    let ImgId = PosterInfo.image.public_id
    await cloudinary.v2.uploader.destroy(ImgId)
    res.status(200).json({
      success: true,
    })
  });

// for Create RequestSeller
exports.createRequestSeller = catchAsyncError(async (req, res, next) => {
const data = {...req.body}
const Request = await sellerRequestModel.create(data)
res.status(200).json({ success: true});
})