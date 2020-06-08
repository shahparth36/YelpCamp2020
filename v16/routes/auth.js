var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var async = require("async");
var crypto = require("crypto");
var nodemailer = require("nodemailer");

// LANDING ROUTE
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
  //If Passwords do not match
  if (req.body.password !== req.body.Password) {
    req.flash("error", "Passwords Do Not Match.");
    return res.redirect("/register");
  }
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }

    else {
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to YelpCamp " + user.username + " !");
        res.redirect("/campgrounds");
      });
    }
  });
});

//SHOW LOGIN FORM

router.get("/login", function(req, res) {
  res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",

  failureFlash: true,
  succssFlash: true
}), function(req, res) {});

//LOGOUT ROUTE

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You Have Successfully Logged out!");
  res.redirect("/campgrounds");
});


// FORGOT PASSWORD

router.get('/forgot', function(req, res) {
  res.render('forgot');
});

// HANDLING FORGOT PASSWORD REQUEST
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          req.flash("error", "Oops! Something went wrong! Try again Later ");
          return res.redirect("back");
        }
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'yelpcamp01@gmail.com', //Enter your Gmail Account Email Id
          pass: '' //Enter your Gmail Account Password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yelpcamp01@gmail.com', ////Enter your Gmail Account Email Id
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'The link will get expired and will be of no longer use to reset your password.\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// RESET PASSWORD ROUTE

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err) {
      req.flash("error", "Oops! Something went wrong! Try again Later ");
      return res.redirect("back");
    }
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', { token: req.params.token });
  });
});

//HANDLING RESET PASSWORD REQUEST

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) {
          req.flash("error", "Oops! Something went wrong! Try again Later ");
          return res.redirect("back");
        }
        if (!user) {
          console.log(req.params.token);
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            if (err) {
              req.flash("error", "Oops! Something went wrong! Try again Later ");
              return res.redirect("back");
            }
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if (err) {
                req.flash("error", "Oops! Something went wrong! Try again Later ");
                return res.redirect("back");
              }
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        }
        else {
          req.flash("error", "Passwords do not match.");
          return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'yelpcamp01@gmail.com', //Enter your Gmail Account Email Id
          pass: '' //Enter your Gmail Account Password
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'yelpcamp01@gmail.com', //Enter your Gmail Account Email Id
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      req.flash("error", "Oops! Something went wrong! Try again Later ");
      return res.redirect("back");
    }
    res.redirect('/campgrounds');
  });
});

// SHOW PROFILE ROUTE

router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong!");
      return res.redirect("back");
    }
    Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      else {
        res.render("users/show", { user: foundUser, campgrounds: campgrounds });
      }
    });

  });
});



module.exports = router;
