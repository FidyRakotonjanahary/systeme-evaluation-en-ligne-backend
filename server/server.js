// server/server.js

const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const authMiddleware = require('./middleware/auth.middleware');



const studentRoutes = require('./routes/studentRoutes');
const mentionRoutes = require('./routes/mentionRoutes');
const parcoursRoutes = require('./routes/parcoursRoutes');
const niveauRoutes = require('./routes/niveauRoutes');
const matieresRoutes = require('./routes/matieresRoutes');
const parcoursNiveauRoutes = require('./routes/parcoursNiveauRoutes');
const examenRoutes = require('./routes/examenRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.use('/etudiants', studentRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/mentions', mentionRoutes);
app.use('/api/parcours', parcoursRoutes);
app.use('/api/niveaux', niveauRoutes);
app.use('/api/parcours-niveaux', parcoursNiveauRoutes);
app.use('/api/matieres',authMiddleware, matieresRoutes);
app.use('/api/examens',authMiddleware, examenRoutes);
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});