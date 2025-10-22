const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserControllers = require("../controllers/user.js");

router
.route("/signup")
.get(UserControllers.renderSignupForm)
.post(wrapAsync(UserControllers.signup));

 router.route("/login")
 .get(UserControllers.renderLoginForm)
 .post(saveRedirectUrl, passport.authenticate("local" , {failureRedirect : "/login" ,failureFlash : true}) ,UserControllers.login );

router.get("/logout" ,UserControllers.logout);
  
module.exports = router;