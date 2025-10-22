const express = require('express');
const router = express.Router({mergeParams : true});  
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}= require("../schema.js");
const Listing = require('../models/listing.js');
const {validateReview , isLoggedIn , isReviewAuthor} = require("../middleware.js")
const ReviewControllers = require("../controllers/reviews.js");


router.post("/" ,isLoggedIn ,validateReview, wrapAsync(ReviewControllers.createReview))


router.delete("/:reviewId",isLoggedIn ,isReviewAuthor ,wrapAsync(ReviewControllers.destroyReview));


module.exports = router;