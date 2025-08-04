const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateTempPassword = require('../utils/password');
const sendLoginEmailToAttorney = require('../utils/mailer');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// ✅ Register Controller (no token)
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'All fields are required',
                data: null
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'Email already registered',
                data: null
            });
        }

        const newUser = new User({ fullName, email, password, role });
        await newUser.save();

        return res.status(200).json({
            statusCode: 1,
            status: 'success',
            message: 'Registration successful. Please log in.',
            data: null
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 0,
            status: 'error',
            message: 'Server error',
            data: { error: err.message }
        });
    }
};

// ✅ Login Controller (returns token and user inside `data`)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'Invalid credentials',
                data: null
            });
        }

        const token = generateToken(user);

        const userData = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            token: token
        };

        return res.status(200).json({
            statusCode: 1,
            status: 'success',
            message: 'Login successful',
            data: userData
        });
    } catch (err) {
        return res.status(500).json({
            statusCode: 0,
            status: 'error',
            message: 'Server error',
            data: { error: err.message }
        });
    }
};


exports.registerAttorney = async (req, res) => {
    try {
        const { email, fullName } = req.body;

        // ✅ Validate required fields
        if (!email || !fullName) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'Full name and email are required',
                data: null
            });
        }

        // ✅ Fetch the requesting user and check role
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({
                statusCode: 0,
                status: 'error',
                message: 'Access denied. Only admins can register attorneys.',
                data: null
            });
        }

        // ✅ Check if email is already registered
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                statusCode: 0,
                status: 'error',
                message: 'Email already registered',
                data: null
            });
        }

        // ✅ Generate and save temp password
        const tempPassword = generateTempPassword();

        await User.create({
            email,
            fullName,
            role: 'attorney',
            password: tempPassword // Store as hash in real-world usage
        });

        // ✅ Send email with credentials
        await sendLoginEmailToAttorney(email, tempPassword);

        res.status(201).json({
            statusCode: 1,
            status: 'success',
            message: 'Attorney registered and email sent',
            data: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            statusCode: 0,
            status: 'error',
            message: 'Attorney registration failed',
            data: null
        });
    }
};
