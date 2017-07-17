var mongoose=require("mongoose");
var Campground = require("./models/Campground");
var Comment = require("./models/Comment");

var data= [{
    name:"Bock Beacons",
    image:"https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg",
    description:"Bocky"
},
{
    name:"Scut mountains",
    image:"https://farm5.staticflickr.com/4153/4835814837_feef6f969b.jpg",
    description:"Scutty"
},
{
    name:"Achey leg alps",
    image:"https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
    description:"I've got an achey leg"
}
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        //add campgrounds, want to do this after campgrounds are removed! so keep inside callback
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else{
                    console.log("Added a campground!");
                    //create a comment
                    Comment.create({text: "This place needs internet!",
                                    author: "Homer"}, function(err, comment){
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("created new comment!");
                                    })
                }
                }
            )}
        )
    });
}

module.exports = seedDB;