var _ = require('underscore');

var filters = require('./filters');
var hash = require('./hash');
var highlights = require('./highlights');
var plansmap = require('./plansmap');
var search = require('./search');
var sidebar = require('./sidebar');

var currentPage,
    currentPlan,
    currentSidebar,
    currentLot = {},
    currentTitle,
    planOutline,
    lotsLayer,
    defaultZoom = 12,
    defaultCenter = [40.739974, -73.946228],
    userMarker;

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    selectPlan: function (name, map) {
        currentPlan = name;
        currentSidebar = null;
        pushState(name);
        unloadFilters();
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan, { zoomToPlan: true });
    },

    addPlanContent: function ($location, borough, planName) {
        $.get('plans/' + borough + '/' + planName.replace('/', '-'), function (content) {
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

    loadSidebar: function (name, addHistory) {
        if (currentSidebar === name) { return; }
        currentSidebar = name;
        if (name === 'filters') {
            openFilters();
        }
        else {
            unloadFilters();
            if (name === 'plans') {
                openPlanList();
            }
        }
        if (addHistory) {
            var title = name[0].toUpperCase() + name.slice(1);
            pushState(title);
        }
    },

    unloadSidebar: function () {
        currentSidebar = null;
        // Stash filters container if it's out
        unloadFilters();
        sidebar.close('#right-pane');
        setTitle(null);
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
            "SELECT p.borough AS borough, l.bbl AS bbl, l.block AS block, " +
                "l.lot AS lot, l.disposition_display AS disposition, " +
                "l.in_596 as in_596 " +
            "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
            "WHERE p.name='" + data.plan_name + "' " +
            "ORDER BY l.block, l.lot";
        $.get(urbanreviewer.sql_api_base + "?q=" + sql, function (data) {
            var lots_template = JST['handlebars_templates/lots.hbs'];
            var content = lots_template(data);
            $('#lots-content').append(content);
            $('.lot-count').text(data.rows.length);
            $('.lot').on({
                mouseover: function () {
                    plansmap.highlightLot($(this).data());
                },
                mouseout: function () {
                    plansmap.unHighlightLot();
                }
            });
        });
    },

    loadPage: function (url) {
        unloadFilters();
        $.get(url, function (content) {
            sidebar.open('#right-pane', content);
        });
    }
};

function setTitle(title) {
    if (title === undefined) {
        displayTitle = currentTitle;
    }
    else {
        var displayTitle = 'Urban Reviewer';
        if (title) {
            displayTitle = title + ' | ' + displayTitle;
        }
        currentTitle = displayTitle;
    }
    $('title').html(displayTitle);
}

function pushState(title) {
    setTitle(title);
    var state = {
        title: title
    };
    if (currentSidebar) {
        state.sidebar = currentSidebar;
    }
    if (currentPlan) {
        state.plan = currentPlan;
    }
    if (currentPage) {
        state.page = currentPage;
    }

    var url = hash.formatHash({
        filters: filters.getState(),
        map: map,
        page: currentPage,
        planName: currentPlan,
        sidebar: currentSidebar
    });
    history.pushState(state, null, url);
}

function getDispositions() {
    var dispositions = [
        'open space',
        'recreational',
        'community facility',
        'residential',
        'commercial',
        'industrial',
        'institutional',
        'public',
        'semi-public',
        'utility',
        'easement',
        'street',
        'illegible'
    ];
    return _.map(dispositions, function (disposition) {
        return {
            id: disposition.replace(' ', '-'),
            label: disposition
        };
    });
}

function openFilters() {
    sidebar.open('#right-pane', $('#filters-container').show(), 'narrow');
}

function unloadFilters() {
    if ($('#filters-container:visible').length > 0) {
        $('#filters-container').hide().appendTo('body');
    }
}

function loadFilters(alreadyOpen) {
    var template = JST['handlebars_templates/filters.hbs'],
        $target = $('body'),
        $content = $(template({
            dispositions: getDispositions(),
            years: _.range(1952, 2014)
        }));

    if (alreadyOpen) {
        $target = $('#right-pane');
    }
    else {
        $content.hide();
    }

    $target.append($content);

    filters
        .init({
            active: '#plan-status-active',
            dateRange: '#date-range-picker',
            expired: '#plan-status-expired',
            lastUpdated: '#last-updated',
            mayors: '#mayors'
        }, hash.parseHash(window.location.hash).filters)
        .on('change', function (e, filters) {
            pushState('Filters');
        });

    highlights.init({
        dispositions: '#dispositions',
        public_vacant: '#public-vacant'
    });
}

function openPlanList() {
    var template = JST['handlebars_templates/plan_list.hbs'];
    $.getJSON('http://urbanreviewer.cartodb.com/api/v2/sql?q=SELECT name, borough FROM plans ORDER BY name', function (results) {
        sidebar.open('#right-pane', template({
            plans: results.rows
        }), 'narrow');
        $('#plan-list-filters-link').click(function () {
            urbanreviewer.loadSidebar('filters', true);
            return false;
        });
        $('.plan').click(function () {
            urbanreviewer.selectPlan($(this).data('name'), map);
        });
    });
}

$(document).ready(function () {

    /*
     * Initialize map
     */
    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || defaultZoom,
        center = parsedHash.center || defaultCenter;
    currentPage = parsedHash.page;
    currentPlan = parsedHash.plan;

    map = plansmap.init('map', function () {
        // Don't load filters until we have a lots layer to filter on
        loadFilters(parsedHash.sidebar === 'filters');
    });

    if (currentPage || currentPlan) {
        // If there's a plan selected already, set the active area so we can
        // zoom to it appropriately
        plansmap.setActiveArea(map, { area: 'half' });
    }
    else if (currentSidebar) {
        plansmap.setActiveArea(map, { area: 'most' });
    }
    else {
        plansmap.setActiveArea(map, { area: 'full' });
    }

    map
        .setView(center, zoom)
        .on('moveend', function () {
            pushState();
        });
        .on('planlotclick', function (data) {
            urbanreviewer.selectPlan(data.plan_name, map);
        })
        .on('planlotover', function (data) {
            if (currentPlan && data.plan_name === currentPlan) {
                if (data.block !== currentLot.block || data.lot !== currentLot.lot) {
                    currentLot = {
                        block: data.block,
                        lot: data.lot
                    };
                    plansmap.highlightLot({
                        plan_name: currentPlan,
                        block: data.block,
                        lot: data.lot
                    });
                }
            }
        })
        .on('planlotout', function (data) {
            currentLot = {};
            plansmap.unHighlightLot();
        });


    /*
     * Initialize sidebar
     */
    $('#right-pane').on('open', function (e, size) {
        if (size === 'wide') {
            $('#date-range-picker-container').hide();
            $('#map-filters-toggle').hide();
            $('#search-container').hide();
            plansmap.setActiveArea(map, { area: 'half' });
        }
        else if (size === 'narrow') {
            plansmap.setActiveArea(map, { area: 'most' });
            $('#date-range-picker-container').addClass('narrow-sidebar');
            $('#date-range-picker').dateRangeSlider('resize');
        }
    });

    $('#right-pane').on('close', function () {
        $('#date-range-picker-container').show();
        $('#date-range-picker-container').removeClass('narrow-sidebar');
        $('#date-range-picker').dateRangeSlider('resize');
        $('#map-filters-toggle').show();
        $('#search-container').show();
        plansmap.setActiveArea(map, { area: 'full' });

        currentPlan = null;
        setTitle(null);
        pushState();
        urbanreviewer.clearPlanOutline(map);
    });

    $('.sidebar-link').click(function (e) {
        currentPage = $(this).attr('href');
        pushState();
        urbanreviewer.loadPage(currentPage);
        return false;
    });


    /*
     * If a plan or sidebar was in the url, open it.
     */
    if (currentPlan) {
        $('#search-container').hide();
        unloadFilters();
        setTitle(currentPlan);
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan);
    }

    if (parsedHash.sidebar) {
        urbanreviewer.loadSidebar(parsedHash.sidebar);
    }


    /*
     * Listen for popstate
     */
    $(window).on('popstate', function (e) {
        var parsedHash = hash.parseHash(window.location.hash),
            previousPlan = currentPlan,
            previousPage = currentPage,
            sidebar = parsedHash.sidebar,
            state = e.originalEvent.state;
        map.setView(parsedHash.center, parsedHash.zoom);
        currentPage = parsedHash.page;
        currentPlan = parsedHash.plan;
        if (currentPlan && currentPlan !== previousPlan) {
            urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
            urbanreviewer.addPlanOutline(map, currentPlan);
        }
        if (currentPage && currentPage !== previousPage) {
            urbanreviewer.loadPage(currentPage);
        }
        if (sidebar) {
            urbanreviewer.loadSidebar(sidebar, false);
        }
        else if (state === null) {
            urbanreviewer.unloadSidebar();
        }

        var title = null;
        if (state) {
            title = state.title;
        }
        setTitle(title);
    });


    /*
     * Initialize search
     */
    search.init('#search');
    $('#search').on('resultfound', function (e, results) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.userMarker(results.latlng, {
            smallIcon: true                        
        }).addTo(map);
        map.setView(results.latlng, 16);
    });
    $('#search').on('planfound', function (e, name) {
        urbanreviewer.selectPlan(name, map);
    });


    /*
     * Initialize dateRangeSlider
     *
     * TODO consider moving to filters
     */
    $('#date-range-picker')
        .dateRangeSlider({
            arrows: false,
            defaultValues: {
                min: new Date(1952, 0, 1),
                max: new Date(2014, 0, 1)
            },
            bounds: {
                min: new Date(1952, 0, 1),
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
            plansmap.filterLotsLayer({
                start: data.values.min.getFullYear(), 
                end: data.values.max.getFullYear()
            });
        });

    if (currentPage) {
        urbanreviewer.loadPage(currentPage);
    }

    $('#map-filters-toggle').click(function () {
        if (sidebar.isOpen('#right-pane')) {
            urbanreviewer.unloadSidebar();
        }
        else {
            urbanreviewer.loadSidebar('plans', true);
        }
        return false;
    });
});
