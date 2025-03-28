var geotransforms = require('./geotransforms');
var plansdata = require('./plansdata');
require('leaflet-active-area');
require('leaflet-plugins/layer/tile/Bing');
require('leaflet-usermarker');

var map,
    currentMode = 'daymode',
    currentPlan,
    filters = {},
    lotsLayer,
    hiddenLots = [], // Lots filtered out
    highlightedLots = [],
    planOutlines = {},
    planOutlinesNames = {},
    planOutlinesPopups = {},
    userMarker;

function updateStyle(lotFeature, opts = {}) {
    const { dispositions, mode, plan, public_vacant } = opts;

    let newStyle = {
        color: 'black',
        weight: 0.5,
        opacity: 0.75,
        fillColor: 'black',
        fillOpacity: 0.5,
    };

    if (mode === 'nightmode') {
        newStyle.color = newStyle.fillColor = 'white';
    }

    if (plan && lotFeature.feature.properties.plan_name === plan) {
        newStyle.fillColor = '#F9EF6C';
    }

    if (dispositions && dispositions.length > 0 || public_vacant) {
        const { disposition_filterable, in_596 } = lotFeature.feature.properties;
        let matchesFilters = (
            (
                (dispositions && dispositions.length === 0) ||
                dispositions.includes(disposition_filterable)
            ) && (!public_vacant || in_596)
        );

        if (matchesFilters) {
            newStyle.color = newStyle.fillColor = '#CFA470';
        }
    }

    lotFeature.setStyle(newStyle);
}

function updateStyles() {
    // Update the plan's styles using the current state
    const opts = {
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    };
    lotsLayer.getLayers().forEach(l => updateStyle(l, opts));
}

function unHighlightLot(e) {
    if (!planOutlinesPopups.hover) {
        map.closePopup();
    }

    const opts = {
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    };
    highlightedLots.forEach(l => updateStyle(l, opts));
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

        var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            detectRetina: true,
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'urbanreviewer/ckatva3cz2g8d1itdu51tt3zt',
            accessToken: 'pk.eyJ1IjoidXJiYW5yZXZpZXdlciIsImEiOiJDeWJrNG1zIn0.WcU_wA3WIwvkFy178qe3-w'
        }).addTo(map);

        var satellite = new L.BingLayer('Ajio1n0EgmAAvT3zLndCpHrYR_LHJDgfDU6B0tV_1RClr7OFLzy4RnkLXlSdkJ_x');

        var baseLayers = {
            streets: streets,
            satellite: satellite
        };

        L.control.layers(baseLayers, {}, {
            position: 'bottomleft'
        }).addTo(map);

        lotsLayer = L.geoJson(plansdata.getLots(), {
            style: f => {
                return {
                    color: 'black',
                    weight: 0.5,
                    opacity: 0.75,
                    fillOpacity: 0.5,
                };
            },
        }).addTo(map);

        lotsLayer.on('click', (e) => {
            map.fire('planlotclick', e.layer.feature.properties);
        });

        lotsLayer.on('mouseover', (e) => {
            map.fire('planlotover', e.layer.feature.properties);
        });

        lotsLayer.on('mouseout', (e) => {
            map.fire('planlotout', e.layer.feature.properties);
        });

        onLotsLayerReady();

        // map.whenReady(() => streets.bringToBack());
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
        const filteredPlanIds = plansdata.getPlans(filters, extendLastFilters).map(p => p.cartodb_id);

        // Lots to remove from map
        const toRemove = lotsLayer.getLayers().filter(l => {
            return !filteredPlanIds.includes(l.feature.properties.plan_id);
        });

        // Lots to bring back from hidden area
        const toAdd = hiddenLots.filter(l => {
            return filteredPlanIds.includes(l.feature.properties.plan_id);
        });

        const toAddIds = toAdd.map(l => l.feature.properties.cartodb_id);
        toAdd.forEach(l => lotsLayer.addLayer(l));
        hiddenLots = hiddenLots.filter(l => !toAddIds.includes(l.feature.properties.cartodb_id));

        toRemove.forEach(l => {
            lotsLayer.removeLayer(l);
            hiddenLots.push(l);
        });
    },

    highlightLot: function (options) {
        unHighlightLot();

        lotsLayer.getLayers().forEach(l => {
            const { block, borough, lot, plan_name } = l.feature.properties;

            let matches = (
                (!options.block || block === options.block) &&
                (!options.borough || borough === options.borough) &&
                (!options.lot || lot === options.lot) &&
                (!options.plan_name || plan_name === options.plan_name)
            );
            
            if (matches) {
                highlightedLots.push(l);
                l.setStyle({
                    color: '#000',
                    weight: 3
                });
            }
        });
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
                style: function () {
                    var strokeColor = $('body').is('.night-mode') ? '#fff' : '#000';
                    return {
                        interactive: label !== 'select',
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
                        planOutlines[label].getLayers().forEach(l => {
                            l.setStyle({ interactive: false, fillOpacity: 0 });
                        });
                        map.fire('planclick', { plan_name: planOutlinesNames[label] });
                    });
            }
        }

        planOutlinesNames[label] = planName;

        const buffer = geotransforms.convexBuffer(plansdata.getPlanLots(planName));

        outline.addData(buffer);
            
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
