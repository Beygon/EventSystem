const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const passport = require("passport");

//Login Page
router.get("/login", (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

//Register page
router.get("/register", (req, res) => {
  res.render("register", {
    layout: "login",
  });
});

//Handle register
router.post("/register", (req, res) => {
  const { username, email, password, password2, phone } = req.body;

  //Errors array
  const errors = [];

  //Check all fields
  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Enter all fields" });
  }

  //Check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords should match" });
  }

  //Check password match
  if (password.length < 6) {
    errors.push({ msg: "Passwords should be greater than 6" });
  }

  if (errors.length > 0) {
    res.render("register", {
      layout: "login",
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    //If validation passes

    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "User with that email exist!" });
        res.render("register", {
          layout: "login",
          errors,
          username,
          email,
          phone,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          username,
          email,
          phone,
          password,
        });

        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed
            newUser.password = hash;
            //Save the user,it returns a promise

            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are now registered,please login");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//Handle login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//Handle Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out!");
    res.redirect("/users/login");
  });
});

//Booking page

//Myevents Page
// router.get("/myevents", (req, res) => {
//   res.render("myevents", {
//     layout: "dash",
//   });
// });

module.exports = router;
