var express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/Campground"),
    Comment       = require("./models/Comment"),
    User          = require("./models/User"),
    seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDB();

//Passport Configuration
app.use(require("express-session")({
    secret: "Once again rusty is the cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//end of passport config
//middleware that applies to all routes: sends user ifo to every page //header file uses it on every view
app.use(function(req,res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

//post route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

//Auth routes
app.get("/register", function(req,res){
    res.render("register");
});

//handle signup logic
app.post("/register", function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return(res.render("register"));
        }
        passport.authenticate("local")(req,res, function() {
            res.redirect("/campgrounds");
        }) ;
    });
});

//show login form
app.get("/login", function(req, res) {
   res.render("login"); 
});

//handle login logic
app.post("/login", passport.authenticate("local", 
{
  successRedirect:"/campgrounds",
  failureRedirect:"/login"
}
), function(req,res) {
});

//logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is Running!");
});





