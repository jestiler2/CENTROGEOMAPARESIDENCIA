function checkSession () {
    const sql = "SELECT * FROM `sesion-location` WHERE `sesion` = '" + id + "';";
    const column = ['sesion', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable', 'lat1_grid',
                    'lat2_grid', 'lon1_grid', 'lon2_grid', 'type_grid']
    let exits = 0;

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 1, "sql": sql, "size": 13, "column": column},
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

function getList () {
    const sql = "SELECT * FROM `sesion-location` WHERE `sesion` = '" + id + "';";
    const column = ['sesion', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable', 'lat1_grid',
        'lat2_grid', 'lon1_grid', 'lon2_grid', 'type_grid']
    let elememts = [];

    $.ajax({
        type: "POST",
        url: server + "connection.php",
        async: false,
        data: {"database": "geomap","type": 1, "sql": sql, "size": 13, "column": column},
        success: function (result) {
            try {
                const responseError = "Lo sentimos. No se pudo encontrar una coincidencia. Inténtelo de nuevo.";
                console.log(result)
                if (responseError === result) return exits;
                // let requestPHP = JSON.parse(result);
                let requestPHP = result;

                for (element in requestPHP) {
                    if (element !== null) {
                        elememts.push(requestPHP[element]);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    });

    return elememts;
}

function restoreLocation () {
    let ajax = []
    const sql = "SELECT * FROM `sesion-location` WHERE `sesion` = '" + id + "';";
    const column = ['sesion', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable', 'lat1_grid',
                    'lat2_grid', 'lon1_grid', 'lon2_grid', 'type_grid']
    $.post(server + "connection.php",
        {"database": "geomap","type": 1, "sql": sql, "size": 13, "column": column}).done(
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
            modeGrid = elememts[0][12][0] === null ? 0 : parseInt(elememts[0][12][0]);
            showShare();
            showControl();


            if (modeGrid === 0) {
                const locationAjax = addLocationMap(location[0], location[1], location[2], location[3], true, false);

                $.when.apply($, locationAjax).then(function () {
                    console.log("termine el ajaxLocation")
                });
            }

            if (modeGrid === 1) {
                loadingGrid()

                gridMap['now'] = [parseFloat(elememts[0][1][0]),
                    parseFloat(elememts[0][2][0]),
                    parseFloat(elememts[0][3][0]),
                    parseFloat(elememts[0][4][0])];

                const distanceBaseWidth = gridMap['base'][0]
                const distanceBaseHeigth = gridMap['base'][1]

                const distanceNowWidth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][0], gridMap['now'][3]))
                const distanceNowHeigth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][1], gridMap['now'][2]))

                gridMap['data'].push(getDifferenceLocation(distanceBaseWidth, distanceNowWidth, gridMap['now'], true))
                gridMap['data'].push(getDifferenceLocation(distanceBaseHeigth, distanceNowHeigth, gridMap['now'], false))

                gridMap['locations'] = getGrid(gridMap['data'], gridMap['now'])
            }

            if (modeGrid === 2) {
                loadingGrid()

                gridMap['now'] = [parseFloat(elememts[0][8][0]),
                                  parseFloat(elememts[0][9][0]),
                                  parseFloat(elememts[0][10][0]),
                                  parseFloat(elememts[0][11][0])];

                const distanceBaseWidth = gridMap['base'][0]
                const distanceBaseHeigth = gridMap['base'][1]

                const distanceNowWidth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                                                      L.latLng(gridMap['now'][0], gridMap['now'][3]))
                const distanceNowHeigth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                                                       L.latLng(gridMap['now'][1], gridMap['now'][2]))

                gridMap['data'].push(getDifferenceLocation(distanceBaseWidth, distanceNowWidth, gridMap['now'], true))
                gridMap['data'].push(getDifferenceLocation(distanceBaseHeigth, distanceNowHeigth, gridMap['now'], false))

                gridMap['locations'] = getGrid(gridMap['data'], gridMap['now'])
            }

            markerMap['market'] = null;
            markerMap['position'] = L.rectangle([[location[0], location[2]],
                    [location[1], location[3]]],
                {color: "#3388FF", weight: 2});
            markerMap['position'].addTo(map);

            const type = ['amenity', 'highway', 'way'];
            console.log(elememts[0][0].length)

            if (modeGrid === 0) {
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

            if (modeGrid === 1) {
                const type = ['amenity', 'highway', 'way'];

                let axiosDraw = []
                let axiosIndex = []
                gridLocationMap(1, false, false)

                for (let i = 0; i < elememts[0][0].length; i ++) {
                    axiosDraw.push(drawItemSelectMapAxios(type.indexOf(elememts[0][6][i]),
                        elememts[0][5][i], elememts[0][8][i], elememts[0][9][i], elememts[0][10][i], elememts[0][11][i]))
                    axiosIndex.push(i)
                }

                gridDrawItemSelectRestore(axiosDraw, axiosIndex, elememts);
            }

            if (modeGrid === 2) {
                const type = ['amenity', 'highway', 'way'];

                let axiosDraw = []
                let axiosIndex = []
                gridLocationMap(2, false, false)

                for (let i = 0; i < elememts[0][0].length; i ++) {
                    gridMap['locations'].forEach(element => {
                        axiosDraw.push(drawItemSelectMapAxios(type.indexOf(elememts[0][6][i]),
                            elememts[0][5][i], element[0], element[1], element[2], element[3]))
                        axiosIndex.push(i)
                    })
                }

                gridDrawItemSelectRestore(axiosDraw, axiosIndex, elememts);
            }
        }
    );
}

function restoreLocationShare (idShare, radio) {
    const sql = "SELECT * FROM `share-location` WHERE `share` = '" + idShare + "';";
    const column = ['share', 'lat1', 'lat2', 'lon1', 'lon2', 'location', 'type', 'enable', 'lat1_grid',
        'lat2_grid', 'lon1_grid', 'lon2_grid', 'type_grid']
    $.post(server + "connection.php",
        {"database": "geomap","type": 1, "sql": sql, "size": 13, "column": column}).done(
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
            modeGrid = elememts[0][12][0] === null ? 0 : parseInt(elememts[0][12][0]);
            showShare();
            showControl();


            if (modeGrid === 0) {
                const locationAjax = addLocationMap(location[0], location[1], location[2], location[3], true, false);

                $.when.apply($, locationAjax).then(function () {
                    console.log("termine el ajaxLocation")
                });
            }

            if (modeGrid === 1) {
                loadingGrid()

                gridMap['now'] = [parseFloat(elememts[0][1][0]),
                    parseFloat(elememts[0][2][0]),
                    parseFloat(elememts[0][3][0]),
                    parseFloat(elememts[0][4][0])];

                const distanceBaseWidth = gridMap['base'][0]
                const distanceBaseHeigth = gridMap['base'][1]

                const distanceNowWidth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][0], gridMap['now'][3]))
                const distanceNowHeigth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][1], gridMap['now'][2]))

                gridMap['data'].push(getDifferenceLocation(distanceBaseWidth, distanceNowWidth, gridMap['now'], true))
                gridMap['data'].push(getDifferenceLocation(distanceBaseHeigth, distanceNowHeigth, gridMap['now'], false))

                gridMap['locations'] = getGrid(gridMap['data'], gridMap['now'])
            }

            if (modeGrid === 2) {
                loadingGrid()

                gridMap['now'] = [parseFloat(elememts[0][8][0]),
                    parseFloat(elememts[0][9][0]),
                    parseFloat(elememts[0][10][0]),
                    parseFloat(elememts[0][11][0])];

                const distanceBaseWidth = gridMap['base'][0]
                const distanceBaseHeigth = gridMap['base'][1]

                const distanceNowWidth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][0], gridMap['now'][3]))
                const distanceNowHeigth = map.distance(L.latLng(gridMap['now'][0], gridMap['now'][2]),
                    L.latLng(gridMap['now'][1], gridMap['now'][2]))

                gridMap['data'].push(getDifferenceLocation(distanceBaseWidth, distanceNowWidth, gridMap['now'], true))
                gridMap['data'].push(getDifferenceLocation(distanceBaseHeigth, distanceNowHeigth, gridMap['now'], false))

                gridMap['locations'] = getGrid(gridMap['data'], gridMap['now'])
            }

            markerMap['market'] = null;
            markerMap['position'] = L.rectangle([[location[0], location[2]],
                    [location[1], location[3]]],
                {color: "#3388FF", weight: 2});
            markerMap['position'].addTo(map);

            const type = ['amenity', 'highway', 'way'];
            console.log(elememts[0][0].length)

            if (modeGrid === 0) {
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

            if (modeGrid === 1) {
                const type = ['amenity', 'highway', 'way'];

                let axiosDraw = []
                let axiosIndex = []
                gridLocationMap(1, false, false)

                for (let i = 0; i < elememts[0][0].length; i ++) {
                    axiosDraw.push(drawItemSelectMapAxios(type.indexOf(elememts[0][6][i]),
                        elememts[0][5][i], elememts[0][8][i], elememts[0][9][i], elememts[0][10][i], elememts[0][11][i]))
                    axiosIndex.push(i)
                }

                gridDrawItemSelectRestore(axiosDraw, axiosIndex, elememts);
            }

            if (modeGrid === 2) {
                const type = ['amenity', 'highway', 'way'];

                let axiosDraw = []
                let axiosIndex = []
                gridLocationMap(2, false, false)

                for (let i = 0; i < elememts[0][0].length; i ++) {
                    gridMap['locations'].forEach(element => {
                        axiosDraw.push(drawItemSelectMapAxios(type.indexOf(elememts[0][6][i]),
                            elememts[0][5][i], element[0], element[1], element[2], element[3]))
                        axiosIndex.push(i)
                    })
                }

                gridDrawItemSelectRestore(axiosDraw, axiosIndex, elememts);
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
                let created = ""

                if (modeGrid === 0) {
                    created = "INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                        "`location`, `type`, `enable`) VALUES (NULL, '" + id + "', current_timestamp(), '" +
                        markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                        "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" +
                        Number(locations[i]['enable']) + "');";
                }

                if (modeGrid === 1) {
                    for (let a = 0; a < locations[i]['location'].length; a ++) {
                        created = "INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                            "`location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) " +
                            "VALUES (NULL, '" + id + "', current_timestamp(), '" +
                            markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                            "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                            "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                            "', " + "'" + locations[i]['location'][a][0] + "', " + "'" + locations[i]['location'][a][1] +
                            "', " + "'" + locations[i]['location'][a][2] + "', " + "'" + locations[i]['location'][a][3] +
                            "', " + "'" + modeGrid + "');";

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

                if (modeGrid === 2) {
                    created = "INSERT INTO `sesion-location` (`id`, `sesion`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                        "`location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) " +
                        "VALUES (NULL, '" + id + "', current_timestamp(), '" +
                        markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                        "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                        "', " + "'" + markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', " + "'" + markerMap['location'][2] + "', " + "'" + markerMap['location'][3] +
                        "', " + "'" + modeGrid + "');";
                }

                console.log(created)

                if (modeGrid !== 1) {
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
                let created = ""

                if (modeGrid === 0) {
                    created = "INSERT INTO `share-location` (`id`, `share`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                        "`location`, `type`, `enable`) VALUES (NULL, '" + idShare + "', current_timestamp(), '" +
                        markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                        "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" +
                        Number(locations[i]['enable']) + "');";
                }

                if (modeGrid === 1) {
                    for (let a = 0; a < locations[i]['location'].length; a ++) {
                        created = "INSERT INTO `share-location` (`id`, `share`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                            "`location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) " +
                            "VALUES (NULL, '" + idShare + "', current_timestamp(), '" +
                            markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                            "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                            "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                            "', " + "'" + locations[i]['location'][a][0] + "', " + "'" + locations[i]['location'][a][1] +
                            "', " + "'" + locations[i]['location'][a][2] + "', " + "'" + locations[i]['location'][a][3] +
                            "', " + "'" + modeGrid + "');";

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

                if (modeGrid === 2) {
                    created = "INSERT INTO `share-location` (`id`, `share`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
                        "`location`, `type`, `enable`, `lat1_grid`, `lat2_grid`, `lon1_grid`, `lon2_grid`, `type_grid`) " +
                        "VALUES (NULL, '" + idShare + "', current_timestamp(), '" +
                        markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
                        "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
                        "', " + "'" + markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
                        "', " + "'" + markerMap['location'][2] + "', " + "'" + markerMap['location'][3] +
                        "', " + "'" + modeGrid + "');";
                }

                console.log(created)

                if (modeGrid !== 1) {
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

            // console.log(result);
            // for (let i = 0; i < locations.length; i++) {
            //     let created = "INSERT INTO `share-location` (`id`, `share`, `date`, `lat1`, `lat2`, `lon1`, `lon2`, " +
            //         "`location`, `type`, `enable`) VALUES (NULL, '" + idShare + "', current_timestamp(), '" +
            //         markerMap['location'][0] + "', " + "'" + markerMap['location'][1] +
            //         "', '" + markerMap['location'][2] + "', '" + markerMap['location'][3] +
            //         "', '" + locations[i]['name'] + "', '" + locations[i]['type'] + "', '" + Number(locations[i]['enable']) +
            //         "');";
            //     $.ajax({
            //         type: "POST",
            //         url: server + "connection.php",
            //         async: false,
            //         data: {"database": "geomap", "type": 0, "sql": created},
            //         success: function (result) {
            //             console.log(result);
            //         }
            //     });
            // }
        }
    });
}
