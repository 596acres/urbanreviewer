this["JST"] = this["JST"] || {};

this["JST"]["handlebars_templates/filters.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div class=\"input-group\">\n                <input type=\"checkbox\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-disposition=\""
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\" />\n                <label class=\"checkbox-label\" for=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</label>\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"filters-container\">\n    <h2>Filter</h2>\n    <a href=\"#\" id=\"filters-plan-list-link\" class=\"nav-button\">Plans</a>\n\n    <section id=\"filters\" class=\"filter-section\">\n        <h3 class=\"filter-section-header\">plans adopted during mayoral administrations</h3>\n        <div>\n            <select id=\"mayors\">\n                <option data-start=\"1952\" data-end=\"2014\" value=\"\">pick one</option>\n                <option data-start=\"1952\" data-end=\"1953\">Vincent R. Impellitteri</option>\n                <option data-start=\"1954\" data-end=\"1965\">Robert F. Wagner, Jr.</option>\n                <option data-start=\"1966\" data-end=\"1973\">John V. Lindsay</option>\n                <option data-start=\"1974\" data-end=\"1977\">Abraham D. Beame</option>\n                <option data-start=\"1978\" data-end=\"1989\">Edward I. Koch</option>\n                <option data-start=\"1990\" data-end=\"1993\">David N. Dinkins</option>\n                <option data-start=\"1994\" data-end=\"2001\">Rudolph W. Giuliani</option>\n                <option data-start=\"2002\" data-end=\"2013\">Michael R. Bloomberg</option>\n                <option data-start=\"2014\" data-end=\"2021\">Bill de Blasio</option>\n                <option data-start=\"2022\" data-end=\"2024\">Eric L. Adams</option>\n            </select>\n        </div>\n    </section>\n\n    <section id=\"highlights\">\n        <h3 id=\"highlights-header\">highlight lots\n            <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Lots that fit ALL the selected criteria will be highlighted.\">?</span>\n        </h3>\n        <section id=\"dispositions\" class=\"filter-section\">\n            <h4 class=\"filter-section-header\">selected planned uses</h4>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.dispositions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </section>\n        <section class=\"filter-section\">\n            <h4 class=\"filter-section-header\">public vacant lots</h4>\n            <div class=\"input-group\">\n                <input type=\"checkbox\" id=\"public-vacant\" />\n                <label class=\"checkbox-label\" for=\"public-vacant\">publicly owned and vacant today</label>\n                <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Highlight plans that are publicly owned and vacant now according to 596acres.org\">?</span>\n            </div>\n        </section>\n    </section>\n</div>\n";
},"useData":true});

this["JST"]["handlebars_templates/lots.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li class=\"lot\" data-borough=\""
    + alias4(((helper = (helper = helpers.borough || (depth0 != null ? depth0.borough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"borough","hash":{},"data":data}) : helper)))
    + "\" data-block=\""
    + alias4(((helper = (helper = helpers.block || (depth0 != null ? depth0.block : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"block","hash":{},"data":data}) : helper)))
    + "\" data-lot=\""
    + alias4(((helper = (helper = helpers.lot || (depth0 != null ? depth0.lot : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lot","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"lot-external-links\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.in_596 : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                <a title=\"View on OASIS\" href=\"http://www.oasisnyc.net/map.aspx?etabs=1&zoomto=lot:"
    + alias4(((helper = (helper = helpers.bbl || (depth0 != null ? depth0.bbl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bbl","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\"><img width=\"22\" height=\"22\" src=\"img/oasis.ico\" /></a>\n            </div>\n            <h3>"
    + alias4(((helper = (helper = helpers.borough || (depth0 != null ? depth0.borough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"borough","hash":{},"data":data}) : helper)))
    + " block "
    + alias4(((helper = (helper = helpers.block || (depth0 != null ? depth0.block : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"block","hash":{},"data":data}) : helper)))
    + ", lot "
    + alias4(((helper = (helper = helpers.lot || (depth0 != null ? depth0.lot : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lot","hash":{},"data":data}) : helper)))
    + "</h3>\n            <div>Planned use: \n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.disposition : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n        </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <a href=\"http://livinglotsnyc.org/lot/"
    + container.escapeExpression(((helper = (helper = helpers.bbl || (depth0 != null ? depth0.bbl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"bbl","hash":{},"data":data}) : helper)))
    + "/\" target=\"_blank\" title=\"View on Living Lots NYC\"><img width=\"22\" height=\"22\" src=\"img/livinglotsnyc.png\" /></a>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                "
    + container.escapeExpression(((helper = (helper = helpers.disposition || (depth0 != null ? depth0.disposition : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"disposition","hash":{},"data":data}) : helper)))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                unknown\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.rows : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});

this["JST"]["handlebars_templates/page.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"page container-fluid\">\n    <div class=\"page-header\">\n        <button class=\"panel-toggle\">\n            &times;\n        </button>\n        <div class=\"page-header-content\"></div>\n    </div>\n    <div class=\"page-content-container row\">\n        <div class=\"page-nav-column\">\n            <div class=\"page-nav\">\n                <ul class=\"nav\"></ul>\n            </div>\n        </div>\n        <div id=\"page-content\" class=\"page-content\"></div>\n    </div>\n</div>\n";
},"useData":true});

this["JST"]["handlebars_templates/plan.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    "
    + container.escapeExpression(((helper = (helper = helpers.last_updated || (depth0 != null ? depth0.last_updated : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"last_updated","hash":{},"data":data}) : helper)))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    &mdash;\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    "
    + container.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"status","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"plan\">\n    <div class=\"plan-header\">\n        <button class=\"panel-toggle\">\n            &times;\n        </button>\n        <div class=\"plan-header-content\">\n            <h1>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h1>\n            <div class=\"plan-header-content-item adopted\">\n                <label>adopted</label>\n                <span class=\"value\">"
    + alias4(((helper = (helper = helpers.adopted || (depth0 != null ? depth0.adopted : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"adopted","hash":{},"data":data}) : helper)))
    + "</span>\n            </div>\n            <div class=\"plan-header-content-item\">\n                <label>last updated</label>\n                <span class=\"value\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.last_updated : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                </span>\n            </div>\n            <div class=\"plan-header-content-item\">\n                <label>status</label>\n                <span class=\"value\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.status : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                </span>\n            </div>\n        </div>\n        <div style=\"clear: both;\"></div>\n    </div>\n    <div class=\"plan-content\">\n        <section id=\"plan-about\">\n\n            <div id=\"image-container\" class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"false\" style=\"display: none;\">\n\n                <ol class=\"carousel-indicators\"></ol>\n\n                <!-- Wrapper for slides -->\n                <div class=\"carousel-inner\"></div>\n\n                <!-- Controls -->\n                <a class=\"left carousel-control\" href=\"#image-container\" data-slide=\"prev\">\n                    <span class=\"icon-prev\"></span>\n                </a>\n                <a class=\"right carousel-control\" href=\"#image-container\" data-slide=\"next\">\n                    <span class=\"icon-next\"></span>\n                </a>\n            </div>\n\n            <h2>About the plan</h2>\n            <div id=\"plan-details\"></div>\n            <a class=\"plan-share-story\" target=\"_blank\" href=\"mailto:urbanreviewernyc@gmail.com?subject=My Urban Reviewer story on "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">Share your story</a>\n        </section>\n        <section id=\"lots\">\n            <h2>lots</h2>\n            <div id=\"lots-content\"></div>\n        </section>\n        <section id=\"data\">\n            <h2>data</h2>\n            <div>\n                Get map data for \n                <a href=\"https://github.com/596acres/urbanreviewer/tree/gh-pages/data/geojson/us/ny/nyc/nyc.geojson\" target=\"_blank\">NYC</a> / \n                <a href=\"https://github.com/596acres/urbanreviewer/tree/gh-pages/data/geojson/us/ny/nyc/"
    + alias4(((helper = (helper = helpers.borough || (depth0 != null ? depth0.borough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"borough","hash":{},"data":data}) : helper)))
    + "/all.geojson\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.borough || (depth0 != null ? depth0.borough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"borough","hash":{},"data":data}) : helper)))
    + "</a> / \n                <a href=\"https://github.com/596acres/urbanreviewer/tree/gh-pages/data/geojson/us/ny/nyc/"
    + alias4(((helper = (helper = helpers.borough || (depth0 != null ? depth0.borough : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"borough","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + ".geojson\" target=\"_blank\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n            </div>\n        </section>\n    </div>\n</div>\n";
},"useData":true});

this["JST"]["handlebars_templates/plan_list.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <option data-min=\""
    + alias2(alias1((depth0 != null ? depth0["0"] : depth0), depth0))
    + "\" data-max=\""
    + alias2(alias1((depth0 != null ? depth0["1"] : depth0), depth0))
    + "\" value=\""
    + alias2(alias1((depth0 != null ? depth0["0"] : depth0), depth0))
    + "\">\n                    "
    + alias2(alias1((depth0 != null ? depth0["0"] : depth0), depth0))
    + " - "
    + alias2(alias1((depth0 != null ? depth0["1"] : depth0), depth0))
    + "\n                </option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"plan-list-container\">\n    <h2>Plans</h2>\n    <a href=\"#\" id=\"plan-list-filters-link\" class=\"nav-button\">\n        <img src=\"img/filters.png\" />\n        Filters\n    </a>\n    <div class=\"intro-text\">\n        <h3>Welcome to Urban Reviewer!</h3>\n        <p><strong>Reviewing Past Urban Plans. Discovering Present Impact. Supporting Future Action.</strong></p>\n        <p>The City of New York has adopted over 150 master plans for our neighborhoods. You can see which areas have been affected and what those grand plans were here.</p>\n        <a class=\"btn btn-default intro-text-dismiss pull-right\">Awesome!</a>\n        <div class=\"clearfix\"></div>\n    </div>\n    <section class=\"filter-section\">\n        <h3 class=\"filter-section-header\">plan status</h3>\n        <div class=\"input-group\">\n            <input type=\"checkbox\" id=\"plan-status-active\" />\n            <label class=\"checkbox-label\" for=\"plan-status-active\">active</label>\n            <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Show only plans that have not expired\">?</span>\n        </div>\n        <div class=\"input-group\">\n            <input type=\"checkbox\" id=\"plan-status-expired\" />\n            <label class=\"checkbox-label\" for=\"plan-status-expired\">expired</label>\n            <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Show only plans that have expired\">?</span>\n        </div>\n    </section>\n    <section class=\"filter-section\">\n        <h3 class=\"filter-section-header\">last updated year</h3>\n        <div>\n            <select id=\"last-updated\">\n                <option value=\"\">any year</option>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.decades : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n            <span class=\"help-button\" data-toggle=\"tooltip\"\n                data-placement=\"left\" title=\"Show only plans that were updated in the given decade\">?</span>\n        </div>\n    </section>\n    <section id=\"plans\">\n        <div class=\"plan-list-header\">\n            <div class=\"plan-list-header-adopted\">adopted</div>\n            <div class=\"plan-list-header-name\">plan</div>\n            <div style=\"clear: both;\"></div>\n        </div>\n        <div id=\"plan-list-partial-container\"></div>\n    </section>\n</div>\n";
},"useData":true});

this["JST"]["handlebars_templates/plan_list_partial.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <li class=\"plan\" data-name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"plan-adopted\">"
    + alias4(((helper = (helper = helpers.adopted || (depth0 != null ? depth0.adopted : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"adopted","hash":{},"data":data}) : helper)))
    + "</div>\n            <div class=\"plan-name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n            <div style=\"clear: both;\"></div>\n        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"plan-list\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.plans : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n";
},"useData":true});