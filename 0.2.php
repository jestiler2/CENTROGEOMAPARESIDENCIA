<?php
require "geo.php";
error_reporting(E_ERROR | E_PARSE);

$query= array('https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="'.$_POST["name"].'"]('.$_POST["lat1"].','.$_POST["lon1"].','.$_POST["lat2"].','.$_POST["lon2"].');node(w)->.x;);out;',
              'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="'.$_POST["name"].'"]('.$_POST["lat1"].','.$_POST["lon1"].','.$_POST["lat2"].','.$_POST["lon2"].');node(w)->.x;);out;',
              'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="'.$_POST["name"].'"]('.$_POST["lat1"].','.$_POST["lon1"].','.$_POST["lat2"].','.$_POST["lon2"].');node(w)->.x;);out;');

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $query[$_POST["type"]]);
$html = curl_exec($ch);

$location = json_decode($html);

$geojson = null;
if ($_POST["type"] == 0 || $_POST["type"] == 1) $geojson = Overpass2Geojson::convertNodes($html,false);
if ($_POST["type"] == 2) $geojson = Overpass2Geojson::convertWays($html,false);

$request = array(
    "url" => $query[$_POST["type"]],
    "data" => $geojson
);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($request);
?>
