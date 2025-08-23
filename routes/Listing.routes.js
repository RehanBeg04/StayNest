const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/User.model.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware/user.middleware.js");
const ListingController=require("../controllers/Listing.controller.js");
const multer  = require('multer');
const {storage}=require("../config/cloudconfig.js")
const upload = multer({storage})


router.get("/",wrapAsync(ListingController.index));

router.get("/New",isLoggedIn,ListingController.rendernewListing);
router.get("/search", wrapAsync(ListingController.searchListing))

router.get("/feature/:feature",ListingController.Listingfeature);


router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn,
    isOwner,
     upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,
     isOwner,
    wrapAsync(ListingController.deleteListing))

router.post("/create",
     isLoggedIn,
     validateListing,
  upload.single("listing[image][url]"),
   wrapAsync(ListingController.createListing));

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.rendereditform))


module.exports=router;