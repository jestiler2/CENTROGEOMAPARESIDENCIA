let ajax = []

function checkSession () {
    const sql = "SELECT * FROM `sesion-location` WHERE `sesion` = '" + id + "';";
    const column = ['sesion', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable']
    let exits = 0;

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 1, "sql": sql, "size": 8, "column": column},
        success: function (result) {
            try {
                const responseError = "Lo sentimos. No se pudo encontrar una coincidencia. Inténtelo de nuevo.";
                console.log(result)
                if (responseError === result) return exits;
                // let requestPHP = JSON.parse(result);
                let requestPHP = result;
                let elememts = [];

                for (element in requestPHP) {
                    if (element !== null) {
                        elememts.push(requestPHP[element]);
                    }
                }

                exits = elememts[0][0].length;
            } catch (error) {
                console.log(error);
            }
        }
    });

    return (exits > 0);
}

function restoreLocation () {
    const sql = "SELECT * FROM `sesion-location` WHERE `sesion` = '" + id + "';";
    const column = ['sesion', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable']
    $.post(server + "connection.php",
        {"database": "geomap","type": 1, "sql": sql, "size": 8, "column": column}).done(
        function (result) {
            // let requestPHP = JSON.parse(result);
            let requestPHP = result;
            let elememts = [];

            for (element in requestPHP) {
                if (element !== null) {
                    elememts.push(requestPHP[element]);
                }
            }

            let location = [elememts[0][1][0],
                            elememts[0][2][0],
                            elememts[0][3][0],
                            elememts[0][4][0]];

            map.fitBounds([[location[0], location[2]],
                           [location[1], location[3]]]);
            markerMap['location'] = location;
            showShare();
            showControl();
            const locationAjax = addLocationMap(location[0],location[1],location[2],location[3],true, false);

            $.when.apply($, locationAjax).then(function() {
                console.log("termine el ajaxLocation")
            });

            markerMap['market'] = null;
            markerMap['position'] = L.rectangle([[location[0], location[2]],
                    [location[1], location[3]]],
                {color: "#3388FF", weight: 2});
            markerMap['position'].addTo(map);

            const type = ['amenity', 'highway', 'way'];
            console.log(elememts[0][0].length)

            for (let i = 0; i < elememts[0][0].length; i ++) {
                if ((i + 1) === elememts[0][0].length) {
                    ajax.push(drawItemSelectRestore(type.indexOf(elememts[0][6][i]),
                        elememts[0][5][i], elememts[0][6][i], elememts[0][7][i], false, true));
                }

                else{
                    ajax.push(drawItemSelectRestore(type.indexOf(elememts[0][6][i]),
                        elememts[0][5][i], elememts[0][6][i], elememts[0][7][i], false, false));
                }
            }

            $.when.apply($, ajax).then(function() {
                console.log("termine el ajax")
            });

        }
    );
}

function restoreLocationShare (idShare, radio) {
    const sql = "SELECT * FROM `share-location` WHERE `share` = '" + idShare + "';";
    const column = ['share', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable']
    $.post(server + "connection.php",
        {"database": "geomap","type": 1, "sql": sql, "size": 8, "column": column}).done(
        function (result) {
            // let requestPHP = JSON.parse(result);
            let requestPHP = result;
            let elememts = [];

            for (element in requestPHP) {
                if (element !== null) {
                    elememts.push(requestPHP[element]);
                }
            }

            let location = [elememts[0][1][0],
                elememts[0][2][0],
                elememts[0][3][0],
                elememts[0][4][0]];

            map.fitBounds([[location[0], location[2]],
                [location[1], location[3]]]);
            markerMap['location'] = location;
            showShare();
            showControl();
            addLocationMap(location[0], location[1], location[2], location[3], false, false);

            console.log(Number(location[0]) + Number((location[1] - location[0]) / 2))
            console.log(Number(location[2]) + Number((location[3] - location[2]) / 2))

            markerMap['market'] = null;
            markerMap['position'] = !radio ?
                L.rectangle([[location[0], location[2]], [location[1], location[3]]], {color: "#3388FF", weight: 2}) :
                L.circle([Number(location[0]) + Number((location[1] - location[0]) / 2),
                        Number(location[2]) + Number((location[3] - location[2]) / 2)],
                    Number(radio), {color: '#CFB87F', fillColor: '#F5EAD8', fillOpacity: 0.5});
            markerMap['position'].addTo(map);

            const type = ['amenity', 'highway', 'way'];
            console.log(elememts[0][0].length)

            for (let i = 0; i < elememts[0][0].length; i++) {
                if ((i + 1) === elememts[0][0].length) drawItemSelectRestore(type.indexOf(elememts[0][6][i]),
                    elememts[0][5][i], elememts[0][6][i], elememts[0][7][i], false, true);

                else drawItemSelectRestore(type.indexOf(elememts[0][6][i]),
                    elememts[0][5][i], elememts[0][6][i], elememts[0][7][i], false, false);
            }
        }
    );
}

function removeLocation () {
    const remove = "DELETE FROM `sesion-location` WHERE `sesion` = '" + id + "';";

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 0, "sql": remove},
        success: function (result) {
            console.log(result);
        }
    });
}

function createdLocation (locations) {
    for (let i = 0; i < locations.length; i++) {
        let created = "INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
            "`location`, `type`, `enable`) VALUES (NULL, '" + id + "', current_timestamp(), '" +
            markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
            "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
            "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
            "');";
        $.ajax({
            type: "POST",
            url: server + "connection.php",
            async: false,
            data: {"database": "geomap", "type": 0, "sql": created},
            success: function (result) {
                console.log(result);
            }
        });
    }
}


function removeAndCreatedLocation (locations) {
    const remove = "DELETE FROM `sesion-location` WHERE `sesion` = '" + id + "';";

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 0, "sql": remove},
        success: function (result) {
            console.log(result);
            for (let i = 0; i < locations.length; i++) {
                let created = "INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                    "`location`, `type`, `enable`) VALUES (NULL, '" + id + "', current_timestamp(), '" +
                    markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                    "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                    "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                    "');";
                $.ajax({
                    type: "POST",
                    url: server + "connection.php",
                    async: false,
                    data: {"database": "geomap", "type": 0, "sql": created},
                    success: function (result) {
                        console.log(result);
                    }
                });
            }
        }
    });
}

function removeAndCreatedLocationShare (locations) {
    const remove = "DELETE FROM `share-location` WHERE `share` = '" + idShare + "';";

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 0, "sql": remove},
        success: function (result) {
            console.log(result);
            for (let i = 0; i < locations.length; i++) {
                let created = "INSERT INTO `share-location` (`id`, `share`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                    "`location`, `type`, `enable`) VALUES (NULL, '" + idShare + "', '" +
                    markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                    "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                    "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                    "');";
                $.ajax({
                    type: "POST",
                    url: server + "connection.php",
                    async: false,
                    data: {"database": "geomap", "type": 0, "sql": created},
                    success: function (result) {
                        console.log(result);
                    }
                });
            }
        }
    });
}
