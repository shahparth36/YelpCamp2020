var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//INDEX ROUTE -  show all campgrounds
router.get("/campgrounds", function(req, res) {
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


router.post("/campgrounds", isLoggedIn, function(req, res) {
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
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

//SHOW ROUTE
router.get("/campgrounds/:id", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show.ejs", { campground: foundCampground });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }

}

module.exports = router;
