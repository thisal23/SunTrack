-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: suntrack_meta
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(255) NOT NULL,
  `displayName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roleName_UNIQUE` (`roleName`),
  UNIQUE KEY `displayName_UNIQUE` (`displayName`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'user','User','2025-03-01 10:41:40','2025-03-01 10:41:40'),(2,'admin','Admin','2025-03-01 10:41:49','2025-03-01 10:41:49'),(11,'driver','Driver','2025-03-01 10:49:09','2025-03-01 10:49:09'),(12,'manager','Fleet Manager','2025-03-01 10:49:23','2025-03-01 10:49:23');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceinfos`
--

DROP TABLE IF EXISTS `serviceinfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceinfos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceId` int NOT NULL,
  `vehicleId` int NOT NULL,
  `userId` int NOT NULL,
  `serviceRemark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceId` (`serviceId`),
  KEY `vehicleId` (`vehicleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `serviceinfos_ibfk_1` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `serviceinfos_ibfk_2` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `serviceinfos_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceinfos`
--

LOCK TABLES `serviceinfos` WRITE;
/*!40000 ALTER TABLE `serviceinfos` DISABLE KEYS */;
/*!40000 ALTER TABLE `serviceinfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceType` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tripdetails`
--

DROP TABLE IF EXISTS `tripdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tripdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tripRemark` varchar(255) DEFAULT NULL,
  `driverRemark` varchar(255) DEFAULT NULL,
  `tripId` int NOT NULL,
  `driverId` int DEFAULT NULL,
  `vehicleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tripId` (`tripId`),
  CONSTRAINT `tripdetails_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trips` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tripdetails`
--

LOCK TABLES `tripdetails` WRITE;
/*!40000 ALTER TABLE `tripdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tripdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `startLocation` varchar(255) NOT NULL,
  `endLocation` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `suggestStartTime` time NOT NULL,
  `suggestEndTime` time NOT NULL,
  `status` varchar(255) NOT NULL,
  `driverStartTime` time DEFAULT NULL,
  `driverEndTime` time DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userdetails`
--

DROP TABLE IF EXISTS `userdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nicNo` varchar(255) NOT NULL,
  `licenceNo` varchar(255) NOT NULL,
  `licenceType` varchar(255) NOT NULL,
  `contactNo` varchar(255) NOT NULL,
  `bloodGroup` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nicNo` (`nicNo`),
  UNIQUE KEY `licenceNo` (`licenceNo`),
  KEY `userId` (`userId`),
  CONSTRAINT `userdetails_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdetails`
--

LOCK TABLES `userdetails` WRITE;
/*!40000 ALTER TABLE `userdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `userdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiclebrands`
--

DROP TABLE IF EXISTS `vehiclebrands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiclebrands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiclebrands`
--

LOCK TABLES `vehiclebrands` WRITE;
/*!40000 ALTER TABLE `vehiclebrands` DISABLE KEYS */;
INSERT INTO `vehiclebrands` VALUES (1,'Nissan','2025-03-01 11:01:24','2025-03-01 11:53:25'),(2,'Toyota','2025-03-01 11:01:36','2025-03-01 11:01:36'),(3,'Mazda','2025-03-01 11:39:40','2025-03-01 11:39:40');
/*!40000 ALTER TABLE `vehiclebrands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicledetails`
--

DROP TABLE IF EXISTS `vehicledetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicledetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicleId` int NOT NULL,
  `color` varchar(255) NOT NULL,
  `licenseId` varchar(255) NOT NULL,
  `licenseExpireDate` datetime NOT NULL,
  `insuranceType` varchar(255) NOT NULL,
  `insuranceNo` varchar(255) NOT NULL,
  `insuranceExpireDate` datetime NOT NULL,
  `chassieNumber` varchar(255) NOT NULL,
  `fuelType` varchar(255) NOT NULL,
  `registerYear` varchar(255) NOT NULL,
  `licenceLastUpdate` datetime NOT NULL,
  `insuranceLastUpdate` datetime NOT NULL,
  `licenceDocument` varchar(500) DEFAULT NULL,
  `insuranceDocument` varchar(500) DEFAULT NULL,
  `ecoDocument` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `licenseId` (`licenseId`),
  UNIQUE KEY `insuranceNo` (`insuranceNo`),
  UNIQUE KEY `chassieNumber` (`chassieNumber`),
  KEY `vehicledetails_ibfk_1` (`vehicleId`),
  CONSTRAINT `vehicledetails_ibfk_1` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicledetails`
--

LOCK TABLES `vehicledetails` WRITE;
/*!40000 ALTER TABLE `vehicledetails` DISABLE KEYS */;
INSERT INTO `vehicledetails` VALUES (1,1,'Black','ABC-2345','2026-08-15 00:00:00','Full Insurance','INS-987654325','2025-09-30 00:00:00','JTDBU4EE9A9145676','Petrol','2023','2024-02-10 00:00:00','2025-09-30 00:00:00','/uploads/1740851764914-NaN.pdf','/uploads/1740851764922-NaN.pdf','/uploads/1740851764935-NaN.pdf','2025-03-01 16:14:21','2025-03-01 17:56:05'),(3,3,'Black','ABC-2341','2026-08-15 00:00:00','Full Insurance','INS-987654322','2025-09-30 00:00:00','JTDBU4EE9A9145672','Petrol','2023','2024-02-10 00:00:00','2025-09-30 00:00:00','/uploads/1740847411376-NaN.pdf','/uploads/1740847411388-NaN.pdf','/uploads/1740847411496-NaN.pdf','2025-03-01 16:43:31','2025-03-01 16:43:31');
/*!40000 ALTER TABLE `vehicledetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicleType` varchar(255) NOT NULL,
  `vehicleTypeTwo` varchar(255) NOT NULL,
  `vehicleTitle` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `image` varchar(500) NOT NULL,
  `brandId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicles_ibfk_1` (`brandId`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`brandId`) REFERENCES `vehiclebrands` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'Car Sedan','Light','Nissan Sunny','2024','/uploads/1740851764901-NaN.jpg',1,'2025-03-01 16:14:21','2025-03-01 17:56:04'),(3,'Car','Light','Toyota Prius','2024','/uploads/1740847411362-NaN.jpeg',2,'2025-03-01 16:43:31','2025-03-01 16:43:31');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 21:29:26
