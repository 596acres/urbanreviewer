var plansdata = require('./plansdata');
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
    return callback(plansdata.getPlans(filters, extend));
}

module.exports = {
    addToPage: addToPage,
    load: load
};
