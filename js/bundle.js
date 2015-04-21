(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/bootstrap/js/carousel.js":[function(require,module,exports){
/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return this.sliding = false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/bootstrap/js/tooltip.js":[function(require,module,exports){
/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return
      var that = this;

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.hoverState = null

      var complete = function() {
        that.$element.trigger('shown.bs.' + that.type)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one($.support.transition.end, complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth,
      height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQDateRangeSlider.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function ($, undefined) {
	"use strict";
	
	$.widget("ui.dateRangeSlider", $.ui.rangeSlider, {
		options: {
			bounds: {min: new Date(2010,0,1).valueOf(), max: new Date(2012,0,1).valueOf()},
			defaultValues: {min: new Date(2010,1,11).valueOf(), max: new Date(2011,1,11).valueOf()}
		},

		_create: function(){
			$.ui.rangeSlider.prototype._create.apply(this);

			this.element.addClass("ui-dateRangeSlider");
		},

		destroy: function(){
			this.element.removeClass("ui-dateRangeSlider");
			$.ui.rangeSlider.prototype.destroy.apply(this);
		},

		_setDefaultValues: function(){
			this._values = {
				min: this.options.defaultValues.min.valueOf(),
				max: this.options.defaultValues.max.valueOf()
			};
		},

		_setRulerParameters: function(){
			this.ruler.ruler({
				min: new Date(this.options.bounds.min),
				max: new Date(this.options.bounds.max),
				scales: this.options.scales
			});
		},

		_setOption: function(key, value){
			if ((key === "defaultValues" || key === "bounds") && typeof value !== "undefined" && value !== null && this._isValidDate(value.min) && this._isValidDate(value.max)){
				$.ui.rangeSlider.prototype._setOption.apply(this, [key, {min:value.min.valueOf(), max:value.max.valueOf()}]);
			}else{
				$.ui.rangeSlider.prototype._setOption.apply(this, this._toArray(arguments));
			}
		},

		_handleType: function(){
			return "dateRangeSliderHandle";
		},

		option: function(key){
			if (key === "bounds" || key === "defaultValues"){
				var result = $.ui.rangeSlider.prototype.option.apply(this, arguments);

				return {min:new Date(result.min), max:new Date(result.max)};
			}

			return $.ui.rangeSlider.prototype.option.apply(this, this._toArray(arguments));
		},

		_defaultFormatter: function(value){
			var month = value.getMonth() + 1,
				day = value.getDate();

			return "" + value.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
		},

		_getFormatter: function(){
			var formatter = this.options.formatter;

			if (this.options.formatter === false || this.options.formatter === null){
				formatter = this._defaultFormatter;
			}

			return (function(formatter){
				return function(value){
					return formatter(new Date(value));
				}
			}(formatter));
		},

		values: function(min, max){
			var values = null;
			
			if (this._isValidDate(min) && this._isValidDate(max))
			{
				values = $.ui.rangeSlider.prototype.values.apply(this, [min.valueOf(), max.valueOf()]);
			}else{
				values = $.ui.rangeSlider.prototype.values.apply(this, this._toArray(arguments));
			}

			return {min: new Date(values.min), max: new Date(values.max)};
		},

		min: function(min){
			if (this._isValidDate(min)){
				return new Date($.ui.rangeSlider.prototype.min.apply(this, [min.valueOf()]));
			}

			return new Date($.ui.rangeSlider.prototype.min.apply(this));
		},

		max: function(max){
			if (this._isValidDate(max)){
				return new Date($.ui.rangeSlider.prototype.max.apply(this, [max.valueOf()]));
			}

			return new Date($.ui.rangeSlider.prototype.max.apply(this));
		},
		
		bounds: function(min, max){
			var result;
			
			if (this._isValidDate(min) && this._isValidDate(max)) {
				result = $.ui.rangeSlider.prototype.bounds.apply(this, [min.valueOf(), max.valueOf()]);
			} else {
				result = $.ui.rangeSlider.prototype.bounds.apply(this, this._toArray(arguments));
			}
			
			return {min: new Date(result.min), max: new Date(result.max)};
		},

		_isValidDate: function(value){
			return typeof value !== "undefined" && value instanceof Date;
		},

		_toArray: function(argsObject){
			return Array.prototype.slice.call(argsObject);
		}
	});
}(jQuery));
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQDateRangeSliderHandle.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($, undefined){
	"use strict";

	$.widget("ui.dateRangeSliderHandle", $.ui.rangeSliderHandle, {
		_steps: false,
		_boundsValues: {},

		_create: function(){
			this._createBoundsValues();
			$.ui.rangeSliderHandle.prototype._create.apply(this);
		},

		_getValueForPosition: function(position){
			
			var raw = this._getRawValueForPositionAndBounds(position, this.options.bounds.min.valueOf(), this.options.bounds.max.valueOf());

			return this._constraintValue(new Date(raw));
		},

		_setOption: function(key, value){
			if (key === "step"){
				this.options.step = value;
				this._createSteps();
				this.update();
				return;
			}

			$.ui.rangeSliderHandle.prototype._setOption.apply(this, [key, value]);

			if (key === "bounds"){
				this._createBoundsValues();
			}
		},

		_createBoundsValues: function(){
			this._boundsValues = {
					min: this.options.bounds.min.valueOf(),
					max: this.options.bounds.max.valueOf()
			};
		},

		_bounds: function(){
			return this._boundsValues;
		},

		_createSteps: function(){
			if (this.options.step === false || !this._isValidStep()){
				this._steps = false;
				return;
			}

			var minDate = new Date(this.options.bounds.min),
				maxDate = new Date(this.options.bounds.max),
				stepDate = minDate,
				i = 0,
				previous = new Date();

			this._steps = [];

			while (stepDate <= maxDate && (i === 1 || previous.valueOf() !== stepDate.valueOf())){
				previous = stepDate;
				this._steps.push(stepDate.valueOf());

				stepDate = this._addStep(minDate, i, this.options.step);
				i++;
			}

			if (previous.valueOf() === stepDate.valueOf()){
				this._steps = false;
			}
		},

		_isValidStep: function(){
			return typeof this.options.step === "object";
		},

		_addStep: function(reference, factor, step){
			var result = new Date(reference.valueOf());

			result = this._addThing(result, "FullYear", factor, step.years);
			result = this._addThing(result, "Month", factor, step.months);
			result = this._addThing(result, "Date", factor, step.weeks * 7);
			result = this._addThing(result, "Date", factor, step.days);
			result = this._addThing(result, "Hours", factor, step.hours);
			result = this._addThing(result, "Minutes", factor, step.minutes);
			result = this._addThing(result, "Seconds", factor, step.seconds);

			return result;
		},

		_addThing: function(date, thing, factor, base){
			if (factor === 0 || (base || 0) === 0){
				return date;
			}

			date["set" + thing](
				date["get" + thing]() + factor * (base || 0)
				);

			return date;
		},

		_round: function(value){
			if (this._steps === false){
				return value;
			}

			var max = this.options.bounds.max.valueOf(),
				min = this.options.bounds.min.valueOf(),
				ratio = Math.max(0, (value - min) / (max - min)),
				index = Math.floor(this._steps.length * ratio),
				before, after;

			while (this._steps[index] > value){
				index--;
			}

			while (index + 1 < this._steps.length && this._steps[index + 1] <= value){
				index++;
			}

			if (index >= this._steps.length - 1){
				return this._steps[this._steps.length - 1];
			} else if (index === 0){
				return this._steps[0];
			}

			before = this._steps[index];
			after = this._steps[index + 1];

			if (value - before < after - value){
				return before;
			}

			return after;
		},

		update: function(){
			this._createBoundsValues();
			this._createSteps();
			$.ui.rangeSliderHandle.prototype.update.apply(this);
		},

		add: function(date, step){
			return this._addStep(new Date(date), 1, step).valueOf();
		},

		substract: function(date, step){
			return this._addStep(new Date(date), -1, step).valueOf();
		},

		stepsBetween: function(date1, date2){
			if (this.options.step === false){
				return date2 - date1;
			}

			var min = Math.min(date1, date2),
				max = Math.max(date1, date2),
				steps = 0,
				negative = false,
				negativeResult = date1 > date2;

			if (this.add(min, this.options.step) - min < 0){
				negative = true;
			}

			while (min < max){
				if (negative){
					max = this.add(max, this.options.step);
				}else{
					min = this.add(min, this.options.step);	
				}
				
				steps++;
			}

			return negativeResult ? -steps : steps;
		},

		multiplyStep: function(step, factor){
			var result = {};

			for (var name in step){
				if (step.hasOwnProperty(name)){
					result[name] = step[name] * factor;
				}
			}

			return result;
		},

		stepRatio: function(){
			if (this.options.step === false){
				return 1;
			}else{
				var steps = this._steps.length;
				return this.cache.parent.width / steps;
			}
		}
	});
}(jQuery));
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSlider.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function ($, undefined) {
	"use strict";

	$.widget("ui.rangeSlider", {
		options: {
			bounds: {min:0, max:100},
			defaultValues: {min:20, max:50},
			wheelMode: null,
			wheelSpeed: 4,
			arrows: true,
			valueLabels: "show",
			formatter: null,
			durationIn: 0,
			durationOut: 400,
			delayOut: 200,
			range: {min: false, max: false},
			step: false,
			scales: false,
			enabled: true,
			symmetricPositionning: false
		},

		_values: null,
		_valuesChanged: false,
		_initialized: false,

		// Created elements
		bar: null,
		leftHandle: null,
		rightHandle: null,
		innerBar: null,
		container: null,
		arrows: null,
		labels: null,
		changing: {min:false, max:false},
		changed: {min:false, max:false},
		ruler: null,

		_create: function(){
			this._setDefaultValues();

			this.labels = {left: null, right:null, leftDisplayed:true, rightDisplayed:true};
			this.arrows = {left:null, right:null};
			this.changing = {min:false, max:false};
			this.changed = {min:false, max:false};

			this._createElements();

			this._bindResize();

			setTimeout($.proxy(this.resize, this), 1);
			setTimeout($.proxy(this._initValues, this), 1);
		},

		_setDefaultValues: function(){
			this._values = {
				min: this.options.defaultValues.min,
				max: this.options.defaultValues.max
			};
		},

		_bindResize: function(){
			var that = this;

			this._resizeProxy = function(e){
				that.resize(e);
			};

			$(window).resize(this._resizeProxy);
		},

		_initWidth: function(){
			this.container.css("width", this.element.width() - this.container.outerWidth(true) + this.container.width());
			this.innerBar.css("width", this.container.width() - this.innerBar.outerWidth(true) + this.innerBar.width());
		},

		_initValues: function(){
			this._initialized = true;
			this.values(this._values.min, this._values.max);
		},

		_setOption: function(key, value) {
			this._setWheelOption(key, value);		
			this._setArrowsOption(key, value);
			this._setLabelsOption(key, value);
			this._setLabelsDurations(key, value);
			this._setFormatterOption(key, value);
			this._setBoundsOption(key, value);
			this._setRangeOption(key, value);
			this._setStepOption(key, value);
			this._setScalesOption(key, value);
			this._setEnabledOption(key, value);
			this._setPositionningOption(key, value);
		},

		_validProperty: function(object, name, defaultValue){
			if (object === null || typeof object[name] === "undefined"){
				return defaultValue;
			}

			return object[name];
		},

		_setStepOption: function(key, value){
			if (key === "step"){
				this.options.step = value;
				this._leftHandle("option", "step", value);
				this._rightHandle("option", "step", value);
				this._changed(true);
			}
		},

		_setScalesOption: function(key, value){
			if (key === "scales"){
				if (value === false || value === null){
					this.options.scales = false;
					this._destroyRuler();
				}else if (value instanceof Array){
					this.options.scales = value;
					this._updateRuler();
				}
			}
		},

		_setRangeOption: function(key, value){
			if (key === "range"){
				this._bar("option", "range", value);
				this.options.range = this._bar("option", "range");
				this._changed(true);
			}
		},

		_setBoundsOption: function(key, value){
			if (key === "bounds" && typeof value.min !== "undefined" && typeof value.max !== "undefined"){
				this.bounds(value.min, value.max);
			}
		},

		_setWheelOption: function(key, value){
			if (key === "wheelMode" || key === "wheelSpeed"){
				this._bar("option", key, value);
				this.options[key] = this._bar("option", key);
			}
		},

		_setLabelsOption: function(key, value){
			if (key === "valueLabels"){
				if (value !== "hide" && value !== "show" && value !== "change"){
					return;
				}

				this.options.valueLabels = value;

				if (value !== "hide"){
					this._createLabels();
					this._leftLabel("update");
					this._rightLabel("update");
				}else{
					this._destroyLabels();
				}
			}
		},

		_setFormatterOption: function(key, value){
			if (key === "formatter" && value !== null && typeof value === "function"){
				if (this.options.valueLabels !== "hide"){
					this._leftLabel("option", "formatter", value);
					this.options.formatter = this._rightLabel("option", "formatter", value);
				}
			}
		},

		_setArrowsOption: function(key, value){
			if (key === "arrows" && (value === true || value === false) && value !== this.options.arrows){
				if (value === true){
					this.element
						.removeClass("ui-rangeSlider-noArrow")
						.addClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "block");
					this.arrows.right.css("display", "block");
					this.options.arrows = true;
				}else if (value === false){
					this.element
						.addClass("ui-rangeSlider-noArrow")
						.removeClass("ui-rangeSlider-withArrows");
					this.arrows.left.css("display", "none");
					this.arrows.right.css("display", "none");
					this.options.arrows = false;
				}

				this._initWidth();
			}
		},

		_setLabelsDurations: function(key, value){
			if (key === "durationIn" || key === "durationOut" || key === "delayOut"){
				if (parseInt(value, 10) !== value) return;

				if (this.labels.left !== null){
					this._leftLabel("option", key, value);
				}

				if (this.labels.right !== null){
					this._rightLabel("option", key, value);
				}

				this.options[key] = value;
			}
		},

		_setEnabledOption: function(key, value){
			if (key === "enabled"){
				this.toggle(value);
			}
		},

		_setPositionningOption: function(key, value){
			if (key === "symmetricPositionning"){
				this._rightHandle("option", key, value);
				this.options[key] = this._leftHandle("option", key, value);
			}
		},

		_createElements: function(){
			if (this.element.css("position") !== "absolute"){
				this.element.css("position", "relative");
			}

			this.element.addClass("ui-rangeSlider");

			this.container = $("<div class='ui-rangeSlider-container' />")
				.css("position", "absolute")
				.appendTo(this.element);
			
			this.innerBar = $("<div class='ui-rangeSlider-innerBar' />")
				.css("position", "absolute")
				.css("top", 0)
				.css("left", 0);

			this._createHandles();
			this._createBar();
			this.container.prepend(this.innerBar);
			this._createArrows();

			if (this.options.valueLabels !== "hide"){
				this._createLabels();
			}else{
				this._destroyLabels();
			}

			this._updateRuler();

			if (!this.options.enabled) this._toggle(this.options.enabled);
		},

		_createHandle: function(options){
			return $("<div />")
				[this._handleType()](options)
				.bind("sliderDrag", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
		},

		_createHandles: function(){
			this.leftHandle = this._createHandle({
					isLeft: true,
					bounds: this.options.bounds,
					value: this._values.min,
					step: this.options.step,
					symmetricPositionning: this.options.symmetricPositionning
			}).appendTo(this.container);
	
			this.rightHandle = this._createHandle({
				isLeft: false,
				bounds: this.options.bounds,
				value: this._values.max,
				step: this.options.step,
				symmetricPositionning: this.options.symmetricPositionning
			}).appendTo(this.container);
		},
		
		_createBar: function(){
			this.bar = $("<div />")
				.prependTo(this.container)
				.bind("sliderDrag scroll zoom", $.proxy(this._changing, this))
				.bind("stop", $.proxy(this._changed, this));
			
			this._bar({
					leftHandle: this.leftHandle,
					rightHandle: this.rightHandle,
					values: {min: this._values.min, max: this._values.max},
					type: this._handleType(),
					range: this.options.range,
					wheelMode: this.options.wheelMode,
					wheelSpeed: this.options.wheelSpeed
				});

			this.options.range = this._bar("option", "range");
			this.options.wheelMode = this._bar("option", "wheelMode");
			this.options.wheelSpeed = this._bar("option", "wheelSpeed");
		},

		_createArrows: function(){
			this.arrows.left = this._createArrow("left");
			this.arrows.right = this._createArrow("right");

			if (!this.options.arrows){
				this.arrows.left.css("display", "none");
				this.arrows.right.css("display", "none");
				this.element.addClass("ui-rangeSlider-noArrow");
			}else{
				this.element.addClass("ui-rangeSlider-withArrows");
			}
		},

		_createArrow: function(whichOne){
			var arrow = $("<div class='ui-rangeSlider-arrow' />")
				.append("<div class='ui-rangeSlider-arrow-inner' />")
				.addClass("ui-rangeSlider-" + whichOne + "Arrow")
				.css("position", "absolute")
				.css(whichOne, 0)
				.appendTo(this.element),
				target;

			if (whichOne === "right"){
				target = $.proxy(this._scrollRightClick, this);
			}else{
				target = $.proxy(this._scrollLeftClick, this);
			}

			arrow.bind("mousedown touchstart", target);

			return arrow;
		},

		_proxy: function(element, type, args){
			var array = Array.prototype.slice.call(args);

			if (element && element[type]){
				return element[type].apply(element, array);	
			}

			return null;
		},

		_handleType: function(){
			return "rangeSliderHandle";
		},

		_barType: function(){
			return "rangeSliderBar";
		},

		_bar: function(){
			return this._proxy(this.bar, this._barType(), arguments);
		},

		_labelType: function(){
			return "rangeSliderLabel";
		},

		_leftLabel: function(){
			return this._proxy(this.labels.left, this._labelType(), arguments);
		},

		_rightLabel: function(){
			return this._proxy(this.labels.right, this._labelType(), arguments);
		},

		_leftHandle: function(){
			return this._proxy(this.leftHandle, this._handleType(), arguments);
		},

		_rightHandle: function(){
			return this._proxy(this.rightHandle, this._handleType(), arguments);
		},

		_getValue: function(position, handle){
			if (handle === this.rightHandle){	
				position = position - handle.outerWidth();
			}
			
			return position * (this.options.bounds.max - this.options.bounds.min) / (this.container.innerWidth() - handle.outerWidth(true)) + this.options.bounds.min;
		},

		_trigger: function(eventName){
			var that = this;

			setTimeout(function(){
				that.element.trigger(eventName, {
						label: that.element,
						values: that.values()
					});
			}, 1);
		},

		_changing: function(){
			if(this._updateValues()){
				this._trigger("valuesChanging");
				this._valuesChanged = true;
			}
		},

		_deactivateLabels: function(){
			if (this.options.valueLabels === "change"){
				this._leftLabel("option", "show", "hide");
				this._rightLabel("option", "show", "hide");
			}
		},

		_reactivateLabels: function(){
			if (this.options.valueLabels === "change"){
				this._leftLabel("option", "show", "change");
				this._rightLabel("option", "show", "change");
			}
		},

		_changed: function(isAutomatic){
			if (isAutomatic === true){
				this._deactivateLabels();
			}

			if (this._updateValues() || this._valuesChanged){
				this._trigger("valuesChanged");

				if (isAutomatic !== true){
					this._trigger("userValuesChanged");					
				}

				this._valuesChanged = false;
			}

			if (isAutomatic === true){
				this._reactivateLabels();
			}
		},

		_updateValues: function(){
			var left = this._leftHandle("value"),
				right = this._rightHandle("value"),
				min = this._min(left, right),
				max = this._max(left, right),
				changing = (min !== this._values.min || max !== this._values.max);

			this._values.min = this._min(left, right);
			this._values.max = this._max(left, right);

			return changing;
		},

		_min: function(value1, value2){
			return Math.min(value1, value2);
		},

		_max: function(value1, value2){
			return Math.max(value1, value2);
		},

		/*
		 * Value labels
		 */
		_createLabel: function(label, handle){
			var params;

			if (label === null){
				params = this._getLabelConstructorParameters(label, handle);
				label = $("<div />")
					.appendTo(this.element)
					[this._labelType()](params);
			}else{
				params = this._getLabelRefreshParameters(label, handle);

				label[this._labelType()](params);
			}

			return label;
		},

		_getLabelConstructorParameters: function(label, handle){
			return {
				handle: handle,
				handleType: this._handleType(),
				formatter: this._getFormatter(),
				show: this.options.valueLabels,
				durationIn: this.options.durationIn,
				durationOut: this.options.durationOut,
				delayOut: this.options.delayOut
			};
		},

		_getLabelRefreshParameters: function(){
			return {
				formatter: this._getFormatter(),
				show: this.options.valueLabels,
				durationIn: this.options.durationIn,
				durationOut: this.options.durationOut,
				delayOut: this.options.delayOut
			};
		},

		_getFormatter: function(){
			if (this.options.formatter === false || this.options.formatter === null){
				return this._defaultFormatter;
			}

			return this.options.formatter;
		},

		_defaultFormatter: function(value){
			return Math.round(value);
		},

		_destroyLabel: function(label){
			if (label !== null){
				label[this._labelType()]("destroy");
				label.remove();
				label = null;
			}

			return label;
		},

		_createLabels: function(){
			this.labels.left = this._createLabel(this.labels.left, this.leftHandle);
			this.labels.right = this._createLabel(this.labels.right, this.rightHandle);

			this._leftLabel("pair", this.labels.right);
		},

		_destroyLabels: function(){
			this.labels.left = this._destroyLabel(this.labels.left);
			this.labels.right = this._destroyLabel(this.labels.right);
		},

		/*
		 * Scrolling
		 */
		_stepRatio: function(){
			return this._leftHandle("stepRatio");
		},

		_scrollRightClick: function(e){
			if (!this.options.enabled) return false;

			e.preventDefault();
			this._bar("startScroll");
			this._bindStopScroll();

			this._continueScrolling("scrollRight", 4 * this._stepRatio(), 1);
		},

		_continueScrolling: function(action, timeout, quantity, timesBeforeSpeedingUp){
			if (!this.options.enabled) return false;

			this._bar(action, quantity);
			timesBeforeSpeedingUp = timesBeforeSpeedingUp || 5;
			timesBeforeSpeedingUp--;

			var that = this,
				minTimeout = 16,
				maxQuantity = Math.max(1, 4 / this._stepRatio());

			this._scrollTimeout = setTimeout(function(){
				if (timesBeforeSpeedingUp === 0){
					if (timeout > minTimeout){
						timeout = Math.max(minTimeout, timeout / 1.5);	
					} else {
						quantity = Math.min(maxQuantity, quantity * 2);
					}
					
					timesBeforeSpeedingUp = 5;
				}

				that._continueScrolling(action, timeout, quantity, timesBeforeSpeedingUp);
			}, timeout);
		},

		_scrollLeftClick: function(e){
			if (!this.options.enabled) return false;

			e.preventDefault();

			this._bar("startScroll");
			this._bindStopScroll();

			this._continueScrolling("scrollLeft", 4 * this._stepRatio(), 1);
		},

		_bindStopScroll: function(){
			var that = this;
			this._stopScrollHandle = function(e){
				e.preventDefault();
				that._stopScroll();
			};

			$(document).bind("mouseup touchend", this._stopScrollHandle);
		},

		_stopScroll: function(){
			$(document).unbind("mouseup touchend", this._stopScrollHandle);
			this._stopScrollHandle = null;
			this._bar("stopScroll");
			clearTimeout(this._scrollTimeout);
		},

		/*
		 * Ruler
		 */
		_createRuler: function(){
			this.ruler = $("<div class='ui-rangeSlider-ruler' />").appendTo(this.innerBar);
		},

		_setRulerParameters: function(){
			this.ruler.ruler({
				min: this.options.bounds.min,
				max: this.options.bounds.max,
				scales: this.options.scales
			});
		},

		_destroyRuler: function(){
			if (this.ruler !== null && $.fn.ruler){
				this.ruler.ruler("destroy");
				this.ruler.remove();
				this.ruler = null;
			}
		},

		_updateRuler: function(){
			this._destroyRuler();

			if (this.options.scales === false || !$.fn.ruler){
				return;
			}

			this._createRuler();
			this._setRulerParameters();			
		},

		/*
		 * Public methods
		 */
		values: function(min, max){
			var val;

			if (typeof min !== "undefined" && typeof max !== "undefined"){
				if (!this._initialized){
					this._values.min = min;
					this._values.max = max;
					return this._values;
				}

				this._deactivateLabels();
				val = this._bar("values", min, max);
				this._changed(true);
				this._reactivateLabels();
			}else{
				val = this._bar("values", min, max);
			}

			return val;
		},

		min: function(min){
			this._values.min = this.values(min, this._values.max).min;

			return this._values.min;
		},

		max: function(max){
			this._values.max = this.values(this._values.min, max).max;

			return this._values.max;
		},
		
		bounds: function(min, max){
			if (this._isValidValue(min) && this._isValidValue(max) && min < max){
				
				this._setBounds(min, max);
				this._updateRuler();
				this._changed(true);
			}
			
			return this.options.bounds;
		},

		_isValidValue: function(value){
			return typeof value !== "undefined" && parseFloat(value) === value;
		},

		_setBounds: function(min, max){
			this.options.bounds = {min: min, max: max};
			this._leftHandle("option", "bounds", this.options.bounds);
			this._rightHandle("option", "bounds", this.options.bounds);
			this._bar("option", "bounds", this.options.bounds);
		},

		zoomIn: function(quantity){
			this._bar("zoomIn", quantity)
		},

		zoomOut: function(quantity){
			this._bar("zoomOut", quantity);
		},

		scrollLeft: function(quantity){
			this._bar("startScroll");
			this._bar("scrollLeft", quantity);
			this._bar("stopScroll");
		},

		scrollRight: function(quantity){
			this._bar("startScroll");
			this._bar("scrollRight", quantity);
			this._bar("stopScroll");
		},
		
		/**
		 * Resize
		 */
		resize: function(){
			this._initWidth();
			this._leftHandle("update");
			this._rightHandle("update");
			this._bar("update");
		},

		/*
		 * Enable / disable
		 */
		enable: function(){
			this.toggle(true);
		},

		disable: function(){
			this.toggle(false);
		},

		toggle: function(enabled){
			if (enabled === undefined) enabled = !this.options.enabled;

			if (this.options.enabled !== enabled){
				this._toggle(enabled);
			}
		},

		_toggle: function(enabled){
			this.options.enabled = enabled;
			this.element.toggleClass("ui-rangeSlider-disabled", !enabled);

			var action = enabled ? "enable" : "disable";

			this._bar(action);
			this._leftHandle(action);
			this._rightHandle(action);
			this._leftLabel(action);
			this._rightLabel(action);
		},

		/*
		 * Destroy
		 */
		destroy: function(){
			this.element.removeClass("ui-rangeSlider-withArrows ui-rangeSlider-noArrow ui-rangeSlider-disabled");

			this._destroyWidgets();
			this._destroyElements();
			
			this.element.removeClass("ui-rangeSlider");
			this.options = null;

			$(window).unbind("resize", this._resizeProxy);
			this._resizeProxy = null;
			this._bindResize = null;

			$.Widget.prototype.destroy.apply(this, arguments);
		},

		_destroyWidget: function(name){
			this["_" + name]("destroy");
			this[name].remove();
			this[name] = null;
		},

		_destroyWidgets: function(){
			this._destroyWidget("bar");
			this._destroyWidget("leftHandle");
			this._destroyWidget("rightHandle");

			this._destroyRuler();
			this._destroyLabels();
		},

		_destroyElements: function(){
			this.container.remove();
			this.container = null;

			this.innerBar.remove();
			this.innerBar = null;

			this.arrows.left.remove();
			this.arrows.right.remove();
			this.arrows = null;
		}
	});
}(jQuery));

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderBar.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($, undefined){
	"use strict";

	$.widget("ui.rangeSliderBar", $.ui.rangeSliderDraggable, {
		options: {
			leftHandle: null,
			rightHandle: null,
			bounds: {min: 0, max: 100},
			type: "rangeSliderHandle",
			range: false,
			drag: function() {},
			stop: function() {},
			values: {min: 0, max:20},
			wheelSpeed: 4,
			wheelMode: null
		},

		_values: {min: 0, max: 20},
		_waitingToInit: 2,
		_wheelTimeout: false,

		_create: function(){
			$.ui.rangeSliderDraggable.prototype._create.apply(this);

			this.element
				.css("position", "absolute")
				.css("top", 0)
				.addClass("ui-rangeSlider-bar");

			this.options.leftHandle
				.bind("initialize", $.proxy(this._onInitialized, this))
				.bind("mousestart", $.proxy(this._cache, this))
				.bind("stop", $.proxy(this._onHandleStop, this));

			this.options.rightHandle
				.bind("initialize", $.proxy(this._onInitialized, this))
				.bind("mousestart", $.proxy(this._cache, this))
				.bind("stop", $.proxy(this._onHandleStop, this));

			this._bindHandles();

			this._values = this.options.values;
			this._setWheelModeOption(this.options.wheelMode);
		},

		destroy: function(){
			this.options.leftHandle.unbind(".bar");
			this.options.rightHandle.unbind(".bar");
			this.options = null;

			$.ui.rangeSliderDraggable.prototype.destroy.apply(this);
		},

		_setOption: function(key, value){
			if (key === "range"){
				this._setRangeOption(value);
			} else if (key === "wheelSpeed"){
				this._setWheelSpeedOption(value);
			} else if (key === "wheelMode"){
				this._setWheelModeOption(value);
			}
		},

		_setRangeOption: function(value){
			if (typeof value !== "object" || value === null){
				value = false;
			}

			if (value === false && this.options.range === false){
				return;
			}

			if (value !== false){
				var min = valueOrFalse(value.min, this.options.range.min),
					max = valueOrFalse(value.max, this.options.range.max);

				this.options.range = {
					min: min,
					max: max
				};
			}else{
				this.options.range = false;
			}

			this._setLeftRange();
			this._setRightRange();
		},

		_setWheelSpeedOption: function(value){
			if (typeof value === "number" && value > 0){
				this.options.wheelSpeed = value;
			}
		},

		_setWheelModeOption: function(value){
			if (value === null || value === false || value === "zoom" || value === "scroll"){
				if (this.options.wheelMode !== value){
					this.element.parent().unbind("mousewheel.bar");
				}

				this._bindMouseWheel(value);
				this.options.wheelMode = value;
			}
		},

		_bindMouseWheel: function(mode){
			if (mode === "zoom"){
				this.element.parent().bind("mousewheel.bar", $.proxy(this._mouseWheelZoom, this));
			}else if (mode === "scroll"){
				this.element.parent().bind("mousewheel.bar", $.proxy(this._mouseWheelScroll, this));
			}
		},

		_setLeftRange: function(){
			if (this.options.range === false){
				return false;
			}

			var rightValue = this._values.max,
				leftRange = {min: false, max: false};

			if (typeof this.options.range.min !== "undefined" && this.options.range.min !== false){
				leftRange.max = this._leftHandle("substract", rightValue, this.options.range.min);
			}else{
				leftRange.max = false;
			}

			if (typeof this.options.range.max !== "undefined" && this.options.range.max !== false){
				leftRange.min = this._leftHandle("substract", rightValue, this.options.range.max);
			}else{
				leftRange.min = false;
			}

			this._leftHandle("option", "range", leftRange);
		},

		_setRightRange: function(){
			var leftValue = this._values.min,
				rightRange = {min: false, max:false};

			if (typeof this.options.range.min !== "undefined" && this.options.range.min !== false){
				rightRange.min = this._rightHandle("add", leftValue, this.options.range.min);
			}else {
				rightRange.min = false;
			}

			if (typeof this.options.range.max !== "undefined" && this.options.range.max !== false){
				rightRange.max = this._rightHandle("add", leftValue, this.options.range.max);
			}else{
				rightRange.max = false;
			}

			this._rightHandle("option", "range", rightRange);
		},

		_deactivateRange: function(){
			this._leftHandle("option", "range", false);
			this._rightHandle("option", "range", false);
		},

		_reactivateRange: function(){
			this._setRangeOption(this.options.range);
		},

		_onInitialized: function(){
			this._waitingToInit--;

			if (this._waitingToInit === 0){
				this._initMe();
			}
		},

		_initMe: function(){
			this._cache();
			this.min(this._values.min);
			this.max(this._values.max);

			var left = this._leftHandle("position"),
				right = this._rightHandle("position") + this.options.rightHandle.width();

			this.element.offset({
				left: left
			});

			this.element.css("width", right - left);
		},

		_leftHandle: function(){
			return this._handleProxy(this.options.leftHandle, arguments);
		},

		_rightHandle: function(){
			return this._handleProxy(this.options.rightHandle, arguments);
		},

		_handleProxy: function(element, args){
			var array = Array.prototype.slice.call(args);

			return element[this.options.type].apply(element, array);
		},

		/*
		 * Draggable
		 */

		_cache: function(){
			$.ui.rangeSliderDraggable.prototype._cache.apply(this);

			this._cacheHandles();
		},

		_cacheHandles: function(){
			this.cache.rightHandle = {};
			this.cache.rightHandle.width = this.options.rightHandle.width();
			this.cache.rightHandle.offset = this.options.rightHandle.offset();

			this.cache.leftHandle = {};
			this.cache.leftHandle.offset = this.options.leftHandle.offset();
		},

		_mouseStart: function(event){
			$.ui.rangeSliderDraggable.prototype._mouseStart.apply(this, [event]);

			this._deactivateRange();
		},

		_mouseStop: function(event){
			$.ui.rangeSliderDraggable.prototype._mouseStop.apply(this, [event]);

			this._cacheHandles();

			this._values.min = this._leftHandle("value");
			this._values.max = this._rightHandle("value");
			this._reactivateRange();

			this._leftHandle().trigger("stop");
			this._rightHandle().trigger("stop");
		},

		/*
		 * Event binding
		 */

		_onDragLeftHandle: function(event, ui){
			this._cacheIfNecessary();

			if (ui.element[0] !== this.options.leftHandle[0]){
				return;
			}

			if (this._switchedValues()){
				this._switchHandles();
				this._onDragRightHandle(event, ui);
				return;
			}

			this._values.min = ui.value;
			this.cache.offset.left = ui.offset.left;
			this.cache.leftHandle.offset = ui.offset;

			this._positionBar();
		},

		_onDragRightHandle: function(event, ui){
			this._cacheIfNecessary();

			if (ui.element[0] !== this.options.rightHandle[0]){
				return;
			}

			if (this._switchedValues()){
				this._switchHandles();
				this._onDragLeftHandle(event, ui);
				return;
			}

			this._values.max = ui.value;
			this.cache.rightHandle.offset = ui.offset;

			this._positionBar();
		},

		_positionBar: function(){
			var width = this.cache.rightHandle.offset.left + this.cache.rightHandle.width - this.cache.leftHandle.offset.left;
			this.cache.width.inner = width;

			this.element
				.css("width", width)
				.offset({left: this.cache.leftHandle.offset.left});
		},

		_onHandleStop: function(){
			this._setLeftRange();
			this._setRightRange();
		},

		_switchedValues: function(){
			if (this.min() > this.max()){
				var temp = this._values.min;
				this._values.min = this._values.max;
				this._values.max = temp;

				return true;
			}

			return false;
		},

		_switchHandles: function(){
			var temp = this.options.leftHandle;

			this.options.leftHandle = this.options.rightHandle;
			this.options.rightHandle = temp;

			this._leftHandle("option", "isLeft", true);
			this._rightHandle("option", "isLeft", false);

			this._bindHandles();
			this._cacheHandles();
		},

		_bindHandles: function(){
			this.options.leftHandle
				.unbind(".bar")
				.bind("sliderDrag.bar update.bar moving.bar", $.proxy(this._onDragLeftHandle, this));

			this.options.rightHandle
				.unbind(".bar")
				.bind("sliderDrag.bar update.bar moving.bar", $.proxy(this._onDragRightHandle, this));
		},

		_constraintPosition: function(left){
			var position = {},
				right;

			position.left = $.ui.rangeSliderDraggable.prototype._constraintPosition.apply(this, [left]);

			position.left = this._leftHandle("position", position.left);

			right = this._rightHandle("position", position.left + this.cache.width.outer - this.cache.rightHandle.width);
			position.width = right - position.left + this.cache.rightHandle.width;

			return position;
		},

		_applyPosition: function(position){
			$.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [position.left]);
			this.element.width(position.width);
		},

		/*
		 * Mouse wheel
		 */

		_mouseWheelZoom: function(event, delta, deltaX, deltaY){
			/*jshint maxstatements:17*/
			if (!this.enabled){
				return false;
			}

			var middle = this._values.min + (this._values.max - this._values.min) / 2,
				leftRange = {},
				rightRange = {};

			if (this.options.range === false || this.options.range.min === false){
				leftRange.max = middle;
				rightRange.min = middle;
			} else {
				leftRange.max = middle - this.options.range.min / 2;
				rightRange.min = middle + this.options.range.min / 2;
			}

			if (this.options.range !== false && this.options.range.max !== false){
				leftRange.min = middle - this.options.range.max / 2;
				rightRange.max = middle + this.options.range.max / 2;
			}

			this._leftHandle("option", "range", leftRange);
			this._rightHandle("option", "range", rightRange);

			clearTimeout(this._wheelTimeout);
			this._wheelTimeout = setTimeout($.proxy(this._wheelStop, this), 200);

			this.zoomIn(deltaY * this.options.wheelSpeed);

			return false;
		},

		_mouseWheelScroll: function(event, delta, deltaX, deltaY){
			if (!this.enabled){
				return false;
			}

			if (this._wheelTimeout === false){
				this.startScroll();
			} else {
				clearTimeout(this._wheelTimeout);
			}

			this._wheelTimeout = setTimeout($.proxy(this._wheelStop, this), 200);

			this.scrollLeft(deltaY * this.options.wheelSpeed);
			return false;
		},

		_wheelStop: function(){
			this.stopScroll();
			this._wheelTimeout = false;
		},

		/*
		 * Public
		 */

		min: function(value){
			return this._leftHandle("value", value);
		},

		max: function(value){
			return this._rightHandle("value", value);
		},

		startScroll: function(){
			this._deactivateRange();
		},

		stopScroll: function(){
			this._reactivateRange();
			this._triggerMouseEvent("stop");
			this._leftHandle().trigger("stop");
			this._rightHandle().trigger("stop");
		},

		scrollLeft: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.scrollRight(-quantity);
			}

			quantity = this._leftHandle("moveLeft", quantity);
			this._rightHandle("moveLeft", quantity);

			this.update();
			this._triggerMouseEvent("scroll");
		},

		scrollRight: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.scrollLeft(-quantity);
			}

			quantity = this._rightHandle("moveRight", quantity);
			this._leftHandle("moveRight", quantity);

			this.update();
			this._triggerMouseEvent("scroll");
		},

		zoomIn: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.zoomOut(-quantity);
			}

			var newQuantity = this._rightHandle("moveLeft", quantity);

			if (quantity > newQuantity){
				newQuantity = newQuantity / 2;
				this._rightHandle("moveRight", newQuantity);
			}

			this._leftHandle("moveRight", newQuantity);

			this.update();
			this._triggerMouseEvent("zoom");
		},

		zoomOut: function(quantity){
			quantity = quantity || 1;

			if (quantity < 0){
				return this.zoomIn(-quantity);
			}

			var newQuantity = this._rightHandle("moveRight", quantity);

			if (quantity > newQuantity){
				newQuantity = newQuantity / 2;
				this._rightHandle("moveLeft", newQuantity);
			}

			this._leftHandle("moveLeft", newQuantity);

			this.update();
			this._triggerMouseEvent("zoom");
		},

		values: function(min, max){
			if (typeof min !== "undefined" && typeof max !== "undefined")
			{
				var minValue = Math.min(min, max),
					maxValue = Math.max(min, max);

				this._deactivateRange();
				this.options.leftHandle.unbind(".bar");
				this.options.rightHandle.unbind(".bar");

				this._values.min = this._leftHandle("value", minValue);
				this._values.max = this._rightHandle("value", maxValue);

				this._bindHandles();
				this._reactivateRange();

				this.update();
			}

			return {
				min: this._values.min,
				max: this._values.max
			};
		},

		update: function(){
			this._values.min = this.min();
			this._values.max = this.max();

			this._cache();
			this._positionBar();
		}
	});

	function valueOrFalse(value, defaultValue){
		if (typeof value === "undefined"){
			return defaultValue || false;
		}

		return value;
	}

}(jQuery));

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderDraggable.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function($, undefined){
	"use strict";

	$.widget("ui.rangeSliderDraggable", $.ui.rangeSliderMouseTouch, {
		cache: null,

		options: {
			containment: null
		},

		_create: function(){
			$.ui.rangeSliderMouseTouch.prototype._create.apply(this);

			setTimeout($.proxy(this._initElementIfNotDestroyed, this), 10);
		},

		destroy: function(){
			this.cache = null;
			
			$.ui.rangeSliderMouseTouch.prototype.destroy.apply(this);
		},

		_initElementIfNotDestroyed: function(){
			if (this._mouseInit){
				this._initElement();
			}
		},

		_initElement: function(){
			this._mouseInit();
			this._cache();
		},

		_setOption: function(key, value){
			if (key === "containment"){
				if (value === null || $(value).length === 0){
					this.options.containment = null
				}else{
					this.options.containment = $(value);
				}
			}
		},

		/*
		 * UI mouse widget
		 */

		_mouseStart: function(event){
			this._cache();
			this.cache.click = {
					left: event.pageX,
					top: event.pageY
			};

			this.cache.initialOffset = this.element.offset();

			this._triggerMouseEvent("mousestart");

			return true;
		},

		_mouseDrag: function(event){
			var position = event.pageX - this.cache.click.left;

			position = this._constraintPosition(position + this.cache.initialOffset.left);

			this._applyPosition(position);

			this._triggerMouseEvent("sliderDrag");

			return false;
		},

		_mouseStop: function(){
			this._triggerMouseEvent("stop");
		},

		/*
		 * To be overriden
		 */

		_constraintPosition: function(position){
			if (this.element.parent().length !== 0 && this.cache.parent.offset !== null){
				position = Math.min(position, 
					this.cache.parent.offset.left + this.cache.parent.width - this.cache.width.outer);
				position = Math.max(position, this.cache.parent.offset.left);
			}

			return position;
		},

		_applyPosition: function(position){
			var offset = {
				top: this.cache.offset.top,
				left: position
			}

			this.element.offset({left:position});

			this.cache.offset = offset;
		},

		/*
		 * Private utils
		 */

		_cacheIfNecessary: function(){
			if (this.cache === null){
				this._cache();
			}
		},

		_cache: function(){
			this.cache = {};

			this._cacheMargins();
			this._cacheParent();
			this._cacheDimensions();

			this.cache.offset = this.element.offset();
		},

		_cacheMargins: function(){
			this.cache.margin = {
				left: this._parsePixels(this.element, "marginLeft"),
				right: this._parsePixels(this.element, "marginRight"),
				top: this._parsePixels(this.element, "marginTop"),
				bottom: this._parsePixels(this.element, "marginBottom")
			};
		},

		_cacheParent: function(){
			if (this.options.parent !== null){
				var container = this.element.parent();

				this.cache.parent = {
					offset: container.offset(),
					width: container.width()
				}
			}else{
				this.cache.parent = null;
			}
		},

		_cacheDimensions: function(){
			this.cache.width = {
				outer: this.element.outerWidth(),
				inner: this.element.width()
			}
		},

		_parsePixels: function(element, string){
			return parseInt(element.css(string), 10) || 0;
		},

		_triggerMouseEvent: function(event){
			var data = this._prepareEventData();

			this.element.trigger(event, data);
		},

		_prepareEventData: function(){
			return {
				element: this.element,
				offset: this.cache.offset || null
			};
		}
	});

}(jQuery));
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderHandle.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


 (function($, undefined){
	"use strict";

	$.widget("ui.rangeSliderHandle", $.ui.rangeSliderDraggable, {
		currentMove: null,
		margin: 0,
		parentElement: null,

		options: {
			isLeft: true,
			bounds: {min:0, max:100},
			range: false,
			value: 0,
			step: false
		},

		_value: 0,
		_left: 0,

		_create: function(){
			$.ui.rangeSliderDraggable.prototype._create.apply(this);

			this.element
				.css("position", "absolute")
				.css("top", 0)
				.addClass("ui-rangeSlider-handle")
				.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft)
				.toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft);

			this.element.append("<div class='ui-rangeSlider-handle-inner' />");

			this._value = this._constraintValue(this.options.value);
		},

		destroy: function(){
			this.element.empty();	

			$.ui.rangeSliderDraggable.prototype.destroy.apply(this);			
		},

		_setOption: function(key, value){
			if (key === "isLeft" && (value === true || value === false) && value !== this.options.isLeft){
				this.options.isLeft = value;

				this.element
					.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft)
					.toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft);

				this._position(this._value);

				this.element.trigger("switch", this.options.isLeft);
			} else if (key === "step" && this._checkStep(value)){
				this.options.step = value;
				this.update();
			} else if (key === "bounds"){
				this.options.bounds = value;
				this.update();
			}else if (key === "range" && this._checkRange(value)){
				this.options.range = value;
				this.update();
			}else if (key === "symmetricPositionning"){
				this.options.symmetricPositionning = value === true;
				this.update();
			}

			$.ui.rangeSliderDraggable.prototype._setOption.apply(this, [key, value]);
		},

		_checkRange: function(range){
			return range === false || (!this._isValidValue(range.min) && !this._isValidValue(range.max));
		},

		_isValidValue: function(value){
			return typeof value !== "undefined" && value !== false && parseFloat(value) !== value;
		},

		_checkStep: function(step){
			return (step === false || parseFloat(step) === step);
		},

		_initElement: function(){
			$.ui.rangeSliderDraggable.prototype._initElement.apply(this);
			
			if (this.cache.parent.width === 0 || this.cache.parent.width === null){
				setTimeout($.proxy(this._initElementIfNotDestroyed, this), 500);
			}else{
				this._position(this._value);
				this._triggerMouseEvent("initialize");
			}
		},

		_bounds: function(){
			return this.options.bounds;
		},

		/*
		 * From draggable
		 */

		_cache: function(){
			$.ui.rangeSliderDraggable.prototype._cache.apply(this);

			this._cacheParent();
		},

		_cacheParent: function(){
			var parent = this.element.parent();

			this.cache.parent = {
				element: parent,
				offset: parent.offset(),
				padding: {
					left: this._parsePixels(parent, "paddingLeft")
				},
				width: parent.width()
			}
		},

		_position: function(value){
			var left = this._getPositionForValue(value);

			this._applyPosition(left);
		},

		_constraintPosition: function(position){
			var value = this._getValueForPosition(position);

			return this._getPositionForValue(value);
		},

		_applyPosition: function(left){
			$.ui.rangeSliderDraggable.prototype._applyPosition.apply(this, [left]);

			this._left = left;
			this._setValue(this._getValueForPosition(left));
			this._triggerMouseEvent("moving");
		},

		_prepareEventData: function(){
			var data = $.ui.rangeSliderDraggable.prototype._prepareEventData.apply(this);

			data.value = this._value;

			return data;
		},

		/*
		 * Value
		 */
		_setValue: function(value){
			if (value !== this._value){
				this._value = value;
			}
		},

		_constraintValue: function(value){
			value = Math.min(value, this._bounds().max);
			value = Math.max(value, this._bounds().min);
		
			value = this._round(value);

			if (this.options.range !== false){
				var min = this.options.range.min || false,
					max = this.options.range.max || false;

				if (min !== false){
					value = Math.max(value, this._round(min));
				}

				if (max !== false){
					value = Math.min(value, this._round(max));
				}

				value = Math.min(value, this._bounds().max);
				value = Math.max(value, this._bounds().min);
			}

			return value;
		},

		_round: function(value){
			if (this.options.step !== false && this.options.step > 0){
				return Math.round(value / this.options.step) * this.options.step;
			}

			return value;
		},

		_getPositionForValue: function(value){
			if (!this.cache || !this.cache.parent || this.cache.parent.offset === null){
				return 0;
			}

			value = this._constraintValue(value);

			var ratio = (value - this.options.bounds.min) / (this.options.bounds.max - this.options.bounds.min),
				availableWidth = this.cache.parent.width,
				parentPosition = this.cache.parent.offset.left,
				shift = this.options.isLeft ? 0 : this.cache.width.outer;


			if (!this.options.symmetricPositionning){
				return ratio * availableWidth + parentPosition - shift;
			}

			return ratio * (availableWidth - 2 * this.cache.width.outer) + parentPosition + shift;
		},

		_getValueForPosition: function(position){
			var raw = this._getRawValueForPositionAndBounds(position, this.options.bounds.min, this.options.bounds.max);

			return this._constraintValue(raw);
		},

		_getRawValueForPositionAndBounds: function(position, min, max){

			var parentPosition =  this.cache.parent.offset === null ? 0 : this.cache.parent.offset.left,
					availableWidth,
					ratio;

			if (this.options.symmetricPositionning){
				position -= this.options.isLeft ? 0 : this.cache.width.outer;	
				availableWidth = this.cache.parent.width - 2 * this.cache.width.outer;
			}else{
				position += this.options.isLeft ? 0 : this.cache.width.outer;	
				availableWidth = this.cache.parent.width;
			}

			if (availableWidth === 0){
				return this._value;
			}

			ratio = (position - parentPosition) / availableWidth;

			return	ratio * (max - min) + min;
		},

		/*
		 * Public
		 */

		value: function(value){
			if (typeof value !== "undefined"){
				this._cache();

				value = this._constraintValue(value);

				this._position(value);
			}

			return this._value;
		},

		update: function(){
			this._cache();
			var value = this._constraintValue(this._value),
				position = this._getPositionForValue(value);

			if (value !== this._value){
				this._triggerMouseEvent("updating");
				this._position(value);
				this._triggerMouseEvent("update");
			}else if (position !== this.cache.offset.left){
				this._triggerMouseEvent("updating");
				this._position(value);
				this._triggerMouseEvent("update");
			}
		},

		position: function(position){
			if (typeof position !== "undefined"){
				this._cache();
				
				position = this._constraintPosition(position);
				this._applyPosition(position);
			}

			return this._left;
		},

		add: function(value, step){
			return value + step;
		},

		substract: function(value, step){
			return value - step;
		},

		stepsBetween: function(val1, val2){
			if (this.options.step === false){
				return val2 - val1;
			}

			return (val2 - val1) / this.options.step;
		},

		multiplyStep: function(step, factor){
			return step * factor;
		},

		moveRight: function(quantity){
			var previous;

			if (this.options.step === false){
				previous = this._left;
				this.position(this._left + quantity);

				return this._left - previous;
			}
			
			previous = this._value;
			this.value(this.add(previous, this.multiplyStep(this.options.step, quantity)));

			return this.stepsBetween(previous, this._value);
		},

		moveLeft: function(quantity){
			return -this.moveRight(-quantity);
		},

		stepRatio: function(){
			if (this.options.step === false){
				return 1;
			}else{
				var steps = (this.options.bounds.max - this.options.bounds.min) / this.options.step;
				return this.cache.parent.width / steps;
			}
		}
	});
 }(jQuery));

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderLabel.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function($, undefined){
	
	"use strict";

	$.widget("ui.rangeSliderLabel", $.ui.rangeSliderMouseTouch, {
		options: {
			handle: null,
			formatter: false,
			handleType: "rangeSliderHandle",
			show: "show",
			durationIn: 0,
			durationOut: 500,
			delayOut: 500,
			isLeft: false
		},

		cache: null,
		_positionner: null,
		_valueContainer:null,
		_innerElement:null,
		_value: null,

		_create: function(){
			this.options.isLeft = this._handle("option", "isLeft");

			this.element
				.addClass("ui-rangeSlider-label")
				.css("position", "absolute")
				.css("display", "block");

			this._createElements();

			this._toggleClass();

			this.options.handle
				.bind("moving.label", $.proxy(this._onMoving, this))
				.bind("update.label", $.proxy(this._onUpdate, this))
				.bind("switch.label", $.proxy(this._onSwitch, this));

			if (this.options.show !== "show"){
				this.element.hide();
			}

			this._mouseInit();
		},

		destroy: function(){
			this.options.handle.unbind(".label");
			this.options.handle = null;

			this._valueContainer = null;
			this._innerElement = null;
			this.element.empty();

			if (this._positionner) {
				this._positionner.Destroy();
				this._positionner = null;
			}

			$.ui.rangeSliderMouseTouch.prototype.destroy.apply(this);
		},

		_createElements: function(){
			this._valueContainer = $("<div class='ui-rangeSlider-label-value' />")
				.appendTo(this.element);

			this._innerElement = $("<div class='ui-rangeSlider-label-inner' />")
				.appendTo(this.element);
		},

		_handle: function(){
			var args = Array.prototype.slice.apply(arguments);

			return this.options.handle[this.options.handleType].apply(this.options.handle, args);
		},

		_setOption: function(key, value){
			if (key === "show"){
				this._updateShowOption(value);
			} else if (key === "durationIn" || key === "durationOut" || key === "delayOut"){
				this._updateDurations(key, value);
			}

			this._setFormatterOption(key, value);
		},

		_setFormatterOption: function(key, value){
			if (key === "formatter"){
				if (typeof value === "function" || value === false){
					this.options.formatter = value;
					this._display(this._value);
				}
			}
		},

		_updateShowOption: function(value){
			this.options.show = value;

			if (this.options.show !== "show"){
				this.element.hide();
				this._positionner.moving = false;
			}else{
				this.element.show();
				this._display(this.options.handle[this.options.handleType]("value"));
				this._positionner.PositionLabels();
			}
			
			this._positionner.options.show = this.options.show;
		},

		_updateDurations: function(key, value){
			if (parseInt(value, 10) !== value) return;

			this._positionner.options[key] = value;
			this.options[key] = value;
		},

		_display: function(value){
			if (this.options.formatter === false){
				this._displayText(Math.round(value));
			}else{
				this._displayText(this.options.formatter(value));
			}

			this._value = value;
		},

		_displayText: function(text){
			this._valueContainer.text(text);
		},

		_toggleClass: function(){
			this.element.toggleClass("ui-rangeSlider-leftLabel", this.options.isLeft)
				.toggleClass("ui-rangeSlider-rightLabel", !this.options.isLeft);
		},

		_positionLabels: function(){
			this._positionner.PositionLabels();
		},

		/*
		 * Mouse touch redirection
		 */
		_mouseDown: function(event){
			this.options.handle.trigger(event);
		},

		_mouseUp: function(event){
			this.options.handle.trigger(event);
		},

		_mouseMove: function(event){
			this.options.handle.trigger(event);
		},

		/*
		 * Event binding
		 */
		_onMoving: function(event, ui){
			this._display(ui.value);
		},

		_onUpdate: function(){
			if (this.options.show === "show"){
				this.update();
			}
		},

		_onSwitch: function(event, isLeft){
			this.options.isLeft = isLeft;
			
			this._toggleClass();
			this._positionLabels();
		},

		/*
		 * Label pair
		 */
		pair: function(label){
			if (this._positionner !== null) return;

			this._positionner = new LabelPositioner(this.element, label, this.widgetName, {
				show: this.options.show,
				durationIn: this.options.durationIn,
				durationOut: this.options.durationOut,
				delayOut: this.options.delayOut
			});

			label[this.widgetName]("positionner", this._positionner);
		},

		positionner: function(pos){
			if (typeof pos !== "undefined"){
				this._positionner = pos;
			}

			return this._positionner;
		},

		update: function(){
			this._positionner.cache = null;
			this._display(this._handle("value"));

			if (this.options.show === "show"){
				this._positionLabels();
			}
		}
	});

	function LabelPositioner(label1, label2, type, options){
		/*jshint maxstatements:40 */

		this.label1 = label1;
		this.label2 = label2;
		this.type = type;
		this.options = options;
		this.handle1 = this.label1[this.type]("option", "handle");
		this.handle2 = this.label2[this.type]("option", "handle");
		this.cache = null;
		this.left = label1;
		this.right = label2;
		this.moving = false;
		this.initialized = false;
		this.updating = false;

		this.Init = function(){
			this.BindHandle(this.handle1);
			this.BindHandle(this.handle2);

			if (this.options.show === "show"){
				setTimeout($.proxy(this.PositionLabels, this), 1);
				this.initialized = true;
			}else{
				setTimeout($.proxy(this.AfterInit, this), 1000);
			}

			this._resizeProxy = $.proxy(this.onWindowResize, this);

			$(window).resize(this._resizeProxy);
		}

		this.Destroy = function(){
			if (this._resizeProxy){
				$(window).unbind("resize", this._resizeProxy);
				this._resizeProxy = null;

				this.handle1.unbind(".positionner");
				this.handle1 = null;

				this.handle2.unbind(".positionner");
				this.handle2 = null;

				this.label1 = null;
				this.label2 = null;
				this.left = null;
				this.right = null;
			}
			
			this.cache = null;			
		}

		this.AfterInit = function () {
			this.initialized = true;
		}

		this.Cache = function(){
			if (this.label1.css("display") === "none"){
				return;
			}

			this.cache = {};
			this.cache.label1 = {};
			this.cache.label2 = {};
			this.cache.handle1 = {};
			this.cache.handle2 = {};
			this.cache.offsetParent = {};

			this.CacheElement(this.label1, this.cache.label1);
			this.CacheElement(this.label2, this.cache.label2);
			this.CacheElement(this.handle1, this.cache.handle1);
			this.CacheElement(this.handle2, this.cache.handle2);
			this.CacheElement(this.label1.offsetParent(), this.cache.offsetParent);
		}

		this.CacheIfNecessary = function(){
			if (this.cache === null){
				this.Cache();
			}else{
				this.CacheWidth(this.label1, this.cache.label1);
				this.CacheWidth(this.label2, this.cache.label2);
				this.CacheHeight(this.label1, this.cache.label1);
				this.CacheHeight(this.label2, this.cache.label2);
				this.CacheWidth(this.label1.offsetParent(), this.cache.offsetParent);
			}
		}

		this.CacheElement = function(label, cache){
			this.CacheWidth(label, cache);
			this.CacheHeight(label, cache);

			cache.offset = label.offset();
			cache.margin = {
				left: this.ParsePixels("marginLeft", label),
				right: this.ParsePixels("marginRight", label)
			};

			cache.border = {
				left: this.ParsePixels("borderLeftWidth", label),
				right: this.ParsePixels("borderRightWidth", label)
			};
		}

		this.CacheWidth = function(label, cache){
			cache.width = label.width();
			cache.outerWidth = label.outerWidth();
		}

		this.CacheHeight = function(label, cache){
			cache.outerHeightMargin = label.outerHeight(true);
		}

		this.ParsePixels = function(name, element){
			return parseInt(element.css(name), 10) || 0;
		}

		this.BindHandle = function(handle){
			handle.bind("updating.positionner", $.proxy(this.onHandleUpdating, this));
			handle.bind("update.positionner", $.proxy(this.onHandleUpdated, this));
			handle.bind("moving.positionner", $.proxy(this.onHandleMoving, this));
			handle.bind("stop.positionner", $.proxy(this.onHandleStop, this));
		}

		this.PositionLabels = function(){
			this.CacheIfNecessary();

			if (this.cache === null){
				return;
			}

			var label1Pos = this.GetRawPosition(this.cache.label1, this.cache.handle1),
				label2Pos = this.GetRawPosition(this.cache.label2, this.cache.handle2);

			if (this.label1[type]("option", "isLeft")){
				this.ConstraintPositions(label1Pos, label2Pos);
			}else{
				this.ConstraintPositions(label2Pos, label1Pos);
			}

			this.PositionLabel(this.label1, label1Pos.left, this.cache.label1);
			this.PositionLabel(this.label2, label2Pos.left, this.cache.label2);
		}

		this.PositionLabel = function(label, leftOffset, cache){
			var parentShift = this.cache.offsetParent.offset.left + this.cache.offsetParent.border.left,
					parentRightPosition,
					labelRightPosition,
					rightPosition;

			if ((parentShift - leftOffset) >= 0){
				label.css("right", "");
				label.offset({left: leftOffset});
			}else{
				parentRightPosition = parentShift + this.cache.offsetParent.width;
				labelRightPosition = leftOffset + cache.margin.left + cache.outerWidth + cache.margin.right;
				rightPosition = parentRightPosition - labelRightPosition;

				label.css("left", "");
				label.css("right", rightPosition);
			}
		}

		this.ConstraintPositions = function(pos1, pos2){
			if ((pos1.center < pos2.center && pos1.outerRight > pos2.outerLeft) || (pos1.center > pos2.center && pos2.outerRight > pos1.outerLeft)){
				pos1 = this.getLeftPosition(pos1, pos2);
				pos2 = this.getRightPosition(pos1, pos2);
			}
		}

		this.getLeftPosition = function(left, right){
			var center = (right.center + left.center) / 2,
				leftPos = center - left.cache.outerWidth - left.cache.margin.right + left.cache.border.left;

			left.left = leftPos;

			return left;
		}

		this.getRightPosition = function(left, right){
			var center = (right.center + left.center) / 2;

			right.left = center + right.cache.margin.left + right.cache.border.left;

			return right;
		}

		this.ShowIfNecessary = function(){
			if (this.options.show === "show" || this.moving || !this.initialized || this.updating) return;

			this.label1.stop(true, true).fadeIn(this.options.durationIn || 0);
			this.label2.stop(true, true).fadeIn(this.options.durationIn || 0);
			this.moving = true;
		}

		this.HideIfNeeded = function(){
			if (this.moving === true){
				this.label1.stop(true, true).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0);
				this.label2.stop(true, true).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0);
				this.moving = false;
			}
		}

		this.onHandleMoving = function(event, ui){
			this.ShowIfNecessary();
			this.CacheIfNecessary();
			this.UpdateHandlePosition(ui);

			this.PositionLabels();
		}

		this.onHandleUpdating = function(){
			this.updating = true;
		}

		this.onHandleUpdated = function(){
			this.updating = false;
			this.cache = null;
		}

		this.onHandleStop = function(){
			this.HideIfNeeded();
		}

		this.onWindowResize = function(){
				this.cache = null;
		}

		this.UpdateHandlePosition = function(ui){
			if (this.cache === null) return;
			
			if (ui.element[0] === this.handle1[0]){
				this.UpdatePosition(ui, this.cache.handle1);
			}else{
				this.UpdatePosition(ui, this.cache.handle2);
			}
		}

		this.UpdatePosition = function(element, cache){
			cache.offset = element.offset;
			cache.value = element.value;
		}

		this.GetRawPosition = function(labelCache, handleCache){
			var handleCenter = handleCache.offset.left + handleCache.outerWidth / 2,
				labelLeft = handleCenter - labelCache.outerWidth / 2,
				labelRight = labelLeft + labelCache.outerWidth - labelCache.border.left - labelCache.border.right,
				outerLeft = labelLeft - labelCache.margin.left - labelCache.border.left,
				top = handleCache.offset.top - labelCache.outerHeightMargin;

			return {
				left: labelLeft,
				outerLeft: outerLeft,
				top: top,
				right: labelRight,
				outerRight: outerLeft + labelCache.outerWidth + labelCache.margin.left + labelCache.margin.right,
				cache: labelCache,
				center: handleCenter
			}
		}

		this.Init();
	}

}(jQuery));



},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderMouseTouch.js":[function(require,module,exports){
/**
 * jQRangeSlider
 * A javascript slider selector that supports dates
 *
 * Copyright (C) Guillaume Gautreau 2012
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

(function($, undefined){

	"use strict";

	$.widget("ui.rangeSliderMouseTouch", $.ui.mouse, {
		enabled: true,

		_mouseInit: function(){
			var that = this;
			$.ui.mouse.prototype._mouseInit.apply(this);
			this._mouseDownEvent = false;

			this.element.bind('touchstart.' + this.widgetName, function(event) {
				return that._touchStart(event);
			});
		},

		_mouseDestroy: function(){
			$(document)
				.unbind('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.unbind('touchend.' + this.widgetName, this._touchEndDelegate);
			
			$.ui.mouse.prototype._mouseDestroy.apply(this);
		},

		enable: function(){
			this.enabled = true;
		},

		disable: function(){
			this.enabled = false;
		},

		destroy: function(){
			this._mouseDestroy();
			
			$.ui.mouse.prototype.destroy.apply(this);

			this._mouseInit = null;
		},

		_touchStart: function(event){
			if (!this.enabled) return false;

			event.which = 1;
			event.preventDefault();

			this._fillTouchEvent(event);

			var that = this,
				downEvent = this._mouseDownEvent;

			this._mouseDown(event);

			if (downEvent !== this._mouseDownEvent){

				this._touchEndDelegate = function(event){
					that._touchEnd(event);
				}

				this._touchMoveDelegate = function(event){
					that._touchMove(event);
				}

				$(document)
				.bind('touchmove.' + this.widgetName, this._touchMoveDelegate)
				.bind('touchend.' + this.widgetName, this._touchEndDelegate);
			}
		},

		_mouseDown: function(event){
			if (!this.enabled) return false;

			return $.ui.mouse.prototype._mouseDown.apply(this, [event]);
		},

		_touchEnd: function(event){
			this._fillTouchEvent(event);
			this._mouseUp(event);

			$(document)
			.unbind('touchmove.' + this.widgetName, this._touchMoveDelegate)
			.unbind('touchend.' + this.widgetName, this._touchEndDelegate);

		this._mouseDownEvent = false;

		// No other choice to reinitialize mouseHandled
		$(document).trigger("mouseup");
		},

		_touchMove: function(event){
			event.preventDefault();
			this._fillTouchEvent(event);

			return this._mouseMove(event);
		},

		_fillTouchEvent: function(event){
			var touch;

			if (typeof event.targetTouches === "undefined" && typeof event.changedTouches === "undefined"){
				touch = event.originalEvent.targetTouches[0] || event.originalEvent.changedTouches[0];
			} else {
				touch = event.targetTouches[0] || event.changedTouches[0];
			}

			event.pageX = touch.pageX;
			event.pageY = touch.pageY;
		}
	});
}(jQuery));
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jquery-colorbox/jquery.colorbox-min.js":[function(require,module,exports){
/*!
	Colorbox v1.5.9 - 2014-04-25
	jQuery lightbox and modal window plugin
	(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(z+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in x[0]&&!x[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),x.focus())}function c(t){c.str!==t&&(x.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){z=0,e&&e!==!1?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),z=W.index(_.el),-1===z&&(W=W.add(_.el),z=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data("colorbox"),_=new r(i,o),g(_.get("rel")),!$){$=q=!0,c(_.get("className")),x.css({visibility:"hidden",display:"block",opacity:""}),L=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(L),D=T.height()+k.height()+b.outerHeight(!0)-b.height(),j=C.width()+H.width()+b.outerWidth(!0)-b.width(),A=L.outerHeight(!0),N=L.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=(l!==!1?Math.min(h,a(l,"x")):h)-N-j,_.h=(f!==!1?Math.min(s,a(f,"y")):s)-A-D,L.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(I).hide(),x.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}v.css({opacity:parseFloat(_.get("opacity"))||"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){!x&&e.body&&(V=!1,E=t(i),x=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),S=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),y=n(se,"Wrapper"),b=n(se,"Content").append(I=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),F=n("button","Slideshow"),S),B=t('<button type="button"/>').attr({id:Z+"Close"}),y.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(F),t(e.body).append(v,x.append(y,M)))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return x?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;$&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),$&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if(q=!0,U=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-A-D:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-N-j:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-N-j,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-A-D,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){S.show()},100),_.get("inline")){var c=t(e);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),U=new Image,t(U).addClass(Z+"Photo").bind("error",function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;t.each(["alt","longdesc","aria-describedby"],function(e,i){var n=t(_.el).attr(i)||t(_.el).attr("data-"+i);n&&U.setAttribute(i,n)}),_.get("retinaImage")&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){U.height-=U.height*e,U.width-=U.width*e},_.mw&&U.width>_.mw&&(e=(U.width-_.mw)/U.width,o()),_.mh&&U.height>_.mh&&(e=(U.height-_.mh)/U.height,o())),_.h&&(U.style.marginTop=Math.max(_.mh-U.height,0)/2+"px"),W[1]&&(_.get("loop")||W[z+1])&&(U.style.cursor="pointer",U.onclick=function(){J.next()}),U.style.width=U.width+"px",U.style.height=U.height+"px",h(U)},1)}),U.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,x,y,b,T,C,H,k,W,E,L,M,S,I,R,F,K,P,B,O,_,D,j,A,N,z,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[z+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){F.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),x.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),F.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),x.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,F.hide(),t(),ae.unbind(ne,e).unbind(ie,t),x.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),F.show())}}();t.colorbox||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;if(e=e||{},t.isFunction(o))o=t("<a/>"),e.open=!0;else if(!o[0])return o;return o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(x[0].style.width,10)-j+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(x[0].style.height,10)-D+"px"}var r,h,s,l=0,d=0,c=x.offset();if(E.unbind("resize."+Z),x.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,x.css({position:"fixed"})):(l=h,d=s,x.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-N-j-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-N-j,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-A-D-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-A-D,0)/2),x.css({top:c.top,left:c.left,visibility:"visible"}),y[0].style.width=y[0].style.height="9999px",r={width:_.w+N+j,height:_.h+A+D,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||x.css(r),x.dequeue().animate(r,{duration:e||0,complete:function(){n(),q=!1,y[0].style.width=_.w+N+j+"px",y[0].style.height=_.h+A+D+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),i&&i()},step:n})},J.resize=function(t){var e;$&&(t=t||{},t.width&&(_.w=a(t.width,"x")-N-j),t.innerWidth&&(_.w=a(t.innerWidth,"x")),L.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-A-D),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=L.scrollTop(),L.css({height:"auto"}),_.h=L.height()),L.css({height:_.h}),e&&L.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||L.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||L.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if($){var d,g="none"===_.get("transition")?0:_.get("speed");L.remove(),L=n(se,"LoadedContent").append(i),L.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(U).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&x[0].style.removeAttribute("filter")}var n,o,a=W.length;$&&(o=function(){clearTimeout(Q),S.hide(),u(ne),_.get("onComplete")},I.html(_.get("title")).show(),L.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",z+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>z?"show":"hide"]().html(_.get("next")),P[_.get("loop")||z?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=e.createElement("iframe"),"frameBorder"in n&&(n.frameBorder=0),"allowTransparency"in n&&(n.allowTransparency="true"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),name:(new Date).getTime(),"class":Z+"Iframe",allowFullScreen:!0}).one("load",o).appendTo(L),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?x.fadeTo(g,1,i):i())},"fade"===_.get("transition")?x.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!q&&W[1]&&(_.get("loop")||W[z+1])&&(z=h(1),f(W[z]))},J.prev=function(){!q&&W[1]&&(_.get("loop")||z)&&(z=h(-1),f(W[z]))},J.close=function(){$&&!G&&(G=!0,$=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),x.stop().fadeTo(_.get("fadeOut")||0,0,function(){x.hide(),v.hide(),u(he),L.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){x&&(x.stop(),t.colorbox.close(),x.stop().remove(),v.remove(),G=!1,x=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jquery.scrollTo/jquery.scrollTo.min.js":[function(require,module,exports){
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.12
 */
;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}};return j}));

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-active-area/src/L.activearea.js":[function(require,module,exports){
if (typeof leafletActiveAreaPreviousMethods === 'undefined') {
    // Defining previously that object allows you to use that plugin even if you have overridden L.map
    leafletActiveAreaPreviousMethods = {
        getCenter: L.Map.prototype.getCenter,
        setView: L.Map.prototype.setView,
        setZoomAround: L.Map.prototype.setZoomAround,
        getBoundsZoom: L.Map.prototype.getBoundsZoom
    };
}


L.Map.include({
    getViewport: function() {
        return this._viewport;
    },

    getViewportBounds: function() {
        var vp = this._viewport,
            topleft = L.point(vp.offsetLeft, vp.offsetTop),
            vpsize = L.point(vp.clientWidth, vp.clientHeight);

        if (vpsize.x === 0 || vpsize.y === 0) {
            if (window.console) {
                console.error('The viewport has no size. Check your CSS.');
            }
        }

        return L.bounds(topleft, topleft.add(vpsize));
    },

    getViewportLatLngBounds: function() {
        var bounds = this.getViewportBounds();
        return L.latLngBounds(this.containerPointToLatLng(bounds.min), this.containerPointToLatLng(bounds.max));
    },

    getOffset: function() {
        var mCenter = this.getSize().divideBy(2),
            vCenter = this.getViewportBounds().getCenter();

        return mCenter.subtract(vCenter);
    },

    getCenter: function () {
        var center = leafletActiveAreaPreviousMethods.getCenter.call(this);

        if (this.getViewport()) {
            var zoom = this.getZoom(),
                point = this.project(center, zoom);
            point = point.subtract(this.getOffset());

            center = this.unproject(point, zoom);
        }

        return center;
    },

    setView: function (center, zoom, options) {
        center = L.latLng(center);

        if (this.getViewport()) {
            var point = this.project(center, zoom);
            point = point.add(this.getOffset());
            center = this.unproject(point, zoom);
        }

        return leafletActiveAreaPreviousMethods.setView.call(this, center, zoom, options);
    },

    setZoomAround: function (latlng, zoom, options) {
        var vp = this.getViewport();

        if (vp) {
            var scale = this.getZoomScale(zoom),
                viewHalf = this.getViewportBounds().getCenter(),
                containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

                centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
                newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

            return this.setView(newCenter, zoom, {zoom: options});
        } else {
            return leafletActiveAreaPreviousMethods.setZoomAround.call(this, point, zoom, options);
        }
    },

    getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
        bounds = L.latLngBounds(bounds);

        var zoom = this.getMinZoom() - (inside ? 1 : 0),
            maxZoom = this.getMaxZoom(),
            vp = this.getViewport(),
            size = (vp) ? L.point(vp.clientWidth, vp.clientHeight) : this.getSize(),

            nw = bounds.getNorthWest(),
            se = bounds.getSouthEast(),

            zoomNotFound = true,
            boundsSize;

        padding = L.point(padding || [0, 0]);

        do {
            zoom++;
            boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
            zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;

        } while (zoomNotFound && zoom <= maxZoom);

        if (zoomNotFound && inside) {
            return null;
        }

        return inside ? zoom : zoom - 1;
    }

});

L.Map.include({
    setActiveArea: function (css) {
        var container = this.getContainer();
        this._viewport = L.DomUtil.create('div', '');
        container.insertBefore(this._viewport, container.firstChild);

        if (typeof css === 'string') {
            this._viewport.className = css;
        } else {
            L.extend(this._viewport.style, css);
        }
        return this;
    }
});
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-plugins/layer/tile/Bing.js":[function(require,module,exports){
/* global console: true */
L.BingLayer = L.TileLayer.extend({
	options: {
		subdomains: [0, 1, 2, 3],
		type: 'Aerial',
		attribution: 'Bing',
		culture: ''
	},

	initialize: function(key, options) {
		L.Util.setOptions(this, options);

		this._key = key;
		this._url = null;
		this.meta = {};
		this.loadMetadata();
	},

	tile2quad: function(x, y, z) {
		var quad = '';
		for (var i = z; i > 0; i--) {
			var digit = 0;
			var mask = 1 << (i - 1);
			if ((x & mask) !== 0) digit += 1;
			if ((y & mask) !== 0) digit += 2;
			quad = quad + digit;
		}
		return quad;
	},

	getTileUrl: function(p, z) {
		var zoom = this._getZoomForUrl();
		var subdomains = this.options.subdomains,
			s = this.options.subdomains[Math.abs((p.x + p.y) % subdomains.length)];
		return this._url.replace('{subdomain}', s)
				.replace('{quadkey}', this.tile2quad(p.x, p.y, zoom))
				.replace('{culture}', this.options.culture);
	},

	loadMetadata: function() {
		var _this = this;
		var cbid = '_bing_metadata_' + L.Util.stamp(this);
		window[cbid] = function (meta) {
			_this.meta = meta;
			window[cbid] = undefined;
			var e = document.getElementById(cbid);
			e.parentNode.removeChild(e);
			if (meta.errorDetails) {
				if (window.console) console.log('Leaflet Bing Plugin Error - Got metadata: ' + meta.errorDetails);
				return;
			}
			_this.initMetadata();
		};
		var url = document.location.protocol + '//dev.virtualearth.net/REST/v1/Imagery/Metadata/' + this.options.type + '?include=ImageryProviders&jsonp=' + cbid +
		          '&key=' + this._key + '&UriScheme=' + document.location.protocol.slice(0, -1);
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.id = cbid;
		document.getElementsByTagName('head')[0].appendChild(script);
	},

	initMetadata: function() {
		var r = this.meta.resourceSets[0].resources[0];
		this.options.subdomains = r.imageUrlSubdomains;
		this._url = r.imageUrl;
		this._providers = [];
		if (r.imageryProviders) {
			for (var i = 0; i < r.imageryProviders.length; i++) {
				var p = r.imageryProviders[i];
				for (var j = 0; j < p.coverageAreas.length; j++) {
					var c = p.coverageAreas[j];
					var coverage = {zoomMin: c.zoomMin, zoomMax: c.zoomMax, active: false};
					var bounds = new L.LatLngBounds(
							new L.LatLng(c.bbox[0]+0.01, c.bbox[1]+0.01),
							new L.LatLng(c.bbox[2]-0.01, c.bbox[3]-0.01)
					);
					coverage.bounds = bounds;
					coverage.attrib = p.attribution;
					this._providers.push(coverage);
				}
			}
		}
		this._update();
	},

	_update: function() {
		if (this._url === null || !this._map) return;
		this._update_attribution();
		L.TileLayer.prototype._update.apply(this, []);
	},

	_update_attribution: function() {
		var bounds = this._map.getBounds();
		var zoom = this._map.getZoom();
		for (var i = 0; i < this._providers.length; i++) {
			var p = this._providers[i];
			if ((zoom <= p.zoomMax && zoom >= p.zoomMin) &&
					bounds.intersects(p.bounds)) {
				if (!p.active && this._map.attributionControl)
					this._map.attributionControl.addAttribution(p.attrib);
				p.active = true;
			} else {
				if (p.active && this._map.attributionControl)
					this._map.attributionControl.removeAttribution(p.attrib);
				p.active = false;
			}
		}
	},

	onRemove: function(map) {
		for (var i = 0; i < this._providers.length; i++) {
			var p = this._providers[i];
			if (p.active && this._map.attributionControl) {
				this._map.attributionControl.removeAttribution(p.attrib);
				p.active = false;
			}
		}
        	L.TileLayer.prototype.onRemove.apply(this, [map]);
	}
});

L.bingLayer = function (key, options) {
    return new L.BingLayer(key, options);
};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-usermarker/src/leaflet.usermarker.js":[function(require,module,exports){
/**
 * Leaflet.UserMarker v1.0
 * 
 * Author: Jonatan Heyman <http://heyman.info>
 */

(function(window) {
    var icon = L.divIcon({
        className: "leaflet-usermarker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20],
        labelAnchor: [11, -3],
        html: ''
    });
    var iconPulsing = L.divIcon({
        className: "leaflet-usermarker",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -20],
        labelAnchor: [11, -3],
        html: '<i class="pulse"></i>'
    });
    
    var iconSmall = L.divIcon({
        className: "leaflet-usermarker-small",
        iconSize: [17, 17],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
        labelAnchor: [3, -4],
        html: ''
    });
    var iconPulsingSmall = L.divIcon({
        className: "leaflet-usermarker-small",
        iconSize: [17, 17],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
        labelAnchor: [3, -4],
        html: '<i class="pulse"></i>'
    });
    var circleStyle = {
        stroke: true,
        color: "#03f",
        weight: 3,
        opacity: 0.5,
        fillOpacity: 0.15,
        fillColor: "#03f",
        clickable: false
    };

    L.UserMarker = L.Marker.extend({
        options: {
            pulsing: false,
            smallIcon: false,
            accuracy: 0,
            circleOpts: circleStyle
        },

        initialize: function(latlng, options) {
            options = L.Util.setOptions(this, options);
            
            this.setPulsing(this.options.pulsing);
            this._accMarker = L.circle(latlng, this.options.accuracy, this.options.circleOpts);
        
            // call super
            L.Marker.prototype.initialize.call(this, latlng, this.options);
        
            this.on("move", function() {
                this._accMarker.setLatLng(this.getLatLng());
            }).on("remove", function() {
                this._map.removeLayer(this._accMarker);
            });
        },
    
        setPulsing: function(pulsing) {
            this._pulsing = pulsing;
            
            if (this.options.smallIcon) {
                this.setIcon(!!this._pulsing ? iconPulsingSmall : iconSmall);
            } else {
                this.setIcon(!!this._pulsing ? iconPulsing : icon);
            }
        },
    
        setAccuracy: function(accuracy)	{
            this._accuracy = accuracy;
            if (!this._accMarker) {
                this._accMarker = L.circle(this._latlng, accuracy, this.options.circleOpts).addTo(this._map);
            } else {
                this._accMarker.setRadius(accuracy);
            }
        },
    
        onAdd: function(map) {
            // super
            L.Marker.prototype.onAdd.call(this, map);
            this._accMarker.addTo(map);
        }
    });

    L.userMarker = function (latlng, options) {
        return new L.UserMarker(latlng, options);
    };
})(window);

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartocss.js":[function(require,module,exports){
var defaultCartoCSS = '#lots{ polygon-fill: #000; polygon-opacity: 0.75; line-color: #000; line-width: 0.5; line-opacity: 0.75; [zoom < 14] { line-width: 1; } }';
var nightmodeCartoCSS = '#lots{ polygon-fill: #FFF; polygon-opacity: 0.75; line-color: #FFF; line-width: 0.5; line-opacity: 0.75; [zoom < 14] { line-width: 1; } }';
var highlightedLotCartoCSS = 'polygon-fill: #CFA470;' +
    '[zoom <= 12] { line-width: 5; line-color: #CFA470; }' +
    '[zoom <= 14] { line-width: 3; line-color: #CFA470; }';
var highlightedPlanCartoCSS = 'polygon-fill: #F9EF6C;';


module.exports = {

    cartocss: function (opts) {
        opts = opts || {};
        var cartocss = defaultCartoCSS;

        // Choose day / night mode
        if (opts.mode && opts.mode === 'nightmode') {
            cartocss = nightmodeCartoCSS;
        }

        // Highlight plan
        if (opts.plan) {
            var planSelector = 'plan_name="' + opts.plan + '"';
            // Work around plans with # in their name by using regex matches.
            // Putting # in a CartoCSS selector breaks CartoDB.
            if (opts.plan.indexOf('#') > 0) {
                planSelector = 'plan_name=~"' + opts.plan.replace(/\#/g, '.') + '"';
            }
            cartocss += '#lots[' + planSelector + ']{' +
                highlightedPlanCartoCSS +
            '}';
        }

        // Filters
        var selector = '#lots';

        if (opts.dispositions && opts.dispositions.length > 0) {
            selector += _.map(opts.dispositions, function (disposition) {
                return '[disposition_filterable=~".*' + disposition + '.*"]';
            }).join('');
        }
        if (opts.public_vacant && opts.public_vacant === true) {
            selector += '[in_596=true]';
        }

        // Only add the highlighted CartoCSS if there are things to highlight
        if (selector !== '#lots') {
            cartocss += selector + '{' + highlightedLotCartoCSS + '}';
        }

        return cartocss;
    }

};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js":[function(require,module,exports){
var sqlApiBase = 'http://urbanreviewer.cartodb.com/api/v2/sql/';

function getSqlUrl(sql) {
    return sqlApiBase + '?q=' + encodeURIComponent(sql);
}

module.exports = {

    sqlApiBase: sqlApiBase,

    getGeoJSON: function (sql, success) {
        return $.get(getSqlUrl(sql) + '&format=GeoJSON', success);
    },

    getJSON: function (sql, success) {
        return $.get(getSqlUrl(sql), success);
    },

    getSqlUrl: getSqlUrl

};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/filters.js":[function(require,module,exports){
var plansmap = require('./plansmap');

var eventEmitter = $({});
var state = {};

var minYear = 1952,
    maxYear = 2014;

var $active,
    $dateRange,
    $expired,
    $lastUpdated,
    $mayors;

function resetActive() {
    if (!$active) { return; }
    $active
        .prop('checked', false)
        .trigger('change');
}

function resetExpired() {
    if (!$expired) { return; }
    $expired
        .prop('checked', false)
        .trigger('change');
}

function resetLastUpdated() {
    if (!$lastUpdated) { return; }
    $lastUpdated
        .val('')
        .trigger('change');
}

function resetMayors() {
    if (!$mayors) { return; }
    $mayors
        .val('')
        .trigger('change');
}

/*
 * Remove useless / default properties from the state.
 */
function cleanState(state) {
    var cleaned = {};
    _.each(state, function (value, key) {
        if (!value || 
            (key === 'end' && value === maxYear) ||
            (key === 'start' && value === minYear)) {
            return;
        }
        else {
            cleaned[key] = value;
        }
    });   
    return cleaned;
}

function updateState(changes) {
    _.extend(state, changes);
    state = cleanState(state);
    eventEmitter.trigger('change', state);
}

module.exports = {
    minYear: minYear,
    maxYear: maxYear,

    init: function (options, overrideState) {
        options = options || {};
        state = overrideState || {};

        if (options.dateRange) {
            var min = new Date(minYear, 0, 1),
                max = new Date(maxYear, 0, 1),
                defaultMin = min,
                defaultMax = max;
            if (state.start) {
                defaultMin = new Date(state.start, 0, 1);
            }
            if (state.end) {
                defaultMax = new Date(state.end, 0, 1);
            }
            $dateRange = $(options.dateRange);
            $dateRange
                .dateRangeSlider({
                    arrows: false,
                    defaultValues: {
                        min: defaultMin,
                        max: defaultMax
                    },
                    bounds: {
                        min: min,
                        max: max
                    },
                    formatter: function (value) {
                        return value.getFullYear();
                    },
                    step: { years: 1 }
                })
                .bind('valuesChanged', function (e, data) {
                    var start = data.values.min.getFullYear(),
                        end = data.values.max.getFullYear();
                    plansmap.filterLotsLayer({ start: start, end: end });
                    updateState({ start: start, end: end });
                });
        }

        if (options.mayors && options.dateRange) {
            $mayors = $(options.mayors);
            $mayors.change(function () {
                var mayor = $(this).find(':selected'),
                    start = parseInt(mayor.data('start')),
                    end = parseInt(mayor.data('end'));
                updateState({ mayor: mayor.val(), start: start, end: end });
                // Date range slider takes care of filtering here
                $(options.dateRange).dateRangeSlider(
                    'values',
                    new Date(start, 0, 1),
                    new Date(end, 0, 1)
                );
            });

            if (state.mayor) {
                $mayors.val(state.mayor).trigger('change');
            }
        }

        if (options.active) {
            $active = $(options.active);
            $active
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ active: checked });
                    plansmap.filterLotsLayer({ active: checked }, true);
                })
                .prop('checked', state.active)
                .trigger('change');
        }

        if (options.expired) {
            $expired = $(options.expired);
            $expired
                .change(function () {
                    var checked = $(this).is(':checked');
                    updateState({ expired: checked });
                    plansmap.filterLotsLayer({ expired: checked }, true);
                })
                .prop('checked', state.expired)
                .trigger('change');
        }

        if (options.lastUpdated) {
            $lastUpdated = $(options.lastUpdated);
            $lastUpdated
                .change(function () {
                    var selected = $(this).find(':selected'),
                        min = selected.data('min'),
                        max = selected.data('max');
                    updateState({ start: min, end: max });
                    plansmap.filterLotsLayer({
                        lastUpdatedMin: min,
                        lastUpdatedMax: max 
                    }, true);
                })
                .val(state.lastUpdatedMin)
                .trigger('change');
        }

        state = cleanState(state);
        return eventEmitter;
    },

    getState: function () {
        return state;
    },

    resetState: function () {
        resetActive();
        resetExpired();
        resetLastUpdated();
        resetMayors();
    }

};

},{"./plansmap":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/geocode.js":[function(require,module,exports){
var geocoder = new google.maps.Geocoder();

function to_google_bounds(bounds) {
    // bounds: left, bottom, right, top
    return new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds[1], bounds[0]),
        new google.maps.LatLng(bounds[3], bounds[2])
    );
}

function get_component(result, desired_type) {
    var matches = $.grep(result.address_components, function (component, i) {
        return ($.inArray(desired_type, component.types) >= 0);
    });
    if (matches.length >= 0 && matches[0] !== null) {
        return matches[0].short_name;
    }
    return null;
}

function get_street(result) {
    var street_number = get_component(result, 'street_number');
    var route = get_component(result, 'route');
    if (street_number === null || route === null) {
        return null;
    }
    return street_number + ' ' + route;
}

function get_longitude(result) {
    return result.geometry.location.lng();
}

function get_latitude(result) {
    return result.geometry.location.lat();
}

module.exports = {

    geocode: function (address, bounds, state, f) {
        geocoder.geocode({
            'address': address,
            'bounds': to_google_bounds(bounds)
        }, function (results, status) {
            for (var i = 0; i < results.length; i++) {
                var result_state = get_component(results[i], 'administrative_area_level_1');
                if (result_state === state) {
                    results[i].latlng = [get_latitude(results[i]),
                                         get_longitude(results[i])];
                    return f(results[i], status);
                }
            }
            return f(null, status);
        });
    }

};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/hash.js":[function(require,module,exports){
var jsurl = require('jsurl');
var querystring = require('querystring');

function formatPlan(plan) {
    if (plan) {
        return encodeURIComponent(plan).replace(/%20/g, '+');
    }
    return plan;
}

function parsePlan(plan) {
    if (plan) {
        return decodeURIComponent(plan.replace(/\+/g, '%20'));
    }
    return plan;
}

module.exports = {

    parseHash: function(hash) {
        // Parse hash for the map. Based on OSM's parseHash.
        var args = {};

        var i = hash.indexOf('#');
        if (i < 0) {
            return args;
        }

        hash = querystring.parse(hash.substr(i + 1));

        var map = (hash.map || '').split('/'),
            zoom = parseInt(map[0], 10),
            lat = parseFloat(map[1]),
            lon = parseFloat(map[2]);

        if (!isNaN(zoom) && !isNaN(lat) && !isNaN(lon)) {
            args.center = new L.LatLng(lat, lon);
            args.zoom = zoom;
        }

        args.page = hash.page;
        args.plan = parsePlan(hash.plan);
        args.filters = jsurl.parse(hash.filters);
        args.highlights = jsurl.parse(hash.highlights);
        args.sidebar = hash.sidebar;

        return args;
    },

    formatHash: function(options) {
        // Format hash for the map. Based on OSM's formatHash.
        var center = options.map.getCenter(),
            zoom = options.map.getZoom();
        center = center.wrap();

        var precision = 4,
            hash = '#map=' + zoom +
                '/' + center.lat.toFixed(precision) +
                '/' + center.lng.toFixed(precision);

        if (options.planName) {
            hash += '&plan=' + formatPlan(options.planName);
        }

        if (options.page) {
            hash += '&page=' + options.page;
        }

        if (options.filters && _.size(options.filters) > 0) {
            hash += '&filters=' + jsurl.stringify(options.filters);
        }

        if (options.highlights && _.size(options.highlights) > 0) {
            hash += '&highlights=' + jsurl.stringify(options.highlights);
        }

        if (options.sidebar) {
            hash += '&sidebar=' + options.sidebar;
        }

        return hash;
    }

};

},{"jsurl":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/jsurl/index.js","querystring":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/index.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/highlights.js":[function(require,module,exports){
var plansmap = require('./plansmap');
var _ = require('underscore');

var eventEmitter = $({}),
    selectedDispositions = [],
    publicVacant = false;

var $dispositions,
    $publicVacant;

function highlightLots() {
    plansmap.highlightLots({
        dispositions: selectedDispositions,
        public_vacant: publicVacant
    });
}

function getState() {
    var state = {};
    if (selectedDispositions && selectedDispositions.length > 0) {
        state.dispositions = selectedDispositions;
    }
    if (publicVacant) {
        state.public_vacant = publicVacant;
    }
    return state;
}

module.exports = {

    init: function (options, initialState) {
        options = options || {};

        if (options.dispositions) {
            $dispositions = $(options.dispositions + ' :input');
            $dispositions.change(function () {
                selectedDispositions = _.map($dispositions.filter(':checked'), function (e) { return $(e).data('disposition'); });
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.dispositions) {
                _.each(initialState.dispositions, function (disposition) {
                    $dispositions.filter('[data-disposition="' + disposition + '"]')
                        .prop('checked', true)
                        .trigger('change');
                });
            }
        }

        if (options.public_vacant) {
            $publicVacant = $(options.public_vacant);
            $publicVacant.change(function () {
                publicVacant = $(this).is(':checked');
                highlightLots();
                eventEmitter.trigger('change', getState());
            });

            if (initialState && initialState.public_vacant) {
                $publicVacant
                    .prop('checked', initialState.public_vacant)
                    .trigger('change');
            }
        }

        return eventEmitter;
    },

    getDispositions: function() {
        var dispositions = [
            {
                label: 'open space',
                helpText: 'Open space'
            },
            {
                label: 'recreational',
                helpText: 'Recreational'
            },
            {
                label: 'community facility',
                helpText: 'Community facility'
            },
            {
                label: 'residential',
                helpText: 'Residential'
            },
            {
                label: 'commercial',
                helpText: 'Commercial'
            },
            {
                label: 'industrial',
                helpText: 'Industrial'
            },
            {
                label: 'institutional',
                helpText: 'Institutional'
            }
        ];
        return _.map(dispositions, function (disposition) {
            disposition.id = disposition.label.replace(' ', '-');
            return disposition;
        });
    },

    resetState: function () {
        if ($dispositions) {
            $dispositions
                .prop('checked', false)
                .trigger('change');
        }
        if ($publicVacant) {
            $publicVacant
                .prop('checked', false)
                .trigger('change');
        }
    },

    getState: getState

};

},{"./plansmap":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js","underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/main.js":[function(require,module,exports){
require('bootstrap.tooltip');
var _ = require('underscore');

var cartodbapi = require('./cartodbapi');
var filters = require('./filters');
var hash = require('./hash');
var highlights = require('./highlights');
var pages = require('./pages');
var planlist = require('./planlist');
var plans = require('./plans');
var plansmap = require('./plansmap');
var search = require('./search');
var sidebar = require('./sidebar');

require('../bower_components/jqrangeslider/jQRangeSliderMouseTouch');
require('../bower_components/jqrangeslider/jQRangeSliderDraggable');
require('../bower_components/jqrangeslider/jQRangeSliderHandle');
require('../bower_components/jqrangeslider/jQRangeSliderBar');
require('../bower_components/jqrangeslider/jQRangeSliderLabel');
require('../bower_components/jqrangeslider/jQRangeSlider');
require('../bower_components/jqrangeslider/jQDateRangeSliderHandle');
require('../bower_components/jqrangeslider/jQDateRangeSlider');


// State
var currentPage,
    currentPlan,
    currentSidebar,
    currentLot = {},
    currentTitle;

// Map defaults
var defaultZoom = 12,
    defaultCenter = [40.739974, -73.946228];

function resetView() {
    sidebar.close();
    filters.resetState();
    highlights.resetState();
    map.setView(defaultCenter, defaultZoom);
    pushState(null);
}

function addPlansToPlanList(filters) {
    planlist.addToPage(filters, $('#plan-list-partial-container'), function ($ele) {
        $ele.find('.plan')
            .click(function () {
                urbanreviewer.selectPlan($(this).data('name'));
            });
    });
}

var urbanreviewer = {

    selectPlan: function (name) {
        currentPlan = name;
        currentSidebar = null;
        pushState(name);
        unloadFilters();
        unloadPlanList();
        plans.load($('#right-pane'), { plan_name: currentPlan });
        plansmap.clearPlanOutline({ label: 'hover' });
        plansmap.addPlanOutline(currentPlan, { 
            label: 'select',
            zoomToPlan: true
        });
        plansmap.highlightLotsInPlan(currentPlan);
    },

    loadSidebar: function (name, addHistory) {
        if (currentSidebar === name) { return; }
        currentSidebar = name;
        if (name === 'filters') {
            unloadPlanList();
            openFilters();
        }
        else {
            unloadFilters();
            if (name === 'plans') {
                openPlanList();
            }
        }
        if (addHistory) {
            var title = name[0].toUpperCase() + name.slice(1);
            pushState(title);
        }
    }

};

function setTitle(title) {
    var displayTitle;
    if (title === undefined) {
        displayTitle = currentTitle;
    }
    else {
        displayTitle = 'Urban Reviewer';
        if (title) {
            displayTitle = title + ' | ' + displayTitle;
        }
        currentTitle = displayTitle;
    }
    $('title').html(displayTitle);
}

function pushState(title) {
    setTitle(title);
    var state = {
        title: title
    };
    if (currentSidebar) {
        state.sidebar = currentSidebar;
    }
    if (currentPlan) {
        state.plan = currentPlan;
    }
    if (currentPage) {
        state.page = currentPage;
    }

    var url = hash.formatHash({
        filters: filters.getState(),
        highlights: highlights.getState(),
        map: map,
        page: currentPage,
        planName: currentPlan,
        sidebar: currentSidebar
    });
    history.pushState(state, null, url);
}

function openFilters() {
    sidebar.open($('#filters-container'), 'narrow');
    $('#filters-container').show();
}

function unloadFilters() {
    if ($('#filters-container:visible').length > 0) {
        $('#filters-container').hide().appendTo('body');
    }
}

function loadFilters(alreadyOpen) {
    var template = JST['handlebars_templates/filters.hbs'],
        $target = $('body'),
        $content = $(template({ dispositions: highlights.getDispositions() }));

    if (alreadyOpen) {
        $target = $('#right-pane');
    }
    else {
        $content.hide();
    }

    $target.append($content);

    $('.help-button')
        .tooltip({
            html: true       
        })
        .on('shown.bs.tooltip', function () {
            var $prefix = $('<div></div>')
                .addClass('tooltip-prefix')
                .text('What does this do?');
            $('.tooltip-inner').prepend($prefix);
            $('.tooltip').css('top', '-=10px');
        });

    filters
        .init({
            active: '#plan-status-active',
            dateRange: '#date-range-picker',
            expired: '#plan-status-expired',
            lastUpdated: '#last-updated',
            mayors: '#mayors'
        }, hash.parseHash(window.location.hash).filters)
        .on('change', function (e, filters) {
            addPlansToPlanList(filters);
            pushState('Filters');
        });

    $('#filters-plan-list-link').click(function () {
        urbanreviewer.loadSidebar('plans', true);
        return false;
    });
    highlights
        .init({
            dispositions: '#dispositions',
            public_vacant: '#public-vacant'
        }, hash.parseHash(window.location.hash).highlights)
        .on('change', function (state) {
            pushState();
        });
}

function loadPlanList(alreadyOpen) {
    var template = JST['handlebars_templates/plan_list.hbs'],
        $target = $('body');

    if (alreadyOpen) {
        $target = $('#right-pane');
    }

    var $content = $(template({
        decades: [
            [1950, 1959],
            [1960, 1969],
            [1970, 1979],
            [1980, 1989],
            [1990, 1999],
            [2000, 2009],
            [2010, 2019]
        ]
    }));
    if (!alreadyOpen) {
        $content.hide();
    }
    $target.append($content);

    $('#plan-list-filters-link').click(function () {
        urbanreviewer.loadSidebar('filters', true);
        return false;
    });
    addPlansToPlanList(filters.getState());
}

function openPlanList() {
    sidebar.open($('#plan-list-container'), 'narrow');
    $('#plan-list-container').show();
}

function unloadPlanList() {
    if ($('#plan-list-container:visible').length > 0) {
        $('#plan-list-container').hide().appendTo('body');
    }
}

$(document).ready(function () {

    /*
     * Initialize map
     */
    var parsedHash = hash.parseHash(window.location.hash),
        zoom = parsedHash.zoom || defaultZoom,
        center = parsedHash.center || defaultCenter;
    currentPage = parsedHash.page;
    currentPlan = parsedHash.plan;

    sidebar.init($('#right-pane'), {
        beforeClose: function () {
            currentPage = null;
            currentPlan = null;
            currentSidebar = null;
            setTitle(null);
            unloadFilters();
            unloadPlanList();
        },
        beforeOpen: function () {
            unloadFilters();
            unloadPlanList();
        }
    });

    loadPlanList();
    map = plansmap.init('map', function () {
        // Don't load filters until we have a lots layer to filter on
        loadFilters();
        urbanreviewer.loadSidebar(parsedHash.sidebar);
        if (currentPlan) {
            plansmap.highlightLotsInPlan(currentPlan);
        }
    });
    if (currentPage) {
        plansmap.setActiveArea({ area: 'half' });
    }
    else if (currentPlan) {
        // If there's a plan selected already, set the active area so we can
        // zoom to it appropriately
        plansmap.setActiveArea({ area: 'half' });
    }
    else if (parsedHash.sidebar) {
        plansmap.setActiveArea({ area: 'most' });
    }
    else {
        plansmap.setActiveArea({ area: 'full' });
    }

    map
        .setView(center, zoom)
        .on('moveend', function () {
            pushState();
        })
        .on('planlotclick', function (data) {
            // Don't load the plan again
            if (currentPlan && data.plan_name === currentPlan) {
                return;
            }
            urbanreviewer.selectPlan(data.plan_name);
        })
        .on('planclick', function (data) {
            if (currentPlan && data.plan_name === currentPlan) {
                return;
            }
            urbanreviewer.selectPlan(data.plan_name);
        })
        .on('planlotover', function (data) {
            if (currentPlan && data.plan_name === currentPlan) {
                if (data.block !== currentLot.block || data.lot !== currentLot.lot) {
                    currentLot = {
                        block: data.block,
                        lot: data.lot
                    };
                    plansmap.highlightLot({
                        plan_name: currentPlan,
                        block: data.block,
                        lot: data.lot
                    });

                    plans.highlightLot(data.block, data.lot);
                }
            }
            else {
                plansmap.addPlanOutline(data.plan_name, {
                    label: 'hover',
                    popup: true
                });
            }
        })
        .on('planlotout', function (data) {
            currentLot = {};
            if (currentPlan) {
                plansmap.unHighlightLot();
                plans.unhighlightLot();
            }
        })
        .on('planout', function (data) {
            if (data.label === 'hover') {
                plansmap.clearPlanOutline({ label: 'hover' });
            }
        });


    /*
     * Initialize sidebar
     */
    $('#right-pane').on('open', function (e, size) {
        $('.visible-sidebar-' + size).show();
        $('.hidden-sidebar-' + size).hide();

        if (size === 'wide') {
            plansmap.setActiveArea({ area: 'half' });
        }
        else if (size === 'widest') {
            plansmap.setActiveArea({ area: 'narrow' });
        }
        else if (size === 'narrow') {
            plansmap.setActiveArea({ area: 'most' });
            $('#date-range-picker-container').addClass('narrow-sidebar');
            try {
                $('#date-range-picker').dateRangeSlider('resize');
            }
            catch (exception) {
                // Don't care if this fails, just means date range slider has
                // not been initialized yet
            }
        }
    });

    $('#right-pane').on('close', function () {
        $('.visible-sidebar-closed').show();
        $('.hidden-sidebar-closed').hide();

        $('#date-range-picker-container').removeClass('narrow-sidebar');
        $('#date-range-picker').dateRangeSlider('resize');
        plansmap.setActiveArea({ area: 'full' });

        currentPlan = null;
        setTitle(null);
        pushState();
        plansmap.clearPlanOutline({ label: 'select' });
        plansmap.unhighlightLotsInPlan();
    });

    $('.sidebar-link').click(function (e) {
        currentPage = $(this).attr('href');
        currentPlan = null;
        currentSidebar = null;
        pushState();
        pages.load(currentPage);
        return false;
    });


    /*
     * If a plan or sidebar was in the url, open it.
     */
    if (currentPlan) {
        unloadFilters();
        unloadPlanList();
        setTitle(currentPlan);
        plans.load($('#right-pane'), { plan_name: currentPlan });
        plansmap.addPlanOutline(currentPlan, { label: 'select' });
    }

    if (currentPage) {
        pages.load(currentPage);
    }

    /*
     * Listen for popstate
     */
    $(window).on('popstate', function (e) {
        var parsedHash = hash.parseHash(window.location.hash),
            previousPlan = currentPlan,
            previousPage = currentPage,
            sidebar = parsedHash.sidebar,
            state = e.originalEvent.state;
        map.setView(parsedHash.center, parsedHash.zoom);
        currentPage = parsedHash.page;
        currentPlan = parsedHash.plan;
        if (currentPlan && currentPlan !== previousPlan) {
            plans.load($('#right-pane'), { plan_name: currentPlan });
            plansmap.addPlanOutline(currentPlan, { label: 'select' });
        }
        if (currentPage && currentPage !== previousPage) {
            pages.load(currentPage);
        }
        if (sidebar) {
            urbanreviewer.loadSidebar(sidebar, false);
        }
        else if (state === null) {
            sidebar.close();
        }

        var title = null;
        if (state) {
            title = state.title;
        }
        setTitle(title);
    });


    /*
     * Initialize search
     */
    search.init('#search');
    $('#search').on('resultfound', function (e, result) {
        plansmap.addUserMarker(result.latlng);
    });
    $('#search').on('planfound', function (e, name) {
        urbanreviewer.selectPlan(name);
    });

    $('.sidebar-show').click(function (e) {
        urbanreviewer.loadSidebar('plans', true);
        pushState();
        $('#right-pane').scrollTop(0);
        return false;
    });

    $('#logo').click(function () {
        resetView();
        return false;
    });

    $('#narrow-sidebar-hide-button').click(function () {
        sidebar.close();
        return false;
    });

    /*
     * Open plans sidebar if nothing's open on load.
     */
    if (!(currentPlan || currentPage || currentSidebar)) {
        urbanreviewer.loadSidebar('plans', true);
    }

    $('.intro-text-dismiss').click(function () {
        $('.intro-text').slideUp();
        return false;
    });
});

},{"../bower_components/jqrangeslider/jQDateRangeSlider":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQDateRangeSlider.js","../bower_components/jqrangeslider/jQDateRangeSliderHandle":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQDateRangeSliderHandle.js","../bower_components/jqrangeslider/jQRangeSlider":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSlider.js","../bower_components/jqrangeslider/jQRangeSliderBar":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderBar.js","../bower_components/jqrangeslider/jQRangeSliderDraggable":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderDraggable.js","../bower_components/jqrangeslider/jQRangeSliderHandle":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderHandle.js","../bower_components/jqrangeslider/jQRangeSliderLabel":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderLabel.js","../bower_components/jqrangeslider/jQRangeSliderMouseTouch":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jqrangeslider/jQRangeSliderMouseTouch.js","./cartodbapi":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js","./filters":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/filters.js","./hash":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/hash.js","./highlights":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/highlights.js","./pages":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/pages.js","./planlist":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/planlist.js","./plans":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plans.js","./plansmap":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js","./search":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/search.js","./sidebar":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/sidebar.js","bootstrap.tooltip":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/bootstrap/js/tooltip.js","underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/pages.js":[function(require,module,exports){
var sidebar = require('./sidebar');
require('jquery.scrollTo');

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
                    );
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
        });
    }

};

},{"./sidebar":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/sidebar.js","jquery.scrollTo":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jquery.scrollTo/jquery.scrollTo.min.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/planlist.js":[function(require,module,exports){
var cartodbapi = require('./cartodbapi');
var plansfilters = require('./plansfilters');
var plansmap = require('./plansmap');

function addToPage(filters, $target, callback) {
    var template = JST['handlebars_templates/plan_list_partial.hbs'];
    load(filters, false, function (plans) {
        $target.empty();
        $target.append($(template({ plans: plans })));
        callback($target);
        $('.plan')
            .mouseenter(function() {
                plansmap.addPlanOutline($(this).data('name'), {
                    label: 'hover',
                    popup: true
                });
            })
            .mouseleave(function() {
                plansmap.clearPlanOutline({ label: 'hover' });
            });
    });
}

function load(filters, extend, callback) {
    var whereClause = plansfilters.getWhereClause(filters, extend),
        sql = 'SELECT p.name, extract(YEAR FROM p.adopted) as adopted ' + 
            'FROM plans p ' + whereClause + ' ORDER BY p.name';
    cartodbapi.getJSON(sql, function (results) {
        callback(results.rows);
    });
}

module.exports = {
    addToPage: addToPage,
    load: load
};

},{"./cartodbapi":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js","./plansfilters":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansfilters.js","./plansmap":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plans.js":[function(require,module,exports){
require('bootstrap.carousel');
require('jquery.colorbox');
require('jquery.scrollTo');
var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

var scrollToHeight;

function addPlanContent($location, borough, planName) {
    var planDirectory = 'plans/' + borough + '/' + encodeURIComponent(planName.replace('/', '-'));
    if (window.console) {
        console.log('Plan directory: ' + planDirectory);
    }
    $.get(planDirectory, function (content) {
        $location.append(content);

        $location.find('img')
            .each(function (i) {
                var src = $(this).attr('src');

                // If we're not dealing with an external or absolute image path
                // prepend the plan directory
                if (src.indexOf('http') !== 0 && src.indexOf('/') !== 0) {
                    src = planDirectory + '/' + src;
                    $(this).attr('src', src);
                }
                $(this).wrap('<a class="colorbox" href="' + src + '"></a>');

                // Add indicators under carousel
                var $indicator = $('<li></li>')
                    .attr({
                        'data-target': '#image-container',
                        'data-slide-to': i
                    });
                $('#image-container .carousel-indicators').append($indicator);
            });

        // Finally, add images to carousel
        var $imgs = $location.find('.colorbox')
            .appendTo('#image-container .carousel-inner')
            .wrap('<div class="item"></div>');

        // If images exist, show the carousel and get it going
        var $items = $('#image-container .item');
        if ($items.length > 0) {
            $('#image-container')
                .carousel('next')
                .show();
            $('#image-container .colorbox').colorbox({
                maxHeight: '100%',
                maxWidth: '100%'
            });
        }
        if ($items.length === 1) {
            $('.carousel-control,.carousel-indicators').hide();
        }
    })
    .fail(function () {
        if (window.console) {
            console.warn('Failed to get page for ' + planName + ': ' + planDirectory);
        }
    });
}

function loadDetails(planName, success) {
    var sql = "SELECT *, EXTRACT(YEAR FROM updated) AS last_updated " +
       "FROM plans WHERE name = '" + planName + "'";
    cartodbapi.getJSON(sql, function (results) {
        row = results.rows[0];
        success(row);
    });
}

function loadLots($target, planName) {
    var sql = 
        "SELECT p.borough AS borough, l.bbl AS bbl, l.block AS block, " +
            "l.lot AS lot, l.disposition_display AS disposition, " +
            "l.in_596 as in_596 " +
        "FROM lots l LEFT OUTER JOIN plans p ON l.plan_id=p.cartodb_id " +
        "WHERE p.name='" + planName + "' " +
        "ORDER BY l.block, l.lot";
    cartodbapi.getJSON(sql, function (data) {
        var lots_template = JST['handlebars_templates/lots.hbs'];
        var content = lots_template(data);
        $target.append(content);
        $('.lot-count').text(data.rows.length);
        $('.lot').on({
            mouseenter: function () {
                plansmap.highlightLot($(this).data());
            },
            mouseleave: function () {
                plansmap.unHighlightLot();
            }
        });
    });
}

function cleanData(row) {
    cleaned = _.extend({}, row);
    if (row.adopted) {
        // We want the year exactly as it appears in CartoDB, not modified for 
        // timezone
        cleaned.adopted = row.adopted.slice(0, row.adopted.indexOf('-'));
    }

    if (row.status) {
        if (row.status === 'active') {
            cleaned.status = 'active';
        }
        else if (row.status === 'expired') {
            cleaned.status = 'expired';
        }
        else {
            cleaned.status = 'unknown';
        }
    }
    return cleaned;
}

function unhighlightLot() {
    $('.lot').removeClass('highlighted');
}

module.exports = {

    load: function ($target, options) {
        sidebar.open();
        loadDetails(options.plan_name, function (row) {
            row = cleanData(row);

            // Load basic template for the plan
            var template = JST['handlebars_templates/plan.hbs'];
            templateContent = template(row);
            sidebar.open(templateContent);

            // Measure available width and set the header's width to it
            var headerWidth = $target.innerWidth() - $('.panel-toggle').outerWidth();
            $('.plan-header-content').width(headerWidth);

            // Load details for the plan
            var $details = $target.find('#plan-details');
            addPlanContent($details, row.borough, options.plan_name);

            // Load the plan's lots
            loadLots($('#lots-content'), options.plan_name);
        });

        scrollToHeight = $('#right-pane').height() / 2;
    },

    highlightLot: function (block, lot) {
        unhighlightLot();

        var $lot = $('.lot[data-block=' + block +'][data-lot=' + lot + ']');
        $lot.addClass('highlighted');
        $('#right-pane').scrollTo($lot, 100, {
            axis: 'y',
            margin: true,
            offset: -scrollToHeight,
            queue: false
        });
    },

    unhighlightLot: unhighlightLot

};

},{"./cartodbapi":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js","./plansmap":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js","./sidebar":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/sidebar.js","bootstrap.carousel":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/bootstrap/js/carousel.js","jquery.colorbox":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jquery-colorbox/jquery.colorbox-min.js","jquery.scrollTo":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/jquery.scrollTo/jquery.scrollTo.min.js","underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansfilters.js":[function(require,module,exports){
var _ = require('underscore');

var lastFilters = {};

function getWhereClause(filters, extendLastFilters) {
    var whereConditions = [];

    if (extendLastFilters === undefined || extendLastFilters === true) {
        filters = _.extend(lastFilters, filters);
    }

    if (filters.start) {
        whereConditions.push("p.adopted >= '" + filters.start + "-01-01'");
    }
    if (filters.end) {
        whereConditions.push("p.adopted <= '" + filters.end + "-01-01'");
    }

    if (filters.active) {
        whereConditions.push("status ILIKE '%active%'");
    }

    if (filters.expired) {
        whereConditions.push("status ILIKE '%expired%'");
    }

    var year;
    if (filters.lastUpdatedMin) {
        year = parseInt(filters.lastUpdatedMin);
        if (year) {
            whereConditions.push("p.updated >= '" + year + "-01-01'");
        }
    }

    if (filters.lastUpdatedMax) {
        year = parseInt(filters.lastUpdatedMax);
        if (year) {
            whereConditions.push("p.updated < '" + (year + 1) + "-01-01'");
        }
    }

    lastFilters = filters;
    if (whereConditions.length > 0) {
        return 'WHERE ' + whereConditions.join(' AND ');
    }
    return '';
}

module.exports = {
    getWhereClause: getWhereClause
};

},{"underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansmap.js":[function(require,module,exports){
var _ = require('underscore');
var cartodbapi = require('./cartodbapi');
var cartocss = require('./cartocss').cartocss;
var plansfilters = require('./plansfilters');
var singleminded = require('./singleminded');

require('../bower_components/leaflet-active-area/src/L.activearea');
require('../bower_components/leaflet-plugins/layer/tile/Bing');
require('../bower_components/leaflet-usermarker/src/leaflet.usermarker');

var map,
    currentMode = 'daymode',
    currentPlan,
    filters = {},
    lotsLayer,
    highlightCartoCSS,
    highlightedLotLayer,
    planOutlines = {},
    planOutlinesNames = {},
    planOutlinesPopups = {},
    userMarker;


function updateStyles() {
    // Update the plan's styles using the current state
    lotsLayer.setCartoCSS(cartocss({ 
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    }));
}

function unHighlightLot(e) {
    if (!planOutlinesPopups.hover) {
        map.closePopup();
    }
    highlightedLotLayer.clearLayers();           
    singleminded.forget('highlightLot_centroid');
    singleminded.forget('highlightLot_geometry');
}

function unhighlightLotsInPlan() {
    currentPlan = null;
    updateStyles();
}

function clearPlanOutline(options) {
    options = options || {};
    var label = options.label;
    if (planOutlines[label]) {
        planOutlines[label].clearLayers();
    }
    if (planOutlinesPopups[label]) {
        map.closePopup(planOutlinesPopups[label]);
    }
    planOutlinesNames[label] = null;
}

module.exports = {

    init: function (id, onLotsLayerReady) {
        map = L.map(id, {
            maxZoom: 18,
            minZoom: 10,
            zoomControl: false
        });

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        var streets = L.mapbox.tileLayer('urbanreviewer.8b5195d9', {
                accessToken: 'pk.eyJ1IjoiZWJyZWxzZm9yZCIsImEiOiI2VFFWT21ZIn0.qhtAhoVTOPzFwWAi7YHr_Q',
                detectRetina: true 
            })
            .addTo(map);

        var satellite = new L.BingLayer('Ajio1n0EgmAAvT3zLndCpHrYR_LHJDgfDU6B0tV_1RClr7OFLzy4RnkLXlSdkJ_x');

        var baseLayers = {
            streets: streets,
            satellite: satellite
        };

        L.control.layers(baseLayers, {}, {
            position: 'bottomleft'
        }).addTo(map);

        cartodb.createLayer(map, {
            cartodb_logo: false,
            user_name: 'urbanreviewer',
            type: 'cartodb',
            sublayers: [{
                cartocss: cartocss(),
                interactivity: 'block, lot, plan_name, borough',
                sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
            }]
        })
        .addTo(map)
        .done(function (layer) {
            lotsLayer = layer.getSubLayer(0);
            lotsLayer.setInteraction(true);
            layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
                map.fire('planlotclick', data);
            });

            layer.on('featureOver', function (e, latlng, pos, data) {
                // Update mouse cursor when over a feature
                $('#' + map._container.id).css('cursor', 'pointer');
                data.latlng = latlng;
                map.fire('planlotover', data);
            });
            layer.on('featureOut', function (e, latlng, pos, data) {
                // Reset mouse cursor when no longer over a feature
                var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
                $('#' + map._container.id).attr('style',  grabStyle);
                map.fire('planlotout', data);
            });

            map.addLayer(layer, false);
            onLotsLayerReady();

            streets.bringToBack();
            map
                .on('baselayerchange', function (e) {
                    $('body').toggleClass('night-mode', e.name === 'satellite');
                    currentMode = e.name === 'satellite' ? 'nightmode' : 'daymode';
                    updateStyles();
                    e.layer.bringToBack();
                })
                .on('mousemove', function (e) {
                    if (!e.latlng) { return; }

                    // If we're no longer over the hover outline, close it
                    var hoverOutline = planOutlines.hover;
                    if (!(hoverOutline && hoverOutline.getLayers().length > 0 && hoverOutline.getBounds())) { return; }
                    if (!hoverOutline.getBounds().contains(e.latlng)) {
                        if (planOutlinesPopups.hover) {
                            map.closePopup();
                        }
                        clearPlanOutline({ label: 'hover' });
                    }
                });
        });

        highlightedLotLayer = L.geoJson(null, {
            style: function (feature) {
                return {
                    color: '#000',
                    fill: false,
                    weight: 3
                };
            }
        }).addTo(map);

        return map;
    },

    setActiveArea: function (options) {
        options = options || {};
        var activeAreaOptions = {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '100%'
        };

        if (options.area === 'narrow') {
            activeAreaOptions.right = '75%';
        }

        if (options.area === 'half') {
            activeAreaOptions.right = '50%';
        }

        if (options.area === 'most') {
            activeAreaOptions.right = '25%';
        }

        map.setActiveArea(activeAreaOptions);
    },

    filterLotsLayer: function (filters, extendLastFilters) {
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id " +
            plansfilters.getWhereClause(filters, extendLastFilters);
        lotsLayer.setSQL(sql);
    },

    highlightLot: function (options) {
        unHighlightLot();

        var url = 'http://urbanreviewer.cartodb.com/api/v2/sql?q=',
            whereConditions = [];
        options = options || {};
        if (options.block) {
            whereConditions.push('l.block = ' + options.block);
        }
        if (options.borough) {
            whereConditions.push("p.borough = '" + options.borough + "'");
        }
        if (options.lot) {
            whereConditions.push('l.lot = ' + options.lot);
        }
        if (options.plan_name) {
            whereConditions.push("p.name = '" + options.plan_name + "'");
        }

        // Get geometry
        var geometrySql = 'SELECT l.the_geom AS the_geom ' +
                'FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id ';
        geometrySql += ' WHERE ' + whereConditions.join(' AND ');
        geometrySql = encodeURIComponent(geometrySql);
        singleminded.remember('highlightLot_geometry', 
            $.get(url + geometrySql + '&format=GeoJSON', function (data) {
                highlightedLotLayer.addData(data);           
            })
        );
    },

    unHighlightLot: unHighlightLot,

    highlightLots: function (options) {
        options = options || {};

        filters.dispositions = options.dispositions;
        filters.publicVacant = options.public_vacant;

        updateStyles();
    },

    clearPlanOutline: clearPlanOutline,

    unhighlightLotsInPlan: unhighlightLotsInPlan,

    highlightLotsInPlan: function (planName) {
        unhighlightLotsInPlan();
        currentPlan = planName;
        updateStyles();
    },

    addPlanOutline: function (planName, options) {
        options = options || {};
        var label = options.label,
            outline = planOutlines[label];

        // Jump out if no label to use or the plan is already outlined
        if (!label || planOutlinesNames[label] === planName) {
            return;
        }
        planOutlinesNames[label] = planName;

        if (outline) {
            clearPlanOutline({ label: label });
        }
        else {
            outline = planOutlines[label] = L.geoJson(null, {
                style: function (feature) {
                    var strokeColor = $('body').is('.night-mode') ? '#fff' : '#000';
                    return {
                        clickable: true,
                        color: strokeColor,
                        dashArray: '10 10 1 10',
                        fill: true,
                        fillOpacity: 0,
                        opacity: 1,
                        stroke: true
                    };
                }
            }).addTo(map);

            if (label === 'hover') {
                outline
                    .on('mouseout', function () {
                        map.fire('planout', { label: label });
                    })
                    .on('click', function () {
                        map.fire('planclick', { plan_name: planOutlinesNames[label] });
                    });
            }
        }

        planOutlinesNames[label] = planName;
        var sql = "SELECT ST_Buffer(ST_ConvexHull(ST_Union(l.the_geom)), 0.0001) AS the_geom " + 
                  "FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id " +
                  "WHERE p.name = '" + planName + "'";
        cartodbapi.getGeoJSON(sql, function (data) {
            outline.addData(data);
            
            if (options.zoomToPlan === true) {
                map.fitBounds(outline.getBounds(), {
                    padding: [25, 25]            
                });
            }

            if (options.popup) {
                var popupOptions = {
                    autoPan: false,
                    closeButton: false
                };
                planOutlinesPopups[label] = L.popup(popupOptions)
                    .setLatLng(outline.getBounds().getCenter())
                    .setContent(planName)
                    .openOn(map);
            }
        });
    },

    addUserMarker: function (latlng) {
        if (userMarker) {
            map.removeLayer(userMarker);
        }
        userMarker = L.userMarker(latlng, {
            smallIcon: true                        
        }).addTo(map);
        map.setView(latlng, 16);
    }

};

},{"../bower_components/leaflet-active-area/src/L.activearea":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-active-area/src/L.activearea.js","../bower_components/leaflet-plugins/layer/tile/Bing":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-plugins/layer/tile/Bing.js","../bower_components/leaflet-usermarker/src/leaflet.usermarker":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/bower_components/leaflet-usermarker/src/leaflet.usermarker.js","./cartocss":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartocss.js","./cartodbapi":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js","./plansfilters":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansfilters.js","./singleminded":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/singleminded.js","underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/search.js":[function(require,module,exports){
var cartodbapi = require('./cartodbapi');
var filters = require('./filters');
var geocode = require('./geocode');
var plansfilters = require('./plansfilters');
require('typeahead.js');


var plansBloodhound = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
        url: cartodbapi.getSqlUrl('SELECT name FROM plans'),
        replace: function (url, query) {
            var whereClause = plansfilters.getWhereClause(filters.getState(), true);
                whereQuery = " p.name ILIKE '%" + query + "%'";
            if (whereClause) {
                whereClause += ' AND ' + whereQuery;
            }
            else {
                whereClause = 'WHERE ' + whereQuery;
            }
            sql = 'SELECT p.name FROM plans p ' + whereClause + ' ORDER BY p.name';
            return cartodbapi.getSqlUrl(sql);
        },
        filter: function (results) {
            return $.map(results.rows, function (row) {
                return {
                    name: row.name,
                    borough: row.borough
                };
            });
        }
    }
});

plansBloodhound.initialize();
 
function init(selector) {
    $(selector).on('keyup', function (e) {
        if (e.keyCode === 13) {
            search(selector, $(selector).val());
        }
    });

    $(selector).typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'plans',
        displayKey: 'name',
        source: plansBloodhound.ttAdapter()
    });

    $(selector).on('typeahead:selected', function (e, suggestion) {
        $(selector).trigger('planfound', suggestion.name);
    });
    $(selector).on('typeahead:autocompleted', function (e, suggestion) {
        $(selector).trigger('planfound', suggestion.name);
    });
}

function search(selector, q) {
    geocode.geocode(q, [-74.402161, 40.475158, -73.642731, 40.984045], 'NY',
        function (results, status) {
            if (status === 'OK') {
                $(selector).trigger('resultfound', results);
            }
        }
    );
}

module.exports = {
    init: init,
    search: search
};

},{"./cartodbapi":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/cartodbapi.js","./filters":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/filters.js","./geocode":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/geocode.js","./plansfilters":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/plansfilters.js","typeahead.js":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/typeahead.js/dist/typeahead.bundle.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/sidebar.js":[function(require,module,exports){
var _ = require('underscore');

var sizes = ['narrow', 'wide', 'widest'],
    defaultSize = 'wide';

var $container,
    options;

function isOpen() {
    return $container.is(':visible');
}

function open(content, size) {
    if (options.beforeOpen) {
        options.beforeOpen();
    }
    if (!(size && _.contains(sizes, size))) {
        size = defaultSize;
    }
    $container
        .empty()
        .removeClass(sizes.join(' '))
        .addClass(size)
        .append(content)
        .show()
        .trigger('open', size);
    $container.find('.panel-toggle').click(function () {
        close();
    });
}

function close() {
    if (options.beforeClose) {
        options.beforeClose();
    }
    $container
        .trigger('close')
        .hide();
}

module.exports = {

    init: function ($e, overrideOptions) {
        options = _.extend({}, overrideOptions);
        $container = $e;
    },

    isOpen: isOpen,
    open: open,
    close: close
};

},{"underscore":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/singleminded.js":[function(require,module,exports){
//
// A simple AJAX request queue of length 1.
//

var thoughts = {};

function forget(name) {
    var request = thoughts[name];

    // If request exists and does not have a DONE state, abort it
    if (request && request.readyState != 4) {
        request.abort();
    }

    thoughts[name] = null;
}

function remember(name, jqxhr) {
    forget(name);

    jqxhr.done(function() {
        // Don't bother remembering requests we've finished
        forget(name);
    });
    thoughts[name] = jqxhr;
}

module.exports = {
    forget: forget,
    remember: remember
};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/decode.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/encode.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/index.js":[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/decode.js","./encode":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/grunt-browserify/node_modules/browserify/node_modules/querystring-es3/encode.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/jsurl/index.js":[function(require,module,exports){
module.exports = require('./lib/jsurl')
},{"./lib/jsurl":"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/jsurl/lib/jsurl.js"}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/jsurl/lib/jsurl.js":[function(require,module,exports){
/**
 * Copyright (c) 2011 Bruno Jouhier <bruno.jouhier@sage.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
(function(exports) {
	"use strict";
	exports.stringify = function stringify(v) {
		function encode(s) {
			return !/[^\w-.]/.test(s) ? s : s.replace(/[^\w-.]/g, function(ch) {
				if (ch === '$') return '!';
				ch = ch.charCodeAt(0);
				// thanks to Douglas Crockford for the negative slice trick
				return ch < 0x100 ? '*' + ('00' + ch.toString(16)).slice(-2) : '**' + ('0000' + ch.toString(16)).slice(-4);
			})
		}

		switch (typeof v) {
		case 'number':
		case 'boolean':
			return '~' + v;
		case 'string':
			return "~'" + encode(v);
		case 'object':
			if (!v) return '~null';
			if (Array.isArray(v)) {
				return '~(' + (v.map(function(elt) {
					return stringify(elt) || '~null';
				}).join('') || '~') + ')';
			} else {
				return '~(' + Object.keys(v).map(function(key) {
					var val = stringify(v[key]);
					// skip undefined and functions
					return val && (encode(key) + val);
				}).filter(function(str) {
					return str;
				}).join('~') + ')';
			}
		default:
			// function, undefined
			return;
		}
	}

	var reserved = {
		true: true,
		false: false,
		null: null
	};

	exports.parse = function(s) {
		if (!s) return s;
		var i = 0,
			len = s.length;

		function eat(expected) {
			if (s[i] !== expected) throw new Error("bad JSURL syntax: expected " + expected + ", got " + (s && s[i]));
			i++;
		}

		function decode() {
			var beg = i,
				ch, r = "";
			while (i < len && (ch = s[i]) !== '~' && ch !== ')') {
				switch (ch) {
				case '*':
					if (beg < i) r += s.substring(beg, i);
					if (s[i + 1] === '*') r += String.fromCharCode(parseInt(s.substring(i + 2, i + 6), 16)), beg = (i += 6);
					else r += String.fromCharCode(parseInt(s.substring(i + 1, i + 3), 16)), beg = (i += 3);
					break;
				case '!':
					if (beg < i) r += s.substring(beg, i);
					r += '$', beg = ++i;
					break;
				default:
					i++;
				}
			}
			return r + s.substring(beg, i);
		}

		return (function parseOne() {
			var result, ch, beg;
			eat('~');
			switch (ch = s[i]) {
			case '(':
				i++;
				if (s[i] === '~') {
					result = [];
					if (s[i + 1] === ')') i++;
					else {
						do {
							result.push(parseOne());
						} while (s[i] === '~');
					}
				} else {
					result = {};
					if (s[i] !== ')') {
						do {
							var key = decode();
							result[key] = parseOne();
						} while (s[i] === '~' && ++i);
					}
				}
				eat(')');
				break;
			case "'":
				i++;
				result = decode();
				break;
			default:
				beg = i++;
				while (i < len && /[^)~]/.test(s[i]))
				i++;
				var sub = s.substring(beg, i);
				if (/[\d\-]/.test(ch)) {
					result = parseFloat(sub);
				} else {
					result = reserved[sub];
					if (typeof result === "undefined") throw new Error("bad value keyword: " + sub);
				}
			}
			return result;
		})();
	}
})(typeof exports !== 'undefined' ? exports : (window.JSURL = window.JSURL || {}));
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/typeahead.js/dist/typeahead.bundle.js":[function(require,module,exports){
/*!
 * typeahead.js 0.10.2
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

(function($) {
    var _ = {
        isMsie: function() {
            return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
        },
        isBlankString: function(str) {
            return !str || /^\s*$/.test(str);
        },
        escapeRegExChars: function(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        isString: function(obj) {
            return typeof obj === "string";
        },
        isNumber: function(obj) {
            return typeof obj === "number";
        },
        isArray: $.isArray,
        isFunction: $.isFunction,
        isObject: $.isPlainObject,
        isUndefined: function(obj) {
            return typeof obj === "undefined";
        },
        bind: $.proxy,
        each: function(collection, cb) {
            $.each(collection, reverseArgs);
            function reverseArgs(index, value) {
                return cb(value, index);
            }
        },
        map: $.map,
        filter: $.grep,
        every: function(obj, test) {
            var result = true;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (!(result = test.call(null, val, key, obj))) {
                    return false;
                }
            });
            return !!result;
        },
        some: function(obj, test) {
            var result = false;
            if (!obj) {
                return result;
            }
            $.each(obj, function(key, val) {
                if (result = test.call(null, val, key, obj)) {
                    return false;
                }
            });
            return !!result;
        },
        mixin: $.extend,
        getUniqueId: function() {
            var counter = 0;
            return function() {
                return counter++;
            };
        }(),
        templatify: function templatify(obj) {
            return $.isFunction(obj) ? obj : template;
            function template() {
                return String(obj);
            }
        },
        defer: function(fn) {
            setTimeout(fn, 0);
        },
        debounce: function(func, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this, args = arguments, later, callNow;
                later = function() {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };
                callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                }
                return result;
            };
        },
        throttle: function(func, wait) {
            var context, args, timeout, result, previous, later;
            previous = 0;
            later = function() {
                previous = new Date();
                timeout = null;
                result = func.apply(context, args);
            };
            return function() {
                var now = new Date(), remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        noop: function() {}
    };
    var VERSION = "0.10.2";
    var tokenizers = function(root) {
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(s) {
            return s.split(/\s+/);
        }
        function nonword(s) {
            return s.split(/\W+/);
        }
        function getObjTokenizer(tokenizer) {
            return function setKey(key) {
                return function tokenize(o) {
                    return tokenizer(o[key]);
                };
            };
        }
    }();
    var LruCache = function() {
        function LruCache(maxSize) {
            this.maxSize = maxSize || 100;
            this.size = 0;
            this.hash = {};
            this.list = new List();
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail, node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            }
        });
        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });
        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }
        function PersistentStorage(namespace) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + this.prefix);
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (_.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [], len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--; ) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return _.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: _.noop,
                set: _.noop,
                remove: _.noop,
                clear: _.noop,
                isExpired: _.noop
            };
        }
        _.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var Transport = function() {
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, requestCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function clearCache() {
            requestCache = new LruCache(10);
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this, jqXhr;
                if (jqXhr = pendingRequests[url]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[url] = this._send(url, o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    cb && cb(null, resp);
                    requestCache.set(url, resp);
                }
                function fail() {
                    cb && cb(true);
                }
                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[url];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(url, o, cb) {
                var resp;
                if (_.isFunction(o)) {
                    cb = o;
                    o = {};
                }
                if (resp = requestCache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this._get(url, o, cb);
                }
                return !!resp;
            }
        });
        return Transport;
        function callbackToDeferred(fn) {
            return function customSendWrapper(url, o) {
                var deferred = $.Deferred();
                fn(url, o, onSuccess, onError);
                return deferred;
                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }
                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var SearchIndex = function() {
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [ data ];
                _.each(data, function(datum) {
                    var id, tokens;
                    id = that.datums.push(datum) - 1;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node.children[ch] || (node.children[ch] = newNode());
                            node.ids.push(id);
                        }
                    });
                });
            },
            get: function get(query) {
                var that = this, tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node.children[ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node.ids.slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            reset: function reset() {
                this.datums = [];
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;
        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }
        function newNode() {
            return {
                ids: [],
                children: {}
            };
        }
        function unique(array) {
            var seen = {}, uniques = [];
            for (var i = 0; i < array.length; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }
        function getIntersection(arrayA, arrayB) {
            var ai = 0, bi = 0, intersection = [];
            arrayA = arrayA.sort(compare);
            arrayB = arrayB.sort(compare);
            while (ai < arrayA.length && bi < arrayB.length) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
            function compare(a, b) {
                return a - b;
            }
        }
    }();
    var oParser = function() {
        return {
            local: getLocal,
            prefetch: getPrefetch,
            remote: getRemote
        };
        function getLocal(o) {
            return o.local || null;
        }
        function getPrefetch(o) {
            var prefetch, defaults;
            defaults = {
                url: null,
                thumbprint: "",
                ttl: 24 * 60 * 60 * 1e3,
                filter: null,
                ajax: {}
            };
            if (prefetch = o.prefetch || null) {
                prefetch = _.isString(prefetch) ? {
                    url: prefetch
                } : prefetch;
                prefetch = _.mixin(defaults, prefetch);
                prefetch.thumbprint = VERSION + prefetch.thumbprint;
                prefetch.ajax.type = prefetch.ajax.type || "GET";
                prefetch.ajax.dataType = prefetch.ajax.dataType || "json";
                !prefetch.url && $.error("prefetch requires url to be set");
            }
            return prefetch;
        }
        function getRemote(o) {
            var remote, defaults;
            defaults = {
                url: null,
                wildcard: "%QUERY",
                replace: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                send: null,
                filter: null,
                ajax: {}
            };
            if (remote = o.remote || null) {
                remote = _.isString(remote) ? {
                    url: remote
                } : remote;
                remote = _.mixin(defaults, remote);
                remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ? byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);
                remote.ajax.type = remote.ajax.type || "GET";
                remote.ajax.dataType = remote.ajax.dataType || "json";
                delete remote.rateLimitBy;
                delete remote.rateLimitWait;
                !remote.url && $.error("remote requires url to be set");
            }
            return remote;
            function byDebounce(wait) {
                return function(fn) {
                    return _.debounce(fn, wait);
                };
            }
            function byThrottle(wait) {
                return function(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
    }();
    (function(root) {
        var old, keys;
        old = root.Bloodhound;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        root.Bloodhound = Bloodhound;
        function Bloodhound(o) {
            if (!o || !o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.limit = o.limit || 5;
            this.sorter = getSorter(o.sorter);
            this.dupDetector = o.dupDetector || ignoreDuplicates;
            this.local = oParser.local(o);
            this.prefetch = oParser.prefetch(o);
            this.remote = oParser.remote(o);
            this.cacheKey = this.prefetch ? this.prefetch.cacheKey || this.prefetch.url : null;
            this.index = new SearchIndex({
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            this.storage = this.cacheKey ? new PersistentStorage(this.cacheKey) : null;
        }
        Bloodhound.noConflict = function noConflict() {
            root.Bloodhound = old;
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            _loadPrefetch: function loadPrefetch(o) {
                var that = this, serialized, deferred;
                if (serialized = this._readFromStorage(o.thumbprint)) {
                    this.index.bootstrap(serialized);
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.ajax(o.url, o.ajax).done(handlePrefetchResponse);
                }
                return deferred;
                function handlePrefetchResponse(resp) {
                    that.clear();
                    that.add(o.filter ? o.filter(resp) : resp);
                    that._saveToStorage(that.index.serialize(), o.thumbprint, o.ttl);
                }
            },
            _getFromRemote: function getFromRemote(query, cb) {
                var that = this, url, uriEncodedQuery;
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _saveToStorage: function saveToStorage(data, thumbprint, ttl) {
                if (this.storage) {
                    this.storage.set(keys.data, data, ttl);
                    this.storage.set(keys.protocol, location.protocol, ttl);
                    this.storage.set(keys.thumbprint, thumbprint, ttl);
                }
            },
            _readFromStorage: function readFromStorage(thumbprint) {
                var stored = {}, isExpired;
                if (this.storage) {
                    stored.data = this.storage.get(keys.data);
                    stored.protocol = this.storage.get(keys.protocol);
                    stored.thumbprint = this.storage.get(keys.thumbprint);
                }
                isExpired = stored.thumbprint !== thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            _initialize: function initialize() {
                var that = this, local = this.local, deferred;
                deferred = this.prefetch ? this._loadPrefetch(this.prefetch) : $.Deferred().resolve();
                local && deferred.done(addLocalToIndex);
                this.transport = this.remote ? new Transport(this.remote) : null;
                return this.initPromise = deferred.promise();
                function addLocalToIndex() {
                    that.add(_.isFunction(local) ? local() : local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
            },
            get: function get(query, cb) {
                var that = this, matches = [], cacheHit = false;
                matches = this.index.get(query);
                matches = this.sorter(matches).slice(0, this.limit);
                if (matches.length < this.limit && this.transport) {
                    cacheHit = this._getFromRemote(query, returnRemoteMatches);
                }
                if (!cacheHit) {
                    (matches.length > 0 || !this.transport) && cb && cb(matches);
                }
                function returnRemoteMatches(remoteMatches) {
                    var matchesWithBackfill = matches.slice(0);
                    _.each(remoteMatches, function(remoteMatch) {
                        var isDuplicate;
                        isDuplicate = _.some(matchesWithBackfill, function(match) {
                            return that.dupDetector(remoteMatch, match);
                        });
                        !isDuplicate && matchesWithBackfill.push(remoteMatch);
                        return matchesWithBackfill.length < that.limit;
                    });
                    cb && cb(that.sorter(matchesWithBackfill));
                }
            },
            clear: function clear() {
                this.index.reset();
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.storage && this.storage.clear();
            },
            clearRemoteCache: function clearRemoteCache() {
                this.transport && Transport.resetCache();
            },
            ttAdapter: function ttAdapter() {
                return _.bind(this.get, this);
            }
        });
        return Bloodhound;
        function getSorter(sortFn) {
            return _.isFunction(sortFn) ? sort : noSort;
            function sort(array) {
                return array.sort(sortFn);
            }
            function noSort(array) {
                return array;
            }
        }
        function ignoreDuplicates() {
            return false;
        }
    })(this);
    var html = {
        wrapper: '<span class="twitter-typeahead"></span>',
        dropdown: '<span class="tt-dropdown-menu"></span>',
        dataset: '<div class="tt-dataset-%CLASS%"></div>',
        suggestions: '<span class="tt-suggestions"></span>',
        suggestion: '<div class="tt-suggestion"></div>'
    };
    var css = {
        wrapper: {
            position: "relative",
            display: "inline-block"
        },
        hint: {
            position: "absolute",
            top: "0",
            left: "0",
            borderColor: "transparent",
            boxShadow: "none"
        },
        input: {
            position: "relative",
            verticalAlign: "top",
            backgroundColor: "transparent"
        },
        inputWithNoHint: {
            position: "relative",
            verticalAlign: "top"
        },
        dropdown: {
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: "100",
            display: "none"
        },
        suggestions: {
            display: "block"
        },
        suggestion: {
            whiteSpace: "nowrap",
            cursor: "pointer"
        },
        suggestionChild: {
            whiteSpace: "normal"
        },
        ltr: {
            left: "0",
            right: "auto"
        },
        rtl: {
            left: "auto",
            right: " 0"
        }
    };
    if (_.isMsie()) {
        _.mixin(css.input, {
            backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
        });
    }
    if (_.isMsie() && _.isMsie() <= 7) {
        _.mixin(css.input, {
            marginTop: "-1px"
        });
    }
    var EventBus = function() {
        var namespace = "typeahead:";
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        var splitter = /\s+/, nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };
        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }
        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }
        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }
        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }
        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }
        function getFlush(callbacks, context, args) {
            return flush;
            function flush() {
                var cancelled;
                for (var i = 0; !cancelled && i < callbacks.length; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }
        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }
        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);
            function hightlightTextNode(textNode) {
                var match, patternNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }
            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };
        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [], regexStr;
            for (var i = 0; i < patterns.length; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };
        function Input(o) {
            var that = this, onBlur, onFocus, onKeydown, onInput;
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            onBlur = _.bind(this._onBlur, this);
            onFocus = _.bind(this._onFocus, this);
            onKeydown = _.bind(this._onKeydown, this);
            onInput = _.bind(this._onInput, this);
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
            if (!_.isMsie()) {
                this.$input.on("input.tt", onInput);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    _.defer(_.bind(that._onInput, that, $e));
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        Input.normalizeQuery = function(str) {
            return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._checkInputValue();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault, hintValue, inputValue;
                switch (keyName) {
                  case "tab":
                    hintValue = this.getHint();
                    inputValue = this.getInputValue();
                    preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
                    break;

                  case "up":
                  case "down":
                    preventDefault = !withModifier($e);
                    break;

                  default:
                    preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                  case "tab":
                    trigger = !withModifier($e);
                    break;

                  default:
                    trigger = true;
                }
                return trigger;
            },
            _checkInputValue: function checkInputValue() {
                var inputValue, areEquivalent, hasDifferentWhitespace;
                inputValue = this.getInputValue();
                areEquivalent = areQueriesEquivalent(inputValue, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== inputValue.length : false;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query = inputValue);
                } else if (hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getQuery: function getQuery() {
                return this.query;
            },
            setQuery: function setQuery(query) {
                this.query = query;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value, silent) {
                this.$input.val(value);
                silent ? this.clearHint() : this._checkInputValue();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query, true);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            getLanguageDirection: function getLanguageDirection() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            }
        });
        return Input;
        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }
        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        var datasetKey = "ttDataset", valueKey = "ttValue", datumKey = "ttDatum";
        function Dataset(o) {
            o = o || {};
            o.templates = o.templates || {};
            if (!o.source) {
                $.error("missing source");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            this.query = null;
            this.highlight = !!o.highlight;
            this.name = o.name || _.getUniqueId();
            this.source = o.source;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.$el = $(html.dataset.replace("%CLASS%", this.name));
        }
        Dataset.extractDatasetName = function extractDatasetName(el) {
            return $(el).data(datasetKey);
        };
        Dataset.extractValue = function extractDatum(el) {
            return $(el).data(valueKey);
        };
        Dataset.extractDatum = function extractDatum(el) {
            return $(el).data(datumKey);
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _render: function render(query, suggestions) {
                if (!this.$el) {
                    return;
                }
                var that = this, hasSuggestions;
                this.$el.empty();
                hasSuggestions = suggestions && suggestions.length;
                if (!hasSuggestions && this.templates.empty) {
                    this.$el.html(getEmptyHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                } else if (hasSuggestions) {
                    this.$el.html(getSuggestionsHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                }
                this.trigger("rendered");
                function getEmptyHtml() {
                    return that.templates.empty({
                        query: query,
                        isEmpty: true
                    });
                }
                function getSuggestionsHtml() {
                    var $suggestions, nodes;
                    $suggestions = $(html.suggestions).css(css.suggestions);
                    nodes = _.map(suggestions, getSuggestionNode);
                    $suggestions.append.apply($suggestions, nodes);
                    that.highlight && highlight({
                        node: $suggestions[0],
                        pattern: query
                    });
                    return $suggestions;
                    function getSuggestionNode(suggestion) {
                        var $el;
                        $el = $(html.suggestion).append(that.templates.suggestion(suggestion)).data(datasetKey, that.name).data(valueKey, that.displayFn(suggestion)).data(datumKey, suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        return $el;
                    }
                }
                function getHeaderHtml() {
                    return that.templates.header({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
                function getFooterHtml() {
                    return that.templates.footer({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
            },
            getRoot: function getRoot() {
                return this.$el;
            },
            update: function update(query) {
                var that = this;
                this.query = query;
                this.canceled = false;
                this.source(query, render);
                function render(suggestions) {
                    if (!that.canceled && query === that.query) {
                        that._render(query, suggestions);
                    }
                }
            },
            cancel: function cancel() {
                this.canceled = true;
            },
            clear: function clear() {
                this.cancel();
                this.$el.empty();
                this.trigger("rendered");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = null;
            }
        });
        return Dataset;
        function getDisplayFn(display) {
            display = display || "value";
            return _.isFunction(display) ? display : displayFn;
            function displayFn(obj) {
                return obj[display];
            }
        }
        function getTemplates(templates, displayFn) {
            return {
                empty: templates.empty && _.templatify(templates.empty),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };
            function suggestionTemplate(context) {
                return "<p>" + displayFn(context) + "</p>";
            }
        }
        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Dropdown = function() {
        function Dropdown(o) {
            var that = this, onSuggestionClick, onSuggestionMouseEnter, onSuggestionMouseLeave;
            o = o || {};
            if (!o.menu) {
                $.error("menu is required");
            }
            this.isOpen = false;
            this.isEmpty = true;
            this.datasets = _.map(o.datasets, initializeDataset);
            onSuggestionClick = _.bind(this._onSuggestionClick, this);
            onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
            onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
            this.$menu = $(o.menu).on("click.tt", ".tt-suggestion", onSuggestionClick).on("mouseenter.tt", ".tt-suggestion", onSuggestionMouseEnter).on("mouseleave.tt", ".tt-suggestion", onSuggestionMouseLeave);
            _.each(this.datasets, function(dataset) {
                that.$menu.append(dataset.getRoot());
                dataset.onSync("rendered", that._onRendered, that);
            });
        }
        _.mixin(Dropdown.prototype, EventEmitter, {
            _onSuggestionClick: function onSuggestionClick($e) {
                this.trigger("suggestionClicked", $($e.currentTarget));
            },
            _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
                this._removeCursor();
                this._setCursor($($e.currentTarget), true);
            },
            _onSuggestionMouseLeave: function onSuggestionMouseLeave() {
                this._removeCursor();
            },
            _onRendered: function onRendered() {
                this.isEmpty = _.every(this.datasets, isDatasetEmpty);
                this.isEmpty ? this._hide() : this.isOpen && this._show();
                this.trigger("datasetRendered");
                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _hide: function() {
                this.$menu.hide();
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _getSuggestions: function getSuggestions() {
                return this.$menu.find(".tt-suggestion");
            },
            _getCursor: function getCursor() {
                return this.$menu.find(".tt-cursor").first();
            },
            _setCursor: function setCursor($el, silent) {
                $el.first().addClass("tt-cursor");
                !silent && this.trigger("cursorMoved");
            },
            _removeCursor: function removeCursor() {
                this._getCursor().removeClass("tt-cursor");
            },
            _moveCursor: function moveCursor(increment) {
                var $suggestions, $oldCursor, newCursorIndex, $newCursor;
                if (!this.isOpen) {
                    return;
                }
                $oldCursor = this._getCursor();
                $suggestions = this._getSuggestions();
                this._removeCursor();
                newCursorIndex = $suggestions.index($oldCursor) + increment;
                newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
                if (newCursorIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (newCursorIndex < -1) {
                    newCursorIndex = $suggestions.length - 1;
                }
                this._setCursor($newCursor = $suggestions.eq(newCursorIndex));
                this._ensureVisible($newCursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, menuScrollTop, menuHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                menuScrollTop = this.$menu.scrollTop();
                menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            close: function close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this._removeCursor();
                    this._hide();
                    this.trigger("closed");
                }
            },
            open: function open() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$menu.css(dir === "ltr" ? css.ltr : css.rtl);
            },
            moveCursorUp: function moveCursorUp() {
                this._moveCursor(-1);
            },
            moveCursorDown: function moveCursorDown() {
                this._moveCursor(+1);
            },
            getDatumForSuggestion: function getDatumForSuggestion($el) {
                var datum = null;
                if ($el.length) {
                    datum = {
                        raw: Dataset.extractDatum($el),
                        value: Dataset.extractValue($el),
                        datasetName: Dataset.extractDatasetName($el)
                    };
                }
                return datum;
            },
            getDatumForCursor: function getDatumForCursor() {
                return this.getDatumForSuggestion(this._getCursor().first());
            },
            getDatumForTopSuggestion: function getDatumForTopSuggestion() {
                return this.getDatumForSuggestion(this._getSuggestions().first());
            },
            update: function update(query) {
                _.each(this.datasets, updateDataset);
                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.isEmpty = true;
                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            isVisible: function isVisible() {
                return this.isOpen && !this.isEmpty;
            },
            destroy: function destroy() {
                this.$menu.off(".tt");
                this.$menu = null;
                _.each(this.datasets, destroyDataset);
                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Dropdown;
        function initializeDataset(oDataset) {
            return new Dataset(oDataset);
        }
    }();
    var Typeahead = function() {
        var attrsKey = "ttAttrs";
        function Typeahead(o) {
            var $menu, $input, $hint;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            this.isActivated = false;
            this.autoselect = !!o.autoselect;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.$node = buildDomStructure(o.input, o.withHint);
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-input");
            $hint = this.$node.find(".tt-hint");
            $input.on("blur.tt", function($e) {
                var active, isActive, hasActive;
                active = document.activeElement;
                isActive = $menu.is(active);
                hasActive = $menu.has(active).length > 0;
                if (_.isMsie() && (isActive || hasActive)) {
                    $e.preventDefault();
                    $e.stopImmediatePropagation();
                    _.defer(function() {
                        $input.focus();
                    });
                }
            });
            $menu.on("mousedown.tt", function($e) {
                $e.preventDefault();
            });
            this.eventBus = o.eventBus || new EventBus({
                el: $input
            });
            this.dropdown = new Dropdown({
                menu: $menu,
                datasets: o.datasets
            }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onAsync("datasetRendered", this._onDatasetRendered, this);
            this.input = new Input({
                input: $input,
                hint: $hint
            }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
            this._setLanguageDirection();
        }
        _.mixin(Typeahead.prototype, {
            _onSuggestionClicked: function onSuggestionClicked(type, $el) {
                var datum;
                if (datum = this.dropdown.getDatumForSuggestion($el)) {
                    this._select(datum);
                }
            },
            _onCursorMoved: function onCursorMoved() {
                var datum = this.dropdown.getDatumForCursor();
                this.input.setInputValue(datum.value, true);
                this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
            },
            _onCursorRemoved: function onCursorRemoved() {
                this.input.resetInputValue();
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered() {
                this._updateHint();
            },
            _onOpened: function onOpened() {
                this._updateHint();
                this.eventBus.trigger("opened");
            },
            _onClosed: function onClosed() {
                this.input.clearHint();
                this.eventBus.trigger("closed");
            },
            _onFocused: function onFocused() {
                this.isActivated = true;
                this.dropdown.open();
            },
            _onBlurred: function onBlurred() {
                this.isActivated = false;
                this.dropdown.empty();
                this.dropdown.close();
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var cursorDatum, topSuggestionDatum;
                cursorDatum = this.dropdown.getDatumForCursor();
                topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
                if (cursorDatum) {
                    this._select(cursorDatum);
                    $e.preventDefault();
                } else if (this.autoselect && topSuggestionDatum) {
                    this._select(topSuggestionDatum);
                    $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var datum;
                if (datum = this.dropdown.getDatumForCursor()) {
                    this._select(datum);
                    $e.preventDefault();
                } else {
                    this._autocomplete(true);
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.dropdown.close();
                this.input.resetInputValue();
            },
            _onUpKeyed: function onUpKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorUp();
                this.dropdown.open();
            },
            _onDownKeyed: function onDownKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorDown();
                this.dropdown.open();
            },
            _onLeftKeyed: function onLeftKeyed() {
                this.dir === "rtl" && this._autocomplete();
            },
            _onRightKeyed: function onRightKeyed() {
                this.dir === "ltr" && this._autocomplete();
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this.input.clearHintIfInvalid();
                query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.empty();
                this.dropdown.open();
                this._setLanguageDirection();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
                this.dropdown.open();
            },
            _setLanguageDirection: function setLanguageDirection() {
                var dir;
                if (this.dir !== (dir = this.input.getLanguageDirection())) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdown.setLanguageDirection(dir);
                }
            },
            _updateHint: function updateHint() {
                var datum, val, query, escapedQuery, frontMatchRegEx, match;
                datum = this.dropdown.getDatumForTopSuggestion();
                if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
                    val = this.input.getInputValue();
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(datum.value);
                    match ? this.input.setHint(val + match[1]) : this.input.clearHint();
                } else {
                    this.input.clearHint();
                }
            },
            _autocomplete: function autocomplete(laxCursor) {
                var hint, query, isCursorAtEnd, datum;
                hint = this.input.getHint();
                query = this.input.getQuery();
                isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
                if (hint && query !== hint && isCursorAtEnd) {
                    datum = this.dropdown.getDatumForTopSuggestion();
                    datum && this.input.setInputValue(datum.value);
                    this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
                }
            },
            _select: function select(datum) {
                this.input.setQuery(datum.value);
                this.input.setInputValue(datum.value, true);
                this._setLanguageDirection();
                this.eventBus.trigger("selected", datum.raw, datum.datasetName);
                this.dropdown.close();
                _.defer(_.bind(this.dropdown.empty, this.dropdown));
            },
            open: function open() {
                this.dropdown.open();
            },
            close: function close() {
                this.dropdown.close();
            },
            setVal: function setVal(val) {
                if (this.isActivated) {
                    this.input.setInputValue(val);
                } else {
                    this.input.setQuery(val);
                    this.input.setInputValue(val, true);
                }
                this._setLanguageDirection();
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            destroy: function destroy() {
                this.input.destroy();
                this.dropdown.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            }
        });
        return Typeahead;
        function buildDomStructure(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder").prop("disabled", true).attr({
                autocomplete: "off",
                spellcheck: "false"
            });
            $input.data(attrsKey, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-input").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(withHint ? css.input : css.inputWithNoHint);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend(withHint ? $hint : null).append($dropdown);
        }
        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }
        function destroyDomStructure($node) {
            var $input = $node.find(".tt-input");
            _.each($input.data(attrsKey), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData(attrsKey).removeClass("tt-input").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        var old, typeaheadKey, methods;
        old = $.fn.typeahead;
        typeaheadKey = "ttTypeahead";
        methods = {
            initialize: function initialize(o, datasets) {
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                return this.each(attach);
                function attach() {
                    var $input = $(this), eventBus, typeahead;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    typeahead = new Typeahead({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
                        minLength: o.minLength,
                        autoselect: o.autoselect,
                        datasets: datasets
                    });
                    $input.data(typeaheadKey, typeahead);
                }
            },
            open: function open() {
                return this.each(openTypeahead);
                function openTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.open();
                    }
                }
            },
            close: function close() {
                return this.each(closeTypeahead);
                function closeTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.close();
                    }
                }
            },
            val: function val(newVal) {
                return !arguments.length ? getVal(this.first()) : this.each(setVal);
                function setVal() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.setVal(newVal);
                    }
                }
                function getVal($input) {
                    var typeahead, query;
                    if (typeahead = $input.data(typeaheadKey)) {
                        query = typeahead.getVal();
                    }
                    return query;
                }
            },
            destroy: function destroy() {
                return this.each(unattach);
                function unattach() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.destroy();
                        $input.removeData(typeaheadKey);
                    }
                }
            }
        };
        $.fn.typeahead = function(method) {
            if (methods[method]) {
                return methods[method].apply(this, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
    })();
})(window.jQuery);
},{}],"/home/eric/Documents/596/urbanreviewer/urbanreviewer/node_modules/underscore/underscore.js":[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}]},{},["/home/eric/Documents/596/urbanreviewer/urbanreviewer/js/main.js"]);
