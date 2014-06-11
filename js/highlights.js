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
    }

};
