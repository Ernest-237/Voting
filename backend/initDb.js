require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Nécessaire pour Render
  }
});

// Le script SQL est stocké dans la variable ci-dessous
const sqlScript = `
-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- Doit être hashé en production
  role VARCHAR(15) CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_active ON admin_users (active);

-- Fonction pour mettre à jour le timestamp lors des mises à jour
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la mise à jour du timestamp des utilisateurs
DROP TRIGGER IF EXISTS update_admin_users_timestamp ON admin_users;
CREATE TRIGGER update_admin_users_timestamp
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des catégories de concours
CREATE TABLE IF NOT EXISTS contest_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  voting_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_category_active ON contest_categories (active);
CREATE INDEX IF NOT EXISTS idx_category_slug ON contest_categories (slug);

-- Trigger pour la mise à jour du timestamp des catégories
DROP TRIGGER IF EXISTS update_contest_categories_timestamp ON contest_categories;
CREATE TRIGGER update_contest_categories_timestamp
BEFORE UPDATE ON contest_categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des candidats
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  number VARCHAR(10),
  photo_url VARCHAR(255),
  description TEXT,
  type VARCHAR(10) CHECK (type IN ('miss', 'master', 'dance', 'chant', 'other')) NOT NULL,
  category_id INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidate_category FOREIGN KEY (category_id) REFERENCES contest_categories(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_candidate_category ON candidates (category_id);
CREATE INDEX IF NOT EXISTS idx_candidate_active ON candidates (active);
CREATE INDEX IF NOT EXISTS idx_candidate_type ON candidates (type);

-- Trigger pour la mise à jour du timestamp des candidats
DROP TRIGGER IF EXISTS update_candidates_timestamp ON candidates;
CREATE TRIGGER update_candidates_timestamp
BEFORE UPDATE ON candidates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des votes
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER NOT NULL,
  voter_name VARCHAR(100) NOT NULL,
  voter_email VARCHAR(100),
  voter_phone VARCHAR(20),
  vote_count INTEGER NOT NULL DEFAULT 1,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(15) CHECK (payment_method IN ('mobile_money', 'credit_card', 'other')) DEFAULT 'mobile_money',
  transaction_id VARCHAR(255) NOT NULL,
  payment_status VARCHAR(10) CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'completed',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vote_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_vote_candidate ON votes (candidate_id);
CREATE INDEX IF NOT EXISTS idx_vote_transaction ON votes (transaction_id);
CREATE INDEX IF NOT EXISTS idx_vote_status ON votes (payment_status);
CREATE INDEX IF NOT EXISTS idx_vote_created ON votes (created_at);

-- Table pour les logs d'activité admin
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_activity_admin ON admin_activity_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON admin_activity_logs (created_at);

-- Insertion d'un utilisateur admin par défaut (uniquement s'il n'existe pas déjà)
INSERT INTO admin_users (username, password, role)
SELECT 'admin', 'admin123', 'super_admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');
`;

async function initializeDatabase() {
  let client;
  
  try {
    console.log('🔄 Connexion à la base de données PostgreSQL...');
    client = await pool.connect();
    
    console.log('🔄 Exécution des scripts SQL pour créer/initialiser les tables...');
    await client.query(sqlScript);
    
    console.log('✅ Base de données initialisée avec succès!');
    
    // Vérification des tables
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables disponibles dans la base de données:');
    rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Vérification de l'admin
    const adminResult = await client.query('SELECT id, username, role FROM admin_users');
    console.log(`👤 ${adminResult.rowCount} utilisateur(s) administrateur(s) trouvé(s)`);
    adminResult.rows.forEach(admin => {
      console.log(`   ID: ${admin.id}, Username: ${admin.username}, Role: ${admin.role}`);
    });
    
    return true;
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
    throw err;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Exécution de la fonction d'initialisation
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🚀 Initialisation DB terminée, le serveur peut démarrer');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erreur fatale:', err);
      process.exit(1);
    });
} else {
  // Utilisé comme module
  module.exports = { initializeDatabase };
}