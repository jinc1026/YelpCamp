var express = require("express"),
	 app 		= express(),
	 bodyParser = require("body-parser"),
	 mongoose = require("mongoose"),
	 passport = require("passport"),
	 flash 	 = require("connect-flash"),
	 LocalStrategy = require("passport-local"),
	 methodOverride = require("method-override"),
	 Campground = require("./models/campground"),
	 Comment = require("./models/comment"),
	 User = require("./models/user"),
	 seedDB = require("./seeds")
	 
var commentRoutes = require("./routes/comments"),
	 campgroundRoutes = require("./routes/campground"),
	 indexRoutes = require("./routes/index")


// mongoose.connect("mongodb://localhost/yelpcamp", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://jinc1026:wkzkfmxk@yelpcamp-nrkmy.mongodb.net/test?retryWrites=true&w=majority", {
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB");
// }).catch (err => {
// 	console.log("Error:", err.message);
// });

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch (err => {
	console.log("Error:", err.message);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
// seedDB(); // seed the database

// Passport Config
app.use(require("express-session")({
	secret: "Jin can be a great developer",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this function will be called on every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
							  

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);











app.listen(process.env.PORT || 3000, function(){
	console.log("YelpCamp server has started.........");
});





