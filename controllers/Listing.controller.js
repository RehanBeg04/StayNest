const Listing=require("../models/User.model.js");


module.exports.index=async(req,res)=>{
    const Lists=await Listing.find({});
    res.render("Listings/Index.ejs",{Lists})
}
module.exports.rendernewListing=(req,res)=>{
   res.render("Listings/Create.ejs");
}
module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const list=await Listing.findById(id)
    .populate({path:"review",
        populate:{path:"author"},
    })
    .populate("owner");

    if(!list){
     req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/Listing");
    }

    res.render("Listings/Show.ejs",{list});
}
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/Listing");
}
module.exports.rendereditform=async(req,res)=>{
    const {id}=req.params;
    const list= await Listing.findById(id);
    if(!list){
    req.flash("error","Listing you requested for does not exist!");
   return res.redirect("/Listing");
    }
    let originalurl=list.image.url;
    originalurl=originalurl.replace("/upload","/upload/h_200,w_200")
    res.render("Listings/Edit.ejs",{list,originalurl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
   let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file!=="undefined"){
  let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    console.log(req.body);
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/Listing/${id}`);

}

module.exports.deleteListing=async(req,res)=>{
     let {id}=req.params;
     let Deletelisting=await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted Successfully!");
     res.redirect("/Listing");

}

module.exports.searchListing=async(req,res)=>{
   const location=req.query.location;
   let listings=[];
  if (location && location.trim() !== "") {
      listings = await Listing.find({
        location: { $regex: location, $options: "i" }
      });
      }

      if(listings.length===0){
        res.render("Error.ejs",{message:"Sorry Listing does not found"});
      }else{
        res.render("Listings/Search.ejs",{listings});
      }
   
 }
 module.exports.Listingfeature=async(req,res)=>{
   let {feature}=req.params;
   let listings=await Listing.find({feature});
    res.render("Listings/Feature.ejs",{listings});
 }