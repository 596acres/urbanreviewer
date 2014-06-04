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
