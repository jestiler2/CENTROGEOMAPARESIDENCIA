function removeAllMap (all, modal, home) {
    removeMap();
    $("#address").val("");
    markerMap['data'] = null;
    resetSearchOption();
    mapLayers = [];
    document.getElementById("inner-layers").innerHTML = "";
    hideShare();
    hideControl();

    if (all) {
        removeSearchOption();
        removeCap(markerMap['market']);
        removeCap(markerMap['position']);
        removeDraw();
        removeGrid();
        markerMap['location'] = [];
        markerMap['radio'] = null;
        gridMap['now'] = []
        gridMap['data'] = []
        gridMap['locations'] = []
        gridMap['markets'] = []
        gridMap['locations_now'] = []
        gridMap['index_grid'] = null
        enableGrid = false
        modeGrid = 0;
    }

    if (modal) $("#message-modal").modal('toggle');
    if (home) map.setView([23.466302332191862, -102.1152141635831], 5);
}

function removeMap () {
    if (enableGrid) {
        mapLayers.forEach((layer) => layer['data'].forEach((element) => element.removeFrom(map)));
    } else {
        mapLayers.forEach((layer) => layer['data'].removeFrom(map));
    }
}

function removeGrid () {
    gridMap.markets.forEach((layer) => layer.removeFrom(map));
}

function removeCap (layer) {
    if (layer) layer.removeFrom(map);
}

function removeDraw () {
    editableLayers.clearLayers();
}

function hideShare () {
    document.getElementById("control-location").style.display = "none";
}

function showShare () {
    document.getElementById("control-location").style.display = "block";
}

function hideControl () {
    document.getElementById("control-map").style.display = "none";
}

function showControl () {
    document.getElementById("control-map").style.display = "block";
}

function updateComponents () {
    removeMap();
    document.getElementById("inner-layers").innerHTML = "";

    for (let index = 0; index < mapLayers.length; index++) {
        const element = document.createElement('div');
        element.innerHTML = '<div class="input-group mb-3">' +
            '<div style="display: flex; width: 100%; z-index: 500">' +
            '<div class="input-group-prepend">' +
            '<div class="input-group-text" style="background-color: ' + mapLayers[index]['colorGUI'] +
            '; cursor: pointer;" onclick=' + '"layerSelect(' + index + ')">' +
            '<input type="checkbox" aria-label="Checkbox for following text input" id="element' + index + '">' +
            '</div>' +
            '</div>' +
            '<div style="display: flex; justify-content: space-between; width: 100%; background-color: #FFFFFF; ' +
            'padding: 10px; border: 1px solid #ced4da;">' +
            '<span style="margin-right: 10px;">' +
            mapLayers[index]['name'].toUpperCase() +
            "<small class='d-block text-muted'>" + mapLayers[index]['type'] + "</small>" +
            "</span>" +
            "<div " + 'style="display: flex; width: 50%; justify-content: flex-end; align-items: center;"' +
            "><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/OOjs_UI_icon_clear-destructive" +
            ".svg/1200px-OOjs_UI_icon_clear-destructive.svg.png' alt='twbs' width='32' height='32' " +
            "class='rounded-circle flex-shrink-0' onclick='" + 'removeLayer(' + index + ')' +
            "' style='cursor: pointer;'></div>" +
            "</div>" +
            '</div>' +
            '</div>';
        document.getElementById("inner-layers").appendChild(element);
        if (enableGrid) {
            if (mapLayers[index]['enable'] === true) {
                mapLayers[index]['data'].forEach(element => {
                    element.addTo(map);
                })
            }
        } else {
            if (mapLayers[index]['enable'] === true) {
                mapLayers[index]['data'].addTo(map);
            }
        }
    }

    mapLayers.forEach((layer, index) => {
            const select = document.getElementById("element" + index);
            select.checked = layer['enable']
    });

    if (mapLayers !== []) removeAndCreatedLocation(mapLayers);
}

function layerSelect (id) {
    mapLayers[id]['enable'] = !mapLayers[id]['enable'];
    updateComponents();
}

function removeLayerSelect (index) {
    removeMap();
    mapLayers.splice(index, 1);
    updateComponents();
    $("#message-modal").modal('toggle');
}

function checkLayer (name) {
    for (let index = 0; index < mapLayers.length; index ++) {
        if (name === mapLayers[index]['name']) {
            return true;
        }
    }
    return false;
}

function removeSearchOption() {
    removeOptions("amenity");
    removeOptions("highway");
    removeOptions("way");
}

function resetSearchOption() {
    resetOptions("amenity");
    resetOptions("highway");
    resetOptions("way");
}

function downloadGeoJSON () {
    if (markerMap['data']) download("GeoJSON.json", JSON.stringify(markerMap['data']));
}

function viewGeoJSON () {
    if (markerMap['data']) {
        let view = window.open("");
        view.document.write(JSON.stringify(markerMap['data']));
    }
}

async function downloadGeoJSON (type, name, lat1, lat2, log1, log2, lat1_1, lat2_1, log1_1, log2_1) {
    const position_array = lat1_1 ? ['https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;'] :
            ['https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;']
    let json = await (await fetch(position_array[type])).json();
    download("GeoJSON.json", JSON.stringify(json));
}

async function viewGeoJSON (type, name, lat1, lat2, log1, log2, lat1_1, lat2_1, log1_1, log2_1) {
    const position_array = lat1_1 ? ['https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="' + name + '"](' + lat1_1 + ',' + log1_1 + ',' + lat2_1 + ',' + log2_1 + ');node(w)->.x;);out;'] :
            ['https://www.overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(node["highway"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;',
            'https://www.overpass-api.de/api/interpreter?data=[out:json];(way["highway"="' + name + '"](' + lat1 + ',' + log1 + ',' + lat2 + ',' + log2 + ');node(w)->.x;);out;']

    let json = await (await fetch(position_array[type])).json();
    let view = window.open("");
    view.document.write(JSON.stringify(json));
}


function controlLayer(mode) {
    removeMap();
    for (let index = 0; index < mapLayers.length; index ++) {
        mode === 1 ? mapLayers[index]['enable'] = true : mode === 2 ? mapLayers[index]['enable'] = !mapLayers[index]['enable'] : mapLayers[index]['enable'] = false;
    }
    updateComponents();
    $("#message-modal").modal('toggle');
}

function selectGrid () {
    // removeGrid()
    // gridMap['markets'][gridMap['index_grid']] = L.rectangle([[gridMap['locations'][gridMap['index_grid']][0], gridMap['locations'][gridMap['index_grid']][2]], [gridMap['locations'][gridMap['index_grid']][1], gridMap['locations'][gridMap['index_grid']][3]]], {color: "#ffffff", weight: 2})
    // gridMap['markets'] = crearteGridMarket(gridMap['locations'])

}
