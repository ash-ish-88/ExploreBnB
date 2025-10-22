const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingsControllers = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require('../cloudconfig');
const upload = multer({ storage });



router.get("/search", ListingsControllers.searchListings);

router.get("/category/:category", ListingsControllers.filterByCategory);



router
  .route("/")
  .get(wrapAsync(ListingsControllers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingsControllers.createListing)
  );



router.get("/new", isLoggedIn, ListingsControllers.renderNewForm);

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingsControllers.renderEdit));
router
  .route("/:id")
  .get(wrapAsync(ListingsControllers.showListings)) 
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingsControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingsControllers.destroyListing));



module.exports = router;
