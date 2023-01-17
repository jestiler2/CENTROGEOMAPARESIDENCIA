<?php
$mysqli = new mysqli('127.0.0.1', 'geomap',
                     'geomap', $_POST['database']);

if ($mysqli->connect_errno) {
    echo "Errno: " . $mysqli->connect_errno . "\n";
    echo "Error: " . $mysqli->connect_error . "\n";
    exit();
}

$resultado = null;

if ($_POST['type'] == 0) {

    if ($mysqli->query($_POST['sql'])) {
        echo "Exitoso: se realizó correctamente la solicitud.";
        exit();
    } else {
        echo "Error: ocurrio un error al realizar solicitud.";
        exit();
    }

}

if ($_POST['type']== 1) {

    $data = array();
    for ($i = 0; $i < $_POST['size']; $i ++) {
        array_push($data, array());
    }

    if ($resultado = $mysqli->query($_POST['sql'])) {
        if ($resultado->num_rows === 0) {
            echo "Lo sentimos. No se pudo encontrar una coincidencia. Inténtelo de nuevo.";
            exit();
        } else {

            while ($registro = $resultado-> fetch_assoc()) {

                for ($i = 0; $i < $_POST['size']; $i ++) {
                    array_push($data[$i], $registro[$_POST['column'][$i]]);
                }
            }

            $json = array("data" => $data);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($json);
        }
    } else {
        echo "Error: ocurrio un error al realizar solicitud.";
        exit();
    }
}

$resultado->free();
$mysqli->close();
?>