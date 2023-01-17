-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-01-2023 a las 05:29:22
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `geomap`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `Remove sesion` ()   DELETE FROM `sesion-location` WHERE date < (CURRENT_TIMESTAMP - INTERVAL 1 DAY)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Remove share` ()   DELETE FROM `share-location` WHERE date < (CURRENT_TIMESTAMP - INTERVAL 1 DAY)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesion-location`
--

CREATE TABLE `sesion-location` (
  `id` int(11) NOT NULL,
  `sesion` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lat1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon1` double NOT NULL,
  `lon2` double NOT NULL,
  `location` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `lat1_grid` double DEFAULT NULL,
  `lat2_grid` double DEFAULT NULL,
  `lon1_grid` double DEFAULT NULL,
  `lon2_grid` double DEFAULT NULL,
  `type_grid` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sesion-location`
--

INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, `location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) VALUES
(2578, '4pobww6wikh', '2022-11-08 08:56:22', 20.951811221384702, 20.997172461650674, -89.63401794433595, -89.58715438842773, 'school', 'amenity', 1, 20.951811221384702, 20.97449184151769, -89.61058616638184, -89.58715438842773, 1),
(2603, 'pibgdr852xq', '2023-01-16 00:44:00', 20.93031793342046, 21.01014316330867, -89.65805053710938, -89.58904266357423, 'parking', 'amenity', 1, 20.970230548364565, 21.01014316330867, -89.63504791259766, -89.61204528808595, 1),
(2604, 'pibgdr852xq', '2023-01-16 00:44:00', 20.93031793342046, 21.01014316330867, -89.65805053710938, -89.58904266357423, 'crossing', 'highway', 1, 20.970230548364565, 21.01014316330867, -89.63504791259766, -89.61204528808595, 1),
(2617, 'wugjuh6o2vm', '2023-01-16 00:52:13', 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 'hospital', 'amenity', 1, 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 2),
(2618, 'wugjuh6o2vm', '2023-01-16 00:52:13', 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 'cafe', 'amenity', 1, 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 2),
(2648, 'j2cenz5pk7b', '2023-01-16 03:32:23', 20.53067739197043, 20.53967060802959, -89.33446772386392, -89.32486427613611, 'place_of_worship', 'amenity', 1, NULL, NULL, NULL, NULL, NULL),
(2649, 'j2cenz5pk7b', '2023-01-16 03:32:23', 20.53067739197043, 20.53967060802959, -89.33446772386392, -89.32486427613611, 'townhall', 'amenity', 1, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `share-location`
--

CREATE TABLE `share-location` (
  `id` int(11) NOT NULL,
  `share` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lat1` double NOT NULL,
  `lat2` double NOT NULL,
  `lon1` double NOT NULL,
  `lon2` double NOT NULL,
  `location` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `lat1_grid` double DEFAULT NULL,
  `lat2_grid` double DEFAULT NULL,
  `lon1_grid` double DEFAULT NULL,
  `lon2_grid` double DEFAULT NULL,
  `type_grid` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `share-location`
--

INSERT INTO `share-location` (`id`, `share`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, `location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) VALUES
(36, '5vkgxflps6', '2022-11-08 08:17:20', 20.970396167991993, 21.006938152715104, -89.64878082275392, -89.60105895996095, 'fast_food', 'amenity', 1, 20.98866716035355, 21.006938152715104, -89.64878082275392, -89.62491989135744, 1),
(37, '5vkgxflps6', '2022-11-08 08:17:20', 20.970396167991993, 21.006938152715104, -89.64878082275392, -89.60105895996095, 'fast_food', 'amenity', 1, 20.98866716035355, 21.006938152715104, -89.62491989135744, -89.60105895996095, 1),
(40, 'rgrmf0pnwg8', '2023-01-16 00:45:30', 19.410623455172395, 19.475695955773713, -99.16946411132814, -99.04603958129883, 'restaurant', 'amenity', 1, 19.443159705473054, 19.459427830623383, -99.10775184631348, -99.04603958129883, 1),
(41, 'rgrmf0pnwg8', '2023-01-16 00:45:30', 19.410623455172395, 19.475695955773713, -99.16946411132814, -99.04603958129883, 'bank', 'amenity', 1, 19.410623455172395, 19.426891580322724, -99.16946411132814, -99.10775184631348, 1),
(42, 'c4g1mo38a4c', '2023-01-16 00:51:09', 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 'hospital', 'amenity', 1, 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 2),
(43, 'c4g1mo38a4c', '2023-01-16 00:51:09', 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 'cafe', 'amenity', 1, 20.952422407290502, 21.00178996034769, -89.64912414550783, -89.59831237792969, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `sesion-location`
--
ALTER TABLE `sesion-location`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `share-location`
--
ALTER TABLE `share-location`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `sesion-location`
--
ALTER TABLE `sesion-location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2650;

--
-- AUTO_INCREMENT de la tabla `share-location`
--
ALTER TABLE `share-location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `Remove sesion` ON SCHEDULE EVERY 1 WEEK STARTS '2022-09-18 21:57:05' ON COMPLETION NOT PRESERVE ENABLE DO CALL `Remove sesion`$$

CREATE DEFINER=`root`@`localhost` EVENT `Remove share` ON SCHEDULE EVERY 1 MONTH STARTS '2022-09-18 21:57:54' ON COMPLETION NOT PRESERVE ENABLE DO CALL `Remove share`$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
