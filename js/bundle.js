(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var geocoder = new google.maps.Geocoder();

function to_google_bounds(bounds) {
    // bounds: left, bottom, right, top
    return new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds[1], bounds[0]),
        new google.maps.LatLng(bounds[3], bounds[2])
    );
}

function get_component(result, desired_type) {
    var matches = $.grep(result.address_components, function (component, i) {
        return ($.inArray(desired_type, component.types) >= 0);
    });
    if (matches.length >= 0 && matches[0] !== null) {
        return matches[0].short_name;
    }
    return null;
}

function get_street(result) {
    var street_number = get_component(result, 'street_number');
    var route = get_component(result, 'route');
    if (street_number === null || route === null) {
        return null;
    }
    return street_number + ' ' + route;
}

function get_longitude(result) {
    return result.geometry.location.lng();
}

function get_latitude(result) {
    return result.geometry.location.lat();
}

module.exports = {

    geocode: function (address, bounds, state, f) {
        geocoder.geocode({
            'address': address,
            'bounds': to_google_bounds(bounds)
        }, function (results, status) {
            for (var i = 0; i < results.length; i++) {
                var result_state = get_component(results[i], 'administrative_area_level_1');
                if (result_state === state) {
                    results[i].latlng = [get_latitude(results[i]),
                                         get_longitude(results[i])];
                    return f(results[i], status);
                }
            }
            return f(null, status);
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

},{"querystring":9}],3:[function(require,module,exports){
var hash = require('./hash');
var plansmap = require('./plansmap');
var search = require('./search');
var sidebar = require('./sidebar');

var currentPlan,
    currentLot = {},
    planOutline,
    lotsLayer,
    defaultZoom = 12,
    defaultCenter = [40.739974, -73.946228],
    userMarker;

var urbanreviewer = {
    sql_api_base: 'http://urbanreviewer.cartodb.com/api/v2/sql',

    addPlanContent: function ($location, borough, planName) {
        $.get('plans/' + borough + '/' + planName, function (content) {
            $location.append(content);
        });
    },

    clearPlanOutline: function (map) {
        if (planOutline) {
            planOutline.clearLayers();
        }
    },

    addPlanOutline: function (map, planName, options) {
        options = options || {};
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
            
            if (options.zoomToPlan === true) {
                map.fitBounds(planOutline.getBounds(), {
                    padding: [25, 25]            
                });
            }
        });
    },

    loadPlanInformation: function (data) {

        var template = JST['handlebars_templates/plan.hbs'];
        templateContent = template(data);
        sidebar.open('#right-pane', templateContent);

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
            sidebar.close('#right-pane');
        });
    }
};

$(document).ready(function () {

    /*
     * Initialize map
     */
    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || defaultZoom,
        center = parsedHash.center || defaultCenter;
    currentPlan = parsedHash.plan;

    map = plansmap.init('map');

    if (currentPlan) {
        // If there's a plan selected already, set the active area so we can
        // zoom to it appropriately
        plansmap.setActiveArea(map, { area: 'left' });
    }
    else {
        plansmap.setActiveArea(map, { area: 'full' });
    }

    map
        .setView(center, zoom)
        .on('moveend', function () {
            window.location.hash = hash.formatHash(map, currentPlan);
        });

    if (currentPlan) {
        $('#search-container').hide();
        urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
        urbanreviewer.addPlanOutline(map, currentPlan);
    }

    map
        .on('planlotclick', function (data) {
            currentPlan = data.plan_name;
            window.location.hash = hash.formatHash(map, currentPlan);
            urbanreviewer.loadPlanInformation(data);
            urbanreviewer.addPlanOutline(map, currentPlan, { zoomToPlan: true });
        })
        .on('planlotover', function (data) {
            if (currentPlan && data.plan_name === currentPlan) {
                if (data.block !== currentLot.block || data.lot !== currentLot.lot) {
                    currentLot = {
                        block: data.block,
                        lot: data.lot
                    };
                    map.openPopup('block: ' + data.block + ', lot: ' + data.lot,
                                  data.latlng);
                }
            }
        })
        .on('planlotout', function (data) {
            currentLot = {};
            map.closePopup();  
        });


    /*
     * Initialize sidebar
     */
    $('#right-pane').on('open', function () {
        $('#date-range-picker-container').hide();
        $('#search-container').hide();
        plansmap.setActiveArea(map, { area: 'left' });
    });

    $('#right-pane').on('close', function () {
        $('#date-range-picker-container').show();
        $('#search-container').show();
        plansmap.setActiveArea(map, { area: 'full' });

        currentPlan = null;
        window.location.hash = hash.formatHash(map, currentPlan);
        urbanreviewer.clearPlanOutline(map);
    });


    /*
     * Listen for popstate
     */
    $(window).on('popstate', function (e) {
        var parsedHash = hash.parseHash(window.location.hash),
            previousPlan = currentPlan;
        map.setView(parsedHash.center, parsedHash.zoom);
        currentPlan = parsedHash.plan;
        if (currentPlan && currentPlan !== previousPlan) {
            urbanreviewer.loadPlanInformation({ plan_name: currentPlan });
            urbanreviewer.addPlanOutline(map, currentPlan);
        }
    });


    /*
     * Initialize search
     */
    search.init('#search');
    $('#search').on('resultfound', function (e, results) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.userMarker(results.latlng, {
            smallIcon: true                        
        }).addTo(map);
        map.setView(results.latlng, 16);
    });


    /*
     * Initialize dateRangeSlider
     */
    $('#date-range-picker').dateRangeSlider({
        arrows: false,
        defaultValues: {
            min: new Date(1940, 0, 1),
            max: new Date(2014, 0, 1)
        },
        bounds: {
            min: new Date(1940, 0, 1),
            max: new Date(2014, 0, 1)
        },
        formatter: function (value) {
            return value.getFullYear();
        },
        step: {
            years: 1
        }
    })
    .bind('valuesChanged', function (e, data) {
        plansmap.filterLotsLayer({
            start: data.values.min.getFullYear(), 
            end: data.values.max.getFullYear()
        });
    });

});

},{"./hash":2,"./plansmap":4,"./search":5,"./sidebar":6}],4:[function(require,module,exports){
var lotsLayer;

module.exports = {

    init: function (id) {
        var map = L.map(id, {
            maxZoom: 18,
            minZoom: 10,
            zoomControl: false
        });

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
                cartocss: '#lots{ polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-color: #000; line-width: 0.25; line-opacity: 0.75; }',
                interactivity: 'block, lot, plan_name, borough',
                sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
            }]
        })
        .addTo(map)
        .done(function (layer) {
            lotsLayer = layer.getSubLayer(0);
            lotsLayer.setInteraction(true);
            layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
                map.fire('planlotclick', data);
            });

            layer.on('featureOver', function (e, latlng, pos, data) {
                // Update mouse cursor when over a feature
                $('#' + map._container.id).css('cursor', 'pointer');
                data.latlng = latlng;
                map.fire('planlotover', data);
            });
            layer.on('featureOut', function (e, latlng, pos, data) {
                // Reset mouse cursor when no longer over a feature
                var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
                $('#' + map._container.id).attr('style',  grabStyle);
                map.fire('planlotout', data);
            });

            map.addLayer(layer, false);
        });

        return map;
    },

    setActiveArea: function (map, options) {
        options = options || {};
        var activeAreaOptions;

        if (options.area === 'left') {
            activeAreaOptions = {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '50%',
                height: '100%'
            };
        }
        else if (options.area === undefined || options.area === 'full') {
            activeAreaOptions = {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '100%'
            };
        }

        map.setActiveArea(activeAreaOptions);
    },

    filterLotsLayer: function (filters) {
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id " +
            "WHERE ",
            whereConditions = [];
        
        if (filters.start) {
            whereConditions.push("p.adopted >= '" + filters.start + "-01-01'");
        }
        if (filters.end) {
            whereConditions.push("p.adopted <= '" + filters.end + "-01-01'");
        }
        sql += whereConditions.join(' AND ');
        lotsLayer.setSQL(sql);
    }

};

},{}],5:[function(require,module,exports){
var geocode = require('./geocode.js');

function init(selector) {
    $(selector).on('keyup', function (e) {
        if (e.keyCode === 13) {
            search(selector, $(selector).val());
        }
    });
}

function search(selector, q) {
    geocode.geocode(q, [-74.402161, 40.475158, -73.642731, 40.984045], 'NY',
        function (results, status) {
            if (status === 'OK') {
                $(selector).trigger('resultfound', results);
            }
        }
    );
}

module.exports = {
    init: init,
    search: search
};

},{"./geocode.js":1}],6:[function(require,module,exports){
module.exports = {

    open: function (selector, content) {
        $(selector + ' *').remove();
        $(selector)
            .append(content)
            .show()
            .trigger('open');
    },

    close: function (selector) {
        $(selector)
            .trigger('close')
            .hide();
    }

};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":7,"./encode":8}]},{},[3])