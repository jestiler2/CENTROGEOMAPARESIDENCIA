<?php
require "geo.php";
error_reporting(E_ERROR | E_PARSE);

$json = file_get_contents("php://input"); // json string
$object = json_decode($json); // php object

$amenity = array();
$highway = array();
$ways = array();
$json_data = null;

$query= array('https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node["amenity"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node(w)->.x;);out;',
              'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"]('.$object->lat1.','.$object->lon1.','.$object->lat2.','.$object->lon2.');node(w)->.x;);out;');

for ($i = 0; $i < 2; $i++) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $query[$i]);
    $html = curl_exec($ch);

    if ($i == 0) {
        $geojson = Overpass2Geojson::convertNodes($html,false);
        $geojson = json_encode($geojson);
        $decoded_json = json_decode($geojson, false);

        $json_data = $decoded_json->features;

        foreach ($json_data as $data) {
            $props = $data->properties;

            if (!empty($props->amenity)) {
                $temp = $props->amenity;
                array_push($amenity, $temp);
            }
            if (!empty($props->highway)) {
                $temp = $props->highway;
                array_push($highway, $temp);
            }
        }
    } else {
        $geojson = Overpass2Geojson::convertWays($html,false);
        $geojson = json_encode($geojson);
        $decoded_json = json_decode($geojson, false);
        $json_data = $decoded_json->features;

        foreach ($json_data as $data) {
            $props = $data->properties;

            if (!empty($props->highway)) {
                $temp = $props->highway;
                array_push($ways, $temp);
            }
        }
    }
}

$countAmenity = array_count_values($amenity);
arsort($countAmenity, SORT_NUMERIC);
$amenitySort = array();
foreach ($countAmenity as $key => $val) {
    array_push($amenitySort, $key);
}

$countHighway = array_count_values($highway);
arsort($countHighway, SORT_NUMERIC);
$highwaySort = array();
foreach ($countHighway as $key => $val) {
    array_push($highwaySort, $key);
}

$countWays = array_count_values($ways);
arsort($countWays, SORT_NUMERIC);
$waysSort = array();
foreach ($countWays as $key => $val) {
    array_push($waysSort, $key);
}

$request = array(
    "amenity"=> $amenitySort,
    "highway"=> $highwaySort,
    "way"=> $waysSort,
    "amenity2"=> $countAmenity,
    "highway2"=> $countHighway,
    "way2"=> $countWays
);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($request);
?>
