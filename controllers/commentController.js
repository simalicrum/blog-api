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
  res.render("comment_form", { title: "Leave a comment", comment: { content: ""} });
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
      comment.save(function (err) {
        if (err) {
          return next(err);
        }
        Post.findByIdAndUpdate(req.params.postId, { $addToSet: {comments: [comment._id]}}).exec();
        res.redirect("/posts/" + req.params.postId);
      });
    }
  },
];

exports.comment_update_get = function (req, res, next) {
  Comment.findById(req.params.commentId)
  .exec((err, comment) => {
    if (err) {
      return next(err);
    }
    res.render("comment_form", {comment: comment, title: "Edit your comment", postId: req.params.postId});
  });
};

exports.comment_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment update POST");
};

exports.comment_delete_get = function (req, res, next) {
  res.render("comment_delete", {title: "This will permanently remove this comment. Are you sure?", commentId: req.params.commentId, postID: req.params.postId });
};

exports.comment_delete = function (req, res, next) {
  Comment.findByIdAndRemove(req.params.commentId, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/posts/" + req.params.postId);
  });
};
