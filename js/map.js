$(document).ready(function () {

    var map = L.map('map', {
        zoomControl: false
    }).setView([40.739974, -73.946228], 12);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        mapId: 'ebrelsford.ho06j5h0',
        maxZoom: 18
    }).addTo(map);

    $.getJSON('data/data.geojson', function (data) {
        L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.on('click', function () {
                    $.get('plans/' + feature.properties.borough + '/' + feature.properties.name, function (content) {
                        layer.bindPopup(content).openPopup();
                    });
                });
            }
        }).addTo(map);
    });

});
