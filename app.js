var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose  = require("mongoose"),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/users'),
	Comment = require("./models/comments"),
	CAMPS = require("./models/camps"),
	commentRoutes = require('./routes/comments'),
	campRoutes = require('./routes/camps'),
	indexRoutes = require('./routes/index'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
	seedsDB = require("./seeds");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// mongoose.connect("mongodb://localhost/campsdb", {useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect("mongodb+srv://qinghua:mongo@yelp-tklwa.mongodb.net/test?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true })
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + '/public'));
app.use(flash());
//seedsDB();

// configure passport
app.use(require('express-session')({
	secret: "this is a secret!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});


app.use(indexRoutes);
app.use(campRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("running!!");
});