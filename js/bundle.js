(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {

    init: function ($button, $dialog) {
        $button.click(function () {
            $dialog.toggle();
        });

        var $start = $dialog.find('#date-picker-start'),
            $end = $dialog.find('#date-picker-end');
        $dialog.find('select').change(function (e) {
            e.stopPropagation();
            var start = $start.val(),
                end = $end.val();
            $button.find('.date-picker-start-display').text(start);
            $button.find('.date-picker-end-display').text(end);
            $dialog.trigger('change', [start, end]);
        });
    }

};

},{}],2:[function(require,module,exports){
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

        args.plan = hash.plan;

        return args;
    },

    formatHash: function(map, planName) {
        // Format hash for the map. Based on OSM's formatHash.
        var center = map.getCenter(),
            zoom = map.getZoom();
        center = center.wrap();

        var precision = 4,
            hash = '#map=' + zoom +
                '/' + center.lat.toFixed(precision) +
                '/' + center.lng.toFixed(precision);

        if (planName) {
            hash += '&plan=' + planName;
        }

        return hash;
    }

};

},{"querystring":6}],3:[function(require,module,exports){
var hash = require('./hash');
var datePicker = require('./datepicker');

var currentPlan,
    planOutline,
    lotsLayer;

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    addPlanContent: function ($location, borough, planName) {
        $.get('plans/' + borough + '/' + planName, function (content) {
            $location.append(content);
        });
    },

    addPlanOutline: function (map, planName) {
        if (planOutline) {
            planOutline.clearLayers();
        }
        else {
            planOutline = L.geoJson(null, {
                style: function (feature) {
                    return {
                        color: '#f00',
                        dashArray: '10 10 1 10',
                        fill: false,
                        stroke: true
                    };
                }
            }).addTo(map);
        }
        var sql = "SELECT ST_Buffer(ST_ConvexHull(ST_Union(l.the_geom)), 0.0001) AS the_geom " + 
                  "FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id " +
                  "WHERE p.name = '" + planName + "'";
        $.get(urbanreviewer.sql_api_base + "?q=" + sql + '&format=GeoJSON', function (data) {
            planOutline.addData(data);
        });
    },

    loadPlanInformation: function (data) {
        $('#right-pane *').remove();

        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(data);
        $('#right-pane').append(templateContent);
        $('#right-pane').show();

        // If we don't have borough, get it first
        if (data.borough) {
            urbanreviewer.addPlanContent($('#right-pane #plan-details'),
                                         data.borough, data.plan_name);
        }
        else {
            var sql = "SELECT * FROM plans WHERE name = '" + data.plan_name + "'";
            $.get(urbanreviewer.sql_api_base + '?q=' + sql, function (results) {
                data = results.rows[0];
                urbanreviewer.addPlanContent($('#right-pane #plan-details'),
                                             data.borough, data.name);
            });
        }

        var sql = 
            "SELECT p.borough AS borough, l.block AS block, l.lot AS lot " +
            "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
            "WHERE p.name='" + data.plan_name + "' " +
            "ORDER BY l.block, l.lot";
        $.get(urbanreviewer.sql_api_base + "?q=" + sql, function (data) {
            var lots_template = JST['handlebars_templates/lots.hbs'];
            var content = lots_template(data);
            $('#lots-content').append(content);
            $('.lot-count').text(data.rows.length);
        });

        $('#right-pane .panel-toggle').click(function () {
            $('#right-pane').trigger('hide').hide();
        });
    }
};

$(document).ready(function () {

    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || 12,
        center = parsedHash.center || [40.739974, -73.946228];
    currentPlan = parsedHash.plan;

    var map = L.map('map', {
        maxZoom: 18,
        zoomControl: false
    }).setView(center, zoom);

    map.on('moveend', function () {
        window.location.hash = hash.formatHash(map, currentPlan);
    });

    if (currentPlan) {
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan);
    }

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        mapId: 'urbanreviewer.idebc7lb',
        maxZoom: 18
    }).addTo(map);

    cartodb.createLayer(map, {
        cartodb_logo: false,
        user_name: 'urbanreviewer',
        type: 'cartodb',
        sublayers: [{
            cartocss: '#lots{ polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-color: #FFF; line-width: 1; line-opacity: 1; }',
            interactivity: 'block, lot, plan_name, borough',
            sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
        }]
    })
    .addTo(map)
    .done(function (layer) {
        lotsLayer = layer.getSubLayer(0);
        lotsLayer.setInteraction(true);
        layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
            currentPlan = data.plan_name;
            window.location.hash = hash.formatHash(map, currentPlan);
            urbanreviewer.loadPlanInformation(data);
            urbanreviewer.addPlanOutline(map, currentPlan);
        });

        // Update mouse cursor when over a feature
        layer.on('featureOver', function () {
            $('#' + map._container.id).css('cursor', 'pointer');
        });
        layer.on('featureOut', function () {
            var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
            $('#' + map._container.id).attr('style',  grabStyle);
        });

        map.addLayer(layer, false);
    });

    datePicker.init($('#date-picker-button'), $('#date-picker-dialog'));
    $('#date-picker-dialog').on('change', function (e, start, end) {
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id " +
            "WHERE p.adopted >= '" + start + "-01-01' " +
                "AND p.adopted <= '" + end + "-01-01'";
        lotsLayer.setSQL(sql);
    });

    $('#right-pane').on('hide', function () {
        currentPlan = null;
        window.location.hash = hash.formatHash(map, currentPlan);
    });

    $(window).on('popstate', function (e) {
        var parsedHash = hash.parseHash(window.location.hash);
        map.setView(parsedHash.center, parsedHash.zoom);
        currentPlan = parsedHash.plan;
        if (currentPlan) {
            urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
            urbanreviewer.addPlanOutline(map, currentPlan);
        }
    });
});

},{"./datepicker":1,"./hash":2}],4:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],6:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":4,"./encode":5}]},{},[3])