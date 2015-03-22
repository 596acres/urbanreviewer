var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var cartocss = require('./cartocss').cartocss;
var plansfilters = require('./plansfilters');
var singleminded = require('./singleminded');

require('../bower_components/leaflet-active-area/src/L.activearea');
require('../bower_components/leaflet-plugins/layer/tile/Bing');
require('../bower_components/leaflet-usermarker/src/leaflet.usermarker');

var map,
    currentMode = 'daymode',
    currentPlan,
    filters = {},
    lotsLayer,
    highlightCartoCSS,
    highlightedLotLayer,
    planOutlines = {},
    planOutlinesNames = {},
    planOutlinesPopups = {},
    userMarker;


function updateStyles() {
    // Update the plan's styles using the current state
    lotsLayer.setCartoCSS(cartocss({ 
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    }));
}

function unHighlightLot(e) {
    if (!planOutlinesPopups.hover) {
        map.closePopup();
    }
    highlightedLotLayer.clearLayers();           
    singleminded.forget('highlightLot_centroid');
    singleminded.forget('highlightLot_geometry');
}

function unhighlightLotsInPlan() {
    currentPlan = null;
    updateStyles();
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

        var streets = L.mapbox.tileLayer('urbanreviewer.8b5195d9', {
                accessToken: 'pk.eyJ1IjoiZWJyZWxzZm9yZCIsImEiOiI2VFFWT21ZIn0.qhtAhoVTOPzFwWAi7YHr_Q',
                detectRetina: true 
            })
            .addTo(map);

        var satellite = new L.BingLayer('Ajio1n0EgmAAvT3zLndCpHrYR_LHJDgfDU6B0tV_1RClr7OFLzy4RnkLXlSdkJ_x');

        var baseLayers = {
            streets: streets,
            satellite: satellite
        };

        L.control.layers(baseLayers, {}, {
            position: 'bottomleft'
        }).addTo(map);

        cartodb.createLayer(map, {
            cartodb_logo: false,
            user_name: 'urbanreviewer',
            type: 'cartodb',
            sublayers: [{
                cartocss: cartocss(),
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
            map
                .on('baselayerchange', function (e) {
                    $('body').toggleClass('night-mode', e.name === 'satellite');
                    currentMode = e.name === 'satellite' ? 'nightmode' : 'daymode';
                    updateStyles();
                    e.layer.bringToBack();
                })
                .on('mousemove', function (e) {
                    if (!e.latlng) { return; }

                    // If we're no longer over the hover outline, close it
                    var hoverOutline = planOutlines.hover;
                    if (!(hoverOutline && hoverOutline.getLayers().length > 0 && hoverOutline.getBounds())) { return; }
                    if (!hoverOutline.getBounds().contains(e.latlng)) {
                        if (planOutlinesPopups.hover) {
                            map.closePopup();
                        }
                        clearPlanOutline({ label: 'hover' });
                    }
                });
        });

        highlightedLotLayer = L.geoJson(null, {
            style: function (feature) {
                return {
                    color: '#000',
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
        };

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
            whereConditions = [];
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
        geometrySql = encodeURIComponent(geometrySql);
        singleminded.remember('highlightLot_geometry', 
            $.get(url + geometrySql + '&format=GeoJSON', function (data) {
                highlightedLotLayer.addData(data);           
            })
        );
    },

    unHighlightLot: unHighlightLot,

    highlightLots: function (options) {
        options = options || {};

        filters.dispositions = options.dispositions;
        filters.publicVacant = options.public_vacant;

        updateStyles();
    },

    clearPlanOutline: clearPlanOutline,

    unhighlightLotsInPlan: unhighlightLotsInPlan,

    highlightLotsInPlan: function (planName) {
        unhighlightLotsInPlan();
        currentPlan = planName;
        updateStyles();
    },

    addPlanOutline: function (planName, options) {
        options = options || {};
        var label = options.label,
            outline = planOutlines[label];

        // Jump out if no label to use or the plan is already outlined
        if (!label || planOutlinesNames[label] === planName) {
            return;
        }
        planOutlinesNames[label] = planName;

        if (outline) {
            clearPlanOutline({ label: label });
        }
        else {
            outline = planOutlines[label] = L.geoJson(null, {
                style: function (feature) {
                    var strokeColor = $('body').is('.night-mode') ? '#fff' : '#000';
                    return {
                        clickable: true,
                        color: strokeColor,
                        dashArray: '10 10 1 10',
                        fill: true,
                        fillOpacity: 0,
                        opacity: 1,
                        stroke: true
                    };
                }
            }).addTo(map);

            if (label === 'hover') {
                outline
                    .on('mouseout', function () {
                        map.fire('planout', { label: label });
                    })
                    .on('click', function () {
                        map.fire('planclick', { plan_name: planOutlinesNames[label] });
                    });
            }
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
