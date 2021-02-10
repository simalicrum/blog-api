const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.user_login_get = function (req, res, next) {
  res.render("login_form", { title: "Login" });
};

exports.user_login_post =
  ("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }));

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect("/");
};

exports.user_signup_get = function (req, res, next) {
  res.render("signup_form", { title: "Create an account" });
};

exports.user_signup_post = [
  body("firstname", "First name cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastname", "Last name cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password cannot be blank")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        status: "user",
      });
      if (!errors.isEmpty()) {
        console.log("errors: ", errors.array());
        res.render("signup_form", {
          user: user,
          title: "Create an account",
          errors: errors.array(),
        });
        return;
      } else {
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    });
  },
];

exports.user_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: User update GET");
};

exports.user_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: User update POST");
};

exports.user_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: User update GET");
};

exports.user_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: User update POST");
};