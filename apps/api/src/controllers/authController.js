const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../model/userModel'); // Adjusting path based on your current repo layout

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        
        if (user) {
            const tokens = generateTokens(user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                ...tokens
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const tokens = generateTokens(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                ...tokens
            });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401);
            throw new Error('No refresh token provided');
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }

        const tokens = generateTokens(user._id);
        res.json(tokens);
    } catch (error) {
        res.status(401);
        next(new Error('Invalid or expired refresh token'));
    }
};

const logout = async (req, res, next) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

const me = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, refresh, logout, me };