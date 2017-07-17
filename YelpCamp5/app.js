var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var Campground = require("./models/Campground");
var Comment = require("./models/Comment");
var seedDB = require("./seeds");

seedDB();
//check it works


app.get("/", function(req,res) {
    res.render("landing");
});

//index route
app.get("/campgrounds", function(req,res) {
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
app.post("/campgrounds", function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc= req.body.description;
    var newCampground = {name:name, image:image, description:desc};
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
app.get("/campgrounds/new",function(req,res) {
    res.render("campgrounds/new");
});

//show route, has to be after the new route
app.get("/campgrounds/:id", function(req,res) {
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

//comments routes
//#########################

//new route
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    })
})

//post route
app.post("/campgrounds/:id/comments", function(req,res){
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
        };
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is Running!");
});





