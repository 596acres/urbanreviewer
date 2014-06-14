var cartodbapi = require('./cartodbapi');
var plansfilters = require('./plansfilters');
var plansmap = require('./plansmap');

function addToPage(filters, $target, callback) {
    var template = JST['handlebars_templates/plan_list_partial.hbs'];
    load(filters, false, function (plans) {
        $target.empty();
        $target.append($(template({ plans: plans })));
        callback($target);
        $('.plan')
            .mouseenter(function() {
                plansmap.addPlanOutline($(this).data('name'), {
                    label: 'hover',
                    popup: true
                });
            })
            .mouseleave(function() {
                plansmap.clearPlanOutline({ label: 'hover' });
            });
    });
}

function load(filters, extend, callback) {
    var whereClause = plansfilters.getWhereClause(filters, extend),
        sql = 'SELECT p.name, extract(YEAR FROM p.adopted) as adopted ' + 
            'FROM plans p ' + whereClause + ' ORDER BY p.name';
    cartodbapi.getJSON(sql, function (results) {
        callback(results.rows);
    });
}

module.exports = {
    addToPage: addToPage,
    load: load
};
