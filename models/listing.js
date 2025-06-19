const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { listingSchema } = require("../schema");


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
        filename: {
          type: String,
          default: "listingimage"
        },
        url: {
          type: String,
          
          default: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          set: (v) => v.trim() === "" ? "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
        }
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
    }]



})
listing.post("findOneAndDelete" ,async(listing)  =>{
    if(listing){
   await Review.deleteMany({ _id: {$in:listing.reviews}});
    }
});


const Listing = mongoose.model("Listing",listing);
module.exports = Listing;