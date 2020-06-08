var mongoose = require("mongoose");

// Schema Setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	Description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});


module.exports = mongoose.model("Campground", campgroundSchema);
