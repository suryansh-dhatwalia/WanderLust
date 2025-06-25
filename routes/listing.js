const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { error } = require("console");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");

const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// ✅ NEW ROUTE - Show form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// ✅ CREATE ROUTE - Add new listing to DB
router.post(
  "/",
  isLoggedIn,
  validateSchema,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// ✅ SHOW ROUTE - Show details of one listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing Does not Exit!!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  })
);

// ✅ EDIT ROUTE - Show form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Does not Exit!!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// ✅ UPDATE ROUTE - Update listing in DB
router.patch(
  "/:id",
  isLoggedIn,
  validateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// ✅ DELETE ROUTE - Delete a listing
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
