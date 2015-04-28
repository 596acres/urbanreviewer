var sidebar = require('./sidebar');
require('jquery.scrollTo');

function makeId(text) {
    return text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/\?/g, '')
        .replace(/,/g, '')
        .replace(/\./g, '');
}

function scrollToSection(id) {
    $('#right-pane').scrollTo(id, 300, {
        axis: 'y',
        margin: true,
        offset: -115,
        queue: false                    
    });
}

module.exports = {

    load: function (url, $target) {
        var template = JST['handlebars_templates/page.hbs'],
            content = template({});
        sidebar.open(content, 'widest');
        $.get(url, function (pageContent) {
            $('#page-content').append(pageContent);
            $('#page-content h1').appendTo($('.page-header-content'));

            var $headings = $('#page-content').find('h2');
            $headings.each(function () {
                var text = $(this).html(),
                    id = makeId(text);
                $(this).attr('id', id);
                var $navItem = $('<li></li>')
                    .append(
                        $('<a></a>')
                            .attr('href', '#' + id)
                            .html(text)
                    );
                $('.page-nav ul').append($navItem);
                var $section = $(this).nextUntil('h2').add($(this));
                $section.wrapAll('<section class="page-section"></section>');
            });

            // Internal links in the body of the page: attempt to scroll to section
            $('#page-content a[href^=#]').click(function () {
                scrollToSection($(this).attr('href'));
                return false;
            });

            $('.page-nav').width($('.page-nav-column').width());
            $('.page-nav a').click(function () {
                scrollToSection($(this).attr('href'));
                return false;
            });
        });
    }

};
