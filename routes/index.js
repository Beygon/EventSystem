const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//The Homepage
router.get("/", (req, res) => {
  res.render("homePage");
});

//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    layout: "dash",
    name: req.user.username,
  });
});

//Book
router.get("/book", (req, res) => {
  res.render("book");
});

//Profile
router.get("/profile", (req, res) => {
  res.render("profile");
});

//myevents
router.get("/myevents", (req, res) => {
  res.render("myevents");
});
module.exports = router;
