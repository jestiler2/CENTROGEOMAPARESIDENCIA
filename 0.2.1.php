<?php
require "geo.php";
error_reporting(E_ERROR | E_PARSE);

$json = file_get_contents("php://input"); // json string
$object = json_decode($json); // php object

$query= array('https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="'.$object->name.'"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node(w)->.x;);out;',
              'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="'.$object->name.'"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node(w)->.x;);out;',
              'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="'.$object->name.'"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node(w)->.x;);out;');

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $query[$object->type]);
$html = curl_exec($ch);

$location = json_decode($html);

$geojson = null;
if ($object->type == 0 || $object->type == 1) $geojson = Overpass2Geojson::convertNodes($html,false);
if ($object->type == 2) $geojson = Overpass2Geojson::convertWays($html,false);

$request = array(
    "url" => $query[$object->type],
    "data" => $geojson
);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($request);
?>
