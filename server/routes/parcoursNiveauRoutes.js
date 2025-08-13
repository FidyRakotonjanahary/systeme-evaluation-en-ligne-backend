const express = require('express');
const ParcoursNiveauController = require('../controllers/parcoursNiveauController');
const router = express.Router();

router.get('/get-id', ParcoursNiveauController.getParcoursNiveauId);

module.exports = router;