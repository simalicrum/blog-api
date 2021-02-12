const async = require("async");
const { body, validationResult } = require("express-validator");

const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");

exports.comment_detail = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment detail GET");
};

exports.comment_list = function (req, res, next) {
  Comment.find()
    .populate("author")
    .exec(function (err, comment_list) {
      if (err) {
        return next(err);
      }
      if (req.user) {
        switch (req.user.status) {
          case "member":
            res.render("member", {
              comment_list: comment_list,
              user: req.user,
            });
            break;
          case "admin":
            res.render("admin", { comment_list: comment_list, user: req.user });
            break;
          default:
            res.render("user", { comment_list: comment_list, user: req.user });
        }
      } else {
        res.render("loggedout", { comment_list: comment_list });
      }
    });
};

exports.comment_create_get = function (req, res, next) {
  console.log("req.params.postId: ", req.params.postId );
  res.render("comment_form", { title: "Leave a comment" });
};

exports.comment_create_post = [
  body("comment", "Comment cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    const comment = new Comment({
      author: req.user._id,
      timestamp: new Date(),
      content: req.body.comment,
      errors: errors,
    });
    if (!errors.isEmpty()) {
      res.render("comment_form", {
        comment: comment,
        title: "Add a comment",
        errors: errors.array(),
      });
      return;
    } else {
      console.log("comment: ", comment);
      comment.save(function (err) {
        if (err) {
          return next(err);
        }
        Post.findByIdAndUpdate(req.params.postId, { $addToSet: {comments: [comment._id]}}).exec();
        res.redirect("/");
      });
    }
  },
];

exports.comment_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment update GET");
};

exports.comment_update_put = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment update POST");
};

exports.comment_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment delete GET");
};

exports.comment_delete = function (req, res, next) {
  Comment.findByIdAndRemove(req.params.commentId, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
