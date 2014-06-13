var sqlApiBase = 'http://urbanreviewer.cartodb.com/api/v2/sql/';

function getSqlUrl(sql) {
    return sqlApiBase + '?q=' + sql;
}

module.exports = {

    sqlApiBase: sqlApiBase,

    getGeoJSON: function (sql, success) {
        return $.get(getSqlUrl(sql) + '&format=GeoJSON', success);
    },

    getSqlUrl: getSqlUrl

};
