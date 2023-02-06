const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Event = require("../models/events");

//@desc  Processs book form
//@route POST

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Event.create(req.body);
    res.redirect("/dash/payment");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

module.exports = router;
