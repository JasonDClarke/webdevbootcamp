var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

var Campground = require("./models/Campground");
var seedDB = require("./seeds")

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
                res.render("index", {campgrounds:allCampgrounds});
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
    res.render("newCampground");
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
              res.render("show", {campground: foundCampground});  
            }
        });
       
            
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is Running!");
});





