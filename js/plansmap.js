module.exports = {

    init: function (selector) {
        // TODO
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
    }

};
