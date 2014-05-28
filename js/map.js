var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql'
};

$(document).ready(function () {

    var map = L.map('map', {
        maxZoom: 18,
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
            cartocss: '#lots{ polygon-fill: #FF6600; polygon-opacity: 0.7; line-color: #FFF; line-width: 1; line-opacity: 1; }',
            interactivity: 'block, lot, plan_name, borough',
            sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
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

            $.get('plans/' + data.borough + '/' + data.plan_name, function (content) {
                $('#right-pane #plan-details').append(content);
            });

            var sql = "SELECT p.borough AS borough, l.block AS block, l.lot AS lot FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id WHERE p.name='" + data.plan_name + "' ORDER BY l.block, l.lot";
            $.get(urbanreviewer.sql_api_base + "?q=" + sql, function (data) {
                var lots_template = JST['handlebars_templates/lots.hbs'];
                var content = lots_template(data);
                $('#lots-content').append(content);
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
