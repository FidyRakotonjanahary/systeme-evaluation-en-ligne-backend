const ExamModel = require('../models/examenModel');

const ExamController = {
    // Créer un examen
    createExam: async (req, res) => {
        try {
            const examId = await ExamModel.create(req.body);
            res.status(201).json({ 
                success: true,
                message: 'Examen créé avec succès', 
                examId 
            });
        } catch (error) {
            console.error('Erreur lors de la création de l\'examen:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Mettre à jour un examen
    updateExam: async (req, res) => {
        try {
            const { examen_id } = req.params;
            const updated = await ExamModel.update(examen_id, req.body);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    error: 'Examen non trouvé'
                });
            }

            res.json({ 
                success: true,
                message: 'Examen mis à jour avec succès' 
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'examen:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Supprimer un examen
    deleteExam: async (req, res) => {
        try {
            const { examen_id } = req.params;
            const deleted = await ExamModel.delete(examen_id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Examen non trouvé'
                });
            }

            res.json({ 
                success: true,
                message: 'Examen supprimé avec succès' 
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'examen:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    
    deleteMultipleExams: async (req, res) => {
        try {
            const examenIds = req.params.ids.split(',').map(Number);
            console.log('IDs reçus:', examenIds); // Log des IDs reçus
    
            if (!Array.isArray(examenIds) || examenIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Liste d\'IDs d\'examens invalide'
                });
            }
    
            const result = await ExamModel.deleteMultiple(examenIds);
            console.log('Résultat de la suppression:', result); // Log du résultat
    
            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
    
            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Erreur détaillée:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Récupérer tous les examens
    getExams: async (req, res) => {
        try {
            const examens = await ExamModel.findAll();
            
            return res.json({
                success: true,
                data: examens,
                total: examens.length
            });

        } catch (error) {
            console.error('Erreur lors de la récupération des examens:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },
    // Récupérer un examen par ID
    getExam: async (req, res) => {
        try {
            const { examen_id } = req.params;
            const exam = await ExamModel.findById(examen_id);
            
            if (!exam) {
                return res.status(404).json({
                    success: false,
                    error: 'Examen non trouvé'
                });
            }

            res.json({
                success: true,
                data: exam
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'examen:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Mettre à jour le statut de publication
    updatePublishStatus: async (req, res) => {
        try {
            const { examen_id } = req.params;
            const { est_actif } = req.body;

            if (typeof est_actif !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    error: 'Le statut de publication doit être un booléen'
                });
            }

            const updated = await ExamModel.updatePublishStatus(est_actif, examen_id);            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    error: 'Examen non trouvé'
                });
            }

            res.json({ 
                success: true,
                message: 'Statut de publication mis à jour avec succès' 
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut de publication:', error);
            res.status(500).json({ 
                success: false,
                error: 'Erreur serveur interne',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = ExamController;