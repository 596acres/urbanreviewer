var plansmap = require('./plansmap');

var eventEmitter = $({});
var state = {};

function updateState(changes) {
    _.each(changes, function (value, key) {
        if (!value) {
            delete state[key];
        }
        else {
            state[key] = value;
        }
    });   
    eventEmitter.trigger('change', state);
}

module.exports = {

    init: function (options, overrideState) {
        options = options || {};
        state = overrideState || {};

        if (options.dateRange) {
            $(options.dateRange).bind('valuesChanged', function (e, data) {
                updateState({
                    start: data.values.min.getFullYear(), 
                    end: data.values.max.getFullYear()
                });
            });
            if (state.start) {
                $(options.dateRange).dateRangeSlider('min', 
                    new Date(state.start, 0, 1)
                );
            }
            if (state.end) {
                $(options.dateRange).dateRangeSlider('max',
                    new Date(state.end, 0, 1)
                );
            }
        }

        if (options.mayors && options.dateRange) {
            $(options.mayors).change(function () {
                var mayor = $(this).find(':selected'),
                    start = parseInt(mayor.data('start')),
                    end = parseInt(mayor.data('end'));
                updateState({ mayor: mayor.val(), start: start, end: end });
                // Date range slider takes care of filtering here
                $(options.dateRange).dateRangeSlider(
                    'values',
                    new Date(start, 0, 1),
                    new Date(end, 0, 1)
                );
            });

            if (state.mayor) {
                $(options.mayors).val(state.mayor).trigger('change');
            }
        }

        if (options.active) {
            $(options.active)
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ active: checked });
                    plansmap.filterLotsLayer({ active: checked }, true);
                })
                .prop('checked', state.active)
                .trigger('change');
        }

        if (options.expired) {
            $(options.expired)
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ expired: checked });
                    plansmap.filterLotsLayer({ expired: checked }, true);
                })
                .prop('checked', state.expired)
                .trigger('change');
        }

        if (options.lastUpdated) {
            $(options.lastUpdated)
                .change(function () {
                    var lastUpdated = $(this).find(':selected').val();
                    updateState({ lastUpdated: lastUpdated });
                    plansmap.filterLotsLayer({ lastUpdated: lastUpdated }, true);
                })
                .val(state.lastUpdated)
                .trigger('change');
        }

        return eventEmitter;
    },

    getState: function () {
        return state;
    }

};
