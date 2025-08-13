const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/examenController');

router.post('/', ExamController.createExam);
router.get('/', ExamController.getExams);
router.get('/:examen_id', ExamController.getExam);
router.put('/:examen_id', ExamController.updateExam);
router.delete('/:examen_id', ExamController.deleteExam);
router.patch('/:examen_id/publish', ExamController.updatePublishStatus);
router.delete('/multiple/:ids', ExamController.deleteMultipleExams);



module.exports = router;