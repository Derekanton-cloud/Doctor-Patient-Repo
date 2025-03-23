const Patient = require("../models/patient");

// Get Patient Profile
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Get patient profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Patient Profile
exports.updatePatientProfile = async (req, res) => {
  try {
    const { bloodGroup, medicalHistory } = req.body;
    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.bloodGroup = bloodGroup || patient.bloodGroup;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;

    await patient.save();

    res.status(200).json({ message: "Profile updated successfully", patient });
  } catch (error) {
    console.error("Update patient profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
