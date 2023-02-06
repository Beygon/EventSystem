const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Event = require("../models/events");
const user = require("../models/Users");

//@desc  The Homepage
//Get
router.get("/", (req, res) => {
  res.render("homePage");
});

//@desc renders Dashboard page
//@desc get route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    layout: "dash",
    name: req.user.username,
  });
});

//@desc   Myevents route
//@desc   render myevents page
router.get("/myevents", ensureAuthenticated, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).lean();

    res.render("myevents", {
      layout: "dash",
      name: req.user.username,
      events,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//@desc render booking page
//@desc     render book page
router.get("/book", ensureAuthenticated, (req, res) => {
  res.render("book", {
    layout: "dash",
    name: req.user.username,
  });
});

//@desc renders admin page
//@desc get
router.get("/admin", ensureAuthenticated, (req, res) => {
  res.render("admin/admin", {
    layout: "admin",
    name: req.user.username,
  });
});

//@desc renders profile page
// A get request
router.get("/profile", ensureAuthenticated, (req, res) => {
  const { username, email, phone } = req.user;
  res.render("profile", {
    layout: "dash",
    username,
    email,
    phone,
  });
});

//@desc renders payment page
//a get requesr
router.get("/payment", ensureAuthenticated, (req, res) => {
  res.render("payment", {
    layout: "dash",
    amount: req.user.amount,
  });
});
module.exports = router;
