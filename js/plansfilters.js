var _ = require('underscore');

var lastFilters = {};

function getWhereClause(filters, extendLastFilters) {
    var whereConditions = [];

    if (extendLastFilters === undefined || extendLastFilters === true) {
        filters = _.extend(lastFilters, filters);
    }

    if (filters.start) {
        whereConditions.push("p.adopted >= '" + filters.start + "-01-01'");
    }
    if (filters.end) {
        whereConditions.push("p.adopted <= '" + filters.end + "-01-01'");
    }

    if (filters.active) {
        whereConditions.push("status ILIKE '%active%'");
    }

    if (filters.expired) {
        whereConditions.push("status ILIKE '%expired%'");
    }

    if (filters.lastUpdatedMin) {
        var year = parseInt(filters.lastUpdatedMin);
        if (year) {
            whereConditions.push("p.updated >= '" + year + "-01-01'");
        }
    }

    if (filters.lastUpdatedMax) {
        var year = parseInt(filters.lastUpdatedMax);
        if (year) {
            whereConditions.push("p.updated < '" + (year + 1) + "-01-01'");
        }
    }

    lastFilters = filters;
    if (whereConditions.length > 0) {
        return 'WHERE ' + whereConditions.join(' AND ');
    }
    return '';
}

module.exports = {
    getWhereClause: getWhereClause
};
