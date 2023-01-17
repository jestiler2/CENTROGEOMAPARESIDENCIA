<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GeoMAP</title>

    <!-- Add favicon -->
    <link rel="shortcut icon" href="img/icon.svg">

    <!-- Add styles -->
    <link rel="stylesheet" type="text/css" href="lib/leaflet/leaflet.css">
    <link rel="stylesheet" type="text/css" href="lib/leaflet/draw.css">
    <link rel="stylesheet" type="text/css" href="lib/leaflet-minimap/Control.MiniMap.min.css">
    <link rel="stylesheet" type="text/css" href="lib/leaflet-legends/leaflet.legend.css">
    <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="lib/overlay/jquery.loadingModal.css">
    <link rel="stylesheet" type="text/css" href="lib/cookie/cookie.css">
    <link rel="stylesheet" type="text/css" href="css/map.css">

    <!-- Add script end -->
    <script src="lib/jquery/jquery.min.js"></script>
    <script src="lib/bootstrap/js/bootstrap.min.js"></script>
    <script src="lib/overlay/jquery.loadingModal.js"></script>
</head>
<body>

    <div class="title">
        <picture>
            <img src="img/title.svg" alt="">
        </picture>
    </div>

    <div id="overall-modal"></div>

    <nav class="navbar navbar-expand-lg navbar-light bg-light"">
        <div class="icon">
            <picture>
                <img src="img/icon.svg" alt="">
            </picture>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active spacing-inter">
                    <input id="address" type="text" class="form-control mb-3 spacing" style="margin-top: 1rem !important;"
                           aria-label="" aria-describedby="basic-addon1" placeholder="URL de la consulta" disabled>
                </li>
                <li class="nav-item spacing-inter">
                    <a href="javascript:listArchive()"
                       class="size_Element btn btn-outline-secondary mb-3 spacing text-nowrap" type="button">Ver archivo</a>
                </li>
                <li class="nav-item spacing-inter">
                    <a href="javascript:listDownload()"
                       class="size_Element btn btn-outline-secondary mb-3 spacing text-nowrap" type="button">Descargar
                        archivo</a>
                </li>
                <li class="nav-item spacing-inter">
                    <div class="input-group mb-3 spacing">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Amenity</label>
                        </div>
                        <select class="custom-select" id="amenity" onchange="drawItemSelect(0, 'amenity', true, true)">
                            <option selected>Choose...</option>
                        </select>
                    </div>
                </li>
                <li class="nav-item spacing-inter">
                    <div class="input-group mb-3 spacing">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Highway</label>
                        </div>
                        <select class="custom-select" id="highway" onchange="drawItemSelect(1, 'highway', true, true)">
                            <option selected>Choose...</option>
                        </select>
                    </div>
                </li>
                <li class="nav-item spacing-inter">
                    <div class="input-group mb-3 spacing">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Way</label>
                        </div>
                        <select class="custom-select" id="way" onchange="drawItemSelect(2, 'way', true, true)">
                            <option selected>Choose...</option>
                        </select>
                    </div>
                </li>
            </ul>
        </div>
    </nav>

    <div id="map" style="width:100%; top: 10px;">
        <div class="style-control control-rigth control-top-second" onclick="removeAll()"
             title="Reiniciar mapa">
            <button>
                <img src="img/reset.png" alt="">
            </button>
        </div>
        <div class="style-control control-left control-top-threeh" onclick="getLocation()"
             title="Obtener ubicación">
            <button>
                <img src="img/location.png" alt="">
            </button>
        </div>
        <div id="control-location" class="style-control control-left control-top-four control-hide"
             onclick="shareLocation()" title="Compartir mapa">
            <button>
                <img src="img/share.png" alt="">
            </button>
        </div>
        <div id="control-map" class="style-control control-rigth control-top-five control-hide" onclick="controlPlace()"
             title="Control de mapa">
            <button>
                <img src="img/select.png" alt="">
            </button>
        </div>
        <div id="layer-list">
            <div class="d-flex gap-5 justify-content-center" id="element-box">
                <div class="list-group mx-0 w-auto" id="inner-layers" style="padding-right: 25px;"></div>
            </div>
        </div>
    </div>

    <div id="cookie" class='cookie-container'>
        <div class='cookie-content'>
            Este sitio utiliza cookies para mejorar tu experiencia. Si continua, entonces estará de acuerdo con esto.
            <div class='buttons'>
                <button class='item' onclick="hideCookie()">Acepto</button>
            </div>
        </div>
    </div>

    <!-- Add script end -->
    <script src="https://kit.fontawesome.com/45786511e1.js" crossorigin="anonymous"></script>
    <script src="lib/leaflet/leaflet.js"></script>
    <script src="lib/leaflet/leaflet.draw.js"></script>
    <script src="lib/leaflet/leaflet.ajax.min.js"></script>
    <script src="lib/leaflet-minimap/Control.MiniMap.min.js"></script>
    <script src="lib/leaflet-legends/leaflet.legend.js"></script>
    <script src="lib/axios/axios.js"></script>
    <script src="lib/layers/barrios.js"></script>
    <script src="lib/cookie/cookie.js"></script>
    <script src="js/init.js"></script>
    <script src="js/data.js"></script>
    <script src="js/user.js"></script>
    <script src="js/cookie.js"></script>
    <script src="js/functions.js"></script>
    <script src="js/color.js"></script>
    <script src="js/processing.js"></script>
    <script src="js/search.js"></script>
    <script src="js/location.js"></script>
    <script src="js/grid.js"></script>
    <script src="js/map.js"></script>
    <script src="js/database.js"></script>
    <script src="js/modal.js"></script>
    <script src="js/share.js"></script>
    <script src="js/sesion.js"></script>

</body>
</html>