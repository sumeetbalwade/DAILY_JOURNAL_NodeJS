//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const port = process.env.port || 3000;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
require("dotenv").config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Set up default mongoose connection
const databaseConnnection = process.env.DATABASE_CONNECTION;
const mongoDB = databaseConnnection;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const postTemplate = {
  postTitle: String,
  postBody: String,
};

const Post = mongoose.model("Post", postTemplate);

const defaultItem = new Post({
  postTitle: "Example Post",
  postBody:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
});

app.get("/", function (req, res) {
  Post.find({}, (err, findedList) => {
    if (!err) {
      if (findedList.length === 0) {
        let posts = [defaultItem];
        Post.insertMany(posts, (err) => {});
        res.redirect("/");
      } else if (findedList.length > 1) {
        Post.findOneAndDelete(
          { postTitle: "Example Post" },
          (err, result) => {}
        );
        res.redirect("/");
      } else {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: findedList,
        });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const newPost = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });

  newPost.save();

  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedTitleID = req.params.postId;

  Post.findById(requestedTitleID, (err, findedPost) => {
    if (!err) {
      res.render("post", {
        title: findedPost.postTitle,
        content: findedPost.postBody,
      });
    }
  });
});

app.listen(port, function () {
  console.log("Server started on port " + port);
});
