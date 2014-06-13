var sqlApiBase = 'http://urbanreviewer.cartodb.com/api/v2/sql';

module.exports = {

    sqlApiBase: sqlApiBase,

    getGeoJSON: function (sql, success) {
        return $.get(sqlApiBase + "?q=" + sql + '&format=GeoJSON', success);
    }

};
