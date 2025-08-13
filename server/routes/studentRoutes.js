const express = require('express');
const router = express.Router();
const {
  getStudents,
  createStudent,
  getStudentById,
  getStudentByEmail,
  getStudentsByParcoursNiveau,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.route('/email/:email')
  .get(getStudentByEmail);

router.route('/parcours-niveau/:parcoursNiveauId')
  .get(getStudentsByParcoursNiveau);

module.exports = router;