const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema ,reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { error } = require("console");


const validateSchema = (req,res,next) => {
    const { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// ✅ NEW ROUTE - Show form to create a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// ✅ CREATE ROUTE - Add new listing to DB
router.post("/", validateSchema ,wrapAsync(async (req, res) => {
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// ✅ SHOW ROUTE - Show details of one listing
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

// ✅ EDIT ROUTE - Show form to edit a listing
router.get("/:id/edit",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// ✅ UPDATE ROUTE - Update listing in DB
router.patch("/:id",validateSchema,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
}));

// ✅ DELETE ROUTE - Delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;
