var _ = require('underscore');

var sizes = ['narrow', 'wide', 'widest'],
    defaultSize = 'wide';

var $container,
    options;

function isOpen() {
    return $container.is(':visible');
}

function open(content, size) {
    if (options.beforeOpen) {
        options.beforeOpen();
    }
    if (!(size && _.contains(sizes, size))) {
        size = defaultSize;
    }
    $container
        .empty()
        .removeClass(sizes.join(' '))
        .addClass(size)
        .append(content)
        .show()
        .trigger('open', size);
    $container.find('.panel-toggle').click(function () {
        close();
    });
}

function close() {
    if (options.beforeClose) {
        options.beforeClose();
    }
    $container
        .trigger('close')
        .hide();
}

module.exports = {

    init: function ($e, overrideOptions) {
        options = _.extend({}, overrideOptions);
        $container = $e;
    },

    isOpen: isOpen,
    open: open,
    close: close
};
