const express = require('express');
const router = express.Router();
const db = require('../database');

// Récupérer tous les candidats
router.get('/', async (req, res) => {
  try {
    const [candidates] = await db.query('SELECT * FROM candidates ORDER BY votes DESC');
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

// Récupérer les statistiques par candidat
router.get('/stats', async (req, res) => {
  try {
    const [candidates] = await db.query(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM votes WHERE candidate_id = c.id) as total_votes,
        (SELECT SUM(amount) FROM votes WHERE candidate_id = c.id) as total_amount
      FROM candidates c
      ORDER BY c.votes DESC
    `);
    
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

module.exports = router;