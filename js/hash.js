var jsurl = require('jsurl');
var querystring = require('querystring');

module.exports = {

    parseHash: function(hash) {
        // Parse hash for the map. Based on OSM's parseHash.
        var args = {};

        var i = hash.indexOf('#');
        if (i < 0) {
            return args;
        }

        hash = querystring.parse(hash.substr(i + 1));

        var map = (hash.map || '').split('/'),
            zoom = parseInt(map[0], 10),
            lat = parseFloat(map[1]),
            lon = parseFloat(map[2]);

        if (!isNaN(zoom) && !isNaN(lat) && !isNaN(lon)) {
            args.center = new L.LatLng(lat, lon);
            args.zoom = zoom;
        }

        args.page = hash.page;
        args.plan = hash.plan;
        args.filters = jsurl.parse(hash.filters);

        return args;
    },

    formatHash: function(options) {
        // Format hash for the map. Based on OSM's formatHash.
        var center = options.map.getCenter(),
            zoom = options.map.getZoom();
        center = center.wrap();

        var precision = 4,
            hash = '#map=' + zoom +
                '/' + center.lat.toFixed(precision) +
                '/' + center.lng.toFixed(precision);

        if (options.planName) {
            hash += '&plan=' + options.planName;
        }

        if (options.page) {
            hash += '&page=' + options.page;
        }

        if (options.filters && _.size(options.filters) > 0) {
            hash += '&filters=' + jsurl.stringify(options.filters);
        }

        return hash;
    }

};
