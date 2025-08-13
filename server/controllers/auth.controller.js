// server/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { comparePassword } = require('../utils/password');
const config = require('../config/config');

class AuthController {
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      config.JWT_SECRET,
      { expiresIn: '5h' }
    );
  }

  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Cette adresse email existe déjà' });
      }

      const userId = await User.create({ name, email, password });
      const token = AuthController.generateToken(userId);

      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Cette adresse email n\'existe pas' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Mot de passe invalide' });
      }

      const token = AuthController.generateToken(user.id);
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      delete user.password;
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
  }

  static async updateName(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: 'Le nom est requis' });
      }

      const updated = await User.update(req.user.id, { name });
      
      if (!updated) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (error) {
      console.error('Update name error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du nom' });
    }
  }

  static async updateEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ message: 'Email invalide' });
      }

      // Vérifier si l'email est déjà utilisé
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Cette adresse email est déjà utilisée' });
      }

      const updated = await User.update(req.user.id, { email });
      
      if (!updated) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (error) {
      console.error('Update email error:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'email' });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const deleted = await User.delete(req.user.id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du compte' });
    }
  }
}

module.exports = AuthController;