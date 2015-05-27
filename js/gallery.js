module.exports = {
    init: function () {
        $('body').on('pageloaded', function () {
            // Find photo lists, add "gallery" class to them
            var $galleries = $('ul > li img').parents('ul');
            $galleries.addClass('gallery')
                .append($('<div></div>').addClass('clearfix'));

            $galleries.each(function (i) {
                // Images in galleries can only take up 1/3rd of the gallery's 
                // width
                var width = ($(this).innerWidth() - 50) / 3 - 1;
                $(this).find('li').css('max-width', width + 'px');

                // Images in galleries should use colorbox
                $(this).find('a').colorbox({
                    maxHeight: '100%',
                    maxWidth: '100%',
                    rel: 'gallery' + i
                });
            });
        });
    }
};
