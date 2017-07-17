var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

//POST - title, content
var postSchema = new mongoose.Schema ({
    title: String,
    content: String
});
var Post = mongoose.model("Post", postSchema);

//USER - email, name
var userSchema = new mongoose.Schema ({
    name: String,
    email: String,
    posts: [postSchema]
});
var User = mongoose.model("User", userSchema);


var newUser = new User({
    name:"Hermione",
    email:"hg@hogwarts.com"
}) ;

newUser.posts.push({
    title: "How to brew polyjuice potion",
    content: "Just Kidding. Go to potions class to learn it!"
});

newUser.save(function(err, user){
    if (err) {
        console.log(err);
    }
    else {
        console.log(user);
    }
});

// var newPost = new Post({
//     title:"Reflections on Apples",
//     content:"They are delicious"
// });

// newPost.save(function(err, post){
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });