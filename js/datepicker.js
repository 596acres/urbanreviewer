module.exports = {

    init: function ($button, $dialog) {
        $button.click(function () {
            $dialog.toggle();
        });

        var $start = $dialog.find('#date-picker-start'),
            $end = $dialog.find('#date-picker-end');
        $dialog.find('select').change(function (e) {
            e.stopPropagation();
            var start = $start.val(),
                end = $end.val();
            $button.find('.date-picker-start-display').text(start);
            $button.find('.date-picker-end-display').text(end);
            $dialog.trigger('change', [start, end]);
        });
    }

};
