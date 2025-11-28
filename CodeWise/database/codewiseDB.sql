-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: codewisedb
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `alternativas_exercicio`
--

DROP TABLE IF EXISTS `alternativas_exercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternativas_exercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questao_id` int NOT NULL,
  `texto` varchar(255) NOT NULL,
  `correta` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `questao_id` (`questao_id`),
  CONSTRAINT `alternativas_exercicio_ibfk_1` FOREIGN KEY (`questao_id`) REFERENCES `questoes_exercicio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=385 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativas_exercicio`
--

LOCK TABLES `alternativas_exercicio` WRITE;
/*!40000 ALTER TABLE `alternativas_exercicio` DISABLE KEYS */;
INSERT INTO `alternativas_exercicio` VALUES (1,1,'Só funciona em servidores.',0),(2,1,'Serve apenas para estilizar páginas web.',0),(3,1,'Permite adicionar interatividade a páginas web.',1),(4,1,'É usada exclusivamente para criar bancos de dados.',0),(5,1,'Não pode ser usada fora do navegador.',0),(6,2,'Verdadeiro',0),(7,2,'Falso',1),(8,3,'<script src=\"app.css\"></script>',0),(9,3,'<js>...</js>',0),(10,3,'<script src=\"app.js\"></script>',1),(11,3,'<javascript>...</javascript>',0),(12,3,'<link rel=\"script\" href=\"app.js\">',0),(13,4,'navegador',1),(14,4,'terminal',0),(15,4,'CSS',0),(16,4,'servidor de banco de dados',0),(17,4,'editor de texto',0),(18,5,'Verdadeiro',0),(19,5,'Falso',1),(20,6,'var valor = 10',0),(21,6,'const valor = 10',0),(22,6,'let valor = 10',1),(23,6,'define valor = 10',0),(24,6,'fix valor = 10',0),(25,7,'number',0),(26,7,'boolean',1),(27,7,'string',0),(28,7,'null',0),(29,7,'undefined',0),(30,8,'Verdadeiro',0),(31,8,'Falso',1),(32,9,'string',0),(33,9,'number',0),(34,9,'object',1),(35,9,'boolean',0),(36,9,'undefined',0),(37,10,'\"number\"',0),(38,10,'\"boolean\"',0),(39,10,'\"string\"',1),(40,10,'\"undefined\"',0),(41,10,'\"object\"',0),(42,11,'10',0),(43,11,'\"10\"',0),(44,11,'\"55\"',1),(45,11,'erro',0),(46,11,'undefined',0),(47,12,'tipo',1),(48,12,'tamanho',0),(49,12,'índice',0),(50,12,'escopo',0),(51,12,'caractere',0),(52,13,'Verdadeiro',1),(53,13,'Falso',0),(54,14,'5 == \"5\"',1),(55,14,'5 === \"5\"',0),(56,14,'\"a\" > \"b\"',0),(57,14,'10 < 5',0),(58,14,'false && true',0),(59,15,'Ambas as expressões são falsas',0),(60,15,'Pelo menos uma é verdadeira',1),(61,15,'Ambas são verdadeiras',0),(62,15,'As expressões são iguais',0),(63,15,'Nenhuma alternativa',0),(64,16,'Criar loops',0),(65,16,'Declarar variáveis',0),(66,16,'Tomar decisões',1),(67,16,'Comparar arrays',0),(68,16,'Interromper funções',0),(69,17,'Verdadeiro',1),(70,17,'Falso',0),(71,18,'vários',1),(72,18,'nenhum',0),(73,18,'apenas dois',0),(74,18,'infinitos',0),(75,18,'booleanos',0),(76,19,'O código gera erro',0),(77,19,'O switch repete',0),(78,19,'Nada acontece',1),(79,19,'Ele executa o último case',0),(80,19,'Ele retorna false',0),(81,20,'Verdadeiro',1),(82,20,'Falso',0),(83,21,'while',0),(84,21,'do...while',0),(85,21,'for',1),(86,21,'foreach',0),(87,21,'loop',0),(88,22,'indefinida',0),(89,22,'verdadeira',1),(90,22,'falsa',0),(91,22,'nula',0),(92,22,'vazia',0),(93,23,'Verdadeiro',1),(94,23,'Falso',0),(95,24,'Iterar sobre propriedades de objetos',0),(96,24,'Iterar sobre os valores de um array',1),(97,24,'Criar funções',0),(98,24,'Interromper loops',0),(99,24,'Declarar variáveis',0),(100,25,'stop',0),(101,25,'end',0),(102,25,'continue',0),(103,25,'break',1),(104,25,'exit',0),(105,26,'fun somar() {}',0),(106,26,'function somar() {}',1),(107,26,'def somar() {}',0),(108,26,'create somar() {}',0),(109,26,'let somar = new Function()',0),(110,27,'=>',1),(111,27,'->',0),(112,27,'==',0),(113,27,'::',0),(114,27,'<>',0),(115,28,'Verdadeiro',1),(116,28,'Falso',0),(117,29,'10',1),(118,29,'25',0),(119,29,'5',0),(120,29,'undefined',0),(121,29,'erro',0),(122,30,'Verdadeiro',1),(123,30,'Falso',0),(124,31,'.pop()',0),(125,31,'.shift()',0),(126,31,'.unshift()',0),(127,31,'.push()',1),(128,31,'.splice()',0),(129,32,'primeiro',0),(130,32,'último',1),(131,32,'aleatório',0),(132,32,'central',0),(133,32,'segundo',0),(134,33,'Verdadeiro',1),(135,33,'Falso',0),(136,34,'\"pessoa\"',0),(137,34,'\"idade\"',0),(138,34,'\"Ana\"',1),(139,34,'20',0),(140,34,'undefined',0),(141,35,'.push()',0),(142,35,'.splice()',1),(143,35,'.pop()',0),(144,35,'.slice()',0),(145,35,'.map()',0),(146,36,'Filtrar elementos de um array',0),(147,36,'Criar um novo array com base em transformações',1),(148,36,'Somar todos os valores de um array',0),(149,36,'Remover elementos duplicados',0),(150,36,'Ordenar um array',0),(151,37,'quebram',0),(152,37,'atendem',1),(153,37,'ignoram',0),(154,37,'rejeitam',0),(155,37,'removem',0),(156,38,'Verdadeiro',1),(157,38,'Falso',0),(158,39,'1',0),(159,39,'2',1),(160,39,'3',0),(161,39,'[2, 3]',0),(162,39,'undefined',0),(163,40,'.find()',0),(164,40,'.some()',1),(165,40,'.every()',0),(166,40,'.map()',0),(167,40,'.filter()',0),(168,41,'Data Object Model',0),(169,41,'Document Object Model',1),(170,41,'Document Operation Map',0),(171,41,'Data Oriented Management',0),(172,41,'Dynamic Object Maker',0),(173,42,'número',0),(174,42,'array',0),(175,42,'elemento',1),(176,42,'texto',0),(177,42,'objeto JSON',0),(178,43,'Verdadeiro',0),(179,43,'Falso',1),(180,44,'document.newElement(\"p\")',0),(181,44,'create.element(\"p\")',0),(182,44,'document.createElement(\"p\")',1),(183,44,'Element.create(\"p\")',0),(184,44,'document.make(\"p\")',0),(185,45,'document.body.remove()',0),(186,45,'document.body.appendChild()',1),(187,45,'document.body.replace()',0),(188,45,'document.body.delete()',0),(189,45,'document.body.filter()',0),(190,46,'keydown',0),(191,46,'click',1),(192,46,'submit',0),(193,46,'hover',0),(194,46,'press',0),(195,47,'addEvent()',0),(196,47,'addEventListener()',1),(197,47,'setEvent()',0),(198,47,'listenEvent()',0),(199,47,'eventOn()',0),(200,48,'Verdadeiro',1),(201,48,'Falso',0),(202,49,'O código não funciona.',0),(203,49,'Mostra um alerta com \"Olá!\".',1),(204,49,'Mostra o texto no console.',0),(205,49,'Muda o texto do botão.',0),(206,49,'Recarrega a página.',0),(207,50,'Verdadeiro',1),(208,50,'Falso',0),(209,51,'var',0),(210,51,'let',1),(211,51,'global',0),(212,51,'static',0),(213,51,'none',0),(214,52,'apagadas',0),(215,52,'movidas',1),(216,52,'congeladas',0),(217,52,'bloqueadas',0),(218,52,'repetidas',0),(219,53,'Verdadeiro',0),(220,53,'Falso',1),(221,54,'10',0),(222,54,'undefined',1),(223,54,'erro',0),(224,54,'null',0),(225,54,'NaN',0),(226,55,'Bloco',0),(227,55,'Função',1),(228,55,'Global e bloco',0),(229,55,'Objeto',0),(230,55,'DOM',0),(231,56,'Uma função que retorna um objeto',0),(232,56,'Uma função passada como argumento para outra função',1),(233,56,'Um tipo de evento',0),(234,56,'Um erro de código',0),(235,56,'Um loop',0),(236,57,'tempo',1),(237,57,'evento',0),(238,57,'erro',0),(239,57,'loop',0),(240,57,'clique',0),(241,58,'Verdadeiro',1),(242,58,'Falso',0),(243,59,'stopInterval()',0),(244,59,'clearTimeout()',0),(245,59,'clearInterval()',1),(246,59,'pauseInterval()',0),(247,59,'stop()',0),(248,60,'Verdadeiro',0),(249,60,'Falso',1),(250,61,'let Qtd = 10',0),(251,61,'let totalDeVendas = 10',1),(252,61,'let t = 10',0),(253,61,'let 123valor = 10',0),(254,61,'let valorTotal$',0),(255,62,'bagunçado',0),(256,62,'reutilizável',0),(257,62,'legível',1),(258,62,'performático',0),(259,62,'rápido',0),(260,63,'Verdadeiro',1),(261,63,'Falso',0),(262,64,'Usar let e const',0),(263,64,'Usar nomes descritivos',0),(264,64,'Escrever funções longas e complexas',1),(265,64,'Dividir o código em funções pequenas',0),(266,64,'Adicionar comentários úteis',0),(267,65,'index.html',0),(268,65,'style.css',0),(269,65,'main.js',1),(270,65,'app.json',0),(271,65,'data.csv',0),(272,66,'Um valor imediato',0),(273,66,'Um valor que pode ser retornado no futuro',1),(274,66,'Uma função síncrona',0),(275,66,'Um erro no código',0),(276,66,'Um objeto JSON',0),(277,67,'função',0),(278,67,'variável',0),(279,67,'Promise',1),(280,67,'classe',0),(281,67,'API',0),(282,68,'Verdadeiro',1),(283,68,'Falso',0),(284,69,'Cria uma nova Promise',0),(285,69,'Espera a Promise ser resolvida antes de continuar',1),(286,69,'Interrompe o código indefinidamente',0),(287,69,'Cancela a execução da função',0),(288,69,'Transforma o código em síncrono',0),(289,70,'Verdadeiro',1),(290,70,'Falso',0),(291,71,'POST',0),(292,71,'GET',1),(293,71,'PUT',0),(294,71,'DELETE',0),(295,71,'PATCH',0),(296,72,'parse()',0),(297,72,'json()',1),(298,72,'stringify()',0),(299,72,'data()',0),(300,72,'convert()',0),(301,73,'Verdadeiro',1),(302,73,'Falso',0),(303,74,'Define o tipo de resposta',0),(304,74,'Envia os dados da requisição',1),(305,74,'Configura os headers',0),(306,74,'Interrompe a Promise',0),(307,74,'Retorna o JSON',0),(308,75,'Verdadeiro',1),(309,75,'Falso',0),(310,76,'class Pessoa {}',1),(311,76,'create class Pessoa {}',0),(312,76,'new Pessoa = class {}',0),(313,76,'object Pessoa {}',0),(314,76,'defclass Pessoa {}',0),(315,77,'init()',0),(316,77,'start()',0),(317,77,'constructor()',1),(318,77,'begin()',0),(319,77,'setup()',0),(320,78,'Verdadeiro',1),(321,78,'Falso',0),(322,79,'super',1),(323,79,'parent',0),(324,79,'extends',0),(325,79,'call',0),(326,79,'base',0),(327,80,'Uma variável global',0),(328,80,'Uma função dentro de outra que “lembra” o escopo onde foi criada',1),(329,80,'Um tipo de Promise',0),(330,80,'Uma função sem retorno',0),(331,80,'Uma API de eventos',0),(332,81,'controle',0),(333,81,'retorno',0),(334,81,'escopo',1),(335,81,'contexto',0),(336,81,'vínculo',0),(337,82,'Verdadeiro',1),(338,82,'Falso',0),(339,83,'Verdadeiro',0),(340,83,'Falso',1),(341,84,'Ao objeto global sempre',0),(342,84,'Ao objeto que invoca a função',1),(343,84,'À função atual',0),(344,84,'À classe pai',0),(345,84,'Ao escopo léxico',0),(346,85,'cópia',1),(347,85,'versão assíncrona',0),(348,85,'Promise',0),(349,85,'referência',0),(350,85,'variável',0),(351,86,'Verdadeiro',1),(352,86,'Falso',0),(353,87,'Todo objeto tem um prototype',1),(354,87,'Apenas classes têm prototype',0),(355,87,'Prototypes são exclusivos do Node.js',0),(356,87,'Prototypes não podem ser alterados',0),(357,87,'Não existem em funções',0),(358,88,'Cria um objeto sem prototype',0),(359,88,'Cria um novo objeto baseado em outro como prototype',1),(360,88,'Copia propriedades de um objeto',0),(361,88,'Cria classes',0),(362,88,'Cria arrays',0),(363,89,'Letras minúsculas',0),(364,89,'Números de 0 a 9 (um ou mais)',1),(365,89,'Espaços',0),(366,89,'Caracteres especiais',0),(367,89,'Palavras completas',0),(368,90,'find()',0),(369,90,'match()',0),(370,90,'test()',1),(371,90,'exec()',0),(372,90,'scan()',0),(373,91,'Verdadeiro',1),(374,91,'Falso',0),(375,92,'localStorage.addItem()',0),(376,92,'localStorage.store()',0),(377,92,'localStorage.setItem()',1),(378,92,'localStorage.push()',0),(379,92,'localStorage.save()',0),(380,93,'deleteItem()',0),(381,93,'remove()',0),(382,93,'clearItem()',0),(383,93,'removeItem()',1),(384,93,'destroy()',0);
/*!40000 ALTER TABLE `alternativas_exercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alternativas_nivelamento`
--

DROP TABLE IF EXISTS `alternativas_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alternativas_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pergunta_id` int NOT NULL,
  `texto` text NOT NULL,
  `correta` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `pergunta_id` (`pergunta_id`),
  CONSTRAINT `alternativas_nivelamento_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `teste_nivelamento` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alternativas_nivelamento`
--

LOCK TABLES `alternativas_nivelamento` WRITE;
/*!40000 ALTER TABLE `alternativas_nivelamento` DISABLE KEYS */;
INSERT INTO `alternativas_nivelamento` VALUES (1,1,'function = minhaFunc() {}',0),(2,1,'minhaFunc function() {}',0),(3,1,'function minhaFunc() {}',1),(4,1,'func minhaFunc() {}',0),(5,2,'append()',0),(6,2,'add()',0),(7,2,'push()',1),(8,2,'concat()',0),(9,3,'Verdadeiro',1),(10,3,'Falso',0),(11,4,'true false',1),(12,4,'false true',0),(13,4,'true true',0),(14,4,'false false',0),(15,5,'Text',0),(16,5,'Float',0),(17,5,'Int',1),(18,5,'Number',0),(19,6,'Verdadeiro',1),(20,6,'Falso',0),(21,7,'7',0),(22,7,'12',1),(23,7,'15',0),(24,7,'undefined',0),(25,8,'==',0),(26,8,'=',0),(27,8,'===',1),(28,8,':=',0),(29,9,'[1, 2, 3]',0),(30,9,'[1, 2, 3, 4]',1),(31,9,'[4, 3, 2, 1]',0),(32,9,'Erro de referência',0),(33,10,'Verdadeiro',1),(34,10,'Falso',0),(35,11,'São funções que sempre precisam de return',0),(36,11,'Criam um novo this',0),(37,11,'Herdam o this do escopo onde foram criadas',1),(38,11,'Só funcionam em classes',0),(39,12,'pop()',1),(40,12,'remove()',0),(41,12,'delete()',0),(42,12,'drop()',0),(43,13,'Gera erro por reatribuição',0),(44,13,'Muda o valor da variável usuario',0),(45,13,'Altera a propriedade nome normalmente',1),(46,13,'Deleta o objeto',0),(47,14,'wait',0),(48,14,'hold',0),(49,14,'await',1),(50,14,'defer',0),(51,15,'Verdadeiro',1),(52,15,'Falso',0);
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
  `titulo` varchar(150) NOT NULL,
  `descricao` text,
  `admin_id` int DEFAULT NULL,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Desenvolvedor JavaScript Fullstack','Curso completo do iniciante ao avançado em JS.',6,'2025-11-26 20:07:52');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
INSERT INTO `exercicios` VALUES (1,1,'Atividade 1 – Introdução ao JavaScript','Conceitos iniciais.',1),(2,1,'Atividade 2 – Variáveis e Tipos de Dados','Declaração e tipagem.',2),(3,1,'Atividade 3 – Operadores','Aritméticos e lógicos.',3),(4,1,'Atividade 4 – Estruturas de Controle','Condicionais.',4),(5,1,'Atividade 5 – Laços de Repetição','Loops e Iterações.',5),(6,1,'Atividade 6 – Funções','Declaração e invocação.',6),(7,1,'Atividade 7 – Arrays e Objetos','Estruturas de dados.',7),(8,2,'Atividade 1 – Métodos de Array Avançados','Map, Filter, Reduce.',1),(9,2,'Atividade 2 – Manipulação do DOM','Interação com HTML.',2),(10,2,'Atividade 3 – Eventos em JavaScript','Clicks, inputs e listeners.',3),(11,2,'Atividade 4 – Escopo e Hoisting','Conceitos fundamentais.',4),(12,2,'Atividade 5 – Callbacks e Temporizadores','Assincronicidade básica.',5),(13,2,'Atividade 6 – Boas Práticas','Clean Code e organização.',6),(14,3,'Atividade 1 – Promises e Async/Await','Assincronicidade moderna.',1),(15,3,'Atividade 2 – Fetch API e Requisições HTTP','Consumo de APIs.',2),(16,3,'Atividade 3 – Classes e Programação Orientada a Objetos','POO em JS.',3),(17,3,'Atividade 4 – Closures e Escopo Léxico','Conceitos avançados.',4),(18,3,'Atividade 5 – Prototypes e This','Contexto de execução.',5),(19,3,'Atividade 6 – Expressões Regulares e Web Storage','Ferramentas avançadas.',6);
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tipo` enum('visual','utilizavel') DEFAULT 'utilizavel',
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `quantidade` int DEFAULT '1',
  `meta` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
INSERT INTO `modulos` VALUES (1,1,'MÓDULO BÁSICO – Fundamentos do JavaScript',1),(2,1,'MÓDULO INTERMEDIÁRIO – Manipulação, Lógica e DOM',2),(3,1,'MÓDULO AVANÇADO – Conceitos Profundos e Ecossistema do JavaScript',3);
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
-- Table structure for table `questoes_exercicio`
--

DROP TABLE IF EXISTS `questoes_exercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questoes_exercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exercicio_id` int NOT NULL,
  `enunciado` text NOT NULL,
  `tipo` enum('multipla_escolha','verdadeiro_falso','completar') DEFAULT 'multipla_escolha',
  `ordem` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercicio_id` (`exercicio_id`),
  CONSTRAINT `questoes_exercicio_ibfk_1` FOREIGN KEY (`exercicio_id`) REFERENCES `exercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questoes_exercicio`
--

LOCK TABLES `questoes_exercicio` WRITE;
/*!40000 ALTER TABLE `questoes_exercicio` DISABLE KEYS */;
INSERT INTO `questoes_exercicio` VALUES (1,1,'O JavaScript é uma linguagem de programação que:','multipla_escolha',1),(2,1,'“JavaScript é a mesma linguagem que Java.”','verdadeiro_falso',2),(3,1,'Qual das opções corretamente insere um script JavaScript em uma página HTML?','multipla_escolha',3),(4,1,'O JavaScript pode ser executado tanto no __________ quanto no Node.js.','completar',4),(5,1,'O JavaScript precisa obrigatoriamente de conexão com a internet para funcionar.','verdadeiro_falso',5),(6,2,'Qual é a maneira correta de declarar uma variável que pode mudar de valor?','multipla_escolha',1),(7,2,'Complete: o tipo de dado que representa valores verdadeiros ou falsos é o __________.','completar',2),(8,2,'const permite reatribuir o valor da variável.','verdadeiro_falso',3),(9,2,'Qual das opções não é um tipo primitivo em JavaScript?','multipla_escolha',4),(10,2,'O valor de typeof \"Olá\" será:','multipla_escolha',5),(11,3,'Qual é o resultado de 5 + \"5\"?','multipla_escolha',1),(12,3,'O operador === compara tanto o valor quanto o __________.','completar',2),(13,3,'O operador % é usado para obter o resto de uma divisão.','verdadeiro_falso',3),(14,3,'Qual expressão retorna true?','multipla_escolha',4),(15,3,'O operador || retorna verdadeiro quando:','multipla_escolha',5),(16,4,'O comando if é usado para:','multipla_escolha',1),(17,4,'O else é executado apenas se a condição do if for falsa.','verdadeiro_falso',2),(18,4,'O comando switch é útil quando há __________ possíveis valores para uma mesma variável.','completar',3),(19,4,'O que acontece se nenhuma condição do switch for atendida e não houver default?','multipla_escolha',4),(20,4,'É possível aninhar estruturas if dentro de outras.','verdadeiro_falso',5),(21,5,'Qual laço é mais usado quando se sabe o número exato de repetições?','multipla_escolha',1),(22,5,'O laço while executa enquanto a condição for __________.','completar',2),(23,5,'O laço do...while executa pelo menos uma vez, mesmo que a condição seja falsa.','verdadeiro_falso',3),(24,5,'for...of é usado para:','multipla_escolha',4),(25,5,'O comando que interrompe um loop imediatamente é:','multipla_escolha',5),(26,6,'Qual é a sintaxe correta para declarar uma função chamada “somar”?','multipla_escolha',1),(27,6,'Uma Arrow Function usa o símbolo __________ para indicar sua sintaxe.','completar',2),(28,6,'Uma função pode retornar valores usando a palavra-chave return.','verdadeiro_falso',3),(29,6,'Qual é o resultado do código? function dobro(x) { return x * 2; } console.log(dobro(5));','multipla_escolha',4),(30,6,'Funções podem ser armazenadas em variáveis em JavaScript.','verdadeiro_falso',5),(31,7,'Qual método adiciona um item ao final de um array?','multipla_escolha',1),(32,7,'O método .pop() remove o __________ elemento de um array.','completar',2),(33,7,'Em objetos, acessamos valores com objeto[\"propriedade\"] ou objeto.propriedade.','verdadeiro_falso',3),(34,7,'O que o código imprime? let pessoa = { nome: \"Ana\", idade: 20 }; console.log(pessoa.nome);','multipla_escolha',4),(35,7,'Qual método pode remover e adicionar elementos em um array?','multipla_escolha',5),(36,8,'O método .map() é usado para:','multipla_escolha',1),(37,8,'O método .filter() retorna apenas os elementos que __________ a condição.','completar',2),(38,8,'.reduce() pode ser usado para somar todos os elementos de um array numérico.','verdadeiro_falso',3),(39,8,'Qual resultado é impresso? [1, 2, 3].find(x => x > 1);','multipla_escolha',4),(40,8,'O método que testa se algum elemento atende à condição é:','multipla_escolha',5),(41,9,'O que significa DOM?','multipla_escolha',1),(42,9,'O método document.getElementById() retorna um __________ HTML com o ID especificado.','completar',2),(43,9,'innerHTML altera apenas o texto de um elemento, e não pode incluir HTML.','verdadeiro_falso',3),(44,9,'Qual comando cria um novo elemento <p> no DOM?','multipla_escolha',4),(45,9,'Para adicionar um novo elemento ao corpo da página, usamos:','multipla_escolha',5),(46,10,'O evento disparado quando um botão é clicado é:','multipla_escolha',1),(47,10,'Para adicionar um evento em JavaScript usamos o método __________.','completar',2),(48,10,'O “event bubbling” faz o evento subir pela árvore do DOM.','verdadeiro_falso',3),(49,10,'No código botao.addEventListener(\"click\", () => alert(\"Olá!\"));, o que acontece ao clicar?','multipla_escolha',4),(50,10,'Podemos ter mais de um addEventListener para o mesmo evento em um mesmo elemento.','verdadeiro_falso',5),(51,11,'Qual variável tem escopo de bloco?','multipla_escolha',1),(52,11,'O hoisting faz com que declarações de variáveis com var sejam __________ para o topo do escopo.','completar',2),(53,11,'let e const sofrem hoisting da mesma forma que var.','verdadeiro_falso',3),(54,11,'O que o código imprime? console.log(x); var x = 10;','multipla_escolha',4),(55,11,'Qual é o escopo padrão de variáveis declaradas com var?','multipla_escolha',5),(56,12,'Um callback é:','multipla_escolha',1),(57,12,'O método setTimeout() executa uma função após um determinado __________.','completar',2),(58,12,'setInterval() executa uma função repetidamente em intervalos definidos.','verdadeiro_falso',3),(59,12,'Como cancelamos um setInterval em execução?','multipla_escolha',4),(60,12,'Callbacks são executados imediatamente ao serem declarados.','verdadeiro_falso',5),(61,13,'Qual das opções segue boas práticas de nomeação?','multipla_escolha',1),(62,13,'O conceito de Clean Code busca tornar o código mais __________ e fácil de entender.','completar',2),(63,13,'Comentários devem explicar por que algo é feito, não apenas o que está sendo feito.','verdadeiro_falso',3),(64,13,'Qual prática não é recomendada em JavaScript moderno?','multipla_escolha',4),(65,13,'Qual arquivo normalmente armazena funções reutilizáveis em um projeto JS?','multipla_escolha',5),(66,14,'Uma Promise representa:','multipla_escolha',1),(67,14,'O método .then() é usado para lidar com o resultado bem-sucedido de uma __________.','completar',2),(68,14,'O método .catch() trata erros em uma Promise.','verdadeiro_falso',3),(69,14,'O que o await faz em uma função assíncrona?','multipla_escolha',4),(70,14,'A palavra-chave async deve ser usada antes da função para permitir o uso de await.','verdadeiro_falso',5),(71,15,'O método padrão do fetch() é:','multipla_escolha',1),(72,15,'Para converter a resposta de uma requisição em JSON, usamos o método response.__________().','completar',2),(73,15,'O fetch() retorna uma Promise.','verdadeiro_falso',3),(74,15,'Em uma requisição POST, o que faz o campo body?','multipla_escolha',4),(75,15,'É necessário converter manualmente o corpo da resposta em JSON usando .json().','verdadeiro_falso',5),(76,16,'Qual é a forma correta de criar uma classe em JavaScript?','multipla_escolha',1),(77,16,'O método especial usado para inicializar valores dentro da classe é o __________.','completar',2),(78,16,'Classes podem herdar propriedades e métodos de outras classes usando extends.','verdadeiro_falso',3),(79,16,'Qual palavra-chave é usada para chamar o construtor da classe-pai dentro de uma classe-filha?','multipla_escolha',5),(80,17,'Um closure é:','multipla_escolha',1),(81,17,'As closures funcionam porque o JavaScript possui __________ léxico.','completar',2),(82,17,'Closures são úteis para criar funções privadas.','verdadeiro_falso',3),(83,17,'Cada chamada de uma closure compartilha o mesmo escopo.','verdadeiro_falso',5),(84,18,'O this em JavaScript refere-se:','multipla_escolha',1),(85,18,'O método bind() cria uma __________ da função original com um novo valor de this.','completar',2),(86,18,'As funções call() e apply() servem para invocar uma função definindo manualmente o this.','verdadeiro_falso',3),(87,18,'Qual das opções é verdadeira sobre prototypes?','multipla_escolha',4),(88,18,'O que Object.create() faz?','multipla_escolha',5),(89,19,'O que /[0-9]+/ representa em uma RegEx?','multipla_escolha',1),(90,19,'Para verificar se uma RegEx encontra correspondência, usamos o método __________.','completar',2),(91,19,'localStorage mantém os dados mesmo após fechar o navegador.','verdadeiro_falso',3),(92,19,'Qual método salva um item no localStorage?','multipla_escolha',4),(93,19,'O método que remove um item específico do localStorage é:','multipla_escolha',5);
/*!40000 ALTER TABLE `questoes_exercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respostas_nivelamento`
--

DROP TABLE IF EXISTS `respostas_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pergunta_id` int NOT NULL,
  `alternativa_escolhida_id` int NOT NULL,
  `data_resposta` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `pergunta_id` (`pergunta_id`),
  KEY `alternativa_escolhida_id` (`alternativa_escolhida_id`),
  CONSTRAINT `respostas_nivelamento_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `respostas_nivelamento_ibfk_2` FOREIGN KEY (`pergunta_id`) REFERENCES `teste_nivelamento` (`id`) ON DELETE CASCADE,
  CONSTRAINT `respostas_nivelamento_ibfk_3` FOREIGN KEY (`alternativa_escolhida_id`) REFERENCES `alternativas_nivelamento` (`id`) ON DELETE CASCADE
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
-- Table structure for table `teste_nivelamento`
--

DROP TABLE IF EXISTS `teste_nivelamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teste_nivelamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enunciado` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teste_nivelamento`
--

LOCK TABLES `teste_nivelamento` WRITE;
/*!40000 ALTER TABLE `teste_nivelamento` DISABLE KEYS */;
INSERT INTO `teste_nivelamento` VALUES (1,'Qual das opções declara corretamente uma função em JavaScript?'),(2,'O método usado para adicionar um elemento ao final de um array é:'),(3,'A estrutura switch é usada como alternativa ao if/else quando há múltiplos casos baseados em um mesmo valor.'),(4,'O que o código \"console.log(10 == \'10\', 10 === \'10\')\" imprime?'),(5,'Para converter uma string em número inteiro, usamos parse__________().'),(6,'O método map() percorre um array e retorna um novo array transformado.'),(7,'Qual saída o código a seguir gera? function teste(a = 5, b = 10) { return a + b; } console.log(teste(2));'),(8,'O operador __________ é usado para verificar tanto o valor quanto o tipo de uma variável.'),(9,'O que o código imprime? let a = [1, 2, 3]; let b = a; b.push(4); console.log(a);'),(10,'O operador typeof pode ser usado para identificar o tipo de uma variável em tempo de execução.'),(11,'Sobre arrow functions, é correto afirmar que:'),(12,'O método __________ é usado para remover o último elemento de um array.'),(13,'O que acontece ao tentar alterar uma propriedade de um objeto declarado com const?'),(14,'Para aguardar a execução de uma Promise dentro de uma função assíncrona, usamos a palavra-chave:'),(15,'Em JavaScript, funções podem ser passadas como parâmetros para outras funções.');
/*!40000 ALTER TABLE `teste_nivelamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_logins`
--

DROP TABLE IF EXISTS `user_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `login_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_login` (`user_id`,`login_date`),
  CONSTRAINT `user_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_logins`
--

LOCK TABLES `user_logins` WRITE;
/*!40000 ALTER TABLE `user_logins` DISABLE KEYS */;
INSERT INTO `user_logins` VALUES (1,7,'2025-11-26','2025-11-26 20:09:49'),(2,7,'2025-11-27','2025-11-27 19:08:57');
/*!40000 ALTER TABLE `user_logins` ENABLE KEYS */;
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
  `moedas` int NOT NULL DEFAULT '0',
  `avatar` text,
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
INSERT INTO `user_profiles` VALUES (4,4,'bia',0,0,NULL),(6,6,'professor',0,0,NULL);
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
  `leveling_completed` tinyint(1) DEFAULT '0',
  `level` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'bia@gmail.com','bia','$2a$10$enQsGtg8ebvgvNgcxMD58.szHYwPfga5pPwdBhhjgeKcq6NKEdENC','2025-10-31 13:14:11','aluno',0,NULL),(6,'professor@gmail.com','professor','$2a$10$yslsQ31q2gjobuA/FVax0OhdgIq2VmWdTNPbWQJbjgcPyZV/K8Pg.','2025-10-31 13:24:37','aluno',0,NULL),(7,'gabriel@gmail.com','Gabriel','$2a$10$l6zXTflOL69modTueaIL3.oRbmM7Nmq8wEatC3MuScEHR0Y10Zw5e','2025-11-26 20:09:41','aluno',1,'Intermediário');
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

-- Dump completed on 2025-11-27 22:14:06
