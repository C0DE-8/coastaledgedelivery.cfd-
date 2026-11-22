-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 21, 2026 at 12:23 AM
-- Server version: 11.4.13-MariaDB-cll-lve-log
-- PHP Version: 8.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `middpwqd_coastaledgedelivery`
--

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `tracker_number` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `location` varchar(255) DEFAULT 'Unknown',
  `delivery_charge` enum('paid','not_paid') DEFAULT 'not_paid',
  `delivery_date` date DEFAULT curdate(),
  `shipped_out_date` datetime DEFAULT NULL,
  `sender_name` varchar(255) NOT NULL,
  `sender_address` varchar(255) NOT NULL,
  `recipient_address` varchar(255) NOT NULL,
  `package_information` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `tracker_number`, `recipient_name`, `status`, `created_at`, `location`, `delivery_charge`, `delivery_date`, `shipped_out_date`, `sender_name`, `sender_address`, `recipient_address`, `package_information`) VALUES
(9, 'AAE1-12-7644093890', 'jessie maddox', 'In Transit', '2024-12-08 05:52:58', 'Queens, NY 11430, USA', 'paid', '2024-12-08', NULL, '', 'canada', '14 Awolowo Way, Ikeja, Lagos, Nigeria', ''),
(17, 'AAE1-12-9178367687', 'Cyber Security', 'delivered', '2026-02-10 07:07:50', 'Cyber Security Unit Secure Facility operations District  DC 10001,USA', 'paid', '2026-04-03', '2001-01-01 00:00:00', 'Cyber Security', 'Cyber Security Unit Secure Facility operations District  DC 10001,USA', 'Cyber Security Unit Secure Facility operations District  DC 10001,USA', 'Contents: General Merchandise\nWeight: 2.76 kg (6.08 lbs)\nDimention: 13x8x7 inches(33x20x18cm)'),
(18, 'AAE1-12-5587125074', 'Diamond Gentle', 'hold', '2026-03-08 12:01:31', 'Benin', 'not_paid', '2026-03-17', '2026-03-08 00:00:00', 'Diamond Gentle', 'Sule street', 'Line 1', 'Okay hsjsjsbjs'),
(20, 'AAE1-12-1256054213', 'Hoshane Robinson', 'in_transit', '2026-03-24 21:11:38', 'Warehouse', 'paid', '2026-03-31', '0001-03-24 00:00:00', 'Global Taxation Services Ltd.', 'US Global Tax Ltd.: 9465 Wilshire Boulevard, Suite 300, Beverly Hills, CA 90212, USA.', 'Up Park Camp, Kingston 5, Jamaica', 'contents: High value items and confidential documents secured inside  protective inner packaging. \npackage Specification:\nWeight: 4.5 cm x 32 cm x 18 cm.\nLength: 45 cm\nNote: Package inspected and sealed prior to dispatch. Must remain unopened during transit and delivered only to the  authorized reciepient with  proper  identification.'),
(21, 'AAE1-12-2631054402', 'Hoshane Robinson', 'in_transit', '2026-03-24 21:11:49', 'Warehouse', 'paid', '2026-03-31', '0001-03-24 00:00:00', 'Global Taxation Services Ltd.', 'US Global Tax Ltd.: 9465 Wilshire Boulevard, Suite 300, Beverly Hills, CA 90212, USA.', 'Up Park Camp, Kingston 5, Jamaica', 'contents: High value items and confidential documents secured inside  protective inner packaging. \npackage Specification:\nWeight: 4.5 cm x 32 cm x 18 cm.\nLength: 45 cm\nNote: Package inspected and sealed prior to dispatch. Must remain unopened during transit and delivered only to the  authorized reciepient with  proper  identification.'),
(22, 'AAE1-12-5185940152', 'Hoshane Robinson', 'delivered', '2026-03-24 21:12:13', 'Up Park Camp, Kingston 5, Jamaica', 'paid', '2026-03-31', '2024-01-03 00:00:00', 'Global Taxation Services Ltd.', 'US Global Tax Ltd.: 9465 Wilshire Boulevard, Suite 300, Beverly Hills, CA 90212, USA.', 'Up Park Camp, Kingston 5, Jamaica', 'contents: High value items and confidential documents secured inside  protective inner packaging. \npackage Specification:\nWeight: 4.5 cm x 32 cm x 18 cm.\nLength: 45 cm\nNote: Package inspected and sealed prior to dispatch. Must remain unopened during transit and delivered only to the  authorized recipient with  proper  identification.'),
(23, 'AAE1-12-7947938570', 'Hubert Stewart', 'hold', '2026-03-30 23:38:38', 'Warehouse', 'not_paid', '2026-03-30', '2026-03-30 00:00:00', 'Global Taxation Services Ltd.', 'Global Taxation Services Ltd: 9465 Wilshire Boulevard, Suite 300, Beverly Hills, CA 90212, USA.', '64 line 2rd Niagara on the lake Ontario Canada los 1jo', 'Contents: High-value items and confidential documents secured inside protective inner packaging. Package Specifications: • Weight: 4.8\nkg • Dimensions: 45 cm × 32 cm × 18 cm • Length: 45 cm Note: Package inspected and sealed prior to dispatch.'),
(24, 'AAE1-12-9501733803', 'Barbara Grose', 'hold', '2026-07-21 15:45:12', 'Security & Regulatory Screening.', 'paid', '2026-07-27', '2026-07-23 00:00:00', 'Matt Rife', 'Ovation hall at ocean  casino resort in atlantic city, New jersey.', 'po Box 564 Basin, WY 82410', 'contents:High-value items secured inside protective inner packaging. package specifications: weight: 4.8kg Dimentions: 45 cm x 32 cm x 18cm Lengt: 45cm Note: package inspected and sealed prior to dispatch.');

-- --------------------------------------------------------

--
-- Table structure for table `package_updates`
--

CREATE TABLE `package_updates` (
  `id` int(11) NOT NULL,
  `tracker_number` varchar(50) NOT NULL,
  `update_message` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_updates`
--

INSERT INTO `package_updates` (`id`, `tracker_number`, `update_message`, `location`, `created_at`) VALUES
(1, 'AAE1-12-7644093890', 'Package received at Lagos transit hub', 'Edo, Nigeria', '2025-12-18 15:57:24'),
(2, 'AAE1-12-7644093890', 'Package received at Lagos transit hub', 'Delta, Nigeria', '2025-12-18 16:21:38'),
(3, 'AAE1-12-2887838966', 'loading the goods', 'warri', '2025-12-18 17:08:23'),
(4, 'AAE1-12-6758815638', 'yes', 'ph', '2026-02-08 15:11:09'),
(5, 'AAE1-12-9178367687', 'Regional Sorting Hub, New York, USA', 'New York, USA', '2026-02-11 08:29:55'),
(6, 'AAE1-12-9178367687', 'Arrived at European transit hub', 'Frankfurt Logistics Center, Germany', '2026-02-12 21:50:29'),
(7, 'AAE1-12-9178367687', 'Arrived at customs facility for clearance', 'Swiss Border Customs Facility', '2026-02-13 17:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'admin@admin.com', '123456', '2025-06-03 02:53:32', 'user'),
(2, 'coastaledgedelivery@gmail.com', '$2b$12$gtsYsOQMh.nXhjxQ/NkGkePhCSXcuV5pocp/yrorUOQBPSr48vC0a', '2026-02-08 14:24:27', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracker_number` (`tracker_number`);

--
-- Indexes for table `package_updates`
--
ALTER TABLE `package_updates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `package_updates`
--
ALTER TABLE `package_updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
