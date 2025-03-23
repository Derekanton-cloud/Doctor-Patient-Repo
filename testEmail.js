const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Your Gmail address
    pass: process.env.EMAIL_PASS    // Your Gmail app password
  }
});

// Email options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'derekanton30@gmail.com',
  subject: 'Test Email',
  text: 'Hello! This is a test email from Doctor-Patient platform.'
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info.response);
  }
});
