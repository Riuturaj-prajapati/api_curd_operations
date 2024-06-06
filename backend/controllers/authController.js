// backend/controllers/authController.js
require('dotenv').config()
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (email !== 'admin@codesfortomorrow.com' || password !== 'Admin123!@#') {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, process.env.SECRETE_KEY, { expiresIn: '1h' });
    res.json({ token });
};

module.exports = { login };
