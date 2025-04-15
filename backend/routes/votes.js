// routes/votes.js - Version adaptée pour PostgreSQL
const express = require('express');
const router = express.Router();

// Helper pour gérer les erreurs de base de données
const handleDbError = (res, error, context) => {
  console.error(`Database error in ${context}:`, error);
  res.status(500).json({ 
    success: false, 
    error: 'Database operation failed',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Middleware de validation pour les catégories
const validateCategory = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: 'Category name is required and must be at least 2 characters long' 
    });
  }
  next();
};

// Middleware de validation pour les candidats
const validateCandidate = (req, res, next) => {
  const { name, type, categoryId } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: 'Candidate name is required and must be at least 2 characters long' 
    });
  }
  
  if (!type || !['miss', 'master', 'dance', 'chant'].includes(type)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid type is required (miss, master, dance, chant)' 
    });
  }
  
  if (!categoryId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Category ID is required' 
    });
  }
  
  next();
};

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'OK', 
    timestamp: new Date(),
    dbStatus: 'Connected'
  });
});

// ROUTES PUBLIQUES

// Obtenir les candidats par catégorie
router.get('/candidates/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const pool = req.app.locals.pool;
    
    // Vérifier d'abord que la catégorie existe
    const categoryResult = await pool.query(
      'SELECT id FROM contest_categories WHERE name = $1 AND active = true',
      [category]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Category not found or inactive' 
      });
    }
    
    const result = await pool.query(
      `SELECT c.id, c.name, c.department, c.number, c.photo_url as "photoUrl", 
       c.description, c.type, c.category_id as "categoryId",
       COALESCE(SUM(v.vote_count), 0) as votes
       FROM candidates c
       LEFT JOIN votes v ON v.candidate_id = c.id AND v.payment_status = 'completed'
       WHERE c.active = true AND c.category_id = $1
       GROUP BY c.id`,
      [categoryResult.rows[0].id]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    handleDbError(res, error, 'fetching candidates by category');
  }
});

// Enregistrer un vote
router.post('/votes', async (req, res) => {
  try {
    const { candidateId, voterName, voterPhone, voteCount, amount, transactionId } = req.body;
    
    // Validation des données
    if (!candidateId || !voterName || !voteCount || !amount || !transactionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: candidateId, voterName, voteCount, amount, transactionId' 
      });
    }

    const pool = req.app.locals.pool;
    
    // Vérifier que le candidat existe et est actif
    const candidateResult = await pool.query(
      'SELECT id FROM candidates WHERE id = $1 AND active = true',
      [candidateId]
    );
    
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Candidate not found or inactive' 
      });
    }
    
    // Enregistrer le vote
    const result = await pool.query(
      `INSERT INTO votes 
       (candidate_id, voter_name, voter_phone, vote_count, amount, transaction_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed')
       RETURNING id`,
      [candidateId, voterName, voterPhone || null, voteCount, amount, transactionId]
    );
    
    res.status(201).json({ 
      success: true,
      data: { 
        voteId: result.rows[0].id,
        candidateId,
        voteCount,
        amount
      },
      message: 'Vote registered successfully' 
    });
  } catch (error) {
    handleDbError(res, error, 'registering vote');
  }
});

// Route d'authentification admin simplifiée (sans token)
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    const pool = req.app.locals.pool;
    
    // Note: En production, utilisez bcrypt pour comparer les mots de passe hashés
    const result = await pool.query(
      'SELECT id, username, role FROM admin_users WHERE username = $1 AND password = $2 AND active = true',
      [username, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials or inactive account' 
      });
    }
    
    const user = result.rows[0];
    
    // Simplement renvoyer les informations utilisateur sans token
    res.json({ 
      success: true,
      data: { 
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      message: 'Login successful'
    });
  } catch (error) {
    handleDbError(res, error, 'admin login');
  }
});

// ROUTES ADMINISTRATIVES (sans vérification de token)

// Gestion des catégories
router.get('/admin/categories', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(
      'SELECT id, name, description, active FROM contest_categories'
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    handleDbError(res, error, 'fetching categories');
  }
});

router.post('/admin/categories', validateCategory, async (req, res) => {
  try {
    const { name, description } = req.body;
    const pool = req.app.locals.pool;
    
    const result = await pool.query(
      'INSERT INTO contest_categories (name, description, active) VALUES ($1, $2, true) RETURNING id',
      [name.trim(), description?.trim() || null]
    );
    
    res.status(201).json({ 
      success: true,
      data: { 
        id: result.rows[0].id,
        name,
        description: description || null
      },
      message: 'Category created successfully' 
    });
  } catch (error) {
    handleDbError(res, error, 'creating category');
  }
});

// Gestion des candidats
router.get('/admin/candidates', async (req, res) => {
  try {
    const { category } = req.query;
    const pool = req.app.locals.pool;
    
    let query = `
      SELECT c.id, c.name, c.department, c.number, c.photo_url as "photoUrl", 
      c.description, c.type, c.category_id as "categoryId", c.active,
      cat.name as "categoryName",
      COALESCE(SUM(v.vote_count), 0) as "totalVotes",
      COALESCE(SUM(v.amount), 0) as "totalAmount"
      FROM candidates c
      LEFT JOIN votes v ON v.candidate_id = c.id AND v.payment_status = 'completed'
      JOIN contest_categories cat ON c.category_id = cat.id
    `;
    
    const params = [];
    
    if (category) {
      query += ' WHERE c.category_id = $1';
      params.push(category);
    }
    
    query += ' GROUP BY c.id, cat.name ORDER BY c.name';
    
    const result = await pool.query(query, params);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    handleDbError(res, error, 'fetching candidates');
  }
});

router.post('/admin/candidates', validateCandidate, async (req, res) => {
  try {
    const { name, department, number, photoUrl, description, type, categoryId } = req.body;
    const pool = req.app.locals.pool;
    
    // Vérifier que la catégorie existe
    const categoryResult = await pool.query(
      'SELECT id FROM contest_categories WHERE id = $1',
      [categoryId]
    );
    
    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Specified category does not exist' 
      });
    }
    
    const result = await pool.query(
      `INSERT INTO candidates 
       (name, department, number, photo_url, description, type, category_id, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING id`,
      [
        name.trim(),
        department?.trim() || null,
        number?.trim() || null,
        photoUrl?.trim() || null,
        description?.trim() || null,
        type,
        categoryId
      ]
    );
    
    // Récupérer le candidat créé avec les infos complètes
    const newCandidateResult = await pool.query(
      `SELECT c.id, c.name, c.department, c.number, c.photo_url as "photoUrl", 
       c.description, c.type, c.category_id as "categoryId", c.active,
       cat.name as "categoryName"
       FROM candidates c
       JOIN contest_categories cat ON c.category_id = cat.id
       WHERE c.id = $1`,
      [result.rows[0].id]
    );
    
    res.status(201).json({ 
      success: true,
      data: newCandidateResult.rows[0],
      message: 'Candidate created successfully' 
    });
  } catch (error) {
    handleDbError(res, error, 'creating candidate');
  }
});

router.delete('/admin/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    // Vérifier d'abord que le candidat existe
    const candidateResult = await pool.query(
      'SELECT id FROM candidates WHERE id = $1',
      [id]
    );
    
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Candidate not found' 
      });
    }
    
    // Désactiver plutôt que supprimer pour garder l'historique
    await pool.query(
      'UPDATE candidates SET active = false WHERE id = $1',
      [id]
    );
    
    res.json({ 
      success: true,
      message: 'Candidate deactivated successfully' 
    });
  } catch (error) {
    handleDbError(res, error, 'deactivating candidate');
  }
});

// Statistiques
router.get('/admin/stats', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    
    // Nombre total de votes
    const totalVotesResult = await pool.query(
      'SELECT SUM(vote_count) as "totalVotes", SUM(amount) as "totalAmount" FROM votes WHERE payment_status = $1',
      ['completed']
    );
    
    // Votes par catégorie
    const votesByCategoryResult = await pool.query(
      `SELECT cat.id, cat.name, 
       SUM(v.vote_count) as "totalVotes", 
       SUM(v.amount) as "totalAmount"
       FROM votes v
       JOIN candidates c ON v.candidate_id = c.id
       JOIN contest_categories cat ON c.category_id = cat.id
       WHERE v.payment_status = $1
       GROUP BY cat.id, cat.name`,
      ['completed']
    );
    
    // Top candidats
    const topCandidatesResult = await pool.query(
      `SELECT c.id, c.name, c.type, cat.name as category,
       SUM(v.vote_count) as "totalVotes"
       FROM votes v
       JOIN candidates c ON v.candidate_id = c.id
       JOIN contest_categories cat ON c.category_id = cat.id
       WHERE v.payment_status = $1
       GROUP BY c.id, cat.name
       ORDER BY "totalVotes" DESC
       LIMIT 5`,
      ['completed']
    );
    
    res.json({
      success: true,
      data: {
        totalVotes: totalVotesResult.rows[0]?.totalvotes || 0,
        totalAmount: totalVotesResult.rows[0]?.totalamount || 0,
        byCategory: votesByCategoryResult.rows,
        topCandidates: topCandidatesResult.rows
      }
    });
  } catch (error) {
    handleDbError(res, error, 'fetching stats');
  }
});

module.exports = router;