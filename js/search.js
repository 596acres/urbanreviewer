var geocode = require('./geocode.js');

function init(selector) {
    $(selector).on('keyup', function (e) {
        if (e.keyCode === 13) {
            search(selector, $(selector).val());
        }
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
