var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
//new route
router.get("/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

//post route
router.post("/", isLoggedIn, function(req,res){
    //lookup new campground using id
    Campground.findById(req.params.id, function(err,campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
                //create new comment
                Comment.create(req.body.comment, function(err,comment){//exploits "comment[name]" pattern to make comment in one go
                    if (err){
                        console.log(err);
                    } else {
                            //connect comment to campground
                        campground.comments.push(comment);
                        campground.save();
                            //redirect to show page of campground
                        res.redirect('/campgrounds/'+campground._id);
                    }
                }); 
        }
    });
});

//middleware
function isLoggedIn(req,res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;