var cartodbapi = require('./cartodbapi');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

function addPlanContent($location, borough, planName) {
    $.get('plans/' + borough + '/' + planName.replace('/', '-'), function (content) {
        $location.append(content);
    });
}

function loadBorough(planName, success) {
    var sql = "SELECT * FROM plans WHERE name = '" + planName + "'";
    cartodbapi.getJSON(sql, function (results) {
        options = results.rows[0];
        success(options.borough);
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

module.exports = {

    load: function ($target, options) {
        // Load basic template for the plan
        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(options);
        sidebar.open('#' + $target.attr('id'), templateContent);

        // Load details for the plan
        var $details = $target.find('#plan-details');
        if (options.borough) {
            addPlanContent($details, options.borough, options.plan_name);
        }
        else {
            // If we don't have borough, get it first
            loadBorough(options.plan_name, function (borough) {
                addPlanContent($details, borough, options.plan_name);
            });
        }

        // Load the plan's lots
        loadLots($('#lots-content'), options.plan_name);
    }

};
