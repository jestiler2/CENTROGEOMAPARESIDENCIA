function addLocationMap (lat1, lat2, lon1, lon2, modal, end) {
    if (modal) loading();
    return $.ajax({
        type: "POST",
        url: server + "0.1.php",
        dataType: 'json',
        async: true,
        data: {"lat1": lat1, "lat2": lat2, "lon1": lon1, "lon2": lon2},
        success: function (result) {
            console.log(result)
            try {
                let requestPHP = result;
                let elememts = [];

                for (element in requestPHP) {
                    if (element !== null) {
                        elememts.push(requestPHP[element]);
                    }
                }

                addOptions("amenity", elememts[0], elememts[3]);
                addOptions("highway", elememts[1], elememts[4]);
                addOptions("way", elememts[2], elememts[5]);
                $("#address").val('');
                markerMap['data'] = null;
                if (end) finish();
            } catch (error) {
                console.log(error)
                if (end) finish();
            }
        }
    });
}

function addLocationMapAxios (lat1, lat2, lon1, lon2) {
    return axios.post(server + "0.1.1.php", {"lat1": lat1, "lat2": lat2, "lon1": lon1, "lon2": lon2})
}

function drawItemSelect (option, name, modal, end) {
    if (modal) loading();
    const menu = document.getElementById(name);
    const select = menu.options[menu.selectedIndex].value;

    if ((checkSelection(select) || checkLayer(select)) && modeGrid !== 1) {
        if (modal) finish();
        return;
    }

    if (enableGrid) {
        gridDrawItemSelect(name, select, option)
        console.log("es grid")
        return;
    }

    function onEachFeature (feature, layer) {
        console.log(feature)
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];
        const akey = "AIzaSyCXoz_2n1LLHf29EXEBXLLQYgSBG-yA9lk";
        const style = "style='padding: 8px; background-color: green; color: white; " +
            "border-radius: 8px; text-decoration: none;'";
        const style_details = "style='padding: 8px; background-color: #d9d9d9; color: black; " +
            "border-radius: 8px; text-decoration: none; margin-top: 5px; display: inline-block; " +
            "cursor: pointer;'";
        let popupContent = "";

        if (option === 0) {
            popupContent = "<p>" + feature.properties.amenity.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            popupContent += "<p> Latitud: " + lat + "</p>"
            popupContent += "<p> Longitud: " + lon + "</p>"
            popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
            popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
            popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
            layer.bindPopup(popupContent);
        }

        if (option === 1) {
            popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            popupContent += "<p> Latitud: " + lat + "</p>"
            popupContent += "<p> Longitud: " + lon + "</p>"
            popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
            popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
            popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
            layer.bindPopup(popupContent);
        }

        if (option === 2) {
            popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            layer.bindPopup(popupContent);
        }
    }

    const drawAjax = $.ajax({
        type: "POST",
        url: server + "0.2.php",
        dataType: 'json',
        async: true,
        data: {
            "name": select, "type": option, "lat1": markerMap['location'][0],
            "lat2": markerMap['location'][1], "lon1": markerMap['location'][2], "lon2": markerMap['location'][3]
        },
        success: function (result) {
            console.log(result)
            try {

                let requestPHP = result;
                let elememts = [];

                for (element in requestPHP) {
                    if (element !== null) {
                        elememts.push(requestPHP[element]);
                    }
                }
                $("#address").val(elememts[0]);
                markerMap['data'] = elememts[1];

                const colorMarket = generateRandomColor(false);
                const colorWay = option !== 2 ? "#" + colorMarket : generateRandomColor(true);

                const geo = L.geoJSON(elememts[1], {
                    pointToLayer: function (feature, latlng) {
                        const icon = new L.Icon({
                            iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + colorMarket + '&chf=a,s,ee00FFFF',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, {icon: icon});

                    }, onEachFeature: onEachFeature, style: function (geoJsonFeature) {
                        return {color: colorWay}
                    }
                });

                const struture = {
                    name: select,
                    type: name,
                    data: geo,
                    color: colorMarket,
                    enable: true,
                    colorGUI: colorWay
                };

                mapLayers.push(struture);
                updateComponents();

                if (end) finish();
                showShare();
                showControl();

            } catch (error) {
                console.log(error)
                if (end) finish();
            }
        }
    });

    $.when.apply($, drawAjax).then(function() {
        console.log("termine el item ajax")
    });
}

function drawItemSelectMapAxios(type, name, lat1, lat2, lon1, lon2) {
    return axios.post(server + "0.2.1.php", { "name": name, "type": type, "lat1": lat1,
                                              "lat2": lat2, "lon1": lon1, "lon2": lon2 })
}

function drawItemSelectRestore (option, select, type, enable, modal, end) {
    if (modal) loading();

    function onEachFeature (feature, layer) {
        console.log(feature)
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];
        const akey = "AIzaSyCXoz_2n1LLHf29EXEBXLLQYgSBG-yA9lk";
        const style = "style='padding: 8px; background-color: green; color: white; " +
            "border-radius: 8px; text-decoration: none;'";
        const style_details = "style='padding: 8px; background-color: #d9d9d9; color: black; " +
            "border-radius: 8px; text-decoration: none; margin-top: 5px; display: inline-block; " +
            "cursor: pointer;'";
        let popupContent = "";

        if (option === 0) {
            popupContent = "<p>" + feature.properties.amenity.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            popupContent += "<p> Latitud: " + lat + "</p>"
            popupContent += "<p> Longitud: " + lon + "</p>"
            popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
            popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
            popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
            layer.bindPopup(popupContent);
        }

        if (option === 1) {
            popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            popupContent += "<p> Latitud: " + lat + "</p>"
            popupContent += "<p> Longitud: " + lon + "</p>"
            popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
            popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
            popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
            layer.bindPopup(popupContent);
        }

        if (option === 2) {
            popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
            if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
            layer.bindPopup(popupContent);
        }
    }

    return setTimeout(function () { $.ajax({
        type: "POST",
        url: server + "0.2.php",
        dataType: 'json',
        async: true,
        data: {
            "name": select, "type": option, "lat1": markerMap['location'][0],
            "lat2": markerMap['location'][1], "lon1": markerMap['location'][2], "lon2": markerMap['location'][3]
        },
        success: function(result) {
            console.log(result)
            try {

                let requestPHP = result;
                let elememts = [];

                for (element in requestPHP) {
                    if (element !== null) {
                        elememts.push(requestPHP[element]);
                    }
                }
                $("#address").val(elememts[0]);
                markerMap['data'] = elememts[1];

                const colorMarket = generateRandomColor(false);
                const colorWay = option !== 2 ? "#" + colorMarket : generateRandomColor(true);
                const geo = L.geoJSON(elememts[1], {
                    pointToLayer: function (feature, latlng) {
                        const icon = new L.Icon({
                            iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + colorMarket + '&chf=a,s,ee00FFFF',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        });
                        return L.marker(latlng, {icon: icon});

                    }, onEachFeature: onEachFeature, style: function (geoJsonFeature) {
                        return {color: colorWay}
                    }
                });

                const struture = {
                    name: select,
                    type: type,
                    data: geo,
                    color: colorMarket,
                    enable: enable === '1' ? true : false,
                    colorGUI: colorWay
                };

                mapLayers.push(struture);
                updateComponents();

                if (end) finish();
                showShare();
                showControl();

            } catch (error) {
                console.log(error)
                if (end) finish();
            }
        }
    })}, 1000);
}

function getPlaceID(lat, lon, type, name) {
    loading();
    console.log(lat, lon, type, name);

    const ajaxID = $.ajax({
        type: "POST",
        url: server + "0.3.php",
        dataType: 'json',
        async: true,
        data: { "lat": lat, "lon": lon, "type": type, "name": name },
        error: function (error) {
            finish();
            setMessageError(error["responseText"]);
            finish()},
        success: function(result) {
            console.log(result)
            if (result['details_place'].length > 0) {
                getInformationPlace(result['details_place'])
            } else {
                finish();
                getDetailsPlace(null, false);
            }
        }
    });

    $.when.apply($, ajaxID).then(function() {
        console.log("termine el id ajax")
    });
}

function getInformationPlace(data) {
    if (data.length > 1) {finish(); getDetailsPlace(data, false); return;}
    const ajaxPlace = $.ajax({
        type: "POST",
        url: server + "0.4.php",
        dataType: 'json',
        async: true,
        data: { "json": data[0]},
        error: function (error) {
            finish();
            setMessageError(error["responseText"]);
        },
        success: function(result) {
            finish();
            getDetailsPlace(result, true);
        }
    });

    $.when.apply($, ajaxPlace).then(function() {
        console.log("termine el information ajax")
    });
}
