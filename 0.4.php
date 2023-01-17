<?php
error_reporting(E_ERROR | E_PARSE);

$data = json_encode($_POST["json"]);
$content = json_decode($data, true);

$information = array();
$array = $content['result'];

!empty($array['name']) ? array_push($information, $array['name']) :
                         array_push($information, 'None');

!empty($array['rating']) ? array_push($information, $array['rating']) :
                           array_push($information, 'None');

!empty($array['opening_hours']) ?
        $array['opening_hours']['open_now'] ? array_push($information, 'Abierto') :
                                               array_push($information, 'Cerrado') :
        array_push($information, 'None');

!empty($array['formatted_address']) ? array_push($information, $array['formatted_address']) :
                                       array_push($information, 'None');

!empty($array['formatted_phone_number']) ? array_push($information, $array['formatted_phone_number']) :
                                           array_push($information, 'None');

!empty($array['opening_hours']['weekday_text']) ? array_push($information, $array['opening_hours']['weekday_text']) :
                                                  array_push($information, 'None');

!empty($array['website']) ? array_push($information, $array['website']) :
                            array_push($information, 'None');

header('Content-Type: application/json; charset=utf-8');
echo json_encode($information);
?>