const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const User = require("../models/user");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

const upload = multer({ dest: "uploads/" });

// Register Route
router.post("/register", upload.single("govId"), async (req, res) => {
  try {
    const {
      role, firstName, lastName, dob, gender, phone, emergencyContact,
      email, password, bloodGroup, medicalHistory,
      licenseNumber, specialization, languagesSpoken,
      availability, hospital
    } = req.body;

    // Validate required fields
    if (!role || !firstName || !lastName || !dob || !gender || !phone ||
        !emergencyContact || !email || !password || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (common fields)
    const newUser = new User({
      role,
      firstName,
      lastName,
      dob,
      gender,
      phone,
      emergencyContact,
      email,
      password: hashedPassword,
      govId: req.file.path
    });

    await newUser.save();

    // Create Doctor or Patient Record
    if (role === "doctor") {
      if (!licenseNumber || !specialization || !languagesSpoken || !availability || !hospital) {
        return res.status(400).json({ message: "Doctor-specific fields are required" });
      }

      const newDoctor = new Doctor({
        user: newUser._id,
        licenseNumber,
        specialization,
        languagesSpoken,
        availability,
        hospital,
        licenseFile: req.file.path,
        boardDoc: req.file.path
      });
      await newDoctor.save();
    } else if (role === "patient") {
      if (!bloodGroup || !medicalHistory) {
        return res.status(400).json({ message: "Patient-specific fields are required" });
      }

      const newPatient = new Patient({
        user: newUser._id,
        bloodGroup,
        medicalHistory
      });
      await newPatient.save();
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Token generation
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
    });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
