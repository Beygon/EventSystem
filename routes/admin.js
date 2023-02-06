const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../config/auth");
const Event = require("../models/events");
const User = require("../models/Users");
const { roles } = require("../config/constants");
const users = require("../models/Users");

//@desc renders admins dashboard
//get request

router.get("/dashboard", ensureAuthenticated, ensureAdmin, (req, res) => {
  res.render("admin/admin", {
    layout: "admin",
    name: req.user.username,
  });
});

//@desc renders booked events page
//A get request
router.get("/booked", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const booked = await Event.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("admin/booked", {
      layout: "admin",
      name: req.user.username,
      booked,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//@desc renders users page
//A get request
router.get("/users", ensureAuthenticated, ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.render("admin/users", {
      layout: "admin",
      name: req.user.username,
      users,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//@desc ensures admin
function ensureAdmin(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.render("error/404");
  }
}

// @desc renders update page
router.get(
  "/update/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    try {
      const even = await Event.findById({ _id: req.params.id }).lean();

      if (!even) {
        return res.render("erro/500");
      }
      res.render("admin/update", {
        even,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

//@desc habdles update
//
router.put(
  "/update/:id",
  ensureAdmin,
  ensureAuthenticated,
  async (req, res) => {
    let ev = await Event.findById(req.params.id).lean();
    if (!ev) {
      return res.render("error/500");
    }

    ev = await Event.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect("/admin/booked");
  }
);

//@desc renders admins events
// a get requests
router.get("/events", ensureAdmin, ensureAuthenticated, (req, res) => {
  res.render("admin/events", {
    layout: "admin",
  });
});

//@desc renders add events page
//a get request
router.get("/events/add", ensureAdmin, ensureAuthenticated, (req, res) => {
  res.render("admin/add", {});
});

//@desc renders service page
//@ a get request to /services
router.get("/services", ensureAdmin, ensureAuthenticated, (req, res) => {
  res.render("admin/services", {
    layout: "admin",
  });
});

//@desc renders add form
//a get request to /add

router.get("/services/add", ensureAdmin, ensureAuthenticated, (req, res) => {
  res.render("admin/addService");
});

//@desc handles add services to the db
//  request

module.exports = router;
