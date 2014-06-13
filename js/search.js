var cartodbapi = require('./cartodbapi');
var geocode = require('./geocode.js');
require('typeahead.js');


var plansBloodhound = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    prefetch: {
        // TODO this doesn't respect current filters
        url: cartodbapi.getSqlUrl('SELECT name, borough FROM plans'),
        filter: function (results) {
            return $.map(results.rows, function (row) {
                return {
                    name: row.name,
                    borough: row.borough
                }
            });
        }
    }
});

plansBloodhound.initialize();
 
function init(selector) {
    $(selector).on('keyup', function (e) {
        if (e.keyCode === 13) {
            search(selector, $(selector).val());
        }
    });

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

    $(selector).on('typeahead:selected', function (e, suggestion) {
        $(selector).trigger('planfound', suggestion.name);
    });
    $(selector).on('typeahead:autocompleted', function (e, suggestion) {
        $(selector).trigger('planfound', suggestion.name);
    });
}

function search(selector, q) {
    geocode.geocode(q, [-74.402161, 40.475158, -73.642731, 40.984045], 'NY',
        function (results, status) {
            if (status === 'OK') {
                $(selector).trigger('resultfound', results);
            }
        }
    );
}

module.exports = {
    init: init,
    search: search
};
