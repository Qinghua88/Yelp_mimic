var express = require('express');
var router = express.Router();
var CAMPS = require('../models/camps');
var Comment = require('../models/comments');
var middleware = require('../middleware');


// new for add new comment
router.get('/camps/:id/comments/new', middleware.isLoggedIn, (req, res) => {
	CAMPS.findById(req.params.id, (err, camp) => {
		if (err) {
			console.log(err);
		} else {
			
			res.render('comments/new', {camp: camp});
		}
	});
});

router.post('/camps/:id/comments', middleware.isLoggedIn, (req, res) => {
	CAMPS.findById(req.params.id).populate('comments').exec( (err, camp) => {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				comment.author.userId = req.user._id;
				comment.author.username = req.user.username;
				comment.createdAt = comment.createdAt;
				comment.save();
				camp.comments.push(comment);
				camp.save();
				req.flash('success', 'Successfully made a comment');
				res.redirect('/camps/' + req.params.id);
			});
		}
	});
});

router.get('/camps/:id/comments/:comment_id/edit', middleware.isCommentOwner,(req, res) => {
	Comment.findById(req.params.comment_id, (err, comment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {camp_id: req.params.id, comment: comment});
		}
	});
	
});

router.put('/camps/:id/comments/:comment_id', middleware.isCommentOwner, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Successfully edit comment');
			res.redirect('/camps/' + req.params.id);
		}
	});
});

router.delete('/camps/:id/comments/:comment_id', middleware.isCommentOwner, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			req.flash('success', 'Successfully delete comment');
			res.redirect('/camps/' + req.params.id);
		}
	});
});


module.exports = router;