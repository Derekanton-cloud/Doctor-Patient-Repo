const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctor");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// PDF Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// Doctor Registration
router.post("/register", upload.fields([
  { name: "licenseFile", maxCount: 1 },
  { name: "boardDoc", maxCount: 1 },
  { name: "govId", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      firstName, lastName, dob, gender, phone, emergencyContact, email, password,
      license, specialization, languages, availability, hospital
    } = req.body;

    if (!firstName || !lastName || !dob || !gender || !phone || !emergencyContact || !email || !password ||
      !license || !specialization || !languages || !availability || !hospital) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      firstName, lastName, dob, gender, phone, emergencyContact, email, password: hashedPassword,
      license, specialization, languages, availability, hospital,
      licenseFile: req.files.licenseFile[0].path,
      boardDoc: req.files.boardDoc[0].path,
      govId: req.files.govId[0].path,
      role: "doctor",
      approved: false
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registration successful. Awaiting admin approval." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get Pending Approvals (Admin Use Only)
router.get("/pending-approvals", authMiddleware(["admin"]), async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({ approved: false });
    res.status(200).json(pendingDoctors);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Approve Doctor (Admin Use Only)
router.post("/approve/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });

    doctor.approved = true;
    await doctor.save();
    res.status(200).json({ message: "Doctor approved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get Doctor Profile (Protected Route)
router.get("/profile", authMiddleware(["doctor"]), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
