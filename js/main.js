var querystring = require('querystring');

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    parseHash: function(hash) {
        // Parse hash for the map. Based on OSM's parseHash.
        var args = {};

        var i = hash.indexOf('#');
        if (i < 0) {
            return args;
        }

        hash = querystring.parse(hash.substr(i + 1));

        var map = (hash.map || '').split('/'),
            zoom = parseInt(map[0], 10),
            lat = parseFloat(map[1]),
            lon = parseFloat(map[2]);

        if (!isNaN(zoom) && !isNaN(lat) && !isNaN(lon)) {
            args.center = new L.LatLng(lat, lon);
            args.zoom = zoom;
        }

        return args;
    },

    formatHash: function(args) {
        // Format hash for the map. Based on OSM's formatHash.
        var center, zoom;

        if (args instanceof L.Map) {
            center = args.getCenter();
            zoom = args.getZoom();
        }
        center = center.wrap();

        var precision = 4,
            hash = '#map=' + zoom +
                '/' + center.lat.toFixed(precision) +
                '/' + center.lng.toFixed(precision);

        return hash;
    }
};

$(document).ready(function () {

    var parsedHash = urbanreviewer.parseHash(window.location.hash),
        zoom = parsedHash.zoom || 12,
        center = parsedHash.center || [40.739974, -73.946228];

    var map = L.map('map', {
        maxZoom: 18,
        zoomControl: false
    }).setView(center, zoom);

    map.on('moveend', function () {
        window.location.hash = urbanreviewer.formatHash(map);
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

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

            //history.pushState(null, null, '/plans/');

            var template = JST['handlebars_templates/plan.hbs'];
            templateContent = template(data);
            $('#right-pane').append(templateContent);
            $('#right-pane').show();

            $.get('plans/' + data.borough + '/' + data.plan_name, function (content) {
                $('#right-pane #plan-details').append(content);
            });

            var sql = 
                "SELECT p.borough AS borough, l.block AS block, l.lot AS lot " +
                "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
                "WHERE p.name='" + data.plan_name + "' " +
                "ORDER BY l.block, l.lot";
            $.get(urbanreviewer.sql_api_base + "?q=" + sql, function (data) {
                var lots_template = JST['handlebars_templates/lots.hbs'];
                var content = lots_template(data);
                $('#lots-content').append(content);
                $('.lot-count').text(data.rows.length);
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
