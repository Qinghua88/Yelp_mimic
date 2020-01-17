var express = require('express');
var router = express.Router();
var CAMPS = require('../models/camps');
var middleware = require('../middleware');

router.get('/camps', (req, res) => {
	CAMPS.find({}, (err, camps) => {
		if (err) {
			console.log(err);
		} else {
			res.render("camps/index", {camps: camps});
		}
	});
	
});

router.post('/camps', middleware.isLoggedIn, (req, res) => {
	var campName =  req.body.campName;
	var imageURL = req.body.imageURL;
	var price = req.body.price;
	var descr = req.body.description;
	var author = {
		userId: req.user._id,
		username: req.user.username
	};
	var newCreated = {name: campName, price: price, imageURL: imageURL, descr: descr, author:author};
	CAMPS.create(newCreated, (err, newcamp) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Successfully post a camp');
			res.redirect('/camps');
		}
	});
	
});

router.get('/camps/new', middleware.isLoggedIn, (req, res) => {
	res.render('camps/new');
});

router.get('/camps/:id', (req, res) => {
	var ID = req.params.id;
	CAMPS.findById(ID).populate('comments').exec((err, camp) => {
		if (err) {
			console.log(err);
		} else {
			res.render('camps/show', {camp: camp});
		}
	});
});

// show edit form
router.get('/camps/:id/edit', middleware.isCampOwner, (req, res) => {
	CAMPS.findById(req.params.id, (err, camp) => {
		if (err) {
			res.redirect('/camps');
		} else {
			res.render('camps/edit', {camp: camp});
		}
	});
});

// update camp
router.put('/camps/:id', middleware.isCampOwner, (req, res) =>{
	CAMPS.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) =>{
		if (err) {
			res.redirect('/camps');
		} else {
			req.flash('success', 'Successfully edit your post');
			res.redirect('/camps/' + req.params.id);
		}
	});
});

// delete camp
router.delete('/camps/:id', middleware.isCampOwner, (req, res) => {
	CAMPS.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect('/camps');
		} else {
			req.flash('success', 'Successfully deleted the post');
			res.redirect('/camps');
		}
	});
});


module.exports = router;