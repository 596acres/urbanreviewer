require('bootstrap.carousel');
require('jquery.colorbox');
require('jquery.scrollTo');
var _ = require('underscore');
var plansdata = require('./plansdata');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

var scrollToHeight;

function addPlanContent($location, borough, planName) {
    var planDirectory = 'plans/' + borough + '/' + encodeURIComponent(planName.replace('/', '-')) + '/';
    $.get(planDirectory, function (content) {
        $location.append(content);

        $location.find('img')
            .each(function (i) {
                var src = $(this).attr('src');

                // If we're not dealing with an external or absolute image path
                // prepend the plan directory
                if (src.indexOf('http') !== 0 && src.indexOf('/') !== 0) {
                    src = planDirectory + '/' + src;
                    $(this).attr('src', src);
                }
                $(this).wrap('<a class="colorbox" href="' + src + '"></a>');

                // Add indicators under carousel
                var $indicator = $('<li></li>')
                    .attr({
                        'data-target': '#image-container',
                        'data-slide-to': i
                    });
                $('#image-container .carousel-indicators').append($indicator);
            });

        // Finally, add images to carousel
        var $imgs = $location.find('.colorbox')
            .appendTo('#image-container .carousel-inner')
            .wrap('<div class="item"></div>');

        // If images exist, show the carousel and get it going
        var $items = $('#image-container .item');
        if ($items.length > 0) {
            $('#image-container')
                .carousel('next')
                .show();
            $('#image-container .colorbox').colorbox({
                maxHeight: '100%',
                maxWidth: '100%'
            });
        }
        if ($items.length === 1) {
            $('.carousel-control,.carousel-indicators').hide();
        }
    })
    .fail(function () {
        if (window.console) {
            console.warn('Failed to get page for ' + planName + ': ' + planDirectory);
        }
    });
}

function loadLots($target, planName) {
    const lots = {
        rows: plansdata.getPlanLots(planName)
            .map(l => ({
                ...l.properties,
                borough_code: l.properties.bbl.slice(0, 1),
                disposition: l.properties.disposition_display,
            }))
    };

    const lots_template = JST['handlebars_templates/lots.hbs'];
    const content = lots_template(lots);

    $target.append(content);
    $('.lot-count').text(lots.rows.length);

    $('.lot').on({
        mouseenter: function () {
            plansmap.highlightLot($(this).data());
        },
        mouseleave: function () {
            plansmap.unHighlightLot();
        }
    });
}

function cleanData(row) {
    cleaned = _.extend({}, row);

    if (row.status) {
        if (row.status === 'active') {
            cleaned.status = 'active';
        }
        else if (row.status === 'expired') {
            cleaned.status = 'expired';
        }
        else {
            cleaned.status = 'unknown';
        }
    }
    return cleaned;
}

function unhighlightLot() {
    $('.lot').removeClass('highlighted');
}

module.exports = {

    load: async function ($target, options) {
        sidebar.open();
        let row = plansdata.getPlan(options.plan_name);
        row = cleanData(row);

        // Load basic template for the plan
        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(row);
        sidebar.open(templateContent);

        // Measure available width and set the header's width to it
        var headerWidth = $target.innerWidth() - $('.panel-toggle').outerWidth();
        $('.plan-header-content').width(headerWidth);

        // Load details for the plan
        var $details = $target.find('#plan-details');
        addPlanContent($details, row.borough, options.plan_name);

        // Load the plan's lots
        loadLots($('#lots-content'), options.plan_name);

        scrollToHeight = $('#right-pane').height() / 2;
    },

    highlightLot: function (block, lot) {
        unhighlightLot();

        var $lot = $('.lot[data-block=' + block +'][data-lot=' + lot + ']');
        $lot.addClass('highlighted');
        $('#right-pane').scrollTo($lot, 100, {
            axis: 'y',
            margin: true,
            offset: -scrollToHeight,
            queue: false
        });
    },

    unhighlightLot: unhighlightLot

};
