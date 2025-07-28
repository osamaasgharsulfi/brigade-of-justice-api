const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
