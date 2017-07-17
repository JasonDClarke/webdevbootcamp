var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static("public"));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);
//check it works

// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://farm9.staticflickr.com/7258/7121861565_3f4957acb1",
//       description: "nice empty space"
//     }, function(err, campground) {
//           if(err){
//               console.log(err);
//           } else {
//               console.log("Newly created Campground: ");
//               console.log(campground);
//           }
//       });


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
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                console.log(err);
            } else {
                 //render the show template with that campground
              res.render("show", {campground: foundCampground});  
            }
        });
       
            
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is Running!");
});





