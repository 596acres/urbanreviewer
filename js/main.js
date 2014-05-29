var hash = require('./hash');

var currentPlan;
var planOutline;

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    addPlanContent: function ($location, borough, planName) {
        $.get('plans/' + borough + '/' + planName, function (content) {
            $location.append(content);
        });
    },

    addPlanOutline: function (map, planName) {
        if (planOutline) {
            planOutline.clearLayers();
        }
        var sql = "SELECT ST_Buffer(ST_ConvexHull(ST_Union(l.the_geom)), 0.0001) AS the_geom " + 
                  "FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id " +
                  "WHERE p.name = '" + planName + "'";
        $.get(urbanreviewer.sql_api_base + "?q=" + sql + '&format=GeoJSON', function (data) {
            planOutline = L.geoJson(data, {
                style: function (feature) {
                    return {
                        color: '#f00',
                        dashArray: '10 10 1 10',
                        fill: false,
                        stroke: true
                    };
                }
            }).addTo(map);
        });
    },

    loadPlanInformation: function (data) {
        $('#right-pane *').remove();

        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(data);
        $('#right-pane').append(templateContent);
        $('#right-pane').show();

        // If we don't have borough, get it first
        if (data.borough) {
            urbanreviewer.addPlanContent($('#right-pane #plan-details'),
                                         data.borough, data.plan_name);
        }
        else {
            var sql = "SELECT * FROM plans WHERE name = '" + data.plan_name + "'";
            $.get(urbanreviewer.sql_api_base + '?q=' + sql, function (results) {
                data = results.rows[0];
                urbanreviewer.addPlanContent($('#right-pane #plan-details'),
                                             data.borough, data.name);
            });
        }

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
    }
};

$(document).ready(function () {

    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || 12,
        center = parsedHash.center || [40.739974, -73.946228];
    currentPlan = parsedHash.plan;

    var map = L.map('map', {
        maxZoom: 18,
        zoomControl: false
    }).setView(center, zoom);

    map.on('moveend', function () {
        window.location.hash = hash.formatHash(map, currentPlan);
    });

    if (currentPlan) {
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan);
    }

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
            currentPlan = data.plan_name;
            window.location.hash = hash.formatHash(map, currentPlan);
            urbanreviewer.loadPlanInformation(data);
            urbanreviewer.addPlanOutline(map, currentPlan);
        });

        // Update mouse cursor when over a feature
        layer.on('featureOver', function () {
            $('#' + map._container.id).css('cursor', 'pointer');
        });
        layer.on('featureOut', function () {
            var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
            $('#' + map._container.id).attr('style',  grabStyle);
        });

        map.addLayer(layer, false);
    });

});
