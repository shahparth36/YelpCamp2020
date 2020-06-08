var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment")

var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In egestas erat imperdiet sed. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Mi eget mauris pharetra et ultrices neque ornare. Est velit egestas dui id ornare arcu odio ut sem. Ultrices tincidunt arcu non sodales neque. Ut tellus elementum sagittis vitae. Lectus proin nibh nisl condimentum id venenatis a condimentum. Id semper risus in hendrerit gravida. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Dictum fusce ut placerat orci. Aliquet nec ullamcorper sit amet risus nullam eget felis. Et malesuada fames ac turpis egestas. Nec feugiat in fermentum posuere urna nec tincidunt. Porta nibh venenatis cras sed felis eget velit aliquet sagittis."
    },
    {
        name: "True Camping",
        image: "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In egestas erat imperdiet sed. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Mi eget mauris pharetra et ultrices neque ornare. Est velit egestas dui id ornare arcu odio ut sem. Ultrices tincidunt arcu non sodales neque. Ut tellus elementum sagittis vitae. Lectus proin nibh nisl condimentum id venenatis a condimentum. Id semper risus in hendrerit gravida. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Dictum fusce ut placerat orci. Aliquet nec ullamcorper sit amet risus nullam eget felis. Et malesuada fames ac turpis egestas. Nec feugiat in fermentum posuere urna nec tincidunt. Porta nibh venenatis cras sed felis eget velit aliquet sagittis."
    },
    {
        name: "In the hands of nature",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        Description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In egestas erat imperdiet sed. Vitae elementum curabitur vitae nunc sed velit dignissim sodales ut. Mi eget mauris pharetra et ultrices neque ornare. Est velit egestas dui id ornare arcu odio ut sem. Ultrices tincidunt arcu non sodales neque. Ut tellus elementum sagittis vitae. Lectus proin nibh nisl condimentum id venenatis a condimentum. Id semper risus in hendrerit gravida. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Dictum fusce ut placerat orci. Aliquet nec ullamcorper sit amet risus nullam eget felis. Et malesuada fames ac turpis egestas. Nec feugiat in fermentum posuere urna nec tincidunt. Porta nibh venenatis cras sed felis eget velit aliquet sagittis."
    }
];

function seedDB() {

    //Remove all Campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("removed campgrounds!");
        }
    });

    //Add a set of Sample Campgrounds
    data.forEach(function(seed) {

        Campground.create(seed, function(err, campground) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("added campground!");
                //create a comment
                Comment.create({
                    text: "This place is great, I wish I was there!",
                    author: "Homer"
                }, function(err, comment) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("added a comment!");
                    }
                })
            }
        });

    });
}

module.exports = seedDB;
