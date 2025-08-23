const Listing=require("../models/User.model.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/Expresserror.js");
const Review=require("../models/review.model.js");


module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.session.url=req.originalUrl;
    req.flash("error","you must be logged in to create listing");
    return res.redirect("/Login");
   }
   next();
}

module.exports.savedredirecturl=(req,res,next)=>{
    if(req.session.url){
       res.locals.redirecturl=req.session.url;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
        let {id}=req.params;
        let list=await Listing.findById(id);
         if(!list.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of Listing");
            return res.redirect(`/Listing/${id}`);
         }
         next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);

    if(error){
    throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

    if(error){
     throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.isauthor=async(req,res,next)=>{
     let {reviewId ,id}=req.params;
      let review=await Review.findById(reviewId);
      console.log(review);
         if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not the author of this Review");
            return res.redirect(`/Listing/${id}`);
         }
         next();
}