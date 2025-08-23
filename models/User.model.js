
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.model");
const { ref } = require("joi");

const ListSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
       url:String,
       filename:String
    },
    price:Number,
    country:String,
    location:String,

    review:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    },
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    feature:{
     type:String,
     enum:[
        "Trending","The Grand Horizon","Castles","Mountain cities","Beach","Amazing Pool","Camping","Farms","Arctic"
     ],
    }
});

ListSchema.post("findOneAndDelete",async(list)=>{
    if(list){
    await Review.deleteMany({_id:{$in:list.review}});
}
})

const Listing=mongoose.model("Listing",ListSchema);
module.exports=Listing;