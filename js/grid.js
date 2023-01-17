function getDistance(start, end, normal = true) {
    result = normal ? end - start : end + start
    return result
}

function getDifferenceLocation (base, now, data, witdh) {
    if (now > base) {
        const multiple = Math.abs(Math.ceil(now / base))
        const section = witdh ? getDistance(data[0], data[1]) / multiple : getDistance(data[2], data[3]) / multiple
        return  { multiple: multiple, section: section }
    } else {
        return null
    }
}

function getGrid (gridLocation, location) {
    if (gridLocation[0] !== null && gridLocation[0]['multiple'] > 0 && gridLocation[1] == null) {
        let grids = []
        console.log("1")
        for (let i = 0; i < gridLocation[0]['multiple']; i ++) {
            let grid = [0,0,0,0]

            if (i === 0) {
                grid[0] = location[0]
                grid[1] = location[0] + ((i + 1) * gridLocation[0]['section'])
            } else {
                grid[0] = location[0] + (i * gridLocation[0]['section'])
                grid[1] = location[0] + ((i + 1) * gridLocation[0]['section'])
            }

            grid[2] = location[2]
            grid[3] = location[3]

            console.log(grid)
            grids.push(grid)
        }
        return grids
    }

    if (gridLocation[0] == null && gridLocation[1] !== null && gridLocation[1]['multiple'] > 0) {
        console.log("2")
        let grids = []
        for (let i = 0; i < gridLocation[1]['multiple']; i ++) {
            let grid = [0,0,0,0]

            grid[0] = location[0]
            grid[1] = location[1]

            if (i === 0) {
                grid[2] = location[2]
                grid[3] = location[2] + ((i + 1) * gridLocation[1]['section'])
            } else {
                grid[2] = location[2] + (i * gridLocation[1]['section'])
                grid[3] = location[2] + ((i + 1) * gridLocation[1]['section'])
            }

            console.log(grid)
            grids.push(grid)
        }
        return grids
    }

    if ((gridLocation[0] && gridLocation[0]['multiple'] > 0) && (gridLocation[1] && gridLocation[1]['multiple'] > 0)) {
        console.log("3")
        let grids = []
        for (let i = 0; i < gridLocation[0]['multiple']; i ++) {
            for (let a = 0; a < gridLocation[1]['multiple']; a ++) {
                let grid = [0,0,0,0]

                if (i === 0) {
                    grid[0] = location[0]
                    grid[1] = location[0] + ((i + 1) * gridLocation[0]['section'])
                } else {
                    grid[0] = location[0] + (i * gridLocation[0]['section'])
                    grid[1] = location[0] + ((i + 1) * gridLocation[0]['section'])
                }

                if (a === 0) {
                    grid[2] = location[2]
                    grid[3] = location[2] + ((a + 1) * gridLocation[1]['section'])
                } else {
                    grid[2] = location[2] + (a * gridLocation[1]['section'])
                    grid[3] = location[2] + ((a + 1) * gridLocation[1]['section'])
                }

                console.log(grid)
                grids.push(grid)
            }
        }
        return grids
    }

    return null
}

function crearteGridMarket (locations) {
    let gridMarket = []
    locations.forEach((element, index) => {
        let amenityPost = {'multiple': {}, 'elements': []}
        let highwayPost = {'multiple': {}, 'elements': []}
        let wayPost = {'multiple': {}, 'elements': []}

        let market = L.rectangle([[element[0], element[2]], [element[1], element[3]]], {color: "#3388FF", weight: 2})
        market.on('click', function (e) {
            if (gridMap['index_grid'] !== index) {
                loading();
                removeSearchOption();
                gridMap['locations_now'] = element
                const axionPost = [addLocationMapAxios(element[0], element[1], element[2], element[3])];
                axios.all(axionPost).then(axios.spread((...responses) => {
                    responses.forEach(element => {
                        console.log(element.data)
                        addPlace(amenityPost, {'multiple': element['data']['amenity2'], 'elements': element['data']['amenity']})
                        addPlace(highwayPost, {'multiple': element['data']['highway2'], 'elements': element['data']['highway']})
                        addPlace(wayPost, {'multiple': element['data']['way2'], 'elements': element['data']['way']})
                    })

                    finish()
                    amenityPost['multiple'] = sortObjectbyValue(amenityPost['multiple']);
                    highwayPost['multiple'] = sortObjectbyValue(highwayPost['multiple']);
                    wayPost['multiple'] = sortObjectbyValue(wayPost['multiple']);

                    console.log(amenityPost, highwayPost, wayPost)
                    addOptions("amenity", Object.keys(amenityPost['multiple']), amenityPost['multiple'], false);
                    addOptions("highway", Object.keys(highwayPost['multiple']), highwayPost['multiple'], false);
                    addOptions("way", Object.keys(wayPost['multiple']), wayPost['multiple'], false);
                })).catch(errors => {
                    console.log(errors)
                })

                gridMap['index_grid'] = index;
                selectGrid();
            }
        })
        gridMarket.push(market)
        market.addTo(map);
    })
    return gridMarket
}

function gridLocationMap (mode, start = true, end = true) {
    if (mode === 1) {
        gridMap['markets'] = crearteGridMarket(gridMap['locations'])
        modeGrid = 1;
    }

    if (mode === 2) {
        let axionPost = []
        let amenityPost = {'multiple': {}, 'elements': []}
        let highwayPost = {'multiple': {}, 'elements': []}
        let wayPost = {'multiple': {}, 'elements': []}

        gridMap['locations'].forEach(element => {
            axionPost.push(addLocationMapAxios(element[0], element[1], element[2], element[3]))
        })

        start ? loadingGrid() : null;
        axios.all(axionPost).then(axios.spread((...responses) => {
            responses.forEach(element => {
                console.log(element.data)
                addPlace(amenityPost, {'multiple': element['data']['amenity2'], 'elements': element['data']['amenity']})
                addPlace(highwayPost, {'multiple': element['data']['highway2'], 'elements': element['data']['highway']})
                addPlace(wayPost, {'multiple': element['data']['way2'], 'elements': element['data']['way']})
            })

            end ? finish() : null;

            amenityPost['multiple'] = sortObjectbyValue(amenityPost['multiple']);
            highwayPost['multiple'] = sortObjectbyValue(highwayPost['multiple']);
            wayPost['multiple'] = sortObjectbyValue(wayPost['multiple']);

            console.log(amenityPost, highwayPost, wayPost)
            addOptions("amenity", Object.keys(amenityPost['multiple']), amenityPost['multiple'], false);
            addOptions("highway", Object.keys(highwayPost['multiple']), highwayPost['multiple'], false);
            addOptions("way", Object.keys(wayPost['multiple']), wayPost['multiple'], false);

            modeGrid = 2;
        })).catch(errors => {
            console.log(errors)
        })
    }

    enableGrid = true
    $("#message-modal").modal('toggle');
}

function gridDrawItemSelect (name, select, type) {

    let axiosDraw = []

    const colorMarket = generateRandomColor(false);
    const colorWay = type !== 2 ? "#" + colorMarket : generateRandomColor(true);

    let found = -1

    for (let i = 0; i < mapLayers.length; i ++) {
        if (mapLayers[i]['name'] === select && mapLayers[i]['type'] === name) {
            found = i
        }
    }

    console.log(found)

    let struture = {
        name: select,
        type: name,
        data: [],
        color: colorMarket,
        enable: true,
        colorGUI: colorWay,
        location: []
    };

    if (modeGrid == 1) {
        axiosDraw.push(drawItemSelectMapAxios(type, select, gridMap['locations_now'][0], gridMap['locations_now'][1],
                                                            gridMap['locations_now'][2], gridMap['locations_now'][3]))
    }

    if (modeGrid == 2) {
        gridMap['locations'].forEach(element => {
            axiosDraw.push(drawItemSelectMapAxios(type, select, element[0], element[1], element[2], element[3]))
        })
    }

    loadingGrid();
    axios.all(axiosDraw).then(axios.spread((...responses) => {
        console.log(responses)
        responses.forEach(axiosRequest => {

            function onEachFeature(feature, layer) {
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

                if (type === 0) {
                    popupContent = "<p>" + feature.properties.amenity.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    popupContent += "<p> Latitud: " + lat + "</p>"
                    popupContent += "<p> Longitud: " + lon + "</p>"
                    popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
                    popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
                    popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
                    layer.bindPopup(popupContent);
                }

                if (type === 1) {
                    popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    popupContent += "<p> Latitud: " + lat + "</p>"
                    popupContent += "<p> Longitud: " + lon + "</p>"
                    popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
                    popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
                    popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
                    layer.bindPopup(popupContent);
                }

                if (type === 2) {
                    popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    layer.bindPopup(popupContent);
                }
            }

            let requestPHP = axiosRequest.data;
            let elememts = [];

            for (element in requestPHP) {
                if (element !== null) {
                    elememts.push(requestPHP[element]);
                }
            }

            $("#address").val(elememts[0]);
            markerMap['data'] = elememts[1];

            const geo = L.geoJSON(elememts[1], {
                pointToLayer: function (feature, latlng) {
                    const icon = new L.Icon({
                        iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + (found !== -1 ? mapLayers[found]['color'] : colorMarket) + '&chf=a,s,ee00FFFF',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    return L.marker(latlng, {icon: icon});

                }, onEachFeature: onEachFeature, style: function (geoJsonFeature) {
                    return {color: (found !== -1 ? mapLayers[found]['colorGUI'] : colorWay)}
                }
            });

            if (modeGrid === 1) {
                if (found !== -1) {
                    mapLayers[found]['data'].push(geo);
                    mapLayers[found]['location'].push(gridMap['locations_now'])
                } else {
                    struture['data'].push(geo)
                    struture['location'].push(gridMap['locations_now'])
                    mapLayers.push(struture);
                }
            }

            if (modeGrid === 2) {
                struture['data'].push(geo)
            }

            console.log(axiosRequest.data)
            console.log(struture)
        })

        finish()

        if (modeGrid === 2) {
            mapLayers.push(struture);
        }

        updateComponents();
        showShare();
        showControl()

    })).catch(errors => {
        console.log(errors)
    })
}

function gridDrawItemSelectRestore (axiosDraw, axiosIndex, now) {

    let data = []
    let location = []
    let memory = [null, null]

    axios.all(axiosDraw).then(axios.spread((...responses) => {
        responses.forEach((axiosRequest, index) => {

            gridMap['locations_now'] = [parseFloat(now[0][8][axiosIndex[index]]), parseFloat(now[0][9][axiosIndex[index]]),
                                        parseFloat(now[0][10][axiosIndex[index]]), parseFloat(now[0][11][axiosIndex[index]])]

            let name = now[0][5][axiosIndex[index]];
            let type = ['amenity', 'highway', 'way'].indexOf(now[0][6][axiosIndex[index]]);
            let enable = now[0][7][axiosIndex[index]] === '1';

            console.log(type, name, enable, now[0][5][axiosIndex[index]], now[0][6][axiosIndex[index]], now[0][7][axiosIndex[index]])

            const colorMarket = generateRandomColor(false);
            const colorWay = type !== 2 ? "#" + colorMarket : generateRandomColor(true);

            let found = -1

            for (let i = 0; i < mapLayers.length; i ++) {
                if (mapLayers[i]['name'] === name && mapLayers[i]['type'] === now[0][6][axiosIndex[index]]) {
                    found = i
                }
            }

            console.log(found)

            let struture = {
                name: name,
                type: now[0][6][axiosIndex[index]],
                data: null,
                color: found !== -1 ? mapLayers[found]['color'] : colorMarket,
                enable: enable,
                colorGUI: found !== -1 ? mapLayers[found]['colorGUI'] : colorWay,
                location: null
            };

            if (index === 0 && modeGrid === 2) {
                memory[0] = colorMarket
                memory[1] = colorWay
            }

            if (found === -1 && modeGrid === 2) {
                struture['color'] = memory[0]
                struture['colorGUI'] = memory[1]
            }

            function onEachFeature(feature, layer) {
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

                if (type === 0) {
                    popupContent = "<p>" + feature.properties.amenity.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    popupContent += "<p> Latitud: " + lat + "</p>"
                    popupContent += "<p> Longitud: " + lon + "</p>"
                    popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
                    popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
                    popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
                    layer.bindPopup(popupContent);
                }

                if (type === 1) {
                    popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    popupContent += "<p> Latitud: " + lat + "</p>"
                    popupContent += "<p> Longitud: " + lon + "</p>"
                    popupContent += '<img src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + lon + '&heading=120&pitch=-0.76&key=' + akey + '" style="width:100%; border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">'
                    popupContent += "<br\><br\><a href='https://www.google.com/maps/search/?api=1&query=" + lat + "%2C" + lon + "' target='_blank' " + style + ">Google maps</a><br\><br\>";
                    popupContent += "<a onclick='getPlaceID(" + lat + ", " + lon + ', "' + feature.properties.amenity + '", "' + (feature.properties.name ? feature.properties.name.replace(/["']/g, "") : '') + '"' + ")' " + style_details + ">Detalles</a>";
                    layer.bindPopup(popupContent);
                }

                if (type === 2) {
                    popupContent = "<p>" + feature.properties.highway.toUpperCase() + "</p>";
                    if (feature.properties.name) popupContent += "<p>" + feature.properties.name + "</p>";
                    layer.bindPopup(popupContent);
                }

            }

            let requestPHP = axiosRequest.data;
            let elememts = [];

            for (element in requestPHP) {
                if (element !== null) {
                    elememts.push(requestPHP[element]);
                }
            }

            $("#address").val(elememts[0]);
            markerMap['data'] = elememts[1];

            const geo = L.geoJSON(elememts[1], {
                pointToLayer: function (feature, latlng) {
                    const icon = new L.Icon({
                        iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + struture['color'] + '&chf=a,s,ee00FFFF',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    return L.marker(latlng, {icon: icon});

                }, onEachFeature: onEachFeature, style: function (geoJsonFeature) {
                    return {color: struture['colorGUI']}
                }
            });

            if (modeGrid === 1) {
                console.log(parseFloat(now[0][8][axiosIndex[index]]),
                            parseFloat(now[0][9][axiosIndex[index]]),
                            parseFloat(now[0][10][axiosIndex[index]]),
                            parseFloat(now[0][11][axiosIndex[index]]))

                if (found !== -1) {
                    mapLayers[found]['data'].push(geo);
                    mapLayers[found]['location'].push(gridMap['locations_now'])
                    updateComponents();
                    console.log(geo)
                } else {
                    data.push(geo)
                    location.push(gridMap['locations_now'])
                    struture['data'] = data
                    struture['location'] = location
                    mapLayers.push(struture);
                    data = []
                    location = []
                    updateComponents();
                    console.log(geo)
                }
            }

            if (modeGrid === 2) {
                data.push(geo)

                if (axiosIndex.length === 1) {
                    struture['data'] = data
                    mapLayers.push(struture);
                    data = []
                }

                if ((axiosIndex.length) > (index + 1)) {
                    console.log(axiosIndex[index], axiosIndex[index + 1])
                    if (axiosIndex[index] !== axiosIndex[index + 1]) {
                        struture['data'] = data
                        mapLayers.push(struture);
                        memory[0] = colorMarket
                        memory[1] = colorWay
                        data = []
                    }
                }

                if (axiosIndex.length === (index + 1)) {
                    struture['data'] = data
                    mapLayers.push(struture);
                    data = []
                }
            }

            console.log(axiosRequest.data)
            console.log(struture)
            console.log(mapLayers)
        })


        if (modeGrid !== 1) {
            updateComponents();
        }

        showShare();
        showControl()
        finish();

    })).catch(errors => {
        console.log(errors)
    })
}