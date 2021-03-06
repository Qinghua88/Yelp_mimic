var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
	name: String,
	imageURL: String,
	descr: String,
	price: String,
	lat: Number,
	lng: Number,
	location: String,
	createdAt: {type: Date, default: Date.now },
	author: {
		username: String,
		userId:	{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      	}
	},
	comments: [
		{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      	}
	]
});

module.exports = mongoose.model("CAMPS", campSchema);