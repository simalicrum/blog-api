const async = require("async");
const { body, validationResult } = require("express-validator");

const Comment = require("../models/comment");
const User = require("../models/user");

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
  res.render("comment_form", { title: "Comment Page" });
};

exports.comment_create_comment = [
  body("title", "Title cannot be blank").trim().isLength({ min: 1 }).escape(),
  body("comment", "Comment cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    const comment = new Comment({
      title: req.body.title,
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
        res.redirect("/");
      });
    }
  },
];

exports.comment_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment update GET");
};

exports.comment_update_comment = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment update POST");
};

exports.comment_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Comment delete GET");
};

exports.comment_delete_comment = function (req, res, next) {
  Comment.findByIdAndRemove(req.body.commentid, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
