const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req ,res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
     newReview.author = req.user._id;
    await newReview.save();
    listing.review.push(newReview);
     await listing.save();
    req.flash("success" , "New Review Added!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req , res) => {
    let {id , reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}});
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`)

};