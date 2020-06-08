var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


//REQURING ROUTES
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");


mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", { useUnifiedTopology: true, useNewUrlParser: true });
seedDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//-------------------------------------------------------

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Monty is so single!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp serving on PORT 3000!");
});
