-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2025 at 02:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `portfolio_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `created_at`, `email`) VALUES
(4, 'admin', '$2b$10$HzXiYXTx1/gxrPMLJ4J9ku9kCfbNgUBArMFCVjmoRz3Yj6Mun1g3S', '2025-08-06 16:47:30', 'imanigirigiheemmanuel@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `type` enum('text','image','video','audio','file') NOT NULL DEFAULT 'text',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `file_path`, `type`, `created_at`) VALUES
(7, 'hfu', 'dfgj', '/uploads/1755610514377-IMG-20250809-WA0017.jpg', 'image', '2025-08-19 13:35:14');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_comments`
--

CREATE TABLE `announcement_comments` (
  `id` int(11) NOT NULL,
  `announcement_id` int(11) NOT NULL,
  `commenter_name` varchar(100) NOT NULL,
  `comment_text` text NOT NULL,
  `commented_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `announcement_comments`
--

INSERT INTO `announcement_comments` (`id`, `announcement_id`, `commenter_name`, `comment_text`, `commented_at`) VALUES
(5, 7, 'ravie', 'good', '2025-08-19 13:46:43'),
(7, 7, 'Kelly@ 23', 'hello \nyour so smart brothers!!!!!!!!!!!!!!!!!!!', '2025-08-21 14:54:01'),
(8, 7, 'etry', 'rty', '2025-08-22 17:38:13');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_comment_replies`
--

CREATE TABLE `announcement_comment_replies` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `replier_name` varchar(100) NOT NULL,
  `reply_text` text NOT NULL,
  `replied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `announcement_comment_replies`
--

INSERT INTO `announcement_comment_replies` (`id`, `comment_id`, `replier_name`, `reply_text`, `replied_at`) VALUES
(4, 5, 'Admin', 'mrc', '2025-08-19 13:47:38'),
(5, 7, 'Admin', 'thanks sister wacu!!!!!!!!!', '2025-08-21 14:55:05'),
(6, 8, 'Admin', 'ytrsdgfhg', '2025-08-22 17:40:31'),
(7, 8, 'Admin', 'rtyfu', '2025-08-22 17:40:50'),
(8, 7, 'Admin', 'y6et', '2025-08-22 17:42:22');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `original_name`, `file_path`, `file_type`, `upload_date`) VALUES
(1, 'A2.pdf', '/uploads/1754488651304-A2.pdf', 'certificate', '2025-08-06 13:57:32'),
(2, 'my cv.pdf', '/uploads/1754489010134-my cv.pdf', 'cv', '2025-08-06 14:03:30'),
(5, 'my letter and cv.pdf', '/uploads/1755173831435-my letter and cv.pdf', 'other', '2025-08-14 12:17:11');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `level` varchar(100) NOT NULL,
  `institution` varchar(100) NOT NULL,
  `period` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `level`, `institution`, `period`, `description`) VALUES
(1, 'Bachelor of Science in Business Information Technology', 'University of Rwanda', '2021 - Present', 'Specializing in full-stack web development (React.js, Node.js, Express)\nDatabase design and management with MySQL\nBusiness systems analysis and design\nParticipated in Academic Internship in RP Huye'),
(2, 'Advanced Level Education (A2)', 'G.S. Bumbogo', '2018 - 2020', 'Combination: History, Economics, Geography\nGraduated with distinction above (75% overall)\nClass representative and student Performer\nOrganized school\'s first technology club\nWon National Examination'),
(3, 'Ordinary Level Education (O-Level)', 'G.S. Rutunga', '2014 - 2017', 'Key subjects and activities:\nTop performer in Computer Science and Mathematics\nFounded school\'s first coding club');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `received_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `name`, `email`, `message`, `received_at`) VALUES
(5, 'kelly', 'gf@gmail.com', 'muraho', '2025-08-16 16:36:26'),
(6, 'Will Manasse ', 'will23@gmail.com', 'Hello can u help me pls?', '2025-08-21 14:57:17');

-- --------------------------------------------------------

--
-- Table structure for table `message_replies`
--

CREATE TABLE `message_replies` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `reply_text` text NOT NULL,
  `replied_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `message_replies`
--

INSERT INTO `message_replies` (`id`, `message_id`, `reply_text`, `replied_at`) VALUES
(6, 5, 'yego!!!!', '2025-08-16 16:37:15'),
(7, 6, 'Yes of Couse!!', '2025-08-21 14:58:45');

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone1` varchar(20) DEFAULT NULL,
  `phone2` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `linkedin` varchar(100) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `twitter` varchar(100) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `degree` varchar(100) DEFAULT NULL,
  `university` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `full_name`, `bio`, `email`, `phone1`, `phone2`, `whatsapp`, `linkedin`, `instagram`, `twitter`, `registration_number`, `degree`, `university`, `address`) VALUES
(1, 'Imanigirigihe Emmanuel', 'Business Information Technology student with a passion for web development and data analysis.', 'imanigirigiheemmanuel@gmail.com', '+250782529167', '+250721259393', '250782529167', 'imanigirigihe', 'imanigirigihe', 'imanigirigihe', '222011968', 'Bachelor of Business Information Technology', 'University of Rwanda', 'Kigali, Rwanda');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `category` enum('Technical','Professional','Soft') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `skill`, `category`) VALUES
(1, 'Web development using Node.js and React.js', 'Technical'),
(2, 'Database design and management (MySQL)', 'Technical'),
(3, 'Computer troubleshooting and networking basics', 'Technical'),
(4, 'System design and deployment', 'Technical'),
(5, 'Microsoft Office tools (Word, Excel, PowerPoint)', 'Professional'),
(6, 'Data entry and reporting', 'Professional'),
(7, 'Writing official letters and reports', 'Professional'),
(8, 'Multimedia and data management', 'Professional'),
(9, 'IT support and user assistance', 'Professional'),
(10, 'Leadership and teamwork', 'Soft');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `announcement_comments`
--
ALTER TABLE `announcement_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcement_id` (`announcement_id`);

--
-- Indexes for table `announcement_comment_replies`
--
ALTER TABLE `announcement_comment_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_replies`
--
ALTER TABLE `message_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `announcement_comments`
--
ALTER TABLE `announcement_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `announcement_comment_replies`
--
ALTER TABLE `announcement_comment_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `message_replies`
--
ALTER TABLE `message_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcement_comments`
--
ALTER TABLE `announcement_comments`
  ADD CONSTRAINT `announcement_comments_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcement_comment_replies`
--
ALTER TABLE `announcement_comment_replies`
  ADD CONSTRAINT `announcement_comment_replies_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `announcement_comments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_replies`
--
ALTER TABLE `message_replies`
  ADD CONSTRAINT `message_replies_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
