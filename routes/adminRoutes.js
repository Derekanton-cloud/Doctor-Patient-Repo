const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');

// Parse admin credentials from the .env file
const admins = JSON.parse(process.env.ADMINS || '[]');

// Admin login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: Email: ${email}, Password: ${password}`);

    // Find admin by email
    const admin = admins.find(a => a.email === email);

    if (!admin) {
        console.log('❌ Admin not found');
        return res.status(401).send('Invalid credentials - Admin not found');
    }

    // Check password
    if (admin.password !== password) {
        console.log('❌ Incorrect password');
        return res.status(401).send('Invalid credentials - Incorrect password');
    }

    // Generate admin token
    const token = jwt.sign({ email: admin.email }, process.env.SESSION_SECRET, { expiresIn: '1h' });
    res.cookie('adminToken', token, { httpOnly: true });

    console.log('✅ Admin login successful');
    res.send('Successfully logged in!');
});

// Admin dashboard (protected route)
router.get('/dashboard', (req, res) => {
    const token = req.cookies.adminToken;

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).send('Unauthorized - No token');
    }

    try {
        jwt.verify(token, process.env.SESSION_SECRET);
        res.sendFile(path.join(__dirname, '../public/adminDashboard.html'));
    } catch (err) {
        console.log('❌ Invalid token');
        res.status(401).send('Unauthorized - Invalid token');
    }
});

// Admin logout
router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.send('Logged out successfully.');
});

module.exports = router;
