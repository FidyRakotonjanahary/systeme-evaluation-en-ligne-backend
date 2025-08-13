const pool = require('../config/db');

class ExamenModel {

     // Méthode pour gérer correctement le fuseau horaire
     static formatDateWithTimezone(date) {
        // Créer un objet Date à partir de la date d'entrée
        const inputDate = new Date(date);
        
        // Obtenir le décalage horaire en minutes entre l'heure locale et UTC
        // Par exemple, pour UTC+1, cela retournera -60
        const timezoneOffset = inputDate.getTimezoneOffset();
        
        // Ajuster la date en ajoutant le décalage horaire
        // On multiplie par -1 car getTimezoneOffset() retourne une valeur négative
        // pour les fuseaux horaires positifs
        const adjustedDate = new Date(inputDate.getTime() - (timezoneOffset * 60 * 1000));
        
        // Convertir en format MySQL (YYYY-MM-DD HH:mm:ss)
        return adjustedDate.toISOString().slice(0, 19).replace('T', ' ');
    }

    static async create(examData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
             // Conversion explicite de la date
  const formattedDate = this.formatDateWithTimezone(examData.date_passage);        
            // Insertion de l'examen
            const [examResult] = await connection.query(
                'INSERT INTO examens (matiere_id, parcours_niveau_id, duration, est_actif, maxTentative, date_passage) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    examData.matiere_id, 
                    examData.parcours_niveau_id, 
                    examData.duration, 
                    examData.est_actif, 
                    examData.maxTentative, 
                    formattedDate
                ]
            );
            const examId = examResult.insertId;
    
            // Insertion des questions et réponses
            for (const question of examData.questions) {
                // Insertion de la question
                const [questionResult] = await connection.query(
                    'INSERT INTO questions (examen_id, question_text) VALUES (?, ?)',
                    [examId, question.question_text]
                );
                const questionId = questionResult.insertId;
    
                // Insertion des réponses pour cette question
                for (const reponse of question.reponses) {
                    await connection.query(
                        'INSERT INTO reponses (question_id, reponse_text, est_correcte) VALUES (?, ?, ?)',
                        [questionId, reponse.reponse_text, reponse.est_correcte]
                    );
                }
            }
    
            // Si tout s'est bien passé, on valide la transaction
            await connection.commit();
            
            // On retourne l'ID de l'examen créé
            return {
                success: true,
                examId: examId,
                message: "Examen créé avec succès"
            };
    
        } catch (error) {
            // En cas d'erreur, on annule toutes les opérations
            await connection.rollback();
            
            // On retourne l'erreur avec plus de détails
            return {
                success: false,
                error: error.message,
                details: error.sqlMessage || "Une erreur est survenue lors de la création de l'examen"
            };
            
        } finally {
            // On libère toujours la connexion
            if (connection) {
                connection.release();
            }
        }
    }
    
    
    static async update(examen_id, examData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const formattedDate = this.formatDateWithTimezone(examData.date_passage);

            // Mettre à jour l'examen
            await connection.query(
                'UPDATE examens SET matiere_id = ?, parcours_niveau_id = ?, duration = ?, est_actif = ?, maxTentative = ?, date_passage = ? WHERE examen_id = ?',
                [examData.matiere_id, examData.parcours_niveau_id, examData.duration, examData.est_actif, examData.maxTentative, formattedDate, examen_id]
                );
                
            // Supprimer les anciennes questions et réponses
            await connection.query('DELETE FROM reponses WHERE question_id IN (SELECT question_id FROM questions WHERE examen_id = ?)', [examen_id]);
            await connection.query('DELETE FROM questions WHERE examen_id = ?', [examen_id]);

            // Insérer les nouvelles questions et réponses
            for (const question of examData.questions) {
                const [questionResult] = await connection.query(
                    'INSERT INTO questions (examen_id, question_text) VALUES (?, ?)',
                    [examen_id, question.question_text]
                    );
                const questionId = questionResult.insertId;
                
                for (const reponse of question.reponses) {
                    await connection.query(
                        'INSERT INTO reponses (question_id, reponse_text, est_correcte) VALUES (?, ?, ?)',
                        [questionId, reponse.reponse_text, reponse.est_correcte]
                        );
                    }
            }

            await connection.commit();
            return {
                success: true,
                message: "Examen mis à jour avec succès"
            };
        } catch (error) {
            await connection.rollback();
            return {
                success: false,
                error: error.message
            };
        } finally {
            connection.release();
        }
    }
    static async delete(examen_id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Supprimer d'abord les enregistrements dépendants
            await connection.query('DELETE FROM reponses WHERE question_id IN (SELECT question_id FROM questions WHERE examen_id = ?)', [examen_id]);
            await connection.query('DELETE FROM questions WHERE examen_id = ?', [examen_id]);
            await connection.query('DELETE FROM tentatives_examens WHERE examen_id = ?', [examen_id]);
            await connection.query('DELETE FROM examens WHERE examen_id = ?', [examen_id]);
            
            await connection.commit();
            return {
                success: true,
                message: "Examen supprimé avec succès"
            };
        } catch (error) {
            await connection.rollback();
            return {
                success: false,
                error: error.message
            };
        } finally {
            connection.release();
        }
    }
    static async deleteMultiple(examenIds) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Suppression des dépendances
            await connection.query(
                `DELETE FROM reponses WHERE question_id IN 
                 (SELECT question_id FROM questions WHERE examen_id IN (?))`,
                [examenIds]
            );
            
            // Utiliser directement le tableau pour les requêtes IN
            await connection.query(
                'DELETE FROM questions WHERE examen_id IN (?)',
                [examenIds]
            );
            
            await connection.query(
                'DELETE FROM tentatives_examens WHERE examen_id IN (?)',
                [examenIds]
            );
            
            await connection.query(
                'DELETE FROM examens WHERE examen_id IN (?)',
                [examenIds]
            );
    
            await connection.commit();
            return {
                success: true,
                message: `${examenIds.length} examens supprimés avec succès`
            };
        } catch (error) {
            await connection.rollback();
            console.error('Erreur dans deleteMultiple:', error); // Ajout de log
            return {
                success: false,
                error: error.message
            };
        } finally {
            connection.release();
        }
    }

    
    static async updatePublishStatus(est_actif, examen_id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            const [result] = await connection.query(
                'UPDATE examens SET est_actif = ? WHERE examen_id = ?',
                [est_actif, examen_id]
            );
            
            await connection.commit();
            
            return {
                success: result.affectedRows > 0,
                message: result.affectedRows > 0 ? "Statut mis à jour" : "Aucun changement"
            };
            
        } catch (error) {
            await connection.rollback();
            return {
                success: false,
                error: error.message
            };
        } finally {
            connection.release();
        }
    }

    static async findAll() {
        const query = `
            SELECT 
                e.examen_id,
                m.nom_matiere,
                e.date_passage,
                e.est_actif,
                e.duration
            FROM examens e
            JOIN matieres m ON m.matiere_id = e.matiere_id
            ORDER BY e.date_passage DESC
        `;
        
        const [examens] = await pool.query(query);
        return examens;
    }

    static async findById(examen_id) {
        const [exams] = await pool.query(`
            SELECT e.*,
            n.niveau_id,
            p.parcours_id,
            m.matiere_id,
            m.nom_matiere
            FROM examens e
            LEFT JOIN parcours_niveaux pn ON e.parcours_niveau_id = pn.parcours_niveau_id
            JOIN niveaux n ON pn.niveau_id = n.niveau_id
            JOIN parcours p ON pn.parcours_id = p.parcours_id
            JOIN matieres m ON e.matiere_id = m.matiere_id
            WHERE e.examen_id = ?
        `, [examen_id]);

        if (exams.length === 0) return null;

        const exam = exams[0];

        const [questions] = await pool.query(`
            SELECT 
                q.question_id,
                q.question_text,
                r.reponse_id,
                r.reponse_text,
                r.est_correcte
            FROM questions q
            LEFT JOIN reponses r ON q.question_id = r.question_id
            WHERE q.examen_id = ?
            ORDER BY q.question_id, r.reponse_id
        `, [examen_id]);

        return {
            ...exam,
            questions: this.structureQuestions(questions)
        };
    }

    static structureQuestions(questions) {
        const structuredQuestions = [];
        const questionMap = new Map();

        questions.forEach(row => {
            if (!questionMap.has(row.question_id)) {
                const question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    reponses: []
                };
                questionMap.set(row.question_id, question);
                structuredQuestions.push(question);
            }

            if (row.reponse_id) {
                const question = questionMap.get(row.question_id);
                question.reponses.push({
                    reponse_id: row.reponse_id,
                    reponse_text: row.reponse_text,
                    est_correcte: row.est_correcte
                });
            }
        });

        return structuredQuestions;
    }
}

module.exports = ExamenModel;