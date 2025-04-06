//Wanderlust : A major project that has all the end to end functionalitise 
// of MERN satck development. 

//Step 1: Installing and requiring all the packages required for the project. 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


let MongoUrl = "mongodb://127.0.0.1:27017/wanderLust";


//Connecting with the database.
main()
.then(()=> {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MongoUrl);
}


//Route Handlers / Middlewares
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // Add this to support JSON body parsing
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


//Root route 
app.get("/", (req, res) => {
    res.send("Hii i am root!");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found"));
});

//middleware: error handling 
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",  { err });
    // res.status(statusCode).send(message);
});

//setting up the sever
app.listen(8080, () => {
    console.log("App listing on port 8080");
});

