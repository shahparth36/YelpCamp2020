var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dcimcuqjm',
  api_key: "295715373559115",
  api_secret: "9KtbJHAqsFA3G1hCjlt9SUIG5OM"
});

//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res) {
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({"name": regex}, function(err, allCampgrounds) {
            if (err) {
                console.log("err");
            }
            else {
                var noMatch;
                if( allCampgrounds.length <1) {
                    req.flash("error",  "No Campground With Name " + req.query.search + " Exists.")
                    res.redirect("back");
                }
                res.render("campgrounds/index", { campgrounds: allCampgrounds });
            }
        });
    }
    else {
        // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("err");
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
    }
});

//CREATE - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path,function(err,result) {
        if(err) {
            req.flash("error", err.message);
        }
        else {
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            req.body.campground.imageId = result.public_id;;
            // add author to campground
            req.body.campground.author = {
                id: req.user._id,
                username: req.user.username
            }
          Campground.create(req.body.campground, function(err, campground) {
            if (err) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
              res.redirect('/campgrounds/' + campground.id);
            });
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
router.put("/campgrounds/:id", upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.Description = req.body.Description;
            campground.price = req.body.price;
            campground.save();
            req.flash("success","Successfully Updated Campground!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

// //DELETE ROUTE - DELETE A CAMPGROUND

router.delete("/campgrounds/:id", middleware.checkCampgroundOwenerShip, middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, async function(err, campground) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.remove();
            req.flash("success", "Deleted Campground Successfully.");
            res.redirect("/campgrounds");
        }
        catch (err) {
            if(err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});

//SEARCH GIVEN CAMPGROUND
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;
