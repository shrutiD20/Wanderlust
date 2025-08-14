const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");


//validating review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",")
           throw new ExpressError(400, errMsg);
        } else {
            next();
        }
};


//Reviews route(Add review)
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();

    res.redirect(`/listings/${listings._id}`);
}));

//Delete Review route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    reviewId = reviewId.trim(); // Trim spaces

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


module.exports = router;