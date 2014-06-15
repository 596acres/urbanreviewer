var sidebar = require('./sidebar');


module.exports = {

    load: function (url, $target) {
        var template = JST['handlebars_templates/page.hbs'],
            content = template({});
        sidebar.open(content, 'widest');
        $.get(url, function (pageContent) {
            $('#page-content').append(pageContent);
            $('#page-content h1').appendTo($('.page-header-content'));
        });
    }

};
