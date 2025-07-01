const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectedUrl = req.originalUrl;
    req.flash("error", "You have not logged in to create a new listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectedUrl) {
    res.locals.redirectedUrl = req.session.redirectedUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Don't have permission to Edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
