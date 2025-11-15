const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { logActivity } = require('../utils/logger');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate userId if it doesn't exist (for existing users)
    if (!user.userId) {
      user.userId = Math.floor(Math.random() * 900000000 + 100000000).toString();
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const router = express.Router();

// Generate verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateCode();
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      emailVerificationCode: verificationCode
    });
    await user.save();

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'IGTC Email Verification',
        html: `
          <h2>Welcome to IGTC!</h2>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>Please verify your email to complete registration.</p>
        `
      });
    } catch (emailError) {
      // Email error - continue with registration
    }

    // Log registration
    await logActivity('success', 'User Registration', {
      userId: user._id,
      name: user.name,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Registration successful! Check your email for verification code.',
      email: email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email first',
        needsVerification: true,
        email: email
      });
    }

    // Generate userId if it doesn't exist (for existing users)
    if (!user.userId) {
      user.userId = Math.floor(Math.random() * 900000000 + 100000000).toString();
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // Log login
    await logActivity('info', 'User Login', {
      userId: user._id,
      name: user.name,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, userId: user.userId, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password - Send Code
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetCode = generateCode();
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.updateOne(
      { email },
      { 
        resetPasswordCode: resetCode,
        resetPasswordExpires: resetExpires
      }
    );

    // Log password reset request
    await logActivity('warning', 'Password Reset Request', {
      email: email,
      resetCode: resetCode,
      timestamp: new Date().toISOString()
    });
    
    try {
      await sendEmail({
        to: email,
        subject: 'IGTC Password Reset Code',
        html: `
          <h2>Password Reset Request</h2>
          <p>Your verification code is: <strong>${resetCode}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
      res.json({ message: 'Verification code sent to your email' });
    } catch (emailError) {
      // Still return success but log the email error
      res.json({ message: `Verification code sent to your email. Code: ${resetCode}` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify Email
router.post('/verify-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationCode: code
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    await User.updateOne(
      { email },
      { 
        emailVerified: true,
        $unset: { emailVerificationCode: 1 }
      }
    );

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    // Log email verification
    await logActivity('success', 'Email Verified', {
      userId: user._id,
      name: user.name,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: 'Email verified successfully',
      token,
      user: { id: user._id, userId: user.userId, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify Reset Code
router.post('/verify-reset-code', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, code, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne(
      { email, resetPasswordCode: code },
      { 
        password: hashedPassword,
        $unset: { resetPasswordCode: 1, resetPasswordExpires: 1 }
      }
    );

    // Log password reset completion
    await logActivity('success', 'Password Reset Completed', {
      email: email,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const userResponse = {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      college: user.college || '',
      state: user.state || '',
      ranking: user.ranking || 'Beginner',
      esportsPurpose: user.esportsPurpose || '',
      avatar: user.avatar || '',
      emailVerified: user.emailVerified
    };

    res.json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Profile
router.put('/profile', verifyToken, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('mobile').optional(),
  body('college').optional(),
  body('state').optional(),
  body('ranking').optional(),
  body('esportsPurpose').optional()
], async (req, res) => {
  try {
    const { name, mobile, college, state, ranking, esportsPurpose } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (college !== undefined) updateData.college = college;
    if (state !== undefined) updateData.state = state;
    if (ranking) updateData.ranking = ranking;
    if (esportsPurpose !== undefined) updateData.esportsPurpose = esportsPurpose;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    
    await logActivity('info', 'Profile Updated', {
      userId: user.userId,
      name: user.name,
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change Email Request
router.post('/change-email', verifyToken, [
  body('newEmail').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { newEmail } = req.body;

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const verificationCode = generateCode();
    await User.findByIdAndUpdate(req.user._id, {
      newEmail: newEmail,
      newEmailVerificationCode: verificationCode
    });

    try {
      await sendEmail({
        to: newEmail,
        subject: 'IGTC Email Change Verification',
        html: `
          <h2>Email Change Request</h2>
          <p>Your verification code is: <strong>${verificationCode}</strong></p>
          <p>Enter this code to confirm your new email address.</p>
        `
      });
    } catch (emailError) {
      // Email error - continue
    }

    res.json({ message: 'Verification code sent to new email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify New Email
router.post('/verify-new-email', verifyToken, [
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits')
], async (req, res) => {
  try {
    const { code } = req.body;

    if (!req.user.newEmailVerificationCode || req.user.newEmailVerificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      email: req.user.newEmail,
      $unset: { newEmail: 1, newEmailVerificationCode: 1 }
    });

    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;