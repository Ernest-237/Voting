-- Candidats
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  description TEXT,
  age INT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  candidate_id INT NOT NULL,
  voter_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  payment_id VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- Administrateurs
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuration de l'événement
CREATE TABLE event_config (
  id INT PRIMARY KEY DEFAULT 1,
  event_name VARCHAR(100) NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  vote_price DECIMAL(10,2) NOT NULL,
  banner_url VARCHAR(255),
  description TEXT
);