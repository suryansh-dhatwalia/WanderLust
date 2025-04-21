const express = require("express");
let app = express();
const mongoose = require("mongoose");
let port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

// ✅ DB CONNECTION
async function main() {
    mongoose.connect('mongodb://localhost:27017/wanderlust');
}
main()
    .then((res) => console.log("Connection Successful"))
    .catch((err) => console.log(err));

// ✅ SERVER START
app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
    res.send("Hi root");
});

// ✅ INDEX ROUTE - Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// ✅ NEW ROUTE - Show form to create a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// ✅ CREATE ROUTE - Add new listing to DB
app.post("/listings", wrapAsync(async (req, res) => {
    
    let newListing = new Listing(req.body.listing);
    if(!req.body.listing){
        throw new ExpressError(400,"Send Some Valid Data");
    }
    if(!req.body.listing.description){
        throw new ExpressError(400,"Description is missing");
    }
    await newListing.save();
    res.redirect("/listings");
}));

// ✅ SHOW ROUTE - Show details of one listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// ✅ EDIT ROUTE - Show form to edit a listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// ✅ UPDATE ROUTE - Update listing in DB
app.patch("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    res.redirect(`/listings/${id}`);
}));

// ✅ DELETE ROUTE - Delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("listings/error.ejs",{ message });
});