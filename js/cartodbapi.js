var sqlApiBase = 'http://urbanreviewer.cartodb.com/api/v2/sql/';

function getSqlUrl(sql) {
    return sqlApiBase + '?q=' + encodeURIComponent(sql);
}

module.exports = {

    sqlApiBase: sqlApiBase,

    getGeoJSON: function (sql, success) {
        return $.get(getSqlUrl(sql) + '&format=GeoJSON', success);
    },

    getJSON: function (sql, success) {
        return $.get(getSqlUrl(sql), success);
    },

    getSqlUrl: getSqlUrl

};
