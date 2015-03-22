var plansmap = require('./plansmap');

var eventEmitter = $({});
var state = {};

var minYear = 1952,
    maxYear = 2014;

var $active,
    $dateRange,
    $expired,
    $lastUpdated,
    $mayors;

function resetActive() {
    if (!$active) { return; }
    $active
        .prop('checked', false)
        .trigger('change');
}

function resetExpired() {
    if (!$expired) { return; }
    $expired
        .prop('checked', false)
        .trigger('change');
}

function resetLastUpdated() {
    if (!$lastUpdated) { return; }
    $lastUpdated
        .val('')
        .trigger('change');
}

function resetMayors() {
    if (!$mayors) { return; }
    $mayors
        .val('')
        .trigger('change');
}

/*
 * Remove useless / default properties from the state.
 */
function cleanState(state) {
    var cleaned = {};
    _.each(state, function (value, key) {
        if (!value || 
            (key === 'end' && value === maxYear) ||
            (key === 'start' && value === minYear)) {
            return;
        }
        else {
            cleaned[key] = value;
        }
    });   
    return cleaned;
}

function updateState(changes) {
    _.extend(state, changes);
    state = cleanState(state);
    eventEmitter.trigger('change', state);
}

module.exports = {
    minYear: minYear,
    maxYear: maxYear,

    init: function (options, overrideState) {
        options = options || {};
        state = overrideState || {};

        if (options.dateRange) {
            var min = new Date(minYear, 0, 1),
                max = new Date(maxYear, 0, 1),
                defaultMin = min,
                defaultMax = max;
            if (state.start) {
                defaultMin = new Date(state.start, 0, 1);
            }
            if (state.end) {
                defaultMax = new Date(state.end, 0, 1);
            }
            $dateRange = $(options.dateRange);
            $dateRange
                .dateRangeSlider({
                    arrows: false,
                    defaultValues: {
                        min: defaultMin,
                        max: defaultMax
                    },
                    bounds: {
                        min: min,
                        max: max
                    },
                    formatter: function (value) {
                        return value.getFullYear();
                    },
                    step: { years: 1 }
                })
                .bind('valuesChanged', function (e, data) {
                    var start = data.values.min.getFullYear(),
                        end = data.values.max.getFullYear();
                    plansmap.filterLotsLayer({ start: start, end: end });
                    updateState({ start: start, end: end });
                });
        }

        if (options.mayors && options.dateRange) {
            $mayors = $(options.mayors);
            $mayors.change(function () {
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
                $mayors.val(state.mayor).trigger('change');
            }
        }

        if (options.active) {
            $active = $(options.active);
            $active
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ active: checked });
                    plansmap.filterLotsLayer({ active: checked }, true);
                })
                .prop('checked', state.active)
                .trigger('change');
        }

        if (options.expired) {
            $expired = $(options.expired);
            $expired
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ expired: checked });
                    plansmap.filterLotsLayer({ expired: checked }, true);
                })
                .prop('checked', state.expired)
                .trigger('change');
        }

        if (options.lastUpdated) {
            $lastUpdated = $(options.lastUpdated);
            $lastUpdated
                .change(function () {
                    var selected = $(this).find(':selected'),
                        min = selected.data('min'),
                        max = selected.data('max');
                    updateState({ start: min, end: max });
                    plansmap.filterLotsLayer({
                        lastUpdatedMin: min,
                        lastUpdatedMax: max 
                    }, true);
                })
                .val(state.lastUpdatedMin)
                .trigger('change');
        }

        state = cleanState(state);
        return eventEmitter;
    },

    getState: function () {
        return state;
    },

    resetState: function () {
        resetActive();
        resetExpired();
        resetLastUpdated();
        resetMayors();
    }

};
