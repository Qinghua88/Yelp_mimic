var CAMPS = require('../models/camps');
var Comment = require('../models/comments');

var middlewareObj = {};



//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash('error', 'You need to log in first!')
    res.redirect("/login");
};

middlewareObj.isCampOwner = function(req, res, next) {
	if (req.isAuthenticated()) {
		CAMPS.findById(req.params.id, (err, camp) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				if (camp.author.userId.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Only post owner can proceed!');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to login first!');
		res.redirect('back');
	}
};


middlewareObj.isCommentOwner = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				if (comment.author.userId.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'Only commend owner can proceed!');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to login first!');
		res.redirect('back');
	}
};

module.exports = middlewareObj;