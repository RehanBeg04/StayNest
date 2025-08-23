const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/User.model.js");


const MONGO_URI="mongodb://localhost:27017/StayNest";

main().then(()=>{
    console.log("Connect to DB");
}).catch((err)=>{
    console.log("Error in Connection",err);
})


async function main(){
    await mongoose.connect(MONGO_URI);
}

const initDb=async()=>{
     await Listing.deleteMany({});
      initData.data=initData.data.map((obj)=>({...obj,owner:'689e3c85545af631cfc7e91b'}));
     await Listing.insertMany(initData.data);
     console.log("Data was initialized");
}

initDb();