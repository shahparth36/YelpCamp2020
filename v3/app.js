var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds")

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useUnifiedTopology: true, useNewUrlParser: true });

seedDB();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

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
			res.render("index.ejs", { campgrounds: allCampgrounds })
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
		}
		else {
			res.redirect("/campgrounds");
		}
	});

});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("show.ejs", { campground: foundCampground });
		}
	});
})
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp serving on PORT 3000!");
});
