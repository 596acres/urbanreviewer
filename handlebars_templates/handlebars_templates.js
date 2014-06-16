this["JST"] = this["JST"] || {};

this["JST"]["handlebars_templates/filters.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div class=\"input-group\">\n                <input type=\"checkbox\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-disposition=\"";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <label class=\"checkbox-label\" for=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n                <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"";
  if (helper = helpers.helpText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.helpText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">?</span>\n            </div>\n            ";
  return buffer;
  }

  buffer += "<div id=\"filters-container\">\n    <h2>Filter</h2>\n    <a href=\"#\" id=\"filters-plan-list-link\" class=\"nav-button\">Plans</a>\n\n    <section id=\"filters\" class=\"filter-section\">\n        <h3 class=\"filter-section-header\">plans adopted during mayoral administrations</h3>\n        <div>\n            <select id=\"mayors\">\n                <option data-start=\"1952\" data-end=\"2014\" value=\"\">pick one</option>\n                <option data-start=\"1952\" data-end=\"1953\">Vincent R. Impellitteri</option>\n                <option data-start=\"1954\" data-end=\"1965\">Robert F. Wagner, Jr.</option>\n                <option data-start=\"1966\" data-end=\"1973\">John V. Lindsay</option>\n                <option data-start=\"1974\" data-end=\"1977\">Abraham D. Beame</option>\n                <option data-start=\"1978\" data-end=\"1989\">Edward I. Koch</option>\n                <option data-start=\"1990\" data-end=\"1993\">David N. Dinkins</option>\n                <option data-start=\"1994\" data-end=\"2001\">Rudolph W. Giuliani</option>\n                <option data-start=\"2002\" data-end=\"2013\">Michael R. Bloomberg</option>\n            </select>\n        </div>\n    </section>\n\n    <section id=\"highlights\">\n        <h3 id=\"highlights-header\">highlight lots</h3>\n        <section id=\"dispositions\" class=\"filter-section\">\n            <h4 class=\"filter-section-header\">selected planned uses</h4>\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.dispositions), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </section>\n        <section class=\"filter-section\">\n            <h4 class=\"filter-section-header\">public vacant lots</h4>\n            <div class=\"input-group\">\n                <input type=\"checkbox\" id=\"public-vacant\" />\n                <label class=\"checkbox-label\" for=\"public-vacant\">publicly owned and vacant today</label>\n                <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Highlight plans that are publicly owned and vacant now according to 596acres.org\">?</span>\n            </div>\n        </section>\n    </section>\n</div>\n";
  return buffer;
  });

this["JST"]["handlebars_templates/lots.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <li class=\"lot\" data-borough=\"";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-block=\"";
  if (helper = helpers.block) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.block); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-lot=\"";
  if (helper = helpers.lot) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lot); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n            <div class=\"lot-external-links\">\n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.in_596), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                <a title=\"View on OASIS\" href=\"http://www.oasisnyc.net/map.aspx?etabs=1&zoomto=lot:";
  if (helper = helpers.bbl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bbl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\"><img width=\"22\" height=\"22\" src=\"img/oasis.ico\" /></a>\n            </div>\n            <h3>";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " block ";
  if (helper = helpers.block) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.block); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", lot ";
  if (helper = helpers.lot) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lot); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n            <div>Planned use: \n                ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.disposition), {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n        </li>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                <a href=\"http://596acres.org/lot/";
  if (helper = helpers.bbl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bbl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\" title=\"View on 596 Acres\"><img width=\"22\" height=\"22\" src=\"img/596acres.ico\" /></a>\n                ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                ";
  if (helper = helpers.disposition) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disposition); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "\n                unknown\n                ";
  }

  buffer += "<ul>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.rows), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });

this["JST"]["handlebars_templates/page.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"page container-fluid\">\n    <header class=\"page-header\">\n        <button class=\"panel-toggle\">\n            &times;\n        </button>\n        <div class=\"page-header-content\"></div>\n    </header>\n    <div class=\"page-content-container row\">\n        <div class=\"page-nav\">\n            <ul class=\"nav\"></ul>\n        </div>\n        <div id=\"page-content\" class=\"page-content\"></div>\n        <div class=\"clearfix\"></div>\n    </div>\n</div>\n";
  });

this["JST"]["handlebars_templates/plan.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                    ";
  if (helper = helpers.last_updated) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.last_updated); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n                    &mdash;\n                    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n                    ";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n                    ";
  return buffer;
  }

  buffer += "<div class=\"plan\">\n    <header class=\"plan-header\">\n        <button class=\"panel-toggle\">\n            &times;\n        </button>\n        <div class=\"plan-header-content\">\n            <h1>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n            <div class=\"plan-header-content-item adopted\">\n                <label>adopted</label>\n                <span class=\"value\">";
  if (helper = helpers.adopted) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adopted); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </div>\n            <div class=\"plan-header-content-item\">\n                <label>last updated</label>\n                <span class=\"value\">\n                    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.last_updated), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                </span>\n            </div>\n            <div class=\"plan-header-content-item\">\n                <label>status</label>\n                <span class=\"value\">\n                    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.status), {hash:{},inverse:self.program(3, program3, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n                </span>\n            </div>\n        </div>\n        <div style=\"clear: both;\"></div>\n    </header>\n    <div class=\"plan-content\">\n        <section id=\"plan-about\">\n\n            <div id=\"image-container\" class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"false\" style=\"display: none;\">\n\n                <ol class=\"carousel-indicators\"></ol>\n\n                <!-- Wrapper for slides -->\n                <div class=\"carousel-inner\"></div>\n\n                <!-- Controls -->\n                <a class=\"left carousel-control\" href=\"#image-container\" data-slide=\"prev\">\n                    <span class=\"icon-prev\"></span>\n                </a>\n                <a class=\"right carousel-control\" href=\"#image-container\" data-slide=\"next\">\n                    <span class=\"icon-next\"></span>\n                </a>\n            </div>\n\n            <h2>About the plan</h2>\n            <div id=\"plan-details\"></div>\n            <a class=\"plan-share-story\" target=\"_blank\" href=\"mailto:organizers@596acres.org?subject=My Urban Reviewer story on ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">Share your story</a>\n        </section>\n        <section id=\"lots\">\n            <h2>lots</h2>\n            <div id=\"lots-content\"></div>\n        </section>\n    </div>\n</div>\n";
  return buffer;
  });

this["JST"]["handlebars_templates/plan_list.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n                <option data-min=\""
    + escapeExpression(((stack1 = (depth0 && depth0[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-max=\""
    + escapeExpression(((stack1 = (depth0 && depth0[1])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" value=\""
    + escapeExpression(((stack1 = (depth0 && depth0[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">\n                    "
    + escapeExpression(((stack1 = (depth0 && depth0[0])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " - "
    + escapeExpression(((stack1 = (depth0 && depth0[1])),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n                </option>\n                ";
  return buffer;
  }

  buffer += "<div id=\"plan-list-container\">\n    <h2>Plans</h2>\n    <a href=\"#\" id=\"plan-list-filters-link\" class=\"nav-button\">Filters</a>\n    <section class=\"filter-section\">\n        <h3 class=\"filter-section-header\">plan status</h3>\n        <div class=\"input-group\">\n            <input type=\"checkbox\" id=\"plan-status-active\" />\n            <label class=\"checkbox-label\" for=\"plan-status-active\">active</label>\n            <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Show only plans that have not expired\">?</span>\n        </div>\n        <div class=\"input-group\">\n            <input type=\"checkbox\" id=\"plan-status-expired\" />\n            <label class=\"checkbox-label\" for=\"plan-status-expired\">expired</label>\n            <span class=\"help-button\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Show only plans that have expired\">?</span>\n        </div>\n    </section>\n    <section class=\"filter-section\">\n        <h3 class=\"filter-section-header\">last updated year</h3>\n        <div>\n            <select id=\"last-updated\">\n                <option value=\"\">any year</option>\n                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.decades), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n            <span class=\"help-button\" data-toggle=\"tooltip\"\n                data-placement=\"left\" title=\"Show only plans that were updated in the given decade\">?</span>\n        </div>\n    </section>\n    <section id=\"plans\">\n        <div class=\"plan-list-header\">\n            <div class=\"plan-list-header-adopted\">adopted</div>\n            <div class=\"plan-list-header-name\">plan</div>\n            <div style=\"clear: both;\"></div>\n        </div>\n        <div id=\"plan-list-partial-container\"></div>\n    </section>\n</div>\n";
  return buffer;
  });

this["JST"]["handlebars_templates/plan_list_partial.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <li class=\"plan\" data-name=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n            <div class=\"plan-adopted\">";
  if (helper = helpers.adopted) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adopted); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n            <div class=\"plan-name\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n            <div style=\"clear: both;\"></div>\n        </li>\n    ";
  return buffer;
  }

  buffer += "<ul class=\"plan-list\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.plans), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  });