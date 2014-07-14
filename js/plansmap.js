var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var plansfilters = require('./plansfilters');
var singleminded = require('./singleminded');

var map,
    lotsLayer,
    highlightCartoCSS,
    highlightedLotLayer,
    planOutlines = {},
    planOutlinesNames = {},
    planOutlinesPopups = {},
    userMarker;

var defaultCartoCSS = '#lots{ polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-color: #000; line-width: 0.5; line-opacity: 0.75; [zoom < 14] { line-width: 1; } }';
var highlightedLotCartoCSS = 'polygon-fill: #CFA470;' +
    '[zoom <= 12] { line-width: 5; line-color: #CFA470; }' +
    '[zoom <= 14] { line-width: 3; line-color: #CFA470; }';
var highlightedPlanCartoCSS = 'polygon-fill: #FFFFCC;';

function unHighlightLot() {
    map.closePopup();
    highlightedLotLayer.clearLayers();           
    singleminded.forget('highlightLot_centroid');
    singleminded.forget('highlightLot_geometry');
}

function unhighlightLotsInPlan() {
    var cartocss = defaultCartoCSS;
    if (highlightCartoCSS) {
       cartocss += highlightCartoCSS;
    }
    lotsLayer.setCartoCSS(cartocss);
}

function clearPlanOutline(options) {
    options = options || {};
    var label = options.label;
    if (planOutlines[label]) {
        planOutlines[label].clearLayers();
    }
    if (planOutlinesPopups[label]) {
        map.closePopup(planOutlinesPopups[label]);
    }
    planOutlinesNames[label] = null;
}

module.exports = {

    init: function (id, onLotsLayerReady) {
        map = L.map(id, {
            maxZoom: 18,
            minZoom: 10,
            zoomControl: false
        });

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        var streets = L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
            mapId: 'ebrelsford.ihbc8hpf',
            maxZoom: 18
        }).addTo(map);

        var satellite = new L.BingLayer('Ajio1n0EgmAAvT3zLndCpHrYR_LHJDgfDU6B0tV_1RClr7OFLzy4RnkLXlSdkJ_x');

        var baseLayers = {
            streets: streets,
            satellite: satellite
        };

        L.control.layers(baseLayers, {}, {
            position: 'bottomleft'
        }).addTo(map);

        map.on('baselayerchange', function (e) {
            $('body').toggleClass('night-mode', e.name === 'satellite');
        });

        cartodb.createLayer(map, {
            cartodb_logo: false,
            user_name: 'urbanreviewer',
            type: 'cartodb',
            sublayers: [{
                cartocss: defaultCartoCSS,
                interactivity: 'block, lot, plan_name, borough',
                sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
            }]
        })
        .addTo(map)
        .done(function (layer) {
            lotsLayer = layer.getSubLayer(0);
            lotsLayer.setInteraction(true);
            layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
                map.fire('planlotclick', data);
            });

            layer.on('featureOver', function (e, latlng, pos, data) {
                // Update mouse cursor when over a feature
                $('#' + map._container.id).css('cursor', 'pointer');
                data.latlng = latlng;
                map.fire('planlotover', data);
            });
            layer.on('featureOut', function (e, latlng, pos, data) {
                // Reset mouse cursor when no longer over a feature
                var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
                $('#' + map._container.id).attr('style',  grabStyle);
                map.fire('planlotout', data);
            });

            map.addLayer(layer, false);
            onLotsLayerReady();

            streets.bringToBack();
            map.on('baselayerchange', function (e) {
                e.layer.bringToBack();
            });
        });

        highlightedLotLayer = L.geoJson(null, {
            style: function (feature) {
                return {
                    color: '#4E4E4E',
                    fill: false,
                    weight: 3
                };
            }
        }).addTo(map);

        return map;
    },

    setActiveArea: function (options) {
        options = options || {};
        var activeAreaOptions = {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '100%'
        }

        if (options.area === 'narrow') {
            activeAreaOptions.right = '75%';
        }

        if (options.area === 'half') {
            activeAreaOptions.right = '50%';
        }

        if (options.area === 'most') {
            activeAreaOptions.right = '25%';
        }

        map.setActiveArea(activeAreaOptions);
    },

    filterLotsLayer: function (filters, extendLastFilters) {
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id " +
            plansfilters.getWhereClause(filters, extendLastFilters);
        lotsLayer.setSQL(sql);
    },

    highlightLot: function (options) {
        unHighlightLot();

        var url = 'http://urbanreviewer.cartodb.com/api/v2/sql?q=',
            whereConditions = [],
            options = options || {};
        if (options.block) {
            whereConditions.push('l.block = ' + options.block);
        }
        if (options.borough) {
            whereConditions.push("p.borough = '" + options.borough + "'");
        }
        if (options.lot) {
            whereConditions.push('l.lot = ' + options.lot);
        }
        if (options.plan_name) {
            whereConditions.push("p.name = '" + options.plan_name + "'");
        }

        // Get geometry
        var geometrySql = 'SELECT l.the_geom AS the_geom ' +
                'FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id ';
        geometrySql += ' WHERE ' + whereConditions.join(' AND ');
        singleminded.remember('highlightLot_geometry', 
            $.get(url + geometrySql + '&format=GeoJSON', function (data) {
                highlightedLotLayer.addData(data);           
            })
        );
    },

    unHighlightLot: unHighlightLot,

    highlightLots: function (options) {
        options = options || {};
        highlightCartoCSS = '';
        var selector = '#lots';

        if (options.dispositions && options.dispositions.length > 0) {
            selector += _.map(options.dispositions, function (disposition) {
                return '[disposition_filterable=~".*' + disposition + '.*"]';
            }).join('');
        }
        if (options.public_vacant && options.public_vacant === true) {
            selector += '[in_596=true]';
        }

        // Only add the highlighted CartoCSS if there are things to highlight
        if (selector !== '#lots') {
            highlightCartoCSS = selector + '{' + highlightedLotCartoCSS + '}';
        }

        lotsLayer.setCartoCSS(defaultCartoCSS + highlightCartoCSS);
    },

    clearPlanOutline: clearPlanOutline,

    unhighlightLotsInPlan: unhighlightLotsInPlan,

    highlightLotsInPlan: function (planName) {
        unhighlightLotsInPlan;
        var cartocss = '';

        if (planName) {
            cartocss += '#lots[plan_name="' + planName + '"]{' +
                highlightedPlanCartoCSS +
            '}';
        }

        cartocss = defaultCartoCSS + cartocss;
        if (highlightCartoCSS) {
           cartocss += highlightCartoCSS;
        }
        lotsLayer.setCartoCSS(cartocss);
    },

    addPlanOutline: function (planName, options) {
        options = options || {};
        var label = options.label,
            outline = planOutlines[label];

        // Jump out if no label to use or the plan is already outlined
        if (!label || planOutlinesNames[label] === planName) {
            return;
        }

        if (outline) {
            clearPlanOutline({ label: label });
        }
        else {
            outline = planOutlines[label] = L.geoJson(null, {
                style: function (feature) {
                    return {
                        color: '#000',
                        dashArray: '10 10 1 10',
                        fill: false,
                        stroke: true
                    };
                }
            }).addTo(map);
        }

        planOutlinesNames[label] = planName;
        var sql = "SELECT ST_Buffer(ST_ConvexHull(ST_Union(l.the_geom)), 0.0001) AS the_geom " + 
                  "FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id " +
                  "WHERE p.name = '" + planName + "'";
        cartodbapi.getGeoJSON(sql, function (data) {
            outline.addData(data);
            
            if (options.zoomToPlan === true) {
                map.fitBounds(outline.getBounds(), {
                    padding: [25, 25]            
                });
            }

            if (options.popup) {
                var popupOptions = {
                    autoPan: false,
                    closeButton: false
                };
                planOutlinesPopups[label] = L.popup(popupOptions)
                    .setLatLng(outline.getBounds().getCenter())
                    .setContent(planName)
                    .openOn(map);
            }
        });
    },

    addUserMarker: function (latlng) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.userMarker(latlng, {
            smallIcon: true                        
        }).addTo(map);
        map.setView(latlng, 16);
    }

};
