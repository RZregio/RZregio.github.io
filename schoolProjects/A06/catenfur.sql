-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: May 15, 2025 at 12:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `catenfur`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryID` int(4) NOT NULL,
  `name` varchar(40) NOT NULL,
  `image` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryID`, `name`, `image`) VALUES
(1, 'Foods', 'food/food'),
(2, 'Treats', 'treat/treat'),
(3, 'Health', 'health/health'),
(4, 'Litters', 'litter/litter'),
(5, 'Toys', 'toy/toys');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productID` int(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `isAvailable` varchar(6) NOT NULL DEFAULT 'true',
  `image` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `categoryID` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productID`, `name`, `isAvailable`, `image`, `code`, `description`, `categoryID`) VALUES
(1, 'Fancy Feast', 'true', 'food/food1', 'FD Fncy Fst-', 'Grilled Seafood Feast, Pack Canned Cat Food', 1),
(2, 'Meow Mix', 'true', 'food/food2', 'FD Mw Mx-', 'Original Choice Dry Cat Food', 1),
(3, 'Tiny Tiger', 'true', 'food/food3', 'FD Tny Tgr-', 'Pate Beef & Poultry Recipes Variety Pack Grain-Free Canned Cat Food', 1),
(4, 'IAms', 'false', 'food/food4', 'FD IAms-', '', 1),
(5, 'Orijen', 'true', 'food/food5', 'FD Orjn-', 'Original Grain-Free Dry Cat Food', 1),
(6, 'Blue Buffalo', 'true', 'food/food6', 'FD Bl Bffl-', 'Tastefuls Ocean Fish & Tuna Entrée Pate Wet Cat Food', 1),
(7, 'Temptations', 'true', 'food/food7', 'FD Tmpttns-', 'Tempting Tuna & Chicken Flavor Adult Dry Cat Food', 1),
(8, 'Purina One', 'true', 'food/food8', 'FD Prn1-', '+Plus Healthy Kitten Formula Natural Dry Cat Food', 1),
(9, 'Sheba', 'true', 'food/food9', 'FD Prn1-', 'Chicken & Salmon Pate Entree Variety Pack Adult Wet Cat Food Trays', 1),
(10, 'Friskies Grill', 'true', 'treat/treat1', 'TR FrsksG', 'Mix Mixed Grill Crunch Flavor Crunchy Cat Treats, 6-oz bag', 2),
(11, 'Friskies Chicken', 'false', 'treat/treat2', 'TR FrsksC', '', 2),
(12, 'Temptations', 'true', 'treat/treat3', 'TR Tmpttns', 'Classic Tasty Chicken Flavor Soft & Crunchy Cat Treats, 16-oz tub', 2),
(13, 'Greenies', 'true', 'treat/treat4', 'TR Grns', 'Feline Oven Roasted Chicken Flavor Adult Dental Cat Treats, 4.6-oz bag', 2),
(14, 'Meow Mix', 'false', 'treat/treat5', 'TR Mw Mx', '', 2),
(15, 'Hartz', 'true', 'treat/treat6', 'TR Hrtz', 'Delectables Squeeze Up Variety Pack Lickable Cat Treats, 0.5-oz tube, 24 count', 2),
(16, 'Sheba', 'true', 'treat/treat7', 'TR Shb', 'Meaty Tender Sticks Chicken Flavor Soft Adult Cat Treats, 5 count', 2),
(17, 'Applaws', 'true', 'treat/treat8', 'TR Applws', 'Salmon Grain-Free Freeze-Dried Cat Treats, 1-oz bag', 2),
(18, 'Fancy Feast', 'true', 'treat/treat9', 'TR Fncy Fst', 'Purina Fancy Feast Purely Natural Chicken, Tuna & Salmon Variety Pack Soft Cat Treat, 10 count', 2),
(19, 'Seresto', 'true', 'health/health1', 'HLT Srst', 'Flea & Tick Collar for Cats, 1 Collar (8-mos. supply)', 3),
(20, 'Capstar', 'true', 'health/health2', 'HLT Cpstr', 'Flea Oral Treatment for Cats, 2-25 lbs, 6 Tablets', 3),
(21, 'NextStar', 'true', 'health/health3', 'HLT NxtStr', 'Fast Acting Cat Flea & Tick Treatment 3 doses', 3),
(22, 'PetArmor', 'true', 'health/health4', 'HLT Ptrmr', 'PetArmor Coconut Berry Scented Flea & Tick Shampoo for Cats, 12-oz bottle', 3),
(23, 'Elanco', 'true', 'health/health5', 'HLT Lnc', 'Dewormer for Tapeworms for Cats, 3 count', 3),
(24, 'Fera Pets', 'true', 'health/health6', 'HLT Fr Pts', 'USDA Organic Pumpkin Plus Fiber Support for Dogs & Cats, 90 servings', 3),
(25, 'Zesty Paws', 'true', 'health/health7', 'HLT Zsty Pws', 'Digestion Gut Health Chicken Mousse Lickable Squeeze Supplement for Cats, 18 count', 3),
(33, 'Catstages', 'false', 'health/health8', 'HLT Ctstgs', '', 3),
(34, 'Vetericyn', 'true', 'health/health9', 'HLT Vtrcyn', 'Plus Antimicrobial Cat Wound Care Spray, 3-oz bottle', 3),
(35, 'Fresh Step', 'true', 'litter/litter1', 'LTR Frsh Stp-', 'Multi-Cat Extra Strength Scented Clumping Cat Litter', 4),
(36, 'Pretty Litter', 'true', 'litter/litter2', 'LTR Prtty Lttr-', 'Health Monitoring Cat Litter', 4),
(37, 'Arm & Hammer Litter Clump', 'true', 'litter/litter3', 'LTR R&H LttrC-', 'Clump & Seal Lightweight Scented Clumping Cat Litter', 4),
(38, 'Dr.Elsey\'s', 'true', 'litter/litter4', 'LTR Dr lsy-', 'Crystal Attract Long-Hair Crystal Cat Litter', 4),
(39, 'Tidy Cats Light', 'true', 'litter/litter5', 'LTR Tdy CtsL-', 'Free & Clean Lightweight Unscented Clumping Clay Cat Litter', 4),
(40, 'Arm & Hammer Litter Slide', 'false', 'litter/litter6', 'LTR R&H LttrS-', '', 4),
(41, 'Tidy Cats Clean', 'true', 'litter/litter7', 'LTR Tdy CtsC-', 'Free & Clean Unscented Clumping Clay Cat Litter', 4),
(42, 'Dr.Elsey\'s Ultra', 'true', 'litter/litter8', 'LTR Dr LsyU-', 'FUltra Unscented Clumping Clay Cat Litter', 4),
(43, 'Scoop Away', 'true', 'litter/litter9', 'LTR Scp Wy-', 'Complete Performance Fresh Scented Clumping Clay Cat Litter', 4),
(44, 'Catstages Chew Toy', 'true', 'toy/toys1', 'TY CtstgsChw', 'Fresh Breath Mint Stick Cat Chew Toy', 5),
(45, 'SmartyKat', 'true', 'toy/toys2', 'TY SmrtyKt', 'Scratch N Spin Replacement Wand Cat Toy', 5),
(46, 'Catstages Tower', 'true', 'toy/toys3', 'TY CtstgsTwr', 'Tower of Tracks Cat Toy', 5),
(47, 'KONG', 'false', 'toy/toys4', 'TY Kng', '', 5),
(48, 'Frisco Spring', 'true', 'toy/toys5', 'TY Frsc Sprng', 'Colorful Springs Cat Toy, 10 count', 5),
(49, 'Turbo', 'true', 'toy/toys6', 'TY Trb', 'Lattice Ball Cat Toy', 5),
(50, 'Yeowww!', 'true', 'toy/toys7', 'TY Ywww', 'Catnip Yellow Banana Cat Toy', 5),
(51, 'Frisco Squirrel Plush', 'true', 'toy/toys8', 'TY Frsc Sqrrl', 'Squirrel Plush Cat Toy with Refillable Catnip, Brown Squirrel', 5),
(52, 'Ethical Pet', 'true', 'toy/toys9', 'TY Thcl Pt', 'Laser Exerciser Original 2 in 1 Dog & Cat Toy', 5);

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `productSizeID` int(4) NOT NULL,
  `code` varchar(15) NOT NULL,
  `price` int(5) NOT NULL,
  `productID` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`productSizeID`, `code`, `price`, `productID`) VALUES
(1, '2KG', 500, 1),
(2, '5KG', 700, 1),
(3, '8KG', 800, 1),
(4, '5KG', 850, 2),
(5, '8KG', 950, 2),
(6, '10KG', 1050, 2),
(7, '5KG', 720, 3),
(8, '8KG', 830, 3),
(9, '10KG', 900, 3),
(10, '', 250, 10),
(11, '', 200, 11),
(12, '', 430, 12),
(13, '10KG', 1550, 5),
(14, '15KG', 1660, 5),
(15, '20KG', 1770, 5),
(16, '2CNS', 120, 6),
(17, '3CNS', 240, 6),
(18, '4CNS', 330, 6),
(19, '2KG', 450, 7),
(20, '5KG', 650, 7),
(21, '8KG', 800, 7),
(22, '10KG', 1490, 8),
(23, '15KG', 1580, 8),
(24, '20KG', 1670, 8),
(25, '1KG', 140, 9),
(26, '1.5KG', 260, 9),
(27, '2KG', 360, 9),
(28, '', 300, 13),
(29, '', 70, 14),
(30, '', 760, 15),
(31, '', 90, 16),
(32, '', 350, 17),
(33, '', 200, 18),
(34, '', 3390, 19),
(35, '', 1780, 20),
(36, '', 2240, 21),
(37, '', 460, 22),
(38, '', 920, 23),
(39, '', 1950, 24),
(40, '', 1030, 25),
(41, '', 270, 33),
(42, '', 750, 34),
(43, '10KG', 830, 35),
(44, '12KG', 910, 35),
(45, '15KG', 970, 35),
(46, '10KG', 1200, 36),
(47, '15KG', 1320, 36),
(48, '20KG', 1490, 36),
(49, '10KG', 1100, 37),
(50, '15KG', 1240, 37),
(51, '20KG', 1370, 37),
(52, '10KG', 910, 38),
(53, '12KG', 1080, 38),
(54, '15KG', 1190, 38),
(55, '10KG', 1230, 39),
(56, '12KG', 1300, 39),
(57, '15KG', 1390, 39),
(58, '10KG', 1270, 40),
(59, '15KG', 1390, 40),
(60, '20KG', 1520, 40),
(61, '10KG', 910, 41),
(62, '12KG', 1010, 41),
(63, '15KG', 1110, 41),
(64, '10KG', 910, 42),
(65, '12KG', 1020, 42),
(66, '15KG', 1140, 42),
(67, '10KG', 1160, 43),
(68, '12KG', 1210, 43),
(69, '15KG', 1320, 43),
(70, '', 160, 44),
(71, '', 1090, 45),
(72, '', 510, 46),
(73, '', 340, 47),
(74, '', 210, 48),
(75, '', 110, 49),
(76, '', 700, 50),
(77, '', 280, 51),
(78, '', 540, 52);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`productSizeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `productSizeID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
