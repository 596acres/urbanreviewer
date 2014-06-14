var plansmap = require('./plansmap');
var _ = require('underscore');

var selectedDispositions = [],
    publicVacant = false;

function highlightLots() {
    plansmap.highlightLots({
        dispositions: selectedDispositions,
        public_vacant: publicVacant
    });
}

module.exports = {

    init: function (options) {
        options = options || {};

        if (options.dispositions) {
            $(options.dispositions + ' :input').change(function () {
                selectedDispositions = _.map($(options.dispositions + ' :input:checked'), function (e) { return $(e).data('disposition'); });
                highlightLots();
            });
        }

        if (options.public_vacant) {
            $(options.public_vacant).change(function () {
                publicVacant = $(this).is(':checked');
                highlightLots();
            });
        }

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
            },
            {
                label: 'public',
                helpText: 'Public'
            },
            {
                label: 'semi-public',
                helpText: 'Semi-public'
            },
            {
                label: 'utility',
                helpText: 'Utility'
            },
            {
                label: 'easement',
                helpText: 'Easement'
            },
            {
                label: 'street',
                helpText: 'Street'
            }
        ];
        return _.map(dispositions, function (disposition) {
            disposition.id = disposition.label.replace(' ', '-');
            return disposition;
        });
    }

};
