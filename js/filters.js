var plansmap = require('./plansmap');

module.exports = {

    init: function (options) {
        options = options || {};

        if (options.mayors && options.dateRange) {
            $(options.mayors).change(function () {
                var mayor = $(this).find(':selected');
                // Date range slider takes care of filtering here
                $(options.dateRange).dateRangeSlider(
                    'values',
                    new Date(parseInt(mayor.data('start')), 0, 1),
                    new Date(parseInt(mayor.data('end')), 0, 1)
                );
            });
        }

        if (options.active) {
            $(options.active).change(function () {
                plansmap.filterLotsLayer({ active: $(this).is(':checked') }, true);
            });
        }

        if (options.expired) {
            $(options.expired).change(function () {
                plansmap.filterLotsLayer({ expired: $(this).is(':checked') }, true);
            });
        }

        if (options.lastUpdated) {
            $(options.lastUpdated).change(function () {
                plansmap.filterLotsLayer({
                    lastUpdated: $(this).find(':selected').val()
                }, true);
            });
        }
    }

};
