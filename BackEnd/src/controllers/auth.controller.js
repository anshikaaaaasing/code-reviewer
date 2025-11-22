const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userDB = require('../database/userDB');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

// Validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

class AuthController {
  // Signup
  static async signup(req, res) {
    try {
      const { email, password, confirmPassword, name } = req.body;
      console.log('Signup request:', { email, name });

      // Validation
      if (!email || !password || !confirmPassword) {
        console.error('Missing fields');
        return res.status(400).json({ error: 'Email, password, and confirm password are required' });
      }

      if (!validateEmail(email)) {
        console.error('Invalid email format:', email);
        return res.status(400).json({ error: 'Invalid email format' });
      }

      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        console.error('Password validation failed:', passwordValidation.error);
        return res.status(400).json({ error: passwordValidation.error });
      }

      // Create user
      const user = new User(email, password, name || email.split('@')[0]);
      console.log('Creating user...');
      const createdUser = await userDB.create(user);
      console.log('User created:', createdUser);

      // Generate token
      const token = jwt.sign(
        { id: createdUser.id, email: createdUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      console.log('Token generated, sending response');
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name
        }
      });
    } catch (error) {
      console.error('Signup error:', error.message, error.stack);
      res.status(400).json({ error: error.message });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Find user
      const user = await userDB.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Find user id
      const allUsers = await userDB.getAll();
      const userWithId = allUsers.find(u => u.email === email);

      // Generate token
      const token = jwt.sign(
        { id: userWithId.id, email: userWithId.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: {
          id: userWithId.id,
          email: userWithId.email,
          name: userWithId.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }

  // Verify token
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userDB.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: user.name
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userDB.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Logout (client-side token removal, but can add token blacklist if needed)
  static async logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // Verify email for password reset
  static async verifyEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await userDB.findByEmail(email);
      if (!user) {
        return res.status(404).json({ exists: false, message: 'Email not found' });
      }

      // Return a security question
      const question = 'What is your favorite color?'; // Default question - can be customized per user
      res.status(200).json({
        exists: true,
        question,
        message: 'Email verified'
      });
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({ error: 'Server error during email verification' });
    }
  }

  // Verify security answer
  static async verifySecurityAnswer(req, res) {
    try {
      const { email, answer } = req.body;

      if (!email || !answer) {
        return res.status(400).json({ error: 'Email and answer are required' });
      }

      const user = await userDB.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Simple validation - in production, store hashed security answers
      // For now, we'll accept any non-empty answer as a simple verification
      // In a real app, you'd check against a stored security question answer
      const isAnswerValid = answer.trim().length > 0;

      if (!isAnswerValid) {
        return res.status(401).json({ verified: false, error: 'Invalid answer' });
      }

      res.status(200).json({
        verified: true,
        message: 'Security answer verified'
      });
    } catch (error) {
      console.error('Security verification error:', error);
      res.status(500).json({ error: 'Server error during security verification' });
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email and new password are required' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.error });
      }

      const user = await userDB.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Hash the new password using User model
      const tempUser = new User(email, newPassword, user.name);
      await tempUser.hashPassword();

      // Update password in database
      await userDB.updatePassword(email, tempUser.password);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: 'Server error during password reset' });
    }
  }
}

module.exports = AuthController;
