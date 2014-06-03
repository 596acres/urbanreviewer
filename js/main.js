var hash = require('./hash');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

var currentPlan,
    planOutline,
    lotsLayer,
    defaultZoom = 12,
    defaultCenter = [40.739974, -73.946228];

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    addPlanContent: function ($location, borough, planName) {
        $.get('plans/' + borough + '/' + planName, function (content) {
            $location.append(content);
        });
    },

    clearPlanOutline: function (map) {
        if (planOutline) {
            planOutline.clearLayers();
        }
    },

    addPlanOutline: function (map, planName, options) {
        options = options || {};
        if (planOutline) {
            planOutline.clearLayers();
        }
        else {
            planOutline = L.geoJson(null, {
                style: function (feature) {
                    return {
                        color: '#f00',
                        dashArray: '10 10 1 10',
                        fill: false,
                        stroke: true
                    };
                }
            }).addTo(map);
        }
        var sql = "SELECT ST_Buffer(ST_ConvexHull(ST_Union(l.the_geom)), 0.0001) AS the_geom " + 
                  "FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id " +
                  "WHERE p.name = '" + planName + "'";
        $.get(urbanreviewer.sql_api_base + "?q=" + sql + '&format=GeoJSON', function (data) {
            planOutline.addData(data);
            
            if (options.zoomToPlan === true) {
                map.fitBounds(planOutline.getBounds(), {
                    padding: [25, 25]            
                });
            }
        });
    },

    loadPlanInformation: function (data) {

        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(data);
        sidebar.open('#right-pane', templateContent);

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

        $('#right-pane .panel-toggle').click(function () {
            sidebar.close('#right-pane');
        });
    }
};

$(document).ready(function () {

    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || defaultZoom,
        center = parsedHash.center || defaultCenter;
    currentPlan = parsedHash.plan;

    var map = L.map('map', {
        maxZoom: 18,
        minZoom: 10,
        zoomControl: false
    });

    if (currentPlan) {
        // If there's a plan selected already, set the active area so we can
        // zoom to it appropriately
        plansmap.setActiveArea(map, { area: 'left' });
    }
    else {
        plansmap.setActiveArea(map, { area: 'full' });
    }

    map
        .setView(center, zoom)
        .on('moveend', function () {
            window.location.hash = hash.formatHash(map, currentPlan);
        });

    if (currentPlan) {
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan);
    }

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        mapId: 'urbanreviewer.idebc7lb',
        maxZoom: 18
    }).addTo(map);

    cartodb.createLayer(map, {
        cartodb_logo: false,
        user_name: 'urbanreviewer',
        type: 'cartodb',
        sublayers: [{
            cartocss: '#lots{ polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-color: #000; line-width: 0.25; line-opacity: 0.75; }',
            interactivity: 'block, lot, plan_name, borough',
            sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
        }]
    })
    .addTo(map)
    .done(function (layer) {
        lotsLayer = layer.getSubLayer(0);
        lotsLayer.setInteraction(true);
        layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
            currentPlan = data.plan_name;
            window.location.hash = hash.formatHash(map, currentPlan);
            urbanreviewer.loadPlanInformation(data);
            urbanreviewer.addPlanOutline(map, currentPlan, { zoomToPlan: true });
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

    $('#right-pane').on('open', function () {
        $('#date-range-picker-container').hide();
        plansmap.setActiveArea(map, { area: 'left' });
    });

    $('#right-pane').on('close', function () {
        $('#date-range-picker-container').show();
        plansmap.setActiveArea(map, { area: 'full' });

        currentPlan = null;
        window.location.hash = hash.formatHash(map, currentPlan);
        urbanreviewer.clearPlanOutline(map);
    });

    $(window).on('popstate', function (e) {
        var parsedHash = hash.parseHash(window.location.hash),
            previousPlan = currentPlan;
        map.setView(parsedHash.center, parsedHash.zoom);
        currentPlan = parsedHash.plan;
        if (currentPlan && currentPlan !== previousPlan) {
            urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
            urbanreviewer.addPlanOutline(map, currentPlan);
        }
    });

    $('#date-range-picker').dateRangeSlider({
        arrows: false,
        defaultValues: {
            min: new Date(1940, 0, 1),
            max: new Date(2014, 0, 1)
        },
        bounds: {
            min: new Date(1940, 0, 1),
            max: new Date(2014, 0, 1)
        },
        formatter: function (value) {
            return value.getFullYear();
        },
        step: {
            years: 1
        }
    })
    .bind('valuesChanged', function (e, data) {
        var start = data.values.min.getFullYear(), 
            end = data.values.max.getFullYear();
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id " +
            "WHERE p.adopted >= '" + start + "-01-01' " +
                "AND p.adopted <= '" + end + "-01-01'";
        lotsLayer.setSQL(sql);
    });

});
