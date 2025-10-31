-- Tabela de usuários existente, sem alterações
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Otimizado para armazenar hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Executa este comando para criar a tabela de perfis
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    pontuacao_total INT DEFAULT 0,
    moedas INT DEFAULT 0,
    avatar VARCHAR(255) DEFAULT 'macaco.png',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Executa este também, você precisará dele para a redefinição de senha
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (email),
    INDEX (code)
);
