var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


//---------------------------------------------------------------
// COMMENTS ROUTE
//---------------------------------------------------------------
//NEW ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    });
});


router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    //Add username and Id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save Comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added a comment.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            req.flash("error", "Cannot find a comment");
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});

//UPDATE ROUTE

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Edited Comment Successfully.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY ROUTE

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    console.log("out");
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log("in");
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        else {
            req.flash("success", "Deleted Comment Successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
