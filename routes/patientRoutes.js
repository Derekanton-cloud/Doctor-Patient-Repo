const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
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

// Patient Registration
router.post("/register", upload.single("govIdPatient"), async (req, res) => {
  try {
    const {
      firstName, lastName, dob, gender, phone, emergencyContact, email, password,
      bloodGroup, medicalHistory
    } = req.body;

    if (!firstName || !lastName || !dob || !gender || !phone || !emergencyContact || !email || !password ||
      !bloodGroup || !medicalHistory || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) return res.status(400).json({ message: "Patient already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      firstName, lastName, dob, gender, phone, emergencyContact, email, password: hashedPassword,
      bloodGroup, medicalHistory,
      govIdPatient: req.file.path,
      role: "patient"
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get Patient Profile (Protected Route)
router.get("/profile", authMiddleware(["patient"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
});

module.exports = router;
