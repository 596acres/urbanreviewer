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
            'open space',
            'recreational',
            'community facility',
            'residential',
            'commercial',
            'industrial',
            'institutional',
            'public',
            'semi-public',
            'utility',
            'easement',
            'street'
        ];
        return _.map(dispositions, function (disposition) {
            return {
                id: disposition.replace(' ', '-'),
                label: disposition
            };
        });
    }

};
