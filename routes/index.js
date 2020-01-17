var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');

router.get('/', (req, res) => {
	res.render("home");
});


// AUTHENTICATION
// Show register form
router.get('/register', (req, res) => {
	res.render('register');
});

// handle register form
router.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to CAMPS!  ' + user.username);
			res.redirect('/camps');
		});
	})
});

// show login form
router.get('/login', (req, res) => {
	res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate('local', {
		successRedirect: '/camps',
		failureRedirect: '/login'
	}), (req, res) => {
	
});

// handle logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged out');
	res.redirect('/camps');
});


module.exports = router;