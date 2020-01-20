var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: {
		username: String,
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	},
	createdAt: {type: Date, default: Date.now },
	text: String
});

module.exports = mongoose.model("Comment", commentSchema);

