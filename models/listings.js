//Created a model folder to write all the models at one place and then exporting it in the main file

const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },
    image: {
      type: mongoose.Schema.Types.Mixed, // Allows both a string and an object
      required: true,
      default:
        "https://images.unsplash.com/photo-1548278651-843b1d7431a9?q=80&w=2070&auto=format&fit=crop",
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    
});

//mongoose middleware 
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    
});

//Creating a model listing out of the schema and exporting it in the app.js file
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
