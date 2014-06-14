this["JST"] = this["JST"] || {};

this["JST"]["handlebars_templates/filters.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n                <option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n                ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div>\n                <input type=\"checkbox\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-disposition=\"";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n                <label for=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n            </div>\n            ";
  return buffer;
  }

  buffer += "<div id=\"filters-container\">\n    <section id=\"filters\">\n        <h2>filters</h2>\n        <section>\n            <h3>plan status</h3>\n            <div>\n                <input type=\"checkbox\" id=\"plan-status-active\" />\n                <label for=\"plan-status-active\">active</label>\n            </div>\n            <div>\n                <input type=\"checkbox\" id=\"plan-status-expired\" />\n                <label for=\"plan-status-expired\">expired</label>\n            </div>\n        </section>\n        <section>\n            <h3>NYC mayors</h3>\n            <select id=\"mayors\">\n                <option data-start=\"1950\" data-end=\"2013\" value=\"\">pick one</option>\n                <option data-start=\"1950\" data-end=\"1953\">Vincent R. Impellitteri</option>\n                <option data-start=\"1954\" data-end=\"1965\">Robert F. Wagner, Jr.</option>\n                <option data-start=\"1966\" data-end=\"1973\">John V. Lindsay</option>\n                <option data-start=\"1974\" data-end=\"1977\">Abraham D. Beame</option>\n                <option data-start=\"1978\" data-end=\"1989\">Edward I. Koch</option>\n                <option data-start=\"1990\" data-end=\"1993\">David N. Dinkins</option>\n                <option data-start=\"1994\" data-end=\"2001\">Rudolph W. Giuliani</option>\n                <option data-start=\"2002\" data-end=\"2013\">Michael R. Bloomberg</option>\n            </select>\n        </section>\n        <section>\n            <h3>last updated year</h3>\n            <select id=\"last-updated\">\n                <option value=\"\">any year</option>\n                ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.years), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </select>\n        </section>\n    </section>\n\n    <section id=\"highlights\">\n        <h2>highlight lots</h2>\n        <section id=\"dispositions\">\n            <h3>selected planned uses</h3>\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.dispositions), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </section>\n        <section>\n            <h3>public vacant lots</h3>\n            <div>\n                <input type=\"checkbox\" id=\"public-vacant\" />\n                <label for=\"public-vacant\">publicly owned and vacant today</label>\n            </div>\n        </section>\n    </section>\n</div>\n";
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

this["JST"]["handlebars_templates/plan.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"plan\">\n    <header class=\"plan-header\">\n        <button class=\"panel-toggle\">\n            &times;\n        </button>\n        <div class=\"plan-header-content\">\n            <h1>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n            <div class=\"plan-header-content-item adopted\">\n                <label>adopted</label>\n                <span class=\"value\">";
  if (helper = helpers.adopted) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.adopted); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </div>\n            <div class=\"plan-header-content-item\">\n                <label>status</label>\n                <span class=\"value\">";
  if (helper = helpers.status) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.status); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n            </div>\n        </div>\n        <div style=\"clear: both;\"></div>\n    </header>\n    <div class=\"plan-content\">\n        <section id=\"plan-about\">\n            <h2>About the plan</h2>\n            <p>(Coming soon.)</p>\n            <div id=\"plan-details\"></div>\n            <a class=\"plan-share-story\" target=\"_blank\" href=\"mailto:organizers@596acres.org?subject=My Urban Reviewer story on ";
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
  
  var buffer = "", stack1, helper;
  buffer += "\n            <li class=\"plan\" data-name=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n                <div class=\"plan-name\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n                <div class=\"plan-borough\">";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ", NY</div>\n            </li>\n        ";
  return buffer;
  }

  buffer += "<a href=\"#\" id=\"plan-list-filters-link\">Filters</a>\n<section id=\"plans\">\n    <h2>Plans</h2>\n    <ul class=\"plan-list\">\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.plans), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n</section>\n";
  return buffer;
  });