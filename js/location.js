function locationUser () {
    loading();
    toogleMessage();
    removeAllMap(true, false, false);
    map.locate({enableHighAccuracy:true});
    map.once('locationfound', e => {

        const circleOptions = {
            color: '#CFB87F',
            fillColor: '#F5EAD8',
            fillOpacity: 0.5
        }

        const locationIcon = new L.Icon({
            iconUrl: 'img/market.png',
            iconSize: [50, 50],
            iconAnchor: [25, 50]
        });


        const coords = [e.latlng.lat , e.latlng.lng];
        markerMap['radio'] = document.getElementById("input-range").value
        markerMap['market'] = L.marker(coords, {icon: locationIcon}).bindPopup('Ubicacion del usuario');
        markerMap['position'] = L.circle(coords, Number(markerMap['radio']), circleOptions)

        map.addLayer(markerMap['market']);
        markerMap['position'].addTo(map);
        map.fitBounds(markerMap['position'].getBounds());

        let location = [markerMap['position'].getBounds()._southWest.lat,
                        markerMap['position'].getBounds()._northEast.lat,
                        markerMap['position'].getBounds()._southWest.lng,
                        markerMap['position'].getBounds()._northEast.lng];

        map.fitBounds([[location[0], location[2]],
            [location[1], location[3]]]);
        markerMap['location'] = location;

        const locationAjax = addLocationMap(location[0],location[1],location[2],location[3],false, true);
        $.when.apply($, locationAjax).then(function() {
            console.log("termine el ajax Location")
        });
    });
}