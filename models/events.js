const { min } = require("moment/moment");
const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  event: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    require: true,
  },
  starttime: {
    type: String,
    require: true,
  },
  endtime: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed"],
  },
  guest: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // email: {
  //   type: mongoose.Schema.Types.email,
  //   ref: "User",
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;
