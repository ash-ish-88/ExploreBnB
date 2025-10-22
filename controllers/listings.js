const Listing = require("../models/listing")

module.exports.index = async(req ,res) => {
   const allListings = await Listing.find({})
   res.render("listings/index.ejs" , {allListings})
};

module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req , res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id;          
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
}  

module.exports.showListings = async (req , res) => {
    const {id} = req.params;
    const listing =  await Listing.findById(`${id}`).populate(
        {path : "review" , 
        populate :{
                     path : "author"
        }}).populate("owner");               
    if(!listing)
    {
    req.flash("error" , "Listing you requested for does not exist!");
    res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
};

module.exports.renderEdit =async (req ,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(`${id}`);
    if(!listing)
    {
    req.flash("error" , "Listing you requested for does not exist!");
    res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing} );
};

module.exports.updateListing = async (req , res) => {
    const {id} = req.params;
    const updatedListing =  req.body.listing;
    let listing =  await Listing.findByIdAndUpdate(`${id}`, updatedListing , {new:true});
    if(req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }
     req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req , res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(`${id}` , {new : true});
     req.flash("success" , " Listing Deleted!");
    res.redirect("/listings");
}

module.exports.searchListings = async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim() : "";

    if (!query) {
      const allListings = await Listing.find({});
      return res.render("listings/index.ejs", { allListings, query: "" });
    }

    const allListings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
      ],
    });

    res.render("listings/index.ejs", { allListings, query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching listings");
  }
};

module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category }); 
  res.render("listings/index.ejs", { allListings, query: "" });
};


