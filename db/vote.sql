-- Table des administrateurs
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- Doit être hashé en production
  role VARCHAR(15) CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_admin_active ON admin_users (active);

-- Fonction pour mettre à jour le timestamp lors des mises à jour
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la mise à jour du timestamp des utilisateurs
CREATE TRIGGER update_admin_users_timestamp
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des catégories de concours
CREATE TABLE contest_categories (
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
CREATE INDEX idx_category_active ON contest_categories (active);
CREATE INDEX idx_category_slug ON contest_categories (slug);

-- Trigger pour la mise à jour du timestamp des catégories
CREATE TRIGGER update_contest_categories_timestamp
BEFORE UPDATE ON contest_categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des candidats
CREATE TABLE candidates (
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
CREATE INDEX idx_candidate_category ON candidates (category_id);
CREATE INDEX idx_candidate_active ON candidates (active);
CREATE INDEX idx_candidate_type ON candidates (type);

-- Trigger pour la mise à jour du timestamp des candidats
CREATE TRIGGER update_candidates_timestamp
BEFORE UPDATE ON candidates
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table des votes
CREATE TABLE votes (
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
CREATE INDEX idx_vote_candidate ON votes (candidate_id);
CREATE INDEX idx_vote_transaction ON votes (transaction_id);
CREATE INDEX idx_vote_status ON votes (payment_status);
CREATE INDEX idx_vote_created ON votes (created_at);

-- Table pour les logs d'activité admin
CREATE TABLE admin_activity_logs (
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
CREATE INDEX idx_activity_admin ON admin_activity_logs (admin_id);
CREATE INDEX idx_activity_created ON admin_activity_logs (created_at);

-- Insertion d'un utilisateur admin par défaut (à personnaliser)
INSERT INTO admin_users (username, password, role) 
VALUES ('admin', 'admin123', 'super_admin');