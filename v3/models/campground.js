var mongoose = require("mongoose");

// Schema Setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	Description: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});


module.exports = mongoose.model("Campground", campgroundSchema);
