var _ = require('underscore');

var sizes = ['narrow', 'wide'],
    defaultSize = 'wide';

function isOpen(selector) {
    return $(selector).is(':visible');
}

function open(selector, content, size) {
    if (!(size && _.contains(sizes, size))) {
        size = defaultSize;
    }
    $(selector + ' *').remove();
    $(selector)
        .removeClass(sizes.join(' '))
        .addClass(size)
        .append(content)
        .show()
        .trigger('open', size);
    $(selector + ' .panel-toggle').click(function () {
        close(selector);
    });
}

function close(selector) {
    $(selector)
        .trigger('close')
        .hide();
}

module.exports = {
    isOpen: isOpen,
    open: open,
    close: close
};
