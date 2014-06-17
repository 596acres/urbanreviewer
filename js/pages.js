var sidebar = require('./sidebar');

function makeId(text) {
    return text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/\?/g, '')
        .replace(/,/g, '')
        .replace(/\./g, '');
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
                    )
                $('.page-nav ul').append($navItem);
                var $section = $(this).nextUntil('h2').add($(this));
                $section.wrapAll('<section class="page-section"></section>');
            });

            $('.page-nav').width($('.page-nav-column').width());
            $('.page-nav a').click(function () {
                $('#right-pane').scrollTo($($(this).attr('href')), 300, {
                    axis: 'y',
                    margin: true,
                    offset: -115,
                    queue: false                    
                });
                return false;
            });
            $('#right-pane').scrollspy({
               offset: -700,
               target: '.page-nav'
            });
        });
    }

};
