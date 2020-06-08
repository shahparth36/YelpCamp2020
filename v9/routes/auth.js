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
router.get("/login", function(req, res) {
    res.render("login.ejs");
});
//HANDLING LOGIN FORM
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {

});

//LOGOUT ROUTE

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
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
