-- Table des administrateurs
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- Doit être hashé en production
  role ENUM('super_admin', 'admin', 'editor') DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_active (active)
);

-- Table des catégories de concours
CREATE TABLE contest_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cover_image VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  voting_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_active (active),
  INDEX idx_category_slug (slug)
);

-- Table des candidats
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  number VARCHAR(10),
  photo_url VARCHAR(255),
  description TEXT,
  type ENUM('miss', 'master', 'dance', 'chant', 'other') NOT NULL,
  category_id INT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES contest_categories(id) ON DELETE RESTRICT,
  INDEX idx_candidate_category (category_id),
  INDEX idx_candidate_active (active),
  INDEX idx_candidate_type (type)
);

-- Table des votes
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  voter_name VARCHAR(100) NOT NULL,
  voter_email VARCHAR(100),
  voter_phone VARCHAR(20),
  vote_count INT NOT NULL DEFAULT 1,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('mobile_money', 'credit_card', 'other') DEFAULT 'mobile_money',
  transaction_id VARCHAR(255) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE RESTRICT,
  INDEX idx_vote_candidate (candidate_id),
  INDEX idx_vote_transaction (transaction_id),
  INDEX idx_vote_status (payment_status),
  INDEX idx_vote_created (created_at)
);

-- Table pour les logs d'activité admin
CREATE TABLE admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_activity_admin (admin_id),
  INDEX idx_activity_created (created_at)
);