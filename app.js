if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('cloudinary-multer');
const MongoStore = require('connect-mongo');
const express = require('express');
const  app = express();
const mongoose = require('mongoose');
const path = require('path')
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use("/image" , express.static(path.join(__dirname, "init/image")));
app.use("/css" , express.static(path.join(__dirname, "public/css")));
app.use("/js" , express.static(path.join(__dirname, "public/js")));

app.set('views',path.join(__dirname , 'views'));
app.use(express.urlencoded({extended : true}))
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const ejsMate = require('ejs-mate');   
app.engine("ejs" , ejsMate);

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const flash = require("connect-flash");
const session = require("express-session");   
const router = require('./route/listing.js');
const PORT = process.env.PORT || 8080;
const dbURL = process.env.ATLASDB_URL
const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600,
});

store.on("error" , () => {
    console.log("Error in mongo session store", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave :  false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000, 
        maxAge : 7*24*60*60*1000,        
        httpOnly : true,               
    },
}
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());      
passport.deserializeUser(User.deserializeUser());     

app.use(flash());  
app.use((req , res , next) => {
    const successMsg = req.flash("success");
    const errorMsg = req.flash("error");

    res.locals.success = successMsg.length > 0 ? successMsg : null;
    res.locals.error = errorMsg.length > 0 ? errorMsg : null;
    res.locals.currUser = req.user;
    next();
});

  app.get("/privacy", (req, res) => {
  res.render("listings/privacy.ejs");
});

  app.get("/terms", (req, res) => {
  res.render("listings/terms.ejs");
});

app.use("/listings", listingRouter);            
app.use("/listings/:id/review" , reviewRouter); 
app.use("/", userRouter);

main().then(() => console.log('connection is successful')).catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false
});
}

app.all(/.*/ , (req,res,next) => {
    next(new ExpressError(404 , "Page not found"));
});

app.use((err , req , res ,next) => {
    let {statusCode = 500 , message = "Something went wrong!"} = err;
    res.status(statusCode).send(message);
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


