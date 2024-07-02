-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 02, 2024 at 03:04 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shop4u_tbl`
--

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

DROP TABLE IF EXISTS `business`;
CREATE TABLE IF NOT EXISTS `business` (
  `business_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `seller_id` int UNSIGNED NOT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_hours` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`business_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business`
--

INSERT INTO `business` (`business_id`, `seller_id`, `business_name`, `business_address`, `business_contact`, `business_hours`, `created_at`, `updated_at`) VALUES
(1, 1, 'Team Cook', 'Phnom Penh', '0123122123', '8:00AM - 8:00PM', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `buyer`
--

DROP TABLE IF EXISTS `buyer`;
CREATE TABLE IF NOT EXISTS `buyer` (
  `buyer_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`buyer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buyer`
--

INSERT INTO `buyer` (`buyer_id`, `username`, `first_name`, `last_name`, `email`, `password`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Dapong', 'Darapong', 'Rith', 'pong@gmail.com', '$2y$12$17xfqy9IvMroOmhvrOw8DOwhanevpjYp01AZypilPoLqpZGZy30Qy', '012312412', '2024-06-30 21:01:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `buyer_id` int UNSIGNED NOT NULL,
  `products` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `buyer_id`, `products`, `created_at`, `updated_at`) VALUES
(4, 1, '[]', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
CREATE TABLE IF NOT EXISTS `order_detail` (
  `order_detail_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id` int UNSIGNED NOT NULL,
  `buyer_id` int UNSIGNED NOT NULL,
  `customer_contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`order_detail_id`, `business_id`, `buyer_id`, `customer_contact`, `order_date`, `delivery_location`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '012312412', '2024-07-01 04:03:31', 'Phnom Penh', '2024-06-30 21:03:31', NULL),
(2, 1, 1, '012312412', '2024-07-01 04:04:38', 'Phnom Penh', '2024-06-30 21:04:38', NULL),
(3, 1, 1, '012312412', '2024-07-01 04:06:18', 'Phnom Penh', '2024-06-30 21:06:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
CREATE TABLE IF NOT EXISTS `order_item` (
  `order_item_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_detail_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `quantity` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`order_item_id`, `order_detail_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 2, '2024-06-30 21:03:31', NULL),
(2, 1, 2, 2, '2024-06-30 21:03:31', NULL),
(3, 2, 2, 5, '2024-06-30 21:04:38', NULL),
(4, 3, 4, 1, '2024-06-30 21:06:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `business_id` int UNSIGNED NOT NULL DEFAULT '1',
  `product_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `business_id`, `product_title`, `product_description`, `product_price`, `product_image`, `created_at`, `updated_at`) VALUES
(1, 1, 'Glass Skin Refining Serum', 'Glassy, smooth, luminous, translucent-looking skin is achieved when skin is well hydrated and without inflammation and free radical damage. A revolutionary cocktail of peach extract, niacinamide, East Asian mountain yam, madecassoside, peptides, and hyalu', '39', 'uploads/productImage-1719802277767.jpg', NULL, NULL),
(2, 1, 'Matcha Pudding Antioxidant Cream', 'This cream addresses real life head-on. If you\'ve ever wondered why you might be seeing premature and rapid signs of aging, you\'re not alone. Our skin bears increasing stress from heightened pollution, fast-paced stressful lives, excess sun exposure and l', '43', 'uploads/productImage-1719803604352.jpg', NULL, NULL),
(3, 1, 'Oil Control Mattifying Moisturizer', 'Extra Oily? Fight back with our Oil Control collection. This lightweight moisturizer (oily skin needs moisture too!) visibly mattifies, hydrates, and nourishes. Shine-blocking technology, a blend of zinc PCA and niacinamide tames oil, while green tea and ', '16', 'uploads/productImage-1719803678329.jpg', NULL, NULL),
(4, 1, 'Snail Rescue All-in-One Oil Free Moisturizer', 'Dry, dull, sluggish skin? Snail mucin to the rescue. Refreshing gel moisturizer with fast-acting (and ethically-harvested!) 95% snail mucin visibly tackles dehydration, dark spots, zits and more. Cica, birch, and strawberry support long-lasting hydration ', '20', 'uploads/productImage-1719803701845.jpg', NULL, NULL),
(6, 1, 'Beary Merry Lip Balm Set', 'The limited-edition Peach Slices Beary Merry Lip Balm Set includes a curation of three whimsical Beary Balms that provide intense hydration while soothing and softening lips. Packed with coconut, jojoba oils, vitamin E and fruit extracts, these balms hydr', '12', 'uploads/productImage-1719806424100.jpg', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--

DROP TABLE IF EXISTS `seller`;
CREATE TABLE IF NOT EXISTS `seller` (
  `seller_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`seller_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`seller_id`, `username`, `password`, `first_name`, `last_name`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Darapong', '$2b$10$k5DsHu5Gh1BXAWdMcSo45uE5ZFuOtybhNB/oD5i0zF6o8MGctHjPK', 'Darapong', 'Rith', 'pong@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `session_seller`
--

DROP TABLE IF EXISTS `session_seller`;
CREATE TABLE IF NOT EXISTS `session_seller` (
  `session_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `seller_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `session_seller`
--

INSERT INTO `session_seller` (`session_id`, `seller_id`, `token`, `created_at`, `updated_at`) VALUES
(1, '1', 'jolc8s9g65lbmv26um3w4r', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
