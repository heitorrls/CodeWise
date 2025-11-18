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