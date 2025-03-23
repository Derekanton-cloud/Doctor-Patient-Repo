const Doctor = require("../models/doctor");

// Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Get doctor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Doctor Profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, availability, hospital } = req.body;
    const doctor = await Doctor.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.specialization = specialization || doctor.specialization;
    doctor.availability = availability || doctor.availability;
    doctor.hospital = hospital || doctor.hospital;

    await doctor.save();

    res.status(200).json({ message: "Profile updated successfully", doctor });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Approve Doctor (Admin Only)
exports.approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({ message: "Doctor approved successfully" });
  } catch (error) {
    console.error("Approve doctor error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
