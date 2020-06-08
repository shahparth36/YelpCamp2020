var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// //Schema Setup

// var campgroundSchema = new mongoose.Schema( {
// 	name: String,
// 	image: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema );

// Campground.create({
// 			name: "Salmon Creek",
// 			image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254784971287ad09448_340.jpg"
// 		},function (err, Campground) {
// 				if(err) {
// 					console.log(err);
// 				}
// 				else {
// 					console.log("New Campground created: ")
// 					console.log(Campground);
// 				}
// 			});



var campgrounds = [
		{
			name: "Salmon Creek",
			image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254784971287ad09448_340.jpg"
		}
		,
		{
			name: "Granite Hill",
			image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440752b7cd5934ec0_340.jpg"
		}
		,
		{
			name: "Pawna Lake",
			image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440752b7cd5934ec0_340.jpg"
		}
		,
		{
			name: "Salmon Creek",
			image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf85254784971287ad09448_340.jpg"
		}
		,
		{
			name: "Granite Hill",
			image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440752b7cd5934ec0_340.jpg"
		}
		,
		{
			name: "Pawna Lake",
			image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440752b7cd5934ec0_340.jpg"
		}
	]

app.get("/", function(req,res) {
	res.render("landing.ejs");
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds.ejs", {campgrounds: campgrounds})
});

app.post("/campgrounds", function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp serving on PORT 3000!");
});