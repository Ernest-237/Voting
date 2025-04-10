const express = require('express');
const router = express.Router();
const db = require('../database');

// Récupérer tous les votes
router.get('/', async (req, res) => {
  try {
    const [votes] = await db.query(`
      SELECT v.*, c.name as candidate_name, c.number as candidate_number, c.type as candidate_type
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      ORDER BY v.date DESC
    `);
    res.json(votes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

// Récupérer les statistiques des votes
router.get('/stats', async (req, res) => {
  try {
    // Total des votes et montant
    const [[total]] = await db.query(`
      SELECT 
        COUNT(*) as totalVotes,
        SUM(amount) as totalAmount
      FROM votes
      WHERE status = 'completed'
    `);
    
    // Votes aujourd'hui
    const [[today]] = await db.query(`
      SELECT 
        COUNT(*) as todayVotes,
        SUM(amount) as todayAmount
      FROM votes
      WHERE DATE(date) = CURDATE() AND status = 'completed'
    `);
    
    res.json({
      totalVotes: total.totalVotes || 0,
      totalAmount: total.totalAmount || 0,
      todayVotes: today.todayVotes || 0,
      todayAmount: today.todayAmount || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

// Supprimer un vote
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le vote avant suppression pour mettre à jour le compteur du candidat
    const [[vote]] = await db.query('SELECT * FROM votes WHERE id = ?', [id]);
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote non trouvé' });
    }
    
    // Supprimer le vote
    await db.query('DELETE FROM votes WHERE id = ?', [id]);
    
    // Mettre à jour le compteur du candidat
    await db.query('UPDATE candidates SET votes = votes - ? WHERE id = ?', [
      vote.vote_amount,
      vote.candidate_id
    ]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

// Modifier un vote
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { voteAmount } = req.body;
    
    if (!voteAmount || isNaN(voteAmount)) {
      return res.status(400).json({ error: 'Nombre de votes invalide' });
    }
    
    // Récupérer le vote avant modification
    const [[vote]] = await db.query('SELECT * FROM votes WHERE id = ?', [id]);
    
    if (!vote) {
      return res.status(404).json({ error: 'Vote non trouvé' });
    }
    
    // Calculer le nouveau montant (100 FCFA par vote)
    const newAmount = voteAmount * 100;
    
    // Mettre à jour le vote
    await db.query('UPDATE votes SET vote_amount = ?, amount = ? WHERE id = ?', [
      voteAmount,
      newAmount,
      id
    ]);
    
    // Mettre à jour le compteur du candidat
    const voteDifference = voteAmount - vote.vote_amount;
    await db.query('UPDATE candidates SET votes = votes + ? WHERE id = ?', [
      voteDifference,
      vote.candidate_id
    ]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de serveur' });
  }
});

module.exports = router;