module.exports = {

    open: function (selector, content) {
        $(selector + ' *').remove();
        $(selector)
            .append(content)
            .show()
            .trigger('open');
    },

    close: function (selector) {
        $(selector)
            .trigger('close')
            .hide();
    }

};
