// server/routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.getProfile);

router.put('/update-name', authMiddleware, AuthController.updateName);
router.put('/update-email', authMiddleware, AuthController.updateEmail);
router.delete('/delete', authMiddleware, AuthController.deleteAccount);

module.exports = router;