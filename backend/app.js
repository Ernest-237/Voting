require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const morgan = require('morgan');
const voteRoutes = require('./routes/votes');

// Gestion des erreurs
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

const app = express();

// Configuration de la limite de taux
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://voting-app-gmfu.onrender.com',
    'http://localhost:5173' // Pour le développement local
  ],
  credentials: true
}));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configuration PostgreSQL pour Render (avec vos infos du screenshot)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://Mister_Hitbamas:VOTRE_MOT_DE_PASSE@dpg-cp9t5e21hbls73effsqg-a.frankfurt-postgres.render.com/voting_db_kprb',
  ssl: {
    rejectUnauthorized: false // Obligatoire pour Render
  }
});

// Test de connexion amélioré
async function testDatabaseConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connecté à PostgreSQL sur Render');
    
    // Test plus complet
    const dbInfo = await client.query(`
      SELECT 
        current_database() AS db_name,
        version() AS db_version,
        pg_size_pretty(pg_database_size(current_database())) AS db_size
    `);
    
    console.log('🔍 Info base de données:', dbInfo.rows[0]);
  } catch (err) {
    console.error('❌ Erreur de connexion:', err.stack);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}

testDatabaseConnection();

// Partage du pool avec les routes
app.locals.pool = pool;

// Route de santé pour Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Route de test DB améliorée
app.get('/api/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        NOW() AS server_time,
        current_database() AS db_name, 
        version() AS db_version,
        current_user AS db_user,
        inet_server_addr() AS db_host
    `);
    
    res.json({
      success: true,
      data: rows[0],
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
});

// Routes API
app.use('/api', voteRoutes);

// Gestion des erreurs
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Démarrage serveur
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Serveur démarré sur le port ${PORT}
  Environnement: ${process.env.NODE_ENV || 'development'}
  URL Frontend: ${process.env.FRONTEND_URL || 'non configuré'}
  Connexion DB: ${pool.options.connectionString.split('@')[1] || 'locale'}
  `);
});

// Gestion arrêt propre
['SIGTERM', 'SIGINT'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n${signal} reçu - Arrêt en cours...`);
    server.close(() => {
      pool.end();
      console.log('Toutes connexions fermées');
      process.exit(0);
    });
  });
});

module.exports = app;