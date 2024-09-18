const ErrorHandler = require("../Utils/errorhandler");
const Productmodel = require("../models/productModels");
const catchAsyncError = require("../Middleware/CatchAsyncError");
const cloudinary = require("cloudinary");
const ApiFeatures = require("../Utils/apifeatures");
const fs = require("fs");
// Create Product Only For Admin
exports.CreateProduct = catchAsyncError(async (req, res, next) => {
  try {
    const uploadedImages = [];
    if (req.files && req.files.proimages) {
      const images = Array.isArray(req.files.proimages)
        ? req.files.proimages
        : [req.files.proimages];
      for (const image of images) {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "Products",
        });
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
        fs.unlinkSync(image.tempFilePath);
      }
    }
    const productData = {
      ...req.body,
      description: JSON.parse(req.body.description),
      specifications: JSON.parse(req.body.specifications),
      points: JSON.parse(req.body.points),
      images: uploadedImages,
      CreatedBy: req.user.id,
    };
    const Product = await Productmodel.create(productData);
    res.status(200).json({ success: true, Product });
  } catch (error) {
    next(error);
  }
});

// Get All Products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  let resultperpage = 50;
  const apiFeatues = new ApiFeatures(Productmodel.find(), req.query)
    .search()
    .filter()
    .pagination(resultperpage);
  const products = await apiFeatues.query;
  res.status(200).json({ success: true, products });
});
// Get Product By Params Only Category or label
exports.getDemanedProducts = catchAsyncError(async (req, res, next) => {
  let products;
  if (req.query.category) {
    products = await Productmodel.find({ category: req.query.category }).limit(
      10
    );
  }

  if (!products) {
    return next(new ErrorHandler("Products Not Found"));
  }

  res.status(200).json({ success: true, products });
});
// Get Top Deals Product
exports.getTopDeal = catchAsyncError(async (req, res, next) => {
  const products = Productmodel.findById(req.query.id).limit(10);
  res.status(200).json({ success: true, products });
});
// Update Product Only For Admin
exports.UpdateProduct = catchAsyncError(async (req, res) => {
  let Product = await Productmodel.findById(req.params.id);
  if (!Product) {
    if (!Product) {
      return next(new ErrorHandler("Product Not Found", 500));
    }
  }
  Product = await Productmodel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindByModify: false,
  });
  res.status(200).json({
    success: true,
    Product,
  });
});
// Get Product Details
exports.GetProductDetails = catchAsyncError(async (req, res, next) => {
  let Product = await Productmodel.findById(req.params.id);
  if (!Product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    Product,
  });
});
// Delete Product
exports.DeleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Productmodel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  if (product.images && product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
  }
  await Productmodel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Create Review Or Update Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const uploadedImages = [];

  // Handle multiple files uploaded under 'revimages'
  if (req.files && req.files.revimages) {
    const images = Array.isArray(req.files.revimages)
      ? req.files.revimages
      : [req.files.revimages];

    for (const image of images) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Reviews",
        width: 800, // Adjust width as needed
        crop: "scale",
      });

      // Save the public_id and url from Cloudinary
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });

      // Optionally delete the temporary file
      fs.unlinkSync(image.tempFilePath);
    }
  }

  const product = await Productmodel.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let oldImages = [];
  const isReviewed = product.reviews.find(
    (curElem) => curElem.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    // Find the review to update
    product.reviews.forEach((curElem) => {
      if (curElem.user.toString() === req.user._id.toString()) {
        // Store old images for deletion
        oldImages = curElem.images.map((image) => image.public_id);

        curElem.rating = rating;
        curElem.comment = comment;
        curElem.images = uploadedImages; // Update the review with new images
      }
    });

    // Delete old images from Cloudinary
    if (oldImages.length > 0) {
      for (const public_id of oldImages) {
        await cloudinary.uploader.destroy(public_id);
      }
    }
  } else {
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: rating,
      comment: comment,
      images: uploadedImages,
    };
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((curElem) => {
    avg += curElem.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
// Get Product Reviews
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Productmodel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 500));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// Delete Reviews
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Productmodel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Productmodel.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
