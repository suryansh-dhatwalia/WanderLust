const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { listingSchema } = require("../schema");
const { string } = require("joi");


let listing = new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    image: {
        filename:String,
        url:String
      },
    price:{
        type:Number,
        default:1200,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews: [{
        type:Schema.Types.ObjectId,
        ref:"review",
    }],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
    }



})
listing.post("findOneAndDelete" ,async(listing)  =>{
    if(listing){
   await Review.deleteMany({ _id: {$in:listing.reviews}});
    }
});


const Listing = mongoose.model("Listing",listing);
module.exports = Listing;