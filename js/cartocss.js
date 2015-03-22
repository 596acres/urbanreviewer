var defaultCartoCSS = '#lots{ polygon-fill: #000; polygon-opacity: 0.75; line-color: #000; line-width: 0.5; line-opacity: 0.75; [zoom < 14] { line-width: 1; } }';
var nightmodeCartoCSS = '#lots{ polygon-fill: #FFF; polygon-opacity: 0.75; line-color: #FFF; line-width: 0.5; line-opacity: 0.75; [zoom < 14] { line-width: 1; } }';
var highlightedLotCartoCSS = 'polygon-fill: #CFA470;' +
    '[zoom <= 12] { line-width: 5; line-color: #CFA470; }' +
    '[zoom <= 14] { line-width: 3; line-color: #CFA470; }';
var highlightedPlanCartoCSS = 'polygon-fill: #F9EF6C;';


module.exports = {

    cartocss: function (opts) {
        opts = opts || {};
        var cartocss = defaultCartoCSS;

        // Choose day / night mode
        if (opts.mode && opts.mode === 'nightmode') {
            cartocss = nightmodeCartoCSS;
        }

        // Highlight plan
        if (opts.plan) {
            // XXX this breaks for plans with #s in their names
            cartocss += '#lots[plan_name="' + opts.plan + '"]{' +
                highlightedPlanCartoCSS +
            '}';
        }

        // Filters
        var selector = '#lots';

        if (opts.dispositions && opts.dispositions.length > 0) {
            selector += _.map(opts.dispositions, function (disposition) {
                return '[disposition_filterable=~".*' + disposition + '.*"]';
            }).join('');
        }
        if (opts.public_vacant && opts.public_vacant === true) {
            selector += '[in_596=true]';
        }

        // Only add the highlighted CartoCSS if there are things to highlight
        if (selector !== '#lots') {
            cartocss += selector + '{' + highlightedLotCartoCSS + '}';
        }

        return cartocss;
    }

};
