var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROUTE ROUTE
router.get("/", function(req, res) {
    res.render("landing.ejs");
});


// AUTH ROUTES

//SHOW REGISTER FORM

router.get("/register", function(req, res) {
    res.render("register.ejs");
});


//HANDLING REGISTER FORM
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to YelpCamp " + user.username + " !");
                res.redirect("/campgrounds");
            });
        };
    });
});

//SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login.ejs");
});
//HANDLING LOGIN FORM
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    // succssFlash: "Welcome back <%= user.username %>"
}), function(req, res) {});

passport.authenticate('local', { successFlash: 'Welcome!' });

//LOGOUT ROUTE

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You Have Successfully Logged Out! Hope To See You Again!");
    res.redirect("/campgrounds");
});

module.exports = router;
