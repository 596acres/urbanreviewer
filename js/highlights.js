//
// highlights
//
// Highlighting parcels on the map by disposition or current state.
//
var plansmap = require('./plansmap');
var _ = require('underscore');

var eventEmitter = $({}),
    selectedDispositions = [],
    publicVacant = false;

var $dispositions,
    $publicVacant;

function highlightLots() {
    plansmap.highlightLots({
        dispositions: selectedDispositions,
        public_vacant: publicVacant
    });
}

function getState() {
    var state = {};
    if (selectedDispositions && selectedDispositions.length > 0) {
        state.dispositions = selectedDispositions;
    }
    if (publicVacant) {
        state.public_vacant = publicVacant;
    }
    return state;
}

module.exports = {

    init: function (options, initialState) {
        options = options || {};

        if (options.dispositions) {
            $dispositions = $(options.dispositions + ' :input');
            $dispositions.change(function () {
                selectedDispositions = _.map($dispositions.filter(':checked'), function (e) { return $(e).data('disposition'); });
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.dispositions) {
                _.each(initialState.dispositions, function (disposition) {
                    $dispositions.filter('[data-disposition="' + disposition + '"]')
                        .prop('checked', true)
                        .trigger('change');
                });
            }
        }

        if (options.public_vacant) {
            $publicVacant = $(options.public_vacant);
            $publicVacant.change(function () {
                publicVacant = $(this).is(':checked');
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.public_vacant) {
                $publicVacant
                    .prop('checked', initialState.public_vacant)
                    .trigger('change');
            }
        }

        return eventEmitter;
    },

    getDispositions: function() {
        var dispositions = [
            {
                label: 'open space',
                helpText: 'Open space'
            },
            {
                label: 'recreational',
                helpText: 'Recreational'
            },
            {
                label: 'community facility',
                helpText: 'Community facility'
            },
            {
                label: 'residential',
                helpText: 'Residential'
            },
            {
                label: 'commercial',
                helpText: 'Commercial'
            },
            {
                label: 'industrial',
                helpText: 'Industrial'
            },
            {
                label: 'institutional',
                helpText: 'Institutional'
            }
        ];
        return _.map(dispositions, function (disposition) {
            disposition.id = disposition.label.replace(' ', '-');
            return disposition;
        });
    },

    resetState: function () {
        if ($dispositions) {
            $dispositions
                .prop('checked', false)
                .trigger('change');
        }
        if ($publicVacant) {
            $publicVacant
                .prop('checked', false)
                .trigger('change');
        }
    },

    getState: getState

};
