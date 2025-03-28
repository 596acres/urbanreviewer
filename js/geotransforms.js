const { buffer } = require('@turf/buffer');
const { convex } = require('@turf/convex');
const { featureCollection } = require('@turf/helpers');

module.exports = {
  convexBuffer: function (features) {
    return buffer(convex(featureCollection(features)), 25, { units: 'feet' });
  },
};
