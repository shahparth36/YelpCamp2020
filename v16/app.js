var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
// var seedDB = require("./seeds");
var flash = require("connect-flash");

//REQURING ROUTES
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");

var url =
  process.env.DATABASEURL ||
  "mongodb://localhost/yelp_camp_v15Deployed-withmap";

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
// seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
//-------------------------------------------------------

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Monty is so single!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");

  next();
});
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("YelpCamp serving on PORT 3000!");
});
