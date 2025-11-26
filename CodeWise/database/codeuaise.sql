-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: codewisedb
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alternativas_nivelamento`
--

DROP TABLE IF EXISTS `alternativas_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternativas_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pergunta_id` int NOT NULL,
  `texto` varchar(255) NOT NULL,
  `correta` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `pergunta_id` (`pergunta_id`),
  CONSTRAINT `alternativas_nivelamento_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas_nivelamento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativas_nivelamento`
--

LOCK TABLES `alternativas_nivelamento` WRITE;
/*!40000 ALTER TABLE `alternativas_nivelamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `alternativas_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descricao` text,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Tiyulo` varchar(150) NOT NULL,
  `descricao` text,
  `admin_id` int DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modulo_id` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `conteudo` text,
  `ordem` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modulo_id` (`modulo_id`),
  CONSTRAINT `exercicios_ibfk_1` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `ordem` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso_id` (`curso_id`),
  CONSTRAINT `modulos_ibfk_1` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perguntas_nivelamento`
--

DROP TABLE IF EXISTS `perguntas_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perguntas_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teste_id` int NOT NULL,
  `enunciado` text NOT NULL,
  `tipo` enum('multipla_escolha','dissertativa') DEFAULT 'multipla_escolha',
  `nivel` enum('basico','intermediario','avancado') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teste_id` (`teste_id`),
  CONSTRAINT `perguntas_nivelamento_ibfk_1` FOREIGN KEY (`teste_id`) REFERENCES `teste_nivelamento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perguntas_nivelamento`
--

LOCK TABLES `perguntas_nivelamento` WRITE;
/*!40000 ALTER TABLE `perguntas_nivelamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `perguntas_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso`
--

DROP TABLE IF EXISTS `progresso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `curso_id` int NOT NULL,
  `exercicio_id` int NOT NULL,
  `status` enum('nao_iniciada','em_andamento','concluida') DEFAULT 'nao_iniciada',
  `ultima_visualizacao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `curso_id` (`curso_id`),
  KEY `exercicio_id` (`exercicio_id`),
  CONSTRAINT `progresso_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `users` (`id`),
  CONSTRAINT `progresso_ibfk_2` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`),
  CONSTRAINT `progresso_ibfk_3` FOREIGN KEY (`exercicio_id`) REFERENCES `exercicios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso`
--

LOCK TABLES `progresso` WRITE;
/*!40000 ALTER TABLE `progresso` DISABLE KEYS */;
/*!40000 ALTER TABLE `progresso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questoes`
--

DROP TABLE IF EXISTS `questoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `avaliacoes_id` int NOT NULL,
  `enunciado` text,
  `tipo` enum('multipla_escolha','dissertativa') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `avaliacoes_id` (`avaliacoes_id`),
  CONSTRAINT `questoes_ibfk_1` FOREIGN KEY (`avaliacoes_id`) REFERENCES `avaliacoes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questoes`
--

LOCK TABLES `questoes` WRITE;
/*!40000 ALTER TABLE `questoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `questoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respostas_nivelamento`
--

DROP TABLE IF EXISTS `respostas_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `pergunta_id` int NOT NULL,
  `alternativa_id` int DEFAULT NULL,
  `resposta_texto` text,
  `data_resposta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_id` (`users_id`),
  KEY `pergunta_id` (`pergunta_id`),
  KEY `alternativa_id` (`alternativa_id`),
  CONSTRAINT `respostas_nivelamento_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  CONSTRAINT `respostas_nivelamento_ibfk_2` FOREIGN KEY (`pergunta_id`) REFERENCES `perguntas_nivelamento` (`id`),
  CONSTRAINT `respostas_nivelamento_ibfk_3` FOREIGN KEY (`alternativa_id`) REFERENCES `alternativas_nivelamento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respostas_nivelamento`
--

LOCK TABLES `respostas_nivelamento` WRITE;
/*!40000 ALTER TABLE `respostas_nivelamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `respostas_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado_nivelamento`
--

DROP TABLE IF EXISTS `resultado_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `nivel_final` enum('basico','intermediario','avancado') NOT NULL,
  `pontuacao_total` int DEFAULT NULL,
  `data_avaliacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_id` (`users_id`),
  CONSTRAINT `resultado_nivelamento_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado_nivelamento`
--

LOCK TABLES `resultado_nivelamento` WRITE;
/*!40000 ALTER TABLE `resultado_nivelamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `resultado_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teste_nivelamento`
--

DROP TABLE IF EXISTS `teste_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teste_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) DEFAULT 'teste de nivelamento',
  `descricao` text,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teste_nivelamento`
--

LOCK TABLES `teste_nivelamento` WRITE;
/*!40000 ALTER TABLE `teste_nivelamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `teste_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `pontuacao_total` int DEFAULT '0',
  `moedas` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (4,4,'bia',0,0),(6,6,'professor',0,0);
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` enum('aluno','admin') NOT NULL DEFAULT 'aluno',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'bia@gmail.com','bia','$2a$10$enQsGtg8ebvgvNgcxMD58.szHYwPfga5pPwdBhhjgeKcq6NKEdENC','2025-10-31 13:14:11','aluno'),(6,'professor@gmail.com','professor','$2a$10$yslsQ31q2gjobuA/FVax0OhdgIq2VmWdTNPbWQJbjgcPyZV/K8Pg.','2025-10-31 13:24:37','aluno');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06 10:50:53
ALTER TABLE users 
ADD COLUMN leveling_completed TINYINT(1) DEFAULT 0,
ADD COLUMN level VARCHAR(50) DEFAULT NULL;

DROP TABLE IF EXISTS respostas_nivelamento;
DROP TABLE IF EXISTS alternativas_nivelamento;
DROP TABLE IF EXISTS perguntas_nivelamento;
DROP TABLE IF EXISTS teste_nivelamento;
DROP TABLE IF EXISTS resultado_nivelamento;

-- 1. Tabela das PERGUNTAS
CREATE TABLE teste_nivelamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enunciado TEXT NOT NULL
);

-- 2. Tabela das ALTERNATIVAS (Opções de cada pergunta)
CREATE TABLE alternativas_nivelamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta_id INT NOT NULL,
    texto TEXT NOT NULL,
    correta TINYINT(1) DEFAULT 0,
    FOREIGN KEY (pergunta_id) REFERENCES teste_nivelamento(id) ON DELETE CASCADE
);

-- 3. Tabela das RESPOSTAS DO USUÁRIO (Histórico)
CREATE TABLE respostas_nivelamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pergunta_id INT NOT NULL,
    alternativa_escolhida_id INT NOT NULL,
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pergunta_id) REFERENCES teste_nivelamento(id) ON DELETE CASCADE,
    FOREIGN KEY (alternativa_escolhida_id) REFERENCES alternativas_nivelamento(id) ON DELETE CASCADE
);

-- === INSERINDO AS QUESTÕES ===

-- Questão 1
INSERT INTO teste_nivelamento (id, enunciado) VALUES (1, 'Qual das opções declara corretamente uma função em JavaScript?');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(1, 'function = minhaFunc() {}', 0),
(1, 'minhaFunc function() {}', 0),
(1, 'function minhaFunc() {}', 1),
(1, 'func minhaFunc() {}', 0);

-- Questão 2
INSERT INTO teste_nivelamento (id, enunciado) VALUES (2, 'O método usado para adicionar um elemento ao final de um array é:');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(2, 'append()', 0),
(2, 'add()', 0),
(2, 'push()', 1),
(2, 'concat()', 0);

-- Questão 3
INSERT INTO teste_nivelamento (id, enunciado) VALUES (3, 'A estrutura switch é usada como alternativa ao if/else quando há múltiplos casos baseados em um mesmo valor.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(3, 'Verdadeiro', 1),
(3, 'Falso', 0);

-- Questão 4
INSERT INTO teste_nivelamento (id, enunciado) VALUES (4, 'O que o código "console.log(10 == \'10\', 10 === \'10\')" imprime?');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(4, 'true false', 1),
(4, 'false true', 0),
(4, 'true true', 0),
(4, 'false false', 0);

-- Questão 5
INSERT INTO teste_nivelamento (id, enunciado) VALUES (5, 'Para converter uma string em número inteiro, usamos parse__________().');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(5, 'Text', 0),
(5, 'Float', 0),
(5, 'Int', 1),
(5, 'Number', 0);

-- Questão 6
INSERT INTO teste_nivelamento (id, enunciado) VALUES (6, 'O método map() percorre um array e retorna um novo array transformado.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(6, 'Verdadeiro', 1),
(6, 'Falso', 0);

-- Questão 7
INSERT INTO teste_nivelamento (id, enunciado) VALUES (7, 'Qual saída o código a seguir gera? function teste(a = 5, b = 10) { return a + b; } console.log(teste(2));');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(7, '7', 0),
(7, '12', 1),
(7, '15', 0),
(7, 'undefined', 0);

-- Questão 8
INSERT INTO teste_nivelamento (id, enunciado) VALUES (8, 'O operador __________ é usado para verificar tanto o valor quanto o tipo de uma variável.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(8, '==', 0),
(8, '=', 0),
(8, '===', 1),
(8, ':=', 0);

-- Questão 9
INSERT INTO teste_nivelamento (id, enunciado) VALUES (9, 'O que o código imprime? let a = [1, 2, 3]; let b = a; b.push(4); console.log(a);');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(9, '[1, 2, 3]', 0),
(9, '[1, 2, 3, 4]', 1),
(9, '[4, 3, 2, 1]', 0),
(9, 'Erro de referência', 0);

-- Questão 10
INSERT INTO teste_nivelamento (id, enunciado) VALUES (10, 'O operador typeof pode ser usado para identificar o tipo de uma variável em tempo de execução.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(10, 'Verdadeiro', 1),
(10, 'Falso', 0);

-- Questão 11
INSERT INTO teste_nivelamento (id, enunciado) VALUES (11, 'Sobre arrow functions, é correto afirmar que:');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(11, 'São funções que sempre precisam de return', 0),
(11, 'Criam um novo this', 0),
(11, 'Herdam o this do escopo onde foram criadas', 1),
(11, 'Só funcionam em classes', 0);

-- Questão 12
INSERT INTO teste_nivelamento (id, enunciado) VALUES (12, 'O método __________ é usado para remover o último elemento de um array.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(12, 'pop()', 1),
(12, 'remove()', 0),
(12, 'delete()', 0),
(12, 'drop()', 0);

-- Questão 13
INSERT INTO teste_nivelamento (id, enunciado) VALUES (13, 'O que acontece ao tentar alterar uma propriedade de um objeto declarado com const?');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(13, 'Gera erro por reatribuição', 0),
(13, 'Muda o valor da variável usuario', 0),
(13, 'Altera a propriedade nome normalmente', 1),
(13, 'Deleta o objeto', 0);

-- Questão 14
INSERT INTO teste_nivelamento (id, enunciado) VALUES (14, 'Para aguardar a execução de uma Promise dentro de uma função assíncrona, usamos a palavra-chave:');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(14, 'wait', 0),
(14, 'hold', 0),
(14, 'await', 1),
(14, 'defer', 0);

-- Questão 15
INSERT INTO teste_nivelamento (id, enunciado) VALUES (15, 'Em JavaScript, funções podem ser passadas como parâmetros para outras funções.');
INSERT INTO alternativas_nivelamento (pergunta_id, texto, correta) VALUES 
(15, 'Verdadeiro', 1),
(15, 'Falso', 0);

CREATE TABLE IF NOT EXISTS user_logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_login (user_id, login_date) -- Garante apenas um registro por dia por usuário
);

ALTER TABLE curso CHANGE Tiyulo titulo VARCHAR(150) NOT NULL;
-- ============================================================
-- 1. ESTRUTURA DO BANCO (DDL)
-- ============================================================

-- Garante que o admin (professor) existe para vincular o curso (ajuste o ID se necessário)
-- INSERT IGNORE INTO users (id, username, email, password, tipo) VALUES (6, 'professor', 'professor@gmail.com', 'senha_hash', 'admin');

-- Criar tabela de Questões vinculadas aos Exercícios
CREATE TABLE IF NOT EXISTS questoes_exercicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercicio_id INT NOT NULL,
    enunciado TEXT NOT NULL,
    tipo ENUM('multipla_escolha', 'verdadeiro_falso', 'completar') DEFAULT 'multipla_escolha',
    ordem INT DEFAULT NULL,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE CASCADE
);

-- Criar tabela de Alternativas para as questões
CREATE TABLE IF NOT EXISTS alternativas_exercicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questao_id INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    correta TINYINT(1) DEFAULT 0,
    FOREIGN KEY (questao_id) REFERENCES questoes_exercicio(id) ON DELETE CASCADE
);

-- ============================================================
-- 2. INSERÇÃO DE DADOS (DML)
-- ============================================================

-- 2.1 CRIAR O CURSO
INSERT INTO curso (titulo, descricao, admin_id) 
VALUES ('Desenvolvedor JavaScript Fullstack', 'Curso completo do iniciante ao avançado em JS.', 6);

SET @curso_id = LAST_INSERT_ID();

-- ============================================================
-- MÓDULO 1: BÁSICO
-- ============================================================
INSERT INTO modulos (curso_id, titulo, ordem) VALUES (@curso_id, 'MÓDULO BÁSICO – Fundamentos do JavaScript', 1);
SET @mod_basico = LAST_INSERT_ID();

-- --- Atividade 1: Introdução ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 1 – Introdução ao JavaScript', 'Conceitos iniciais.', 1);
SET @ex_1 = LAST_INSERT_ID();

-- Q1
INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_1, 'O JavaScript é uma linguagem de programação que:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, 'Só funciona em servidores.', 0),
(@q, 'Serve apenas para estilizar páginas web.', 0),
(@q, 'Permite adicionar interatividade a páginas web.', 1),
(@q, 'É usada exclusivamente para criar bancos de dados.', 0),
(@q, 'Não pode ser usada fora do navegador.', 0);

-- Q2
INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_1, '“JavaScript é a mesma linguagem que Java.”', 'verdadeiro_falso', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);

-- Q3
INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_1, 'Qual das opções corretamente insere um script JavaScript em uma página HTML?', 'multipla_escolha', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, '<script src="app.css"></script>', 0),
(@q, '<js>...</js>', 0),
(@q, '<script src="app.js"></script>', 1),
(@q, '<javascript>...</javascript>', 0),
(@q, '<link rel="script" href="app.js">', 0);

-- Q4
INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_1, 'O JavaScript pode ser executado tanto no __________ quanto no Node.js.', 'completar', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, 'navegador', 1),
(@q, 'terminal', 0),
(@q, 'CSS', 0),
(@q, 'servidor de banco de dados', 0),
(@q, 'editor de texto', 0);

-- Q5
INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_1, 'O JavaScript precisa obrigatoriamente de conexão com a internet para funcionar.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);


-- --- Atividade 2: Variáveis e Tipos ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 2 – Variáveis e Tipos de Dados', 'Declaração e tipagem.', 2);
SET @ex_2 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_2, 'Qual é a maneira correta de declarar uma variável que pode mudar de valor?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, 'var valor = 10', 0), (@q, 'const valor = 10', 0), (@q, 'let valor = 10', 1), (@q, 'define valor = 10', 0), (@q, 'fix valor = 10', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_2, 'Complete: o tipo de dado que representa valores verdadeiros ou falsos é o __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'number', 0), (@q, 'boolean', 1), (@q, 'string', 0), (@q, 'null', 0), (@q, 'undefined', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_2, 'const permite reatribuir o valor da variável.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_2, 'Qual das opções não é um tipo primitivo em JavaScript?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'string', 0), (@q, 'number', 0), (@q, 'object', 1), (@q, 'boolean', 0), (@q, 'undefined', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_2, 'O valor de typeof "Olá" será:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '"number"', 0), (@q, '"boolean"', 0), (@q, '"string"', 1), (@q, '"undefined"', 0), (@q, '"object"', 0);


-- --- Atividade 3: Operadores ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 3 – Operadores', 'Aritméticos e lógicos.', 3);
SET @ex_3 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_3, 'Qual é o resultado de 5 + "5"?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '10', 0), (@q, '"10"', 0), (@q, '"55"', 1), (@q, 'erro', 0), (@q, 'undefined', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_3, 'O operador === compara tanto o valor quanto o __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'tipo', 1), (@q, 'tamanho', 0), (@q, 'índice', 0), (@q, 'escopo', 0), (@q, 'caractere', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_3, 'O operador % é usado para obter o resto de uma divisão.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_3, 'Qual expressão retorna true?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '5 == "5"', 1), (@q, '5 === "5"', 0), (@q, '"a" > "b"', 0), (@q, '10 < 5', 0), (@q, 'false && true', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_3, 'O operador || retorna verdadeiro quando:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Ambas as expressões são falsas', 0), (@q, 'Pelo menos uma é verdadeira', 1), (@q, 'Ambas são verdadeiras', 0), (@q, 'As expressões são iguais', 0), (@q, 'Nenhuma alternativa', 0);


-- --- Atividade 4: Estruturas de Controle ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 4 – Estruturas de Controle', 'Condicionais.', 4);
SET @ex_4 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_4, 'O comando if é usado para:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Criar loops', 0), (@q, 'Declarar variáveis', 0), (@q, 'Tomar decisões', 1), (@q, 'Comparar arrays', 0), (@q, 'Interromper funções', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_4, 'O else é executado apenas se a condição do if for falsa.', 'verdadeiro_falso', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_4, 'O comando switch é útil quando há __________ possíveis valores para uma mesma variável.', 'completar', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'vários', 1), (@q, 'nenhum', 0), (@q, 'apenas dois', 0), (@q, 'infinitos', 0), (@q, 'booleanos', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_4, 'O que acontece se nenhuma condição do switch for atendida e não houver default?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'O código gera erro', 0), (@q, 'O switch repete', 0), (@q, 'Nada acontece', 1), (@q, 'Ele executa o último case', 0), (@q, 'Ele retorna false', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_4, 'É possível aninhar estruturas if dentro de outras.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);


-- --- Atividade 5: Laços de Repetição ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 5 – Laços de Repetição', 'Loops e Iterações.', 5);
SET @ex_5 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_5, 'Qual laço é mais usado quando se sabe o número exato de repetições?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'while', 0), (@q, 'do...while', 0), (@q, 'for', 1), (@q, 'foreach', 0), (@q, 'loop', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_5, 'O laço while executa enquanto a condição for __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'indefinida', 0), (@q, 'verdadeira', 1), (@q, 'falsa', 0), (@q, 'nula', 0), (@q, 'vazia', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_5, 'O laço do...while executa pelo menos uma vez, mesmo que a condição seja falsa.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_5, 'for...of é usado para:', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Iterar sobre propriedades de objetos', 0), (@q, 'Iterar sobre os valores de um array', 1), (@q, 'Criar funções', 0), (@q, 'Interromper loops', 0), (@q, 'Declarar variáveis', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_5, 'O comando que interrompe um loop imediatamente é:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'stop', 0), (@q, 'end', 0), (@q, 'continue', 0), (@q, 'break', 1), (@q, 'exit', 0);


-- --- Atividade 6: Funções ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 6 – Funções', 'Declaração e invocação.', 6);
SET @ex_6 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_6, 'Qual é a sintaxe correta para declarar uma função chamada “somar”?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'fun somar() {}', 0), (@q, 'function somar() {}', 1), (@q, 'def somar() {}', 0), (@q, 'create somar() {}', 0), (@q, 'let somar = new Function()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_6, 'Uma Arrow Function usa o símbolo __________ para indicar sua sintaxe.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '=>', 1), (@q, '->', 0), (@q, '==', 0), (@q, '::', 0), (@q, '<>', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_6, 'Uma função pode retornar valores usando a palavra-chave return.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_6, 'Qual é o resultado do código? function dobro(x) { return x * 2; } console.log(dobro(5));', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '10', 1), (@q, '25', 0), (@q, '5', 0), (@q, 'undefined', 0), (@q, 'erro', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_6, 'Funções podem ser armazenadas em variáveis em JavaScript.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);


-- --- Atividade 7: Arrays e Objetos ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_basico, 'Atividade 7 – Arrays e Objetos', 'Estruturas de dados.', 7);
SET @ex_7 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_7, 'Qual método adiciona um item ao final de um array?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '.pop()', 0), (@q, '.shift()', 0), (@q, '.unshift()', 0), (@q, '.push()', 1), (@q, '.splice()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_7, 'O método .pop() remove o __________ elemento de um array.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'primeiro', 0), (@q, 'último', 1), (@q, 'aleatório', 0), (@q, 'central', 0), (@q, 'segundo', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_7, 'Em objetos, acessamos valores com objeto["propriedade"] ou objeto.propriedade.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_7, 'O que o código imprime? let pessoa = { nome: "Ana", idade: 20 }; console.log(pessoa.nome);', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '"pessoa"', 0), (@q, '"idade"', 0), (@q, '"Ana"', 1), (@q, '20', 0), (@q, 'undefined', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_7, 'Qual método pode remover e adicionar elementos em um array?', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '.push()', 0), (@q, '.splice()', 1), (@q, '.pop()', 0), (@q, '.slice()', 0), (@q, '.map()', 0);


-- ============================================================
-- MÓDULO 2: INTERMEDIÁRIO
-- ============================================================
INSERT INTO modulos (curso_id, titulo, ordem) VALUES (@curso_id, 'MÓDULO INTERMEDIÁRIO – Manipulação, Lógica e DOM', 2);
SET @mod_inter = LAST_INSERT_ID();

-- --- Atividade 1: Métodos de Array Avançados ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 1 – Métodos de Array Avançados', 'Map, Filter, Reduce.', 1);
SET @ex_i1 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i1, 'O método .map() é usado para:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, 'Filtrar elementos de um array', 0), 
(@q, 'Criar um novo array com base em transformações', 1), 
(@q, 'Somar todos os valores de um array', 0), 
(@q, 'Remover elementos duplicados', 0), 
(@q, 'Ordenar um array', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i1, 'O método .filter() retorna apenas os elementos que __________ a condição.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'quebram', 0), (@q, 'atendem', 1), (@q, 'ignoram', 0), (@q, 'rejeitam', 0), (@q, 'removem', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i1, '.reduce() pode ser usado para somar todos os elementos de um array numérico.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i1, 'Qual resultado é impresso? [1, 2, 3].find(x => x > 1);', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '1', 0), (@q, '2', 1), (@q, '3', 0), (@q, '[2, 3]', 0), (@q, 'undefined', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i1, 'O método que testa se algum elemento atende à condição é:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '.find()', 0), (@q, '.some()', 1), (@q, '.every()', 0), (@q, '.map()', 0), (@q, '.filter()', 0);


-- --- Atividade 2: Manipulação do DOM ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 2 – Manipulação do DOM', 'Interação com HTML.', 2);
SET @ex_i2 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i2, 'O que significa DOM?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Data Object Model', 0), (@q, 'Document Object Model', 1), (@q, 'Document Operation Map', 0), (@q, 'Data Oriented Management', 0), (@q, 'Dynamic Object Maker', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i2, 'O método document.getElementById() retorna um __________ HTML com o ID especificado.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'número', 0), (@q, 'array', 0), (@q, 'elemento', 1), (@q, 'texto', 0), (@q, 'objeto JSON', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i2, 'innerHTML altera apenas o texto de um elemento, e não pode incluir HTML.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i2, 'Qual comando cria um novo elemento <p> no DOM?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'document.newElement("p")', 0), (@q, 'create.element("p")', 0), (@q, 'document.createElement("p")', 1), (@q, 'Element.create("p")', 0), (@q, 'document.make("p")', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i2, 'Para adicionar um novo elemento ao corpo da página, usamos:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'document.body.remove()', 0), (@q, 'document.body.appendChild()', 1), (@q, 'document.body.replace()', 0), (@q, 'document.body.delete()', 0), (@q, 'document.body.filter()', 0);


-- --- Atividade 3: Eventos em JavaScript ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 3 – Eventos em JavaScript', 'Clicks, inputs e listeners.', 3);
SET @ex_i3 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i3, 'O evento disparado quando um botão é clicado é:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'keydown', 0), (@q, 'click', 1), (@q, 'submit', 0), (@q, 'hover', 0), (@q, 'press', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i3, 'Para adicionar um evento em JavaScript usamos o método __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'addEvent()', 0), (@q, 'addEventListener()', 1), (@q, 'setEvent()', 0), (@q, 'listenEvent()', 0), (@q, 'eventOn()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i3, 'O “event bubbling” faz o evento subir pela árvore do DOM.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i3, 'No código botao.addEventListener("click", () => alert("Olá!"));, o que acontece ao clicar?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'O código não funciona.', 0), (@q, 'Mostra um alerta com "Olá!".', 1), (@q, 'Mostra o texto no console.', 0), (@q, 'Muda o texto do botão.', 0), (@q, 'Recarrega a página.', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i3, 'Podemos ter mais de um addEventListener para o mesmo evento em um mesmo elemento.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);


-- --- Atividade 4: Escopo e Hoisting ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 4 – Escopo e Hoisting', 'Conceitos fundamentais.', 4);
SET @ex_i4 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i4, 'Qual variável tem escopo de bloco?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'var', 0), (@q, 'let', 1), (@q, 'global', 0), (@q, 'static', 0), (@q, 'none', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i4, 'O hoisting faz com que declarações de variáveis com var sejam __________ para o topo do escopo.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'apagadas', 0), (@q, 'movidas', 1), (@q, 'congeladas', 0), (@q, 'bloqueadas', 0), (@q, 'repetidas', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i4, 'let e const sofrem hoisting da mesma forma que var.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i4, 'O que o código imprime? console.log(x); var x = 10;', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, '10', 0), (@q, 'undefined', 1), (@q, 'erro', 0), (@q, 'null', 0), (@q, 'NaN', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i4, 'Qual é o escopo padrão de variáveis declaradas com var?', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Bloco', 0), (@q, 'Função', 1), (@q, 'Global e bloco', 0), (@q, 'Objeto', 0), (@q, 'DOM', 0);


-- --- Atividade 5: Callbacks e Temporizadores ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 5 – Callbacks e Temporizadores', 'Assincronicidade básica.', 5);
SET @ex_i5 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i5, 'Um callback é:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Uma função que retorna um objeto', 0), (@q, 'Uma função passada como argumento para outra função', 1), (@q, 'Um tipo de evento', 0), (@q, 'Um erro de código', 0), (@q, 'Um loop', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i5, 'O método setTimeout() executa uma função após um determinado __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'tempo', 1), (@q, 'evento', 0), (@q, 'erro', 0), (@q, 'loop', 0), (@q, 'clique', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i5, 'setInterval() executa uma função repetidamente em intervalos definidos.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i5, 'Como cancelamos um setInterval em execução?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'stopInterval()', 0), (@q, 'clearTimeout()', 0), (@q, 'clearInterval()', 1), (@q, 'pauseInterval()', 0), (@q, 'stop()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i5, 'Callbacks são executados imediatamente ao serem declarados.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);


-- --- Atividade 6: Boas Práticas e Organização ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_inter, 'Atividade 6 – Boas Práticas', 'Clean Code e organização.', 6);
SET @ex_i6 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i6, 'Qual das opções segue boas práticas de nomeação?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'let Qtd = 10', 0), (@q, 'let totalDeVendas = 10', 1), (@q, 'let t = 10', 0), (@q, 'let 123valor = 10', 0), (@q, 'let valorTotal$', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i6, 'O conceito de Clean Code busca tornar o código mais __________ e fácil de entender.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'bagunçado', 0), (@q, 'reutilizável', 0), (@q, 'legível', 1), (@q, 'performático', 0), (@q, 'rápido', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i6, 'Comentários devem explicar por que algo é feito, não apenas o que está sendo feito.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i6, 'Qual prática não é recomendada em JavaScript moderno?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Usar let e const', 0), (@q, 'Usar nomes descritivos', 0), (@q, 'Escrever funções longas e complexas', 1), (@q, 'Dividir o código em funções pequenas', 0), (@q, 'Adicionar comentários úteis', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_i6, 'Qual arquivo normalmente armazena funções reutilizáveis em um projeto JS?', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'index.html', 0), (@q, 'style.css', 0), (@q, 'main.js', 1), (@q, 'app.json', 0), (@q, 'data.csv', 0);


-- ============================================================
-- MÓDULO 3: AVANÇADO
-- ============================================================
INSERT INTO modulos (curso_id, titulo, ordem) VALUES (@curso_id, 'MÓDULO AVANÇADO – Conceitos Profundos e Ecossistema do JavaScript', 3);
SET @mod_avan = LAST_INSERT_ID();

-- --- Atividade 1: Promises e Async/Await ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 1 – Promises e Async/Await', 'Assincronicidade moderna.', 1);
SET @ex_a1 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a1, 'Uma Promise representa:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES 
(@q, 'Um valor imediato', 0), 
(@q, 'Um valor que pode ser retornado no futuro', 1), 
(@q, 'Uma função síncrona', 0), 
(@q, 'Um erro no código', 0), 
(@q, 'Um objeto JSON', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a1, 'O método .then() é usado para lidar com o resultado bem-sucedido de uma __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'função', 0), (@q, 'variável', 0), (@q, 'Promise', 1), (@q, 'classe', 0), (@q, 'API', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a1, 'O método .catch() trata erros em uma Promise.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a1, 'O que o await faz em uma função assíncrona?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Cria uma nova Promise', 0), (@q, 'Espera a Promise ser resolvida antes de continuar', 1), (@q, 'Interrompe o código indefinidamente', 0), (@q, 'Cancela a execução da função', 0), (@q, 'Transforma o código em síncrono', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a1, 'A palavra-chave async deve ser usada antes da função para permitir o uso de await.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);


-- --- Atividade 2: Fetch API e Requisições HTTP ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 2 – Fetch API e Requisições HTTP', 'Consumo de APIs.', 2);
SET @ex_a2 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a2, 'O método padrão do fetch() é:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'POST', 0), (@q, 'GET', 1), (@q, 'PUT', 0), (@q, 'DELETE', 0), (@q, 'PATCH', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a2, 'Para converter a resposta de uma requisição em JSON, usamos o método response.__________().', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'parse()', 0), (@q, 'json()', 1), (@q, 'stringify()', 0), (@q, 'data()', 0), (@q, 'convert()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a2, 'O fetch() retorna uma Promise.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a2, 'Em uma requisição POST, o que faz o campo body?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Define o tipo de resposta', 0), (@q, 'Envia os dados da requisição', 1), (@q, 'Configura os headers', 0), (@q, 'Interrompe a Promise', 0), (@q, 'Retorna o JSON', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a2, 'É necessário converter manualmente o corpo da resposta em JSON usando .json().', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);


-- --- Atividade 3: Classes e POO ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 3 – Classes e Programação Orientada a Objetos', 'POO em JS.', 3);
SET @ex_a3 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a3, 'Qual é a forma correta de criar uma classe em JavaScript?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'class Pessoa {}', 1), (@q, 'create class Pessoa {}', 0), (@q, 'new Pessoa = class {}', 0), (@q, 'object Pessoa {}', 0), (@q, 'defclass Pessoa {}', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a3, 'O método especial usado para inicializar valores dentro da classe é o __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'init()', 0), (@q, 'start()', 0), (@q, 'constructor()', 1), (@q, 'begin()', 0), (@q, 'setup()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a3, 'Classes podem herdar propriedades e métodos de outras classes usando extends.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a3, 'Qual palavra-chave é usada para chamar o construtor da classe-pai dentro de uma classe-filha?', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'super', 1), (@q, 'parent', 0), (@q, 'extends', 0), (@q, 'call', 0), (@q, 'base', 0);


-- --- Atividade 4: Closures e Escopo Léxico ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 4 – Closures e Escopo Léxico', 'Conceitos avançados.', 4);
SET @ex_a4 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a4, 'Um closure é:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Uma variável global', 0), (@q, 'Uma função dentro de outra que “lembra” o escopo onde foi criada', 1), (@q, 'Um tipo de Promise', 0), (@q, 'Uma função sem retorno', 0), (@q, 'Uma API de eventos', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a4, 'As closures funcionam porque o JavaScript possui __________ léxico.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'controle', 0), (@q, 'retorno', 0), (@q, 'escopo', 1), (@q, 'contexto', 0), (@q, 'vínculo', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a4, 'Closures são úteis para criar funções privadas.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a4, 'Cada chamada de uma closure compartilha o mesmo escopo.', 'verdadeiro_falso', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 0), (@q, 'Falso', 1);


-- --- Atividade 5: Prototypes, This, Bind, Call, Apply ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 5 – Prototypes e This', 'Contexto de execução.', 5);
SET @ex_a5 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a5, 'O this em JavaScript refere-se:', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Ao objeto global sempre', 0), (@q, 'Ao objeto que invoca a função', 1), (@q, 'À função atual', 0), (@q, 'À classe pai', 0), (@q, 'Ao escopo léxico', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a5, 'O método bind() cria uma __________ da função original com um novo valor de this.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'cópia', 1), (@q, 'versão assíncrona', 0), (@q, 'Promise', 0), (@q, 'referência', 0), (@q, 'variável', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a5, 'As funções call() e apply() servem para invocar uma função definindo manualmente o this.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a5, 'Qual das opções é verdadeira sobre prototypes?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Todo objeto tem um prototype', 1), (@q, 'Apenas classes têm prototype', 0), (@q, 'Prototypes são exclusivos do Node.js', 0), (@q, 'Prototypes não podem ser alterados', 0), (@q, 'Não existem em funções', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a5, 'O que Object.create() faz?', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Cria um objeto sem prototype', 0), (@q, 'Cria um novo objeto baseado em outro como prototype', 1), (@q, 'Copia propriedades de um objeto', 0), (@q, 'Cria classes', 0), (@q, 'Cria arrays', 0);


-- --- Atividade 6: RegEx e Web Storage ---
INSERT INTO exercicios (modulo_id, titulo, conteudo, ordem) VALUES (@mod_avan, 'Atividade 6 – Expressões Regulares e Web Storage', 'Ferramentas avançadas.', 6);
SET @ex_a6 = LAST_INSERT_ID();

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a6, 'O que /[0-9]+/ representa em uma RegEx?', 'multipla_escolha', 1);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Letras minúsculas', 0), (@q, 'Números de 0 a 9 (um ou mais)', 1), (@q, 'Espaços', 0), (@q, 'Caracteres especiais', 0), (@q, 'Palavras completas', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a6, 'Para verificar se uma RegEx encontra correspondência, usamos o método __________.', 'completar', 2);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'find()', 0), (@q, 'match()', 0), (@q, 'test()', 1), (@q, 'exec()', 0), (@q, 'scan()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a6, 'localStorage mantém os dados mesmo após fechar o navegador.', 'verdadeiro_falso', 3);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'Verdadeiro', 1), (@q, 'Falso', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a6, 'Qual método salva um item no localStorage?', 'multipla_escolha', 4);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'localStorage.addItem()', 0), (@q, 'localStorage.store()', 0), (@q, 'localStorage.setItem()', 1), (@q, 'localStorage.push()', 0), (@q, 'localStorage.save()', 0);

INSERT INTO questoes_exercicio (exercicio_id, enunciado, tipo, ordem) VALUES (@ex_a6, 'O método que remove um item específico do localStorage é:', 'multipla_escolha', 5);
SET @q = LAST_INSERT_ID();
INSERT INTO alternativas_exercicio (questao_id, texto, correta) VALUES (@q, 'deleteItem()', 0), (@q, 'remove()', 0), (@q, 'clearItem()', 0), (@q, 'removeItem()', 1), (@q, 'destroy()', 0);