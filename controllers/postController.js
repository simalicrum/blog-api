const async = require("async");
const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const user = require("../models/user");
const User = require("../models/user");

exports.post_detail = function (req, res, next) {
  Post.findById(req.params.postId)
  .populate("comments")
  .populate("author")
  .populate({path: "comments",
    populate: {
      path: "author"
    }
  })
  .exec(function (err, post) {
    if (err) {
      return next(err);
    }
    res.render("post_detail", { post: post, user: req.user });
  });
};

exports.post_list = function (req, res, next) {
  console.log("req.user: ", req.user);
  Post.find()
    .populate("comments")
    .populate("author")
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      res.render("post_list", { post_list: post_list, user: req.user });
    });
};

exports.post_create_get = function (req, res, next) {
  if (req.user !== undefined) {
    res.render("post_form", { title: "Add a blog post", post: {title: "", content: ""} });
  }
};

exports.post_create_post = [
  body("title", "Title cannot be blank").trim().isLength({ min: 1 }).escape(),
  body("post", "Blog post cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    const post = new Post({
      title: req.body.title,
      author: req.user._id,
      timestamp: new Date(),
      content: req.body.post,
      errors: errors,
    });
    if (!errors.isEmpty()) {
      res.render("post_form", {
        post: post,
        title: "Add a blog post",
        errors: errors.array(),
      });
      return;
    } else {
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.post_update_get = function (req, res, next) {
  Post.findById(req.params.postId)
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      if (req.user !== undefined ) {
        console.log("req.user._id: ", req.user._id);
        console.log("post.author._id: ", post.author._id);
        if (req.user._id.toString() === post.author._id.toString()) {
          res.render("post_form", {post: post, title: "Edit your blog post"});
        }
      }
    });
};

exports.post_update_post = [
  body("title", "Title cannot be blank").trim().isLength({ min: 1 }).escape(),
  body("post", "Blog post cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    const post = new Post({
      title: req.body.title,
      author: req.user._id,
      timestamp: new Date(),
      content: req.body.post,
      errors: errors,
    });
    if (!errors.isEmpty()) {
      res.render("post_form", {
        post: post,
        title: "Edit your blog post",
        errors: errors.array(),
      });
      return;
    } else {
      post.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.post_delete_get = function (req, res, next) {
  
  console.log("req.user: ", req.user);
  res.render("post_delete", {title: "This will permanently remove this blog post. Are you sure?", postId: req.params.postId });
};

exports.post_delete = function (req, res, next) {
  console.log("req.body.postid: ", req.body.postid);
  Post.findByIdAndRemove(req.body.postid, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/posts");
  });
};
