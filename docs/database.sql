-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: vite_et_gourmand
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allergene`
--

DROP TABLE IF EXISTS `allergene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allergene` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allergene`
--

LOCK TABLES `allergene` WRITE;
/*!40000 ALTER TABLE `allergene` DISABLE KEYS */;
INSERT INTO `allergene` VALUES (15,'Gluten'),(16,'Crustacés'),(17,'Œufs'),(18,'Poissons'),(19,'Arachides'),(20,'Soja'),(21,'Lait'),(22,'Fruits à coque'),(23,'Céleri'),(24,'Moutarde'),(25,'Graines de sésame'),(26,'Anhydride sulfureux et sulfites'),(27,'Lupin'),(28,'Mollusques');
/*!40000 ALTER TABLE `allergene` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note` smallint NOT NULL,
  `description` longtext NOT NULL,
  `statut` varchar(32) NOT NULL,
  `created_at` datetime NOT NULL,
  `commande_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8F91ABF082EA2E54` (`commande_id`),
  CONSTRAINT `FK_8F91ABF082EA2E54` FOREIGN KEY (`commande_id`) REFERENCES `commande` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commande`
--

DROP TABLE IF EXISTS `commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commande` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_commande` varchar(50) NOT NULL,
  `date_commande` datetime NOT NULL,
  `date_prestation` date NOT NULL,
  `heure_livraison` varchar(5) NOT NULL,
  `adresse_livraison` varchar(255) NOT NULL,
  `ville_livraison` varchar(128) NOT NULL,
  `nombre_personne` int NOT NULL,
  `prix_menu` decimal(8,2) NOT NULL,
  `prix_livraison` decimal(8,2) NOT NULL,
  `prix_reduction` decimal(8,2) NOT NULL,
  `prix_total` decimal(8,2) NOT NULL,
  `statut` varchar(64) NOT NULL,
  `pret_materiel` tinyint NOT NULL,
  `motif_annulation` longtext,
  `mode_contact` varchar(64) DEFAULT NULL,
  `utilisateur_id` int DEFAULT NULL,
  `menu_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_6EEAA67DFB88E14F` (`utilisateur_id`),
  KEY `IDX_6EEAA67DCCD7E912` (`menu_id`),
  CONSTRAINT `FK_6EEAA67DCCD7E912` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`),
  CONSTRAINT `FK_6EEAA67DFB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commande`
--

LOCK TABLES `commande` WRITE;
/*!40000 ALTER TABLE `commande` DISABLE KEYS */;
INSERT INTO `commande` VALUES (1,'CMD-001','2026-07-09 08:29:18','2026-07-26','12:00','10 avenue des Tests','Bordeaux',20,503.15,0.00,0.00,503.15,'en_attente',0,NULL,NULL,6,4),(2,'CMD-002','2026-07-09 08:29:18','2026-07-30','12:00','10 avenue des Tests','Bordeaux',25,563.00,0.00,0.00,563.00,'confirmee',0,NULL,NULL,6,5),(3,'CMD-003','2026-07-09 08:29:18','2026-07-20','12:00','10 avenue des Tests','Bordeaux',10,157.10,0.00,0.00,157.10,'en_preparation',0,NULL,NULL,6,6),(4,'CMD-004','2026-07-09 08:29:18','2026-07-22','12:00','10 avenue des Tests','Bordeaux',15,401.00,0.00,0.00,401.00,'prete',0,NULL,NULL,6,4),(5,'CMD-005','2026-07-09 08:29:18','2026-08-20','12:00','10 avenue des Tests','Bordeaux',30,1003.00,0.00,0.00,1003.00,'livree',0,NULL,NULL,6,5);
/*!40000 ALTER TABLE `commande` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20260625072933','2026-07-08 14:10:21',2114);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire`
--

DROP TABLE IF EXISTS `horaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jour` smallint NOT NULL,
  `heure_ouverture` varchar(5) NOT NULL,
  `heure_fermeture` varchar(5) NOT NULL,
  `ferme` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire`
--

LOCK TABLES `horaire` WRITE;
/*!40000 ALTER TABLE `horaire` DISABLE KEYS */;
INSERT INTO `horaire` VALUES (8,1,'09:00','18:00',0),(9,2,'09:00','18:00',0),(10,3,'09:00','18:00',0),(11,4,'09:00','18:00',0),(12,5,'09:00','19:00',0),(13,6,'10:00','17:00',0),(14,7,'00:00','00:00',1);
/*!40000 ALTER TABLE `horaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(128) NOT NULL,
  `description` longtext NOT NULL,
  `nombre_personne_minimum` int NOT NULL,
  `prix_par_personne` decimal(8,2) NOT NULL,
  `conditions` longtext,
  `quantite_restante` int NOT NULL,
  `actif` tinyint NOT NULL,
  `theme_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_7D053A9359027487` (`theme_id`),
  CONSTRAINT `FK_7D053A9359027487` FOREIGN KEY (`theme_id`) REFERENCES `theme` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (4,'Menu Festif de Noël','Un repas chaleureux pour célébrer les fêtes en famille avec des produits de saison.',6,45.00,'À commander au minimum 7 jours avant la prestation. Conservation au réfrigérateur entre 0°C et 4°C.',10,1,5),(5,'Menu Pâques Gourmand','Découvrez notre sélection printanière avec des saveurs légères et fraîches.',4,35.00,'À commander au minimum 5 jours avant la prestation.',8,1,6),(6,'Menu Classique','Notre incontournable pour tous vos événements, des entrées raffinées aux desserts maison.',2,28.00,'À commander au minimum 48h avant la prestation.',15,1,7);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_image`
--

DROP TABLE IF EXISTS `menu_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chemin` varchar(255) NOT NULL,
  `ordre` int NOT NULL,
  `menu_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_54912738CCD7E912` (`menu_id`),
  CONSTRAINT `FK_54912738CCD7E912` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_image`
--

LOCK TABLES `menu_image` WRITE;
/*!40000 ALTER TABLE `menu_image` DISABLE KEYS */;
INSERT INTO `menu_image` VALUES (4,'uploads/menus/noel.jpg',1,4),(5,'uploads/menus/paques.jpg',1,5),(6,'uploads/menus/classique.jpg',1,6);
/*!40000 ALTER TABLE `menu_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_plat`
--

DROP TABLE IF EXISTS `menu_plat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_plat` (
  `menu_id` int NOT NULL,
  `plat_id` int NOT NULL,
  PRIMARY KEY (`menu_id`,`plat_id`),
  KEY `IDX_E8775249CCD7E912` (`menu_id`),
  KEY `IDX_E8775249D73DB560` (`plat_id`),
  CONSTRAINT `FK_E8775249CCD7E912` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_E8775249D73DB560` FOREIGN KEY (`plat_id`) REFERENCES `plat` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_plat`
--

LOCK TABLES `menu_plat` WRITE;
/*!40000 ALTER TABLE `menu_plat` DISABLE KEYS */;
INSERT INTO `menu_plat` VALUES (4,10),(4,11),(4,13),(4,16),(5,12),(5,15),(5,17),(6,11),(6,14),(6,18);
/*!40000 ALTER TABLE `menu_plat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_regime`
--

DROP TABLE IF EXISTS `menu_regime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_regime` (
  `menu_id` int NOT NULL,
  `regime_id` int NOT NULL,
  PRIMARY KEY (`menu_id`,`regime_id`),
  KEY `IDX_79C112A4CCD7E912` (`menu_id`),
  KEY `IDX_79C112A435E7D534` (`regime_id`),
  CONSTRAINT `FK_79C112A435E7D534` FOREIGN KEY (`regime_id`) REFERENCES `regime` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_79C112A4CCD7E912` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_regime`
--

LOCK TABLES `menu_regime` WRITE;
/*!40000 ALTER TABLE `menu_regime` DISABLE KEYS */;
INSERT INTO `menu_regime` VALUES (4,6),(5,6),(5,7),(6,6);
/*!40000 ALTER TABLE `menu_regime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messenger_messages`
--

DROP TABLE IF EXISTS `messenger_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messenger_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL,
  `available_at` datetime NOT NULL,
  `delivered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750` (`queue_name`,`available_at`,`delivered_at`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messenger_messages`
--

LOCK TABLES `messenger_messages` WRITE;
/*!40000 ALTER TABLE `messenger_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messenger_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plat`
--

DROP TABLE IF EXISTS `plat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(128) NOT NULL,
  `type_plat` varchar(20) NOT NULL,
  `image_chemin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plat`
--

LOCK TABLES `plat` WRITE;
/*!40000 ALTER TABLE `plat` DISABLE KEYS */;
INSERT INTO `plat` VALUES (10,'Foie gras maison sur toast brioché','entree',NULL),(11,'Velouté de butternut et châtaignes','entree',NULL),(12,'Carpaccio de saint-jacques','entree',NULL),(13,'Chapon rôti aux marrons','plat',NULL),(14,'Filet de bœuf Wellington','plat',NULL),(15,'Pavé de saumon en croûte d\'herbes','plat',NULL),(16,'Bûche de Noël chocolat-praliné','dessert',NULL),(17,'Tarte aux fraises et crème pâtissière','dessert',NULL),(18,'Mille-feuille vanille maison','dessert',NULL);
/*!40000 ALTER TABLE `plat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plat_allergene`
--

DROP TABLE IF EXISTS `plat_allergene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plat_allergene` (
  `plat_id` int NOT NULL,
  `allergene_id` int NOT NULL,
  PRIMARY KEY (`plat_id`,`allergene_id`),
  KEY `IDX_6FA44BBFD73DB560` (`plat_id`),
  KEY `IDX_6FA44BBF4646AB2` (`allergene_id`),
  CONSTRAINT `FK_6FA44BBF4646AB2` FOREIGN KEY (`allergene_id`) REFERENCES `allergene` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_6FA44BBFD73DB560` FOREIGN KEY (`plat_id`) REFERENCES `plat` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plat_allergene`
--

LOCK TABLES `plat_allergene` WRITE;
/*!40000 ALTER TABLE `plat_allergene` DISABLE KEYS */;
INSERT INTO `plat_allergene` VALUES (10,15),(10,17),(10,21),(11,21),(12,18),(13,22),(14,15),(14,17),(15,18),(16,15),(16,21),(16,22),(17,15),(17,17),(17,21),(18,15),(18,17),(18,21);
/*!40000 ALTER TABLE `plat_allergene` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regime`
--

DROP TABLE IF EXISTS `regime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regime`
--

LOCK TABLES `regime` WRITE;
/*!40000 ALTER TABLE `regime` DISABLE KEYS */;
INSERT INTO `regime` VALUES (6,'Classique'),(7,'Végétarien'),(8,'Vegan'),(9,'Sans gluten'),(10,'Halal'),(11,'Sans lactose');
/*!40000 ALTER TABLE `regime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (4,'administrateur'),(5,'employe'),(6,'utilisateur');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suivi_commande`
--

DROP TABLE IF EXISTS `suivi_commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suivi_commande` (
  `id` int NOT NULL AUTO_INCREMENT,
  `statut` varchar(64) NOT NULL,
  `commentaire` longtext,
  `created_at` datetime NOT NULL,
  `commande_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_C8D336EE82EA2E54` (`commande_id`),
  CONSTRAINT `FK_C8D336EE82EA2E54` FOREIGN KEY (`commande_id`) REFERENCES `commande` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suivi_commande`
--

LOCK TABLES `suivi_commande` WRITE;
/*!40000 ALTER TABLE `suivi_commande` DISABLE KEYS */;
/*!40000 ALTER TABLE `suivi_commande` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theme`
--

DROP TABLE IF EXISTS `theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme`
--

LOCK TABLES `theme` WRITE;
/*!40000 ALTER TABLE `theme` DISABLE KEYS */;
INSERT INTO `theme` VALUES (5,'Noël'),(6,'Pâques'),(7,'Classique'),(8,'Événement');
/*!40000 ALTER TABLE `theme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(128) NOT NULL,
  `prenom` varchar(128) NOT NULL,
  `telephone` varchar(32) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `adresse_postale` varchar(16) NOT NULL,
  `ville` varchar(128) NOT NULL,
  `actif` tinyint NOT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_1D1C63B3D60322AC` (`role_id`),
  CONSTRAINT `FK_1D1C63B3D60322AC` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (4,'jose@vitegourmand.fr','$2y$13$k94U7S3gS6mfGnsUO.DEmOJeONpwz3Puy33yeapLc1KIX1y/rW7Qu','Dupont','José','0612345678','1 rue de la Paix','33000','Bordeaux',1,4),(5,'julie@vitegourmand.fr','$2y$13$f8u4jZNGouhbnhXw/QXIzeJXAW5ywJNpHZqSxvevsoME2wdZ1GSSi','Martin','Julie','0698765432','5 allée des Roses','33000','Bordeaux',1,5),(6,'client@test.fr','$2y$13$QtMdNhHHrAi.BEiv2kk4Ge98d89Tzptv5lOdNf.gc4bXWrtH.p33q','Testeur','Alice','0611223344','10 avenue des Tests','33100','Bordeaux',1,6);
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-13 16:41:31
