var filters = require('./filters');
var geocode = require('./geocode');
var plansdata = require('./plansdata');
require('typeahead.js');

var plansBloodhound;

module.exports = {
    init: function (selector) {
        plansBloodhound = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 10,
            local: plansdata.getNames(filters.getState()).map(name => ({ name })),
        });
        plansBloodhound.initialize();

        $(selector).typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'plans',
            displayKey: 'name',
            source: plansBloodhound.ttAdapter()
        });

        $(selector).on('keyup', function (e) {
            if (e.keyCode === 13) {
                search(selector, $(selector).val());
            }
        });

        $(selector).on('typeahead:selected', function (e, suggestion) {
            $(selector).trigger('planfound', suggestion.name);
        });
        $(selector).on('typeahead:autocompleted', function (e, suggestion) {
            $(selector).trigger('planfound', suggestion.name);
        });
    },

    search: function (selector, q) {
        geocode.geocode(q, [-74.402161, 40.475158, -73.642731, 40.984045], 'NY',
            function (results, status) {
                if (status === 'OK') {
                    $(selector).trigger('resultfound', results);
                }
            }
        );
    },

    update: function () {
        plansBloodhound.clear();
        plansBloodhound.add(plansdata.getNames(filters.getState()).map(name => ({ name })));
    }
};
