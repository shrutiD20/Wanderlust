const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listings.js");

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

const initDB =  async () =>{
    await Listings.deleteMany({});
    await Listings.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();

