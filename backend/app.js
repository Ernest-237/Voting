require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const morgan = require('morgan');
const voteRoutes = require('./routes/votes'); // Importation des routes

// Gestion des erreurs simplifiée directement dans app.js
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Configuration de la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hitbamas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

// Test de connexion à la base de données
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Connecté à la base de données MySQL avec succès');
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Test de requête SQL réussi. Résultat:', rows[0].result);
  } catch (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

// Exécuter le test de connexion
testDatabaseConnection();

// Make pool available to routes
app.locals.pool = pool;

// Route de test pour la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS server_time, DATABASE() AS db_name, VERSION() AS db_version');
    res.json({
      success: true,
      data: rows[0],
      message: 'Connexion à la base de données établie'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Échec de la connexion à la base de données',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Utilisation des routes - toutes les routes dans votes.js seront préfixées par '/api'
app.use('/api', voteRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Capture des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL frontend autorisée: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Gestion des arrêts propres
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
    pool.end();
    process.exit(0);
  });
});

module.exports = app;