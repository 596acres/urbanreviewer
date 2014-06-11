this["JST"] = this["JST"] || {};

this["JST"]["handlebars_templates/filters.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n            <option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <div>\n            <input type=\"checkbox\" id=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-disposition=\"";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n            <label for=\"";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</label>\n        </div>\n        ";
  return buffer;
  }

  buffer += "<section id=\"filters\">\n    <h2>filters</h2>\n    <section>\n        <h3>plan status</h3>\n        <div>\n            <input type=\"checkbox\" id=\"plan-status-active\" />\n            <label for=\"plan-status-active\">active</label>\n        </div>\n        <div>\n            <input type=\"checkbox\" id=\"plan-status-expired\" />\n            <label for=\"plan-status-expired\">expired</label>\n        </div>\n    </section>\n    <section>\n        <h3>NYC mayors</h3>\n        <select id=\"mayors\">\n            <option data-start=\"1950\" data-end=\"2013\">pick one</option>\n            <option data-start=\"1950\" data-end=\"1953\">Vincent R. Impellitteri</option>\n            <option data-start=\"1954\" data-end=\"1965\">Robert F. Wagner, Jr.</option>\n            <option data-start=\"1966\" data-end=\"1973\">John V. Lindsay</option>\n            <option data-start=\"1974\" data-end=\"1977\">Abraham D. Beame</option>\n            <option data-start=\"1978\" data-end=\"1989\">Edward I. Koch</option>\n            <option data-start=\"1990\" data-end=\"1993\">David N. Dinkins</option>\n            <option data-start=\"1994\" data-end=\"2001\">Rudolph W. Giuliani</option>\n            <option data-start=\"2002\" data-end=\"2013\">Michael R. Bloomberg</option>\n        </select>\n    </section>\n    <section>\n        <h3>last updated year</h3>\n        <select id=\"last-updated\">\n            <option>pick one</option>\n            ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.years), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </select>\n    </section>\n</section>\n\n<section id=\"highlights\">\n    <h2>highlight lots</h2>\n    <section id=\"dispositions\">\n        <h3>disposition</h3>\n        ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.dispositions), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </section>\n    <section>\n        <h3>public vacant lots</h3>\n        <div>\n            <input type=\"checkbox\" id=\"public-vacant\" />\n            <label for=\"public-vacant\">public vacant</label>\n        </div>\n    </section>\n</section>\n";
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
    + "\">\n            <h3>";
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
    + "</h3>\n            <div>Planned disposition: ";
  if (helper = helpers.disposition) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.disposition); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n            ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.in_596), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </li>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            <div><a href=\"http://596acres.org/lot/";
  if (helper = helpers.bbl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.bbl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">View on 596 Acres</a></div>\n            ";
  return buffer;
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


  buffer += "<button class=\"panel-toggle\">\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n</button>\n<h1>";
  if (helper = helpers.plan_name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.plan_name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h1>\n<div class=\"borough\">";
  if (helper = helpers.borough) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.borough); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n<div><span class=\"lot-count\"></span> lots</div>\n<div id=\"plan-details\"></div>\n<section id=\"lots\">\n    <h2>lots</h2>\n    <div id=\"lots-content\"></div>\n</section>\n";
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