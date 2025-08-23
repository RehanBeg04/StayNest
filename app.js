
if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const Listingroutes=require("./routes/Listing.routes.js");
const reviewroutes=require("./routes/reviews.routes.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/Authentication.model.js");
const userroutes=require("./routes/user.routes.js");


const app=express();

const dbURL=process.env.ATLASDB_URL;
main().then(()=>{
    console.log("Connect to DB");
}).catch((err)=>{
   console.log("Error in Connecting",err);
})

async function main(){
    await mongoose.connect(dbURL);
}

const Port=3000;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET_CODE,
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET_CODE,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
     res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    res.locals.currUser=req.user;
    next();

})

app.use("/Listing",Listingroutes);
app.use("/Listing/:id/review",reviewroutes);
app.use("/",userroutes);

app.use((err,req,res,next)=>{
   let {status=500,message='Internal Server error'}=err;
   res.status(status).render("Error.ejs",{message});
})

app.use((req, res) => {
   res.status(404).render("Listings/Error.ejs", { message: "Page Not Found" });
});

app.listen(Port,()=>{
    console.log("Server is listening on",Port);
})
