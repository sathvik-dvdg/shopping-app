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
        console.log('[AUTH DEBUG] Register controller entered');
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            console.log('[AUTH DEBUG] Validation failed: Missing fields');
            res.status(400);
            throw new Error('Please add all required fields');
        }

        console.log(`[AUTH DEBUG] Checking if user exists: ${email}`);
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('[AUTH DEBUG] User already exists');
            res.status(400);
            throw new Error('User already exists');
        }

        console.log('[AUTH DEBUG] Creating user in DB (Model will handle hashing)');
        // FIX: Pass raw password, let userModel.js handle the hashing
        const user = await User.create({ name, email, password });
        
        if (user) {
            console.log(`[AUTH DEBUG] User created successfully. ID: ${user._id}`);
            const tokens = generateTokens(user._id);
            console.log('[AUTH DEBUG] Tokens generated, sending response');
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                ...tokens
            });
        } else {
            console.log('[AUTH DEBUG] User creation failed silently in DB');
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error('[AUTH DEBUG] Register Error:', error.message);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        console.log('[AUTH DEBUG] Login controller entered');
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('[AUTH DEBUG] Validation failed: Missing credentials');
            res.status(400);
            throw new Error('Please provide email and password');
        }

        console.log(`[AUTH DEBUG] Querying DB for user: ${email}`);
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('[AUTH DEBUG] Login failed: User not found');
            res.status(401);
            throw new Error('Invalid credentials');
        }

        console.log('[AUTH DEBUG] User found. Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            console.log('[AUTH DEBUG] Password match confirmed. Generating tokens.');
            const tokens = generateTokens(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                ...tokens
            });
        } else {
            console.log('[AUTH DEBUG] Login failed: Password mismatch');
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('[AUTH DEBUG] Login Error:', error.message);
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

module.exports = { 
    registerUser: register, 
    loginUser: login, 
    refresh, 
    logout, 
    me 
};