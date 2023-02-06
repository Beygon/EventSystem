const mongoose = require("mongoose");

const service = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const services = mongoose.model("Services", serviceWorkers);
module.exports = services;
