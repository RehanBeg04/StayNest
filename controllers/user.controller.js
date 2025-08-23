const User=require("../models/Authentication.model.js");

module.exports.renderSignupform=(req,res)=>{
    res.render("user/signup.ejs");
}
module.exports.newUser=async(req,res)=>{
    try{
   let {username,email,password}=req.body;
    console.log(username);
    const newUser=new User({
    username,
    email,  
    })
    
   const registeredUser=await User.register(newUser,password);
   req.login(registeredUser,(err)=>{
     if(err){
        return next(err);
     }
  req.flash("success","Welcome to TravelMate!");
   res.redirect("/Listing");
   })
    }catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
    }
}

module.exports.renderLoginform=(req,res)=>{
    res.render("user/Login.ejs");
}

module.exports.userLogin=async(req,res)=>{
    req.flash("success","User Logged in Successfully");
   if(!res.locals.redirecturl){
        res.redirect("/Listing");
    }else{
    res.redirect(res.locals.redirecturl);
    }  
}
module.exports.userLogout=(req,res)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success","user Logged Out Successfully");
        res.redirect("/Listing");
    })
}