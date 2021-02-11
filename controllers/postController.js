const async = require("async");
const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

exports.post_detail = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Post detail GET");
};

exports.post_list = function (req, res, next) {
  Post.find()
    .populate("author")
    .exec(function (err, post_list) {
      if (err) {
        return next(err);
      }
      if (req.user) {
        switch (req.user.status) {
          case "reader":
            res.render("reader_posts", {
              post_list: post_list,
              user: req.user,
            });
            break;
          case "author":
            res.render("author_posts", { post_list: post_list, user: req.user });
            break;
          default:
            res.render("user_posts", { post_list: post_list, user: req.user });
        }
      } else {
        res.render("loggedout_posts", { post_list: post_list });
      }
    });
};

exports.post_create_get = function (req, res, next) {
  res.render("post_form", { title: "Add a blog post" });
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
  res.send("NOT IMPLEMENTED: Post update GET for id:", req.params.postId);
};

exports.post_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Post update POST for id:", req.params.postId);
};

exports.post_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Post delete GET for id:", req.params.postId);
};

exports.post_delete = function (req, res, next) {
  Post.findByIdAndRemove(req.body.postid, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
