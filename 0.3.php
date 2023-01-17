<?php
error_reporting(E_ERROR | E_PARSE);

$query = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='.$_POST["lat"].','.$_POST["lon"].'&radius=10&type='.rawurlencode($_POST["type"]).'&keyword='.rawurlencode($_POST["name"]).'&key=AIzaSyCXoz_2n1LLHf29EXEBXLLQYgSBG-yA9lk';

$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $query);
$html = curl_exec($ch);

$ID_Place = array();

$json_data = json_decode($html)->results;

foreach ($json_data as $data) {
    $id = $data->place_id;
    array_push($ID_Place, $id);
}

$detail_url = array();
$detail_places = array();

for ($i = 0; $i < count($ID_Place); $i++) {
    $query_detaill = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='.$ID_Place[$i].'&key=AIzaSyCXoz_2n1LLHf29EXEBXLLQYgSBG-yA9lk';
    array_push($detail_url, $query_detaill);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $query_detaill);
    $html = curl_exec($ch);
    array_push($detail_places, json_decode($html));
}

$request = array(
    "url" => $query,
    "data" => json_decode($html),
    "id_place" => $ID_Place,
    "url_detail" => $detail_url,
    "details_place" => $detail_places
);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($request);
?>
