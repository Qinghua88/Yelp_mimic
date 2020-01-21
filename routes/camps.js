var express = require('express');
var router = express.Router();
var CAMPS = require('../models/camps');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GGAPIKEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
var GGAPIURL = "https://maps.googleapis.com/maps/api/js?key=" + process.env.GGAPIKEY + "&callback=initMap";

router.get('/camps', (req, res) => {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		CAMPS.find({name: regex}, (err, camps) => {
			if (err) {
				console.log(err);
			} else {
				res.render("camps/index", {camps: camps});
			}
		});
	} else {
		CAMPS.find({}, (err, camps) => {
			if (err) {
				console.log(err);
			} else {
				res.render("camps/index", {camps: camps});
			}
		});
	}
});

//CREATE - add new campground to DB

router.post('/camps', middleware.isLoggedIn, (req, res) => {
	var campName =  req.body.campName;
	var imageURL = req.body.imageURL;
	var price = req.body.price;
	var descr = req.body.description;
	var author = {
		userId: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			return res.redirect('back');
    	}
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newCreated = {name: campName, price: price, imageURL: imageURL, descr: descr, author:author, location: location, lat: lat, lng: lng};
		CAMPS.create(newCreated, (err, newcamp) => {
			if (err) {
				console.log(err);
			} else {
				newcamp.createdAt = newcamp.createdAt;
				newcamp.save();
				req.flash('success', 'Successfully post a camp');
				res.redirect('/camps');
			}
		});
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
			res.render('camps/show', {camp: camp, GGAPIURL: GGAPIURL});
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
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
			req.flash('error', 'Invalid address');
			return res.redirect('back');
    	}
		req.body.camp.lat = data[0].latitude;
		req.body.camp.lng = data[0].longitude;
		req.body.camp.location = data[0].formattedAddress;
		CAMPS.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) =>{
			if (err) {
				res.redirect('/camps');
			} else {
				req.flash('success', 'Successfully edit your post');
				res.redirect('/camps/' + req.params.id);
			}
		});
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;