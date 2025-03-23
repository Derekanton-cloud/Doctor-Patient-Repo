const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  license: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  licenseFile: {
    type: String,
    required: true,
  },
  boardDoc: {
    type: String,
    required: true,
  },
  govId: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
