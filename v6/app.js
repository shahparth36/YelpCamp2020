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


//--------------------------------------------------------

app.get("/", function(req, res) {
	res.render("landing.ejs");
});

//INDEX ROUTE
app.get("/campgrounds", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds })
		}
	})
});


//CREATE ROUTE
app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var Description = req.body.Description;
	var newCampground = { name: name, image: image, Description: Description };
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log("err");
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds");
		}
	});

});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new.ejs");
});

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show.ejs", { campground: foundCampground });
		}
	});
})


//---------------------------------------------------------------
// COMMENTS ROUTE
//---------------------------------------------------------------
//NEW ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("comments/new", { campground: campground });
		}
	});
});


app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		}
		else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});


// AUTH ROUTES

//SHOW REGISTER FORM

app.get("/register", function(req, res) {
	res.render("register.ejs");
});


//HANDLING REGISTER FORM
app.post("/register", function(req, res) {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/campgrounds");
			});
		};
	});
});

//SHOW LOGIN FORM
app.get("/login", function(req, res) {
	res.render("login.ejs");
});
//HANDLING LOGIN FORM
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res) {

});

//LOGOUT ROUTE

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect("/login");
	}

}

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp serving on PORT 3000!");
});
