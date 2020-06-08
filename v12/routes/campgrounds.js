var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("err");
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var Description = req.body.Description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, Description: Description, author: author, price: price }
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT ROUTE - EDIT A CAMPGROUND
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwenerShip, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Cannot Find The Campground");
            res.redirect("back");
        }
        else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});


//UPDATE ROUTE - HANDLING EDITION OF CAMPGROUND

router.put("/campgrounds/:id", middleware.checkCampgroundOwenerShip, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Edited Campground Successfully.")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// //DELETE ROUTE - DELETE A CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwenerShip, middleware.isLoggedIn, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            req.flash("success", "Deleted Campground Successfully.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
