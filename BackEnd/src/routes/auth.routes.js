const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// Auth routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/verify', AuthController.verifyToken);
router.get('/profile', AuthController.getProfile);

// Password reset routes
router.post('/verify-email', AuthController.verifyEmail);
router.post('/verify-security', AuthController.verifySecurityAnswer);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
