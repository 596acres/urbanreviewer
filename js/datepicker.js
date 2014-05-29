module.exports = {

    init: function ($button, $dialog) {
        $button.click(function () {
            $dialog.toggle();
        });

        var $start = $dialog.find('#date-picker-start'),
            $end = $dialog.find('#date-picker-end');
        $dialog.find('select').change(function (e) {
            e.stopPropagation();
            $dialog.trigger('change', [$start.val(), $end.val()]);
        });
    }

};
