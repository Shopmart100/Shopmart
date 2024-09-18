const Admodel = require("../models/AdModel");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const ErrorHandler = require("../Utils/errorhandler");
const cloudinary = require("cloudinary");

exports.createAd = catchAsyncError(async (req, res, next) => {
  const { adtype, advaltype, storename, value, valuediscount, valuecategory, valuelabel,  redirect } = req.body;
  let uploadOptions;
  switch (adtype) {
    case "HeroAd":
        uploadOptions = {
          folder: "Advertisements",
          invalidate: true,
        };
        transformation = {
          width: 1360,
          height: 280,
          crop: "limit",
        };
        break;
      case "gridAd":
        uploadOptions = {
          folder: "Advertisements",
        };
        transformation = {
          width: 500,
          crop: "scale",
        };
        break;
      case "StoreAd":
        uploadOptions = {
          folder: "Advertisements",
        };
        transformation = {
          width: 250,
          crop: "scale",
        };
        break;
      default:
        return next(new ErrorHandler("Invalid ad type", 500));
  }
  const mycloud = await cloudinary.v2.uploader.upload(
    req.body.image,
    uploadOptions
  );
  const Advertisement = await Admodel.create({
    adtype,
    advaltype,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    storename,
    value,
    valuecategory,
    valuelabel,
    valuediscount,
    redirect
  });
  res.status(200).json({ success: true, Advertisement });
});
// For Getting Ads
exports.getAds = catchAsyncError(async (req, res, next) => {
  const ads = await Admodel.find({ adtype: req.query.adtype });
  if (!ads) {
    return next(new ErrorHandler("ads Not Found", 404));
  }
  res.status(200).json({
    success: true,
    ads,
  });
});
// For Updateing Ads
exports.updateAd = catchAsyncError(async (req, res, next) => {
  let ad = await Admodel.findById(req.params.id);
  if (!ad) {
    return next(new ErrorHandler(`ad Not Found By if ${req.params.id}`));
  }
  const newAdData = {
    adtype: req.body.adtype,
    value: req.body.value,
    storename: req.body.storename,
  };
  let uploadOptions;
  if (newAdData.adtype) {
    switch (newAdData.adtype) {
      case "HeroAd":
        uploadOptions = {
          folder: "Advertisements",
          invalidate: true,
        };
        transformation = {
          width: 1360,
          height: 280,
          crop: "limit",
        };
        break;
      case "gridAd":
        uploadOptions = {
          folder: "Advertisements",
        };
        transformation = {
          width: 500,
          crop: "scale",
        };
        break;
      case "StoreAd":
        uploadOptions = {
          folder: "Advertisements",
        };
        transformation = {
          width: 250,
          crop: "scale",
        };
      default:
        return next(new ErrorHandler("Invalid ad type", 500));
    }
  }
  if (req.body.image !== "") {
    const imgId = ad.image.public_id;
    await cloudinary.v2.uploader.destroy(imgId);
    const mycloud = await cloudinary.v2.uploader.upload(
      req.body.image,
      uploadOptions
    );
    newAdData.image = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }
  ad = await Admodel.findByIdAndUpdate(req.params.id, newAdData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    ad,
  });
});
// For Deleteing Ads
exports.deleteAd = catchAsyncError(async (req, res, next) => {
  let ad = await Admodel.findByIdAndDelete(req.params.id);
  if (!ad) {
    return next(new ErrorHandler(`ad Not Found By if ${req.params.id}`));
  }
  let imgId = ad.image.public_id
  await cloudinary.v2.uploader.destroy(imgId);
  res.status(200).json({
    success: true,
  });
});
