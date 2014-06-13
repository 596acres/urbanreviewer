var plansmap = require('./plansmap');
var _ = require('underscore');

module.exports = {

    init: function (options) {
        options = options || {};

        if (options.dispositions) {
            $(options.dispositions + ' :input').change(function () {
                plansmap.highlightLots({
                    dispositions: _.map($(options.dispositions + ' :input:checked'), function (e) { return $(e).data('disposition'); })
                });
            });
        }

        if (options.public_vacant) {
            $(options.public_vacant).change(function () {
                plansmap.highlightLots({
                    public_vacant: $(this).is(':checked')
                });
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
            'street',
            'illegible'
        ];
        return _.map(dispositions, function (disposition) {
            return {
                id: disposition.replace(' ', '-'),
                label: disposition
            };
        });
    }

};
