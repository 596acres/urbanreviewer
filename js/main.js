var _ = require('underscore');

var cartodbapi = require('./cartodbapi');
var filters = require('./filters');
var hash = require('./hash');
var highlights = require('./highlights');
var pages = require('./pages');
var planlist = require('./planlist');
var plans = require('./plans');
var plansmap = require('./plansmap');
var search = require('./search');
var sidebar = require('./sidebar');

// State
var currentPage,
    currentPlan,
    currentSidebar,
    currentLot = {},
    currentTitle;

// Map defaults
var defaultZoom = 12,
    defaultCenter = [40.739974, -73.946228];

function resetView() {
    sidebar.close();
    filters.resetState();
    highlights.resetState();
    map.setView(defaultCenter, defaultZoom);
    pushState(null);
}

function addPlansToPlanList(filters) {
    planlist.addToPage(filters, $('#plan-list-partial-container'), function ($ele) {
        $ele.find('.plan')
            .click(function () {
                urbanreviewer.selectPlan($(this).data('name'));
            })
    });
}

var urbanreviewer = {

    selectPlan: function (name) {
        currentPlan = name;
        currentSidebar = null;
        pushState(name);
        unloadFilters();
        unloadPlanList();
        plans.load($('#right-pane'), { plan_name: currentPlan });
        plansmap.clearPlanOutline({ label: 'hover' });
        plansmap.addPlanOutline(currentPlan, { 
            label: 'select',
            zoomToPlan: true
        });
        plansmap.highlightLotsInPlan(currentPlan);
    },

    loadSidebar: function (name, addHistory) {
        if (currentSidebar === name) { return; }
        currentSidebar = name;
        if (name === 'filters') {
            unloadPlanList();
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
        highlights: highlights.getState(),
        map: map,
        page: currentPage,
        planName: currentPlan,
        sidebar: currentSidebar
    });
    history.pushState(state, null, url);
}

function openFilters() {
    sidebar.open($('#filters-container'), 'narrow');
    $('#filters-container').show();
}

function unloadFilters() {
    if ($('#filters-container:visible').length > 0) {
        $('#filters-container').hide().appendTo('body');
    }
}

function loadFilters(alreadyOpen) {
    var template = JST['handlebars_templates/filters.hbs'],
        $target = $('body'),
        $content = $(template({ dispositions: highlights.getDispositions() }));

    if (alreadyOpen) {
        $target = $('#right-pane');
    }
    else {
        $content.hide();
    }

    $target.append($content);

    $('.help-button').tooltip();

    filters
        .init({
            active: '#plan-status-active',
            dateRange: '#date-range-picker',
            expired: '#plan-status-expired',
            lastUpdated: '#last-updated',
            mayors: '#mayors'
        }, hash.parseHash(window.location.hash).filters)
        .on('change', function (e, filters) {
            addPlansToPlanList(filters);
            pushState('Filters');
        });

    $('#filters-plan-list-link').click(function () {
        urbanreviewer.loadSidebar('plans', true);
        return false;
    });
    highlights
        .init({
            dispositions: '#dispositions',
            public_vacant: '#public-vacant'
        }, hash.parseHash(window.location.hash).highlights)
        .on('change', function (state) {
            pushState();
        });
}

function loadPlanList(alreadyOpen) {
    var template = JST['handlebars_templates/plan_list.hbs'],
        $target = $('body');

    if (alreadyOpen) {
        $target = $('#right-pane');
    }

    var $content = $(template({
        decades: [
            [1950, 1959],
            [1960, 1969],
            [1970, 1979],
            [1980, 1989],
            [1990, 1999],
            [2000, 2009],
            [2010, 2019]
        ]
    }));
    if (!alreadyOpen) {
        $content.hide();
    }
    $target.append($content);

    $('#plan-list-filters-link').click(function () {
        urbanreviewer.loadSidebar('filters', true);
        return false;
    });
    addPlansToPlanList(filters.getState());
}

function openPlanList() {
    sidebar.open($('#plan-list-container'), 'narrow');
    $('#plan-list-container').show();
}

function unloadPlanList() {
    if ($('#plan-list-container:visible').length > 0) {
        $('#plan-list-container').hide().appendTo('body');
    }
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

    sidebar.init($('#right-pane'), {
        beforeClose: function () {
            currentPage = null;
            currentPlan = null;
            currentSidebar = null;
            setTitle(null);
            unloadFilters();
            unloadPlanList();
        },
        beforeOpen: function () {
            unloadFilters();
            unloadPlanList();
        }
    });

    loadPlanList();
    map = plansmap.init('map', function () {
        // Don't load filters until we have a lots layer to filter on
        loadFilters();
        urbanreviewer.loadSidebar(parsedHash.sidebar);
        if (currentPlan) {
            plansmap.highlightLotsInPlan(currentPlan);
        }
    });
    if (currentPage) {
        plansmap.setActiveArea({ area: 'half' });
    }
    else if (currentPlan) {
        // If there's a plan selected already, set the active area so we can
        // zoom to it appropriately
        plansmap.setActiveArea({ area: 'half' });
    }
    else if (parsedHash.sidebar) {
        plansmap.setActiveArea({ area: 'most' });
    }
    else {
        plansmap.setActiveArea({ area: 'full' });
    }

    map
        .setView(center, zoom)
        .on('moveend', function () {
            pushState();
        })
        .on('planlotclick', function (data) {
            // Don't load the plan again
            if (currentPlan && data.plan_name === currentPlan) {
                return;
            }
            urbanreviewer.selectPlan(data.plan_name);
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

                    plans.highlightLot(data.block, data.lot);
                }
            }
            else {
                plansmap.addPlanOutline(data.plan_name, {
                    label: 'hover',
                    popup: true
                });
            }
        })
        .on('planlotout', function (data) {
            currentLot = {};
            if (currentPlan) {
                plansmap.unHighlightLot();
                plans.unhighlightLot();
            }
            plansmap.clearPlanOutline({ label: 'hover' });
        });


    /*
     * Initialize sidebar
     */
    $('#right-pane').on('open', function (e, size) {
        $('.visible-sidebar-' + size).show();
        $('.hidden-sidebar-' + size).hide();

        if (size === 'wide') {
            plansmap.setActiveArea({ area: 'half' });
        }
        else if (size === 'widest') {
            plansmap.setActiveArea({ area: 'narrow' });
        }
        else if (size === 'narrow') {
            plansmap.setActiveArea({ area: 'most' });
            $('#date-range-picker-container').addClass('narrow-sidebar');
            $('#date-range-picker').dateRangeSlider('resize');
        }
    });

    $('#right-pane').on('close', function () {
        $('.visible-sidebar-closed').show();
        $('.hidden-sidebar-closed').hide();

        $('#date-range-picker-container').removeClass('narrow-sidebar');
        $('#date-range-picker').dateRangeSlider('resize');
        plansmap.setActiveArea({ area: 'full' });

        currentPlan = null;
        setTitle(null);
        pushState();
        plansmap.clearPlanOutline({ label: 'select' });
        plansmap.unhighlightLotsInPlan();
    });

    $('.sidebar-link').click(function (e) {
        currentPage = $(this).attr('href');
        currentPlan = null;
        currentSidebar = null;
        pushState();
        pages.load(currentPage);
        return false;
    });


    /*
     * If a plan or sidebar was in the url, open it.
     */
    if (currentPlan) {
        unloadFilters();
        unloadPlanList();
        setTitle(currentPlan);
        plans.load($('#right-pane'), { plan_name: currentPlan });
        plansmap.addPlanOutline(currentPlan, { label: 'select' });
    }

    if (currentPage) {
        pages.load(currentPage);
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
            plans.load($('#right-pane'), { plan_name: currentPlan });
            plansmap.addPlanOutline(currentPlan, { label: 'select' });
        }
        if (currentPage && currentPage !== previousPage) {
            pages.load(currentPage);
        }
        if (sidebar) {
            urbanreviewer.loadSidebar(sidebar, false);
        }
        else if (state === null) {
            sidebar.close();
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
    $('#search').on('resultfound', function (e, result) {
        plansmap.addUserMarker(result.latlng);
    });
    $('#search').on('planfound', function (e, name) {
        urbanreviewer.selectPlan(name);
    });

    $('.sidebar-show').click(function (e) {
        urbanreviewer.loadSidebar('plans', true);
        pushState();
        $('#right-pane').scrollTop(0);
        return false;
    });

    $('#logo').click(function () {
        resetView();
        return false;
    });

    $('#narrow-sidebar-hide-button').click(function () {
        sidebar.close();
        return false;
    });
});
