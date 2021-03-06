var express = require("express"),
    router = express.Router(),
    Campground = require("../models/Campground");
    var middleware = require("../middleware");  // /index is not required because the index name is special

//index route
router.get("/", function(req,res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
                res.render("campgrounds/index", {campgrounds:allCampgrounds}); 
        }
    });

});

//create route
router.post("/", middleware.isLoggedIn, function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc= req.body.description;
    var author = {username: req.user.username,
                  id: req.user._id};
    var newCampground = {name:name, image:image, description:desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req,res) {
    res.render("campgrounds/new");
});

//show route, has to be after the new route
router.get("/:id", function(req,res) {
        //find campground with provided id
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) { //populate makes the comments not ids any more, then exec executes (if doing lots of things tied together use exec instead of callback in one of the functions)
            if(err) {
                console.log(err);
            } else {
                console.log(foundCampground);
                 //render the show template with that campground
              res.render("campgrounds/show", {campground: foundCampground});  
            }
        });
       
            
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            res.redirect("campgrounds/")
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;