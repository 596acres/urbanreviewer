function open(selector, content) {
    $(selector + ' *').remove();
    $(selector)
        .append(content)
        .show()
        .trigger('open');
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
    open: open,
    close: close
};
