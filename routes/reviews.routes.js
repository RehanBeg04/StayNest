const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validatereview,isLoggedIn, isauthor}=require("../middleware/user.middleware.js");
const ReviewController=require("../controllers/review.controller.js");




router.post("/",
    isLoggedIn,
    validatereview,
   wrapAsync(ReviewController.createReview));

router.delete("/:reviewId",
    isLoggedIn,
    isauthor,
    wrapAsync(ReviewController.deleteReview));

module.exports=router;

