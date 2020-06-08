var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");
middlewareObj.checkCommentOwenerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else if (foundComment.author.id.equals(req.user._id)) {
                next();
            }
            else {
                res.redirect("back");
            }
        });
    }
    else {
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwenerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground Not Found.");
                res.redirect("back");
            }
            else if (foundCampground.author.id.equals(req.user._id)) {
                next();
            }
            else {
                req.flash("error", "You Can't Edit That Campground/");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You Need To Be Logged In.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "You Need To Be Logged In.");
        res.redirect("/login");
    }

};

module.exports = middlewareObj;
