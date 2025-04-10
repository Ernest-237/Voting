CREATE TABLE candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  department VARCHAR(100),
  number VARCHAR(10),
  photoUrl TEXT,
  type ENUM('miss', 'master'),
  votes INT DEFAULT 0
);

CREATE TABLE votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  candidateId INT,
  voterName VARCHAR(100),
  voterPhone VARCHAR(20),
  voteAmount INT,
  amount INT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidateId) REFERENCES candidates(id)
);
