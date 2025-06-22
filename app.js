const express = require("express");
let app = express();
const mongoose = require("mongoose");
let port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("listings/error.ejs",{ message });
});