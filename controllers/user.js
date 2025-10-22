const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("listings/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try{
          let {username , email , password} = req.body;
    const newUser = new User({email , username});
    const registerUser = await User.register(newUser , password);   //user jabb register ho jayeaga
    console.log(registerUser);
    req.login(registerUser , (err) => {                 // jabb user register ho jaye to use dubara login na krna pade
        if(err) {
            return next(err)
        }
       req.flash("success" , "Welcome to Wanderlust");
       res.redirect("/listings");
    })
  
    }
    catch(e) {
        req.flash("error" ,e.message);
        res.redirect("/signup");
    }};

 module.exports.renderLoginForm =  (req,res) => {
    res.render("listings/login.ejs");
    }

module.exports.login = async(req ,res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"      
    res.redirect(redirectUrl);
};

module.exports.logout =  (req , res ,next) => {
    req.logout((err) => {             
        if(err)
        {
            return next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings")
    });
}

module.exports.renderSignupForm = (req, res) => {
    res.render("listings/signup.ejs", { title: "Sign Up on ExploreBnB" });
};

module.exports.renderLoginForm = (req, res) => {
    res.render("listings/login.ejs", { title: "Login on ExploreBnB" });
};
