const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {savedredirecturl}=require("../middleware/user.middleware.js");
const userController=require("../controllers/user.controller.js");


router.route("/signup")
.get(userController.renderSignupform)
.post(wrapAsync(userController.newUser));



router.route("/login")
.get(userController.renderLoginform)
.post(
savedredirecturl,
passport.authenticate("local",
{failureRedirect:"/login",failureFlash:true}),
userController.userLogin);

router.get("/logout",userController.userLogout)



module.exports=router;