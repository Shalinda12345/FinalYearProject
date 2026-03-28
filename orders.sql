-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Mar 28, 2026 at 08:11 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  `delivery_date` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_orders_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `created_at`, `delivery_date`) VALUES
(1, 1, 52000.00, '2026-02-10 16:36:19', NULL),
(2, 2, 78000.00, '2026-02-12 16:43:18', NULL),
(3, 3, 104000.00, '2026-02-19 16:45:27', NULL),
(4, 1, 2600.00, '2026-03-21 19:12:41', NULL),
(5, 1, 2600.00, '2026-03-21 19:17:06', NULL),
(6, 1, 2600.00, '2026-03-21 19:33:43', NULL),
(7, 1, 7800.00, '2026-03-21 19:38:05', NULL),
(8, 1, 260.00, '2026-03-21 19:45:43', NULL),
(9, 1, 260.00, '2026-03-21 19:46:57', NULL),
(10, 1, 260.00, '2026-03-21 19:47:45', NULL),
(11, 1, 26000.00, '2026-03-21 19:53:14', NULL),
(12, 1, 10400.00, '2026-03-21 20:00:33', '2026-03-25'),
(13, 1, 52000.00, '2026-03-21 20:03:24', '2026-03-26'),
(14, 2, 65000.00, '2026-03-21 21:55:25', '2026-04-01'),
(15, 4, 65000.00, '2026-03-21 22:05:43', '2026-04-02'),
(16, 4, 260.00, '2026-03-21 22:38:45', '2026-04-07'),
(17, 1, 52000.00, '2026-03-26 19:17:51', '2026-03-31'),
(18, 1, 260.00, '2026-03-28 13:26:40', '2026-03-31');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
