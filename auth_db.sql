-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Apr 25, 2026 at 11:29 AM
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
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `ix_admin_users_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `hashed_password`, `created_at`) VALUES
(2, 'admin', '$argon2id$v=19$m=65536,t=3,p=4$bM25FwKAsNb6fw+htLaWMg$/zq20uBbyf36UvO5KodhM9/fQME9una22o7dli61Byo', '2026-02-04 10:43:19'),
(3, 'admin1', '$argon2id$v=19$m=65536,t=3,p=4$bS3FmDMGoJSSstY6JyRkzA$1N0RK6cgPblbdSD5WO7fwWVpoiSZpGUHLgpmL1kSKOE', '2026-02-04 11:08:32');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_cart_items_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_inquiries`
--

DROP TABLE IF EXISTS `contact_inquiries`;
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `created_at` datetime DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ix_contact_inquiries_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_inquiries`
--

INSERT INTO `contact_inquiries` (`id`, `name`, `email`, `message`, `created_at`) VALUES
(1, 'Test User', 'testuser@gmail.com', 'testing message', '2026-03-19 23:10:14');

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
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(18, 1, 260.00, '2026-03-28 13:26:40', '2026-03-31'),
(19, 1, 91000.00, '2026-04-23 02:28:32', '2026-04-30'),
(20, 4, 52000.00, '2026-04-24 17:58:30', '2026-04-30');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `ix_order_items_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `cost_price`) VALUES
(1, 1, 2, 100, 260.00, 0.00),
(2, 1, 1, 100, 260.00, 0.00),
(3, 2, 1, 150, 260.00, 0.00),
(4, 2, 2, 150, 260.00, 0.00),
(5, 3, 1, 200, 260.00, 0.00),
(6, 3, 2, 200, 260.00, 0.00),
(7, 4, 1, 10, 260.00, 0.00),
(8, 5, 1, 10, 260.00, 0.00),
(9, 6, 2, 10, 260.00, 0.00),
(10, 7, 2, 30, 260.00, 0.00),
(11, 8, 1, 1, 260.00, 0.00),
(12, 9, 2, 1, 260.00, 0.00),
(13, 10, 1, 1, 260.00, 0.00),
(14, 11, 2, 100, 260.00, 0.00),
(15, 12, 1, 40, 260.00, 0.00),
(16, 13, 2, 100, 260.00, 0.00),
(17, 13, 1, 100, 260.00, 0.00),
(18, 14, 1, 150, 260.00, 0.00),
(19, 14, 2, 100, 260.00, 0.00),
(20, 15, 1, 150, 260.00, 0.00),
(21, 15, 2, 100, 260.00, 0.00),
(22, 16, 1, 1, 260.00, 0.00),
(23, 17, 2, 100, 260.00, 0.00),
(24, 17, 1, 100, 260.00, 0.00),
(25, 18, 1, 1, 260.00, 0.00),
(26, 19, 1, 200, 260.00, 190.00),
(27, 19, 2, 150, 260.00, 190.00),
(28, 20, 1, 100, 260.00, 190.00),
(29, 20, 2, 100, 260.00, 190.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` int NOT NULL,
  `image_url` varchar(2048) DEFAULT NULL,
  `cost_price` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ix_products_id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `cost_price`) VALUES
(1, 'Ice Packet Rs. 10', 'Rs. 10 Ice Packet', 260, 'https://imgs.search.brave.com/5YH-B9jhIKfG-4Fukv9CRm1g6M6QnupbHgMLTp9Vy_c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hLnRo/dW1icy5yZWRkaXRt/ZWRpYS5jb20vTHJC/TlEybkdpUmdGcVR4/cFRDNnllSS1NckdB/ZDY5b3dEMmMzaVlN/bC05MC5qcGc', 190),
(2, 'Ice Packet Rs. 20', 'Rs. 20 Ice Packet', 260, 'https://imgs.search.brave.com/3Unh1Js2GD5fPOfy4-bTL4ujCiL6fI3RtMam6nin-Bk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXNsYW5kZGFpcmll/cy5say93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMS8wNS9pc2xh/bmQtZGFpcmllcy1r/aXJpbWFuLnBuZw', 190),
(3, 'Watalappan', 'Most healthy Watalappan you can ever bought', 70, 'https://imgs.search.brave.com/ldjrZqNXOg17g1SLZ_LmgTwPEpfhzN2ZBj6S8EGtkpw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzc5L2Fj/L2QxLzc5YWNkMTJh/YTRiNzNhOTM2NWIz/NDU2YTNhY2NkYTJl/LmpwZw', 60),
(4, 'Drink Cup', 'Very tasty and fresh flavoured Drink Cup', 26, 'https://imgs.search.brave.com/SPVbttzRYvcj7BSdJ8gPF67KRl9Nn3rg8ao-Jj6M0KU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMy/MDI1ODI4NC9waG90/by9kaXNwb3NhYmxl/LXBsYXN0aWMtY3Vw/LWRyaW5rcy1wbGFz/dGljLWN1cC1vZi10/ZWEtZm9yLXRha2Vh/d2F5LXBsYWNlLW9u/LXdoaXRlLXRhYmxl/LWNsb3NlLXVwLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1U/eE0xTUtjSHVZNk5z/RHJzRC1iMXNUeElN/Y09LYVVmRjdiQUhu/QWhUUGRrPQ', 23);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hashed_password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `hashed_password`, `created_at`) VALUES
(1, 'Fresh Cow', 'test@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$NWasda7VmlOqlfI+5zwn5A$LhlmPAYYnZpEGbIkw+C5UYPcZR/eRgvMTfdB/P/mn8w', '2026-02-03 20:04:10'),
(2, 'Tharaka', 'test1@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$S+m9F+K8t9b6X0tpjTEGAA$b0SiHcI3wOvszFC9M0Ng3RU4hp0sM0knGSx41TA+Y6Y', '2026-02-03 20:12:17'),
(3, 'Milan', 'test2@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$BsA4Z4wRAoAQQshZi5GS8g$V+BUbqDHO+L81cz+nJ8vmxfA+4sYLQfPTZhGZSJejCU', '2026-02-04 15:03:21'),
(4, 'Heshan', 'hshalindaofficial@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$8J6Tck7JGcP4HwOAsBYiJA$LrnEuBeYR4RdkC8nW65M0MeputVucg9Itx3ejpcnI8I', '2026-03-21 16:35:06'),
(5, 'demouser', 'demoemail@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$9F7LmXNuTek9x5iztlZKCQ$EWQRkzo1UuEPA6dpSwcPzGOqfIP27ByJd6KEKU0oGY0', '2026-04-22 20:53:32');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
