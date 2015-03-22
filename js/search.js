var cartodbapi = require('./cartodbapi');
var filters = require('./filters');
var geocode = require('./geocode');
var plansfilters = require('./plansfilters');
require('typeahead.js');


var plansBloodhound = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
        url: cartodbapi.getSqlUrl('SELECT name FROM plans'),
        replace: function (url, query) {
            var whereClause = plansfilters.getWhereClause(filters.getState(), true);
                whereQuery = " p.name ILIKE '%" + query + "%'";
            if (whereClause) {
                whereClause += ' AND ' + whereQuery;
            }
            else {
                whereClause = 'WHERE ' + whereQuery;
            }
            sql = 'SELECT p.name FROM plans p ' + whereClause + ' ORDER BY p.name';
            return cartodbapi.getSqlUrl(sql);
        },
        filter: function (results) {
            return $.map(results.rows, function (row) {
                return {
                    name: row.name,
                    borough: row.borough
                };
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
