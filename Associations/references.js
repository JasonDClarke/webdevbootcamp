var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_2");

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
    posts: [{
        type:mongoose.Schema.Types.ObjectId, //object ids
        ref:Post
    }]
});
var User = mongoose.model("User", userSchema);

// User.create({
//   email:"Bob@gmail.com",
//   name:"Bob Belhcher"
// });

// Post.create({
//     title:"I'm Bob too!",
//     content:"hello"
// });

// Post.create({
//   title: "How to cook the best burger pt. 4",
//   content: "AKLSJDLAKSJD"
// }, function(err, post){
//     User.findOne({email: "Bob@gmail.com"}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             foundUser.posts.push(post);
//             foundUser.save(function(err, data){
//                 if(err){
//                     console.log(err);
//                 } else {
//                     console.log(data);
//                 }
//             });
//         }
//     });
// });

// Find user
// find all posts for that user

User.findOne({email: "Bob@gmail.com"}).populate("posts").exec(function(err,user){
    console.log(user);
});