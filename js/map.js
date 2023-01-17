const map = L.map('map').setView([23.466302332191862, -102.1152141635831], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const drawPluginOptions = {
    position: 'topright',
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
        marker: false,
        circlemarker: false
    },
    edit: false
};

const drawControl = new L.Control.Draw(drawPluginOptions);
map.addControl(drawControl);

const carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {attribution: '©OpenStreetMap, ©CartoDB',subdomains: 'abcd',maxZoom: 24});

const minimap = new L.Control.MiniMap(carto_light, {
    toggleDisplay: true,
    minimized: false,
    position: "bottomleft" });
minimap.addTo(map);

const scale = new L.control.scale({imperial: false});
scale.addTo(map);

const editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:drawstart', function () {
    removeAllMap(true, false, false);
});

map.on('draw:created', function (e) {

    console.log(e)

    // Width
    console.log(map.distance(L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getWest()), L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getEast())))
    // Heigth
    console.log(map.distance(L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getWest()), L.latLng(e.layer.getBounds().getNorth(), e.layer.getBounds().getWest())))

    editableLayers.addLayer(e.layer);
    let location = [e.layer.getBounds().getSouth(),
                    e.layer.getBounds().getNorth(),
                    e.layer.getBounds().getWest(),
                    e.layer.getBounds().getEast()];

    map.fitBounds([[location[0], location[2]],
                   [location[1], location[3]]]);
    markerMap['location'] = location;
    gridMap['now'] = location;

    const distanceBaseWidth = gridMap['base'][0]
    const distanceBaseHeigth = gridMap['base'][1]

    const distanceNowWidth = map.distance(L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getWest()),
                             L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getEast()))
    const distanceNowHeigth = map.distance(L.latLng(e.layer.getBounds().getSouth(), e.layer.getBounds().getWest()),
                             L.latLng(e.layer.getBounds().getNorth(), e.layer.getBounds().getWest()))

    gridMap['data'].push(getDifferenceLocation(distanceBaseWidth, distanceNowWidth, gridMap['now'], true))
    gridMap['data'].push(getDifferenceLocation(distanceBaseHeigth, distanceNowHeigth, gridMap['now'], false))

    gridMap['locations'] = getGrid(gridMap['data'], gridMap['now'])

    if (gridMap['locations'] && gridMap['locations'].length > 0) {
        searchAll();
    } else {
        const locationAjax = addLocationMap(location[0],location[1],location[2],location[3],true, true);
        $.when.apply($, locationAjax).then(function() {
            console.log("termiine el ajaxLocation")
        });
    }
});