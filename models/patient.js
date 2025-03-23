const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
    required: true,
  },
  govIdPatient: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
