const Review=require("../models/review.model.js");
const Listing=require("../models/User.model.js");

module.exports.createReview=async(req,res)=>{
    let list=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    list.review.push(newReview);
    newReview.save();
    list.save();
    req.flash("success"," New Review Created Successfully!")
    res.redirect(`/Listing/${list._id}`);
    console.log("reviwed Save");
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!")
    res.redirect(`/Listing/${id}`);
}