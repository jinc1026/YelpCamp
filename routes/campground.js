var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");


// Index Route: Show all campgrounds
router.get("/", function(req,res){
	// Get all campgrounds from mongodb
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log("Retreiving all campground has been failed........")
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
		}
	});
	
	
	// Conventional way of displaying all campgrounds with pre-defined data in array format
	//res.render("campgrounds", {campgrounds: campgrounds});
});

// Create Route: add a new campground to DB
// Because of the middleware, isLoggedIn, we can retrieve data using req.user
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.rescription;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image:image, description: desc, author: author};
	
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			// redirect back to campground page
			req.flash("success", "Added Successfully!")
			res.redirect("/campgrounds");	
		}
	})
});


// New Route - show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});



// Show Route - show a campground detail
router.get("/:id", function(req, res){
	//find the cmampground with provided IDD
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and updatecorrect campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Updated Successfully!")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})	
});

// Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.success("success", "Deleted the post successfully")
			res.redirect("/campgrounds");
		}
	});
});



// ========= custom middlewares ==============
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login")
// };


module.exports = router;


