var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Campground.create({
// 	name: "Granny Hill",
// 	image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440752a7ddc934bc0_340.jpg",
// 	Description: "This is a beautiful Campsite!"
// });



app.get("/", function(req, res) {
	res.render("landing.ejs");
});

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

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});


app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
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
