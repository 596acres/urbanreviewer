var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

var scrollToHeight;

function addPlanContent($location, borough, planName) {
    $.get('plans/' + borough + '/' + planName.replace('/', '-'), function (content) {
        $location.append(content);
    });
}

function loadDetails(planName, success) {
    var sql = "SELECT * FROM plans WHERE name = '" + planName + "'";
    cartodbapi.getJSON(sql, function (results) {
        row = results.rows[0];
        success(row);
    });
}

function loadLots($target, planName) {
    var sql = 
        "SELECT p.borough AS borough, l.bbl AS bbl, l.block AS block, " +
            "l.lot AS lot, l.disposition_display AS disposition, " +
            "l.in_596 as in_596 " +
        "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
        "WHERE p.name='" + planName + "' " +
        "ORDER BY l.block, l.lot";
    cartodbapi.getJSON(sql, function (data) {
        var lots_template = JST['handlebars_templates/lots.hbs'];
        var content = lots_template(data);
        $target.append(content);
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
}

function cleanData(row) {
    cleaned = _.extend({}, row);
    if (row.adopted) {
        // We want the year exactly as it appears in CartoDB, not modified for 
        // timezone
        cleaned.adopted = row.adopted.slice(0, row.adopted.indexOf('-'));
    }

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

    load: function ($target, options) {
        loadDetails(options.plan_name, function (row) {
            row = cleanData(row);

            // Load basic template for the plan
            var template = JST['handlebars_templates/plan.hbs'];
            templateContent = template(row);
            sidebar.open('#' + $target.attr('id'), templateContent);

            // Measure available width and set the header's width to it
            var headerWidth = $target.innerWidth() - $('.panel-toggle').outerWidth();
            $('.plan-header-content').width(headerWidth);

            // Load details for the plan
            var $details = $target.find('#plan-details');
            addPlanContent($details, row.borough, options.plan_name);

            // Load the plan's lots
            loadLots($('#lots-content'), options.plan_name);
        });

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
