const Categoriesmodel = require("../models/CategoriesMode");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const ErrorHandler = require("../Utils/errorhandler");
const cloudinary = require("cloudinary");
// For Createing Categories Admin
exports.CreateCategory = catchAsyncError(async (req, res, next) => {
  const mycloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "categories",
    width: 250,
    crop: "scale",
  });
  const { name, value, subcategories } = req.body;
  const category = await Categoriesmodel.create({
    name,
    image: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    subcategories,
    value,
  });
  res.status(200).json({ success: true, category });
});

// For getting All Categoires
exports.getCategories = catchAsyncError(async (req,res,next)=>{
  const categoires = await Categoriesmodel.find()
  if(!categoires){
      return next(new ErrorHandler("Categories Not Found", 404));
  }
  res.status(200).json({
      success: true,
      categoires
  })
})

// For Updateing Categories Admin
exports.updateCategory = catchAsyncError(async (req, res, next) => {
  let category = await Categoriesmodel.findById(req.params.id)
  if(!category){
   return next(new ErrorHandler(`category Not Found By if ${req.params.id}`))
  }
  const newCategorydata = {
    name: req.body.name,
    value: req.body.value
  }
  if(req.body.image !== ""){
    imgId = category.image.public_id
    await cloudinary.v2.uploader.destroy(imgId);
    const mycloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "categories",
      width: 250,
      crop: "scale",
    });
    newCategorydata.image = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    }
  }
  category = await Categoriesmodel.findByIdAndUpdate(req.params.id, newCategorydata,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({ success: true, category });
});

// For Deleteing Categories Admin
exports.deleteCategory = catchAsyncError(async (req, res, next) => {
  let category = await Categoriesmodel.findByIdAndDelete(req.params.id)
  console.log(category)
  if(!category){
   return next(new ErrorHandler(`category Not Found By if ${req.params.id}`))
  }
  imgId = category.image.public_id
  await cloudinary.v2.uploader.destroy(imgId);
  res.status(200).json({ success: true});
});
