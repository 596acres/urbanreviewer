$(document).ready(function () {

    var map = L.map('map', {
        zoomControl: false
    }).setView([40.739974, -73.946228], 12);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    var hash = new L.Hash(map);

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        mapId: 'ebrelsford.ho06j5h0',
        maxZoom: 18
    }).addTo(map);

    cartodb.createLayer(map, {
        cartodb_logo: false,
        user_name: 'urbanreviewer',
        type: 'cartodb',
        sublayers: [{
            cartocss: '#plans{ polygon-fill: #FF6600; polygon-opacity: 0.7; line-color: #FFF; line-width: 1; line-opacity: 1; }',
            interactivity: 'borough,block,lot,urpc_r3__3',
            sql: 'SELECT * FROM plans'
        }]
    })
    .addTo(map)
    .done(function (layer) {
        layer.getSubLayer(0).setInteraction(true);
        layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
            $('#right-pane *').remove();

            var template = JST['handlebars_templates/plan.hbs'];
            templateContent = template(data);
            $('#right-pane').append(templateContent);
            $('#right-pane').show();

            $.get('plans/' + data.borough + '/' + data.urpc_r3__3, function (content) {
                $('#right-pane #plan-details').append(content);
            });
        });

        // Update mouse cursor when over a feature
        layer.on('featureOver', function () {
            $('#' + map._container.id).css('cursor', 'pointer');
        });
        layer.on('featureOut', function () {
            $('#' + map._container.id).css('cursor', 'grab');
        });

        map.addLayer(layer, false);
    });

});
