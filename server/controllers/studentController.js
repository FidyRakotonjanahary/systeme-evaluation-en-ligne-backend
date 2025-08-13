const StudentModel = require('../models/studentModel');

// Fonction utilitaire pour gérer les erreurs async
const {asyncHandler} = require('../utils/asyncHandler');


const StudentController = {
  // Renommer getStudents pour correspondre au modèle
  getStudents: asyncHandler(async (req, res) => {
    const etudiants = await StudentModel.findAll(); // au lieu de getStudents
    res.json(etudiants);
  }),

  // Renommer createEtudiant et corriger EtudiantModel
  createStudent: asyncHandler(async (req, res) => { // au lieu de createEtudiant
    const etudiant = await StudentModel.create(req.body); // au lieu de EtudiantModel
    res.status(201).json({
      message: 'Étudiant ajouté avec succès',
      etudiant
    });
  }),

  // Renommer getEtudiantById
  getStudentById: asyncHandler(async (req, res) => { // au lieu de getEtudiantById
    const etudiant = await StudentModel.findById(req.params.id); // au lieu de getById
    if (!etudiant) {
      res.status(404);
      throw new Error('Étudiant non trouvé');
    }
    res.json(etudiant);
  }),

  // Corriger le nom de la méthode
  getStudentByEmail: asyncHandler(async (req, res) => {
    const etudiant = await StudentModel.findByEmail(req.params.email); // au lieu de getStudentByEmail
    if (!etudiant) {
      res.status(404);
      throw new Error('Étudiant non trouvé');
    }
    res.json(etudiant);
  }),

  // Corriger le nom de la méthode
  getStudentsByParcoursNiveau: asyncHandler(async (req, res) => {
    const etudiants = await StudentModel.findByParcoursNiveau(req.params.parcoursNiveauId); // au lieu de getStudentsByParcoursNiveau
    res.json(etudiants);
  }),

  // Le nom est correct ici mais la méthode doit utiliser findById
  updateStudent: asyncHandler(async (req, res) => {
    const etudiant = await StudentModel.findById(req.params.id); // au lieu de getStudentById
    if (!etudiant) {
      res.status(404);
      throw new Error('Étudiant non trouvé');
    }
    
    await StudentModel.update(req.params.id, req.body);
    res.json({ message: 'Étudiant modifié avec succès' });
  }),

  deleteStudent: asyncHandler(async (req, res) => {
    const etudiant = await StudentModel.findById(req.params.id); // au lieu de getStudentById
    
    if (!etudiant) {
      res.status(404);
      throw new Error('Étudiant non trouvé');
    }
    
    await StudentModel.delete(req.params.id);
    res.json({ message: 'Étudiant suprimé avec succès' });
  })
  
};

module.exports = StudentController;