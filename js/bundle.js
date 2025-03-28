(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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



},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
/*!
	Colorbox v1.5.9 - 2014-04-25
	jQuery lightbox and modal window plugin
	(c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(z+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in x[0]&&!x[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),x.focus())}function c(t){c.str!==t&&(x.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){z=0,e&&e!==!1?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),z=W.index(_.el),-1===z&&(W=W.add(_.el),z=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data("colorbox"),_=new r(i,o),g(_.get("rel")),!$){$=q=!0,c(_.get("className")),x.css({visibility:"hidden",display:"block",opacity:""}),L=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(L),D=T.height()+k.height()+b.outerHeight(!0)-b.height(),j=C.width()+H.width()+b.outerWidth(!0)-b.width(),A=L.outerHeight(!0),N=L.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=(l!==!1?Math.min(h,a(l,"x")):h)-N-j,_.h=(f!==!1?Math.min(s,a(f,"y")):s)-A-D,L.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(I).hide(),x.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}v.css({opacity:parseFloat(_.get("opacity"))||"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){!x&&e.body&&(V=!1,E=t(i),x=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),S=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),y=n(se,"Wrapper"),b=n(se,"Content").append(I=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),F=n("button","Slideshow"),S),B=t('<button type="button"/>').attr({id:Z+"Close"}),y.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(F),t(e.body).append(v,x.append(y,M)))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return x?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;$&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),$&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if(q=!0,U=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-A-D:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-N-j:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-N-j,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-A-D,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){S.show()},100),_.get("inline")){var c=t(e);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),U=new Image,t(U).addClass(Z+"Photo").bind("error",function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;t.each(["alt","longdesc","aria-describedby"],function(e,i){var n=t(_.el).attr(i)||t(_.el).attr("data-"+i);n&&U.setAttribute(i,n)}),_.get("retinaImage")&&i.devicePixelRatio>1&&(U.height=U.height/i.devicePixelRatio,U.width=U.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){U.height-=U.height*e,U.width-=U.width*e},_.mw&&U.width>_.mw&&(e=(U.width-_.mw)/U.width,o()),_.mh&&U.height>_.mh&&(e=(U.height-_.mh)/U.height,o())),_.h&&(U.style.marginTop=Math.max(_.mh-U.height,0)/2+"px"),W[1]&&(_.get("loop")||W[z+1])&&(U.style.cursor="pointer",U.onclick=function(){J.next()}),U.style.width=U.width+"px",U.style.height=U.height+"px",h(U)},1)}),U.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,x,y,b,T,C,H,k,W,E,L,M,S,I,R,F,K,P,B,O,_,D,j,A,N,z,U,$,q,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[z+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){F.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),x.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),F.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),x.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,F.hide(),t(),ae.unbind(ne,e).unbind(ie,t),x.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),F.show())}}();t.colorbox||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;if(e=e||{},t.isFunction(o))o=t("<a/>"),e.open=!0;else if(!o[0])return o;return o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(x[0].style.width,10)-j+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(x[0].style.height,10)-D+"px"}var r,h,s,l=0,d=0,c=x.offset();if(E.unbind("resize."+Z),x.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,x.css({position:"fixed"})):(l=h,d=s,x.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-N-j-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-N-j,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-A-D-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-A-D,0)/2),x.css({top:c.top,left:c.left,visibility:"visible"}),y[0].style.width=y[0].style.height="9999px",r={width:_.w+N+j,height:_.h+A+D,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||x.css(r),x.dequeue().animate(r,{duration:e||0,complete:function(){n(),q=!1,y[0].style.width=_.w+N+j+"px",y[0].style.height=_.h+A+D+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),i&&i()},step:n})},J.resize=function(t){var e;$&&(t=t||{},t.width&&(_.w=a(t.width,"x")-N-j),t.innerWidth&&(_.w=a(t.innerWidth,"x")),L.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-A-D),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=L.scrollTop(),L.css({height:"auto"}),_.h=L.height()),L.css({height:_.h}),e&&L.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||L.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||L.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if($){var d,g="none"===_.get("transition")?0:_.get("speed");L.remove(),L=n(se,"LoadedContent").append(i),L.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(U).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&x[0].style.removeAttribute("filter")}var n,o,a=W.length;$&&(o=function(){clearTimeout(Q),S.hide(),u(ne),_.get("onComplete")},I.html(_.get("title")).show(),L.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",z+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>z?"show":"hide"]().html(_.get("next")),P[_.get("loop")||z?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=e.createElement("iframe"),"frameBorder"in n&&(n.frameBorder=0),"allowTransparency"in n&&(n.allowTransparency="true"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),name:(new Date).getTime(),"class":Z+"Iframe",allowFullScreen:!0}).one("load",o).appendTo(L),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?x.fadeTo(g,1,i):i())},"fade"===_.get("transition")?x.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!q&&W[1]&&(_.get("loop")||W[z+1])&&(z=h(1),f(W[z]))},J.prev=function(){!q&&W[1]&&(_.get("loop")||z)&&(z=h(-1),f(W[z]))},J.close=function(){$&&!G&&(G=!0,$=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),x.stop().fadeTo(_.get("fadeOut")||0,0,function(){x.hide(),v.hide(),u(he),L.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){x&&(x.stop(),t.colorbox.close(),x.stop().remove(),v.remove(),G=!1,x=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);
},{}],12:[function(require,module,exports){
/**
 * Copyright (c) 2007-2014 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.12
 */
;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var j=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};j.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};j.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(f,g,h){if(typeof g=='object'){h=g;g=0}if(typeof h=='function')h={onAfter:h};if(f=='max')f=9e9;h=$.extend({},j.defaults,h);g=g||h.duration;h.queue=h.queue&&h.axis.length>1;if(h.queue)g/=2;h.offset=both(h.offset);h.over=both(h.over);return this._scrollable().each(function(){if(f==null)return;var d=this,$elem=$(d),targ=f,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}var e=$.isFunction(h.offset)&&h.offset(d,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=j.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=e[pos]||0;if(h.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*h.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&h.queue){if(old!=attr[key])animate(h.onAfterFirst);delete attr[key]}});animate(h.onAfter);function animate(a){$elem.animate(attr,g,h.easing,a&&function(){a.call(this,targ,h)})}}).end()};j.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||typeof a=='object'?a:{top:a,left:a}};return j}));

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
var _ = require('underscore');
var plansmap = require('./plansmap');

var eventEmitter = $({});
var state = {};

var minYear = 1952,
    maxYear = (new Date()).getFullYear();

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
                    const selected = $(this).find(':selected'),
                        lastUpdatedMin = selected.data('min'),
                        lastUpdatedMax = selected.data('max');
                    updateState({ lastUpdatedMin, lastUpdatedMax });
                    plansmap.filterLotsLayer({ lastUpdatedMin, lastUpdatedMax }, true);
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

},{"./plansmap":25,"underscore":54}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
const { buffer } = require('@turf/buffer');
const { convex } = require('@turf/convex');
const { featureCollection } = require('@turf/helpers');

module.exports = {
  convexBuffer: function (features) {
    return buffer(convex(featureCollection(features)), 25, { units: 'feet' });
  },
};

},{"@turf/buffer":29,"@turf/convex":31,"@turf/helpers":32}],18:[function(require,module,exports){
var _ = require('underscore');
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

    /*
     * Parse hash for the map. Based on OSM's parseHash.
     */
    parseHash: function(hash) {
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

    /*
     * Format hash for the map. Based on OSM's formatHash.
     */
    formatHash: function(options) {
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

},{"jsurl":38,"querystring":48,"underscore":54}],19:[function(require,module,exports){
//
// highlights
//
// Highlighting parcels on the map by disposition or current state.
//
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

},{"./plansmap":25,"underscore":54}],20:[function(require,module,exports){
require('bootstrap.tooltip');

var filters = require('./filters');
var hash = require('./hash');
var highlights = require('./highlights');
var pages = require('./pages');
var plansdata = require('./plansdata');
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
            search.update();
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

    const startYear = 1950;
    const currentYear = new Date().getFullYear();
    const decades = [];

    let nextDecade = startYear;
    do {
        decades.push([nextDecade, nextDecade + 9]);
        nextDecade += 10;
    } while (nextDecade < currentYear);

    var $content = $(template({ decades }));
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

async function initData() {
    return await plansdata.init();
}

async function initInterface() {
    require('./gallery').init();

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
            console.log('click', data);
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
        plansmap.addPlanOutline(currentPlan, { label: 'select', zoomToPlan: true });
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
}

$(document).ready(function () {
    initData().then(function () {
        initInterface();
    });
});

},{"../bower_components/jqrangeslider/jQDateRangeSlider":3,"../bower_components/jqrangeslider/jQDateRangeSliderHandle":4,"../bower_components/jqrangeslider/jQRangeSlider":5,"../bower_components/jqrangeslider/jQRangeSliderBar":6,"../bower_components/jqrangeslider/jQRangeSliderDraggable":7,"../bower_components/jqrangeslider/jQRangeSliderHandle":8,"../bower_components/jqrangeslider/jQRangeSliderLabel":9,"../bower_components/jqrangeslider/jQRangeSliderMouseTouch":10,"./filters":14,"./gallery":15,"./hash":18,"./highlights":19,"./pages":21,"./planlist":22,"./plans":23,"./plansdata":24,"./plansmap":25,"./search":26,"./sidebar":27,"bootstrap.tooltip":2}],21:[function(require,module,exports){
//
// pages
//
// Load content pages and set up the navigation bar
//
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

            // Make sections for each h2 in the page content
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

            // Links that go in the sidebar
            $('.page-nav').width($('.page-nav-column').width());
            $('.page-nav a').click(function () {
                scrollToSection($(this).attr('href'));
                return false;
            });

            $('body').trigger('pageloaded');
        });
    }

};

},{"./sidebar":27,"jquery.scrollTo":12}],22:[function(require,module,exports){
var plansdata = require('./plansdata');
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
    return callback(plansdata.getPlans(filters, extend));
}

module.exports = {
    addToPage: addToPage,
    load: load
};

},{"./plansdata":24,"./plansmap":25}],23:[function(require,module,exports){
require('bootstrap.carousel');
require('jquery.colorbox');
require('jquery.scrollTo');
var _ = require('underscore');
var plansdata = require('./plansdata');
var plansmap = require('./plansmap');
var sidebar = require('./sidebar');

var scrollToHeight;

function addPlanContent($location, borough, planName) {
    var planDirectory = 'plans/' + borough + '/' + encodeURIComponent(planName.replace('/', '-')) + '/';
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

function loadLots($target, planName) {
    const lots = {
        rows: plansdata.getPlanLots(planName)
            .map(l => ({
                ...l.properties,
                borough_code: l.properties.bbl.slice(0, 1),
                disposition: l.properties.disposition_display,
            }))
    };

    const lots_template = JST['handlebars_templates/lots.hbs'];
    const content = lots_template(lots);

    $target.append(content);
    $('.lot-count').text(lots.rows.length);

    $('.lot').on({
        mouseenter: function () {
            plansmap.highlightLot($(this).data());
        },
        mouseleave: function () {
            plansmap.unHighlightLot();
        }
    });
}

function cleanData(row) {
    cleaned = _.extend({}, row);

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

    load: async function ($target, options) {
        sidebar.open();
        let row = plansdata.getPlan(options.plan_name);
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

},{"./plansdata":24,"./plansmap":25,"./sidebar":27,"bootstrap.carousel":1,"jquery.colorbox":11,"jquery.scrollTo":12,"underscore":54}],24:[function(require,module,exports){
let plans = [];
let lots = {};
let previousFilters = {};

async function loadPlans(success) {
    const r = await fetch('static/plans.json');
    return await r.json();
}

async function loadAllLots(success) {
    const r = await fetch('static/lots.json');
    return await r.json();
}

function getPlanLots(planName) {
    return lots.features.filter(f => f.properties.plan_name === planName);
}

module.exports = {
    init: async function () {
        plans = (await loadPlans());
        plans = plans.map(p => ({
            ...p,
            adopted: p.adopted ? p.adopted.split('-')[0] : null,
            updated: p.updated ? p.updated.split('-')[0] : null,
        }));
        lots = (await loadAllLots());
        lots.features = lots.features.map(l => {
            const plan = plans.find(p => p.cartodb_id === l.properties.plan_id);
            return {
                ...l,
                properties: {
                    ...l.properties,
                    borough: plan ? plan.borough : null,
                    plan_name: plan ? plan.name : null,
                },
            };
        });
    },

    getLots: function () {
        return lots;
    },

    getPlanLots,

    getPlan(planName) {
        const plan = plans.find(p => p.name === planName);
        if (plan) {
            plan.last_updated = plan.updated;
        }
        return plan;
    },

    getPlans: function (filters, extend) {
        let f = { ...filters };
        if (extend === undefined || extend) {
            f = { ...previousFilters, ...f };
        }

        const planMatches = (p) => {
            return (
                (!f.active || p.status === 'active') &&
                (!f.expired || p.status === 'expired') &&
                (!f.start || p.adopted >= '' + f.start) &&
                (!f.end || p.adopted <= '' + f.end) &&
                (!f.lastUpdatedMin || p.updated >= '' + f.lastUpdatedMin) &&
                (!f.lastUpdatedMax || p.updated < '' + f.lastUpdatedMax)
            );
        };

        previousFilters = f;
        return plans.filter(planMatches).toSorted((a, b) => a.name.localeCompare(b.name));
    },

    getNames: function (filters) {
        return this.getPlans(filters).map(p => p.name);
    },
};

},{}],25:[function(require,module,exports){
var geotransforms = require('./geotransforms');
var plansdata = require('./plansdata');
require('leaflet-active-area');
require('leaflet-plugins/layer/tile/Bing');

require('../bower_components/leaflet-usermarker/src/leaflet.usermarker');

var map,
    currentMode = 'daymode',
    currentPlan,
    filters = {},
    lotsLayer,
    hiddenLots = [], // Lots filtered out
    highlightedLots = [],
    planOutlines = {},
    planOutlinesNames = {},
    planOutlinesPopups = {},
    userMarker;

function updateStyle(lotFeature, opts = {}) {
    const { dispositions, mode, plan, public_vacant } = opts;

    let newStyle = {
        color: 'black',
        weight: 0.5,
        opacity: 0.75,
        fillColor: 'black',
        fillOpacity: 0.5,
    };

    if (mode === 'nightmode') {
        newStyle.color = newStyle.fillColor = 'white';
    }

    if (plan && lotFeature.feature.properties.plan_name === plan) {
        newStyle.fillColor = '#F9EF6C';
    }

    if (dispositions && dispositions.length > 0 || public_vacant) {
        const { disposition_filterable, in_596 } = lotFeature.feature.properties;
        let matchesFilters = (
            (
                (dispositions && dispositions.length === 0) ||
                dispositions.includes(disposition_filterable)
            ) && (!public_vacant || in_596)
        );

        if (matchesFilters) {
            newStyle.color = newStyle.fillColor = '#CFA470';
        }
    }

    lotFeature.setStyle(newStyle);
}

function updateStyles() {
    // Update the plan's styles using the current state
    const opts = {
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    };
    lotsLayer.getLayers().forEach(l => updateStyle(l, opts));
}

function unHighlightLot(e) {
    if (!planOutlinesPopups.hover) {
        map.closePopup();
    }

    const opts = {
        dispositions: filters.dispositions,
        mode: currentMode,
        plan: currentPlan,
        public_vacant: filters.publicVacant,
    };
    highlightedLots.forEach(l => updateStyle(l, opts));
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

        var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}', {
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
            detectRetina: true,
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: 'urbanreviewer/ckatva3cz2g8d1itdu51tt3zt',
            accessToken: 'pk.eyJ1IjoidXJiYW5yZXZpZXdlciIsImEiOiJDeWJrNG1zIn0.WcU_wA3WIwvkFy178qe3-w'
        }).addTo(map);

        var satellite = new L.BingLayer('Ajio1n0EgmAAvT3zLndCpHrYR_LHJDgfDU6B0tV_1RClr7OFLzy4RnkLXlSdkJ_x');

        var baseLayers = {
            streets: streets,
            satellite: satellite
        };

        L.control.layers(baseLayers, {}, {
            position: 'bottomleft'
        }).addTo(map);

        lotsLayer = L.geoJson(plansdata.getLots(), {
            style: f => {
                return {
                    color: 'black',
                    weight: 0.5,
                    opacity: 0.75,
                    fillOpacity: 0.5,
                };
            },
        }).addTo(map);

        lotsLayer.on('click', (e) => {
            map.fire('planlotclick', e.layer.feature.properties);
        });

        lotsLayer.on('mouseover', (e) => {
            map.fire('planlotover', e.layer.feature.properties);
        });

        lotsLayer.on('mouseout', (e) => {
            map.fire('planlotout', e.layer.feature.properties);
        });

        onLotsLayerReady();

        // map.whenReady(() => streets.bringToBack());
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
        const filteredPlanIds = plansdata.getPlans(filters, extendLastFilters).map(p => p.cartodb_id);

        // Lots to remove from map
        const toRemove = lotsLayer.getLayers().filter(l => {
            return !filteredPlanIds.includes(l.feature.properties.plan_id);
        });

        // Lots to bring back from hidden area
        const toAdd = hiddenLots.filter(l => {
            return filteredPlanIds.includes(l.feature.properties.plan_id);
        });

        const toAddIds = toAdd.map(l => l.feature.properties.cartodb_id);
        toAdd.forEach(l => lotsLayer.addLayer(l));
        hiddenLots = hiddenLots.filter(l => !toAddIds.includes(l.feature.properties.cartodb_id));

        toRemove.forEach(l => {
            lotsLayer.removeLayer(l);
            hiddenLots.push(l);
        });
    },

    highlightLot: function (options) {
        unHighlightLot();

        lotsLayer.getLayers().forEach(l => {
            const { block, borough, lot, plan_name } = l.feature.properties;

            let matches = (
                (!options.block || block === options.block) &&
                (!options.borough || borough === options.borough) &&
                (!options.lot || lot === options.lot) &&
                (!options.plan_name || plan_name === options.plan_name)
            );
            
            if (matches) {
                highlightedLots.push(l);
                l.setStyle({
                    color: '#000',
                    weight: 3
                });
            }
        });
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
                style: function () {
                    var strokeColor = $('body').is('.night-mode') ? '#fff' : '#000';
                    return {
                        interactive: label !== 'select',
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
                        planOutlines[label].getLayers().forEach(l => {
                            l.setStyle({ interactive: false, fillOpacity: 0 });
                        });
                        map.fire('planclick', { plan_name: planOutlinesNames[label] });
                    });
            }
        }

        planOutlinesNames[label] = planName;

        const buffer = geotransforms.convexBuffer(plansdata.getPlanLots(planName));

        outline.addData(buffer);
            
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

},{"../bower_components/leaflet-usermarker/src/leaflet.usermarker":13,"./geotransforms":17,"./plansdata":24,"leaflet-active-area":40,"leaflet-plugins/layer/tile/Bing":41}],26:[function(require,module,exports){
var filters = require('./filters');
var geocode = require('./geocode');
var plansdata = require('./plansdata');
require('typeahead.js');

var plansBloodhound;

module.exports = {
    init: function (selector) {
        plansBloodhound = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 10,
            local: plansdata.getNames(filters.getState()).map(name => ({ name })),
        });
        plansBloodhound.initialize();

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

        $(selector).on('keyup', function (e) {
            if (e.keyCode === 13) {
                search(selector, $(selector).val());
            }
        });

        $(selector).on('typeahead:selected', function (e, suggestion) {
            $(selector).trigger('planfound', suggestion.name);
        });
        $(selector).on('typeahead:autocompleted', function (e, suggestion) {
            $(selector).trigger('planfound', suggestion.name);
        });
    },

    search: function (selector, q) {
        geocode.geocode(q, [-74.402161, 40.475158, -73.642731, 40.984045], 'NY',
            function (results, status) {
                if (status === 'OK') {
                    $(selector).trigger('resultfound', results);
                }
            }
        );
    },

    update: function () {
        plansBloodhound.clear();
        plansBloodhound.add(plansdata.getNames(filters.getState()).map(name => ({ name })));
    }
};

},{"./filters":14,"./geocode":16,"./plansdata":24,"typeahead.js":53}],27:[function(require,module,exports){
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

},{"underscore":54}],28:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// index.ts
var _meta = require('@turf/meta');
function bbox(geojson, options = {}) {
  if (geojson.bbox != null && true !== options.recompute) {
    return geojson.bbox;
  }
  const result = [Infinity, Infinity, -Infinity, -Infinity];
  _meta.coordEach.call(void 0, geojson, (coord) => {
    if (result[0] > coord[0]) {
      result[0] = coord[0];
    }
    if (result[1] > coord[1]) {
      result[1] = coord[1];
    }
    if (result[2] < coord[0]) {
      result[2] = coord[0];
    }
    if (result[3] < coord[1]) {
      result[3] = coord[1];
    }
  });
  return result;
}
var turf_bbox_default = bbox;



exports.bbox = bbox; exports.default = turf_bbox_default;

},{"@turf/meta":34}],29:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// index.js
var _center = require('@turf/center');
var _jsts = require('@turf/jsts'); var _jsts2 = _interopRequireDefault(_jsts);
var _meta = require('@turf/meta');
var _d3geo = require('d3-geo');






var _helpers = require('@turf/helpers');
var { BufferOp, GeoJSONReader, GeoJSONWriter } = _jsts2.default;
function buffer(geojson, radius, options) {
  options = options || {};
  var units = options.units || "kilometers";
  var steps = options.steps || 8;
  if (!geojson) throw new Error("geojson is required");
  if (typeof options !== "object") throw new Error("options must be an object");
  if (typeof steps !== "number") throw new Error("steps must be an number");
  if (radius === void 0) throw new Error("radius is required");
  if (steps <= 0) throw new Error("steps must be greater than 0");
  var results = [];
  switch (geojson.type) {
    case "GeometryCollection":
      _meta.geomEach.call(void 0, geojson, function(geometry) {
        var buffered = bufferFeature(geometry, radius, units, steps);
        if (buffered) results.push(buffered);
      });
      return _helpers.featureCollection.call(void 0, results);
    case "FeatureCollection":
      _meta.featureEach.call(void 0, geojson, function(feature2) {
        var multiBuffered = bufferFeature(feature2, radius, units, steps);
        if (multiBuffered) {
          _meta.featureEach.call(void 0, multiBuffered, function(buffered) {
            if (buffered) results.push(buffered);
          });
        }
      });
      return _helpers.featureCollection.call(void 0, results);
  }
  return bufferFeature(geojson, radius, units, steps);
}
function bufferFeature(geojson, radius, units, steps) {
  var properties = geojson.properties || {};
  var geometry = geojson.type === "Feature" ? geojson.geometry : geojson;
  if (geometry.type === "GeometryCollection") {
    var results = [];
    _meta.geomEach.call(void 0, geojson, function(geometry2) {
      var buffered2 = bufferFeature(geometry2, radius, units, steps);
      if (buffered2) results.push(buffered2);
    });
    return _helpers.featureCollection.call(void 0, results);
  }
  var projection = defineProjection(geometry);
  var projected = {
    type: geometry.type,
    coordinates: projectCoords(geometry.coordinates, projection)
  };
  var reader = new GeoJSONReader();
  var geom = reader.read(projected);
  var distance = _helpers.radiansToLength.call(void 0, _helpers.lengthToRadians.call(void 0, radius, units), "meters");
  var buffered = BufferOp.bufferOp(geom, distance, steps);
  var writer = new GeoJSONWriter();
  buffered = writer.write(buffered);
  if (coordsIsNaN(buffered.coordinates)) return void 0;
  var result = {
    type: buffered.type,
    coordinates: unprojectCoords(buffered.coordinates, projection)
  };
  return _helpers.feature.call(void 0, result, properties);
}
function coordsIsNaN(coords) {
  if (Array.isArray(coords[0])) return coordsIsNaN(coords[0]);
  return isNaN(coords[0]);
}
function projectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj(coords);
  return coords.map(function(coord) {
    return projectCoords(coord, proj);
  });
}
function unprojectCoords(coords, proj) {
  if (typeof coords[0] !== "object") return proj.invert(coords);
  return coords.map(function(coord) {
    return unprojectCoords(coord, proj);
  });
}
function defineProjection(geojson) {
  var coords = _center.center.call(void 0, geojson).geometry.coordinates;
  var rotation = [-coords[0], -coords[1]];
  return _d3geo.geoAzimuthalEquidistant.call(void 0, ).rotate(rotation).scale(_helpers.earthRadius);
}
var turf_buffer_default = buffer;



exports.buffer = buffer; exports.default = turf_buffer_default;

},{"@turf/center":30,"@turf/helpers":32,"@turf/jsts":33,"@turf/meta":34,"d3-geo":37}],30:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// index.ts
var _bbox = require('@turf/bbox');
var _helpers = require('@turf/helpers');
function center(geojson, options = {}) {
  const ext = _bbox.bbox.call(void 0, geojson);
  const x = (ext[0] + ext[2]) / 2;
  const y = (ext[1] + ext[3]) / 2;
  return _helpers.point.call(void 0, [x, y], options.properties, options);
}
var turf_center_default = center;



exports.center = center; exports.default = turf_center_default;

},{"@turf/bbox":28,"@turf/helpers":32}],31:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// index.ts
var _helpers = require('@turf/helpers');
var _meta = require('@turf/meta');
var _concaveman = require('concaveman'); var _concaveman2 = _interopRequireDefault(_concaveman);
function convex(geojson, options = {}) {
  options.concavity = options.concavity || Infinity;
  const points = [];
  _meta.coordEach.call(void 0, geojson, (coord) => {
    points.push([coord[0], coord[1]]);
  });
  if (!points.length) {
    return null;
  }
  const convexHull = _concaveman2.default.call(void 0, points, options.concavity);
  if (convexHull.length > 3) {
    return _helpers.polygon.call(void 0, [convexHull]);
  }
  return null;
}
var turf_convex_default = convex;



exports.convex = convex; exports.default = turf_convex_default;

},{"@turf/helpers":32,"@turf/meta":34,"concaveman":35}],32:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// index.ts
var earthRadius = 63710088e-1;
var factors = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: 360 / (2 * Math.PI),
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1e3,
  kilometres: earthRadius / 1e3,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1e3,
  millimetres: earthRadius * 1e3,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius * 1.0936
};
var areaFactors = {
  acres: 247105e-9,
  centimeters: 1e4,
  centimetres: 1e4,
  feet: 10.763910417,
  hectares: 1e-4,
  inches: 1550.003100006,
  kilometers: 1e-6,
  kilometres: 1e-6,
  meters: 1,
  metres: 1,
  miles: 386e-9,
  nauticalmiles: 29155334959812285e-23,
  millimeters: 1e6,
  millimetres: 1e6,
  yards: 1.195990046
};
function feature(geom, properties, options = {}) {
  const feat = { type: "Feature" };
  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }
  if (options.bbox) {
    feat.bbox = options.bbox;
  }
  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}
function geometry(type, coordinates, _options = {}) {
  switch (type) {
    case "Point":
      return point(coordinates).geometry;
    case "LineString":
      return lineString(coordinates).geometry;
    case "Polygon":
      return polygon(coordinates).geometry;
    case "MultiPoint":
      return multiPoint(coordinates).geometry;
    case "MultiLineString":
      return multiLineString(coordinates).geometry;
    case "MultiPolygon":
      return multiPolygon(coordinates).geometry;
    default:
      throw new Error(type + " is invalid");
  }
}
function point(coordinates, properties, options = {}) {
  if (!coordinates) {
    throw new Error("coordinates is required");
  }
  if (!Array.isArray(coordinates)) {
    throw new Error("coordinates must be an Array");
  }
  if (coordinates.length < 2) {
    throw new Error("coordinates must be at least 2 numbers long");
  }
  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    throw new Error("coordinates must contain numbers");
  }
  const geom = {
    type: "Point",
    coordinates
  };
  return feature(geom, properties, options);
}
function points(coordinates, properties, options = {}) {
  return featureCollection(
    coordinates.map((coords) => {
      return point(coords, properties);
    }),
    options
  );
}
function polygon(coordinates, properties, options = {}) {
  for (const ring of coordinates) {
    if (ring.length < 4) {
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    }
    if (ring[ring.length - 1].length !== ring[0].length) {
      throw new Error("First and last Position are not equivalent.");
    }
    for (let j = 0; j < ring[ring.length - 1].length; j++) {
      if (ring[ring.length - 1][j] !== ring[0][j]) {
        throw new Error("First and last Position are not equivalent.");
      }
    }
  }
  const geom = {
    type: "Polygon",
    coordinates
  };
  return feature(geom, properties, options);
}
function polygons(coordinates, properties, options = {}) {
  return featureCollection(
    coordinates.map((coords) => {
      return polygon(coords, properties);
    }),
    options
  );
}
function lineString(coordinates, properties, options = {}) {
  if (coordinates.length < 2) {
    throw new Error("coordinates must be an array of two or more positions");
  }
  const geom = {
    type: "LineString",
    coordinates
  };
  return feature(geom, properties, options);
}
function lineStrings(coordinates, properties, options = {}) {
  return featureCollection(
    coordinates.map((coords) => {
      return lineString(coords, properties);
    }),
    options
  );
}
function featureCollection(features, options = {}) {
  const fc = { type: "FeatureCollection" };
  if (options.id) {
    fc.id = options.id;
  }
  if (options.bbox) {
    fc.bbox = options.bbox;
  }
  fc.features = features;
  return fc;
}
function multiLineString(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiLineString",
    coordinates
  };
  return feature(geom, properties, options);
}
function multiPoint(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiPoint",
    coordinates
  };
  return feature(geom, properties, options);
}
function multiPolygon(coordinates, properties, options = {}) {
  const geom = {
    type: "MultiPolygon",
    coordinates
  };
  return feature(geom, properties, options);
}
function geometryCollection(geometries, properties, options = {}) {
  const geom = {
    type: "GeometryCollection",
    geometries
  };
  return feature(geom, properties, options);
}
function round(num, precision = 0) {
  if (precision && !(precision >= 0)) {
    throw new Error("precision must be a positive number");
  }
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(num * multiplier) / multiplier;
}
function radiansToLength(radians, units = "kilometers") {
  const factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return radians * factor;
}
function lengthToRadians(distance, units = "kilometers") {
  const factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return distance / factor;
}
function lengthToDegrees(distance, units) {
  return radiansToDegrees(lengthToRadians(distance, units));
}
function bearingToAzimuth(bearing) {
  let angle = bearing % 360;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}
function azimuthToBearing(angle) {
  angle = angle % 360;
  if (angle > 180) {
    return angle - 360;
  } else if (angle < -180) {
    return angle + 360;
  }
  return angle;
}
function radiansToDegrees(radians) {
  const normalisedRadians = radians % (2 * Math.PI);
  return normalisedRadians * 180 / Math.PI;
}
function degreesToRadians(degrees) {
  const normalisedDegrees = degrees % 360;
  return normalisedDegrees * Math.PI / 180;
}
function convertLength(length, originalUnit = "kilometers", finalUnit = "kilometers") {
  if (!(length >= 0)) {
    throw new Error("length must be a positive number");
  }
  return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
function convertArea(area, originalUnit = "meters", finalUnit = "kilometers") {
  if (!(area >= 0)) {
    throw new Error("area must be a positive number");
  }
  const startFactor = areaFactors[originalUnit];
  if (!startFactor) {
    throw new Error("invalid original units");
  }
  const finalFactor = areaFactors[finalUnit];
  if (!finalFactor) {
    throw new Error("invalid final units");
  }
  return area / startFactor * finalFactor;
}
function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}
function isObject(input) {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}
function validateBBox(bbox) {
  if (!bbox) {
    throw new Error("bbox is required");
  }
  if (!Array.isArray(bbox)) {
    throw new Error("bbox must be an Array");
  }
  if (bbox.length !== 4 && bbox.length !== 6) {
    throw new Error("bbox must be an Array of 4 or 6 numbers");
  }
  bbox.forEach((num) => {
    if (!isNumber(num)) {
      throw new Error("bbox must only contain numbers");
    }
  });
}
function validateId(id) {
  if (!id) {
    throw new Error("id is required");
  }
  if (["string", "number"].indexOf(typeof id) === -1) {
    throw new Error("id must be a number or a string");
  }
}































exports.areaFactors = areaFactors; exports.azimuthToBearing = azimuthToBearing; exports.bearingToAzimuth = bearingToAzimuth; exports.convertArea = convertArea; exports.convertLength = convertLength; exports.degreesToRadians = degreesToRadians; exports.earthRadius = earthRadius; exports.factors = factors; exports.feature = feature; exports.featureCollection = featureCollection; exports.geometry = geometry; exports.geometryCollection = geometryCollection; exports.isNumber = isNumber; exports.isObject = isObject; exports.lengthToDegrees = lengthToDegrees; exports.lengthToRadians = lengthToRadians; exports.lineString = lineString; exports.lineStrings = lineStrings; exports.multiLineString = multiLineString; exports.multiPoint = multiPoint; exports.multiPolygon = multiPolygon; exports.point = point; exports.points = points; exports.polygon = polygon; exports.polygons = polygons; exports.radiansToDegrees = radiansToDegrees; exports.radiansToLength = radiansToLength; exports.round = round; exports.validateBBox = validateBBox; exports.validateId = validateId;

},{}],33:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).jsts=e()}(this,(function(){"use strict";function t(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=Array(e);n<e;n++)i[n]=t[n];return i}function e(t,e,n){return e=u(e),function(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(t,h()?Reflect.construct(e,n||[],u(t).constructor):e.apply(t,n))}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){if(h())return Reflect.construct.apply(null,arguments);var i=[null];i.push.apply(i,e);var r=new(t.bind.apply(t,i));return n&&c(r,n.prototype),r}function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,v(i.key),i)}}function s(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=y(t))||e){n&&(t=n);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,o=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return a=t.done,t},e:function(t){o=!0,s=t},f:function(){try{a||null==n.return||n.return()}finally{if(o)throw s}}}}function o(){return o="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(t,e,n){var i=function(t,e){for(;!{}.hasOwnProperty.call(t,e)&&null!==(t=u(t)););return t}(t,e);if(i){var r=Object.getOwnPropertyDescriptor(i,e);return r.get?r.get.call(arguments.length<3?t:n):r.value}},o.apply(null,arguments)}function u(t){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},u(t)}function l(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&c(t,e)}function h(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(h=function(){return!!t})()}function c(t,e){return c=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},c(t,e)}function f(t,e,n,i){var r=o(u(1&i?t.prototype:t),e,n);return 2&i&&"function"==typeof r?function(t){return r.apply(n,t)}:r}function g(e){return function(e){if(Array.isArray(e))return t(e)}(e)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(e)||y(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(t){var e=function(t,e){if("object"!=typeof t||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var i=n.call(t,e);if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"==typeof e?e:e+""}function y(e,n){if(e){if("string"==typeof e)return t(e,n);var i={}.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?t(e,n):void 0}}function d(t){var e="function"==typeof Map?new Map:void 0;return d=function(t){if(null===t||!function(t){try{return-1!==Function.toString.call(t).indexOf("[native code]")}catch(e){return"function"==typeof t}}(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return i(t,arguments,u(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),c(n,t)},d(t)}var _=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getEndCapStyle",value:function(){return this._endCapStyle}},{key:"isSingleSided",value:function(){return this._isSingleSided}},{key:"setQuadrantSegments",value:function(e){this._quadrantSegments=e,0===this._quadrantSegments&&(this._joinStyle=t.JOIN_BEVEL),this._quadrantSegments<0&&(this._joinStyle=t.JOIN_MITRE,this._mitreLimit=Math.abs(this._quadrantSegments)),e<=0&&(this._quadrantSegments=1),this._joinStyle!==t.JOIN_ROUND&&(this._quadrantSegments=t.DEFAULT_QUADRANT_SEGMENTS)}},{key:"getJoinStyle",value:function(){return this._joinStyle}},{key:"setJoinStyle",value:function(t){this._joinStyle=t}},{key:"setSimplifyFactor",value:function(t){this._simplifyFactor=t<0?0:t}},{key:"getSimplifyFactor",value:function(){return this._simplifyFactor}},{key:"getQuadrantSegments",value:function(){return this._quadrantSegments}},{key:"setEndCapStyle",value:function(t){this._endCapStyle=t}},{key:"getMitreLimit",value:function(){return this._mitreLimit}},{key:"setMitreLimit",value:function(t){this._mitreLimit=t}},{key:"setSingleSided",value:function(t){this._isSingleSided=t}}],[{key:"constructor_",value:function(){if(this._quadrantSegments=t.DEFAULT_QUADRANT_SEGMENTS,this._endCapStyle=t.CAP_ROUND,this._joinStyle=t.JOIN_ROUND,this._mitreLimit=t.DEFAULT_MITRE_LIMIT,this._isSingleSided=!1,this._simplifyFactor=t.DEFAULT_SIMPLIFY_FACTOR,0===arguments.length);else if(1===arguments.length){var e=arguments[0];this.setQuadrantSegments(e)}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.setQuadrantSegments(n),this.setEndCapStyle(i)}else if(4===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2],o=arguments[3];this.setQuadrantSegments(r),this.setEndCapStyle(s),this.setJoinStyle(a),this.setMitreLimit(o)}}},{key:"bufferDistanceError",value:function(t){var e=Math.PI/2/t;return 1-Math.cos(e/2)}}])}();_.CAP_ROUND=1,_.CAP_FLAT=2,_.CAP_SQUARE=3,_.JOIN_ROUND=1,_.JOIN_MITRE=2,_.JOIN_BEVEL=3,_.DEFAULT_QUADRANT_SEGMENTS=8,_.DEFAULT_MITRE_LIMIT=5,_.DEFAULT_SIMPLIFY_FACTOR=.01;var p=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({Exception:i})[0],r}return l(i,t),s(i,[{key:"toString",value:function(){return this.message}}])}(d(Error)),m=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({IllegalArgumentException:i})[0],r}return l(i,t),s(i)}(p),k=function(){return s((function t(){n(this,t)}),[{key:"filter",value:function(t){}}])}();function x(){}function I(){}function E(){}var N,T,S,L,C,R,w,O,b=function(){return s((function t(){n(this,t)}),null,[{key:"equalsWithTolerance",value:function(t,e,n){return Math.abs(t-e)<=n}}])}(),M=function(){return s((function t(e,i){n(this,t),this.low=i||0,this.high=e||0}),null,[{key:"toBinaryString",value:function(t){var e,n="";for(e=2147483648;e>0;e>>>=1)n+=(t.high&e)===e?"1":"0";for(e=2147483648;e>0;e>>>=1)n+=(t.low&e)===e?"1":"0";return n}}])}();function A(){}function P(){}A.NaN=NaN,A.isNaN=function(t){return Number.isNaN(t)},A.isInfinite=function(t){return!Number.isFinite(t)},A.MAX_VALUE=Number.MAX_VALUE,A.POSITIVE_INFINITY=Number.POSITIVE_INFINITY,A.NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY,"function"==typeof Float64Array&&"function"==typeof Int32Array?(R=2146435072,w=new Float64Array(1),O=new Int32Array(w.buffer),A.doubleToLongBits=function(t){w[0]=t;var e=0|O[0],n=0|O[1];return(n&R)===R&&1048575&n&&0!==e&&(e=0,n=2146959360),new M(n,e)},A.longBitsToDouble=function(t){return O[0]=t.low,O[1]=t.high,w[0]}):(N=1023,T=Math.log2,S=Math.floor,L=Math.pow,C=function(){for(var t=53;t>0;t--){var e=L(2,t)-1;if(S(T(e))+1===t)return e}return 0}(),A.doubleToLongBits=function(t){var e,n,i,r,s,a,o,u,l;if(t<0||1/t===Number.NEGATIVE_INFINITY?(a=1<<31,t=-t):a=0,0===t)return new M(u=a,l=0);if(t===1/0)return new M(u=2146435072|a,l=0);if(t!=t)return new M(u=2146959360,l=0);if(r=0,l=0,(e=S(t))>1)if(e<=C)(r=S(T(e)))<=20?(l=0,u=e<<20-r&1048575):(l=e%(n=L(2,i=r-20))<<32-i,u=e/n&1048575);else for(i=e,l=0;0!==(i=S(n=i/2));)r++,l>>>=1,l|=(1&u)<<31,u>>>=1,n!==i&&(u|=524288);if(o=r+N,s=0===e,e=t-e,r<52&&0!==e)for(i=0;;){if((n=2*e)>=1?(e=n-1,s?(o--,s=!1):(i<<=1,i|=1,r++)):(e=n,s?0==--o&&(r++,s=!1):(i<<=1,r++)),20===r)u|=i,i=0;else if(52===r){l|=i;break}if(1===n){r<20?u|=i<<20-r:r<52&&(l|=i<<52-r);break}}return u|=o<<20,new M(u|=a,l)},A.longBitsToDouble=function(t){var e,n,i,r,s=t.high,a=t.low,o=s&1<<31?-1:1;for(i=((2146435072&s)>>20)-N,r=0,n=1<<19,e=1;e<=20;e++)s&n&&(r+=L(2,-e)),n>>>=1;for(n=1<<31,e=21;e<=52;e++)a&n&&(r+=L(2,-e)),n>>>=1;if(-1023===i){if(0===r)return 0*o;i=-1022}else{if(1024===i)return 0===r?o/0:NaN;r+=1}return o*r*L(2,i)});var D=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({RuntimeException:i})[0],r}return l(i,t),s(i)}(p),F=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,null,[{key:"constructor_",value:function(){if(0===arguments.length)D.constructor_.call(this);else if(1===arguments.length){var t=arguments[0];D.constructor_.call(this,t)}}}])}(D),G=function(){function t(){n(this,t)}return s(t,null,[{key:"shouldNeverReachHere",value:function(){if(0===arguments.length)t.shouldNeverReachHere(null);else if(1===arguments.length){var e=arguments[0];throw new F("Should never reach here"+(null!==e?": "+e:""))}}},{key:"isTrue",value:function(){if(1===arguments.length){var e=arguments[0];t.isTrue(e,null)}else if(2===arguments.length){var n=arguments[1];if(!arguments[0])throw null===n?new F:new F(n)}}},{key:"equals",value:function(){if(2===arguments.length){var e=arguments[0],n=arguments[1];t.equals(e,n,null)}else if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];if(!r.equals(i))throw new F("Expected "+i+" but encountered "+r+(null!==s?": "+s:""))}}}])}(),q=new ArrayBuffer(8),Y=new Float64Array(q),z=new Int32Array(q),X=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getM",value:function(){return A.NaN}},{key:"setOrdinate",value:function(e,n){switch(e){case t.X:this.x=n;break;case t.Y:this.y=n;break;case t.Z:this.setZ(n);break;default:throw new m("Invalid ordinate index: "+e)}}},{key:"equals2D",value:function(){if(1===arguments.length){var t=arguments[0];return this.x===t.x&&this.y===t.y}if(2===arguments.length){var e=arguments[0],n=arguments[1];return!!b.equalsWithTolerance(this.x,e.x,n)&&!!b.equalsWithTolerance(this.y,e.y,n)}}},{key:"setM",value:function(e){throw new m("Invalid ordinate index: "+t.M)}},{key:"getZ",value:function(){return this.z}},{key:"getOrdinate",value:function(e){switch(e){case t.X:return this.x;case t.Y:return this.y;case t.Z:return this.getZ()}throw new m("Invalid ordinate index: "+e)}},{key:"equals3D",value:function(t){return this.x===t.x&&this.y===t.y&&(this.getZ()===t.getZ()||A.isNaN(this.getZ())&&A.isNaN(t.getZ()))}},{key:"equals",value:function(e){return e instanceof t&&this.equals2D(e)}},{key:"equalInZ",value:function(t,e){return b.equalsWithTolerance(this.getZ(),t.getZ(),e)}},{key:"setX",value:function(t){this.x=t}},{key:"compareTo",value:function(t){var e=t;return this.x<e.x?-1:this.x>e.x?1:this.y<e.y?-1:this.y>e.y?1:0}},{key:"getX",value:function(){return this.x}},{key:"setZ",value:function(t){this.z=t}},{key:"clone",value:function(){try{return null}catch(t){if(t instanceof CloneNotSupportedException)return G.shouldNeverReachHere("this shouldn't happen because this class is Cloneable"),null;throw t}}},{key:"copy",value:function(){return new t(this)}},{key:"toString",value:function(){return"("+this.x+", "+this.y+", "+this.getZ()+")"}},{key:"distance3D",value:function(t){var e=this.x-t.x,n=this.y-t.y,i=this.getZ()-t.getZ();return Math.sqrt(e*e+n*n+i*i)}},{key:"getY",value:function(){return this.y}},{key:"setY",value:function(t){this.y=t}},{key:"distance",value:function(t){var e=this.x-t.x,n=this.y-t.y;return Math.sqrt(e*e+n*n)}},{key:"hashCode",value:function(){var e=17;return e=37*(e=37*e+t.hashCode(this.x))+t.hashCode(this.y)}},{key:"setCoordinate",value:function(t){this.x=t.x,this.y=t.y,this.z=t.getZ()}},{key:"interfaces_",get:function(){return[x,I,E]}}],[{key:"constructor_",value:function(){if(this.x=null,this.y=null,this.z=null,0===arguments.length)t.constructor_.call(this,0,0);else if(1===arguments.length){var e=arguments[0];t.constructor_.call(this,e.x,e.y,e.getZ())}else if(2===arguments.length){var n=arguments[0],i=arguments[1];t.constructor_.call(this,n,i,t.NULL_ORDINATE)}else if(3===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2];this.x=r,this.y=s,this.z=a}}},{key:"hashCode",value:function(t){return Y[0]=t,z[0]^z[1]}}])}(),B=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"compare",value:function(e,n){var i=t.compare(e.x,n.x);if(0!==i)return i;var r=t.compare(e.y,n.y);return 0!==r?r:this._dimensionsToTest<=2?0:t.compare(e.getZ(),n.getZ())}},{key:"interfaces_",get:function(){return[P]}}],[{key:"constructor_",value:function(){if(this._dimensionsToTest=2,0===arguments.length)t.constructor_.call(this,2);else if(1===arguments.length){var e=arguments[0];if(2!==e&&3!==e)throw new m("only 2 or 3 dimensions may be specified");this._dimensionsToTest=e}}},{key:"compare",value:function(t,e){return t<e?-1:t>e?1:A.isNaN(t)?A.isNaN(e)?0:-1:A.isNaN(e)?1:0}}])}();X.DimensionalComparator=B,X.NULL_ORDINATE=A.NaN,X.X=0,X.Y=1,X.Z=2,X.M=3;var U=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getArea",value:function(){return this.getWidth()*this.getHeight()}},{key:"equals",value:function(e){if(!(e instanceof t))return!1;var n=e;return this.isNull()?n.isNull():this._maxx===n.getMaxX()&&this._maxy===n.getMaxY()&&this._minx===n.getMinX()&&this._miny===n.getMinY()}},{key:"intersection",value:function(e){if(this.isNull()||e.isNull()||!this.intersects(e))return new t;var n=this._minx>e._minx?this._minx:e._minx,i=this._miny>e._miny?this._miny:e._miny;return new t(n,this._maxx<e._maxx?this._maxx:e._maxx,i,this._maxy<e._maxy?this._maxy:e._maxy)}},{key:"isNull",value:function(){return this._maxx<this._minx}},{key:"getMaxX",value:function(){return this._maxx}},{key:"covers",value:function(){if(1===arguments.length){if(arguments[0]instanceof X){var e=arguments[0];return this.covers(e.x,e.y)}if(arguments[0]instanceof t){var n=arguments[0];return!this.isNull()&&!n.isNull()&&(n.getMinX()>=this._minx&&n.getMaxX()<=this._maxx&&n.getMinY()>=this._miny&&n.getMaxY()<=this._maxy)}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];return!this.isNull()&&(i>=this._minx&&i<=this._maxx&&r>=this._miny&&r<=this._maxy)}}},{key:"intersects",value:function(){if(1===arguments.length){if(arguments[0]instanceof t){var e=arguments[0];return!this.isNull()&&!e.isNull()&&!(e._minx>this._maxx||e._maxx<this._minx||e._miny>this._maxy||e._maxy<this._miny)}if(arguments[0]instanceof X){var n=arguments[0];return this.intersects(n.x,n.y)}}else if(2===arguments.length){if(arguments[0]instanceof X&&arguments[1]instanceof X){var i=arguments[0],r=arguments[1];return!this.isNull()&&(!((i.x<r.x?i.x:r.x)>this._maxx)&&(!((i.x>r.x?i.x:r.x)<this._minx)&&(!((i.y<r.y?i.y:r.y)>this._maxy)&&!((i.y>r.y?i.y:r.y)<this._miny))))}if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var s=arguments[0],a=arguments[1];return!this.isNull()&&!(s>this._maxx||s<this._minx||a>this._maxy||a<this._miny)}}}},{key:"getMinY",value:function(){return this._miny}},{key:"getDiameter",value:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return Math.sqrt(t*t+e*e)}},{key:"getMinX",value:function(){return this._minx}},{key:"expandToInclude",value:function(){if(1===arguments.length){if(arguments[0]instanceof X){var e=arguments[0];this.expandToInclude(e.x,e.y)}else if(arguments[0]instanceof t){var n=arguments[0];if(n.isNull())return null;this.isNull()?(this._minx=n.getMinX(),this._maxx=n.getMaxX(),this._miny=n.getMinY(),this._maxy=n.getMaxY()):(n._minx<this._minx&&(this._minx=n._minx),n._maxx>this._maxx&&(this._maxx=n._maxx),n._miny<this._miny&&(this._miny=n._miny),n._maxy>this._maxy&&(this._maxy=n._maxy))}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.isNull()?(this._minx=i,this._maxx=i,this._miny=r,this._maxy=r):(i<this._minx&&(this._minx=i),i>this._maxx&&(this._maxx=i),r<this._miny&&(this._miny=r),r>this._maxy&&(this._maxy=r))}}},{key:"minExtent",value:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return t<e?t:e}},{key:"getWidth",value:function(){return this.isNull()?0:this._maxx-this._minx}},{key:"compareTo",value:function(t){var e=t;return this.isNull()?e.isNull()?0:-1:e.isNull()?1:this._minx<e._minx?-1:this._minx>e._minx?1:this._miny<e._miny?-1:this._miny>e._miny?1:this._maxx<e._maxx?-1:this._maxx>e._maxx?1:this._maxy<e._maxy?-1:this._maxy>e._maxy?1:0}},{key:"translate",value:function(t,e){if(this.isNull())return null;this.init(this.getMinX()+t,this.getMaxX()+t,this.getMinY()+e,this.getMaxY()+e)}},{key:"copy",value:function(){return new t(this)}},{key:"toString",value:function(){return"Env["+this._minx+" : "+this._maxx+", "+this._miny+" : "+this._maxy+"]"}},{key:"setToNull",value:function(){this._minx=0,this._maxx=-1,this._miny=0,this._maxy=-1}},{key:"disjoint",value:function(t){return!(!this.isNull()&&!t.isNull())||(t._minx>this._maxx||t._maxx<this._minx||t._miny>this._maxy||t._maxy<this._miny)}},{key:"getHeight",value:function(){return this.isNull()?0:this._maxy-this._miny}},{key:"maxExtent",value:function(){if(this.isNull())return 0;var t=this.getWidth(),e=this.getHeight();return t>e?t:e}},{key:"expandBy",value:function(){if(1===arguments.length){var t=arguments[0];this.expandBy(t,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(this.isNull())return null;this._minx-=e,this._maxx+=e,this._miny-=n,this._maxy+=n,(this._minx>this._maxx||this._miny>this._maxy)&&this.setToNull()}}},{key:"contains",value:function(){if(1===arguments.length){if(arguments[0]instanceof t){var e=arguments[0];return this.covers(e)}if(arguments[0]instanceof X){var n=arguments[0];return this.covers(n)}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];return this.covers(i,r)}}},{key:"centre",value:function(){return this.isNull()?null:new X((this.getMinX()+this.getMaxX())/2,(this.getMinY()+this.getMaxY())/2)}},{key:"init",value:function(){if(0===arguments.length)this.setToNull();else if(1===arguments.length){if(arguments[0]instanceof X){var e=arguments[0];this.init(e.x,e.x,e.y,e.y)}else if(arguments[0]instanceof t){var n=arguments[0];this._minx=n._minx,this._maxx=n._maxx,this._miny=n._miny,this._maxy=n._maxy}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.init(i.x,r.x,i.y,r.y)}else if(4===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2],u=arguments[3];s<a?(this._minx=s,this._maxx=a):(this._minx=a,this._maxx=s),o<u?(this._miny=o,this._maxy=u):(this._miny=u,this._maxy=o)}}},{key:"getMaxY",value:function(){return this._maxy}},{key:"distance",value:function(t){if(this.intersects(t))return 0;var e=0;this._maxx<t._minx?e=t._minx-this._maxx:this._minx>t._maxx&&(e=this._minx-t._maxx);var n=0;return this._maxy<t._miny?n=t._miny-this._maxy:this._miny>t._maxy&&(n=this._miny-t._maxy),0===e?n:0===n?e:Math.sqrt(e*e+n*n)}},{key:"hashCode",value:function(){var t=17;return t=37*(t=37*(t=37*(t=37*t+X.hashCode(this._minx))+X.hashCode(this._maxx))+X.hashCode(this._miny))+X.hashCode(this._maxy)}},{key:"interfaces_",get:function(){return[x,E]}}],[{key:"constructor_",value:function(){if(this._minx=null,this._maxx=null,this._miny=null,this._maxy=null,0===arguments.length)this.init();else if(1===arguments.length){if(arguments[0]instanceof X){var e=arguments[0];this.init(e.x,e.x,e.y,e.y)}else if(arguments[0]instanceof t){var n=arguments[0];this.init(n)}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.init(i.x,r.x,i.y,r.y)}else if(4===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2],u=arguments[3];this.init(s,a,o,u)}}},{key:"intersects",value:function(){if(3===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2];return n.x>=(t.x<e.x?t.x:e.x)&&n.x<=(t.x>e.x?t.x:e.x)&&n.y>=(t.y<e.y?t.y:e.y)&&n.y<=(t.y>e.y?t.y:e.y)}if(4===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2],a=arguments[3],o=Math.min(s.x,a.x),u=Math.max(s.x,a.x),l=Math.min(i.x,r.x),h=Math.max(i.x,r.x);return!(l>u)&&(!(h<o)&&(o=Math.min(s.y,a.y),u=Math.max(s.y,a.y),l=Math.min(i.y,r.y),h=Math.max(i.y,r.y),!(l>u)&&!(h<o)))}}}])}(),V=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"isGeometryCollection",value:function(){return this.getTypeCode()===t.TYPECODE_GEOMETRYCOLLECTION}},{key:"getFactory",value:function(){return this._factory}},{key:"getGeometryN",value:function(t){return this}},{key:"getArea",value:function(){return 0}},{key:"isRectangle",value:function(){return!1}},{key:"equalsExact",value:function(t){return this===t||this.equalsExact(t,0)}},{key:"geometryChanged",value:function(){this.apply(t.geometryChangedFilter)}},{key:"geometryChangedAction",value:function(){this._envelope=null}},{key:"equalsNorm",value:function(t){return null!==t&&this.norm().equalsExact(t.norm())}},{key:"getLength",value:function(){return 0}},{key:"getNumGeometries",value:function(){return 1}},{key:"compareTo",value:function(){var t;if(1===arguments.length){var e=arguments[0];return t=e,this.getTypeCode()!==t.getTypeCode()?this.getTypeCode()-t.getTypeCode():this.isEmpty()&&t.isEmpty()?0:this.isEmpty()?-1:t.isEmpty()?1:this.compareToSameClass(e)}if(2===arguments.length){var n=arguments[0],i=arguments[1];return t=n,this.getTypeCode()!==t.getTypeCode()?this.getTypeCode()-t.getTypeCode():this.isEmpty()&&t.isEmpty()?0:this.isEmpty()?-1:t.isEmpty()?1:this.compareToSameClass(n,i)}}},{key:"getUserData",value:function(){return this._userData}},{key:"getSRID",value:function(){return this._SRID}},{key:"getEnvelope",value:function(){return this.getFactory().toGeometry(this.getEnvelopeInternal())}},{key:"checkNotGeometryCollection",value:function(e){if(e.getTypeCode()===t.TYPECODE_GEOMETRYCOLLECTION)throw new m("This method does not support GeometryCollection arguments")}},{key:"equal",value:function(t,e,n){return 0===n?t.equals(e):t.distance(e)<=n}},{key:"norm",value:function(){var t=this.copy();return t.normalize(),t}},{key:"reverse",value:function(){var t=this.reverseInternal();return null!=this.envelope&&(t.envelope=this.envelope.copy()),t.setSRID(this.getSRID()),t}},{key:"copy",value:function(){var t=this.copyInternal();return t.envelope=null==this._envelope?null:this._envelope.copy(),t._SRID=this._SRID,t._userData=this._userData,t}},{key:"getPrecisionModel",value:function(){return this._factory.getPrecisionModel()}},{key:"getEnvelopeInternal",value:function(){return null===this._envelope&&(this._envelope=this.computeEnvelopeInternal()),new U(this._envelope)}},{key:"setSRID",value:function(t){this._SRID=t}},{key:"setUserData",value:function(t){this._userData=t}},{key:"compare",value:function(t,e){for(var n=t.iterator(),i=e.iterator();n.hasNext()&&i.hasNext();){var r=n.next(),s=i.next(),a=r.compareTo(s);if(0!==a)return a}return n.hasNext()?1:i.hasNext()?-1:0}},{key:"hashCode",value:function(){return this.getEnvelopeInternal().hashCode()}},{key:"isEquivalentClass",value:function(t){return this.getClass()===t.getClass()}},{key:"isGeometryCollectionOrDerived",value:function(){return this.getTypeCode()===t.TYPECODE_GEOMETRYCOLLECTION||this.getTypeCode()===t.TYPECODE_MULTIPOINT||this.getTypeCode()===t.TYPECODE_MULTILINESTRING||this.getTypeCode()===t.TYPECODE_MULTIPOLYGON}},{key:"interfaces_",get:function(){return[I,x,E]}},{key:"getClass",value:function(){return t}}],[{key:"hasNonEmptyElements",value:function(t){for(var e=0;e<t.length;e++)if(!t[e].isEmpty())return!0;return!1}},{key:"hasNullElements",value:function(t){for(var e=0;e<t.length;e++)if(null===t[e])return!0;return!1}}])}();V.constructor_=function(t){t&&(this._envelope=null,this._userData=null,this._factory=t,this._SRID=t.getSRID())},V.TYPECODE_POINT=0,V.TYPECODE_MULTIPOINT=1,V.TYPECODE_LINESTRING=2,V.TYPECODE_LINEARRING=3,V.TYPECODE_MULTILINESTRING=4,V.TYPECODE_POLYGON=5,V.TYPECODE_MULTIPOLYGON=6,V.TYPECODE_GEOMETRYCOLLECTION=7,V.TYPENAME_POINT="Point",V.TYPENAME_MULTIPOINT="MultiPoint",V.TYPENAME_LINESTRING="LineString",V.TYPENAME_LINEARRING="LinearRing",V.TYPENAME_MULTILINESTRING="MultiLineString",V.TYPENAME_POLYGON="Polygon",V.TYPENAME_MULTIPOLYGON="MultiPolygon",V.TYPENAME_GEOMETRYCOLLECTION="GeometryCollection",V.geometryChangedFilter={get interfaces_(){return[k]},filter:function(t){t.geometryChangedAction()}};var H=function(){function t(){n(this,t)}return s(t,null,[{key:"toLocationSymbol",value:function(e){switch(e){case t.EXTERIOR:return"e";case t.BOUNDARY:return"b";case t.INTERIOR:return"i";case t.NONE:return"-"}throw new m("Unknown location value: "+e)}}])}();H.INTERIOR=0,H.BOUNDARY=1,H.EXTERIOR=2,H.NONE=-1;var Z=function(){return s((function t(){n(this,t)}),[{key:"add",value:function(){}},{key:"addAll",value:function(){}},{key:"isEmpty",value:function(){}},{key:"iterator",value:function(){}},{key:"size",value:function(){}},{key:"toArray",value:function(){}},{key:"remove",value:function(){}}])}(),j=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({NoSuchElementException:i})[0],r}return l(i,t),s(i)}(p),W=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({UnsupportedOperationException:i})[0],r}return l(i,t),s(i)}(p),K=function(t){function i(){return n(this,i),e(this,i,arguments)}return l(i,t),s(i,[{key:"contains",value:function(){}}])}(Z),J=function(t){function i(t){var r;return n(this,i),(r=e(this,i)).map=new Map,t instanceof Z&&r.addAll(t),r}return l(i,t),s(i,[{key:"contains",value:function(t){var e=t.hashCode?t.hashCode():t;return!!this.map.has(e)}},{key:"add",value:function(t){var e=t.hashCode?t.hashCode():t;return!this.map.has(e)&&!!this.map.set(e,t)}},{key:"addAll",value:function(t){var e,n=a(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;this.add(i)}}catch(t){n.e(t)}finally{n.f()}return!0}},{key:"remove",value:function(){throw new W}},{key:"size",value:function(){return this.map.size}},{key:"isEmpty",value:function(){return 0===this.map.size}},{key:"toArray",value:function(){return Array.from(this.map.values())}},{key:"iterator",value:function(){return new Q(this.map)}},{key:Symbol.iterator,value:function(){return this.map}}])}(K),Q=function(){return s((function t(e){n(this,t),this.iterator=e.values();var i=this.iterator.next(),r=i.done,s=i.value;this.done=r,this.value=s}),[{key:"next",value:function(){if(this.done)throw new j;var t=this.value,e=this.iterator.next(),n=e.done,i=e.value;return this.done=n,this.value=i,t}},{key:"hasNext",value:function(){return!this.done}},{key:"remove",value:function(){throw new W}}])}(),$=function(){function t(){n(this,t)}return s(t,null,[{key:"opposite",value:function(e){return e===t.LEFT?t.RIGHT:e===t.RIGHT?t.LEFT:e}}])}();$.ON=0,$.LEFT=1,$.RIGHT=2;var tt=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({EmptyStackException:i})[0],r}return l(i,t),s(i)}(p),et=function(t){function i(t){var r;return n(this,i),(r=e(this,i,[t])).name=Object.keys({IndexOutOfBoundsException:i})[0],r}return l(i,t),s(i)}(p),nt=function(t){function i(){return n(this,i),e(this,i,arguments)}return l(i,t),s(i,[{key:"get",value:function(){}},{key:"set",value:function(){}},{key:"isEmpty",value:function(){}}])}(Z),it=function(t){function i(){var t;return n(this,i),(t=e(this,i)).array=[],t}return l(i,t),s(i,[{key:"add",value:function(t){return this.array.push(t),!0}},{key:"get",value:function(t){if(t<0||t>=this.size())throw new et;return this.array[t]}},{key:"push",value:function(t){return this.array.push(t),t}},{key:"pop",value:function(){if(0===this.array.length)throw new tt;return this.array.pop()}},{key:"peek",value:function(){if(0===this.array.length)throw new tt;return this.array[this.array.length-1]}},{key:"empty",value:function(){return 0===this.array.length}},{key:"isEmpty",value:function(){return this.empty()}},{key:"search",value:function(t){return this.array.indexOf(t)}},{key:"size",value:function(){return this.array.length}},{key:"toArray",value:function(){return this.array.slice()}}])}(nt);function rt(t,e){return t.interfaces_&&t.interfaces_.indexOf(e)>-1}var st=function(){return s((function t(e){n(this,t),this.str=e}),[{key:"append",value:function(t){this.str+=t}},{key:"setCharAt",value:function(t,e){this.str=this.str.substr(0,t)+e+this.str.substr(t+1)}},{key:"toString",value:function(){return this.str}}])}(),at=function(){function t(e){n(this,t),this.value=e}return s(t,[{key:"intValue",value:function(){return this.value}},{key:"compareTo",value:function(t){return this.value<t?-1:this.value>t?1:0}}],[{key:"compare",value:function(t,e){return t<e?-1:t>e?1:0}},{key:"isNan",value:function(t){return Number.isNaN(t)}},{key:"valueOf",value:function(e){return new t(e)}}])}(),ot=function(){return s((function t(){n(this,t)}),null,[{key:"isWhitespace",value:function(t){return t<=32&&t>=0||127===t}},{key:"toUpperCase",value:function(t){return t.toUpperCase()}}])}(),ut=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"le",value:function(t){return this._hi<t._hi||this._hi===t._hi&&this._lo<=t._lo}},{key:"extractSignificantDigits",value:function(e,n){var i=this.abs(),r=t.magnitude(i._hi),s=t.TEN.pow(r);(i=i.divide(s)).gt(t.TEN)?(i=i.divide(t.TEN),r+=1):i.lt(t.ONE)&&(i=i.multiply(t.TEN),r-=1);for(var a=r+1,o=new st,u=t.MAX_PRINT_DIGITS-1,l=0;l<=u;l++){e&&l===a&&o.append(".");var h=Math.trunc(i._hi);if(h<0)break;var c=!1,f=0;h>9?(c=!0,f="9"):f="0"+h,o.append(f),i=i.subtract(t.valueOf(h)).multiply(t.TEN),c&&i.selfAdd(t.TEN);var g=!0,v=t.magnitude(i._hi);if(v<0&&Math.abs(v)>=u-l&&(g=!1),!g)break}return n[0]=r,o.toString()}},{key:"sqr",value:function(){return this.multiply(this)}},{key:"doubleValue",value:function(){return this._hi+this._lo}},{key:"subtract",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return this.add(e.negate())}if("number"==typeof arguments[0]){var n=arguments[0];return this.add(-n)}}},{key:"equals",value:function(){if(1===arguments.length&&arguments[0]instanceof t){var e=arguments[0];return this._hi===e._hi&&this._lo===e._lo}}},{key:"isZero",value:function(){return 0===this._hi&&0===this._lo}},{key:"selfSubtract",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return this.isNaN()?this:this.selfAdd(-e._hi,-e._lo)}if("number"==typeof arguments[0]){var n=arguments[0];return this.isNaN()?this:this.selfAdd(-n,0)}}},{key:"getSpecialNumberString",value:function(){return this.isZero()?"0.0":this.isNaN()?"NaN ":null}},{key:"min",value:function(t){return this.le(t)?this:t}},{key:"selfDivide",value:function(){if(1===arguments.length){if(arguments[0]instanceof t){var e=arguments[0];return this.selfDivide(e._hi,e._lo)}if("number"==typeof arguments[0]){var n=arguments[0];return this.selfDivide(n,0)}}else if(2===arguments.length){var i,r,s,a,o=arguments[0],u=arguments[1],l=null,h=null,c=null,f=null;return s=this._hi/o,f=(l=(c=t.SPLIT*s)-(l=c-s))*(h=(f=t.SPLIT*o)-(h=f-o))-(a=s*o)+l*(r=o-h)+(i=s-l)*h+i*r,f=s+(c=(this._hi-a-f+this._lo-s*u)/o),this._hi=f,this._lo=s-f+c,this}}},{key:"dump",value:function(){return"DD<"+this._hi+", "+this._lo+">"}},{key:"divide",value:function(){if(arguments[0]instanceof t){var e,n,i,r,s=arguments[0],a=null,o=null,u=null,l=null;return e=(i=this._hi/s._hi)-(a=(u=t.SPLIT*i)-(a=u-i)),l=a*(o=(l=t.SPLIT*s._hi)-(o=l-s._hi))-(r=i*s._hi)+a*(n=s._hi-o)+e*o+e*n,new t(l=i+(u=(this._hi-r-l+this._lo-i*s._lo)/s._hi),i-l+u)}if("number"==typeof arguments[0]){var h=arguments[0];return A.isNaN(h)?t.createNaN():t.copy(this).selfDivide(h,0)}}},{key:"ge",value:function(t){return this._hi>t._hi||this._hi===t._hi&&this._lo>=t._lo}},{key:"pow",value:function(e){if(0===e)return t.valueOf(1);var n=new t(this),i=t.valueOf(1),r=Math.abs(e);if(r>1)for(;r>0;)r%2==1&&i.selfMultiply(n),(r/=2)>0&&(n=n.sqr());else i=n;return e<0?i.reciprocal():i}},{key:"ceil",value:function(){if(this.isNaN())return t.NaN;var e=Math.ceil(this._hi),n=0;return e===this._hi&&(n=Math.ceil(this._lo)),new t(e,n)}},{key:"compareTo",value:function(t){var e=t;return this._hi<e._hi?-1:this._hi>e._hi?1:this._lo<e._lo?-1:this._lo>e._lo?1:0}},{key:"rint",value:function(){return this.isNaN()?this:this.add(.5).floor()}},{key:"setValue",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return this.init(e),this}if("number"==typeof arguments[0]){var n=arguments[0];return this.init(n),this}}},{key:"max",value:function(t){return this.ge(t)?this:t}},{key:"sqrt",value:function(){if(this.isZero())return t.valueOf(0);if(this.isNegative())return t.NaN;var e=1/Math.sqrt(this._hi),n=this._hi*e,i=t.valueOf(n),r=this.subtract(i.sqr())._hi*(.5*e);return i.add(r)}},{key:"selfAdd",value:function(){if(1===arguments.length){if(arguments[0]instanceof t){var e=arguments[0];return this.selfAdd(e._hi,e._lo)}if("number"==typeof arguments[0]){var n,i,r,s,a,o=arguments[0],u=null;return u=(r=this._hi+o)-(s=r-this._hi),i=(a=(u=o-s+(this._hi-u))+this._lo)+(r-(n=r+a)),this._hi=n+i,this._lo=i+(n-this._hi),this}}else if(2===arguments.length){var l,h,c,f,g=arguments[0],v=arguments[1],y=null,d=null,_=null;c=this._hi+g,h=this._lo+v,d=c-(_=c-this._hi),y=h-(f=h-this._lo);var p=(l=c+(_=(d=g-_+(this._hi-d))+h))+(_=(y=v-f+(this._lo-y))+(_+(c-l))),m=_+(l-p);return this._hi=p,this._lo=m,this}}},{key:"selfMultiply",value:function(){if(1===arguments.length){if(arguments[0]instanceof t){var e=arguments[0];return this.selfMultiply(e._hi,e._lo)}if("number"==typeof arguments[0]){var n=arguments[0];return this.selfMultiply(n,0)}}else if(2===arguments.length){var i,r,s=arguments[0],a=arguments[1],o=null,u=null,l=null,h=null;o=(l=t.SPLIT*this._hi)-this._hi,h=t.SPLIT*s,o=l-o,i=this._hi-o,u=h-s;var c=(l=this._hi*s)+(h=o*(u=h-u)-l+o*(r=s-u)+i*u+i*r+(this._hi*a+this._lo*s)),f=h+(o=l-c);return this._hi=c,this._lo=f,this}}},{key:"selfSqr",value:function(){return this.selfMultiply(this)}},{key:"floor",value:function(){if(this.isNaN())return t.NaN;var e=Math.floor(this._hi),n=0;return e===this._hi&&(n=Math.floor(this._lo)),new t(e,n)}},{key:"negate",value:function(){return this.isNaN()?this:new t(-this._hi,-this._lo)}},{key:"clone",value:function(){try{return null}catch(t){if(t instanceof CloneNotSupportedException)return null;throw t}}},{key:"multiply",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return e.isNaN()?t.createNaN():t.copy(this).selfMultiply(e)}if("number"==typeof arguments[0]){var n=arguments[0];return A.isNaN(n)?t.createNaN():t.copy(this).selfMultiply(n,0)}}},{key:"isNaN",value:function(){return A.isNaN(this._hi)}},{key:"intValue",value:function(){return Math.trunc(this._hi)}},{key:"toString",value:function(){var e=t.magnitude(this._hi);return e>=-3&&e<=20?this.toStandardNotation():this.toSciNotation()}},{key:"toStandardNotation",value:function(){var e=this.getSpecialNumberString();if(null!==e)return e;var n=new Array(1).fill(null),i=this.extractSignificantDigits(!0,n),r=n[0]+1,s=i;if("."===i.charAt(0))s="0"+i;else if(r<0)s="0."+t.stringOfChar("0",-r)+i;else if(-1===i.indexOf(".")){var a=r-i.length;s=i+t.stringOfChar("0",a)+".0"}return this.isNegative()?"-"+s:s}},{key:"reciprocal",value:function(){var e,n,i,r,s=null,a=null,o=null,u=null;e=(i=1/this._hi)-(s=(o=t.SPLIT*i)-(s=o-i)),a=(u=t.SPLIT*this._hi)-this._hi;var l=i+(o=(1-(r=i*this._hi)-(u=s*(a=u-a)-r+s*(n=this._hi-a)+e*a+e*n)-i*this._lo)/this._hi);return new t(l,i-l+o)}},{key:"toSciNotation",value:function(){if(this.isZero())return t.SCI_NOT_ZERO;var e=this.getSpecialNumberString();if(null!==e)return e;var n=new Array(1).fill(null),i=this.extractSignificantDigits(!1,n),r=t.SCI_NOT_EXPONENT_CHAR+n[0];if("0"===i.charAt(0))throw new IllegalStateException("Found leading zero: "+i);var s="";i.length>1&&(s=i.substring(1));var a=i.charAt(0)+"."+s;return this.isNegative()?"-"+a+r:a+r}},{key:"abs",value:function(){return this.isNaN()?t.NaN:this.isNegative()?this.negate():new t(this)}},{key:"isPositive",value:function(){return this._hi>0||0===this._hi&&this._lo>0}},{key:"lt",value:function(t){return this._hi<t._hi||this._hi===t._hi&&this._lo<t._lo}},{key:"add",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return t.copy(this).selfAdd(e)}if("number"==typeof arguments[0]){var n=arguments[0];return t.copy(this).selfAdd(n)}}},{key:"init",value:function(){if(1===arguments.length){if("number"==typeof arguments[0]){var e=arguments[0];this._hi=e,this._lo=0}else if(arguments[0]instanceof t){var n=arguments[0];this._hi=n._hi,this._lo=n._lo}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this._hi=i,this._lo=r}}},{key:"gt",value:function(t){return this._hi>t._hi||this._hi===t._hi&&this._lo>t._lo}},{key:"isNegative",value:function(){return this._hi<0||0===this._hi&&this._lo<0}},{key:"trunc",value:function(){return this.isNaN()?t.NaN:this.isPositive()?this.floor():this.ceil()}},{key:"signum",value:function(){return this._hi>0?1:this._hi<0?-1:this._lo>0?1:this._lo<0?-1:0}},{key:"interfaces_",get:function(){return[E,x,I]}}],[{key:"constructor_",value:function(){if(this._hi=0,this._lo=0,0===arguments.length)this.init(0);else if(1===arguments.length){if("number"==typeof arguments[0]){var e=arguments[0];this.init(e)}else if(arguments[0]instanceof t){var n=arguments[0];this.init(n)}else if("string"==typeof arguments[0]){var i=arguments[0];t.constructor_.call(this,t.parse(i))}}else if(2===arguments.length){var r=arguments[0],s=arguments[1];this.init(r,s)}}},{key:"determinant",value:function(){if("number"==typeof arguments[3]&&"number"==typeof arguments[2]&&"number"==typeof arguments[0]&&"number"==typeof arguments[1]){var e=arguments[0],n=arguments[1],i=arguments[2],r=arguments[3];return t.determinant(t.valueOf(e),t.valueOf(n),t.valueOf(i),t.valueOf(r))}if(arguments[3]instanceof t&&arguments[2]instanceof t&&arguments[0]instanceof t&&arguments[1]instanceof t){var s=arguments[1],a=arguments[2],o=arguments[3];return arguments[0].multiply(o).selfSubtract(s.multiply(a))}}},{key:"sqr",value:function(e){return t.valueOf(e).selfMultiply(e)}},{key:"valueOf",value:function(){if("string"==typeof arguments[0]){var e=arguments[0];return t.parse(e)}if("number"==typeof arguments[0])return new t(arguments[0])}},{key:"sqrt",value:function(e){return t.valueOf(e).sqrt()}},{key:"parse",value:function(e){for(var n=0,i=e.length;ot.isWhitespace(e.charAt(n));)n++;var r=!1;if(n<i){var s=e.charAt(n);"-"!==s&&"+"!==s||(n++,"-"===s&&(r=!0))}for(var a=new t,o=0,u=0,l=0,h=!1;!(n>=i);){var c=e.charAt(n);if(n++,ot.isDigit(c)){var f=c-"0";a.selfMultiply(t.TEN),a.selfAdd(f),o++}else{if("."!==c){if("e"===c||"E"===c){var g=e.substring(n);try{l=at.parseInt(g)}catch(t){throw t instanceof NumberFormatException?new NumberFormatException("Invalid exponent "+g+" in string "+e):t}break}throw new NumberFormatException("Unexpected character '"+c+"' at position "+n+" in string "+e)}u=o,h=!0}}var v=a;h||(u=o);var y=o-u-l;if(0===y)v=a;else if(y>0){var d=t.TEN.pow(y);v=a.divide(d)}else if(y<0){var _=t.TEN.pow(-y);v=a.multiply(_)}return r?v.negate():v}},{key:"createNaN",value:function(){return new t(A.NaN,A.NaN)}},{key:"copy",value:function(e){return new t(e)}},{key:"magnitude",value:function(t){var e=Math.abs(t),n=Math.log(e)/Math.log(10),i=Math.trunc(Math.floor(n));return 10*Math.pow(10,i)<=e&&(i+=1),i}},{key:"stringOfChar",value:function(t,e){for(var n=new st,i=0;i<e;i++)n.append(t);return n.toString()}}])}();ut.PI=new ut(3.141592653589793,12246467991473532e-32),ut.TWO_PI=new ut(6.283185307179586,24492935982947064e-32),ut.PI_2=new ut(1.5707963267948966,6123233995736766e-32),ut.E=new ut(2.718281828459045,14456468917292502e-32),ut.NaN=new ut(A.NaN,A.NaN),ut.EPS=123259516440783e-46,ut.SPLIT=134217729,ut.MAX_PRINT_DIGITS=32,ut.TEN=ut.valueOf(10),ut.ONE=ut.valueOf(1),ut.SCI_NOT_EXPONENT_CHAR="E",ut.SCI_NOT_ZERO="0.0E0";var lt=function(){function t(){n(this,t)}return s(t,null,[{key:"orientationIndex",value:function(e,n,i){var r=t.orientationIndexFilter(e,n,i);if(r<=1)return r;var s=ut.valueOf(n.x).selfAdd(-e.x),a=ut.valueOf(n.y).selfAdd(-e.y),o=ut.valueOf(i.x).selfAdd(-n.x),u=ut.valueOf(i.y).selfAdd(-n.y);return s.selfMultiply(u).selfSubtract(a.selfMultiply(o)).signum()}},{key:"signOfDet2x2",value:function(){if(arguments[3]instanceof ut&&arguments[2]instanceof ut&&arguments[0]instanceof ut&&arguments[1]instanceof ut){var t=arguments[1],e=arguments[2],n=arguments[3];return arguments[0].multiply(n).selfSubtract(t.multiply(e)).signum()}if("number"==typeof arguments[3]&&"number"==typeof arguments[2]&&"number"==typeof arguments[0]&&"number"==typeof arguments[1]){var i=arguments[0],r=arguments[1],s=arguments[2],a=arguments[3],o=ut.valueOf(i),u=ut.valueOf(r),l=ut.valueOf(s),h=ut.valueOf(a);return o.multiply(h).selfSubtract(u.multiply(l)).signum()}}},{key:"intersection",value:function(t,e,n,i){var r=new ut(t.y).selfSubtract(e.y),s=new ut(e.x).selfSubtract(t.x),a=new ut(t.x).selfMultiply(e.y).selfSubtract(new ut(e.x).selfMultiply(t.y)),o=new ut(n.y).selfSubtract(i.y),u=new ut(i.x).selfSubtract(n.x),l=new ut(n.x).selfMultiply(i.y).selfSubtract(new ut(i.x).selfMultiply(n.y)),h=s.multiply(l).selfSubtract(u.multiply(a)),c=o.multiply(a).selfSubtract(r.multiply(l)),f=r.multiply(u).selfSubtract(o.multiply(s)),g=h.selfDivide(f).doubleValue(),v=c.selfDivide(f).doubleValue();return A.isNaN(g)||A.isInfinite(g)||A.isNaN(v)||A.isInfinite(v)?null:new X(g,v)}},{key:"orientationIndexFilter",value:function(e,n,i){var r=null,s=(e.x-i.x)*(n.y-i.y),a=(e.y-i.y)*(n.x-i.x),o=s-a;if(s>0){if(a<=0)return t.signum(o);r=s+a}else{if(!(s<0))return t.signum(o);if(a>=0)return t.signum(o);r=-s-a}var u=t.DP_SAFE_EPSILON*r;return o>=u||-o>=u?t.signum(o):2}},{key:"signum",value:function(t){return t>0?1:t<0?-1:0}}])}();lt.DP_SAFE_EPSILON=1e-15;var ht=function(){return s((function t(){n(this,t)}),[{key:"getM",value:function(t){if(this.hasM()){var e=this.getDimension()-this.getMeasures();return this.getOrdinate(t,e)}return A.NaN}},{key:"setOrdinate",value:function(t,e,n){}},{key:"getZ",value:function(t){return this.hasZ()?this.getOrdinate(t,2):A.NaN}},{key:"size",value:function(){}},{key:"getOrdinate",value:function(t,e){}},{key:"getCoordinate",value:function(){}},{key:"getCoordinateCopy",value:function(t){}},{key:"createCoordinate",value:function(){}},{key:"getDimension",value:function(){}},{key:"hasM",value:function(){return this.getMeasures()>0}},{key:"getX",value:function(t){}},{key:"hasZ",value:function(){return this.getDimension()-this.getMeasures()>2}},{key:"getMeasures",value:function(){return 0}},{key:"expandEnvelope",value:function(t){}},{key:"copy",value:function(){}},{key:"getY",value:function(t){}},{key:"toCoordinateArray",value:function(){}},{key:"interfaces_",get:function(){return[I]}}])}();ht.X=0,ht.Y=1,ht.Z=2,ht.M=3;var ct=function(){function t(){n(this,t)}return s(t,null,[{key:"index",value:function(t,e,n){return lt.orientationIndex(t,e,n)}},{key:"isCCW",value:function(){if(arguments[0]instanceof Array){var e=arguments[0],n=e.length-1;if(n<3)throw new m("Ring has fewer than 4 points, so orientation cannot be determined");for(var i=e[0],r=0,s=1;s<=n;s++){var a=e[s];a.y>i.y&&(i=a,r=s)}var o=r;do{(o-=1)<0&&(o=n)}while(e[o].equals2D(i)&&o!==r);var u=r;do{u=(u+1)%n}while(e[u].equals2D(i)&&u!==r);var l=e[o],h=e[u];if(l.equals2D(i)||h.equals2D(i)||l.equals2D(h))return!1;var c=t.index(l,i,h);return 0===c?l.x>h.x:c>0}if(rt(arguments[0],ht)){var f=arguments[0],g=f.size()-1;if(g<3)throw new m("Ring has fewer than 4 points, so orientation cannot be determined");for(var v=f.getCoordinate(0),y=0,d=1;d<=g;d++){var _=f.getCoordinate(d);_.y>v.y&&(v=_,y=d)}var p=null,k=y;do{(k-=1)<0&&(k=g),p=f.getCoordinate(k)}while(p.equals2D(v)&&k!==y);var x=null,I=y;do{I=(I+1)%g,x=f.getCoordinate(I)}while(x.equals2D(v)&&I!==y);if(p.equals2D(v)||x.equals2D(v)||p.equals2D(x))return!1;var E=t.index(p,v,x);return 0===E?p.x>x.x:E>0}}}])}();ct.CLOCKWISE=-1,ct.RIGHT=ct.CLOCKWISE,ct.COUNTERCLOCKWISE=1,ct.LEFT=ct.COUNTERCLOCKWISE,ct.COLLINEAR=0,ct.STRAIGHT=ct.COLLINEAR;var ft=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getCoordinate",value:function(){return this._minCoord}},{key:"getRightmostSide",value:function(t,e){var n=this.getRightmostSideOfSegment(t,e);return n<0&&(n=this.getRightmostSideOfSegment(t,e-1)),n<0&&(this._minCoord=null,this.checkForRightmostCoordinate(t)),n}},{key:"findRightmostEdgeAtVertex",value:function(){var t=this._minDe.getEdge().getCoordinates();G.isTrue(this._minIndex>0&&this._minIndex<t.length,"rightmost point expected to be interior vertex of edge");var e=t[this._minIndex-1],n=t[this._minIndex+1],i=ct.index(this._minCoord,n,e),r=!1;(e.y<this._minCoord.y&&n.y<this._minCoord.y&&i===ct.COUNTERCLOCKWISE||e.y>this._minCoord.y&&n.y>this._minCoord.y&&i===ct.CLOCKWISE)&&(r=!0),r&&(this._minIndex=this._minIndex-1)}},{key:"getRightmostSideOfSegment",value:function(t,e){var n=t.getEdge().getCoordinates();if(e<0||e+1>=n.length)return-1;if(n[e].y===n[e+1].y)return-1;var i=$.LEFT;return n[e].y<n[e+1].y&&(i=$.RIGHT),i}},{key:"getEdge",value:function(){return this._orientedDe}},{key:"checkForRightmostCoordinate",value:function(t){for(var e=t.getEdge().getCoordinates(),n=0;n<e.length-1;n++)(null===this._minCoord||e[n].x>this._minCoord.x)&&(this._minDe=t,this._minIndex=n,this._minCoord=e[n])}},{key:"findRightmostEdgeAtNode",value:function(){var t=this._minDe.getNode().getEdges();this._minDe=t.getRightmostEdge(),this._minDe.isForward()||(this._minDe=this._minDe.getSym(),this._minIndex=this._minDe.getEdge().getCoordinates().length-1)}},{key:"findEdge",value:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();n.isForward()&&this.checkForRightmostCoordinate(n)}G.isTrue(0!==this._minIndex||this._minCoord.equals(this._minDe.getCoordinate()),"inconsistency in rightmost processing"),0===this._minIndex?this.findRightmostEdgeAtNode():this.findRightmostEdgeAtVertex(),this._orientedDe=this._minDe,this.getRightmostSide(this._minDe,this._minIndex)===$.LEFT&&(this._orientedDe=this._minDe.getSym())}}],[{key:"constructor_",value:function(){this._minIndex=-1,this._minCoord=null,this._minDe=null,this._orientedDe=null}}])}(),gt=function(t){function i(t,r){var s;return n(this,i),(s=e(this,i,[r?t+" [ "+r+" ]":t])).pt=r?new X(r):void 0,s.name=Object.keys({TopologyException:i})[0],s}return l(i,t),s(i,[{key:"getCoordinate",value:function(){return this.pt}}])}(D),vt=function(){return s((function t(){n(this,t),this.array=[]}),[{key:"addLast",value:function(t){this.array.push(t)}},{key:"removeFirst",value:function(){return this.array.shift()}},{key:"isEmpty",value:function(){return 0===this.array.length}}])}(),yt=function(t){function i(t){var r;return n(this,i),(r=e(this,i)).array=[],t instanceof Z&&r.addAll(t),r}return l(i,t),s(i,[{key:"interfaces_",get:function(){return[nt,Z]}},{key:"ensureCapacity",value:function(){}},{key:"add",value:function(t){return 1===arguments.length?this.array.push(t):this.array.splice(arguments[0],0,arguments[1]),!0}},{key:"clear",value:function(){this.array=[]}},{key:"addAll",value:function(t){var e,n=a(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;this.array.push(i)}}catch(t){n.e(t)}finally{n.f()}}},{key:"set",value:function(t,e){var n=this.array[t];return this.array[t]=e,n}},{key:"iterator",value:function(){return new dt(this)}},{key:"get",value:function(t){if(t<0||t>=this.size())throw new et;return this.array[t]}},{key:"isEmpty",value:function(){return 0===this.array.length}},{key:"sort",value:function(t){t?this.array.sort((function(e,n){return t.compare(e,n)})):this.array.sort()}},{key:"size",value:function(){return this.array.length}},{key:"toArray",value:function(){return this.array.slice()}},{key:"remove",value:function(t){for(var e=0,n=this.array.length;e<n;e++)if(this.array[e]===t)return!!this.array.splice(e,1);return!1}},{key:Symbol.iterator,value:function(){return this.array.values()}}])}(nt),dt=function(){return s((function t(e){n(this,t),this.arrayList=e,this.position=0}),[{key:"next",value:function(){if(this.position===this.arrayList.size())throw new j;return this.arrayList.get(this.position++)}},{key:"hasNext",value:function(){return this.position<this.arrayList.size()}},{key:"set",value:function(t){return this.arrayList.set(this.position-1,t)}},{key:"remove",value:function(){this.arrayList.remove(this.arrayList.get(this.position))}}])}(),_t=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"clearVisitedEdges",value:function(){for(var t=this._dirEdgeList.iterator();t.hasNext();){t.next().setVisited(!1)}}},{key:"getRightmostCoordinate",value:function(){return this._rightMostCoord}},{key:"computeNodeDepth",value:function(t){for(var e=null,n=t.getEdges().iterator();n.hasNext();){var i=n.next();if(i.isVisited()||i.getSym().isVisited()){e=i;break}}if(null===e)throw new gt("unable to find edge to compute depths at "+t.getCoordinate());t.getEdges().computeDepths(e);for(var r=t.getEdges().iterator();r.hasNext();){var s=r.next();s.setVisited(!0),this.copySymDepths(s)}}},{key:"computeDepth",value:function(t){this.clearVisitedEdges();var e=this._finder.getEdge();e.getNode(),e.getLabel(),e.setEdgeDepths($.RIGHT,t),this.copySymDepths(e),this.computeDepths(e)}},{key:"create",value:function(t){this.addReachable(t),this._finder.findEdge(this._dirEdgeList),this._rightMostCoord=this._finder.getCoordinate()}},{key:"findResultEdges",value:function(){for(var t=this._dirEdgeList.iterator();t.hasNext();){var e=t.next();e.getDepth($.RIGHT)>=1&&e.getDepth($.LEFT)<=0&&!e.isInteriorAreaEdge()&&e.setInResult(!0)}}},{key:"computeDepths",value:function(t){var e=new J,n=new vt,i=t.getNode();for(n.addLast(i),e.add(i),t.setVisited(!0);!n.isEmpty();){var r=n.removeFirst();e.add(r),this.computeNodeDepth(r);for(var s=r.getEdges().iterator();s.hasNext();){var a=s.next().getSym();if(!a.isVisited()){var o=a.getNode();e.contains(o)||(n.addLast(o),e.add(o))}}}}},{key:"compareTo",value:function(t){var e=t;return this._rightMostCoord.x<e._rightMostCoord.x?-1:this._rightMostCoord.x>e._rightMostCoord.x?1:0}},{key:"getEnvelope",value:function(){if(null===this._env){for(var t=new U,e=this._dirEdgeList.iterator();e.hasNext();)for(var n=e.next().getEdge().getCoordinates(),i=0;i<n.length-1;i++)t.expandToInclude(n[i]);this._env=t}return this._env}},{key:"addReachable",value:function(t){var e=new it;for(e.add(t);!e.empty();){var n=e.pop();this.add(n,e)}}},{key:"copySymDepths",value:function(t){var e=t.getSym();e.setDepth($.LEFT,t.getDepth($.RIGHT)),e.setDepth($.RIGHT,t.getDepth($.LEFT))}},{key:"add",value:function(t,e){t.setVisited(!0),this._nodes.add(t);for(var n=t.getEdges().iterator();n.hasNext();){var i=n.next();this._dirEdgeList.add(i);var r=i.getSym().getNode();r.isVisited()||e.push(r)}}},{key:"getNodes",value:function(){return this._nodes}},{key:"getDirectedEdges",value:function(){return this._dirEdgeList}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this._finder=null,this._dirEdgeList=new yt,this._nodes=new yt,this._rightMostCoord=null,this._env=null,this._finder=new ft}}])}(),pt=function(){return s((function t(){n(this,t)}),null,[{key:"intersection",value:function(t,e,n,i){var r=t.x<e.x?t.x:e.x,s=t.y<e.y?t.y:e.y,a=t.x>e.x?t.x:e.x,o=t.y>e.y?t.y:e.y,u=n.x<i.x?n.x:i.x,l=n.y<i.y?n.y:i.y,h=n.x>i.x?n.x:i.x,c=n.y>i.y?n.y:i.y,f=((r>u?r:u)+(a<h?a:h))/2,g=((s>l?s:l)+(o<c?o:c))/2,v=t.x-f,y=t.y-g,d=e.x-f,_=e.y-g,p=n.x-f,m=n.y-g,k=i.x-f,x=i.y-g,I=y-_,E=d-v,N=v*_-d*y,T=m-x,S=k-p,L=p*x-k*m,C=I*S-T*E,R=(E*L-S*N)/C,w=(T*N-I*L)/C;return A.isNaN(R)||A.isInfinite(R)||A.isNaN(w)||A.isInfinite(w)?null:new X(R+f,w+g)}}])}(),mt=function(){return s((function t(){n(this,t)}),null,[{key:"arraycopy",value:function(t,e,n,i,r){for(var s=0,a=e;a<e+r;a++)n[i+s]=t[a],s++}},{key:"getProperty",value:function(t){return{"line.separator":"\n"}[t]}}])}(),kt=function(){function t(){n(this,t)}return s(t,null,[{key:"log10",value:function(e){var n=Math.log(e);return A.isInfinite(n)||A.isNaN(n)?n:n/t.LOG_10}},{key:"min",value:function(t,e,n,i){var r=t;return e<r&&(r=e),n<r&&(r=n),i<r&&(r=i),r}},{key:"clamp",value:function(){if("number"==typeof arguments[2]&&"number"==typeof arguments[0]&&"number"==typeof arguments[1]){var t=arguments[0],e=arguments[1],n=arguments[2];return t<e?e:t>n?n:t}if(Number.isInteger(arguments[2])&&Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var i=arguments[0],r=arguments[1],s=arguments[2];return i<r?r:i>s?s:i}}},{key:"wrap",value:function(t,e){return t<0?e- -t%e:t%e}},{key:"max",value:function(){if(3===arguments.length){var t=arguments[1],e=arguments[2],n=arguments[0];return t>n&&(n=t),e>n&&(n=e),n}if(4===arguments.length){var i=arguments[1],r=arguments[2],s=arguments[3],a=arguments[0];return i>a&&(a=i),r>a&&(a=r),s>a&&(a=s),a}}},{key:"average",value:function(t,e){return(t+e)/2}}])}();kt.LOG_10=Math.log(10);var xt=function(){function t(){n(this,t)}return s(t,null,[{key:"segmentToSegment",value:function(e,n,i,r){if(e.equals(n))return t.pointToSegment(e,i,r);if(i.equals(r))return t.pointToSegment(r,e,n);var s=!1;if(U.intersects(e,n,i,r)){var a=(n.x-e.x)*(r.y-i.y)-(n.y-e.y)*(r.x-i.x);if(0===a)s=!0;else{var o=(e.y-i.y)*(r.x-i.x)-(e.x-i.x)*(r.y-i.y),u=((e.y-i.y)*(n.x-e.x)-(e.x-i.x)*(n.y-e.y))/a,l=o/a;(l<0||l>1||u<0||u>1)&&(s=!0)}}else s=!0;return s?kt.min(t.pointToSegment(e,i,r),t.pointToSegment(n,i,r),t.pointToSegment(i,e,n),t.pointToSegment(r,e,n)):0}},{key:"pointToSegment",value:function(t,e,n){if(e.x===n.x&&e.y===n.y)return t.distance(e);var i=(n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y),r=((t.x-e.x)*(n.x-e.x)+(t.y-e.y)*(n.y-e.y))/i;if(r<=0)return t.distance(e);if(r>=1)return t.distance(n);var s=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/i;return Math.abs(s)*Math.sqrt(i)}},{key:"pointToLinePerpendicular",value:function(t,e,n){var i=(n.x-e.x)*(n.x-e.x)+(n.y-e.y)*(n.y-e.y),r=((e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y))/i;return Math.abs(r)*Math.sqrt(i)}},{key:"pointToSegmentString",value:function(e,n){if(0===n.length)throw new m("Line array must contain at least one vertex");for(var i=e.distance(n[0]),r=0;r<n.length-1;r++){var s=t.pointToSegment(e,n[r],n[r+1]);s<i&&(i=s)}return i}}])}(),It=function(){return s((function t(){n(this,t)}),[{key:"create",value:function(){if(1===arguments.length)arguments[0]instanceof Array||rt(arguments[0],ht);else if(2===arguments.length);else if(3===arguments.length){var t=arguments[0],e=arguments[1];return this.create(t,e)}}}])}(),Et=function(){return s((function t(){n(this,t)}),[{key:"filter",value:function(t){}}])}(),Nt=function(){return s((function t(){n(this,t)}),null,[{key:"ofLine",value:function(t){var e=t.size();if(e<=1)return 0;var n=0,i=new X;t.getCoordinate(0,i);for(var r=i.x,s=i.y,a=1;a<e;a++){t.getCoordinate(a,i);var o=i.x,u=i.y,l=o-r,h=u-s;n+=Math.sqrt(l*l+h*h),r=o,s=u}return n}}])}(),Tt=s((function t(){n(this,t)})),St=function(){function t(){n(this,t)}return s(t,null,[{key:"copyCoord",value:function(t,e,n,i){for(var r=Math.min(t.getDimension(),n.getDimension()),s=0;s<r;s++)n.setOrdinate(i,s,t.getOrdinate(e,s))}},{key:"isRing",value:function(t){var e=t.size();return 0===e||!(e<=3)&&(t.getOrdinate(0,ht.X)===t.getOrdinate(e-1,ht.X)&&t.getOrdinate(0,ht.Y)===t.getOrdinate(e-1,ht.Y))}},{key:"scroll",value:function(){if(2===arguments.length){if(rt(arguments[0],ht)&&Number.isInteger(arguments[1])){var e=arguments[0],n=arguments[1];t.scroll(e,n,t.isRing(e))}else if(rt(arguments[0],ht)&&arguments[1]instanceof X){var i=arguments[0],r=arguments[1],s=t.indexOf(r,i);if(s<=0)return null;t.scroll(i,s)}}else if(3===arguments.length){var a=arguments[0],o=arguments[1],u=arguments[2];if(o<=0)return null;for(var l=a.copy(),h=u?a.size()-1:a.size(),c=0;c<h;c++)for(var f=0;f<a.getDimension();f++)a.setOrdinate(c,f,l.getOrdinate((o+c)%h,f));if(u)for(var g=0;g<a.getDimension();g++)a.setOrdinate(h,g,a.getOrdinate(0,g))}}},{key:"isEqual",value:function(t,e){var n=t.size();if(n!==e.size())return!1;for(var i=Math.min(t.getDimension(),e.getDimension()),r=0;r<n;r++)for(var s=0;s<i;s++){var a=t.getOrdinate(r,s),o=e.getOrdinate(r,s);if(t.getOrdinate(r,s)!==e.getOrdinate(r,s)&&(!A.isNaN(a)||!A.isNaN(o)))return!1}return!0}},{key:"minCoordinateIndex",value:function(){if(1===arguments.length){var e=arguments[0];return t.minCoordinateIndex(e,0,e.size()-1)}if(3===arguments.length){for(var n=arguments[0],i=arguments[2],r=-1,s=null,a=arguments[1];a<=i;a++){var o=n.getCoordinate(a);(null===s||s.compareTo(o)>0)&&(s=o,r=a)}return r}}},{key:"extend",value:function(e,n,i){var r=e.create(i,n.getDimension()),s=n.size();if(t.copy(n,0,r,0,s),s>0)for(var a=s;a<i;a++)t.copy(n,s-1,r,a,1);return r}},{key:"reverse",value:function(e){for(var n=e.size()-1,i=Math.trunc(n/2),r=0;r<=i;r++)t.swap(e,r,n-r)}},{key:"swap",value:function(t,e,n){if(e===n)return null;for(var i=0;i<t.getDimension();i++){var r=t.getOrdinate(e,i);t.setOrdinate(e,i,t.getOrdinate(n,i)),t.setOrdinate(n,i,r)}}},{key:"copy",value:function(e,n,i,r,s){for(var a=0;a<s;a++)t.copyCoord(e,n+a,i,r+a)}},{key:"ensureValidRing",value:function(e,n){var i=n.size();return 0===i?n:i<=3?t.createClosedRing(e,n,4):n.getOrdinate(0,ht.X)===n.getOrdinate(i-1,ht.X)&&n.getOrdinate(0,ht.Y)===n.getOrdinate(i-1,ht.Y)?n:t.createClosedRing(e,n,i+1)}},{key:"indexOf",value:function(t,e){for(var n=0;n<e.size();n++)if(t.x===e.getOrdinate(n,ht.X)&&t.y===e.getOrdinate(n,ht.Y))return n;return-1}},{key:"createClosedRing",value:function(e,n,i){var r=e.create(i,n.getDimension()),s=n.size();t.copy(n,0,r,0,s);for(var a=s;a<i;a++)t.copy(n,0,r,a,1);return r}},{key:"minCoordinate",value:function(t){for(var e=null,n=0;n<t.size();n++){var i=t.getCoordinate(n);(null===e||e.compareTo(i)>0)&&(e=i)}return e}}])}(),Lt=function(){function t(){n(this,t)}return s(t,null,[{key:"toDimensionSymbol",value:function(e){switch(e){case t.FALSE:return t.SYM_FALSE;case t.TRUE:return t.SYM_TRUE;case t.DONTCARE:return t.SYM_DONTCARE;case t.P:return t.SYM_P;case t.L:return t.SYM_L;case t.A:return t.SYM_A}throw new m("Unknown dimension value: "+e)}},{key:"toDimensionValue",value:function(e){switch(ot.toUpperCase(e)){case t.SYM_FALSE:return t.FALSE;case t.SYM_TRUE:return t.TRUE;case t.SYM_DONTCARE:return t.DONTCARE;case t.SYM_P:return t.P;case t.SYM_L:return t.L;case t.SYM_A:return t.A}throw new m("Unknown dimension symbol: "+e)}}])}();Lt.P=0,Lt.L=1,Lt.A=2,Lt.FALSE=-1,Lt.TRUE=-2,Lt.DONTCARE=-3,Lt.SYM_FALSE="F",Lt.SYM_TRUE="T",Lt.SYM_DONTCARE="*",Lt.SYM_P="0",Lt.SYM_L="1",Lt.SYM_A="2";var Ct=function(){return s((function t(){n(this,t)}),[{key:"filter",value:function(t){}}])}(),Rt=function(){return s((function t(){n(this,t)}),[{key:"filter",value:function(t,e){}},{key:"isDone",value:function(){}},{key:"isGeometryChanged",value:function(){}}])}(),wt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"computeEnvelopeInternal",value:function(){return this.isEmpty()?new U:this._points.expandEnvelope(new U)}},{key:"isRing",value:function(){return this.isClosed()&&this.isSimple()}},{key:"getCoordinates",value:function(){return this._points.toCoordinateArray()}},{key:"copyInternal",value:function(){return new i(this._points.copy(),this._factory)}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this._points.size()!==n._points.size())return!1;for(var r=0;r<this._points.size();r++)if(!this.equal(this._points.getCoordinate(r),n._points.getCoordinate(r),e))return!1;return!0}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"normalize",value:function(){for(var t=0;t<Math.trunc(this._points.size()/2);t++){var e=this._points.size()-1-t;if(!this._points.getCoordinate(t).equals(this._points.getCoordinate(e))){if(this._points.getCoordinate(t).compareTo(this._points.getCoordinate(e))>0){var n=this._points.copy();St.reverse(n),this._points=n}return null}}}},{key:"getCoordinate",value:function(){return this.isEmpty()?null:this._points.getCoordinate(0)}},{key:"getBoundaryDimension",value:function(){return this.isClosed()?Lt.FALSE:0}},{key:"isClosed",value:function(){return!this.isEmpty()&&this.getCoordinateN(0).equals2D(this.getCoordinateN(this.getNumPoints()-1))}},{key:"reverseInternal",value:function(){var t=this._points.copy();return St.reverse(t),this.getFactory().createLineString(t)}},{key:"getEndPoint",value:function(){return this.isEmpty()?null:this.getPointN(this.getNumPoints()-1)}},{key:"getTypeCode",value:function(){return V.TYPECODE_LINESTRING}},{key:"getDimension",value:function(){return 1}},{key:"getLength",value:function(){return Nt.ofLine(this._points)}},{key:"getNumPoints",value:function(){return this._points.size()}},{key:"compareToSameClass",value:function(){if(1===arguments.length){for(var t=arguments[0],e=0,n=0;e<this._points.size()&&n<t._points.size();){var i=this._points.getCoordinate(e).compareTo(t._points.getCoordinate(n));if(0!==i)return i;e++,n++}return e<this._points.size()?1:n<t._points.size()?-1:0}if(2===arguments.length){var r=arguments[0];return arguments[1].compare(this._points,r._points)}}},{key:"apply",value:function(){if(rt(arguments[0],Et))for(var t=arguments[0],e=0;e<this._points.size();e++)t.filter(this._points.getCoordinate(e));else if(rt(arguments[0],Rt)){var n=arguments[0];if(0===this._points.size())return null;for(var i=0;i<this._points.size()&&(n.filter(this._points,i),!n.isDone());i++);n.isGeometryChanged()&&this.geometryChanged()}else if(rt(arguments[0],Ct)){arguments[0].filter(this)}else if(rt(arguments[0],k)){arguments[0].filter(this)}}},{key:"getBoundary",value:function(){throw new W}},{key:"isEquivalentClass",value:function(t){return t instanceof i}},{key:"getCoordinateN",value:function(t){return this._points.getCoordinate(t)}},{key:"getGeometryType",value:function(){return V.TYPENAME_LINESTRING}},{key:"getCoordinateSequence",value:function(){return this._points}},{key:"isEmpty",value:function(){return 0===this._points.size()}},{key:"init",value:function(t){if(null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),1===t.size())throw new m("Invalid number of points in LineString (found "+t.size()+" - must be 0 or >= 2)");this._points=t}},{key:"isCoordinate",value:function(t){for(var e=0;e<this._points.size();e++)if(this._points.getCoordinate(e).equals(t))return!0;return!1}},{key:"getStartPoint",value:function(){return this.isEmpty()?null:this.getPointN(0)}},{key:"getPointN",value:function(t){return this.getFactory().createPoint(this._points.getCoordinate(t))}},{key:"interfaces_",get:function(){return[Tt]}}],[{key:"constructor_",value:function(){if(this._points=null,0===arguments.length);else if(2===arguments.length){var t=arguments[0],e=arguments[1];V.constructor_.call(this,e),this.init(t)}}}])}(V),Ot=s((function t(){n(this,t)})),bt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"computeEnvelopeInternal",value:function(){if(this.isEmpty())return new U;var t=new U;return t.expandToInclude(this._coordinates.getX(0),this._coordinates.getY(0)),t}},{key:"getCoordinates",value:function(){return this.isEmpty()?[]:[this.getCoordinate()]}},{key:"copyInternal",value:function(){return new i(this._coordinates.copy(),this._factory)}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];return!!this.isEquivalentClass(t)&&(!(!this.isEmpty()||!t.isEmpty())||this.isEmpty()===t.isEmpty()&&this.equal(t.getCoordinate(),this.getCoordinate(),e))}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"normalize",value:function(){}},{key:"getCoordinate",value:function(){return 0!==this._coordinates.size()?this._coordinates.getCoordinate(0):null}},{key:"getBoundaryDimension",value:function(){return Lt.FALSE}},{key:"reverseInternal",value:function(){return this.getFactory().createPoint(this._coordinates.copy())}},{key:"getTypeCode",value:function(){return V.TYPECODE_POINT}},{key:"getDimension",value:function(){return 0}},{key:"getNumPoints",value:function(){return this.isEmpty()?0:1}},{key:"getX",value:function(){if(null===this.getCoordinate())throw new IllegalStateException("getX called on empty Point");return this.getCoordinate().x}},{key:"compareToSameClass",value:function(){if(1===arguments.length){var t=arguments[0];return this.getCoordinate().compareTo(t.getCoordinate())}if(2===arguments.length){var e=arguments[0];return arguments[1].compare(this._coordinates,e._coordinates)}}},{key:"apply",value:function(){if(rt(arguments[0],Et)){var t=arguments[0];if(this.isEmpty())return null;t.filter(this.getCoordinate())}else if(rt(arguments[0],Rt)){var e=arguments[0];if(this.isEmpty())return null;e.filter(this._coordinates,0),e.isGeometryChanged()&&this.geometryChanged()}else if(rt(arguments[0],Ct)){arguments[0].filter(this)}else if(rt(arguments[0],k)){arguments[0].filter(this)}}},{key:"getBoundary",value:function(){return this.getFactory().createGeometryCollection()}},{key:"getGeometryType",value:function(){return V.TYPENAME_POINT}},{key:"getCoordinateSequence",value:function(){return this._coordinates}},{key:"getY",value:function(){if(null===this.getCoordinate())throw new IllegalStateException("getY called on empty Point");return this.getCoordinate().y}},{key:"isEmpty",value:function(){return 0===this._coordinates.size()}},{key:"init",value:function(t){null===t&&(t=this.getFactory().getCoordinateSequenceFactory().create([])),G.isTrue(t.size()<=1),this._coordinates=t}},{key:"isSimple",value:function(){return!0}},{key:"interfaces_",get:function(){return[Ot]}}],[{key:"constructor_",value:function(){this._coordinates=null;var t=arguments[0],e=arguments[1];V.constructor_.call(this,e),this.init(t)}}])}(V),Mt=function(){function t(){n(this,t)}return s(t,null,[{key:"ofRing",value:function(){if(arguments[0]instanceof Array){var e=arguments[0];return Math.abs(t.ofRingSigned(e))}if(rt(arguments[0],ht)){var n=arguments[0];return Math.abs(t.ofRingSigned(n))}}},{key:"ofRingSigned",value:function(){if(arguments[0]instanceof Array){var t=arguments[0];if(t.length<3)return 0;for(var e=0,n=t[0].x,i=1;i<t.length-1;i++){var r=t[i].x-n,s=t[i+1].y;e+=r*(t[i-1].y-s)}return e/2}if(rt(arguments[0],ht)){var a=arguments[0],o=a.size();if(o<3)return 0;var u=new X,l=new X,h=new X;a.getCoordinate(0,l),a.getCoordinate(1,h);var c=l.x;h.x-=c;for(var f=0,g=1;g<o-1;g++)u.y=l.y,l.x=h.x,l.y=h.y,a.getCoordinate(g+1,h),h.x-=c,f+=l.x*(u.y-h.y);return f/2}}}])}(),At=function(){return s((function t(){n(this,t)}),null,[{key:"sort",value:function(){var t=arguments,e=arguments[0];if(1===arguments.length)e.sort((function(t,e){return t.compareTo(e)}));else if(2===arguments.length)e.sort((function(e,n){return t[1].compare(e,n)}));else if(3===arguments.length){var n=e.slice(arguments[1],arguments[2]);n.sort();var i=e.slice(0,arguments[1]).concat(n,e.slice(arguments[2],e.length));e.splice(0,e.length);var r,s=a(i);try{for(s.s();!(r=s.n()).done;){var o=r.value;e.push(o)}}catch(t){s.e(t)}finally{s.f()}}else if(4===arguments.length){var u=e.slice(arguments[1],arguments[2]);u.sort((function(e,n){return t[3].compare(e,n)}));var l=e.slice(0,arguments[1]).concat(u,e.slice(arguments[2],e.length));e.splice(0,e.length);var h,c=a(l);try{for(c.s();!(h=c.n()).done;){var f=h.value;e.push(f)}}catch(t){c.e(t)}finally{c.f()}}}},{key:"asList",value:function(t){var e,n=new yt,i=a(t);try{for(i.s();!(e=i.n()).done;){var r=e.value;n.add(r)}}catch(t){i.e(t)}finally{i.f()}return n}},{key:"copyOf",value:function(t,e){return t.slice(0,e)}}])}(),Pt=s((function t(){n(this,t)})),Dt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"computeEnvelopeInternal",value:function(){return this._shell.getEnvelopeInternal()}},{key:"getCoordinates",value:function(){if(this.isEmpty())return[];for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=this._shell.getCoordinates(),i=0;i<n.length;i++)t[++e]=n[i];for(var r=0;r<this._holes.length;r++)for(var s=this._holes[r].getCoordinates(),a=0;a<s.length;a++)t[++e]=s[a];return t}},{key:"getArea",value:function(){var t=0;t+=Mt.ofRing(this._shell.getCoordinateSequence());for(var e=0;e<this._holes.length;e++)t-=Mt.ofRing(this._holes[e].getCoordinateSequence());return t}},{key:"copyInternal",value:function(){for(var t=this._shell.copy(),e=new Array(this._holes.length).fill(null),n=0;n<this._holes.length;n++)e[n]=this._holes[n].copy();return new i(t,e,this._factory)}},{key:"isRectangle",value:function(){if(0!==this.getNumInteriorRing())return!1;if(null===this._shell)return!1;if(5!==this._shell.getNumPoints())return!1;for(var t=this._shell.getCoordinateSequence(),e=this.getEnvelopeInternal(),n=0;n<5;n++){var i=t.getX(n);if(i!==e.getMinX()&&i!==e.getMaxX())return!1;var r=t.getY(n);if(r!==e.getMinY()&&r!==e.getMaxY())return!1}for(var s=t.getX(0),a=t.getY(0),o=1;o<=4;o++){var u=t.getX(o),l=t.getY(o);if(u!==s===(l!==a))return!1;s=u,a=l}return!0}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t,r=this._shell,s=n._shell;if(!r.equalsExact(s,e))return!1;if(this._holes.length!==n._holes.length)return!1;for(var a=0;a<this._holes.length;a++)if(!this._holes[a].equalsExact(n._holes[a],e))return!1;return!0}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"normalize",value:function(){if(0===arguments.length){this._shell=this.normalized(this._shell,!0);for(var t=0;t<this._holes.length;t++)this._holes[t]=this.normalized(this._holes[t],!1);At.sort(this._holes)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];if(e.isEmpty())return null;var i=e.getCoordinateSequence(),r=St.minCoordinateIndex(i,0,i.size()-2);St.scroll(i,r,!0),ct.isCCW(i)===n&&St.reverse(i)}}},{key:"getCoordinate",value:function(){return this._shell.getCoordinate()}},{key:"getNumInteriorRing",value:function(){return this._holes.length}},{key:"getBoundaryDimension",value:function(){return 1}},{key:"reverseInternal",value:function(){for(var t=this.getExteriorRing().reverse(),e=new Array(this.getNumInteriorRing()).fill(null),n=0;n<e.length;n++)e[n]=this.getInteriorRingN(n).reverse();return this.getFactory().createPolygon(t,e)}},{key:"getTypeCode",value:function(){return V.TYPECODE_POLYGON}},{key:"getDimension",value:function(){return 2}},{key:"getLength",value:function(){var t=0;t+=this._shell.getLength();for(var e=0;e<this._holes.length;e++)t+=this._holes[e].getLength();return t}},{key:"getNumPoints",value:function(){for(var t=this._shell.getNumPoints(),e=0;e<this._holes.length;e++)t+=this._holes[e].getNumPoints();return t}},{key:"convexHull",value:function(){return this.getExteriorRing().convexHull()}},{key:"normalized",value:function(t,e){var n=t.copy();return this.normalize(n,e),n}},{key:"compareToSameClass",value:function(){if(1===arguments.length){var t=arguments[0],e=this._shell,n=t._shell;return e.compareToSameClass(n)}if(2===arguments.length){var i=arguments[1],r=arguments[0],s=this._shell,a=r._shell,o=s.compareToSameClass(a,i);if(0!==o)return o;for(var u=this.getNumInteriorRing(),l=r.getNumInteriorRing(),h=0;h<u&&h<l;){var c=this.getInteriorRingN(h),f=r.getInteriorRingN(h),g=c.compareToSameClass(f,i);if(0!==g)return g;h++}return h<u?1:h<l?-1:0}}},{key:"apply",value:function(){if(rt(arguments[0],Et)){var t=arguments[0];this._shell.apply(t);for(var e=0;e<this._holes.length;e++)this._holes[e].apply(t)}else if(rt(arguments[0],Rt)){var n=arguments[0];if(this._shell.apply(n),!n.isDone())for(var i=0;i<this._holes.length&&(this._holes[i].apply(n),!n.isDone());i++);n.isGeometryChanged()&&this.geometryChanged()}else if(rt(arguments[0],Ct)){arguments[0].filter(this)}else if(rt(arguments[0],k)){var r=arguments[0];r.filter(this),this._shell.apply(r);for(var s=0;s<this._holes.length;s++)this._holes[s].apply(r)}}},{key:"getBoundary",value:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();var t=new Array(this._holes.length+1).fill(null);t[0]=this._shell;for(var e=0;e<this._holes.length;e++)t[e+1]=this._holes[e];return t.length<=1?this.getFactory().createLinearRing(t[0].getCoordinateSequence()):this.getFactory().createMultiLineString(t)}},{key:"getGeometryType",value:function(){return V.TYPENAME_POLYGON}},{key:"getExteriorRing",value:function(){return this._shell}},{key:"isEmpty",value:function(){return this._shell.isEmpty()}},{key:"getInteriorRingN",value:function(t){return this._holes[t]}},{key:"interfaces_",get:function(){return[Pt]}}],[{key:"constructor_",value:function(){this._shell=null,this._holes=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(V.constructor_.call(this,n),null===t&&(t=this.getFactory().createLinearRing()),null===e&&(e=[]),V.hasNullElements(e))throw new m("holes must not contain null elements");if(t.isEmpty()&&V.hasNonEmptyElements(e))throw new m("shell is empty but holes are not");this._shell=t,this._holes=e}}])}(V),Ft=function(t){function i(){return n(this,i),e(this,i,arguments)}return l(i,t),s(i)}(K),Gt=function(t){function i(t){var r;return n(this,i),(r=e(this,i)).array=[],t instanceof Z&&r.addAll(t),r}return l(i,t),s(i,[{key:"contains",value:function(t){var e,n=a(this.array);try{for(n.s();!(e=n.n()).done;){if(0===e.value.compareTo(t))return!0}}catch(t){n.e(t)}finally{n.f()}return!1}},{key:"add",value:function(t){if(this.contains(t))return!1;for(var e=0,n=this.array.length;e<n;e++){if(1===this.array[e].compareTo(t))return!!this.array.splice(e,0,t)}return this.array.push(t),!0}},{key:"addAll",value:function(t){var e,n=a(t);try{for(n.s();!(e=n.n()).done;){var i=e.value;this.add(i)}}catch(t){n.e(t)}finally{n.f()}return!0}},{key:"remove",value:function(){throw new W}},{key:"size",value:function(){return this.array.length}},{key:"isEmpty",value:function(){return 0===this.array.length}},{key:"toArray",value:function(){return this.array.slice()}},{key:"iterator",value:function(){return new qt(this.array)}}])}(Ft),qt=function(){return s((function t(e){n(this,t),this.array=e,this.position=0}),[{key:"next",value:function(){if(this.position===this.array.length)throw new j;return this.array[this.position++]}},{key:"hasNext",value:function(){return this.position<this.array.length}},{key:"remove",value:function(){throw new W}}])}(),Yt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"computeEnvelopeInternal",value:function(){for(var t=new U,e=0;e<this._geometries.length;e++)t.expandToInclude(this._geometries[e].getEnvelopeInternal());return t}},{key:"getGeometryN",value:function(t){return this._geometries[t]}},{key:"getCoordinates",value:function(){for(var t=new Array(this.getNumPoints()).fill(null),e=-1,n=0;n<this._geometries.length;n++)for(var i=this._geometries[n].getCoordinates(),r=0;r<i.length;r++)t[++e]=i[r];return t}},{key:"getArea",value:function(){for(var t=0,e=0;e<this._geometries.length;e++)t+=this._geometries[e].getArea();return t}},{key:"copyInternal",value:function(){for(var t=new Array(this._geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this._geometries[e].copy();return new i(t,this._factory)}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];if(!this.isEquivalentClass(t))return!1;var n=t;if(this._geometries.length!==n._geometries.length)return!1;for(var r=0;r<this._geometries.length;r++)if(!this._geometries[r].equalsExact(n._geometries[r],e))return!1;return!0}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"normalize",value:function(){for(var t=0;t<this._geometries.length;t++)this._geometries[t].normalize();At.sort(this._geometries)}},{key:"getCoordinate",value:function(){return this.isEmpty()?null:this._geometries[0].getCoordinate()}},{key:"getBoundaryDimension",value:function(){for(var t=Lt.FALSE,e=0;e<this._geometries.length;e++)t=Math.max(t,this._geometries[e].getBoundaryDimension());return t}},{key:"reverseInternal",value:function(){for(var t=this._geometries.length,e=new yt(t),n=0;n<t;n++)e.add(this._geometries[n].reverse());return this.getFactory().buildGeometry(e)}},{key:"getTypeCode",value:function(){return V.TYPECODE_GEOMETRYCOLLECTION}},{key:"getDimension",value:function(){for(var t=Lt.FALSE,e=0;e<this._geometries.length;e++)t=Math.max(t,this._geometries[e].getDimension());return t}},{key:"getLength",value:function(){for(var t=0,e=0;e<this._geometries.length;e++)t+=this._geometries[e].getLength();return t}},{key:"getNumPoints",value:function(){for(var t=0,e=0;e<this._geometries.length;e++)t+=this._geometries[e].getNumPoints();return t}},{key:"getNumGeometries",value:function(){return this._geometries.length}},{key:"compareToSameClass",value:function(){if(1===arguments.length){var t=arguments[0],e=new Gt(At.asList(this._geometries)),n=new Gt(At.asList(t._geometries));return this.compare(e,n)}if(2===arguments.length){for(var i=arguments[1],r=arguments[0],s=this.getNumGeometries(),a=r.getNumGeometries(),o=0;o<s&&o<a;){var u=this.getGeometryN(o),l=r.getGeometryN(o),h=u.compareToSameClass(l,i);if(0!==h)return h;o++}return o<s?1:o<a?-1:0}}},{key:"apply",value:function(){if(rt(arguments[0],Et))for(var t=arguments[0],e=0;e<this._geometries.length;e++)this._geometries[e].apply(t);else if(rt(arguments[0],Rt)){var n=arguments[0];if(0===this._geometries.length)return null;for(var i=0;i<this._geometries.length&&(this._geometries[i].apply(n),!n.isDone());i++);n.isGeometryChanged()&&this.geometryChanged()}else if(rt(arguments[0],Ct)){var r=arguments[0];r.filter(this);for(var s=0;s<this._geometries.length;s++)this._geometries[s].apply(r)}else if(rt(arguments[0],k)){var a=arguments[0];a.filter(this);for(var o=0;o<this._geometries.length;o++)this._geometries[o].apply(a)}}},{key:"getBoundary",value:function(){return V.checkNotGeometryCollection(this),G.shouldNeverReachHere(),null}},{key:"getGeometryType",value:function(){return V.TYPENAME_GEOMETRYCOLLECTION}},{key:"isEmpty",value:function(){for(var t=0;t<this._geometries.length;t++)if(!this._geometries[t].isEmpty())return!1;return!0}}],[{key:"constructor_",value:function(){if(this._geometries=null,0===arguments.length);else if(2===arguments.length){var t=arguments[0],e=arguments[1];if(V.constructor_.call(this,e),null===t&&(t=[]),V.hasNullElements(t))throw new m("geometries must not contain null elements");this._geometries=t}}}])}(V),zt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"copyInternal",value:function(){for(var t=new Array(this._geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this._geometries[e].copy();return new i(t,this._factory)}},{key:"isValid",value:function(){return!0}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];return!!this.isEquivalentClass(t)&&f(i,"equalsExact",this,1).call(this,t,e)}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"getCoordinate",value:function(){if(1===arguments.length&&Number.isInteger(arguments[0])){var t=arguments[0];return this._geometries[t].getCoordinate()}return f(i,"getCoordinate",this,1).apply(this,arguments)}},{key:"getBoundaryDimension",value:function(){return Lt.FALSE}},{key:"getTypeCode",value:function(){return V.TYPECODE_MULTIPOINT}},{key:"getDimension",value:function(){return 0}},{key:"getBoundary",value:function(){return this.getFactory().createGeometryCollection()}},{key:"getGeometryType",value:function(){return V.TYPENAME_MULTIPOINT}},{key:"interfaces_",get:function(){return[Ot]}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];Yt.constructor_.call(this,t,e)}}])}(Yt),Xt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"copyInternal",value:function(){return new i(this._points.copy(),this._factory)}},{key:"getBoundaryDimension",value:function(){return Lt.FALSE}},{key:"isClosed",value:function(){return!!this.isEmpty()||f(i,"isClosed",this,1).call(this)}},{key:"reverseInternal",value:function(){var t=this._points.copy();return St.reverse(t),this.getFactory().createLinearRing(t)}},{key:"getTypeCode",value:function(){return V.TYPECODE_LINEARRING}},{key:"validateConstruction",value:function(){if(!this.isEmpty()&&!f(i,"isClosed",this,1).call(this))throw new m("Points of LinearRing do not form a closed linestring");if(this.getCoordinateSequence().size()>=1&&this.getCoordinateSequence().size()<i.MINIMUM_VALID_SIZE)throw new m("Invalid number of points in LinearRing (found "+this.getCoordinateSequence().size()+" - must be 0 or >= 4)")}},{key:"getGeometryType",value:function(){return V.TYPENAME_LINEARRING}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];wt.constructor_.call(this,t,e),this.validateConstruction()}}])}(wt);Xt.MINIMUM_VALID_SIZE=4;var Bt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"setOrdinate",value:function(t,e){switch(t){case i.X:this.x=e;break;case i.Y:this.y=e;break;default:throw new m("Invalid ordinate index: "+t)}}},{key:"getZ",value:function(){return X.NULL_ORDINATE}},{key:"getOrdinate",value:function(t){switch(t){case i.X:return this.x;case i.Y:return this.y}throw new m("Invalid ordinate index: "+t)}},{key:"setZ",value:function(t){throw new m("CoordinateXY dimension 2 does not support z-ordinate")}},{key:"copy",value:function(){return new i(this)}},{key:"toString",value:function(){return"("+this.x+", "+this.y+")"}},{key:"setCoordinate",value:function(t){this.x=t.x,this.y=t.y,this.z=t.getZ()}}],[{key:"constructor_",value:function(){if(0===arguments.length)X.constructor_.call(this);else if(1===arguments.length){if(arguments[0]instanceof i){var t=arguments[0];X.constructor_.call(this,t.x,t.y)}else if(arguments[0]instanceof X){var e=arguments[0];X.constructor_.call(this,e.x,e.y)}}else if(2===arguments.length){var n=arguments[0],r=arguments[1];X.constructor_.call(this,n,r,X.NULL_ORDINATE)}}}])}(X);Bt.X=0,Bt.Y=1,Bt.Z=-1,Bt.M=-1;var Ut=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getM",value:function(){return this._m}},{key:"setOrdinate",value:function(t,e){switch(t){case i.X:this.x=e;break;case i.Y:this.y=e;break;case i.M:this._m=e;break;default:throw new m("Invalid ordinate index: "+t)}}},{key:"setM",value:function(t){this._m=t}},{key:"getZ",value:function(){return X.NULL_ORDINATE}},{key:"getOrdinate",value:function(t){switch(t){case i.X:return this.x;case i.Y:return this.y;case i.M:return this._m}throw new m("Invalid ordinate index: "+t)}},{key:"setZ",value:function(t){throw new m("CoordinateXY dimension 2 does not support z-ordinate")}},{key:"copy",value:function(){return new i(this)}},{key:"toString",value:function(){return"("+this.x+", "+this.y+" m="+this.getM()+")"}},{key:"setCoordinate",value:function(t){this.x=t.x,this.y=t.y,this.z=t.getZ(),this._m=t.getM()}}],[{key:"constructor_",value:function(){if(this._m=null,0===arguments.length)X.constructor_.call(this),this._m=0;else if(1===arguments.length){if(arguments[0]instanceof i){var t=arguments[0];X.constructor_.call(this,t.x,t.y),this._m=t._m}else if(arguments[0]instanceof X){var e=arguments[0];X.constructor_.call(this,e.x,e.y),this._m=this.getM()}}else if(3===arguments.length){var n=arguments[0],r=arguments[1],s=arguments[2];X.constructor_.call(this,n,r,X.NULL_ORDINATE),this._m=s}}}])}(X);Ut.X=0,Ut.Y=1,Ut.Z=-1,Ut.M=2;var Vt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getM",value:function(){return this._m}},{key:"setOrdinate",value:function(t,e){switch(t){case X.X:this.x=e;break;case X.Y:this.y=e;break;case X.Z:this.z=e;break;case X.M:this._m=e;break;default:throw new m("Invalid ordinate index: "+t)}}},{key:"setM",value:function(t){this._m=t}},{key:"getOrdinate",value:function(t){switch(t){case X.X:return this.x;case X.Y:return this.y;case X.Z:return this.getZ();case X.M:return this.getM()}throw new m("Invalid ordinate index: "+t)}},{key:"copy",value:function(){return new i(this)}},{key:"toString",value:function(){return"("+this.x+", "+this.y+", "+this.getZ()+" m="+this.getM()+")"}},{key:"setCoordinate",value:function(t){this.x=t.x,this.y=t.y,this.z=t.getZ(),this._m=t.getM()}}],[{key:"constructor_",value:function(){if(this._m=null,0===arguments.length)X.constructor_.call(this),this._m=0;else if(1===arguments.length){if(arguments[0]instanceof i){var t=arguments[0];X.constructor_.call(this,t),this._m=t._m}else if(arguments[0]instanceof X){var e=arguments[0];X.constructor_.call(this,e),this._m=this.getM()}}else if(4===arguments.length){var n=arguments[0],r=arguments[1],s=arguments[2],a=arguments[3];X.constructor_.call(this,n,r,s),this._m=a}}}])}(X),Ht=function(){function t(){n(this,t)}return s(t,null,[{key:"measures",value:function(t){return t instanceof Bt?0:t instanceof Ut||t instanceof Vt?1:0}},{key:"dimension",value:function(t){return t instanceof Bt?2:t instanceof Ut?3:t instanceof Vt?4:3}},{key:"create",value:function(){if(1===arguments.length){var e=arguments[0];return t.create(e,0)}if(2===arguments.length){var n=arguments[0],i=arguments[1];return 2===n?new Bt:3===n&&0===i?new X:3===n&&1===i?new Ut:4===n&&1===i?new Vt:new X}}}])}(),Zt=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getCoordinate",value:function(t){return this.get(t)}},{key:"addAll",value:function(){if(2===arguments.length&&"boolean"==typeof arguments[1]&&rt(arguments[0],Z)){for(var t=arguments[1],e=!1,n=arguments[0].iterator();n.hasNext();)this.add(n.next(),t),e=!0;return e}return f(i,"addAll",this,1).apply(this,arguments)}},{key:"clone",value:function(){for(var t=f(i,"clone",this,1).call(this),e=0;e<this.size();e++)t.add(e,this.get(e).clone());return t}},{key:"toCoordinateArray",value:function(){if(0===arguments.length)return this.toArray(i.coordArrayType);if(1===arguments.length){if(arguments[0])return this.toArray(i.coordArrayType);for(var t=this.size(),e=new Array(t).fill(null),n=0;n<t;n++)e[n]=this.get(t-n-1);return e}}},{key:"add",value:function(){if(1===arguments.length){var t=arguments[0];return f(i,"add",this,1).call(this,t)}if(2===arguments.length){if(arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var e=arguments[0],n=arguments[1];return this.add(e,n,!0),!0}if(arguments[0]instanceof X&&"boolean"==typeof arguments[1]){var r=arguments[0];if(!arguments[1]&&this.size()>=1)if(this.get(this.size()-1).equals2D(r))return null;f(i,"add",this,1).call(this,r)}else if(arguments[0]instanceof Object&&"boolean"==typeof arguments[1]){var s=arguments[0],a=arguments[1];return this.add(s,a),!0}}else if(3===arguments.length){if("boolean"==typeof arguments[2]&&arguments[0]instanceof Array&&"boolean"==typeof arguments[1]){var o=arguments[0],u=arguments[1];if(arguments[2])for(var l=0;l<o.length;l++)this.add(o[l],u);else for(var h=o.length-1;h>=0;h--)this.add(o[h],u);return!0}if("boolean"==typeof arguments[2]&&Number.isInteger(arguments[0])&&arguments[1]instanceof X){var c=arguments[0],g=arguments[1];if(!arguments[2]){var v=this.size();if(v>0){if(c>0)if(this.get(c-1).equals2D(g))return null;if(c<v)if(this.get(c).equals2D(g))return null}}f(i,"add",this,1).call(this,c,g)}}else if(4===arguments.length){var y=arguments[0],d=arguments[1],_=arguments[2],p=arguments[3],m=1;_>p&&(m=-1);for(var k=_;k!==p;k+=m)this.add(y[k],d);return!0}}},{key:"closeRing",value:function(){if(this.size()>0){var t=this.get(0).copy();this.add(t,!1)}}}],[{key:"constructor_",value:function(){if(0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.ensureCapacity(t.length),this.add(t,!0)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.ensureCapacity(e.length),this.add(e,n)}}}])}(yt);Zt.coordArrayType=new Array(0).fill(null);var jt=function(){function t(){n(this,t)}return s(t,null,[{key:"isRing",value:function(t){return!(t.length<4)&&!!t[0].equals2D(t[t.length-1])}},{key:"ptNotInList",value:function(e,n){for(var i=0;i<e.length;i++){var r=e[i];if(t.indexOf(r,n)<0)return r}return null}},{key:"scroll",value:function(e,n){var i=t.indexOf(n,e);if(i<0)return null;var r=new Array(e.length).fill(null);mt.arraycopy(e,i,r,0,e.length-i),mt.arraycopy(e,0,r,e.length-i,i),mt.arraycopy(r,0,e,0,e.length)}},{key:"equals",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];if(t===e)return!0;if(null===t||null===e)return!1;if(t.length!==e.length)return!1;for(var n=0;n<t.length;n++)if(!t[n].equals(e[n]))return!1;return!0}if(3===arguments.length){var i=arguments[0],r=arguments[1],s=arguments[2];if(i===r)return!0;if(null===i||null===r)return!1;if(i.length!==r.length)return!1;for(var a=0;a<i.length;a++)if(0!==s.compare(i[a],r[a]))return!1;return!0}}},{key:"intersection",value:function(t,e){for(var n=new Zt,i=0;i<t.length;i++)e.intersects(t[i])&&n.add(t[i],!0);return n.toCoordinateArray()}},{key:"measures",value:function(t){if(null===t||0===t.length)return 0;var e,n=0,i=a(t);try{for(i.s();!(e=i.n()).done;){var r=e.value;n=Math.max(n,Ht.measures(r))}}catch(t){i.e(t)}finally{i.f()}return n}},{key:"hasRepeatedPoints",value:function(t){for(var e=1;e<t.length;e++)if(t[e-1].equals(t[e]))return!0;return!1}},{key:"removeRepeatedPoints",value:function(e){return t.hasRepeatedPoints(e)?new Zt(e,!1).toCoordinateArray():e}},{key:"reverse",value:function(t){for(var e=t.length-1,n=Math.trunc(e/2),i=0;i<=n;i++){var r=t[i];t[i]=t[e-i],t[e-i]=r}}},{key:"removeNull",value:function(t){for(var e=0,n=0;n<t.length;n++)null!==t[n]&&e++;var i=new Array(e).fill(null);if(0===e)return i;for(var r=0,s=0;s<t.length;s++)null!==t[s]&&(i[r++]=t[s]);return i}},{key:"copyDeep",value:function(){if(1===arguments.length){for(var t=arguments[0],e=new Array(t.length).fill(null),n=0;n<t.length;n++)e[n]=t[n].copy();return e}if(5===arguments.length)for(var i=arguments[0],r=arguments[1],s=arguments[2],a=arguments[3],o=arguments[4],u=0;u<o;u++)s[a+u]=i[r+u].copy()}},{key:"isEqualReversed",value:function(t,e){for(var n=0;n<t.length;n++){var i=t[n],r=e[t.length-n-1];if(0!==i.compareTo(r))return!1}return!0}},{key:"envelope",value:function(t){for(var e=new U,n=0;n<t.length;n++)e.expandToInclude(t[n]);return e}},{key:"toCoordinateArray",value:function(e){return e.toArray(t.coordArrayType)}},{key:"dimension",value:function(t){if(null===t||0===t.length)return 3;var e,n=0,i=a(t);try{for(i.s();!(e=i.n()).done;){var r=e.value;n=Math.max(n,Ht.dimension(r))}}catch(t){i.e(t)}finally{i.f()}return n}},{key:"atLeastNCoordinatesOrNothing",value:function(t,e){return e.length>=t?e:[]}},{key:"indexOf",value:function(t,e){for(var n=0;n<e.length;n++)if(t.equals(e[n]))return n;return-1}},{key:"increasingDirection",value:function(t){for(var e=0;e<Math.trunc(t.length/2);e++){var n=t.length-1-e,i=t[e].compareTo(t[n]);if(0!==i)return i}return 1}},{key:"compare",value:function(t,e){for(var n=0;n<t.length&&n<e.length;){var i=t[n].compareTo(e[n]);if(0!==i)return i;n++}return n<e.length?-1:n<t.length?1:0}},{key:"minCoordinate",value:function(t){for(var e=null,n=0;n<t.length;n++)(null===e||e.compareTo(t[n])>0)&&(e=t[n]);return e}},{key:"extract",value:function(t,e,n){e=kt.clamp(e,0,t.length);var i=(n=kt.clamp(n,-1,t.length))-e+1;n<0&&(i=0),e>=t.length&&(i=0),n<e&&(i=0);var r=new Array(i).fill(null);if(0===i)return r;for(var s=0,a=e;a<=n;a++)r[s++]=t[a];return r}}])}(),Wt=function(){return s((function t(){n(this,t)}),[{key:"compare",value:function(t,e){var n=t,i=e;return jt.compare(n,i)}},{key:"interfaces_",get:function(){return[P]}}])}(),Kt=function(){return s((function t(){n(this,t)}),[{key:"compare",value:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;var r=jt.compare(n,i);return jt.isEqualReversed(n,i)?0:r}},{key:"OLDcompare",value:function(t,e){var n=t,i=e;if(n.length<i.length)return-1;if(n.length>i.length)return 1;if(0===n.length)return 0;for(var r=jt.increasingDirection(n),s=jt.increasingDirection(i),a=r>0?0:n.length-1,o=s>0?0:n.length-1,u=0;u<n.length;u++){var l=n[a].compareTo(i[o]);if(0!==l)return l;a+=r,o+=s}return 0}},{key:"interfaces_",get:function(){return[P]}}])}();jt.ForwardComparator=Wt,jt.BidirectionalComparator=Kt,jt.coordArrayType=new Array(0).fill(null);var Jt=function(){return s((function t(e){n(this,t),this.str=e}),[{key:"append",value:function(t){this.str+=t}},{key:"setCharAt",value:function(t,e){this.str=this.str.substr(0,t)+e+this.str.substr(t+1)}},{key:"toString",value:function(){return this.str}}])}(),Qt=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getM",value:function(t){return this.hasM()?this._coordinates[t].getM():A.NaN}},{key:"setOrdinate",value:function(t,e,n){switch(e){case ht.X:this._coordinates[t].x=n;break;case ht.Y:this._coordinates[t].y=n;break;default:this._coordinates[t].setOrdinate(e,n)}}},{key:"getZ",value:function(t){return this.hasZ()?this._coordinates[t].getZ():A.NaN}},{key:"size",value:function(){return this._coordinates.length}},{key:"getOrdinate",value:function(t,e){switch(e){case ht.X:return this._coordinates[t].x;case ht.Y:return this._coordinates[t].y;default:return this._coordinates[t].getOrdinate(e)}}},{key:"getCoordinate",value:function(){if(1===arguments.length){var t=arguments[0];return this._coordinates[t]}if(2===arguments.length){var e=arguments[0];arguments[1].setCoordinate(this._coordinates[e])}}},{key:"getCoordinateCopy",value:function(t){var e=this.createCoordinate();return e.setCoordinate(this._coordinates[t]),e}},{key:"createCoordinate",value:function(){return Ht.create(this.getDimension(),this.getMeasures())}},{key:"getDimension",value:function(){return this._dimension}},{key:"getX",value:function(t){return this._coordinates[t].x}},{key:"getMeasures",value:function(){return this._measures}},{key:"expandEnvelope",value:function(t){for(var e=0;e<this._coordinates.length;e++)t.expandToInclude(this._coordinates[e]);return t}},{key:"copy",value:function(){for(var e=new Array(this.size()).fill(null),n=0;n<this._coordinates.length;n++){var i=this.createCoordinate();i.setCoordinate(this._coordinates[n]),e[n]=i}return new t(e,this._dimension,this._measures)}},{key:"toString",value:function(){if(this._coordinates.length>0){var t=new Jt(17*this._coordinates.length);t.append("("),t.append(this._coordinates[0]);for(var e=1;e<this._coordinates.length;e++)t.append(", "),t.append(this._coordinates[e]);return t.append(")"),t.toString()}return"()"}},{key:"getY",value:function(t){return this._coordinates[t].y}},{key:"toCoordinateArray",value:function(){return this._coordinates}},{key:"interfaces_",get:function(){return[ht,E]}}],[{key:"constructor_",value:function(){if(this._dimension=3,this._measures=0,this._coordinates=null,1===arguments.length){if(arguments[0]instanceof Array){var e=arguments[0];t.constructor_.call(this,e,jt.dimension(e),jt.measures(e))}else if(Number.isInteger(arguments[0])){var n=arguments[0];this._coordinates=new Array(n).fill(null);for(var i=0;i<n;i++)this._coordinates[i]=new X}else if(rt(arguments[0],ht)){var r=arguments[0];if(null===r)return this._coordinates=new Array(0).fill(null),null;this._dimension=r.getDimension(),this._measures=r.getMeasures(),this._coordinates=new Array(r.size()).fill(null);for(var s=0;s<this._coordinates.length;s++)this._coordinates[s]=r.getCoordinateCopy(s)}}else if(2===arguments.length){if(arguments[0]instanceof Array&&Number.isInteger(arguments[1])){var a=arguments[0],o=arguments[1];t.constructor_.call(this,a,o,jt.measures(a))}else if(Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var u=arguments[0],l=arguments[1];this._coordinates=new Array(u).fill(null),this._dimension=l;for(var h=0;h<u;h++)this._coordinates[h]=Ht.create(l)}}else if(3===arguments.length)if(Number.isInteger(arguments[2])&&arguments[0]instanceof Array&&Number.isInteger(arguments[1])){var c=arguments[0],f=arguments[1],g=arguments[2];this._dimension=f,this._measures=g,this._coordinates=null===c?new Array(0).fill(null):c}else if(Number.isInteger(arguments[2])&&Number.isInteger(arguments[0])&&Number.isInteger(arguments[1])){var v=arguments[0],y=arguments[1],d=arguments[2];this._coordinates=new Array(v).fill(null),this._dimension=y,this._measures=d;for(var _=0;_<v;_++)this._coordinates[_]=this.createCoordinate()}}}])}(),$t=function(){function t(){n(this,t)}return s(t,[{key:"readResolve",value:function(){return t.instance()}},{key:"create",value:function(){if(1===arguments.length){if(arguments[0]instanceof Array)return new Qt(arguments[0]);if(rt(arguments[0],ht))return new Qt(arguments[0])}else{if(2===arguments.length){var t=arguments[1];return t>3&&(t=3),t<2&&(t=2),new Qt(arguments[0],t)}if(3===arguments.length){var e=arguments[2],n=arguments[1]-e;return e>1&&(e=1),n>3&&(n=3),n<2&&(n=2),new Qt(arguments[0],n+e,e)}}}},{key:"interfaces_",get:function(){return[It,E]}}],[{key:"instance",value:function(){return t.instanceObject}}])}();$t.instanceObject=new $t;var te=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"copyInternal",value:function(){for(var t=new Array(this._geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this._geometries[e].copy();return new i(t,this._factory)}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];return!!this.isEquivalentClass(t)&&f(i,"equalsExact",this,1).call(this,t,e)}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"getBoundaryDimension",value:function(){return 1}},{key:"getTypeCode",value:function(){return V.TYPECODE_MULTIPOLYGON}},{key:"getDimension",value:function(){return 2}},{key:"getBoundary",value:function(){if(this.isEmpty())return this.getFactory().createMultiLineString();for(var t=new yt,e=0;e<this._geometries.length;e++)for(var n=this._geometries[e].getBoundary(),i=0;i<n.getNumGeometries();i++)t.add(n.getGeometryN(i));var r=new Array(t.size()).fill(null);return this.getFactory().createMultiLineString(t.toArray(r))}},{key:"getGeometryType",value:function(){return V.TYPENAME_MULTIPOLYGON}},{key:"interfaces_",get:function(){return[Pt]}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];Yt.constructor_.call(this,t,e)}}])}(Yt),ee=function(){return s((function t(){n(this,t)}),[{key:"get",value:function(){}},{key:"put",value:function(){}},{key:"size",value:function(){}},{key:"values",value:function(){}},{key:"entrySet",value:function(){}}])}(),ne=function(t){function i(){var t;return n(this,i),(t=e(this,i)).map=new Map,t}return l(i,t),s(i,[{key:"get",value:function(t){return this.map.get(t)||null}},{key:"put",value:function(t,e){return this.map.set(t,e),e}},{key:"values",value:function(){for(var t=new yt,e=this.map.values(),n=e.next();!n.done;)t.add(n.value),n=e.next();return t}},{key:"entrySet",value:function(){var t=new J;return this.map.entries().forEach((function(e){return t.add(e)})),t}},{key:"size",value:function(){return this.map.size()}}])}(ee),ie=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"equals",value:function(e){if(!(e instanceof t))return!1;var n=e;return this._modelType===n._modelType&&this._scale===n._scale}},{key:"compareTo",value:function(t){var e=t,n=this.getMaximumSignificantDigits(),i=e.getMaximumSignificantDigits();return at.compare(n,i)}},{key:"getScale",value:function(){return this._scale}},{key:"isFloating",value:function(){return this._modelType===t.FLOATING||this._modelType===t.FLOATING_SINGLE}},{key:"getType",value:function(){return this._modelType}},{key:"toString",value:function(){var e="UNKNOWN";return this._modelType===t.FLOATING?e="Floating":this._modelType===t.FLOATING_SINGLE?e="Floating-Single":this._modelType===t.FIXED&&(e="Fixed (Scale="+this.getScale()+")"),e}},{key:"makePrecise",value:function(){if("number"==typeof arguments[0]){var e=arguments[0];return A.isNaN(e)||this._modelType===t.FLOATING_SINGLE?e:this._modelType===t.FIXED?Math.round(e*this._scale)/this._scale:e}if(arguments[0]instanceof X){var n=arguments[0];if(this._modelType===t.FLOATING)return null;n.x=this.makePrecise(n.x),n.y=this.makePrecise(n.y)}}},{key:"getMaximumSignificantDigits",value:function(){var e=16;return this._modelType===t.FLOATING?e=16:this._modelType===t.FLOATING_SINGLE?e=6:this._modelType===t.FIXED&&(e=1+Math.trunc(Math.ceil(Math.log(this.getScale())/Math.log(10)))),e}},{key:"setScale",value:function(t){this._scale=Math.abs(t)}},{key:"interfaces_",get:function(){return[E,x]}}],[{key:"constructor_",value:function(){if(this._modelType=null,this._scale=null,0===arguments.length)this._modelType=t.FLOATING;else if(1===arguments.length)if(arguments[0]instanceof re){var e=arguments[0];this._modelType=e,e===t.FIXED&&this.setScale(1)}else if("number"==typeof arguments[0]){var n=arguments[0];this._modelType=t.FIXED,this.setScale(n)}else if(arguments[0]instanceof t){var i=arguments[0];this._modelType=i._modelType,this._scale=i._scale}}},{key:"mostPrecise",value:function(t,e){return t.compareTo(e)>=0?t:e}}])}(),re=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"readResolve",value:function(){return t.nameToTypeMap.get(this._name)}},{key:"toString",value:function(){return this._name}},{key:"interfaces_",get:function(){return[E]}}],[{key:"constructor_",value:function(){this._name=null;var e=arguments[0];this._name=e,t.nameToTypeMap.put(e,this)}}])}();re.nameToTypeMap=new ne,ie.Type=re,ie.FIXED=new re("FIXED"),ie.FLOATING=new re("FLOATING"),ie.FLOATING_SINGLE=new re("FLOATING SINGLE"),ie.maximumPreciseValue=9007199254740992;var se=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"copyInternal",value:function(){for(var t=new Array(this._geometries.length).fill(null),e=0;e<t.length;e++)t[e]=this._geometries[e].copy();return new i(t,this._factory)}},{key:"equalsExact",value:function(){if(2===arguments.length&&"number"==typeof arguments[1]&&arguments[0]instanceof V){var t=arguments[0],e=arguments[1];return!!this.isEquivalentClass(t)&&f(i,"equalsExact",this,1).call(this,t,e)}return f(i,"equalsExact",this,1).apply(this,arguments)}},{key:"getBoundaryDimension",value:function(){return this.isClosed()?Lt.FALSE:0}},{key:"isClosed",value:function(){if(this.isEmpty())return!1;for(var t=0;t<this._geometries.length;t++)if(!this._geometries[t].isClosed())return!1;return!0}},{key:"getTypeCode",value:function(){return V.TYPECODE_MULTILINESTRING}},{key:"getDimension",value:function(){return 1}},{key:"getBoundary",value:function(){throw new W}},{key:"getGeometryType",value:function(){return V.TYPENAME_MULTILINESTRING}},{key:"interfaces_",get:function(){return[Tt]}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];Yt.constructor_.call(this,t,e)}}])}(Yt),ae=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"createEmpty",value:function(t){switch(t){case-1:return this.createGeometryCollection();case 0:return this.createPoint();case 1:return this.createLineString();case 2:return this.createPolygon();default:throw new m("Invalid dimension: "+t)}}},{key:"toGeometry",value:function(t){return t.isNull()?this.createPoint():t.getMinX()===t.getMaxX()&&t.getMinY()===t.getMaxY()?this.createPoint(new X(t.getMinX(),t.getMinY())):t.getMinX()===t.getMaxX()||t.getMinY()===t.getMaxY()?this.createLineString([new X(t.getMinX(),t.getMinY()),new X(t.getMaxX(),t.getMaxY())]):this.createPolygon(this.createLinearRing([new X(t.getMinX(),t.getMinY()),new X(t.getMinX(),t.getMaxY()),new X(t.getMaxX(),t.getMaxY()),new X(t.getMaxX(),t.getMinY()),new X(t.getMinX(),t.getMinY())]),null)}},{key:"createLineString",value:function(){if(0===arguments.length)return this.createLineString(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLineString(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(rt(arguments[0],ht))return new wt(arguments[0],this)}}},{key:"createMultiLineString",value:function(){return 0===arguments.length?new se(null,this):1===arguments.length?new se(arguments[0],this):void 0}},{key:"buildGeometry",value:function(e){for(var n=null,i=!1,r=!1,s=e.iterator();s.hasNext();){var a=s.next(),o=a.getTypeCode();null===n&&(n=o),o!==n&&(i=!0),a instanceof Yt&&(r=!0)}if(null===n)return this.createGeometryCollection();if(i||r)return this.createGeometryCollection(t.toGeometryArray(e));var u=e.iterator().next();if(e.size()>1){if(u instanceof Dt)return this.createMultiPolygon(t.toPolygonArray(e));if(u instanceof wt)return this.createMultiLineString(t.toLineStringArray(e));if(u instanceof bt)return this.createMultiPoint(t.toPointArray(e));G.shouldNeverReachHere("Unhandled geometry type: "+u.getGeometryType())}return u}},{key:"createMultiPointFromCoords",value:function(t){return this.createMultiPoint(null!==t?this.getCoordinateSequenceFactory().create(t):null)}},{key:"createPoint",value:function(){if(0===arguments.length)return this.createPoint(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof X){var t=arguments[0];return this.createPoint(null!==t?this.getCoordinateSequenceFactory().create([t]):null)}if(rt(arguments[0],ht))return new bt(arguments[0],this)}}},{key:"getCoordinateSequenceFactory",value:function(){return this._coordinateSequenceFactory}},{key:"createPolygon",value:function(){if(0===arguments.length)return this.createPolygon(null,null);if(1===arguments.length){if(rt(arguments[0],ht)){var t=arguments[0];return this.createPolygon(this.createLinearRing(t))}if(arguments[0]instanceof Array){var e=arguments[0];return this.createPolygon(this.createLinearRing(e))}if(arguments[0]instanceof Xt){var n=arguments[0];return this.createPolygon(n,null)}}else if(2===arguments.length){return new Dt(arguments[0],arguments[1],this)}}},{key:"getSRID",value:function(){return this._SRID}},{key:"createGeometryCollection",value:function(){return 0===arguments.length?new Yt(null,this):1===arguments.length?new Yt(arguments[0],this):void 0}},{key:"getPrecisionModel",value:function(){return this._precisionModel}},{key:"createLinearRing",value:function(){if(0===arguments.length)return this.createLinearRing(this.getCoordinateSequenceFactory().create([]));if(1===arguments.length){if(arguments[0]instanceof Array){var t=arguments[0];return this.createLinearRing(null!==t?this.getCoordinateSequenceFactory().create(t):null)}if(rt(arguments[0],ht))return new Xt(arguments[0],this)}}},{key:"createMultiPolygon",value:function(){return 0===arguments.length?new te(null,this):1===arguments.length?new te(arguments[0],this):void 0}},{key:"createMultiPoint",value:function(){if(0===arguments.length)return new zt(null,this);if(1===arguments.length){if(arguments[0]instanceof Array)return new zt(arguments[0],this);if(rt(arguments[0],ht)){var t=arguments[0];if(null===t)return this.createMultiPoint(new Array(0).fill(null));for(var e=new Array(t.size()).fill(null),n=0;n<t.size();n++){var i=this.getCoordinateSequenceFactory().create(1,t.getDimension(),t.getMeasures());St.copy(t,n,i,0,1),e[n]=this.createPoint(i)}return this.createMultiPoint(e)}}}},{key:"interfaces_",get:function(){return[E]}}],[{key:"constructor_",value:function(){if(this._precisionModel=null,this._coordinateSequenceFactory=null,this._SRID=null,0===arguments.length)t.constructor_.call(this,new ie,0);else if(1===arguments.length){if(rt(arguments[0],It)){var e=arguments[0];t.constructor_.call(this,new ie,0,e)}else if(arguments[0]instanceof ie){var n=arguments[0];t.constructor_.call(this,n,0,t.getDefaultCoordinateSequenceFactory())}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];t.constructor_.call(this,i,r,t.getDefaultCoordinateSequenceFactory())}else if(3===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2];this._precisionModel=s,this._coordinateSequenceFactory=o,this._SRID=a}}},{key:"toMultiPolygonArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toGeometryArray",value:function(t){if(null===t)return null;var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"getDefaultCoordinateSequenceFactory",value:function(){return $t.instance()}},{key:"toMultiLineStringArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toLineStringArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toMultiPointArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toLinearRingArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toPointArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"toPolygonArray",value:function(t){var e=new Array(t.size()).fill(null);return t.toArray(e)}},{key:"createPointFromInternalCoord",value:function(t,e){return e.getPrecisionModel().makePrecise(t),e.getFactory().createPoint(t)}}])}(),oe="XY",ue="XYZ",le="XYM",he="XYZM",ce={POINT:"Point",LINE_STRING:"LineString",LINEAR_RING:"LinearRing",POLYGON:"Polygon",MULTI_POINT:"MultiPoint",MULTI_LINE_STRING:"MultiLineString",MULTI_POLYGON:"MultiPolygon",GEOMETRY_COLLECTION:"GeometryCollection",CIRCLE:"Circle"},fe="EMPTY",ge=1,ve=2,ye=3,de=4,_e=5,pe=6;for(var me in ce)ce[me].toUpperCase();var ke=function(){return s((function t(e){n(this,t),this.wkt=e,this.index_=-1}),[{key:"isAlpha_",value:function(t){return t>="a"&&t<="z"||t>="A"&&t<="Z"}},{key:"isNumeric_",value:function(t,e){return t>="0"&&t<="9"||"."==t&&!(void 0!==e&&e)}},{key:"isWhiteSpace_",value:function(t){return" "==t||"\t"==t||"\r"==t||"\n"==t}},{key:"nextChar_",value:function(){return this.wkt.charAt(++this.index_)}},{key:"nextToken",value:function(){var t,e=this.nextChar_(),n=this.index_,i=e;if("("==e)t=ve;else if(","==e)t=_e;else if(")"==e)t=ye;else if(this.isNumeric_(e)||"-"==e)t=de,i=this.readNumber_();else if(this.isAlpha_(e))t=ge,i=this.readText_();else{if(this.isWhiteSpace_(e))return this.nextToken();if(""!==e)throw new Error("Unexpected character: "+e);t=pe}return{position:n,value:i,type:t}}},{key:"readNumber_",value:function(){var t,e=this.index_,n=!1,i=!1;do{"."==t?n=!0:"e"!=t&&"E"!=t||(i=!0),t=this.nextChar_()}while(this.isNumeric_(t,n)||!i&&("e"==t||"E"==t)||i&&("-"==t||"+"==t));return parseFloat(this.wkt.substring(e,this.index_--))}},{key:"readText_",value:function(){var t,e=this.index_;do{t=this.nextChar_()}while(this.isAlpha_(t));return this.wkt.substring(e,this.index_--).toUpperCase()}}])}(),xe=function(){return s((function t(e,i){n(this,t),this.lexer_=e,this.token_,this.layout_=oe,this.factory=i}),[{key:"consume_",value:function(){this.token_=this.lexer_.nextToken()}},{key:"isTokenType",value:function(t){return this.token_.type==t}},{key:"match",value:function(t){var e=this.isTokenType(t);return e&&this.consume_(),e}},{key:"parse",value:function(){return this.consume_(),this.parseGeometry_()}},{key:"parseGeometryLayout_",value:function(){var t=oe,e=this.token_;if(this.isTokenType(ge)){var n=e.value;"Z"===n?t=ue:"M"===n?t=le:"ZM"===n&&(t=he),t!==oe&&this.consume_()}return t}},{key:"parseGeometryCollectionText_",value:function(){if(this.match(ve)){var t=[];do{t.push(this.parseGeometry_())}while(this.match(_e));if(this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parsePointText_",value:function(){if(this.match(ve)){var t=this.parsePoint_();if(this.match(ye))return t}else if(this.isEmptyGeometry_())return null;throw new Error(this.formatErrorMessage_())}},{key:"parseLineStringText_",value:function(){if(this.match(ve)){var t=this.parsePointList_();if(this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parsePolygonText_",value:function(){if(this.match(ve)){var t=this.parseLineStringTextList_();if(this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parseMultiPointText_",value:function(){var t;if(this.match(ve)){if(t=this.token_.type==ve?this.parsePointTextList_():this.parsePointList_(),this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parseMultiLineStringText_",value:function(){if(this.match(ve)){var t=this.parseLineStringTextList_();if(this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parseMultiPolygonText_",value:function(){if(this.match(ve)){var t=this.parsePolygonTextList_();if(this.match(ye))return t}else if(this.isEmptyGeometry_())return[];throw new Error(this.formatErrorMessage_())}},{key:"parsePoint_",value:function(){for(var t=[],e=this.layout_.length,n=0;n<e;++n){var i=this.token_;if(!this.match(de))break;t.push(i.value)}if(t.length==e)return t;throw new Error(this.formatErrorMessage_())}},{key:"parsePointList_",value:function(){for(var t=[this.parsePoint_()];this.match(_e);)t.push(this.parsePoint_());return t}},{key:"parsePointTextList_",value:function(){for(var t=[this.parsePointText_()];this.match(_e);)t.push(this.parsePointText_());return t}},{key:"parseLineStringTextList_",value:function(){for(var t=[this.parseLineStringText_()];this.match(_e);)t.push(this.parseLineStringText_());return t}},{key:"parsePolygonTextList_",value:function(){for(var t=[this.parsePolygonText_()];this.match(_e);)t.push(this.parsePolygonText_());return t}},{key:"isEmptyGeometry_",value:function(){var t=this.isTokenType(ge)&&this.token_.value==fe;return t&&this.consume_(),t}},{key:"formatErrorMessage_",value:function(){return"Unexpected `"+this.token_.value+"` at position "+this.token_.position+" in `"+this.lexer_.wkt+"`"}},{key:"parseGeometry_",value:function(){var t=this.factory,e=function(t){return i(X,g(t))},n=function(n){var i=n.map((function(n){return t.createLinearRing(n.map(e))}));return i.length>1?t.createPolygon(i[0],i.slice(1)):t.createPolygon(i[0])},r=this.token_;if(this.match(ge)){var s=r.value;if(this.layout_=this.parseGeometryLayout_(),"GEOMETRYCOLLECTION"==s){var a=this.parseGeometryCollectionText_();return t.createGeometryCollection(a)}switch(s){case"POINT":var o=this.parsePointText_();return o?t.createPoint(i(X,g(o))):t.createPoint();case"LINESTRING":var u=this.parseLineStringText_().map(e);return t.createLineString(u);case"LINEARRING":var l=this.parseLineStringText_().map(e);return t.createLinearRing(l);case"POLYGON":var h=this.parsePolygonText_();return h&&0!==h.length?n(h):t.createPolygon();case"MULTIPOINT":var c=this.parseMultiPointText_();if(!c||0===c.length)return t.createMultiPoint();var f=c.map(e).map((function(e){return t.createPoint(e)}));return t.createMultiPoint(f);case"MULTILINESTRING":var v=this.parseMultiLineStringText_().map((function(n){return t.createLineString(n.map(e))}));return t.createMultiLineString(v);case"MULTIPOLYGON":var y=this.parseMultiPolygonText_();if(!y||0===y.length)return t.createMultiPolygon();var d=y.map(n);return t.createMultiPolygon(d);default:throw new Error("Invalid geometry type: "+s)}}throw new Error(this.formatErrorMessage_())}}])}();function Ie(t){if(t.isEmpty())return"";var e=t.getCoordinate(),n=[e.x,e.y];return void 0===e.z||Number.isNaN(e.z)||n.push(e.z),void 0===e.m||Number.isNaN(e.m)||n.push(e.m),n.join(" ")}function Ee(t){for(var e=t.getCoordinates().map((function(t){var e=[t.x,t.y];return void 0===t.z||Number.isNaN(t.z)||e.push(t.z),void 0===t.m||Number.isNaN(t.m)||e.push(t.m),e})),n=[],i=0,r=e.length;i<r;++i)n.push(e[i].join(" "));return n.join(", ")}function Ne(t){var e=[];e.push("("+Ee(t.getExteriorRing())+")");for(var n=0,i=t.getNumInteriorRing();n<i;++n)e.push("("+Ee(t.getInteriorRingN(n))+")");return e.join(", ")}var Te={Point:Ie,LineString:Ee,LinearRing:Ee,Polygon:Ne,MultiPoint:function(t){for(var e=[],n=0,i=t.getNumGeometries();n<i;++n)e.push("("+Ie(t.getGeometryN(n))+")");return e.join(", ")},MultiLineString:function(t){for(var e=[],n=0,i=t.getNumGeometries();n<i;++n)e.push("("+Ee(t.getGeometryN(n))+")");return e.join(", ")},MultiPolygon:function(t){for(var e=[],n=0,i=t.getNumGeometries();n<i;++n)e.push("("+Ne(t.getGeometryN(n))+")");return e.join(", ")},GeometryCollection:function(t){for(var e=[],n=0,i=t.getNumGeometries();n<i;++n)e.push(Se(t.getGeometryN(n)));return e.join(", ")}};function Se(t){var e=t.getGeometryType(),n=Te[e];e=e.toUpperCase();var i=function(t){var e="";if(t.isEmpty())return e;var n=t.getCoordinate();return void 0===n.z||Number.isNaN(n.z)||(e+="Z"),void 0===n.m||Number.isNaN(n.m)||(e+="M"),e}(t);return i.length>0&&(e+=" "+i),t.isEmpty()?e+" "+fe:e+" ("+n(t)+")"}var Le=function(){return s((function t(e){n(this,t),this.geometryFactory=e||new ae,this.precisionModel=this.geometryFactory.getPrecisionModel()}),[{key:"read",value:function(t){var e=new ke(t);return new xe(e,this.geometryFactory).parse()}},{key:"write",value:function(t){return Se(t)}}])}(),Ce=function(){return s((function t(e){n(this,t),this.parser=new Le(e)}),[{key:"write",value:function(t){return this.parser.write(t)}}],[{key:"toLineString",value:function(t,e){if(2!==arguments.length)throw new Error("Not implemented");return"LINESTRING ( "+t.x+" "+t.y+", "+e.x+" "+e.y+" )"}}])}(),Re=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getIndexAlongSegment",value:function(t,e){return this.computeIntLineIndex(),this._intLineIndex[t][e]}},{key:"getTopologySummary",value:function(){var t=new Jt;return this.isEndPoint()&&t.append(" endpoint"),this._isProper&&t.append(" proper"),this.isCollinear()&&t.append(" collinear"),t.toString()}},{key:"computeIntersection",value:function(t,e,n,i){this._inputLines[0][0]=t,this._inputLines[0][1]=e,this._inputLines[1][0]=n,this._inputLines[1][1]=i,this._result=this.computeIntersect(t,e,n,i)}},{key:"getIntersectionNum",value:function(){return this._result}},{key:"computeIntLineIndex",value:function(){if(0===arguments.length)null===this._intLineIndex&&(this._intLineIndex=Array(2).fill().map((function(){return Array(2)})),this.computeIntLineIndex(0),this.computeIntLineIndex(1));else if(1===arguments.length){var t=arguments[0];this.getEdgeDistance(t,0)>this.getEdgeDistance(t,1)?(this._intLineIndex[t][0]=0,this._intLineIndex[t][1]=1):(this._intLineIndex[t][0]=1,this._intLineIndex[t][1]=0)}}},{key:"isProper",value:function(){return this.hasIntersection()&&this._isProper}},{key:"setPrecisionModel",value:function(t){this._precisionModel=t}},{key:"isInteriorIntersection",value:function(){if(0===arguments.length)return!!this.isInteriorIntersection(0)||!!this.isInteriorIntersection(1);if(1===arguments.length){for(var t=arguments[0],e=0;e<this._result;e++)if(!this._intPt[e].equals2D(this._inputLines[t][0])&&!this._intPt[e].equals2D(this._inputLines[t][1]))return!0;return!1}}},{key:"getIntersection",value:function(t){return this._intPt[t]}},{key:"isEndPoint",value:function(){return this.hasIntersection()&&!this._isProper}},{key:"hasIntersection",value:function(){return this._result!==t.NO_INTERSECTION}},{key:"getEdgeDistance",value:function(e,n){return t.computeEdgeDistance(this._intPt[n],this._inputLines[e][0],this._inputLines[e][1])}},{key:"isCollinear",value:function(){return this._result===t.COLLINEAR_INTERSECTION}},{key:"toString",value:function(){return Ce.toLineString(this._inputLines[0][0],this._inputLines[0][1])+" - "+Ce.toLineString(this._inputLines[1][0],this._inputLines[1][1])+this.getTopologySummary()}},{key:"getEndpoint",value:function(t,e){return this._inputLines[t][e]}},{key:"isIntersection",value:function(t){for(var e=0;e<this._result;e++)if(this._intPt[e].equals2D(t))return!0;return!1}},{key:"getIntersectionAlongSegment",value:function(t,e){return this.computeIntLineIndex(),this._intPt[this._intLineIndex[t][e]]}}],[{key:"constructor_",value:function(){this._result=null,this._inputLines=Array(2).fill().map((function(){return Array(2)})),this._intPt=new Array(2).fill(null),this._intLineIndex=null,this._isProper=null,this._pa=null,this._pb=null,this._precisionModel=null,this._intPt[0]=new X,this._intPt[1]=new X,this._pa=this._intPt[0],this._pb=this._intPt[1],this._result=0}},{key:"computeEdgeDistance",value:function(t,e,n){var i=Math.abs(n.x-e.x),r=Math.abs(n.y-e.y),s=-1;if(t.equals(e))s=0;else if(t.equals(n))s=i>r?i:r;else{var a=Math.abs(t.x-e.x),o=Math.abs(t.y-e.y);0!==(s=i>r?a:o)||t.equals(e)||(s=Math.max(a,o))}return G.isTrue(!(0===s&&!t.equals(e)),"Bad distance calculation"),s}},{key:"nonRobustComputeEdgeDistance",value:function(t,e,n){var i=t.x-e.x,r=t.y-e.y,s=Math.sqrt(i*i+r*r);return G.isTrue(!(0===s&&!t.equals(e)),"Invalid distance calculation"),s}}])}();Re.DONT_INTERSECT=0,Re.DO_INTERSECT=1,Re.COLLINEAR=2,Re.NO_INTERSECTION=0,Re.POINT_INTERSECTION=1,Re.COLLINEAR_INTERSECTION=2;var we=function(t){function i(){return n(this,i),e(this,i)}return l(i,t),s(i,[{key:"isInSegmentEnvelopes",value:function(t){var e=new U(this._inputLines[0][0],this._inputLines[0][1]),n=new U(this._inputLines[1][0],this._inputLines[1][1]);return e.contains(t)&&n.contains(t)}},{key:"computeIntersection",value:function(){if(3!==arguments.length)return f(i,"computeIntersection",this,1).apply(this,arguments);var t=arguments[0],e=arguments[1],n=arguments[2];if(this._isProper=!1,U.intersects(e,n,t)&&0===ct.index(e,n,t)&&0===ct.index(n,e,t))return this._isProper=!0,(t.equals(e)||t.equals(n))&&(this._isProper=!1),this._result=Re.POINT_INTERSECTION,null;this._result=Re.NO_INTERSECTION}},{key:"intersection",value:function(t,e,n,r){var s=this.intersectionSafe(t,e,n,r);return this.isInSegmentEnvelopes(s)||(s=new X(i.nearestEndpoint(t,e,n,r))),null!==this._precisionModel&&this._precisionModel.makePrecise(s),s}},{key:"checkDD",value:function(t,e,n,i,r){var s=lt.intersection(t,e,n,i),a=this.isInSegmentEnvelopes(s);mt.out.println("DD in env = "+a+"  --------------------- "+s),r.distance(s)>1e-4&&mt.out.println("Distance = "+r.distance(s))}},{key:"intersectionSafe",value:function(t,e,n,r){var s=pt.intersection(t,e,n,r);return null===s&&(s=i.nearestEndpoint(t,e,n,r)),s}},{key:"computeCollinearIntersection",value:function(t,e,n,i){var r=U.intersects(t,e,n),s=U.intersects(t,e,i),a=U.intersects(n,i,t),o=U.intersects(n,i,e);return r&&s?(this._intPt[0]=n,this._intPt[1]=i,Re.COLLINEAR_INTERSECTION):a&&o?(this._intPt[0]=t,this._intPt[1]=e,Re.COLLINEAR_INTERSECTION):r&&a?(this._intPt[0]=n,this._intPt[1]=t,!n.equals(t)||s||o?Re.COLLINEAR_INTERSECTION:Re.POINT_INTERSECTION):r&&o?(this._intPt[0]=n,this._intPt[1]=e,!n.equals(e)||s||a?Re.COLLINEAR_INTERSECTION:Re.POINT_INTERSECTION):s&&a?(this._intPt[0]=i,this._intPt[1]=t,!i.equals(t)||r||o?Re.COLLINEAR_INTERSECTION:Re.POINT_INTERSECTION):s&&o?(this._intPt[0]=i,this._intPt[1]=e,!i.equals(e)||r||a?Re.COLLINEAR_INTERSECTION:Re.POINT_INTERSECTION):Re.NO_INTERSECTION}},{key:"computeIntersect",value:function(t,e,n,i){if(this._isProper=!1,!U.intersects(t,e,n,i))return Re.NO_INTERSECTION;var r=ct.index(t,e,n),s=ct.index(t,e,i);if(r>0&&s>0||r<0&&s<0)return Re.NO_INTERSECTION;var a=ct.index(n,i,t),o=ct.index(n,i,e);return a>0&&o>0||a<0&&o<0?Re.NO_INTERSECTION:0===r&&0===s&&0===a&&0===o?this.computeCollinearIntersection(t,e,n,i):(0===r||0===s||0===a||0===o?(this._isProper=!1,t.equals2D(n)||t.equals2D(i)?this._intPt[0]=t:e.equals2D(n)||e.equals2D(i)?this._intPt[0]=e:0===r?this._intPt[0]=new X(n):0===s?this._intPt[0]=new X(i):0===a?this._intPt[0]=new X(t):0===o&&(this._intPt[0]=new X(e))):(this._isProper=!0,this._intPt[0]=this.intersection(t,e,n,i)),Re.POINT_INTERSECTION)}}],[{key:"nearestEndpoint",value:function(t,e,n,i){var r=t,s=xt.pointToSegment(t,n,i),a=xt.pointToSegment(e,n,i);return a<s&&(s=a,r=e),(a=xt.pointToSegment(n,t,e))<s&&(s=a,r=n),(a=xt.pointToSegment(i,t,e))<s&&(s=a,r=i),r}}])}(Re),Oe=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"countSegment",value:function(t,e){if(t.x<this._p.x&&e.x<this._p.x)return null;if(this._p.x===e.x&&this._p.y===e.y)return this._isPointOnSegment=!0,null;if(t.y===this._p.y&&e.y===this._p.y){var n=t.x,i=e.x;return n>i&&(n=e.x,i=t.x),this._p.x>=n&&this._p.x<=i&&(this._isPointOnSegment=!0),null}if(t.y>this._p.y&&e.y<=this._p.y||e.y>this._p.y&&t.y<=this._p.y){var r=ct.index(t,e,this._p);if(r===ct.COLLINEAR)return this._isPointOnSegment=!0,null;e.y<t.y&&(r=-r),r===ct.LEFT&&this._crossingCount++}}},{key:"isPointInPolygon",value:function(){return this.getLocation()!==H.EXTERIOR}},{key:"getLocation",value:function(){return this._isPointOnSegment?H.BOUNDARY:this._crossingCount%2==1?H.INTERIOR:H.EXTERIOR}},{key:"isOnSegment",value:function(){return this._isPointOnSegment}}],[{key:"constructor_",value:function(){this._p=null,this._crossingCount=0,this._isPointOnSegment=!1;var t=arguments[0];this._p=t}},{key:"locatePointInRing",value:function(){if(arguments[0]instanceof X&&rt(arguments[1],ht)){for(var e=arguments[1],n=new t(arguments[0]),i=new X,r=new X,s=1;s<e.size();s++)if(e.getCoordinate(s,i),e.getCoordinate(s-1,r),n.countSegment(i,r),n.isOnSegment())return n.getLocation();return n.getLocation()}if(arguments[0]instanceof X&&arguments[1]instanceof Array){for(var a=arguments[1],o=new t(arguments[0]),u=1;u<a.length;u++){var l=a[u],h=a[u-1];if(o.countSegment(l,h),o.isOnSegment())return o.getLocation()}return o.getLocation()}}}])}(),be=function(){function t(){n(this,t)}return s(t,null,[{key:"isOnLine",value:function(){if(arguments[0]instanceof X&&rt(arguments[1],ht)){for(var t=arguments[0],e=arguments[1],n=new we,i=new X,r=new X,s=e.size(),a=1;a<s;a++)if(e.getCoordinate(a-1,i),e.getCoordinate(a,r),n.computeIntersection(t,i,r),n.hasIntersection())return!0;return!1}if(arguments[0]instanceof X&&arguments[1]instanceof Array){for(var o=arguments[0],u=arguments[1],l=new we,h=1;h<u.length;h++){var c=u[h-1],f=u[h];if(l.computeIntersection(o,c,f),l.hasIntersection())return!0}return!1}}},{key:"locateInRing",value:function(t,e){return Oe.locatePointInRing(t,e)}},{key:"isInRing",value:function(e,n){return t.locateInRing(e,n)!==H.EXTERIOR}}])}(),Me=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"setAllLocations",value:function(t){for(var e=0;e<this.location.length;e++)this.location[e]=t}},{key:"isNull",value:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]!==H.NONE)return!1;return!0}},{key:"setAllLocationsIfNull",value:function(t){for(var e=0;e<this.location.length;e++)this.location[e]===H.NONE&&(this.location[e]=t)}},{key:"isLine",value:function(){return 1===this.location.length}},{key:"merge",value:function(t){if(t.location.length>this.location.length){var e=new Array(3).fill(null);e[$.ON]=this.location[$.ON],e[$.LEFT]=H.NONE,e[$.RIGHT]=H.NONE,this.location=e}for(var n=0;n<this.location.length;n++)this.location[n]===H.NONE&&n<t.location.length&&(this.location[n]=t.location[n])}},{key:"getLocations",value:function(){return this.location}},{key:"flip",value:function(){if(this.location.length<=1)return null;var t=this.location[$.LEFT];this.location[$.LEFT]=this.location[$.RIGHT],this.location[$.RIGHT]=t}},{key:"toString",value:function(){var t=new st;return this.location.length>1&&t.append(H.toLocationSymbol(this.location[$.LEFT])),t.append(H.toLocationSymbol(this.location[$.ON])),this.location.length>1&&t.append(H.toLocationSymbol(this.location[$.RIGHT])),t.toString()}},{key:"setLocations",value:function(t,e,n){this.location[$.ON]=t,this.location[$.LEFT]=e,this.location[$.RIGHT]=n}},{key:"get",value:function(t){return t<this.location.length?this.location[t]:H.NONE}},{key:"isArea",value:function(){return this.location.length>1}},{key:"isAnyNull",value:function(){for(var t=0;t<this.location.length;t++)if(this.location[t]===H.NONE)return!0;return!1}},{key:"setLocation",value:function(){if(1===arguments.length){var t=arguments[0];this.setLocation($.ON,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.location[e]=n}}},{key:"init",value:function(t){this.location=new Array(t).fill(null),this.setAllLocations(H.NONE)}},{key:"isEqualOnSide",value:function(t,e){return this.location[e]===t.location[e]}},{key:"allPositionsEqual",value:function(t){for(var e=0;e<this.location.length;e++)if(this.location[e]!==t)return!1;return!0}}],[{key:"constructor_",value:function(){if(this.location=null,1===arguments.length){if(arguments[0]instanceof Array){var e=arguments[0];this.init(e.length)}else if(Number.isInteger(arguments[0])){var n=arguments[0];this.init(1),this.location[$.ON]=n}else if(arguments[0]instanceof t){var i=arguments[0];if(this.init(i.location.length),null!==i)for(var r=0;r<this.location.length;r++)this.location[r]=i.location[r]}}else if(3===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2];this.init(3),this.location[$.ON]=s,this.location[$.LEFT]=a,this.location[$.RIGHT]=o}}}])}(),Ae=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getGeometryCount",value:function(){var t=0;return this.elt[0].isNull()||t++,this.elt[1].isNull()||t++,t}},{key:"setAllLocations",value:function(t,e){this.elt[t].setAllLocations(e)}},{key:"isNull",value:function(t){return this.elt[t].isNull()}},{key:"setAllLocationsIfNull",value:function(){if(1===arguments.length){var t=arguments[0];this.setAllLocationsIfNull(0,t),this.setAllLocationsIfNull(1,t)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.elt[e].setAllLocationsIfNull(n)}}},{key:"isLine",value:function(t){return this.elt[t].isLine()}},{key:"merge",value:function(t){for(var e=0;e<2;e++)null===this.elt[e]&&null!==t.elt[e]?this.elt[e]=new Me(t.elt[e]):this.elt[e].merge(t.elt[e])}},{key:"flip",value:function(){this.elt[0].flip(),this.elt[1].flip()}},{key:"getLocation",value:function(){if(1===arguments.length){var t=arguments[0];return this.elt[t].get($.ON)}if(2===arguments.length){var e=arguments[0],n=arguments[1];return this.elt[e].get(n)}}},{key:"toString",value:function(){var t=new st;return null!==this.elt[0]&&(t.append("A:"),t.append(this.elt[0].toString())),null!==this.elt[1]&&(t.append(" B:"),t.append(this.elt[1].toString())),t.toString()}},{key:"isArea",value:function(){if(0===arguments.length)return this.elt[0].isArea()||this.elt[1].isArea();if(1===arguments.length){var t=arguments[0];return this.elt[t].isArea()}}},{key:"isAnyNull",value:function(t){return this.elt[t].isAnyNull()}},{key:"setLocation",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.elt[t].setLocation($.ON,e)}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];this.elt[n].setLocation(i,r)}}},{key:"isEqualOnSide",value:function(t,e){return this.elt[0].isEqualOnSide(t.elt[0],e)&&this.elt[1].isEqualOnSide(t.elt[1],e)}},{key:"allPositionsEqual",value:function(t,e){return this.elt[t].allPositionsEqual(e)}},{key:"toLine",value:function(t){this.elt[t].isArea()&&(this.elt[t]=new Me(this.elt[t].location[0]))}}],[{key:"constructor_",value:function(){if(this.elt=new Array(2).fill(null),1===arguments.length){if(Number.isInteger(arguments[0])){var e=arguments[0];this.elt[0]=new Me(e),this.elt[1]=new Me(e)}else if(arguments[0]instanceof t){var n=arguments[0];this.elt[0]=new Me(n.elt[0]),this.elt[1]=new Me(n.elt[1])}}else if(2===arguments.length){var i=arguments[0],r=arguments[1];this.elt[0]=new Me(H.NONE),this.elt[1]=new Me(H.NONE),this.elt[i].setLocation(r)}else if(3===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2];this.elt[0]=new Me(s,a,o),this.elt[1]=new Me(s,a,o)}else if(4===arguments.length){var u=arguments[0],l=arguments[1],h=arguments[2],c=arguments[3];this.elt[0]=new Me(H.NONE,H.NONE,H.NONE),this.elt[1]=new Me(H.NONE,H.NONE,H.NONE),this.elt[u].setLocations(l,h,c)}}},{key:"toLineLabel",value:function(e){for(var n=new t(H.NONE),i=0;i<2;i++)n.setLocation(i,e.getLocation(i));return n}}])}(),Pe=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"computeRing",value:function(){if(null!==this._ring)return null;for(var t=new Array(this._pts.size()).fill(null),e=0;e<this._pts.size();e++)t[e]=this._pts.get(e);this._ring=this._geometryFactory.createLinearRing(t),this._isHole=ct.isCCW(this._ring.getCoordinates())}},{key:"isIsolated",value:function(){return 1===this._label.getGeometryCount()}},{key:"computePoints",value:function(t){this._startDe=t;var e=t,n=!0;do{if(null===e)throw new gt("Found null DirectedEdge");if(e.getEdgeRing()===this)throw new gt("Directed Edge visited twice during ring-building at "+e.getCoordinate());this._edges.add(e);var i=e.getLabel();G.isTrue(i.isArea()),this.mergeLabel(i),this.addPoints(e.getEdge(),e.isForward(),n),n=!1,this.setEdgeRing(e,this),e=this.getNext(e)}while(e!==this._startDe)}},{key:"getLinearRing",value:function(){return this._ring}},{key:"getCoordinate",value:function(t){return this._pts.get(t)}},{key:"computeMaxNodeDegree",value:function(){this._maxNodeDegree=0;var t=this._startDe;do{var e=t.getNode().getEdges().getOutgoingDegree(this);e>this._maxNodeDegree&&(this._maxNodeDegree=e),t=this.getNext(t)}while(t!==this._startDe);this._maxNodeDegree*=2}},{key:"addPoints",value:function(t,e,n){var i=t.getCoordinates();if(e){var r=1;n&&(r=0);for(var s=r;s<i.length;s++)this._pts.add(i[s])}else{var a=i.length-2;n&&(a=i.length-1);for(var o=a;o>=0;o--)this._pts.add(i[o])}}},{key:"isHole",value:function(){return this._isHole}},{key:"setInResult",value:function(){var t=this._startDe;do{t.getEdge().setInResult(!0),t=t.getNext()}while(t!==this._startDe)}},{key:"containsPoint",value:function(t){var e=this.getLinearRing();if(!e.getEnvelopeInternal().contains(t))return!1;if(!be.isInRing(t,e.getCoordinates()))return!1;for(var n=this._holes.iterator();n.hasNext();){if(n.next().containsPoint(t))return!1}return!0}},{key:"addHole",value:function(t){this._holes.add(t)}},{key:"isShell",value:function(){return null===this._shell}},{key:"getLabel",value:function(){return this._label}},{key:"getEdges",value:function(){return this._edges}},{key:"getMaxNodeDegree",value:function(){return this._maxNodeDegree<0&&this.computeMaxNodeDegree(),this._maxNodeDegree}},{key:"getShell",value:function(){return this._shell}},{key:"mergeLabel",value:function(){if(1===arguments.length){var t=arguments[0];this.mergeLabel(t,0),this.mergeLabel(t,1)}else if(2===arguments.length){var e=arguments[1],n=arguments[0].getLocation(e,$.RIGHT);if(n===H.NONE)return null;if(this._label.getLocation(e)===H.NONE)return this._label.setLocation(e,n),null}}},{key:"setShell",value:function(t){this._shell=t,null!==t&&t.addHole(this)}},{key:"toPolygon",value:function(t){for(var e=new Array(this._holes.size()).fill(null),n=0;n<this._holes.size();n++)e[n]=this._holes.get(n).getLinearRing();return t.createPolygon(this.getLinearRing(),e)}}],[{key:"constructor_",value:function(){if(this._startDe=null,this._maxNodeDegree=-1,this._edges=new yt,this._pts=new yt,this._label=new Ae(H.NONE),this._ring=null,this._isHole=null,this._shell=null,this._holes=new yt,this._geometryFactory=null,0===arguments.length);else if(2===arguments.length){var t=arguments[0],e=arguments[1];this._geometryFactory=e,this.computePoints(t),this.computeRing()}}}])}(),De=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"setEdgeRing",value:function(t,e){t.setMinEdgeRing(e)}},{key:"getNext",value:function(t){return t.getNextMin()}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];Pe.constructor_.call(this,t,e)}}])}(Pe),Fe=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"buildMinimalRings",value:function(){var t=new yt,e=this._startDe;do{if(null===e.getMinEdgeRing()){var n=new De(e,this._geometryFactory);t.add(n)}e=e.getNext()}while(e!==this._startDe);return t}},{key:"setEdgeRing",value:function(t,e){t.setEdgeRing(e)}},{key:"linkDirectedEdgesForMinimalEdgeRings",value:function(){var t=this._startDe;do{t.getNode().getEdges().linkMinimalDirectedEdges(this),t=t.getNext()}while(t!==this._startDe)}},{key:"getNext",value:function(t){return t.getNext()}}],[{key:"constructor_",value:function(){var t=arguments[0],e=arguments[1];Pe.constructor_.call(this,t,e)}}])}(Pe),Ge=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"setVisited",value:function(t){this._isVisited=t}},{key:"setInResult",value:function(t){this._isInResult=t}},{key:"isCovered",value:function(){return this._isCovered}},{key:"isCoveredSet",value:function(){return this._isCoveredSet}},{key:"setLabel",value:function(t){this._label=t}},{key:"getLabel",value:function(){return this._label}},{key:"setCovered",value:function(t){this._isCovered=t,this._isCoveredSet=!0}},{key:"updateIM",value:function(t){G.isTrue(this._label.getGeometryCount()>=2,"found partial label"),this.computeIM(t)}},{key:"isInResult",value:function(){return this._isInResult}},{key:"isVisited",value:function(){return this._isVisited}}],[{key:"constructor_",value:function(){if(this._label=null,this._isInResult=!1,this._isCovered=!1,this._isCoveredSet=!1,this._isVisited=!1,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this._label=t}}}])}(),qe=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"isIncidentEdgeInResult",value:function(){for(var t=this.getEdges().getEdges().iterator();t.hasNext();){if(t.next().getEdge().isInResult())return!0}return!1}},{key:"isIsolated",value:function(){return 1===this._label.getGeometryCount()}},{key:"getCoordinate",value:function(){return this._coord}},{key:"print",value:function(t){t.println("node "+this._coord+" lbl: "+this._label)}},{key:"computeIM",value:function(t){}},{key:"computeMergedLocation",value:function(t,e){var n=H.NONE;if(n=this._label.getLocation(e),!t.isNull(e)){var i=t.getLocation(e);n!==H.BOUNDARY&&(n=i)}return n}},{key:"setLabel",value:function(){if(2!==arguments.length||!Number.isInteger(arguments[1])||!Number.isInteger(arguments[0]))return f(i,"setLabel",this,1).apply(this,arguments);var t=arguments[0],e=arguments[1];null===this._label?this._label=new Ae(t,e):this._label.setLocation(t,e)}},{key:"getEdges",value:function(){return this._edges}},{key:"mergeLabel",value:function(){if(arguments[0]instanceof i){var t=arguments[0];this.mergeLabel(t._label)}else if(arguments[0]instanceof Ae)for(var e=arguments[0],n=0;n<2;n++){var r=this.computeMergedLocation(e,n);this._label.getLocation(n)===H.NONE&&this._label.setLocation(n,r)}}},{key:"add",value:function(t){this._edges.insert(t),t.setNode(this)}},{key:"setLabelBoundary",value:function(t){if(null===this._label)return null;var e=H.NONE;null!==this._label&&(e=this._label.getLocation(t));var n=null;switch(e){case H.BOUNDARY:n=H.INTERIOR;break;case H.INTERIOR:default:n=H.BOUNDARY}this._label.setLocation(t,n)}}],[{key:"constructor_",value:function(){this._coord=null,this._edges=null;var t=arguments[0],e=arguments[1];this._coord=t,this._edges=e,this._label=new Ae(0,H.NONE)}}])}(Ge),Ye=function(t){function i(){return n(this,i),e(this,i,arguments)}return l(i,t),s(i)}(ee);function ze(t){return null==t?0:t.color}function Xe(t){return null==t?null:t.parent}function Be(t,e){null!==t&&(t.color=e)}function Ue(t){return null==t?null:t.left}function Ve(t){return null==t?null:t.right}var He=function(t){function i(){var t;return n(this,i),(t=e(this,i)).root_=null,t.size_=0,t}return l(i,t),s(i,[{key:"get",value:function(t){for(var e=this.root_;null!==e;){var n=t.compareTo(e.key);if(n<0)e=e.left;else{if(!(n>0))return e.value;e=e.right}}return null}},{key:"put",value:function(t,e){if(null===this.root_)return this.root_={key:t,value:e,left:null,right:null,parent:null,color:0,getValue:function(){return this.value},getKey:function(){return this.key}},this.size_=1,null;var n,i,r=this.root_;do{if(n=r,(i=t.compareTo(r.key))<0)r=r.left;else{if(!(i>0)){var s=r.value;return r.value=e,s}r=r.right}}while(null!==r);var a={key:t,left:null,right:null,value:e,parent:n,color:0,getValue:function(){return this.value},getKey:function(){return this.key}};return i<0?n.left=a:n.right=a,this.fixAfterInsertion(a),this.size_++,null}},{key:"fixAfterInsertion",value:function(t){var e;for(t.color=1;null!=t&&t!==this.root_&&1===t.parent.color;)Xe(t)===Ue(Xe(Xe(t)))?1===ze(e=Ve(Xe(Xe(t))))?(Be(Xe(t),0),Be(e,0),Be(Xe(Xe(t)),1),t=Xe(Xe(t))):(t===Ve(Xe(t))&&(t=Xe(t),this.rotateLeft(t)),Be(Xe(t),0),Be(Xe(Xe(t)),1),this.rotateRight(Xe(Xe(t)))):1===ze(e=Ue(Xe(Xe(t))))?(Be(Xe(t),0),Be(e,0),Be(Xe(Xe(t)),1),t=Xe(Xe(t))):(t===Ue(Xe(t))&&(t=Xe(t),this.rotateRight(t)),Be(Xe(t),0),Be(Xe(Xe(t)),1),this.rotateLeft(Xe(Xe(t))));this.root_.color=0}},{key:"values",value:function(){var t=new yt,e=this.getFirstEntry();if(null!==e)for(t.add(e.value);null!==(e=i.successor(e));)t.add(e.value);return t}},{key:"entrySet",value:function(){var t=new J,e=this.getFirstEntry();if(null!==e)for(t.add(e);null!==(e=i.successor(e));)t.add(e);return t}},{key:"rotateLeft",value:function(t){if(null!=t){var e=t.right;t.right=e.left,null!=e.left&&(e.left.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.left===t?t.parent.left=e:t.parent.right=e,e.left=t,t.parent=e}}},{key:"rotateRight",value:function(t){if(null!=t){var e=t.left;t.left=e.right,null!=e.right&&(e.right.parent=t),e.parent=t.parent,null==t.parent?this.root_=e:t.parent.right===t?t.parent.right=e:t.parent.left=e,e.right=t,t.parent=e}}},{key:"getFirstEntry",value:function(){var t=this.root_;if(null!=t)for(;null!=t.left;)t=t.left;return t}},{key:"size",value:function(){return this.size_}},{key:"containsKey",value:function(t){for(var e=this.root_;null!==e;){var n=t.compareTo(e.key);if(n<0)e=e.left;else{if(!(n>0))return!0;e=e.right}}return!1}}],[{key:"successor",value:function(t){var e;if(null===t)return null;if(null!==t.right){for(e=t.right;null!==e.left;)e=e.left;return e}e=t.parent;for(var n=t;null!==e&&n===e.right;)n=e,e=e.parent;return e}}])}(Ye),Ze=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"find",value:function(t){return this.nodeMap.get(t)}},{key:"addNode",value:function(){if(arguments[0]instanceof X){var t=arguments[0],e=this.nodeMap.get(t);return null===e&&(e=this.nodeFact.createNode(t),this.nodeMap.put(t,e)),e}if(arguments[0]instanceof qe){var n=arguments[0],i=this.nodeMap.get(n.getCoordinate());return null===i?(this.nodeMap.put(n.getCoordinate(),n),n):(i.mergeLabel(n),i)}}},{key:"print",value:function(t){for(var e=this.iterator();e.hasNext();){e.next().print(t)}}},{key:"iterator",value:function(){return this.nodeMap.values().iterator()}},{key:"values",value:function(){return this.nodeMap.values()}},{key:"getBoundaryNodes",value:function(t){for(var e=new yt,n=this.iterator();n.hasNext();){var i=n.next();i.getLabel().getLocation(t)===H.BOUNDARY&&e.add(i)}return e}},{key:"add",value:function(t){var e=t.getCoordinate();this.addNode(e).add(t)}}],[{key:"constructor_",value:function(){this.nodeMap=new He,this.nodeFact=null;var t=arguments[0];this.nodeFact=t}}])}(),je=function(){function t(){n(this,t)}return s(t,null,[{key:"isNorthern",value:function(e){return e===t.NE||e===t.NW}},{key:"isOpposite",value:function(t,e){return t!==e&&2===(t-e+4)%4}},{key:"commonHalfPlane",value:function(t,e){if(t===e)return t;if(2===(t-e+4)%4)return-1;var n=t<e?t:e;return 0===n&&3===(t>e?t:e)?3:n}},{key:"isInHalfPlane",value:function(e,n){return n===t.SE?e===t.SE||e===t.SW:e===n||e===n+1}},{key:"quadrant",value:function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var e=arguments[0],n=arguments[1];if(0===e&&0===n)throw new m("Cannot compute the quadrant for point ( "+e+", "+n+" )");return e>=0?n>=0?t.NE:t.SE:n>=0?t.NW:t.SW}if(arguments[0]instanceof X&&arguments[1]instanceof X){var i=arguments[0],r=arguments[1];if(r.x===i.x&&r.y===i.y)throw new m("Cannot compute the quadrant for two identical points "+i);return r.x>=i.x?r.y>=i.y?t.NE:t.SE:r.y>=i.y?t.NW:t.SW}}}])}();je.NE=0,je.NW=1,je.SW=2,je.SE=3;var We=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"compareDirection",value:function(t){return this._dx===t._dx&&this._dy===t._dy?0:this._quadrant>t._quadrant?1:this._quadrant<t._quadrant?-1:ct.index(t._p0,t._p1,this._p1)}},{key:"getDy",value:function(){return this._dy}},{key:"getCoordinate",value:function(){return this._p0}},{key:"setNode",value:function(t){this._node=t}},{key:"print",value:function(t){var e=Math.atan2(this._dy,this._dx),n=this.getClass().getName(),i=n.lastIndexOf("."),r=n.substring(i+1);t.print("  "+r+": "+this._p0+" - "+this._p1+" "+this._quadrant+":"+e+"   "+this._label)}},{key:"compareTo",value:function(t){var e=t;return this.compareDirection(e)}},{key:"getDirectedCoordinate",value:function(){return this._p1}},{key:"getDx",value:function(){return this._dx}},{key:"getLabel",value:function(){return this._label}},{key:"getEdge",value:function(){return this._edge}},{key:"getQuadrant",value:function(){return this._quadrant}},{key:"getNode",value:function(){return this._node}},{key:"toString",value:function(){var t=Math.atan2(this._dy,this._dx),e=this.getClass().getName(),n=e.lastIndexOf(".");return"  "+e.substring(n+1)+": "+this._p0+" - "+this._p1+" "+this._quadrant+":"+t+"   "+this._label}},{key:"computeLabel",value:function(t){}},{key:"init",value:function(t,e){this._p0=t,this._p1=e,this._dx=e.x-t.x,this._dy=e.y-t.y,this._quadrant=je.quadrant(this._dx,this._dy),G.isTrue(!(0===this._dx&&0===this._dy),"EdgeEnd with identical endpoints found")}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){if(this._edge=null,this._label=null,this._node=null,this._p0=null,this._p1=null,this._dx=null,this._dy=null,this._quadrant=null,1===arguments.length){var e=arguments[0];this._edge=e}else if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];t.constructor_.call(this,n,i,r,null)}else if(4===arguments.length){var s=arguments[0],a=arguments[1],o=arguments[2],u=arguments[3];t.constructor_.call(this,s),this.init(a,o),this._label=u}}}])}(),Ke=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getNextMin",value:function(){return this._nextMin}},{key:"getDepth",value:function(t){return this._depth[t]}},{key:"setVisited",value:function(t){this._isVisited=t}},{key:"computeDirectedLabel",value:function(){this._label=new Ae(this._edge.getLabel()),this._isForward||this._label.flip()}},{key:"getNext",value:function(){return this._next}},{key:"setDepth",value:function(t,e){if(-999!==this._depth[t]&&this._depth[t]!==e)throw new gt("assigned depths do not match",this.getCoordinate());this._depth[t]=e}},{key:"isInteriorAreaEdge",value:function(){for(var t=!0,e=0;e<2;e++)this._label.isArea(e)&&this._label.getLocation(e,$.LEFT)===H.INTERIOR&&this._label.getLocation(e,$.RIGHT)===H.INTERIOR||(t=!1);return t}},{key:"setNextMin",value:function(t){this._nextMin=t}},{key:"print",value:function(t){f(i,"print",this,1).call(this,t),t.print(" "+this._depth[$.LEFT]+"/"+this._depth[$.RIGHT]),t.print(" ("+this.getDepthDelta()+")"),this._isInResult&&t.print(" inResult")}},{key:"setMinEdgeRing",value:function(t){this._minEdgeRing=t}},{key:"isLineEdge",value:function(){var t=this._label.isLine(0)||this._label.isLine(1),e=!this._label.isArea(0)||this._label.allPositionsEqual(0,H.EXTERIOR),n=!this._label.isArea(1)||this._label.allPositionsEqual(1,H.EXTERIOR);return t&&e&&n}},{key:"setEdgeRing",value:function(t){this._edgeRing=t}},{key:"getMinEdgeRing",value:function(){return this._minEdgeRing}},{key:"getDepthDelta",value:function(){var t=this._edge.getDepthDelta();return this._isForward||(t=-t),t}},{key:"setInResult",value:function(t){this._isInResult=t}},{key:"getSym",value:function(){return this._sym}},{key:"isForward",value:function(){return this._isForward}},{key:"getEdge",value:function(){return this._edge}},{key:"printEdge",value:function(t){this.print(t),t.print(" "),this._isForward?this._edge.print(t):this._edge.printReverse(t)}},{key:"setSym",value:function(t){this._sym=t}},{key:"setVisitedEdge",value:function(t){this.setVisited(t),this._sym.setVisited(t)}},{key:"setEdgeDepths",value:function(t,e){var n=this.getEdge().getDepthDelta();this._isForward||(n=-n);var i=1;t===$.LEFT&&(i=-1);var r=$.opposite(t),s=e+n*i;this.setDepth(t,e),this.setDepth(r,s)}},{key:"getEdgeRing",value:function(){return this._edgeRing}},{key:"isInResult",value:function(){return this._isInResult}},{key:"setNext",value:function(t){this._next=t}},{key:"isVisited",value:function(){return this._isVisited}}],[{key:"constructor_",value:function(){this._isForward=null,this._isInResult=!1,this._isVisited=!1,this._sym=null,this._next=null,this._nextMin=null,this._edgeRing=null,this._minEdgeRing=null,this._depth=[0,-999,-999];var t=arguments[0],e=arguments[1];if(We.constructor_.call(this,t),this._isForward=e,e)this.init(t.getCoordinate(0),t.getCoordinate(1));else{var n=t.getNumPoints()-1;this.init(t.getCoordinate(n),t.getCoordinate(n-1))}this.computeDirectedLabel()}},{key:"depthFactor",value:function(t,e){return t===H.EXTERIOR&&e===H.INTERIOR?1:t===H.INTERIOR&&e===H.EXTERIOR?-1:0}}])}(We),Je=function(){return s((function t(){n(this,t)}),[{key:"createNode",value:function(t){return new qe(t,null)}}])}(),Qe=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"printEdges",value:function(t){t.println("Edges:");for(var e=0;e<this._edges.size();e++){t.println("edge "+e+":");var n=this._edges.get(e);n.print(t),n.eiList.print(t)}}},{key:"find",value:function(t){return this._nodes.find(t)}},{key:"addNode",value:function(){if(arguments[0]instanceof qe){var t=arguments[0];return this._nodes.addNode(t)}if(arguments[0]instanceof X){var e=arguments[0];return this._nodes.addNode(e)}}},{key:"getNodeIterator",value:function(){return this._nodes.iterator()}},{key:"linkResultDirectedEdges",value:function(){for(var t=this._nodes.iterator();t.hasNext();){t.next().getEdges().linkResultDirectedEdges()}}},{key:"debugPrintln",value:function(t){mt.out.println(t)}},{key:"isBoundaryNode",value:function(t,e){var n=this._nodes.find(e);if(null===n)return!1;var i=n.getLabel();return null!==i&&i.getLocation(t)===H.BOUNDARY}},{key:"linkAllDirectedEdges",value:function(){for(var t=this._nodes.iterator();t.hasNext();){t.next().getEdges().linkAllDirectedEdges()}}},{key:"matchInSameDirection",value:function(t,e,n,i){return!!t.equals(n)&&(ct.index(t,e,i)===ct.COLLINEAR&&je.quadrant(t,e)===je.quadrant(n,i))}},{key:"getEdgeEnds",value:function(){return this._edgeEndList}},{key:"debugPrint",value:function(t){mt.out.print(t)}},{key:"getEdgeIterator",value:function(){return this._edges.iterator()}},{key:"findEdgeInSameDirection",value:function(t,e){for(var n=0;n<this._edges.size();n++){var i=this._edges.get(n),r=i.getCoordinates();if(this.matchInSameDirection(t,e,r[0],r[1]))return i;if(this.matchInSameDirection(t,e,r[r.length-1],r[r.length-2]))return i}return null}},{key:"insertEdge",value:function(t){this._edges.add(t)}},{key:"findEdgeEnd",value:function(t){for(var e=this.getEdgeEnds().iterator();e.hasNext();){var n=e.next();if(n.getEdge()===t)return n}return null}},{key:"addEdges",value:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next();this._edges.add(n);var i=new Ke(n,!0),r=new Ke(n,!1);i.setSym(r),r.setSym(i),this.add(i),this.add(r)}}},{key:"add",value:function(t){this._nodes.add(t),this._edgeEndList.add(t)}},{key:"getNodes",value:function(){return this._nodes.values()}},{key:"findEdge",value:function(t,e){for(var n=0;n<this._edges.size();n++){var i=this._edges.get(n),r=i.getCoordinates();if(t.equals(r[0])&&e.equals(r[1]))return i}return null}}],[{key:"constructor_",value:function(){if(this._edges=new yt,this._nodes=null,this._edgeEndList=new yt,0===arguments.length)this._nodes=new Ze(new Je);else if(1===arguments.length){var t=arguments[0];this._nodes=new Ze(t)}}},{key:"linkResultDirectedEdges",value:function(t){for(var e=t.iterator();e.hasNext();){e.next().getEdges().linkResultDirectedEdges()}}}])}(),$e=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"sortShellsAndHoles",value:function(t,e,n){for(var i=t.iterator();i.hasNext();){var r=i.next();r.isHole()?n.add(r):e.add(r)}}},{key:"computePolygons",value:function(t){for(var e=new yt,n=t.iterator();n.hasNext();){var i=n.next().toPolygon(this._geometryFactory);e.add(i)}return e}},{key:"placeFreeHoles",value:function(e,n){for(var i=n.iterator();i.hasNext();){var r=i.next();if(null===r.getShell()){var s=t.findEdgeRingContaining(r,e);if(null===s)throw new gt("unable to assign hole to a shell",r.getCoordinate(0));r.setShell(s)}}}},{key:"buildMinimalEdgeRings",value:function(t,e,n){for(var i=new yt,r=t.iterator();r.hasNext();){var s=r.next();if(s.getMaxNodeDegree()>2){s.linkDirectedEdgesForMinimalEdgeRings();var a=s.buildMinimalRings(),o=this.findShell(a);null!==o?(this.placePolygonHoles(o,a),e.add(o)):n.addAll(a)}else i.add(s)}return i}},{key:"buildMaximalEdgeRings",value:function(t){for(var e=new yt,n=t.iterator();n.hasNext();){var i=n.next();if(i.isInResult()&&i.getLabel().isArea()&&null===i.getEdgeRing()){var r=new Fe(i,this._geometryFactory);e.add(r),r.setInResult()}}return e}},{key:"placePolygonHoles",value:function(t,e){for(var n=e.iterator();n.hasNext();){var i=n.next();i.isHole()&&i.setShell(t)}}},{key:"getPolygons",value:function(){return this.computePolygons(this._shellList)}},{key:"findShell",value:function(t){for(var e=0,n=null,i=t.iterator();i.hasNext();){var r=i.next();r.isHole()||(n=r,e++)}return G.isTrue(e<=1,"found two shells in MinimalEdgeRing list"),n}},{key:"add",value:function(){if(1===arguments.length){var t=arguments[0];this.add(t.getEdgeEnds(),t.getNodes())}else if(2===arguments.length){var e=arguments[0],n=arguments[1];Qe.linkResultDirectedEdges(n);var i=this.buildMaximalEdgeRings(e),r=new yt,s=this.buildMinimalEdgeRings(i,this._shellList,r);this.sortShellsAndHoles(s,this._shellList,r),this.placeFreeHoles(this._shellList,r)}}}],[{key:"constructor_",value:function(){this._geometryFactory=null,this._shellList=new yt;var t=arguments[0];this._geometryFactory=t}},{key:"findEdgeRingContaining",value:function(t,e){for(var n=t.getLinearRing(),i=n.getEnvelopeInternal(),r=n.getCoordinateN(0),s=null,a=null,o=e.iterator();o.hasNext();){var u=o.next(),l=u.getLinearRing(),h=l.getEnvelopeInternal();if(!h.equals(i)&&h.contains(i)){r=jt.ptNotInList(n.getCoordinates(),l.getCoordinates());var c=!1;be.isInRing(r,l.getCoordinates())&&(c=!0),c&&(null===s||a.contains(h))&&(a=(s=u).getLinearRing().getEnvelopeInternal())}}return s}}])}(),tn=function(){return s((function t(){n(this,t)}),[{key:"getBounds",value:function(){}}])}(),en=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getItem",value:function(){return this._item}},{key:"getBounds",value:function(){return this._bounds}},{key:"interfaces_",get:function(){return[tn,E]}}],[{key:"constructor_",value:function(){this._bounds=null,this._item=null;var t=arguments[0],e=arguments[1];this._bounds=t,this._item=e}}])}(),nn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"poll",value:function(){if(this.isEmpty())return null;var t=this._items.get(1);return this._items.set(1,this._items.get(this._size)),this._size-=1,this.reorder(1),t}},{key:"size",value:function(){return this._size}},{key:"reorder",value:function(t){for(var e=null,n=this._items.get(t);2*t<=this._size&&((e=2*t)!==this._size&&this._items.get(e+1).compareTo(this._items.get(e))<0&&e++,this._items.get(e).compareTo(n)<0);t=e)this._items.set(t,this._items.get(e));this._items.set(t,n)}},{key:"clear",value:function(){this._size=0,this._items.clear()}},{key:"peek",value:function(){return this.isEmpty()?null:this._items.get(1)}},{key:"isEmpty",value:function(){return 0===this._size}},{key:"add",value:function(t){this._items.add(null),this._size+=1;var e=this._size;for(this._items.set(0,t);t.compareTo(this._items.get(Math.trunc(e/2)))<0;e/=2)this._items.set(e,this._items.get(Math.trunc(e/2)));this._items.set(e,t)}}],[{key:"constructor_",value:function(){this._size=null,this._items=null,this._size=0,this._items=new yt,this._items.add(null)}}])}(),rn=function(){return s((function t(){n(this,t)}),[{key:"insert",value:function(t,e){}},{key:"remove",value:function(t,e){}},{key:"query",value:function(){}}])}(),sn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getLevel",value:function(){return this._level}},{key:"size",value:function(){return this._childBoundables.size()}},{key:"getChildBoundables",value:function(){return this._childBoundables}},{key:"addChildBoundable",value:function(t){G.isTrue(null===this._bounds),this._childBoundables.add(t)}},{key:"isEmpty",value:function(){return this._childBoundables.isEmpty()}},{key:"getBounds",value:function(){return null===this._bounds&&(this._bounds=this.computeBounds()),this._bounds}},{key:"interfaces_",get:function(){return[tn,E]}}],[{key:"constructor_",value:function(){if(this._childBoundables=new yt,this._bounds=null,this._level=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this._level=t}}}])}(),an={reverseOrder:function(){return{compare:function(t,e){return e.compareTo(t)}}},min:function(t){return an.sort(t),t.get(0)},sort:function(t,e){var n=t.toArray();e?At.sort(n,e):At.sort(n);for(var i=t.iterator(),r=0,s=n.length;r<s;r++)i.next(),i.set(n[r])},singletonList:function(t){var e=new yt;return e.add(t),e}},on=function(){function t(){n(this,t)}return s(t,null,[{key:"maxDistance",value:function(e,n,i,r,s,a,o,u){var l=t.distance(e,n,s,a);return l=Math.max(l,t.distance(e,n,o,u)),l=Math.max(l,t.distance(i,r,s,a)),l=Math.max(l,t.distance(i,r,o,u))}},{key:"distance",value:function(t,e,n,i){var r=n-t,s=i-e;return Math.sqrt(r*r+s*s)}},{key:"maximumDistance",value:function(e,n){var i=Math.min(e.getMinX(),n.getMinX()),r=Math.min(e.getMinY(),n.getMinY()),s=Math.max(e.getMaxX(),n.getMaxX()),a=Math.max(e.getMaxY(),n.getMaxY());return t.distance(i,r,s,a)}},{key:"minMaxDistance",value:function(e,n){var i=e.getMinX(),r=e.getMinY(),s=e.getMaxX(),a=e.getMaxY(),o=n.getMinX(),u=n.getMinY(),l=n.getMaxX(),h=n.getMaxY(),c=t.maxDistance(i,r,i,a,o,u,o,h);return c=Math.min(c,t.maxDistance(i,r,i,a,o,u,l,u)),c=Math.min(c,t.maxDistance(i,r,i,a,l,h,o,h)),c=Math.min(c,t.maxDistance(i,r,i,a,l,h,l,u)),c=Math.min(c,t.maxDistance(i,r,s,r,o,u,o,h)),c=Math.min(c,t.maxDistance(i,r,s,r,o,u,l,u)),c=Math.min(c,t.maxDistance(i,r,s,r,l,h,o,h)),c=Math.min(c,t.maxDistance(i,r,s,r,l,h,l,u)),c=Math.min(c,t.maxDistance(s,a,i,a,o,u,o,h)),c=Math.min(c,t.maxDistance(s,a,i,a,o,u,l,u)),c=Math.min(c,t.maxDistance(s,a,i,a,l,h,o,h)),c=Math.min(c,t.maxDistance(s,a,i,a,l,h,l,u)),c=Math.min(c,t.maxDistance(s,a,s,r,o,u,o,h)),c=Math.min(c,t.maxDistance(s,a,s,r,o,u,l,u)),c=Math.min(c,t.maxDistance(s,a,s,r,l,h,o,h)),c=Math.min(c,t.maxDistance(s,a,s,r,l,h,l,u))}}])}(),un=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"maximumDistance",value:function(){return on.maximumDistance(this._boundable1.getBounds(),this._boundable2.getBounds())}},{key:"expandToQueue",value:function(e,n){var i=t.isComposite(this._boundable1),r=t.isComposite(this._boundable2);if(i&&r)return t.area(this._boundable1)>t.area(this._boundable2)?(this.expand(this._boundable1,this._boundable2,!1,e,n),null):(this.expand(this._boundable2,this._boundable1,!0,e,n),null);if(i)return this.expand(this._boundable1,this._boundable2,!1,e,n),null;if(r)return this.expand(this._boundable2,this._boundable1,!0,e,n),null;throw new m("neither boundable is composite")}},{key:"isLeaves",value:function(){return!(t.isComposite(this._boundable1)||t.isComposite(this._boundable2))}},{key:"compareTo",value:function(t){var e=t;return this._distance<e._distance?-1:this._distance>e._distance?1:0}},{key:"expand",value:function(e,n,i,r,s){for(var a=e.getChildBoundables().iterator();a.hasNext();){var o=a.next(),u=null;(u=i?new t(n,o,this._itemDistance):new t(o,n,this._itemDistance)).getDistance()<s&&r.add(u)}}},{key:"getBoundable",value:function(t){return 0===t?this._boundable1:this._boundable2}},{key:"getDistance",value:function(){return this._distance}},{key:"distance",value:function(){return this.isLeaves()?this._itemDistance.distance(this._boundable1,this._boundable2):this._boundable1.getBounds().distance(this._boundable2.getBounds())}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this._boundable1=null,this._boundable2=null,this._distance=null,this._itemDistance=null;var t=arguments[0],e=arguments[1],n=arguments[2];this._boundable1=t,this._boundable2=e,this._itemDistance=n,this._distance=this.distance()}},{key:"area",value:function(t){return t.getBounds().getArea()}},{key:"isComposite",value:function(t){return t instanceof sn}}])}(),ln=function(){return s((function t(){n(this,t)}),[{key:"visitItem",value:function(t){}}])}(),hn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"queryInternal",value:function(){if(rt(arguments[2],ln)&&arguments[0]instanceof Object&&arguments[1]instanceof sn)for(var t=arguments[0],e=arguments[2],n=arguments[1].getChildBoundables(),i=0;i<n.size();i++){var r=n.get(i);this.getIntersectsOp().intersects(r.getBounds(),t)&&(r instanceof sn?this.queryInternal(t,r,e):r instanceof en?e.visitItem(r.getItem()):G.shouldNeverReachHere())}else if(rt(arguments[2],nt)&&arguments[0]instanceof Object&&arguments[1]instanceof sn)for(var s=arguments[0],a=arguments[2],o=arguments[1].getChildBoundables(),u=0;u<o.size();u++){var l=o.get(u);this.getIntersectsOp().intersects(l.getBounds(),s)&&(l instanceof sn?this.queryInternal(s,l,a):l instanceof en?a.add(l.getItem()):G.shouldNeverReachHere())}}},{key:"getNodeCapacity",value:function(){return this._nodeCapacity}},{key:"lastNode",value:function(t){return t.get(t.size()-1)}},{key:"size",value:function(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.size(this._root));if(1===arguments.length){for(var t=0,e=arguments[0].getChildBoundables().iterator();e.hasNext();){var n=e.next();n instanceof sn?t+=this.size(n):n instanceof en&&(t+=1)}return t}}},{key:"removeItem",value:function(t,e){for(var n=null,i=t.getChildBoundables().iterator();i.hasNext();){var r=i.next();r instanceof en&&r.getItem()===e&&(n=r)}return null!==n&&(t.getChildBoundables().remove(n),!0)}},{key:"itemsTree",value:function(){if(0===arguments.length){this.build();var t=this.itemsTree(this._root);return null===t?new yt:t}if(1===arguments.length){for(var e=arguments[0],n=new yt,i=e.getChildBoundables().iterator();i.hasNext();){var r=i.next();if(r instanceof sn){var s=this.itemsTree(r);null!==s&&n.add(s)}else r instanceof en?n.add(r.getItem()):G.shouldNeverReachHere()}return n.size()<=0?null:n}}},{key:"insert",value:function(t,e){G.isTrue(!this._built,"Cannot insert items into an STR packed R-tree after it has been built."),this._itemBoundables.add(new en(t,e))}},{key:"boundablesAtLevel",value:function(){if(1===arguments.length){var t=arguments[0],e=new yt;return this.boundablesAtLevel(t,this._root,e),e}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2];if(G.isTrue(n>-2),i.getLevel()===n)return r.add(i),null;for(var s=i.getChildBoundables().iterator();s.hasNext();){var a=s.next();a instanceof sn?this.boundablesAtLevel(n,a,r):(G.isTrue(a instanceof en),-1===n&&r.add(a))}return null}}},{key:"query",value:function(){if(1===arguments.length){var t=arguments[0];this.build();var e=new yt;return this.isEmpty()||this.getIntersectsOp().intersects(this._root.getBounds(),t)&&this.queryInternal(t,this._root,e),e}if(2===arguments.length){var n=arguments[0],i=arguments[1];if(this.build(),this.isEmpty())return null;this.getIntersectsOp().intersects(this._root.getBounds(),n)&&this.queryInternal(n,this._root,i)}}},{key:"build",value:function(){if(this._built)return null;this._root=this._itemBoundables.isEmpty()?this.createNode(0):this.createHigherLevels(this._itemBoundables,-1),this._itemBoundables=null,this._built=!0}},{key:"getRoot",value:function(){return this.build(),this._root}},{key:"remove",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.build(),!!this.getIntersectsOp().intersects(this._root.getBounds(),t)&&this.remove(t,this._root,e)}if(3===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=this.removeItem(i,r);if(s)return!0;for(var a=null,o=i.getChildBoundables().iterator();o.hasNext();){var u=o.next();if(this.getIntersectsOp().intersects(u.getBounds(),n)&&(u instanceof sn&&(s=this.remove(n,u,r)))){a=u;break}}return null!==a&&a.getChildBoundables().isEmpty()&&i.getChildBoundables().remove(a),s}}},{key:"createHigherLevels",value:function(t,e){G.isTrue(!t.isEmpty());var n=this.createParentBoundables(t,e+1);return 1===n.size()?n.get(0):this.createHigherLevels(n,e+1)}},{key:"depth",value:function(){if(0===arguments.length)return this.isEmpty()?0:(this.build(),this.depth(this._root));if(1===arguments.length){for(var t=0,e=arguments[0].getChildBoundables().iterator();e.hasNext();){var n=e.next();if(n instanceof sn){var i=this.depth(n);i>t&&(t=i)}}return t+1}}},{key:"createParentBoundables",value:function(t,e){G.isTrue(!t.isEmpty());var n=new yt;n.add(this.createNode(e));var i=new yt(t);an.sort(i,this.getComparator());for(var r=i.iterator();r.hasNext();){var s=r.next();this.lastNode(n).getChildBoundables().size()===this.getNodeCapacity()&&n.add(this.createNode(e)),this.lastNode(n).addChildBoundable(s)}return n}},{key:"isEmpty",value:function(){return this._built?this._root.isEmpty():this._itemBoundables.isEmpty()}},{key:"interfaces_",get:function(){return[E]}}],[{key:"constructor_",value:function(){if(this._root=null,this._built=!1,this._itemBoundables=new yt,this._nodeCapacity=null,0===arguments.length)t.constructor_.call(this,t.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var e=arguments[0];G.isTrue(e>1,"Node capacity must be greater than 1"),this._nodeCapacity=e}}},{key:"compareDoubles",value:function(t,e){return t>e?1:t<e?-1:0}}])}();hn.IntersectsOp=function(){},hn.DEFAULT_NODE_CAPACITY=10;var cn=function(){return s((function t(){n(this,t)}),[{key:"distance",value:function(t,e){}}])}(),fn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"createParentBoundablesFromVerticalSlices",value:function(t,e){G.isTrue(t.length>0);for(var n=new yt,i=0;i<t.length;i++)n.addAll(this.createParentBoundablesFromVerticalSlice(t[i],e));return n}},{key:"nearestNeighbourK",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];return this.nearestNeighbourK(t,A.POSITIVE_INFINITY,e)}if(3===arguments.length){var n=arguments[0],r=arguments[2],s=arguments[1],a=new nn;a.add(n);for(var o=new nn;!a.isEmpty()&&s>=0;){var u=a.poll(),l=u.getDistance();if(l>=s)break;if(u.isLeaves())if(o.size()<r)o.add(u);else o.peek().getDistance()>l&&(o.poll(),o.add(u)),s=o.peek().getDistance();else u.expandToQueue(a,s)}return i.getItems(o)}}},{key:"createNode",value:function(t){return new gn(t)}},{key:"size",value:function(){return 0===arguments.length?f(i,"size",this,1).call(this):f(i,"size",this,1).apply(this,arguments)}},{key:"insert",value:function(){if(!(2===arguments.length&&arguments[1]instanceof Object&&arguments[0]instanceof U))return f(i,"insert",this,1).apply(this,arguments);var t=arguments[0],e=arguments[1];if(t.isNull())return null;f(i,"insert",this,1).call(this,t,e)}},{key:"getIntersectsOp",value:function(){return i.intersectsOp}},{key:"verticalSlices",value:function(t,e){for(var n=Math.trunc(Math.ceil(t.size()/e)),i=new Array(e).fill(null),r=t.iterator(),s=0;s<e;s++){i[s]=new yt;for(var a=0;r.hasNext()&&a<n;){var o=r.next();i[s].add(o),a++}}return i}},{key:"query",value:function(){if(1===arguments.length){var t=arguments[0];return f(i,"query",this,1).call(this,t)}if(2===arguments.length){var e=arguments[0],n=arguments[1];f(i,"query",this,1).call(this,e,n)}}},{key:"getComparator",value:function(){return i.yComparator}},{key:"createParentBoundablesFromVerticalSlice",value:function(t,e){return f(i,"createParentBoundables",this,1).call(this,t,e)}},{key:"remove",value:function(){if(2===arguments.length&&arguments[1]instanceof Object&&arguments[0]instanceof U){var t=arguments[0],e=arguments[1];return f(i,"remove",this,1).call(this,t,e)}return f(i,"remove",this,1).apply(this,arguments)}},{key:"depth",value:function(){return 0===arguments.length?f(i,"depth",this,1).call(this):f(i,"depth",this,1).apply(this,arguments)}},{key:"createParentBoundables",value:function(t,e){G.isTrue(!t.isEmpty());var n=Math.trunc(Math.ceil(t.size()/this.getNodeCapacity())),r=new yt(t);an.sort(r,i.xComparator);var s=this.verticalSlices(r,Math.trunc(Math.ceil(Math.sqrt(n))));return this.createParentBoundablesFromVerticalSlices(s,e)}},{key:"nearestNeighbour",value:function(){if(1===arguments.length){if(rt(arguments[0],cn)){var t=arguments[0];if(this.isEmpty())return null;var e=new un(this.getRoot(),this.getRoot(),t);return this.nearestNeighbour(e)}if(arguments[0]instanceof un){var n=arguments[0],i=A.POSITIVE_INFINITY,r=null,s=new nn;for(s.add(n);!s.isEmpty()&&i>0;){var a=s.poll(),o=a.getDistance();if(o>=i)break;a.isLeaves()?(i=o,r=a):a.expandToQueue(s,i)}return null===r?null:[r.getBoundable(0).getItem(),r.getBoundable(1).getItem()]}}else{if(2===arguments.length){var u=arguments[0],l=arguments[1];if(this.isEmpty()||u.isEmpty())return null;var h=new un(this.getRoot(),u.getRoot(),l);return this.nearestNeighbour(h)}if(3===arguments.length){var c=arguments[2],f=new en(arguments[0],arguments[1]),g=new un(this.getRoot(),f,c);return this.nearestNeighbour(g)[0]}if(4===arguments.length){var v=arguments[2],y=arguments[3],d=new en(arguments[0],arguments[1]),_=new un(this.getRoot(),d,v);return this.nearestNeighbourK(_,y)}}}},{key:"isWithinDistance",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1],n=A.POSITIVE_INFINITY,i=new nn;for(i.add(t);!i.isEmpty();){var r=i.poll(),s=r.getDistance();if(s>e)return!1;if(r.maximumDistance()<=e)return!0;if(r.isLeaves()){if((n=s)<=e)return!0}else r.expandToQueue(i,n)}return!1}if(3===arguments.length){var a=arguments[0],o=arguments[1],u=arguments[2],l=new un(this.getRoot(),a.getRoot(),o);return this.isWithinDistance(l,u)}}},{key:"interfaces_",get:function(){return[rn,E]}}],[{key:"constructor_",value:function(){if(0===arguments.length)i.constructor_.call(this,i.DEFAULT_NODE_CAPACITY);else if(1===arguments.length){var t=arguments[0];hn.constructor_.call(this,t)}}},{key:"centreX",value:function(t){return i.avg(t.getMinX(),t.getMaxX())}},{key:"avg",value:function(t,e){return(t+e)/2}},{key:"getItems",value:function(t){for(var e=new Array(t.size()).fill(null),n=0;!t.isEmpty();){var i=t.poll();e[n]=i.getBoundable(0).getItem(),n++}return e}},{key:"centreY",value:function(t){return i.avg(t.getMinY(),t.getMaxY())}}])}(hn),gn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"computeBounds",value:function(){for(var t=null,e=this.getChildBoundables().iterator();e.hasNext();){var n=e.next();null===t?t=new U(n.getBounds()):t.expandToInclude(n.getBounds())}return t}}],[{key:"constructor_",value:function(){var t=arguments[0];sn.constructor_.call(this,t)}}])}(sn);fn.STRtreeNode=gn,fn.xComparator=new(function(){return s((function t(){n(this,t)}),[{key:"interfaces_",get:function(){return[P]}},{key:"compare",value:function(t,e){return hn.compareDoubles(fn.centreX(t.getBounds()),fn.centreX(e.getBounds()))}}])}()),fn.yComparator=new(function(){return s((function t(){n(this,t)}),[{key:"interfaces_",get:function(){return[P]}},{key:"compare",value:function(t,e){return hn.compareDoubles(fn.centreY(t.getBounds()),fn.centreY(e.getBounds()))}}])}()),fn.intersectsOp=new(function(){return s((function t(){n(this,t)}),[{key:"interfaces_",get:function(){return[IntersectsOp]}},{key:"intersects",value:function(t,e){return t.intersects(e)}}])}()),fn.DEFAULT_NODE_CAPACITY=10;var vn=function(){function t(){n(this,t)}return s(t,null,[{key:"relativeSign",value:function(t,e){return t<e?-1:t>e?1:0}},{key:"compare",value:function(e,n,i){if(n.equals2D(i))return 0;var r=t.relativeSign(n.x,i.x),s=t.relativeSign(n.y,i.y);switch(e){case 0:return t.compareValue(r,s);case 1:return t.compareValue(s,r);case 2:return t.compareValue(s,-r);case 3:return t.compareValue(-r,s);case 4:return t.compareValue(-r,-s);case 5:return t.compareValue(-s,-r);case 6:return t.compareValue(-s,r);case 7:return t.compareValue(r,-s)}return G.shouldNeverReachHere("invalid octant value"),0}},{key:"compareValue",value:function(t,e){return t<0?-1:t>0?1:e<0?-1:e>0?1:0}}])}(),yn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getCoordinate",value:function(){return this.coord}},{key:"print",value:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex)}},{key:"compareTo",value:function(t){var e=t;return this.segmentIndex<e.segmentIndex?-1:this.segmentIndex>e.segmentIndex?1:this.coord.equals2D(e.coord)?0:this._isInterior?e._isInterior?vn.compare(this._segmentOctant,this.coord,e.coord):1:-1}},{key:"isEndPoint",value:function(t){return 0===this.segmentIndex&&!this._isInterior||this.segmentIndex===t}},{key:"toString",value:function(){return this.segmentIndex+":"+this.coord.toString()}},{key:"isInterior",value:function(){return this._isInterior}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this._segString=null,this.coord=null,this.segmentIndex=null,this._segmentOctant=null,this._isInterior=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this._segString=t,this.coord=new X(e),this.segmentIndex=n,this._segmentOctant=i,this._isInterior=!e.equals2D(t.getCoordinate(n))}}])}(),dn=function(){return s((function t(){n(this,t)}),[{key:"hasNext",value:function(){}},{key:"next",value:function(){}},{key:"remove",value:function(){}}])}(),_n=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getSplitCoordinates",value:function(){var t=new Zt;this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next();this.addEdgeCoordinates(n,i,t),n=i}return t.toCoordinateArray()}},{key:"addCollapsedNodes",value:function(){var t=new yt;this.findCollapsesFromInsertedNodes(t),this.findCollapsesFromExistingVertices(t);for(var e=t.iterator();e.hasNext();){var n=e.next().intValue();this.add(this._edge.getCoordinate(n),n)}}},{key:"createSplitEdgePts",value:function(t,e){var n=e.segmentIndex-t.segmentIndex+2;if(2===n)return[new X(t.coord),new X(e.coord)];var i=this._edge.getCoordinate(e.segmentIndex),r=e.isInterior()||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),a=0;s[a++]=new X(t.coord);for(var o=t.segmentIndex+1;o<=e.segmentIndex;o++)s[a++]=this._edge.getCoordinate(o);return r&&(s[a]=new X(e.coord)),s}},{key:"print",value:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){e.next().print(t)}}},{key:"findCollapsesFromExistingVertices",value:function(t){for(var e=0;e<this._edge.size()-2;e++){var n=this._edge.getCoordinate(e);this._edge.getCoordinate(e+1);var i=this._edge.getCoordinate(e+2);n.equals2D(i)&&t.add(at.valueOf(e+1))}}},{key:"addEdgeCoordinates",value:function(t,e,n){var i=this.createSplitEdgePts(t,e);n.add(i,!1)}},{key:"iterator",value:function(){return this._nodeMap.values().iterator()}},{key:"addSplitEdges",value:function(t){this.addEndpoints(),this.addCollapsedNodes();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}}},{key:"findCollapseIndex",value:function(t,e,n){if(!t.coord.equals2D(e.coord))return!1;var i=e.segmentIndex-t.segmentIndex;return e.isInterior()||i--,1===i&&(n[0]=t.segmentIndex+1,!0)}},{key:"findCollapsesFromInsertedNodes",value:function(t){for(var e=new Array(1).fill(null),n=this.iterator(),i=n.next();n.hasNext();){var r=n.next();this.findCollapseIndex(i,r,e)&&t.add(at.valueOf(e[0])),i=r}}},{key:"getEdge",value:function(){return this._edge}},{key:"addEndpoints",value:function(){var t=this._edge.size()-1;this.add(this._edge.getCoordinate(0),0),this.add(this._edge.getCoordinate(t),t)}},{key:"createSplitEdge",value:function(t,e){var n=this.createSplitEdgePts(t,e);return new xn(n,this._edge.getData())}},{key:"add",value:function(t,e){var n=new yn(this._edge,t,e,this._edge.getSegmentOctant(e)),i=this._nodeMap.get(n);return null!==i?(G.isTrue(i.coord.equals2D(t),"Found equal nodes with different coordinates"),i):(this._nodeMap.put(n,n),n)}},{key:"checkSplitEdgesCorrectness",value:function(t){var e=this._edge.getCoordinates(),n=t.get(0).getCoordinate(0);if(!n.equals2D(e[0]))throw new D("bad split edge start point at "+n);var i=t.get(t.size()-1).getCoordinates(),r=i[i.length-1];if(!r.equals2D(e[e.length-1]))throw new D("bad split edge end point at "+r)}}],[{key:"constructor_",value:function(){this._nodeMap=new He,this._edge=null;var t=arguments[0];this._edge=t}}])}(),pn=function(){function t(){n(this,t)}return s(t,null,[{key:"octant",value:function(){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var e=arguments[0],n=arguments[1];if(0===e&&0===n)throw new m("Cannot compute the octant for point ( "+e+", "+n+" )");var i=Math.abs(e),r=Math.abs(n);return e>=0?n>=0?i>=r?0:1:i>=r?7:6:n>=0?i>=r?3:2:i>=r?4:5}if(arguments[0]instanceof X&&arguments[1]instanceof X){var s=arguments[0],a=arguments[1],o=a.x-s.x,u=a.y-s.y;if(0===o&&0===u)throw new m("Cannot compute the octant for two identical points "+s);return t.octant(o,u)}}}])}(),mn=function(){return s((function t(){n(this,t)}),[{key:"getCoordinates",value:function(){}},{key:"size",value:function(){}},{key:"getCoordinate",value:function(t){}},{key:"isClosed",value:function(){}},{key:"setData",value:function(t){}},{key:"getData",value:function(){}}])}(),kn=function(){return s((function t(){n(this,t)}),[{key:"addIntersection",value:function(t,e){}},{key:"interfaces_",get:function(){return[mn]}}])}(),xn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getCoordinates",value:function(){return this._pts}},{key:"size",value:function(){return this._pts.length}},{key:"getCoordinate",value:function(t){return this._pts[t]}},{key:"isClosed",value:function(){return this._pts[0].equals(this._pts[this._pts.length-1])}},{key:"getSegmentOctant",value:function(t){return t===this._pts.length-1?-1:this.safeOctant(this.getCoordinate(t),this.getCoordinate(t+1))}},{key:"setData",value:function(t){this._data=t}},{key:"safeOctant",value:function(t,e){return t.equals2D(e)?0:pn.octant(t,e)}},{key:"getData",value:function(){return this._data}},{key:"addIntersection",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.addIntersectionNode(t,e)}else if(4===arguments.length){var n=arguments[1],i=arguments[3],r=new X(arguments[0].getIntersection(i));this.addIntersection(r,n)}}},{key:"toString",value:function(){return Ce.toLineString(new Qt(this._pts))}},{key:"getNodeList",value:function(){return this._nodeList}},{key:"addIntersectionNode",value:function(t,e){var n=e,i=n+1;if(i<this._pts.length){var r=this._pts[i];t.equals2D(r)&&(n=i)}return this._nodeList.add(t,n)}},{key:"addIntersections",value:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)}},{key:"interfaces_",get:function(){return[kn]}}],[{key:"constructor_",value:function(){this._nodeList=new _n(this),this._pts=null,this._data=null;var t=arguments[0],e=arguments[1];this._pts=t,this._data=e}},{key:"getNodedSubstrings",value:function(){if(1===arguments.length){var e=arguments[0],n=new yt;return t.getNodedSubstrings(e,n),n}if(2===arguments.length)for(var i=arguments[1],r=arguments[0].iterator();r.hasNext();){r.next().getNodeList().addSplitEdges(i)}}}])}(),In=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"minX",value:function(){return Math.min(this.p0.x,this.p1.x)}},{key:"orientationIndex",value:function(){if(arguments[0]instanceof t){var e=arguments[0],n=ct.index(this.p0,this.p1,e.p0),i=ct.index(this.p0,this.p1,e.p1);return n>=0&&i>=0||n<=0&&i<=0?Math.max(n,i):0}if(arguments[0]instanceof X){var r=arguments[0];return ct.index(this.p0,this.p1,r)}}},{key:"toGeometry",value:function(t){return t.createLineString([this.p0,this.p1])}},{key:"isVertical",value:function(){return this.p0.x===this.p1.x}},{key:"equals",value:function(e){if(!(e instanceof t))return!1;var n=e;return this.p0.equals(n.p0)&&this.p1.equals(n.p1)}},{key:"intersection",value:function(t){var e=new we;return e.computeIntersection(this.p0,this.p1,t.p0,t.p1),e.hasIntersection()?e.getIntersection(0):null}},{key:"project",value:function(){if(arguments[0]instanceof X){var e=arguments[0];if(e.equals(this.p0)||e.equals(this.p1))return new X(e);var n=this.projectionFactor(e),i=new X;return i.x=this.p0.x+n*(this.p1.x-this.p0.x),i.y=this.p0.y+n*(this.p1.y-this.p0.y),i}if(arguments[0]instanceof t){var r=arguments[0],s=this.projectionFactor(r.p0),a=this.projectionFactor(r.p1);if(s>=1&&a>=1)return null;if(s<=0&&a<=0)return null;var o=this.project(r.p0);s<0&&(o=this.p0),s>1&&(o=this.p1);var u=this.project(r.p1);return a<0&&(u=this.p0),a>1&&(u=this.p1),new t(o,u)}}},{key:"normalize",value:function(){this.p1.compareTo(this.p0)<0&&this.reverse()}},{key:"angle",value:function(){return Math.atan2(this.p1.y-this.p0.y,this.p1.x-this.p0.x)}},{key:"getCoordinate",value:function(t){return 0===t?this.p0:this.p1}},{key:"distancePerpendicular",value:function(t){return xt.pointToLinePerpendicular(t,this.p0,this.p1)}},{key:"minY",value:function(){return Math.min(this.p0.y,this.p1.y)}},{key:"midPoint",value:function(){return t.midPoint(this.p0,this.p1)}},{key:"projectionFactor",value:function(t){if(t.equals(this.p0))return 0;if(t.equals(this.p1))return 1;var e=this.p1.x-this.p0.x,n=this.p1.y-this.p0.y,i=e*e+n*n;return i<=0?A.NaN:((t.x-this.p0.x)*e+(t.y-this.p0.y)*n)/i}},{key:"closestPoints",value:function(t){var e=this.intersection(t);if(null!==e)return[e,e];var n=new Array(2).fill(null),i=A.MAX_VALUE,r=null,s=this.closestPoint(t.p0);i=s.distance(t.p0),n[0]=s,n[1]=t.p0;var a=this.closestPoint(t.p1);(r=a.distance(t.p1))<i&&(i=r,n[0]=a,n[1]=t.p1);var o=t.closestPoint(this.p0);(r=o.distance(this.p0))<i&&(i=r,n[0]=this.p0,n[1]=o);var u=t.closestPoint(this.p1);return(r=u.distance(this.p1))<i&&(i=r,n[0]=this.p1,n[1]=u),n}},{key:"closestPoint",value:function(t){var e=this.projectionFactor(t);return e>0&&e<1?this.project(t):this.p0.distance(t)<this.p1.distance(t)?this.p0:this.p1}},{key:"maxX",value:function(){return Math.max(this.p0.x,this.p1.x)}},{key:"getLength",value:function(){return this.p0.distance(this.p1)}},{key:"compareTo",value:function(t){var e=t,n=this.p0.compareTo(e.p0);return 0!==n?n:this.p1.compareTo(e.p1)}},{key:"reverse",value:function(){var t=this.p0;this.p0=this.p1,this.p1=t}},{key:"equalsTopo",value:function(t){return this.p0.equals(t.p0)&&this.p1.equals(t.p1)||this.p0.equals(t.p1)&&this.p1.equals(t.p0)}},{key:"lineIntersection",value:function(t){return pt.intersection(this.p0,this.p1,t.p0,t.p1)}},{key:"maxY",value:function(){return Math.max(this.p0.y,this.p1.y)}},{key:"pointAlongOffset",value:function(t,e){var n=this.p0.x+t*(this.p1.x-this.p0.x),i=this.p0.y+t*(this.p1.y-this.p0.y),r=this.p1.x-this.p0.x,s=this.p1.y-this.p0.y,a=Math.sqrt(r*r+s*s),o=0,u=0;if(0!==e){if(a<=0)throw new IllegalStateException("Cannot compute offset from zero-length line segment");o=e*r/a,u=e*s/a}return new X(n-u,i+o)}},{key:"setCoordinates",value:function(){if(1===arguments.length){var t=arguments[0];this.setCoordinates(t.p0,t.p1)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.p0.x=e.x,this.p0.y=e.y,this.p1.x=n.x,this.p1.y=n.y}}},{key:"segmentFraction",value:function(t){var e=this.projectionFactor(t);return e<0?e=0:(e>1||A.isNaN(e))&&(e=1),e}},{key:"toString",value:function(){return"LINESTRING( "+this.p0.x+" "+this.p0.y+", "+this.p1.x+" "+this.p1.y+")"}},{key:"isHorizontal",value:function(){return this.p0.y===this.p1.y}},{key:"reflect",value:function(t){var e=this.p1.getY()-this.p0.getY(),n=this.p0.getX()-this.p1.getX(),i=this.p0.getY()*(this.p1.getX()-this.p0.getX())-this.p0.getX()*(this.p1.getY()-this.p0.getY()),r=e*e+n*n,s=e*e-n*n,a=t.getX(),o=t.getY();return new X((-s*a-2*e*n*o-2*e*i)/r,(s*o-2*e*n*a-2*n*i)/r)}},{key:"distance",value:function(){if(arguments[0]instanceof t){var e=arguments[0];return xt.segmentToSegment(this.p0,this.p1,e.p0,e.p1)}if(arguments[0]instanceof X){var n=arguments[0];return xt.pointToSegment(n,this.p0,this.p1)}}},{key:"pointAlong",value:function(t){var e=new X;return e.x=this.p0.x+t*(this.p1.x-this.p0.x),e.y=this.p0.y+t*(this.p1.y-this.p0.y),e}},{key:"hashCode",value:function(){var t=A.doubleToLongBits(this.p0.x);t^=31*A.doubleToLongBits(this.p0.y);var e=Math.trunc(t)^Math.trunc(t>>32),n=A.doubleToLongBits(this.p1.x);return n^=31*A.doubleToLongBits(this.p1.y),e^(Math.trunc(n)^Math.trunc(n>>32))}},{key:"interfaces_",get:function(){return[x,E]}}],[{key:"constructor_",value:function(){if(this.p0=null,this.p1=null,0===arguments.length)t.constructor_.call(this,new X,new X);else if(1===arguments.length){var e=arguments[0];t.constructor_.call(this,e.p0,e.p1)}else if(2===arguments.length){var n=arguments[0],i=arguments[1];this.p0=n,this.p1=i}else if(4===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2],o=arguments[3];t.constructor_.call(this,new X(r,s),new X(a,o))}}},{key:"midPoint",value:function(t,e){return new X((t.x+e.x)/2,(t.y+e.y)/2)}}])}(),En=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"overlap",value:function(){if(2===arguments.length);else if(4===arguments.length){var t=arguments[1],e=arguments[2],n=arguments[3];arguments[0].getLineSegment(t,this._overlapSeg1),e.getLineSegment(n,this._overlapSeg2),this.overlap(this._overlapSeg1,this._overlapSeg2)}}}],[{key:"constructor_",value:function(){this._overlapSeg1=new In,this._overlapSeg2=new In}}])}(),Nn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getLineSegment",value:function(t,e){e.p0=this._pts[t],e.p1=this._pts[t+1]}},{key:"computeSelect",value:function(t,e,n,i){var r=this._pts[e],s=this._pts[n];if(n-e==1)return i.select(this,e),null;if(!t.intersects(r,s))return null;var a=Math.trunc((e+n)/2);e<a&&this.computeSelect(t,e,a,i),a<n&&this.computeSelect(t,a,n,i)}},{key:"getCoordinates",value:function(){for(var t=new Array(this._end-this._start+1).fill(null),e=0,n=this._start;n<=this._end;n++)t[e++]=this._pts[n];return t}},{key:"computeOverlaps",value:function(){if(2===arguments.length){var t=arguments[0],e=arguments[1];this.computeOverlaps(this._start,this._end,t,t._start,t._end,e)}else if(6===arguments.length){var n=arguments[0],i=arguments[1],r=arguments[2],s=arguments[3],a=arguments[4],o=arguments[5];if(i-n==1&&a-s==1)return o.overlap(this,n,r,s),null;if(!this.overlaps(n,i,r,s,a))return null;var u=Math.trunc((n+i)/2),l=Math.trunc((s+a)/2);n<u&&(s<l&&this.computeOverlaps(n,u,r,s,l,o),l<a&&this.computeOverlaps(n,u,r,l,a,o)),u<i&&(s<l&&this.computeOverlaps(u,i,r,s,l,o),l<a&&this.computeOverlaps(u,i,r,l,a,o))}}},{key:"setId",value:function(t){this._id=t}},{key:"select",value:function(t,e){this.computeSelect(t,this._start,this._end,e)}},{key:"getEnvelope",value:function(){if(null===this._env){var t=this._pts[this._start],e=this._pts[this._end];this._env=new U(t,e)}return this._env}},{key:"overlaps",value:function(t,e,n,i,r){return U.intersects(this._pts[t],this._pts[e],n._pts[i],n._pts[r])}},{key:"getEndIndex",value:function(){return this._end}},{key:"getStartIndex",value:function(){return this._start}},{key:"getContext",value:function(){return this._context}},{key:"getId",value:function(){return this._id}}],[{key:"constructor_",value:function(){this._pts=null,this._start=null,this._end=null,this._env=null,this._context=null,this._id=null;var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this._pts=t,this._start=e,this._end=n,this._context=i}}])}(),Tn=function(){function t(){n(this,t)}return s(t,null,[{key:"findChainEnd",value:function(t,e){for(var n=e;n<t.length-1&&t[n].equals2D(t[n+1]);)n++;if(n>=t.length-1)return t.length-1;for(var i=je.quadrant(t[n],t[n+1]),r=e+1;r<t.length;){if(!t[r-1].equals2D(t[r]))if(je.quadrant(t[r-1],t[r])!==i)break;r++}return r-1}},{key:"getChains",value:function(){if(1===arguments.length){var e=arguments[0];return t.getChains(e,null)}if(2===arguments.length){var n=arguments[0],i=arguments[1],r=new yt,s=0;do{var a=t.findChainEnd(n,s),o=new Nn(n,s,a,i);r.add(o),s=a}while(s<n.length-1);return r}}}])}(),Sn=function(){return s((function t(){n(this,t)}),[{key:"computeNodes",value:function(t){}},{key:"getNodedSubstrings",value:function(){}}])}(),Ln=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"setSegmentIntersector",value:function(t){this._segInt=t}},{key:"interfaces_",get:function(){return[Sn]}}],[{key:"constructor_",value:function(){if(this._segInt=null,0===arguments.length);else if(1===arguments.length){var t=arguments[0];this.setSegmentIntersector(t)}}}])}(),Cn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getMonotoneChains",value:function(){return this._monoChains}},{key:"getNodedSubstrings",value:function(){return xn.getNodedSubstrings(this._nodedSegStrings)}},{key:"getIndex",value:function(){return this._index}},{key:"add",value:function(t){for(var e=Tn.getChains(t.getCoordinates(),t).iterator();e.hasNext();){var n=e.next();n.setId(this._idCounter++),this._index.insert(n.getEnvelope(),n),this._monoChains.add(n)}}},{key:"computeNodes",value:function(t){this._nodedSegStrings=t;for(var e=t.iterator();e.hasNext();)this.add(e.next());this.intersectChains()}},{key:"intersectChains",value:function(){for(var t=new Rn(this._segInt),e=this._monoChains.iterator();e.hasNext();)for(var n=e.next(),i=this._index.query(n.getEnvelope()).iterator();i.hasNext();){var r=i.next();if(r.getId()>n.getId()&&(n.computeOverlaps(r,t),this._nOverlaps++),this._segInt.isDone())return null}}}],[{key:"constructor_",value:function(){if(this._monoChains=new yt,this._index=new fn,this._idCounter=0,this._nodedSegStrings=null,this._nOverlaps=0,0===arguments.length);else if(1===arguments.length){var t=arguments[0];Ln.constructor_.call(this,t)}}}])}(Ln),Rn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"overlap",value:function(){if(4!==arguments.length)return f(i,"overlap",this,1).apply(this,arguments);var t=arguments[1],e=arguments[2],n=arguments[3],r=arguments[0].getContext(),s=e.getContext();this._si.processIntersections(r,t,s,n)}}],[{key:"constructor_",value:function(){this._si=null;var t=arguments[0];this._si=t}}])}(En);Cn.SegmentOverlapAction=Rn;var wn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"isDeletable",value:function(t,e,n,i){var r=this._inputLine[t],s=this._inputLine[e],a=this._inputLine[n];return!!this.isConcave(r,s,a)&&(!!this.isShallow(r,s,a,i)&&this.isShallowSampled(r,s,t,n,i))}},{key:"deleteShallowConcavities",value:function(){for(var e=1,n=this.findNextNonDeletedIndex(e),i=this.findNextNonDeletedIndex(n),r=!1;i<this._inputLine.length;){var s=!1;this.isDeletable(e,n,i,this._distanceTol)&&(this._isDeleted[n]=t.DELETE,s=!0,r=!0),e=s?i:n,n=this.findNextNonDeletedIndex(e),i=this.findNextNonDeletedIndex(n)}return r}},{key:"isShallowConcavity",value:function(t,e,n,i){return ct.index(t,e,n)===this._angleOrientation&&xt.pointToSegment(e,t,n)<i}},{key:"isShallowSampled",value:function(e,n,i,r,s){var a=Math.trunc((r-i)/t.NUM_PTS_TO_CHECK);a<=0&&(a=1);for(var o=i;o<r;o+=a)if(!this.isShallow(e,n,this._inputLine[o],s))return!1;return!0}},{key:"isConcave",value:function(t,e,n){var i=ct.index(t,e,n)===this._angleOrientation;return i}},{key:"simplify",value:function(t){this._distanceTol=Math.abs(t),t<0&&(this._angleOrientation=ct.CLOCKWISE),this._isDeleted=new Array(this._inputLine.length).fill(null);var e=!1;do{e=this.deleteShallowConcavities()}while(e);return this.collapseLine()}},{key:"findNextNonDeletedIndex",value:function(e){for(var n=e+1;n<this._inputLine.length&&this._isDeleted[n]===t.DELETE;)n++;return n}},{key:"isShallow",value:function(t,e,n,i){return xt.pointToSegment(e,t,n)<i}},{key:"collapseLine",value:function(){for(var e=new Zt,n=0;n<this._inputLine.length;n++)this._isDeleted[n]!==t.DELETE&&e.add(this._inputLine[n]);return e.toCoordinateArray()}}],[{key:"constructor_",value:function(){this._inputLine=null,this._distanceTol=null,this._isDeleted=null,this._angleOrientation=ct.COUNTERCLOCKWISE;var t=arguments[0];this._inputLine=t}},{key:"simplify",value:function(e,n){return new t(e).simplify(n)}}])}();wn.INIT=0,wn.DELETE=1,wn.KEEP=1,wn.NUM_PTS_TO_CHECK=10;var On=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getCoordinates",value:function(){return this._ptList.toArray(t.COORDINATE_ARRAY_TYPE)}},{key:"setPrecisionModel",value:function(t){this._precisionModel=t}},{key:"addPt",value:function(t){var e=new X(t);if(this._precisionModel.makePrecise(e),this.isRedundant(e))return null;this._ptList.add(e)}},{key:"reverse",value:function(){}},{key:"addPts",value:function(t,e){if(e)for(var n=0;n<t.length;n++)this.addPt(t[n]);else for(var i=t.length-1;i>=0;i--)this.addPt(t[i])}},{key:"isRedundant",value:function(t){if(this._ptList.size()<1)return!1;var e=this._ptList.get(this._ptList.size()-1);return t.distance(e)<this._minimimVertexDistance}},{key:"toString",value:function(){return(new ae).createLineString(this.getCoordinates()).toString()}},{key:"closeRing",value:function(){if(this._ptList.size()<1)return null;var t=new X(this._ptList.get(0)),e=this._ptList.get(this._ptList.size()-1);if(t.equals(e))return null;this._ptList.add(t)}},{key:"setMinimumVertexDistance",value:function(t){this._minimimVertexDistance=t}}],[{key:"constructor_",value:function(){this._ptList=null,this._precisionModel=null,this._minimimVertexDistance=0,this._ptList=new yt}}])}();On.COORDINATE_ARRAY_TYPE=new Array(0).fill(null);var bn=function(){function t(){n(this,t)}return s(t,null,[{key:"toDegrees",value:function(t){return 180*t/Math.PI}},{key:"normalize",value:function(e){for(;e>Math.PI;)e-=t.PI_TIMES_2;for(;e<=-Math.PI;)e+=t.PI_TIMES_2;return e}},{key:"angle",value:function(){if(1===arguments.length){var t=arguments[0];return Math.atan2(t.y,t.x)}if(2===arguments.length){var e=arguments[0],n=arguments[1],i=n.x-e.x,r=n.y-e.y;return Math.atan2(r,i)}}},{key:"isAcute",value:function(t,e,n){var i=t.x-e.x,r=t.y-e.y;return i*(n.x-e.x)+r*(n.y-e.y)>0}},{key:"isObtuse",value:function(t,e,n){var i=t.x-e.x,r=t.y-e.y;return i*(n.x-e.x)+r*(n.y-e.y)<0}},{key:"interiorAngle",value:function(e,n,i){var r=t.angle(n,e),s=t.angle(n,i);return Math.abs(s-r)}},{key:"normalizePositive",value:function(e){if(e<0){for(;e<0;)e+=t.PI_TIMES_2;e>=t.PI_TIMES_2&&(e=0)}else{for(;e>=t.PI_TIMES_2;)e-=t.PI_TIMES_2;e<0&&(e=0)}return e}},{key:"angleBetween",value:function(e,n,i){var r=t.angle(n,e),s=t.angle(n,i);return t.diff(r,s)}},{key:"diff",value:function(t,e){var n=null;return(n=t<e?e-t:t-e)>Math.PI&&(n=2*Math.PI-n),n}},{key:"toRadians",value:function(t){return t*Math.PI/180}},{key:"getTurn",value:function(e,n){var i=Math.sin(n-e);return i>0?t.COUNTERCLOCKWISE:i<0?t.CLOCKWISE:t.NONE}},{key:"angleBetweenOriented",value:function(e,n,i){var r=t.angle(n,e),s=t.angle(n,i)-r;return s<=-Math.PI?s+t.PI_TIMES_2:s>Math.PI?s-t.PI_TIMES_2:s}}])}();bn.PI_TIMES_2=2*Math.PI,bn.PI_OVER_2=Math.PI/2,bn.PI_OVER_4=Math.PI/4,bn.COUNTERCLOCKWISE=ct.COUNTERCLOCKWISE,bn.CLOCKWISE=ct.CLOCKWISE,bn.NONE=ct.COLLINEAR;var Mn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"addNextSegment",value:function(t,e){if(this._s0=this._s1,this._s1=this._s2,this._s2=t,this._seg0.setCoordinates(this._s0,this._s1),this.computeOffsetSegment(this._seg0,this._side,this._distance,this._offset0),this._seg1.setCoordinates(this._s1,this._s2),this.computeOffsetSegment(this._seg1,this._side,this._distance,this._offset1),this._s1.equals(this._s2))return null;var n=ct.index(this._s0,this._s1,this._s2),i=n===ct.CLOCKWISE&&this._side===$.LEFT||n===ct.COUNTERCLOCKWISE&&this._side===$.RIGHT;0===n?this.addCollinear(e):i?this.addOutsideTurn(n,e):this.addInsideTurn(n,e)}},{key:"addLineEndCap",value:function(t,e){var n=new In(t,e),i=new In;this.computeOffsetSegment(n,$.LEFT,this._distance,i);var r=new In;this.computeOffsetSegment(n,$.RIGHT,this._distance,r);var s=e.x-t.x,a=e.y-t.y,o=Math.atan2(a,s);switch(this._bufParams.getEndCapStyle()){case _.CAP_ROUND:this._segList.addPt(i.p1),this.addDirectedFillet(e,o+Math.PI/2,o-Math.PI/2,ct.CLOCKWISE,this._distance),this._segList.addPt(r.p1);break;case _.CAP_FLAT:this._segList.addPt(i.p1),this._segList.addPt(r.p1);break;case _.CAP_SQUARE:var u=new X;u.x=Math.abs(this._distance)*Math.cos(o),u.y=Math.abs(this._distance)*Math.sin(o);var l=new X(i.p1.x+u.x,i.p1.y+u.y),h=new X(r.p1.x+u.x,r.p1.y+u.y);this._segList.addPt(l),this._segList.addPt(h)}}},{key:"getCoordinates",value:function(){return this._segList.getCoordinates()}},{key:"addMitreJoin",value:function(t,e,n,i){var r=pt.intersection(e.p0,e.p1,n.p0,n.p1);if(null!==r&&(i<=0?1:r.distance(t)/Math.abs(i))<=this._bufParams.getMitreLimit())return this._segList.addPt(r),null;this.addLimitedMitreJoin(e,n,i,this._bufParams.getMitreLimit())}},{key:"addOutsideTurn",value:function(e,n){if(this._offset0.p1.distance(this._offset1.p0)<this._distance*t.OFFSET_SEGMENT_SEPARATION_FACTOR)return this._segList.addPt(this._offset0.p1),null;this._bufParams.getJoinStyle()===_.JOIN_MITRE?this.addMitreJoin(this._s1,this._offset0,this._offset1,this._distance):this._bufParams.getJoinStyle()===_.JOIN_BEVEL?this.addBevelJoin(this._offset0,this._offset1):(n&&this._segList.addPt(this._offset0.p1),this.addCornerFillet(this._s1,this._offset0.p1,this._offset1.p0,e,this._distance),this._segList.addPt(this._offset1.p0))}},{key:"createSquare",value:function(t){this._segList.addPt(new X(t.x+this._distance,t.y+this._distance)),this._segList.addPt(new X(t.x+this._distance,t.y-this._distance)),this._segList.addPt(new X(t.x-this._distance,t.y-this._distance)),this._segList.addPt(new X(t.x-this._distance,t.y+this._distance)),this._segList.closeRing()}},{key:"addSegments",value:function(t,e){this._segList.addPts(t,e)}},{key:"addFirstSegment",value:function(){this._segList.addPt(this._offset1.p0)}},{key:"addCornerFillet",value:function(t,e,n,i,r){var s=e.x-t.x,a=e.y-t.y,o=Math.atan2(a,s),u=n.x-t.x,l=n.y-t.y,h=Math.atan2(l,u);i===ct.CLOCKWISE?o<=h&&(o+=2*Math.PI):o>=h&&(o-=2*Math.PI),this._segList.addPt(e),this.addDirectedFillet(t,o,h,i,r),this._segList.addPt(n)}},{key:"addLastSegment",value:function(){this._segList.addPt(this._offset1.p1)}},{key:"initSideSegments",value:function(t,e,n){this._s1=t,this._s2=e,this._side=n,this._seg1.setCoordinates(t,e),this.computeOffsetSegment(this._seg1,n,this._distance,this._offset1)}},{key:"addLimitedMitreJoin",value:function(t,e,n,i){var r=this._seg0.p1,s=bn.angle(r,this._seg0.p0),a=bn.angleBetweenOriented(this._seg0.p0,r,this._seg1.p1)/2,o=bn.normalize(s+a),u=bn.normalize(o+Math.PI),l=i*n,h=n-l*Math.abs(Math.sin(a)),c=r.x+l*Math.cos(u),f=r.y+l*Math.sin(u),g=new X(c,f),v=new In(r,g),y=v.pointAlongOffset(1,h),d=v.pointAlongOffset(1,-h);this._side===$.LEFT?(this._segList.addPt(y),this._segList.addPt(d)):(this._segList.addPt(d),this._segList.addPt(y))}},{key:"addDirectedFillet",value:function(t,e,n,i,r){var s=i===ct.CLOCKWISE?-1:1,a=Math.abs(e-n),o=Math.trunc(a/this._filletAngleQuantum+.5);if(o<1)return null;for(var u=a/o,l=new X,h=0;h<o;h++){var c=e+s*h*u;l.x=t.x+r*Math.cos(c),l.y=t.y+r*Math.sin(c),this._segList.addPt(l)}}},{key:"computeOffsetSegment",value:function(t,e,n,i){var r=e===$.LEFT?1:-1,s=t.p1.x-t.p0.x,a=t.p1.y-t.p0.y,o=Math.sqrt(s*s+a*a),u=r*n*s/o,l=r*n*a/o;i.p0.x=t.p0.x-l,i.p0.y=t.p0.y+u,i.p1.x=t.p1.x-l,i.p1.y=t.p1.y+u}},{key:"addInsideTurn",value:function(e,n){if(this._li.computeIntersection(this._offset0.p0,this._offset0.p1,this._offset1.p0,this._offset1.p1),this._li.hasIntersection())this._segList.addPt(this._li.getIntersection(0));else if(this._hasNarrowConcaveAngle=!0,this._offset0.p1.distance(this._offset1.p0)<this._distance*t.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR)this._segList.addPt(this._offset0.p1);else{if(this._segList.addPt(this._offset0.p1),this._closingSegLengthFactor>0){var i=new X((this._closingSegLengthFactor*this._offset0.p1.x+this._s1.x)/(this._closingSegLengthFactor+1),(this._closingSegLengthFactor*this._offset0.p1.y+this._s1.y)/(this._closingSegLengthFactor+1));this._segList.addPt(i);var r=new X((this._closingSegLengthFactor*this._offset1.p0.x+this._s1.x)/(this._closingSegLengthFactor+1),(this._closingSegLengthFactor*this._offset1.p0.y+this._s1.y)/(this._closingSegLengthFactor+1));this._segList.addPt(r)}else this._segList.addPt(this._s1);this._segList.addPt(this._offset1.p0)}}},{key:"createCircle",value:function(t){var e=new X(t.x+this._distance,t.y);this._segList.addPt(e),this.addDirectedFillet(t,0,2*Math.PI,-1,this._distance),this._segList.closeRing()}},{key:"addBevelJoin",value:function(t,e){this._segList.addPt(t.p1),this._segList.addPt(e.p0)}},{key:"init",value:function(e){this._distance=e,this._maxCurveSegmentError=e*(1-Math.cos(this._filletAngleQuantum/2)),this._segList=new On,this._segList.setPrecisionModel(this._precisionModel),this._segList.setMinimumVertexDistance(e*t.CURVE_VERTEX_SNAP_DISTANCE_FACTOR)}},{key:"addCollinear",value:function(t){this._li.computeIntersection(this._s0,this._s1,this._s1,this._s2),this._li.getIntersectionNum()>=2&&(this._bufParams.getJoinStyle()===_.JOIN_BEVEL||this._bufParams.getJoinStyle()===_.JOIN_MITRE?(t&&this._segList.addPt(this._offset0.p1),this._segList.addPt(this._offset1.p0)):this.addCornerFillet(this._s1,this._offset0.p1,this._offset1.p0,ct.CLOCKWISE,this._distance))}},{key:"closeRing",value:function(){this._segList.closeRing()}},{key:"hasNarrowConcaveAngle",value:function(){return this._hasNarrowConcaveAngle}}],[{key:"constructor_",value:function(){this._maxCurveSegmentError=0,this._filletAngleQuantum=null,this._closingSegLengthFactor=1,this._segList=null,this._distance=0,this._precisionModel=null,this._bufParams=null,this._li=null,this._s0=null,this._s1=null,this._s2=null,this._seg0=new In,this._seg1=new In,this._offset0=new In,this._offset1=new In,this._side=0,this._hasNarrowConcaveAngle=!1;var e=arguments[0],n=arguments[1],i=arguments[2];this._precisionModel=e,this._bufParams=n,this._li=new we,this._filletAngleQuantum=Math.PI/2/n.getQuadrantSegments(),n.getQuadrantSegments()>=8&&n.getJoinStyle()===_.JOIN_ROUND&&(this._closingSegLengthFactor=t.MAX_CLOSING_SEG_LEN_FACTOR),this.init(i)}}])}();Mn.OFFSET_SEGMENT_SEPARATION_FACTOR=.001,Mn.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR=.001,Mn.CURVE_VERTEX_SNAP_DISTANCE_FACTOR=1e-6,Mn.MAX_CLOSING_SEG_LEN_FACTOR=80;var An=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getOffsetCurve",value:function(t,e){if(this._distance=e,0===e)return null;var n=e<0,i=Math.abs(e),r=this.getSegGen(i);t.length<=1?this.computePointCurve(t[0],r):this.computeOffsetCurve(t,n,r);var s=r.getCoordinates();return n&&jt.reverse(s),s}},{key:"computeSingleSidedBufferCurve",value:function(t,e,n){var i=this.simplifyTolerance(this._distance);if(e){n.addSegments(t,!0);var r=wn.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],$.LEFT),n.addFirstSegment();for(var a=s-2;a>=0;a--)n.addNextSegment(r[a],!0)}else{n.addSegments(t,!1);var o=wn.simplify(t,i),u=o.length-1;n.initSideSegments(o[0],o[1],$.LEFT),n.addFirstSegment();for(var l=2;l<=u;l++)n.addNextSegment(o[l],!0)}n.addLastSegment(),n.closeRing()}},{key:"computeRingBufferCurve",value:function(t,e,n){var i=this.simplifyTolerance(this._distance);e===$.RIGHT&&(i=-i);var r=wn.simplify(t,i),s=r.length-1;n.initSideSegments(r[s-1],r[0],e);for(var a=1;a<=s;a++){var o=1!==a;n.addNextSegment(r[a],o)}n.closeRing()}},{key:"computeLineBufferCurve",value:function(t,e){var n=this.simplifyTolerance(this._distance),i=wn.simplify(t,n),r=i.length-1;e.initSideSegments(i[0],i[1],$.LEFT);for(var s=2;s<=r;s++)e.addNextSegment(i[s],!0);e.addLastSegment(),e.addLineEndCap(i[r-1],i[r]);var a=wn.simplify(t,-n),o=a.length-1;e.initSideSegments(a[o],a[o-1],$.LEFT);for(var u=o-2;u>=0;u--)e.addNextSegment(a[u],!0);e.addLastSegment(),e.addLineEndCap(a[1],a[0]),e.closeRing()}},{key:"computePointCurve",value:function(t,e){switch(this._bufParams.getEndCapStyle()){case _.CAP_ROUND:e.createCircle(t);break;case _.CAP_SQUARE:e.createSquare(t)}}},{key:"getLineCurve",value:function(t,e){if(this._distance=e,this.isLineOffsetEmpty(e))return null;var n=Math.abs(e),i=this.getSegGen(n);if(t.length<=1)this.computePointCurve(t[0],i);else if(this._bufParams.isSingleSided()){var r=e<0;this.computeSingleSidedBufferCurve(t,r,i)}else this.computeLineBufferCurve(t,i);return i.getCoordinates()}},{key:"getBufferParameters",value:function(){return this._bufParams}},{key:"simplifyTolerance",value:function(t){return t*this._bufParams.getSimplifyFactor()}},{key:"getRingCurve",value:function(e,n,i){if(this._distance=i,e.length<=2)return this.getLineCurve(e,i);if(0===i)return t.copyCoordinates(e);var r=this.getSegGen(i);return this.computeRingBufferCurve(e,n,r),r.getCoordinates()}},{key:"computeOffsetCurve",value:function(t,e,n){var i=this.simplifyTolerance(this._distance);if(e){var r=wn.simplify(t,-i),s=r.length-1;n.initSideSegments(r[s],r[s-1],$.LEFT),n.addFirstSegment();for(var a=s-2;a>=0;a--)n.addNextSegment(r[a],!0)}else{var o=wn.simplify(t,i),u=o.length-1;n.initSideSegments(o[0],o[1],$.LEFT),n.addFirstSegment();for(var l=2;l<=u;l++)n.addNextSegment(o[l],!0)}n.addLastSegment()}},{key:"isLineOffsetEmpty",value:function(t){return 0===t||t<0&&!this._bufParams.isSingleSided()}},{key:"getSegGen",value:function(t){return new Mn(this._precisionModel,this._bufParams,t)}}],[{key:"constructor_",value:function(){this._distance=0,this._precisionModel=null,this._bufParams=null;var t=arguments[0],e=arguments[1];this._precisionModel=t,this._bufParams=e}},{key:"copyCoordinates",value:function(t){for(var e=new Array(t.length).fill(null),n=0;n<e.length;n++)e[n]=new X(t[n]);return e}}])}(),Pn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"findStabbedSegments",value:function(){if(1===arguments.length){for(var t=arguments[0],e=new yt,n=this._subgraphs.iterator();n.hasNext();){var i=n.next(),r=i.getEnvelope();t.y<r.getMinY()||t.y>r.getMaxY()||this.findStabbedSegments(t,i.getDirectedEdges(),e)}return e}if(3===arguments.length)if(rt(arguments[2],nt)&&arguments[0]instanceof X&&arguments[1]instanceof Ke)for(var s=arguments[0],a=arguments[1],o=arguments[2],u=a.getEdge().getCoordinates(),l=0;l<u.length-1;l++){if(this._seg.p0=u[l],this._seg.p1=u[l+1],this._seg.p0.y>this._seg.p1.y&&this._seg.reverse(),!(Math.max(this._seg.p0.x,this._seg.p1.x)<s.x||this._seg.isHorizontal()||s.y<this._seg.p0.y||s.y>this._seg.p1.y||ct.index(this._seg.p0,this._seg.p1,s)===ct.RIGHT)){var h=a.getDepth($.LEFT);this._seg.p0.equals(u[l])||(h=a.getDepth($.RIGHT));var c=new Dn(this._seg,h);o.add(c)}}else if(rt(arguments[2],nt)&&arguments[0]instanceof X&&rt(arguments[1],nt))for(var f=arguments[0],g=arguments[2],v=arguments[1].iterator();v.hasNext();){var y=v.next();y.isForward()&&this.findStabbedSegments(f,y,g)}}},{key:"getDepth",value:function(t){var e=this.findStabbedSegments(t);return 0===e.size()?0:an.min(e)._leftDepth}}],[{key:"constructor_",value:function(){this._subgraphs=null,this._seg=new In;var t=arguments[0];this._subgraphs=t}}])}(),Dn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"compareTo",value:function(t){var e=t;if(this._upwardSeg.minX()>=e._upwardSeg.maxX())return 1;if(this._upwardSeg.maxX()<=e._upwardSeg.minX())return-1;var n=this._upwardSeg.orientationIndex(e._upwardSeg);return 0!==n||0!==(n=-1*e._upwardSeg.orientationIndex(this._upwardSeg))?n:this._upwardSeg.compareTo(e._upwardSeg)}},{key:"compareX",value:function(t,e){var n=t.p0.compareTo(e.p0);return 0!==n?n:t.p1.compareTo(e.p1)}},{key:"toString",value:function(){return this._upwardSeg.toString()}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this._upwardSeg=null,this._leftDepth=null;var t=arguments[0],e=arguments[1];this._upwardSeg=new In(t),this._leftDepth=e}}])}();Pn.DepthSegment=Dn;var Fn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,null,[{key:"constructor_",value:function(){p.constructor_.call(this,"Projective point not representable on the Cartesian plane.")}}])}(p),Gn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getY",value:function(){var t=this.y/this.w;if(A.isNaN(t)||A.isInfinite(t))throw new Fn;return t}},{key:"getX",value:function(){var t=this.x/this.w;if(A.isNaN(t)||A.isInfinite(t))throw new Fn;return t}},{key:"getCoordinate",value:function(){var t=new X;return t.x=this.getX(),t.y=this.getY(),t}}],[{key:"constructor_",value:function(){if(this.x=null,this.y=null,this.w=null,0===arguments.length)this.x=0,this.y=0,this.w=1;else if(1===arguments.length){var e=arguments[0];this.x=e.x,this.y=e.y,this.w=1}else if(2===arguments.length){if("number"==typeof arguments[0]&&"number"==typeof arguments[1]){var n=arguments[0],i=arguments[1];this.x=n,this.y=i,this.w=1}else if(arguments[0]instanceof t&&arguments[1]instanceof t){var r=arguments[0],s=arguments[1];this.x=r.y*s.w-s.y*r.w,this.y=s.x*r.w-r.x*s.w,this.w=r.x*s.y-s.x*r.y}else if(arguments[0]instanceof X&&arguments[1]instanceof X){var a=arguments[0],o=arguments[1];this.x=a.y-o.y,this.y=o.x-a.x,this.w=a.x*o.y-o.x*a.y}}else if(3===arguments.length){var u=arguments[0],l=arguments[1],h=arguments[2];this.x=u,this.y=l,this.w=h}else if(4===arguments.length){var c=arguments[0],f=arguments[1],g=arguments[2],v=arguments[3],y=c.y-f.y,d=f.x-c.x,_=c.x*f.y-f.x*c.y,p=g.y-v.y,m=v.x-g.x,k=g.x*v.y-v.x*g.y;this.x=d*k-m*_,this.y=p*_-y*k,this.w=y*m-p*d}}}])}(),qn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"area",value:function(){return t.area(this.p0,this.p1,this.p2)}},{key:"signedArea",value:function(){return t.signedArea(this.p0,this.p1,this.p2)}},{key:"interpolateZ",value:function(e){if(null===e)throw new m("Supplied point is null.");return t.interpolateZ(e,this.p0,this.p1,this.p2)}},{key:"longestSideLength",value:function(){return t.longestSideLength(this.p0,this.p1,this.p2)}},{key:"isAcute",value:function(){return t.isAcute(this.p0,this.p1,this.p2)}},{key:"circumcentre",value:function(){return t.circumcentre(this.p0,this.p1,this.p2)}},{key:"area3D",value:function(){return t.area3D(this.p0,this.p1,this.p2)}},{key:"centroid",value:function(){return t.centroid(this.p0,this.p1,this.p2)}},{key:"inCentre",value:function(){return t.inCentre(this.p0,this.p1,this.p2)}}],[{key:"constructor_",value:function(){this.p0=null,this.p1=null,this.p2=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.p0=t,this.p1=e,this.p2=n}},{key:"area",value:function(t,e,n){return Math.abs(((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2)}},{key:"signedArea",value:function(t,e,n){return((n.x-t.x)*(e.y-t.y)-(e.x-t.x)*(n.y-t.y))/2}},{key:"det",value:function(t,e,n,i){return t*i-e*n}},{key:"interpolateZ",value:function(t,e,n,i){var r=e.x,s=e.y,a=n.x-r,o=i.x-r,u=n.y-s,l=i.y-s,h=a*l-o*u,c=t.x-r,f=t.y-s,g=(l*c-o*f)/h,v=(-u*c+a*f)/h;return e.getZ()+g*(n.getZ()-e.getZ())+v*(i.getZ()-e.getZ())}},{key:"longestSideLength",value:function(t,e,n){var i=t.distance(e),r=e.distance(n),s=n.distance(t),a=i;return r>a&&(a=r),s>a&&(a=s),a}},{key:"circumcentreDD",value:function(t,e,n){var i=ut.valueOf(t.x).subtract(n.x),r=ut.valueOf(t.y).subtract(n.y),s=ut.valueOf(e.x).subtract(n.x),a=ut.valueOf(e.y).subtract(n.y),o=ut.determinant(i,r,s,a).multiply(2),u=i.sqr().add(r.sqr()),l=s.sqr().add(a.sqr()),h=ut.determinant(r,u,a,l),c=ut.determinant(i,u,s,l),f=ut.valueOf(n.x).subtract(h.divide(o)).doubleValue(),g=ut.valueOf(n.y).add(c.divide(o)).doubleValue();return new X(f,g)}},{key:"isAcute",value:function(t,e,n){return!!bn.isAcute(t,e,n)&&(!!bn.isAcute(e,n,t)&&!!bn.isAcute(n,t,e))}},{key:"circumcentre",value:function(e,n,i){var r=i.x,s=i.y,a=e.x-r,o=e.y-s,u=n.x-r,l=n.y-s,h=2*t.det(a,o,u,l),c=t.det(o,a*a+o*o,l,u*u+l*l),f=t.det(a,a*a+o*o,u,u*u+l*l);return new X(r-c/h,s+f/h)}},{key:"perpendicularBisector",value:function(t,e){var n=e.x-t.x,i=e.y-t.y,r=new Gn(t.x+n/2,t.y+i/2,1),s=new Gn(t.x-i+n/2,t.y+n+i/2,1);return new Gn(r,s)}},{key:"angleBisector",value:function(t,e,n){var i=e.distance(t),r=i/(i+e.distance(n)),s=n.x-t.x,a=n.y-t.y;return new X(t.x+r*s,t.y+r*a)}},{key:"area3D",value:function(t,e,n){var i=e.x-t.x,r=e.y-t.y,s=e.getZ()-t.getZ(),a=n.x-t.x,o=n.y-t.y,u=n.getZ()-t.getZ(),l=r*u-s*o,h=s*a-i*u,c=i*o-r*a,f=l*l+h*h+c*c,g=Math.sqrt(f)/2;return g}},{key:"centroid",value:function(t,e,n){var i=(t.x+e.x+n.x)/3,r=(t.y+e.y+n.y)/3;return new X(i,r)}},{key:"inCentre",value:function(t,e,n){var i=e.distance(n),r=t.distance(n),s=t.distance(e),a=i+r+s,o=(i*t.x+r*e.x+s*n.x)/a,u=(i*t.y+r*e.y+s*n.y)/a;return new X(o,u)}}])}(),Yn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"addRingSide",value:function(t,e,n,i,r){if(0===e&&t.length<Xt.MINIMUM_VALID_SIZE)return null;var s=i,a=r;t.length>=Xt.MINIMUM_VALID_SIZE&&ct.isCCW(t)&&(s=r,a=i,n=$.opposite(n));var o=this._curveBuilder.getRingCurve(t,n,e);this.addCurve(o,s,a)}},{key:"addRingBothSides",value:function(t,e){this.addRingSide(t,e,$.LEFT,H.EXTERIOR,H.INTERIOR),this.addRingSide(t,e,$.RIGHT,H.INTERIOR,H.EXTERIOR)}},{key:"addPoint",value:function(t){if(this._distance<=0)return null;var e=t.getCoordinates(),n=this._curveBuilder.getLineCurve(e,this._distance);this.addCurve(n,H.EXTERIOR,H.INTERIOR)}},{key:"addPolygon",value:function(t){var e=this._distance,n=$.LEFT;this._distance<0&&(e=-this._distance,n=$.RIGHT);var i=t.getExteriorRing(),r=jt.removeRepeatedPoints(i.getCoordinates());if(this._distance<0&&this.isErodedCompletely(i,this._distance))return null;if(this._distance<=0&&r.length<3)return null;this.addRingSide(r,e,n,H.EXTERIOR,H.INTERIOR);for(var s=0;s<t.getNumInteriorRing();s++){var a=t.getInteriorRingN(s),o=jt.removeRepeatedPoints(a.getCoordinates());this._distance>0&&this.isErodedCompletely(a,-this._distance)||this.addRingSide(o,e,$.opposite(n),H.INTERIOR,H.EXTERIOR)}}},{key:"isTriangleErodedCompletely",value:function(t,e){var n=new qn(t[0],t[1],t[2]),i=n.inCentre();return xt.pointToSegment(i,n.p0,n.p1)<Math.abs(e)}},{key:"addLineString",value:function(t){if(this._curveBuilder.isLineOffsetEmpty(this._distance))return null;var e=jt.removeRepeatedPoints(t.getCoordinates());if(jt.isRing(e)&&!this._curveBuilder.getBufferParameters().isSingleSided())this.addRingBothSides(e,this._distance);else{var n=this._curveBuilder.getLineCurve(e,this._distance);this.addCurve(n,H.EXTERIOR,H.INTERIOR)}}},{key:"addCurve",value:function(t,e,n){if(null===t||t.length<2)return null;var i=new xn(t,new Ae(0,H.BOUNDARY,e,n));this._curveList.add(i)}},{key:"getCurves",value:function(){return this.add(this._inputGeom),this._curveList}},{key:"add",value:function(t){if(t.isEmpty())return null;if(t instanceof Dt)this.addPolygon(t);else if(t instanceof wt)this.addLineString(t);else if(t instanceof bt)this.addPoint(t);else if(t instanceof zt)this.addCollection(t);else if(t instanceof se)this.addCollection(t);else if(t instanceof te)this.addCollection(t);else{if(!(t instanceof Yt))throw new W(t.getGeometryType());this.addCollection(t)}}},{key:"isErodedCompletely",value:function(t,e){var n=t.getCoordinates();if(n.length<4)return e<0;if(4===n.length)return this.isTriangleErodedCompletely(n,e);var i=t.getEnvelopeInternal(),r=Math.min(i.getHeight(),i.getWidth());return e<0&&2*Math.abs(e)>r}},{key:"addCollection",value:function(t){for(var e=0;e<t.getNumGeometries();e++){var n=t.getGeometryN(e);this.add(n)}}}],[{key:"constructor_",value:function(){this._inputGeom=null,this._distance=null,this._curveBuilder=null,this._curveList=new yt;var t=arguments[0],e=arguments[1],n=arguments[2];this._inputGeom=t,this._distance=e,this._curveBuilder=n}}])}(),zn=function(){return s((function t(){n(this,t)}),[{key:"locate",value:function(t){}}])}(),Xn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"next",value:function(){if(this._atStart)return this._atStart=!1,t.isAtomic(this._parent)&&this._index++,this._parent;if(null!==this._subcollectionIterator){if(this._subcollectionIterator.hasNext())return this._subcollectionIterator.next();this._subcollectionIterator=null}if(this._index>=this._max)throw new j;var e=this._parent.getGeometryN(this._index++);return e instanceof Yt?(this._subcollectionIterator=new t(e),this._subcollectionIterator.next()):e}},{key:"remove",value:function(){throw new W(this.getClass().getName())}},{key:"hasNext",value:function(){if(this._atStart)return!0;if(null!==this._subcollectionIterator){if(this._subcollectionIterator.hasNext())return!0;this._subcollectionIterator=null}return!(this._index>=this._max)}},{key:"interfaces_",get:function(){return[dn]}}],[{key:"constructor_",value:function(){this._parent=null,this._atStart=null,this._max=null,this._index=null,this._subcollectionIterator=null;var t=arguments[0];this._parent=t,this._atStart=!0,this._index=0,this._max=t.getNumGeometries()}},{key:"isAtomic",value:function(t){return!(t instanceof Yt)}}])}(),Bn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"locate",value:function(e){return t.locate(e,this._geom)}},{key:"interfaces_",get:function(){return[zn]}}],[{key:"constructor_",value:function(){this._geom=null;var t=arguments[0];this._geom=t}},{key:"locatePointInPolygon",value:function(e,n){if(n.isEmpty())return H.EXTERIOR;var i=n.getExteriorRing(),r=t.locatePointInRing(e,i);if(r!==H.INTERIOR)return r;for(var s=0;s<n.getNumInteriorRing();s++){var a=n.getInteriorRingN(s),o=t.locatePointInRing(e,a);if(o===H.BOUNDARY)return H.BOUNDARY;if(o===H.INTERIOR)return H.EXTERIOR}return H.INTERIOR}},{key:"locatePointInRing",value:function(t,e){return e.getEnvelopeInternal().intersects(t)?be.locateInRing(t,e.getCoordinates()):H.EXTERIOR}},{key:"containsPointInPolygon",value:function(e,n){return H.EXTERIOR!==t.locatePointInPolygon(e,n)}},{key:"locateInGeometry",value:function(e,n){if(n instanceof Dt)return t.locatePointInPolygon(e,n);if(n instanceof Yt)for(var i=new Xn(n);i.hasNext();){var r=i.next();if(r!==n){var s=t.locateInGeometry(e,r);if(s!==H.EXTERIOR)return s}}return H.EXTERIOR}},{key:"isContained",value:function(e,n){return H.EXTERIOR!==t.locate(e,n)}},{key:"locate",value:function(e,n){return n.isEmpty()?H.EXTERIOR:n.getEnvelopeInternal().intersects(e)?t.locateInGeometry(e,n):H.EXTERIOR}}])}(),Un=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getNextCW",value:function(t){this.getEdges();var e=this._edgeList.indexOf(t),n=e-1;return 0===e&&(n=this._edgeList.size()-1),this._edgeList.get(n)}},{key:"propagateSideLabels",value:function(t){for(var e=H.NONE,n=this.iterator();n.hasNext();){var i=n.next().getLabel();i.isArea(t)&&i.getLocation(t,$.LEFT)!==H.NONE&&(e=i.getLocation(t,$.LEFT))}if(e===H.NONE)return null;for(var r=e,s=this.iterator();s.hasNext();){var a=s.next(),o=a.getLabel();if(o.getLocation(t,$.ON)===H.NONE&&o.setLocation(t,$.ON,r),o.isArea(t)){var u=o.getLocation(t,$.LEFT),l=o.getLocation(t,$.RIGHT);if(l!==H.NONE){if(l!==r)throw new gt("side location conflict",a.getCoordinate());u===H.NONE&&G.shouldNeverReachHere("found single null side (at "+a.getCoordinate()+")"),r=u}else G.isTrue(o.getLocation(t,$.LEFT)===H.NONE,"found single null side"),o.setLocation(t,$.RIGHT,r),o.setLocation(t,$.LEFT,r)}}}},{key:"getCoordinate",value:function(){var t=this.iterator();return t.hasNext()?t.next().getCoordinate():null}},{key:"print",value:function(t){mt.out.println("EdgeEndStar:   "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){e.next().print(t)}}},{key:"isAreaLabelsConsistent",value:function(t){return this.computeEdgeEndLabels(t.getBoundaryNodeRule()),this.checkAreaLabelsConsistent(0)}},{key:"checkAreaLabelsConsistent",value:function(t){var e=this.getEdges();if(e.size()<=0)return!0;var n=e.size()-1,i=e.get(n).getLabel().getLocation(t,$.LEFT);G.isTrue(i!==H.NONE,"Found unlabelled area edge");for(var r=i,s=this.iterator();s.hasNext();){var a=s.next().getLabel();G.isTrue(a.isArea(t),"Found non-area edge");var o=a.getLocation(t,$.LEFT),u=a.getLocation(t,$.RIGHT);if(o===u)return!1;if(u!==r)return!1;r=o}return!0}},{key:"findIndex",value:function(t){this.iterator();for(var e=0;e<this._edgeList.size();e++){if(this._edgeList.get(e)===t)return e}return-1}},{key:"iterator",value:function(){return this.getEdges().iterator()}},{key:"getEdges",value:function(){return null===this._edgeList&&(this._edgeList=new yt(this._edgeMap.values())),this._edgeList}},{key:"getLocation",value:function(t,e,n){return this._ptInAreaLocation[t]===H.NONE&&(this._ptInAreaLocation[t]=Bn.locate(e,n[t].getGeometry())),this._ptInAreaLocation[t]}},{key:"toString",value:function(){var t=new st;t.append("EdgeEndStar:   "+this.getCoordinate()),t.append("\n");for(var e=this.iterator();e.hasNext();){var n=e.next();t.append(n),t.append("\n")}return t.toString()}},{key:"computeEdgeEndLabels",value:function(t){for(var e=this.iterator();e.hasNext();){e.next().computeLabel(t)}}},{key:"computeLabelling",value:function(t){this.computeEdgeEndLabels(t[0].getBoundaryNodeRule()),this.propagateSideLabels(0),this.propagateSideLabels(1);for(var e=[!1,!1],n=this.iterator();n.hasNext();)for(var i=n.next().getLabel(),r=0;r<2;r++)i.isLine(r)&&i.getLocation(r)===H.BOUNDARY&&(e[r]=!0);for(var s=this.iterator();s.hasNext();)for(var a=s.next(),o=a.getLabel(),u=0;u<2;u++)if(o.isAnyNull(u)){var l=H.NONE;if(e[u])l=H.EXTERIOR;else{var h=a.getCoordinate();l=this.getLocation(u,h,t)}o.setAllLocationsIfNull(u,l)}}},{key:"getDegree",value:function(){return this._edgeMap.size()}},{key:"insertEdgeEnd",value:function(t,e){this._edgeMap.put(t,e),this._edgeList=null}}],[{key:"constructor_",value:function(){this._edgeMap=new He,this._edgeList=null,this._ptInAreaLocation=[H.NONE,H.NONE]}}])}(),Vn=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"linkResultDirectedEdges",value:function(){this.getResultAreaEdges();for(var t=null,e=null,n=this._SCANNING_FOR_INCOMING,i=0;i<this._resultAreaEdgeList.size();i++){var r=this._resultAreaEdgeList.get(i),s=r.getSym();if(r.getLabel().isArea())switch(null===t&&r.isInResult()&&(t=r),n){case this._SCANNING_FOR_INCOMING:if(!s.isInResult())continue;e=s,n=this._LINKING_TO_OUTGOING;break;case this._LINKING_TO_OUTGOING:if(!r.isInResult())continue;e.setNext(r),n=this._SCANNING_FOR_INCOMING}}if(n===this._LINKING_TO_OUTGOING){if(null===t)throw new gt("no outgoing dirEdge found",this.getCoordinate());G.isTrue(t.isInResult(),"unable to link last incoming dirEdge"),e.setNext(t)}}},{key:"insert",value:function(t){var e=t;this.insertEdgeEnd(e,e)}},{key:"getRightmostEdge",value:function(){var t=this.getEdges(),e=t.size();if(e<1)return null;var n=t.get(0);if(1===e)return n;var i=t.get(e-1),r=n.getQuadrant(),s=i.getQuadrant();return je.isNorthern(r)&&je.isNorthern(s)?n:je.isNorthern(r)||je.isNorthern(s)?0!==n.getDy()?n:0!==i.getDy()?i:(G.shouldNeverReachHere("found two horizontal edges incident on node"),null):i}},{key:"print",value:function(t){mt.out.println("DirectedEdgeStar: "+this.getCoordinate());for(var e=this.iterator();e.hasNext();){var n=e.next();t.print("out "),n.print(t),t.println(),t.print("in "),n.getSym().print(t),t.println()}}},{key:"getResultAreaEdges",value:function(){if(null!==this._resultAreaEdgeList)return this._resultAreaEdgeList;this._resultAreaEdgeList=new yt;for(var t=this.iterator();t.hasNext();){var e=t.next();(e.isInResult()||e.getSym().isInResult())&&this._resultAreaEdgeList.add(e)}return this._resultAreaEdgeList}},{key:"updateLabelling",value:function(t){for(var e=this.iterator();e.hasNext();){var n=e.next().getLabel();n.setAllLocationsIfNull(0,t.getLocation(0)),n.setAllLocationsIfNull(1,t.getLocation(1))}}},{key:"linkAllDirectedEdges",value:function(){this.getEdges();for(var t=null,e=null,n=this._edgeList.size()-1;n>=0;n--){var i=this._edgeList.get(n),r=i.getSym();null===e&&(e=r),null!==t&&r.setNext(t),t=i}e.setNext(t)}},{key:"computeDepths",value:function(){if(1===arguments.length){var t=arguments[0],e=this.findIndex(t),n=t.getDepth($.LEFT),i=t.getDepth($.RIGHT),r=this.computeDepths(e+1,this._edgeList.size(),n);if(this.computeDepths(0,e,r)!==i)throw new gt("depth mismatch at "+t.getCoordinate())}else if(3===arguments.length){for(var s=arguments[1],a=arguments[2],o=arguments[0];o<s;o++){var u=this._edgeList.get(o);u.setEdgeDepths($.RIGHT,a),a=u.getDepth($.LEFT)}return a}}},{key:"mergeSymLabels",value:function(){for(var t=this.iterator();t.hasNext();){var e=t.next();e.getLabel().merge(e.getSym().getLabel())}}},{key:"linkMinimalDirectedEdges",value:function(t){for(var e=null,n=null,i=this._SCANNING_FOR_INCOMING,r=this._resultAreaEdgeList.size()-1;r>=0;r--){var s=this._resultAreaEdgeList.get(r),a=s.getSym();switch(null===e&&s.getEdgeRing()===t&&(e=s),i){case this._SCANNING_FOR_INCOMING:if(a.getEdgeRing()!==t)continue;n=a,i=this._LINKING_TO_OUTGOING;break;case this._LINKING_TO_OUTGOING:if(s.getEdgeRing()!==t)continue;n.setNextMin(s),i=this._SCANNING_FOR_INCOMING}}i===this._LINKING_TO_OUTGOING&&(G.isTrue(null!==e,"found null for first outgoing dirEdge"),G.isTrue(e.getEdgeRing()===t,"unable to link last incoming dirEdge"),n.setNextMin(e))}},{key:"getOutgoingDegree",value:function(){if(0===arguments.length){for(var t=0,e=this.iterator();e.hasNext();){e.next().isInResult()&&t++}return t}if(1===arguments.length){for(var n=arguments[0],i=0,r=this.iterator();r.hasNext();){r.next().getEdgeRing()===n&&i++}return i}}},{key:"getLabel",value:function(){return this._label}},{key:"findCoveredLineEdges",value:function(){for(var t=H.NONE,e=this.iterator();e.hasNext();){var n=e.next(),i=n.getSym();if(!n.isLineEdge()){if(n.isInResult()){t=H.INTERIOR;break}if(i.isInResult()){t=H.EXTERIOR;break}}}if(t===H.NONE)return null;for(var r=t,s=this.iterator();s.hasNext();){var a=s.next(),o=a.getSym();a.isLineEdge()?a.getEdge().setCovered(r===H.INTERIOR):(a.isInResult()&&(r=H.EXTERIOR),o.isInResult()&&(r=H.INTERIOR))}}},{key:"computeLabelling",value:function(t){f(i,"computeLabelling",this,1).call(this,t),this._label=new Ae(H.NONE);for(var e=this.iterator();e.hasNext();)for(var n=e.next().getEdge().getLabel(),r=0;r<2;r++){var s=n.getLocation(r);s!==H.INTERIOR&&s!==H.BOUNDARY||this._label.setLocation(r,H.INTERIOR)}}}],[{key:"constructor_",value:function(){this._resultAreaEdgeList=null,this._label=null,this._SCANNING_FOR_INCOMING=1,this._LINKING_TO_OUTGOING=2}}])}(Un),Hn=function(t){function i(){return n(this,i),e(this,i)}return l(i,t),s(i,[{key:"createNode",value:function(t){return new qe(t,new Vn)}}])}(Je),Zn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"compareTo",value:function(e){var n=e;return t.compareOriented(this._pts,this._orientation,n._pts,n._orientation)}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this._pts=null,this._orientation=null;var e=arguments[0];this._pts=e,this._orientation=t.orientation(e)}},{key:"orientation",value:function(t){return 1===jt.increasingDirection(t)}},{key:"compareOriented",value:function(t,e,n,i){for(var r=e?1:-1,s=i?1:-1,a=e?t.length:-1,o=i?n.length:-1,u=e?0:t.length-1,l=i?0:n.length-1;;){var h=t[u].compareTo(n[l]);if(0!==h)return h;var c=(u+=r)===a,f=(l+=s)===o;if(c&&!f)return-1;if(!c&&f)return 1;if(c&&f)return 0}}}])}(),jn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"print",value:function(t){t.print("MULTILINESTRING ( ");for(var e=0;e<this._edges.size();e++){var n=this._edges.get(e);e>0&&t.print(","),t.print("(");for(var i=n.getCoordinates(),r=0;r<i.length;r++)r>0&&t.print(","),t.print(i[r].x+" "+i[r].y);t.println(")")}t.print(")  ")}},{key:"addAll",value:function(t){for(var e=t.iterator();e.hasNext();)this.add(e.next())}},{key:"findEdgeIndex",value:function(t){for(var e=0;e<this._edges.size();e++)if(this._edges.get(e).equals(t))return e;return-1}},{key:"iterator",value:function(){return this._edges.iterator()}},{key:"getEdges",value:function(){return this._edges}},{key:"get",value:function(t){return this._edges.get(t)}},{key:"findEqualEdge",value:function(t){var e=new Zn(t.getCoordinates());return this._ocaMap.get(e)}},{key:"add",value:function(t){this._edges.add(t);var e=new Zn(t.getCoordinates());this._ocaMap.put(e,t)}}],[{key:"constructor_",value:function(){this._edges=new yt,this._ocaMap=new He}}])}(),Wn=function(){return s((function t(){n(this,t)}),[{key:"processIntersections",value:function(t,e,n,i){}},{key:"isDone",value:function(){}}])}(),Kn=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"isTrivialIntersection",value:function(e,n,i,r){if(e===i&&1===this._li.getIntersectionNum()){if(t.isAdjacentSegments(n,r))return!0;if(e.isClosed()){var s=e.size()-1;if(0===n&&r===s||0===r&&n===s)return!0}}return!1}},{key:"getProperIntersectionPoint",value:function(){return this._properIntersectionPoint}},{key:"hasProperInteriorIntersection",value:function(){return this._hasProperInterior}},{key:"getLineIntersector",value:function(){return this._li}},{key:"hasProperIntersection",value:function(){return this._hasProper}},{key:"processIntersections",value:function(t,e,n,i){if(t===n&&e===i)return null;this.numTests++;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],a=n.getCoordinates()[i],o=n.getCoordinates()[i+1];this._li.computeIntersection(r,s,a,o),this._li.hasIntersection()&&(this.numIntersections++,this._li.isInteriorIntersection()&&(this.numInteriorIntersections++,this._hasInterior=!0),this.isTrivialIntersection(t,e,n,i)||(this._hasIntersection=!0,t.addIntersections(this._li,e,0),n.addIntersections(this._li,i,1),this._li.isProper()&&(this.numProperIntersections++,this._hasProper=!0,this._hasProperInterior=!0)))}},{key:"hasIntersection",value:function(){return this._hasIntersection}},{key:"isDone",value:function(){return!1}},{key:"hasInteriorIntersection",value:function(){return this._hasInterior}},{key:"interfaces_",get:function(){return[Wn]}}],[{key:"constructor_",value:function(){this._hasIntersection=!1,this._hasProper=!1,this._hasProperInterior=!1,this._hasInterior=!1,this._properIntersectionPoint=null,this._li=null,this._isSelfIntersection=null,this.numIntersections=0,this.numInteriorIntersections=0,this.numProperIntersections=0,this.numTests=0;var t=arguments[0];this._li=t}},{key:"isAdjacentSegments",value:function(t,e){return 1===Math.abs(t-e)}}])}(),Jn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getSegmentIndex",value:function(){return this.segmentIndex}},{key:"getCoordinate",value:function(){return this.coord}},{key:"print",value:function(t){t.print(this.coord),t.print(" seg # = "+this.segmentIndex),t.println(" dist = "+this.dist)}},{key:"compareTo",value:function(t){var e=t;return this.compare(e.segmentIndex,e.dist)}},{key:"isEndPoint",value:function(t){return 0===this.segmentIndex&&0===this.dist||this.segmentIndex===t}},{key:"toString",value:function(){return this.coord+" seg # = "+this.segmentIndex+" dist = "+this.dist}},{key:"getDistance",value:function(){return this.dist}},{key:"compare",value:function(t,e){return this.segmentIndex<t?-1:this.segmentIndex>t?1:this.dist<e?-1:this.dist>e?1:0}},{key:"interfaces_",get:function(){return[x]}}],[{key:"constructor_",value:function(){this.coord=null,this.segmentIndex=null,this.dist=null;var t=arguments[0],e=arguments[1],n=arguments[2];this.coord=new X(t),this.segmentIndex=e,this.dist=n}}])}(),Qn=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"print",value:function(t){t.println("Intersections:");for(var e=this.iterator();e.hasNext();){e.next().print(t)}}},{key:"iterator",value:function(){return this._nodeMap.values().iterator()}},{key:"addSplitEdges",value:function(t){this.addEndpoints();for(var e=this.iterator(),n=e.next();e.hasNext();){var i=e.next(),r=this.createSplitEdge(n,i);t.add(r),n=i}}},{key:"addEndpoints",value:function(){var t=this.edge.pts.length-1;this.add(this.edge.pts[0],0,0),this.add(this.edge.pts[t],t,0)}},{key:"createSplitEdge",value:function(t,e){var n=e.segmentIndex-t.segmentIndex+2,i=this.edge.pts[e.segmentIndex],r=e.dist>0||!e.coord.equals2D(i);r||n--;var s=new Array(n).fill(null),a=0;s[a++]=new X(t.coord);for(var o=t.segmentIndex+1;o<=e.segmentIndex;o++)s[a++]=this.edge.pts[o];return r&&(s[a]=e.coord),new ri(s,new Ae(this.edge._label))}},{key:"add",value:function(t,e,n){var i=new Jn(t,e,n),r=this._nodeMap.get(i);return null!==r?r:(this._nodeMap.put(i,i),i)}},{key:"isIntersection",value:function(t){for(var e=this.iterator();e.hasNext();){if(e.next().coord.equals(t))return!0}return!1}}],[{key:"constructor_",value:function(){this._nodeMap=new He,this.edge=null;var t=arguments[0];this.edge=t}}])}(),$n=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"isIntersects",value:function(){return!this.isDisjoint()}},{key:"isCovers",value:function(){return(t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])||t.isTrue(this._matrix[H.INTERIOR][H.BOUNDARY])||t.isTrue(this._matrix[H.BOUNDARY][H.INTERIOR])||t.isTrue(this._matrix[H.BOUNDARY][H.BOUNDARY]))&&this._matrix[H.EXTERIOR][H.INTERIOR]===Lt.FALSE&&this._matrix[H.EXTERIOR][H.BOUNDARY]===Lt.FALSE}},{key:"isCoveredBy",value:function(){return(t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])||t.isTrue(this._matrix[H.INTERIOR][H.BOUNDARY])||t.isTrue(this._matrix[H.BOUNDARY][H.INTERIOR])||t.isTrue(this._matrix[H.BOUNDARY][H.BOUNDARY]))&&this._matrix[H.INTERIOR][H.EXTERIOR]===Lt.FALSE&&this._matrix[H.BOUNDARY][H.EXTERIOR]===Lt.FALSE}},{key:"set",value:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this._matrix[n][i]=Lt.toDimensionValue(t.charAt(e))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2];this._matrix[r][s]=a}}},{key:"isContains",value:function(){return t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&this._matrix[H.EXTERIOR][H.INTERIOR]===Lt.FALSE&&this._matrix[H.EXTERIOR][H.BOUNDARY]===Lt.FALSE}},{key:"setAtLeast",value:function(){if(1===arguments.length)for(var t=arguments[0],e=0;e<t.length;e++){var n=Math.trunc(e/3),i=e%3;this.setAtLeast(n,i,Lt.toDimensionValue(t.charAt(e)))}else if(3===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2];this._matrix[r][s]<a&&(this._matrix[r][s]=a)}}},{key:"setAtLeastIfValid",value:function(t,e,n){t>=0&&e>=0&&this.setAtLeast(t,e,n)}},{key:"isWithin",value:function(){return t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&this._matrix[H.INTERIOR][H.EXTERIOR]===Lt.FALSE&&this._matrix[H.BOUNDARY][H.EXTERIOR]===Lt.FALSE}},{key:"isTouches",value:function(e,n){return e>n?this.isTouches(n,e):(e===Lt.A&&n===Lt.A||e===Lt.L&&n===Lt.L||e===Lt.L&&n===Lt.A||e===Lt.P&&n===Lt.A||e===Lt.P&&n===Lt.L)&&(this._matrix[H.INTERIOR][H.INTERIOR]===Lt.FALSE&&(t.isTrue(this._matrix[H.INTERIOR][H.BOUNDARY])||t.isTrue(this._matrix[H.BOUNDARY][H.INTERIOR])||t.isTrue(this._matrix[H.BOUNDARY][H.BOUNDARY])))}},{key:"isOverlaps",value:function(e,n){return e===Lt.P&&n===Lt.P||e===Lt.A&&n===Lt.A?t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&t.isTrue(this._matrix[H.INTERIOR][H.EXTERIOR])&&t.isTrue(this._matrix[H.EXTERIOR][H.INTERIOR]):e===Lt.L&&n===Lt.L&&(1===this._matrix[H.INTERIOR][H.INTERIOR]&&t.isTrue(this._matrix[H.INTERIOR][H.EXTERIOR])&&t.isTrue(this._matrix[H.EXTERIOR][H.INTERIOR]))}},{key:"isEquals",value:function(e,n){return e===n&&(t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&this._matrix[H.INTERIOR][H.EXTERIOR]===Lt.FALSE&&this._matrix[H.BOUNDARY][H.EXTERIOR]===Lt.FALSE&&this._matrix[H.EXTERIOR][H.INTERIOR]===Lt.FALSE&&this._matrix[H.EXTERIOR][H.BOUNDARY]===Lt.FALSE)}},{key:"toString",value:function(){for(var t=new Jt("123456789"),e=0;e<3;e++)for(var n=0;n<3;n++)t.setCharAt(3*e+n,Lt.toDimensionSymbol(this._matrix[e][n]));return t.toString()}},{key:"setAll",value:function(t){for(var e=0;e<3;e++)for(var n=0;n<3;n++)this._matrix[e][n]=t}},{key:"get",value:function(t,e){return this._matrix[t][e]}},{key:"transpose",value:function(){var t=this._matrix[1][0];return this._matrix[1][0]=this._matrix[0][1],this._matrix[0][1]=t,t=this._matrix[2][0],this._matrix[2][0]=this._matrix[0][2],this._matrix[0][2]=t,t=this._matrix[2][1],this._matrix[2][1]=this._matrix[1][2],this._matrix[1][2]=t,this}},{key:"matches",value:function(e){if(9!==e.length)throw new m("Should be length 9: "+e);for(var n=0;n<3;n++)for(var i=0;i<3;i++)if(!t.matches(this._matrix[n][i],e.charAt(3*n+i)))return!1;return!0}},{key:"add",value:function(t){for(var e=0;e<3;e++)for(var n=0;n<3;n++)this.setAtLeast(e,n,t.get(e,n))}},{key:"isDisjoint",value:function(){return this._matrix[H.INTERIOR][H.INTERIOR]===Lt.FALSE&&this._matrix[H.INTERIOR][H.BOUNDARY]===Lt.FALSE&&this._matrix[H.BOUNDARY][H.INTERIOR]===Lt.FALSE&&this._matrix[H.BOUNDARY][H.BOUNDARY]===Lt.FALSE}},{key:"isCrosses",value:function(e,n){return e===Lt.P&&n===Lt.L||e===Lt.P&&n===Lt.A||e===Lt.L&&n===Lt.A?t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&t.isTrue(this._matrix[H.INTERIOR][H.EXTERIOR]):e===Lt.L&&n===Lt.P||e===Lt.A&&n===Lt.P||e===Lt.A&&n===Lt.L?t.isTrue(this._matrix[H.INTERIOR][H.INTERIOR])&&t.isTrue(this._matrix[H.EXTERIOR][H.INTERIOR]):e===Lt.L&&n===Lt.L&&0===this._matrix[H.INTERIOR][H.INTERIOR]}},{key:"interfaces_",get:function(){return[I]}}],[{key:"constructor_",value:function(){if(this._matrix=null,0===arguments.length)this._matrix=Array(3).fill().map((function(){return Array(3)})),this.setAll(Lt.FALSE);else if(1===arguments.length)if("string"==typeof arguments[0]){var e=arguments[0];t.constructor_.call(this),this.set(e)}else if(arguments[0]instanceof t){var n=arguments[0];t.constructor_.call(this),this._matrix[H.INTERIOR][H.INTERIOR]=n._matrix[H.INTERIOR][H.INTERIOR],this._matrix[H.INTERIOR][H.BOUNDARY]=n._matrix[H.INTERIOR][H.BOUNDARY],this._matrix[H.INTERIOR][H.EXTERIOR]=n._matrix[H.INTERIOR][H.EXTERIOR],this._matrix[H.BOUNDARY][H.INTERIOR]=n._matrix[H.BOUNDARY][H.INTERIOR],this._matrix[H.BOUNDARY][H.BOUNDARY]=n._matrix[H.BOUNDARY][H.BOUNDARY],this._matrix[H.BOUNDARY][H.EXTERIOR]=n._matrix[H.BOUNDARY][H.EXTERIOR],this._matrix[H.EXTERIOR][H.INTERIOR]=n._matrix[H.EXTERIOR][H.INTERIOR],this._matrix[H.EXTERIOR][H.BOUNDARY]=n._matrix[H.EXTERIOR][H.BOUNDARY],this._matrix[H.EXTERIOR][H.EXTERIOR]=n._matrix[H.EXTERIOR][H.EXTERIOR]}}},{key:"matches",value:function(){if(Number.isInteger(arguments[0])&&"string"==typeof arguments[1]){var e=arguments[0],n=arguments[1];return n===Lt.SYM_DONTCARE||(n===Lt.SYM_TRUE&&(e>=0||e===Lt.TRUE)||(n===Lt.SYM_FALSE&&e===Lt.FALSE||(n===Lt.SYM_P&&e===Lt.P||(n===Lt.SYM_L&&e===Lt.L||n===Lt.SYM_A&&e===Lt.A))))}if("string"==typeof arguments[0]&&"string"==typeof arguments[1]){var i=arguments[1];return new t(arguments[0]).matches(i)}}},{key:"isTrue",value:function(t){return t>=0||t===Lt.TRUE}}])}(),ti=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"size",value:function(){return this._size}},{key:"addAll",value:function(t){return null===t||0===t.length?null:(this.ensureCapacity(this._size+t.length),mt.arraycopy(t,0,this._data,this._size,t.length),void(this._size+=t.length))}},{key:"ensureCapacity",value:function(t){if(t<=this._data.length)return null;var e=Math.max(t,2*this._data.length);this._data=At.copyOf(this._data,e)}},{key:"toArray",value:function(){var t=new Array(this._size).fill(null);return mt.arraycopy(this._data,0,t,0,this._size),t}},{key:"add",value:function(t){this.ensureCapacity(this._size+1),this._data[this._size]=t,++this._size}}],[{key:"constructor_",value:function(){if(this._data=null,this._size=0,0===arguments.length)t.constructor_.call(this,10);else if(1===arguments.length){var e=arguments[0];this._data=new Array(e).fill(null)}}}])}(),ei=function(){function t(){n(this,t)}return s(t,[{key:"getChainStartIndices",value:function(t){var e=0,n=new ti(Math.trunc(t.length/2));n.add(e);do{var i=this.findChainEnd(t,e);n.add(i),e=i}while(e<t.length-1);return n.toArray()}},{key:"findChainEnd",value:function(t,e){for(var n=je.quadrant(t[e],t[e+1]),i=e+1;i<t.length;){if(je.quadrant(t[i-1],t[i])!==n)break;i++}return i-1}},{key:"OLDgetChainStartIndices",value:function(e){var n=0,i=new yt;i.add(n);do{var r=this.findChainEnd(e,n);i.add(r),n=r}while(n<e.length-1);return t.toIntArray(i)}}],[{key:"toIntArray",value:function(t){for(var e=new Array(t.size()).fill(null),n=0;n<e.length;n++)e[n]=t.get(n).intValue();return e}}])}(),ni=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"getCoordinates",value:function(){return this.pts}},{key:"getMaxX",value:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return e>n?e:n}},{key:"getMinX",value:function(t){var e=this.pts[this.startIndex[t]].x,n=this.pts[this.startIndex[t+1]].x;return e<n?e:n}},{key:"computeIntersectsForChain",value:function(){if(4===arguments.length){var t=arguments[0],e=arguments[1],n=arguments[2],i=arguments[3];this.computeIntersectsForChain(this.startIndex[t],this.startIndex[t+1],e,e.startIndex[n],e.startIndex[n+1],i)}else if(6===arguments.length){var r=arguments[0],s=arguments[1],a=arguments[2],o=arguments[3],u=arguments[4],l=arguments[5];if(s-r==1&&u-o==1)return l.addIntersections(this.e,r,a.e,o),null;if(!this.overlaps(r,s,a,o,u))return null;var h=Math.trunc((r+s)/2),c=Math.trunc((o+u)/2);r<h&&(o<c&&this.computeIntersectsForChain(r,h,a,o,c,l),c<u&&this.computeIntersectsForChain(r,h,a,c,u,l)),h<s&&(o<c&&this.computeIntersectsForChain(h,s,a,o,c,l),c<u&&this.computeIntersectsForChain(h,s,a,c,u,l))}}},{key:"overlaps",value:function(t,e,n,i,r){return U.intersects(this.pts[t],this.pts[e],n.pts[i],n.pts[r])}},{key:"getStartIndexes",value:function(){return this.startIndex}},{key:"computeIntersects",value:function(t,e){for(var n=0;n<this.startIndex.length-1;n++)for(var i=0;i<t.startIndex.length-1;i++)this.computeIntersectsForChain(n,t,i,e)}}],[{key:"constructor_",value:function(){this.e=null,this.pts=null,this.startIndex=null;var t=arguments[0];this.e=t,this.pts=t.getCoordinates();var e=new ei;this.startIndex=e.getChainStartIndices(this.pts)}}])}(),ii=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"getDepth",value:function(t,e){return this._depth[t][e]}},{key:"setDepth",value:function(t,e,n){this._depth[t][e]=n}},{key:"isNull",value:function(){if(0===arguments.length){for(var e=0;e<2;e++)for(var n=0;n<3;n++)if(this._depth[e][n]!==t.NULL_VALUE)return!1;return!0}if(1===arguments.length){var i=arguments[0];return this._depth[i][1]===t.NULL_VALUE}if(2===arguments.length){var r=arguments[0],s=arguments[1];return this._depth[r][s]===t.NULL_VALUE}}},{key:"normalize",value:function(){for(var t=0;t<2;t++)if(!this.isNull(t)){var e=this._depth[t][1];this._depth[t][2]<e&&(e=this._depth[t][2]),e<0&&(e=0);for(var n=1;n<3;n++){var i=0;this._depth[t][n]>e&&(i=1),this._depth[t][n]=i}}}},{key:"getDelta",value:function(t){return this._depth[t][$.RIGHT]-this._depth[t][$.LEFT]}},{key:"getLocation",value:function(t,e){return this._depth[t][e]<=0?H.EXTERIOR:H.INTERIOR}},{key:"toString",value:function(){return"A: "+this._depth[0][1]+","+this._depth[0][2]+" B: "+this._depth[1][1]+","+this._depth[1][2]}},{key:"add",value:function(){if(1===arguments.length)for(var e=arguments[0],n=0;n<2;n++)for(var i=1;i<3;i++){var r=e.getLocation(n,i);r!==H.EXTERIOR&&r!==H.INTERIOR||(this.isNull(n,i)?this._depth[n][i]=t.depthAtLocation(r):this._depth[n][i]+=t.depthAtLocation(r))}else if(3===arguments.length){var s=arguments[0],a=arguments[1];arguments[2]===H.INTERIOR&&this._depth[s][a]++}}}],[{key:"constructor_",value:function(){this._depth=Array(2).fill().map((function(){return Array(3)}));for(var e=0;e<2;e++)for(var n=0;n<3;n++)this._depth[e][n]=t.NULL_VALUE}},{key:"depthAtLocation",value:function(e){return e===H.EXTERIOR?0:e===H.INTERIOR?1:t.NULL_VALUE}}])}();ii.NULL_VALUE=-1;var ri=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"getDepth",value:function(){return this._depth}},{key:"getCollapsedEdge",value:function(){var t=new Array(2).fill(null);return t[0]=this.pts[0],t[1]=this.pts[1],new i(t,Ae.toLineLabel(this._label))}},{key:"isIsolated",value:function(){return this._isIsolated}},{key:"getCoordinates",value:function(){return this.pts}},{key:"setIsolated",value:function(t){this._isIsolated=t}},{key:"setName",value:function(t){this._name=t}},{key:"equals",value:function(t){if(!(t instanceof i))return!1;var e=t;if(this.pts.length!==e.pts.length)return!1;for(var n=!0,r=!0,s=this.pts.length,a=0;a<this.pts.length;a++)if(this.pts[a].equals2D(e.pts[a])||(n=!1),this.pts[a].equals2D(e.pts[--s])||(r=!1),!n&&!r)return!1;return!0}},{key:"getCoordinate",value:function(){if(0===arguments.length)return this.pts.length>0?this.pts[0]:null;if(1===arguments.length){var t=arguments[0];return this.pts[t]}}},{key:"print",value:function(t){t.print("edge "+this._name+": "),t.print("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.print(","),t.print(this.pts[e].x+" "+this.pts[e].y);t.print(")  "+this._label+" "+this._depthDelta)}},{key:"computeIM",value:function(t){i.updateIM(this._label,t)}},{key:"isCollapsed",value:function(){return!!this._label.isArea()&&(3===this.pts.length&&!!this.pts[0].equals(this.pts[2]))}},{key:"isClosed",value:function(){return this.pts[0].equals(this.pts[this.pts.length-1])}},{key:"getMaximumSegmentIndex",value:function(){return this.pts.length-1}},{key:"getDepthDelta",value:function(){return this._depthDelta}},{key:"getNumPoints",value:function(){return this.pts.length}},{key:"printReverse",value:function(t){t.print("edge "+this._name+": ");for(var e=this.pts.length-1;e>=0;e--)t.print(this.pts[e]+" ");t.println("")}},{key:"getMonotoneChainEdge",value:function(){return null===this._mce&&(this._mce=new ni(this)),this._mce}},{key:"getEnvelope",value:function(){if(null===this._env){this._env=new U;for(var t=0;t<this.pts.length;t++)this._env.expandToInclude(this.pts[t])}return this._env}},{key:"addIntersection",value:function(t,e,n,i){var r=new X(t.getIntersection(i)),s=e,a=t.getEdgeDistance(n,i),o=s+1;if(o<this.pts.length){var u=this.pts[o];r.equals2D(u)&&(s=o,a=0)}this.eiList.add(r,s,a)}},{key:"toString",value:function(){var t=new Jt;t.append("edge "+this._name+": "),t.append("LINESTRING (");for(var e=0;e<this.pts.length;e++)e>0&&t.append(","),t.append(this.pts[e].x+" "+this.pts[e].y);return t.append(")  "+this._label+" "+this._depthDelta),t.toString()}},{key:"isPointwiseEqual",value:function(t){if(this.pts.length!==t.pts.length)return!1;for(var e=0;e<this.pts.length;e++)if(!this.pts[e].equals2D(t.pts[e]))return!1;return!0}},{key:"setDepthDelta",value:function(t){this._depthDelta=t}},{key:"getEdgeIntersectionList",value:function(){return this.eiList}},{key:"addIntersections",value:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++)this.addIntersection(t,e,n,i)}}],[{key:"constructor_",value:function(){if(this.pts=null,this._env=null,this.eiList=new Qn(this),this._name=null,this._mce=null,this._isIsolated=!0,this._depth=new ii,this._depthDelta=0,1===arguments.length){var t=arguments[0];i.constructor_.call(this,t,null)}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this.pts=e,this._label=n}}},{key:"updateIM",value:function(){if(!(2===arguments.length&&arguments[1]instanceof $n&&arguments[0]instanceof Ae))return f(i,"updateIM",this).apply(this,arguments);var t=arguments[0],e=arguments[1];e.setAtLeastIfValid(t.getLocation(0,$.ON),t.getLocation(1,$.ON),1),t.isArea()&&(e.setAtLeastIfValid(t.getLocation(0,$.LEFT),t.getLocation(1,$.LEFT),2),e.setAtLeastIfValid(t.getLocation(0,$.RIGHT),t.getLocation(1,$.RIGHT),2))}}])}(Ge),si=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"setWorkingPrecisionModel",value:function(t){this._workingPrecisionModel=t}},{key:"insertUniqueEdge",value:function(e){var n=this._edgeList.findEqualEdge(e);if(null!==n){var i=n.getLabel(),r=e.getLabel();n.isPointwiseEqual(e)||(r=new Ae(e.getLabel())).flip(),i.merge(r);var s=t.depthDelta(r),a=n.getDepthDelta()+s;n.setDepthDelta(a)}else this._edgeList.add(e),e.setDepthDelta(t.depthDelta(e.getLabel()))}},{key:"buildSubgraphs",value:function(t,e){for(var n=new yt,i=t.iterator();i.hasNext();){var r=i.next(),s=r.getRightmostCoordinate(),a=new Pn(n).getDepth(s);r.computeDepth(a),r.findResultEdges(),n.add(r),e.add(r.getDirectedEdges(),r.getNodes())}}},{key:"createSubgraphs",value:function(t){for(var e=new yt,n=t.getNodes().iterator();n.hasNext();){var i=n.next();if(!i.isVisited()){var r=new _t;r.create(i),e.add(r)}}return an.sort(e,an.reverseOrder()),e}},{key:"createEmptyResultGeometry",value:function(){return this._geomFact.createPolygon()}},{key:"getNoder",value:function(t){if(null!==this._workingNoder)return this._workingNoder;var e=new Cn,n=new we;return n.setPrecisionModel(t),e.setSegmentIntersector(new Kn(n)),e}},{key:"buffer",value:function(t,e){var n=this._workingPrecisionModel;null===n&&(n=t.getPrecisionModel()),this._geomFact=t.getFactory();var i=new An(n,this._bufParams),r=new Yn(t,e,i).getCurves();if(r.size()<=0)return this.createEmptyResultGeometry();this.computeNodedEdges(r,n),this._graph=new Qe(new Hn),this._graph.addEdges(this._edgeList.getEdges());var s=this.createSubgraphs(this._graph),a=new $e(this._geomFact);this.buildSubgraphs(s,a);var o=a.getPolygons();return o.size()<=0?this.createEmptyResultGeometry():this._geomFact.buildGeometry(o)}},{key:"computeNodedEdges",value:function(t,e){var n=this.getNoder(e);n.computeNodes(t);for(var i=n.getNodedSubstrings().iterator();i.hasNext();){var r=i.next(),s=r.getCoordinates();if(2!==s.length||!s[0].equals2D(s[1])){var a=r.getData(),o=new ri(r.getCoordinates(),new Ae(a));this.insertUniqueEdge(o)}}}},{key:"setNoder",value:function(t){this._workingNoder=t}}],[{key:"constructor_",value:function(){this._bufParams=null,this._workingPrecisionModel=null,this._workingNoder=null,this._geomFact=null,this._graph=null,this._edgeList=new jn;var t=arguments[0];this._bufParams=t}},{key:"depthDelta",value:function(t){var e=t.getLocation(0,$.LEFT),n=t.getLocation(0,$.RIGHT);return e===H.INTERIOR&&n===H.EXTERIOR?1:e===H.EXTERIOR&&n===H.INTERIOR?-1:0}},{key:"convertSegStrings",value:function(t){for(var e=new ae,n=new yt;t.hasNext();){var i=t.next(),r=e.createLineString(i.getCoordinates());n.add(r)}return e.buildGeometry(n)}}])}(),ai=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"rescale",value:function(){if(rt(arguments[0],Z))for(var t=arguments[0].iterator();t.hasNext();){var e=t.next();this.rescale(e.getCoordinates())}else if(arguments[0]instanceof Array){for(var n=arguments[0],i=0;i<n.length;i++)n[i].x=n[i].x/this._scaleFactor+this._offsetX,n[i].y=n[i].y/this._scaleFactor+this._offsetY;2===n.length&&n[0].equals2D(n[1])&&mt.out.println(n)}}},{key:"scale",value:function(){if(rt(arguments[0],Z)){for(var t=arguments[0],e=new yt(t.size()),n=t.iterator();n.hasNext();){var i=n.next();e.add(new xn(this.scale(i.getCoordinates()),i.getData()))}return e}if(arguments[0]instanceof Array){for(var r=arguments[0],s=new Array(r.length).fill(null),a=0;a<r.length;a++)s[a]=new X(Math.round((r[a].x-this._offsetX)*this._scaleFactor),Math.round((r[a].y-this._offsetY)*this._scaleFactor),r[a].getZ());return jt.removeRepeatedPoints(s)}}},{key:"isIntegerPrecision",value:function(){return 1===this._scaleFactor}},{key:"getNodedSubstrings",value:function(){var t=this._noder.getNodedSubstrings();return this._isScaled&&this.rescale(t),t}},{key:"computeNodes",value:function(t){var e=t;this._isScaled&&(e=this.scale(t)),this._noder.computeNodes(e)}},{key:"interfaces_",get:function(){return[Sn]}}],[{key:"constructor_",value:function(){if(this._noder=null,this._scaleFactor=null,this._offsetX=null,this._offsetY=null,this._isScaled=!1,2===arguments.length){var e=arguments[0],n=arguments[1];t.constructor_.call(this,e,n,0,0)}else if(4===arguments.length){var i=arguments[0],r=arguments[1];this._noder=i,this._scaleFactor=r,this._isScaled=!this.isIntegerPrecision()}}}])}(),oi=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"checkEndPtVertexIntersections",value:function(){if(0===arguments.length)for(var t=this._segStrings.iterator();t.hasNext();){var e=t.next().getCoordinates();this.checkEndPtVertexIntersections(e[0],this._segStrings),this.checkEndPtVertexIntersections(e[e.length-1],this._segStrings)}else if(2===arguments.length)for(var n=arguments[0],i=arguments[1].iterator();i.hasNext();)for(var r=i.next().getCoordinates(),s=1;s<r.length-1;s++)if(r[s].equals(n))throw new D("found endpt/interior pt intersection at index "+s+" :pt "+n)}},{key:"checkInteriorIntersections",value:function(){if(0===arguments.length)for(var t=this._segStrings.iterator();t.hasNext();)for(var e=t.next(),n=this._segStrings.iterator();n.hasNext();){var i=n.next();this.checkInteriorIntersections(e,i)}else if(2===arguments.length)for(var r=arguments[0],s=arguments[1],a=r.getCoordinates(),o=s.getCoordinates(),u=0;u<a.length-1;u++)for(var l=0;l<o.length-1;l++)this.checkInteriorIntersections(r,u,s,l);else if(4===arguments.length){var h=arguments[0],c=arguments[1],f=arguments[2],g=arguments[3];if(h===f&&c===g)return null;var v=h.getCoordinates()[c],y=h.getCoordinates()[c+1],d=f.getCoordinates()[g],_=f.getCoordinates()[g+1];if(this._li.computeIntersection(v,y,d,_),this._li.hasIntersection()&&(this._li.isProper()||this.hasInteriorIntersection(this._li,v,y)||this.hasInteriorIntersection(this._li,d,_)))throw new D("found non-noded intersection at "+v+"-"+y+" and "+d+"-"+_)}}},{key:"checkValid",value:function(){this.checkEndPtVertexIntersections(),this.checkInteriorIntersections(),this.checkCollapses()}},{key:"checkCollapses",value:function(){if(0===arguments.length)for(var t=this._segStrings.iterator();t.hasNext();){var e=t.next();this.checkCollapses(e)}else if(1===arguments.length)for(var n=arguments[0].getCoordinates(),i=0;i<n.length-2;i++)this.checkCollapse(n[i],n[i+1],n[i+2])}},{key:"hasInteriorIntersection",value:function(t,e,n){for(var i=0;i<t.getIntersectionNum();i++){var r=t.getIntersection(i);if(!r.equals(e)&&!r.equals(n))return!0}return!1}},{key:"checkCollapse",value:function(e,n,i){if(e.equals(i))throw new D("found non-noded collapse at "+t.fact.createLineString([e,n,i]))}}],[{key:"constructor_",value:function(){this._li=new we,this._segStrings=null;var t=arguments[0];this._segStrings=t}}])}();oi.fact=new ae;var ui=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"intersectsScaled",value:function(t,e){var n=Math.min(t.x,e.x),i=Math.max(t.x,e.x),r=Math.min(t.y,e.y),s=Math.max(t.y,e.y),a=this._maxx<n||this._minx>i||this._maxy<r||this._miny>s;if(a)return!1;var o=this.intersectsToleranceSquare(t,e);return G.isTrue(!(a&&o),"Found bad envelope test"),o}},{key:"initCorners",value:function(t){var e=.5;this._minx=t.x-e,this._maxx=t.x+e,this._miny=t.y-e,this._maxy=t.y+e,this._corner[0]=new X(this._maxx,this._maxy),this._corner[1]=new X(this._minx,this._maxy),this._corner[2]=new X(this._minx,this._miny),this._corner[3]=new X(this._maxx,this._miny)}},{key:"intersects",value:function(t,e){return 1===this._scaleFactor?this.intersectsScaled(t,e):(this.copyScaled(t,this._p0Scaled),this.copyScaled(e,this._p1Scaled),this.intersectsScaled(this._p0Scaled,this._p1Scaled))}},{key:"scale",value:function(t){return Math.round(t*this._scaleFactor)}},{key:"getCoordinate",value:function(){return this._originalPt}},{key:"copyScaled",value:function(t,e){e.x=this.scale(t.x),e.y=this.scale(t.y)}},{key:"getSafeEnvelope",value:function(){if(null===this._safeEnv){var e=t.SAFE_ENV_EXPANSION_FACTOR/this._scaleFactor;this._safeEnv=new U(this._originalPt.x-e,this._originalPt.x+e,this._originalPt.y-e,this._originalPt.y+e)}return this._safeEnv}},{key:"intersectsPixelClosure",value:function(t,e){return this._li.computeIntersection(t,e,this._corner[0],this._corner[1]),!!this._li.hasIntersection()||(this._li.computeIntersection(t,e,this._corner[1],this._corner[2]),!!this._li.hasIntersection()||(this._li.computeIntersection(t,e,this._corner[2],this._corner[3]),!!this._li.hasIntersection()||(this._li.computeIntersection(t,e,this._corner[3],this._corner[0]),!!this._li.hasIntersection())))}},{key:"intersectsToleranceSquare",value:function(t,e){var n=!1,i=!1;return this._li.computeIntersection(t,e,this._corner[0],this._corner[1]),!!this._li.isProper()||(this._li.computeIntersection(t,e,this._corner[1],this._corner[2]),!!this._li.isProper()||(this._li.hasIntersection()&&(n=!0),this._li.computeIntersection(t,e,this._corner[2],this._corner[3]),!!this._li.isProper()||(this._li.hasIntersection()&&(i=!0),this._li.computeIntersection(t,e,this._corner[3],this._corner[0]),!!this._li.isProper()||(!(!n||!i)||(!!t.equals(this._pt)||!!e.equals(this._pt))))))}},{key:"addSnappedNode",value:function(t,e){var n=t.getCoordinate(e),i=t.getCoordinate(e+1);return!!this.intersects(n,i)&&(t.addIntersection(this.getCoordinate(),e),!0)}}],[{key:"constructor_",value:function(){this._li=null,this._pt=null,this._originalPt=null,this._ptScaled=null,this._p0Scaled=null,this._p1Scaled=null,this._scaleFactor=null,this._minx=null,this._maxx=null,this._miny=null,this._maxy=null,this._corner=new Array(4).fill(null),this._safeEnv=null;var t=arguments[0],e=arguments[1],n=arguments[2];if(this._originalPt=t,this._pt=t,this._scaleFactor=e,this._li=n,e<=0)throw new m("Scale factor must be non-zero");1!==e&&(this._pt=new X(this.scale(t.x),this.scale(t.y)),this._p0Scaled=new X,this._p1Scaled=new X),this.initCorners(this._pt)}}])}();ui.SAFE_ENV_EXPANSION_FACTOR=.75;var li=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"select",value:function(){if(1===arguments.length);else if(2===arguments.length){var t=arguments[1];arguments[0].getLineSegment(t,this.selectedSegment),this.select(this.selectedSegment)}}}],[{key:"constructor_",value:function(){this.selectedSegment=new In}}])}(),hi=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"snap",value:function(){if(1===arguments.length){var t=arguments[0];return this.snap(t,null,-1)}if(3===arguments.length){var e=arguments[0],i=arguments[1],r=arguments[2],a=e.getSafeEnvelope(),o=new ci(e,i,r);return this._index.query(a,new(function(){return s((function t(){n(this,t)}),[{key:"interfaces_",get:function(){return[ln]}},{key:"visitItem",value:function(t){t.select(a,o)}}])}())),o.isNodeAdded()}}}],[{key:"constructor_",value:function(){this._index=null;var t=arguments[0];this._index=t}}])}(),ci=function(t){function i(){var t;return n(this,i),t=e(this,i),i.constructor_.apply(t,arguments),t}return l(i,t),s(i,[{key:"isNodeAdded",value:function(){return this._isNodeAdded}},{key:"select",value:function(){if(!(2===arguments.length&&Number.isInteger(arguments[1])&&arguments[0]instanceof Nn))return f(i,"select",this,1).apply(this,arguments);var t=arguments[1],e=arguments[0].getContext();if(this._parentEdge===e&&(t===this._hotPixelVertexIndex||t+1===this._hotPixelVertexIndex))return null;this._isNodeAdded|=this._hotPixel.addSnappedNode(e,t)}}],[{key:"constructor_",value:function(){this._hotPixel=null,this._parentEdge=null,this._hotPixelVertexIndex=null,this._isNodeAdded=!1;var t=arguments[0],e=arguments[1],n=arguments[2];this._hotPixel=t,this._parentEdge=e,this._hotPixelVertexIndex=n}}])}(li);hi.HotPixelSnapAction=ci;var fi=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"processIntersections",value:function(t,e,n,i){if(t===n&&e===i)return null;var r=t.getCoordinates()[e],s=t.getCoordinates()[e+1],a=n.getCoordinates()[i],o=n.getCoordinates()[i+1];if(this._li.computeIntersection(r,s,a,o),this._li.hasIntersection()&&this._li.isInteriorIntersection()){for(var u=0;u<this._li.getIntersectionNum();u++)this._interiorIntersections.add(this._li.getIntersection(u));t.addIntersections(this._li,e,0),n.addIntersections(this._li,i,1)}}},{key:"isDone",value:function(){return!1}},{key:"getInteriorIntersections",value:function(){return this._interiorIntersections}},{key:"interfaces_",get:function(){return[Wn]}}],[{key:"constructor_",value:function(){this._li=null,this._interiorIntersections=null;var t=arguments[0];this._li=t,this._interiorIntersections=new yt}}])}(),gi=function(){return s((function t(){n(this,t),t.constructor_.apply(this,arguments)}),[{key:"checkCorrectness",value:function(t){var e=xn.getNodedSubstrings(t),n=new oi(e);try{n.checkValid()}catch(t){if(!(t instanceof p))throw t;t.printStackTrace()}}},{key:"getNodedSubstrings",value:function(){return xn.getNodedSubstrings(this._nodedSegStrings)}},{key:"snapRound",value:function(t,e){var n=this.findInteriorIntersections(t,e);this.computeIntersectionSnaps(n),this.computeVertexSnaps(t)}},{key:"findInteriorIntersections",value:function(t,e){var n=new fi(e);return this._noder.setSegmentIntersector(n),this._noder.computeNodes(t),n.getInteriorIntersections()}},{key:"computeVertexSnaps",value:function(){if(rt(arguments[0],Z))for(var t=arguments[0].iterator();t.hasNext();){var e=t.next();this.computeVertexSnaps(e)}else if(arguments[0]instanceof xn)for(var n=arguments[0],i=n.getCoordinates(),r=0;r<i.length;r++){var s=new ui(i[r],this._scaleFactor,this._li);this._pointSnapper.snap(s,n,r)&&n.addIntersection(i[r],r)}}},{key:"computeNodes",value:function(t){this._nodedSegStrings=t,this._noder=new Cn,this._pointSnapper=new hi(this._noder.getIndex()),this.snapRound(t,this._li)}},{key:"computeIntersectionSnaps",value:function(t){for(var e=t.iterator();e.hasNext();){var n=e.next(),i=new ui(n,this._scaleFactor,this._li);this._pointSnapper.snap(i)}}},{key:"interfaces_",get:function(){return[Sn]}}],[{key:"constructor_",value:function(){this._pm=null,this._li=null,this._scaleFactor=null,this._noder=null,this._pointSnapper=null,this._nodedSegStrings=null;var t=arguments[0];this._pm=t,this._li=new we,this._li.setPrecisionModel(t),this._scaleFactor=t.getScale()}}])}(),vi=function(){function t(){n(this,t),t.constructor_.apply(this,arguments)}return s(t,[{key:"bufferFixedPrecision",value:function(t){var e=new ai(new gi(new ie(1)),t.getScale()),n=new si(this._bufParams);n.setWorkingPrecisionModel(t),n.setNoder(e),this._resultGeometry=n.buffer(this._argGeom,this._distance)}},{key:"bufferReducedPrecision",value:function(){if(0===arguments.length){for(var e=t.MAX_PRECISION_DIGITS;e>=0;e--){try{this.bufferReducedPrecision(e)}catch(t){if(!(t instanceof gt))throw t;this._saveException=t}if(null!==this._resultGeometry)return null}throw this._saveException}if(1===arguments.length){var n=arguments[0],i=t.precisionScaleFactor(this._argGeom,this._distance,n),r=new ie(i);this.bufferFixedPrecision(r)}}},{key:"computeGeometry",value:function(){if(this.bufferOriginalPrecision(),null!==this._resultGeometry)return null;var t=this._argGeom.getFactory().getPrecisionModel();t.getType()===ie.FIXED?this.bufferFixedPrecision(t):this.bufferReducedPrecision()}},{key:"setQuadrantSegments",value:function(t){this._bufParams.setQuadrantSegments(t)}},{key:"bufferOriginalPrecision",value:function(){try{var t=new si(this._bufParams);this._resultGeometry=t.buffer(this._argGeom,this._distance)}catch(t){if(!(t instanceof D))throw t;this._saveException=t}}},{key:"getResultGeometry",value:function(t){return this._distance=t,this.computeGeometry(),this._resultGeometry}},{key:"setEndCapStyle",value:function(t){this._bufParams.setEndCapStyle(t)}}],[{key:"constructor_",value:function(){if(this._argGeom=null,this._distance=null,this._bufParams=new _,this._resultGeometry=null,this._saveException=null,1===arguments.length){var t=arguments[0];this._argGeom=t}else if(2===arguments.length){var e=arguments[0],n=arguments[1];this._argGeom=e,this._bufParams=n}}},{key:"bufferOp",value:function(){if(2===arguments.length){var e=arguments[1];return new t(arguments[0]).getResultGeometry(e)}if(3===arguments.length){if(Number.isInteger(arguments[2])&&arguments[0]instanceof V&&"number"==typeof arguments[1]){var n=arguments[1],i=arguments[2],r=new t(arguments[0]);return r.setQuadrantSegments(i),r.getResultGeometry(n)}if(arguments[2]instanceof _&&arguments[0]instanceof V&&"number"==typeof arguments[1]){var s=arguments[1];return new t(arguments[0],arguments[2]).getResultGeometry(s)}}else if(4===arguments.length){var a=arguments[1],o=arguments[2],u=arguments[3],l=new t(arguments[0]);return l.setQuadrantSegments(o),l.setEndCapStyle(u),l.getResultGeometry(a)}}},{key:"precisionScaleFactor",value:function(t,e,n){var i=t.getEnvelopeInternal(),r=kt.max(Math.abs(i.getMaxX()),Math.abs(i.getMaxY()),Math.abs(i.getMinX()),Math.abs(i.getMinY()))+2*(e>0?e:0),s=n-Math.trunc(Math.log(r)/Math.log(10)+1);return Math.pow(10,s)}}])}();vi.CAP_ROUND=_.CAP_ROUND,vi.CAP_BUTT=_.CAP_FLAT,vi.CAP_FLAT=_.CAP_FLAT,vi.CAP_SQUARE=_.CAP_SQUARE,vi.MAX_PRECISION_DIGITS=12;var yi=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"],di=function(){return s((function t(e){n(this,t),this.geometryFactory=e||new ae}),[{key:"read",value:function(t){var e,n=(e="string"==typeof t?JSON.parse(t):t).type;if(!_i[n])throw new Error("Unknown GeoJSON type: "+e.type);return-1!==yi.indexOf(n)?_i[n].call(this,e.coordinates):"GeometryCollection"===n?_i[n].call(this,e.geometries):_i[n].call(this,e)}},{key:"write",value:function(t){var e=t.getGeometryType();if(!pi[e])throw new Error("Geometry is not supported");return pi[e].call(this,t)}}])}(),_i={Feature:function(t){var e={};for(var n in t)e[n]=t[n];if(t.geometry){var i=t.geometry.type;if(!_i[i])throw new Error("Unknown GeoJSON type: "+t.type);e.geometry=this.read(t.geometry)}return t.bbox&&(e.bbox=_i.bbox.call(this,t.bbox)),e},FeatureCollection:function(t){var e={};if(t.features){e.features=[];for(var n=0;n<t.features.length;++n)e.features.push(this.read(t.features[n]))}return t.bbox&&(e.bbox=this.parse.bbox.call(this,t.bbox)),e},coordinates:function(t){for(var e=[],n=0;n<t.length;++n){var r=t[n];e.push(i(X,g(r)))}return e},bbox:function(t){return this.geometryFactory.createLinearRing([new X(t[0],t[1]),new X(t[2],t[1]),new X(t[2],t[3]),new X(t[0],t[3]),new X(t[0],t[1])])},Point:function(t){var e=i(X,g(t));return this.geometryFactory.createPoint(e)},MultiPoint:function(t){for(var e=[],n=0;n<t.length;++n)e.push(_i.Point.call(this,t[n]));return this.geometryFactory.createMultiPoint(e)},LineString:function(t){var e=_i.coordinates.call(this,t);return this.geometryFactory.createLineString(e)},MultiLineString:function(t){for(var e=[],n=0;n<t.length;++n)e.push(_i.LineString.call(this,t[n]));return this.geometryFactory.createMultiLineString(e)},Polygon:function(t){for(var e=_i.coordinates.call(this,t[0]),n=this.geometryFactory.createLinearRing(e),i=[],r=1;r<t.length;++r){var s=t[r],a=_i.coordinates.call(this,s),o=this.geometryFactory.createLinearRing(a);i.push(o)}return this.geometryFactory.createPolygon(n,i)},MultiPolygon:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(_i.Polygon.call(this,i))}return this.geometryFactory.createMultiPolygon(e)},GeometryCollection:function(t){for(var e=[],n=0;n<t.length;++n){var i=t[n];e.push(this.read(i))}return this.geometryFactory.createGeometryCollection(e)}},pi={coordinate:function(t){var e=[t.x,t.y];return t.z&&e.push(t.z),t.m&&e.push(t.m),e},Point:function(t){return{type:"Point",coordinates:pi.coordinate.call(this,t.getCoordinate())}},MultiPoint:function(t){for(var e=[],n=0;n<t._geometries.length;++n){var i=t._geometries[n],r=pi.Point.call(this,i);e.push(r.coordinates)}return{type:"MultiPoint",coordinates:e}},LineString:function(t){for(var e=[],n=t.getCoordinates(),i=0;i<n.length;++i){var r=n[i];e.push(pi.coordinate.call(this,r))}return{type:"LineString",coordinates:e}},MultiLineString:function(t){for(var e=[],n=0;n<t._geometries.length;++n){var i=t._geometries[n],r=pi.LineString.call(this,i);e.push(r.coordinates)}return{type:"MultiLineString",coordinates:e}},Polygon:function(t){var e=[],n=pi.LineString.call(this,t._shell);e.push(n.coordinates);for(var i=0;i<t._holes.length;++i){var r=t._holes[i],s=pi.LineString.call(this,r);e.push(s.coordinates)}return{type:"Polygon",coordinates:e}},MultiPolygon:function(t){for(var e=[],n=0;n<t._geometries.length;++n){var i=t._geometries[n],r=pi.Polygon.call(this,i);e.push(r.coordinates)}return{type:"MultiPolygon",coordinates:e}},GeometryCollection:function(t){for(var e=[],n=0;n<t._geometries.length;++n){var i=t._geometries[n],r=i.getGeometryType();e.push(pi[r].call(this,i))}return{type:"GeometryCollection",geometries:e}}};return{BufferOp:vi,GeoJSONReader:function(){return s((function t(e){n(this,t),this.parser=new di(e||new ae)}),[{key:"read",value:function(t){return this.parser.read(t)}}])}(),GeoJSONWriter:function(){return s((function t(){n(this,t),this.parser=new di(this.geometryFactory)}),[{key:"write",value:function(t){return this.parser.write(t)}}])}()}}));


},{}],34:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// index.js
var _helpers = require('@turf/helpers');
function coordEach(geojson, callback, excludeWrapCoord) {
  if (geojson === null) return;
  var j, k, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, coordIndex = 0, isGeometryCollection, type = geojson.type, isFeatureCollection = type === "FeatureCollection", isFeature = type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
  for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
      var multiFeatureIndex = 0;
      var geometryIndex = 0;
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;
      if (geometry === null) continue;
      coords = geometry.coordinates;
      var geomType = geometry.type;
      wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;
      switch (geomType) {
        case null:
          break;
        case "Point":
          if (callback(
            coords,
            coordIndex,
            featureIndex,
            multiFeatureIndex,
            geometryIndex
          ) === false)
            return false;
          coordIndex++;
          multiFeatureIndex++;
          break;
        case "LineString":
        case "MultiPoint":
          for (j = 0; j < coords.length; j++) {
            if (callback(
              coords[j],
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            ) === false)
              return false;
            coordIndex++;
            if (geomType === "MultiPoint") multiFeatureIndex++;
          }
          if (geomType === "LineString") multiFeatureIndex++;
          break;
        case "Polygon":
        case "MultiLineString":
          for (j = 0; j < coords.length; j++) {
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              if (callback(
                coords[j][k],
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false)
                return false;
              coordIndex++;
            }
            if (geomType === "MultiLineString") multiFeatureIndex++;
            if (geomType === "Polygon") geometryIndex++;
          }
          if (geomType === "Polygon") multiFeatureIndex++;
          break;
        case "MultiPolygon":
          for (j = 0; j < coords.length; j++) {
            geometryIndex = 0;
            for (k = 0; k < coords[j].length; k++) {
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                if (callback(
                  coords[j][k][l],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false)
                  return false;
                coordIndex++;
              }
              geometryIndex++;
            }
            multiFeatureIndex++;
          }
          break;
        case "GeometryCollection":
          for (j = 0; j < geometry.geometries.length; j++)
            if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false)
              return false;
          break;
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
  }
}
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
  var previousValue = initialValue;
  coordEach(
    geojson,
    function(currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
      if (coordIndex === 0 && initialValue === void 0)
        previousValue = currentCoord;
      else
        previousValue = callback(
          previousValue,
          currentCoord,
          coordIndex,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    },
    excludeWrapCoord
  );
  return previousValue;
}
function propEach(geojson, callback) {
  var i;
  switch (geojson.type) {
    case "FeatureCollection":
      for (i = 0; i < geojson.features.length; i++) {
        if (callback(geojson.features[i].properties, i) === false) break;
      }
      break;
    case "Feature":
      callback(geojson.properties, 0);
      break;
  }
}
function propReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  propEach(geojson, function(currentProperties, featureIndex) {
    if (featureIndex === 0 && initialValue === void 0)
      previousValue = currentProperties;
    else
      previousValue = callback(previousValue, currentProperties, featureIndex);
  });
  return previousValue;
}
function featureEach(geojson, callback) {
  if (geojson.type === "Feature") {
    callback(geojson, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (callback(geojson.features[i], i) === false) break;
    }
  }
}
function featureReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  featureEach(geojson, function(currentFeature, featureIndex) {
    if (featureIndex === 0 && initialValue === void 0)
      previousValue = currentFeature;
    else previousValue = callback(previousValue, currentFeature, featureIndex);
  });
  return previousValue;
}
function coordAll(geojson) {
  var coords = [];
  coordEach(geojson, function(coord) {
    coords.push(coord);
  });
  return coords;
}
function geomEach(geojson, callback) {
  var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === "FeatureCollection", isFeature = geojson.type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
    featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
    featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
    featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
      if (geometry === null) {
        if (callback(
          null,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        ) === false)
          return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (callback(
            geometry,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          ) === false)
            return false;
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry.geometries.length; j++) {
            if (callback(
              geometry.geometries[j],
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            ) === false)
              return false;
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    featureIndex++;
  }
}
function geomReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  geomEach(
    geojson,
    function(currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
      if (featureIndex === 0 && initialValue === void 0)
        previousValue = currentGeometry;
      else
        previousValue = callback(
          previousValue,
          currentGeometry,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        );
    }
  );
  return previousValue;
}
function flattenEach(geojson, callback) {
  geomEach(geojson, function(geometry, featureIndex, properties, bbox, id) {
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (callback(
          _helpers.feature.call(void 0, geometry, properties, { bbox, id }),
          featureIndex,
          0
        ) === false)
          return false;
        return;
    }
    var geomType;
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }
    for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
      var coordinate = geometry.coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate
      };
      if (callback(_helpers.feature.call(void 0, geom, properties), featureIndex, multiFeatureIndex) === false)
        return false;
    }
  });
}
function flattenReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  flattenEach(
    geojson,
    function(currentFeature, featureIndex, multiFeatureIndex) {
      if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === void 0)
        previousValue = currentFeature;
      else
        previousValue = callback(
          previousValue,
          currentFeature,
          featureIndex,
          multiFeatureIndex
        );
    }
  );
  return previousValue;
}
function segmentEach(geojson, callback) {
  flattenEach(geojson, function(feature2, featureIndex, multiFeatureIndex) {
    var segmentIndex = 0;
    if (!feature2.geometry) return;
    var type = feature2.geometry.type;
    if (type === "Point" || type === "MultiPoint") return;
    var previousCoords;
    var previousFeatureIndex = 0;
    var previousMultiIndex = 0;
    var prevGeomIndex = 0;
    if (coordEach(
      feature2,
      function(currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
        if (previousCoords === void 0 || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
          previousCoords = currentCoord;
          previousFeatureIndex = featureIndex;
          previousMultiIndex = multiPartIndexCoord;
          prevGeomIndex = geometryIndex;
          segmentIndex = 0;
          return;
        }
        var currentSegment = _helpers.lineString.call(void 0, 
          [previousCoords, currentCoord],
          feature2.properties
        );
        if (callback(
          currentSegment,
          featureIndex,
          multiFeatureIndex,
          geometryIndex,
          segmentIndex
        ) === false)
          return false;
        segmentIndex++;
        previousCoords = currentCoord;
      }
    ) === false)
      return false;
  });
}
function segmentReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  var started = false;
  segmentEach(
    geojson,
    function(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
      if (started === false && initialValue === void 0)
        previousValue = currentSegment;
      else
        previousValue = callback(
          previousValue,
          currentSegment,
          featureIndex,
          multiFeatureIndex,
          geometryIndex,
          segmentIndex
        );
      started = true;
    }
  );
  return previousValue;
}
function lineEach(geojson, callback) {
  if (!geojson) throw new Error("geojson is required");
  flattenEach(geojson, function(feature2, featureIndex, multiFeatureIndex) {
    if (feature2.geometry === null) return;
    var type = feature2.geometry.type;
    var coords = feature2.geometry.coordinates;
    switch (type) {
      case "LineString":
        if (callback(feature2, featureIndex, multiFeatureIndex, 0, 0) === false)
          return false;
        break;
      case "Polygon":
        for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
          if (callback(
            _helpers.lineString.call(void 0, coords[geometryIndex], feature2.properties),
            featureIndex,
            multiFeatureIndex,
            geometryIndex
          ) === false)
            return false;
        }
        break;
    }
  });
}
function lineReduce(geojson, callback, initialValue) {
  var previousValue = initialValue;
  lineEach(
    geojson,
    function(currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
      if (featureIndex === 0 && initialValue === void 0)
        previousValue = currentLine;
      else
        previousValue = callback(
          previousValue,
          currentLine,
          featureIndex,
          multiFeatureIndex,
          geometryIndex
        );
    }
  );
  return previousValue;
}
function findSegment(geojson, options) {
  options = options || {};
  if (!_helpers.isObject.call(void 0, options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var segmentIndex = options.segmentIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
      if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
      return _helpers.lineString.call(void 0, 
        [coords[segmentIndex], coords[segmentIndex + 1]],
        properties,
        options
      );
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
      return _helpers.lineString.call(void 0, 
        [
          coords[geometryIndex][segmentIndex],
          coords[geometryIndex][segmentIndex + 1]
        ],
        properties,
        options
      );
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
      return _helpers.lineString.call(void 0, 
        [
          coords[multiFeatureIndex][segmentIndex],
          coords[multiFeatureIndex][segmentIndex + 1]
        ],
        properties,
        options
      );
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (segmentIndex < 0)
        segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
      return _helpers.lineString.call(void 0, 
        [
          coords[multiFeatureIndex][geometryIndex][segmentIndex],
          coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]
        ],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}
function findPoint(geojson, options) {
  options = options || {};
  if (!_helpers.isObject.call(void 0, options)) throw new Error("options is invalid");
  var featureIndex = options.featureIndex || 0;
  var multiFeatureIndex = options.multiFeatureIndex || 0;
  var geometryIndex = options.geometryIndex || 0;
  var coordIndex = options.coordIndex || 0;
  var properties = options.properties;
  var geometry;
  switch (geojson.type) {
    case "FeatureCollection":
      if (featureIndex < 0)
        featureIndex = geojson.features.length + featureIndex;
      properties = properties || geojson.features[featureIndex].properties;
      geometry = geojson.features[featureIndex].geometry;
      break;
    case "Feature":
      properties = properties || geojson.properties;
      geometry = geojson.geometry;
      break;
    case "Point":
    case "MultiPoint":
      return null;
    case "LineString":
    case "Polygon":
    case "MultiLineString":
    case "MultiPolygon":
      geometry = geojson;
      break;
    default:
      throw new Error("geojson is invalid");
  }
  if (geometry === null) return null;
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case "Point":
      return _helpers.point.call(void 0, coords, properties, options);
    case "MultiPoint":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      return _helpers.point.call(void 0, coords[multiFeatureIndex], properties, options);
    case "LineString":
      if (coordIndex < 0) coordIndex = coords.length + coordIndex;
      return _helpers.point.call(void 0, coords[coordIndex], properties, options);
    case "Polygon":
      if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
      if (coordIndex < 0)
        coordIndex = coords[geometryIndex].length + coordIndex;
      return _helpers.point.call(void 0, coords[geometryIndex][coordIndex], properties, options);
    case "MultiLineString":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (coordIndex < 0)
        coordIndex = coords[multiFeatureIndex].length + coordIndex;
      return _helpers.point.call(void 0, coords[multiFeatureIndex][coordIndex], properties, options);
    case "MultiPolygon":
      if (multiFeatureIndex < 0)
        multiFeatureIndex = coords.length + multiFeatureIndex;
      if (geometryIndex < 0)
        geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
      if (coordIndex < 0)
        coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
      return _helpers.point.call(void 0, 
        coords[multiFeatureIndex][geometryIndex][coordIndex],
        properties,
        options
      );
  }
  throw new Error("geojson is invalid");
}


















exports.coordAll = coordAll; exports.coordEach = coordEach; exports.coordReduce = coordReduce; exports.featureEach = featureEach; exports.featureReduce = featureReduce; exports.findPoint = findPoint; exports.findSegment = findSegment; exports.flattenEach = flattenEach; exports.flattenReduce = flattenReduce; exports.geomEach = geomEach; exports.geomReduce = geomReduce; exports.lineEach = lineEach; exports.lineReduce = lineReduce; exports.propEach = propEach; exports.propReduce = propReduce; exports.segmentEach = segmentEach; exports.segmentReduce = segmentReduce;

},{"@turf/helpers":32}],35:[function(require,module,exports){
'use strict';

var RBush = require('rbush');
var Queue = require('tinyqueue');
var pointInPolygon = require('point-in-polygon');
var orient = require('robust-predicates/umd/orient2d.min.js').orient2d;

// Fix for require issue in webpack https://github.com/mapbox/concaveman/issues/18
if (Queue.default) {
    Queue = Queue.default;
}

module.exports = concaveman;
module.exports.default = concaveman;

function concaveman(points, concavity, lengthThreshold) {
    // a relative measure of concavity; higher value means simpler hull
    concavity = Math.max(0, concavity === undefined ? 2 : concavity);

    // when a segment goes below this length threshold, it won't be drilled down further
    lengthThreshold = lengthThreshold || 0;

    // start with a convex hull of the points
    var hull = fastConvexHull(points);

    // index the points with an R-tree
    var tree = new RBush(16);
    tree.toBBox = function (a) {
        return {
            minX: a[0],
            minY: a[1],
            maxX: a[0],
            maxY: a[1]
        };
    };
    tree.compareMinX = function (a, b) { return a[0] - b[0]; };
    tree.compareMinY = function (a, b) { return a[1] - b[1]; };

    tree.load(points);

    // turn the convex hull into a linked list and populate the initial edge queue with the nodes
    var queue = [];
    for (var i = 0, last; i < hull.length; i++) {
        var p = hull[i];
        tree.remove(p);
        last = insertNode(p, last);
        queue.push(last);
    }

    // index the segments with an R-tree (for intersection checks)
    var segTree = new RBush(16);
    for (i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

    var sqConcavity = concavity * concavity;
    var sqLenThreshold = lengthThreshold * lengthThreshold;

    // process edges one by one
    while (queue.length) {
        var node = queue.shift();
        var a = node.p;
        var b = node.next.p;

        // skip the edge if it's already short enough
        var sqLen = getSqDist(a, b);
        if (sqLen < sqLenThreshold) continue;

        var maxSqLen = sqLen / sqConcavity;

        // find the best connection point for the current edge to flex inward to
        p = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqLen, segTree);

        // if we found a connection and it satisfies our concavity measure
        if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
            // connect the edge endpoints through this point and add 2 new edges to the queue
            queue.push(node);
            queue.push(insertNode(p, node));

            // update point and segment indexes
            tree.remove(p);
            segTree.remove(node);
            segTree.insert(updateBBox(node));
            segTree.insert(updateBBox(node.next));
        }
    }

    // convert the resulting hull linked list to an array of points
    node = last;
    var concave = [];
    do {
        concave.push(node.p);
        node = node.next;
    } while (node !== last);

    concave.push(node.p);

    return concave;
}

function findCandidate(tree, a, b, c, d, maxDist, segTree) {
    var queue = new Queue([], compareDist);
    var node = tree.data;

    // search through the point R-tree with a depth-first search using a priority queue
    // in the order of distance to the edge (b, c)
    while (node) {
        for (var i = 0; i < node.children.length; i++) {
            var child = node.children[i];

            var dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child);
            if (dist > maxDist) continue; // skip the node if it's farther than we ever need

            queue.push({
                node: child,
                dist: dist
            });
        }

        while (queue.length && !queue.peek().node.children) {
            var item = queue.pop();
            var p = item.node;

            // skip all points that are as close to adjacent edges (a,b) and (c,d),
            // and points that would introduce self-intersections when connected
            var d0 = sqSegDist(p, a, b);
            var d1 = sqSegDist(p, c, d);
            if (item.dist < d0 && item.dist < d1 &&
                noIntersections(b, p, segTree) &&
                noIntersections(c, p, segTree)) return p;
        }

        node = queue.pop();
        if (node) node = node.node;
    }

    return null;
}

function compareDist(a, b) {
    return a.dist - b.dist;
}

// square distance from a segment bounding box to the given one
function sqSegBoxDist(a, b, bbox) {
    if (inside(a, bbox) || inside(b, bbox)) return 0;
    var d1 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
    if (d1 === 0) return 0;
    var d2 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
    if (d2 === 0) return 0;
    var d3 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
    if (d3 === 0) return 0;
    var d4 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
    if (d4 === 0) return 0;
    return Math.min(d1, d2, d3, d4);
}

function inside(a, bbox) {
    return a[0] >= bbox.minX &&
           a[0] <= bbox.maxX &&
           a[1] >= bbox.minY &&
           a[1] <= bbox.maxY;
}

// check if the edge (a,b) doesn't intersect any other edges
function noIntersections(a, b, segTree) {
    var minX = Math.min(a[0], b[0]);
    var minY = Math.min(a[1], b[1]);
    var maxX = Math.max(a[0], b[0]);
    var maxY = Math.max(a[1], b[1]);

    var edges = segTree.search({minX: minX, minY: minY, maxX: maxX, maxY: maxY});
    for (var i = 0; i < edges.length; i++) {
        if (intersects(edges[i].p, edges[i].next.p, a, b)) return false;
    }
    return true;
}

function cross(p1, p2, p3) {
    return orient(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

// check if the edges (p1,q1) and (p2,q2) intersect
function intersects(p1, q1, p2, q2) {
    return p1 !== q2 && q1 !== p2 &&
        cross(p1, q1, p2) > 0 !== cross(p1, q1, q2) > 0 &&
        cross(p2, q2, p1) > 0 !== cross(p2, q2, q1) > 0;
}

// update the bounding box of a node's edge
function updateBBox(node) {
    var p1 = node.p;
    var p2 = node.next.p;
    node.minX = Math.min(p1[0], p2[0]);
    node.minY = Math.min(p1[1], p2[1]);
    node.maxX = Math.max(p1[0], p2[0]);
    node.maxY = Math.max(p1[1], p2[1]);
    return node;
}

// speed up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
function fastConvexHull(points) {
    var left = points[0];
    var top = points[0];
    var right = points[0];
    var bottom = points[0];

    // find the leftmost, rightmost, topmost and bottommost points
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (p[0] < left[0]) left = p;
        if (p[0] > right[0]) right = p;
        if (p[1] < top[1]) top = p;
        if (p[1] > bottom[1]) bottom = p;
    }

    // filter out points that are inside the resulting quadrilateral
    var cull = [left, top, right, bottom];
    var filtered = cull.slice();
    for (i = 0; i < points.length; i++) {
        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
    }

    // get convex hull around the filtered points
    return convexHull(filtered);
}

// create a new node in a doubly linked list
function insertNode(p, prev) {
    var node = {
        p: p,
        prev: null,
        next: null,
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0
    };

    if (!prev) {
        node.prev = node;
        node.next = node;

    } else {
        node.next = prev.next;
        node.prev = prev;
        prev.next.prev = node;
        prev.next = node;
    }
    return node;
}

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1[0] - p2[0],
        dy = p1[1] - p2[1];

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function sqSegDist(p, p1, p2) {

    var x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2[0];
            y = p2[1];

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return dx * dx + dy * dy;
}

// segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
function sqSegSegDist(x0, y0, x1, y1, x2, y2, x3, y3) {
    var ux = x1 - x0;
    var uy = y1 - y0;
    var vx = x3 - x2;
    var vy = y3 - y2;
    var wx = x0 - x2;
    var wy = y0 - y2;
    var a = ux * ux + uy * uy;
    var b = ux * vx + uy * vy;
    var c = vx * vx + vy * vy;
    var d = ux * wx + uy * wy;
    var e = vx * wx + vy * wy;
    var D = a * c - b * b;

    var sc, sN, tc, tN;
    var sD = D;
    var tD = D;

    if (D === 0) {
        sN = 0;
        sD = 1;
        tN = e;
        tD = c;
    } else {
        sN = b * e - c * d;
        tN = a * e - b * d;
        if (sN < 0) {
            sN = 0;
            tN = e;
            tD = c;
        } else if (sN > sD) {
            sN = sD;
            tN = e + b;
            tD = c;
        }
    }

    if (tN < 0.0) {
        tN = 0.0;
        if (-d < 0.0) sN = 0.0;
        else if (-d > a) sN = sD;
        else {
            sN = -d;
            sD = a;
        }
    } else if (tN > tD) {
        tN = tD;
        if ((-d + b) < 0.0) sN = 0;
        else if (-d + b > a) sN = sD;
        else {
            sN = -d + b;
            sD = a;
        }
    }

    sc = sN === 0 ? 0 : sN / sD;
    tc = tN === 0 ? 0 : tN / tD;

    var cx = (1 - sc) * x0 + sc * x1;
    var cy = (1 - sc) * y0 + sc * y1;
    var cx2 = (1 - tc) * x2 + tc * x3;
    var cy2 = (1 - tc) * y2 + tc * y3;
    var dx = cx2 - cx;
    var dy = cy2 - cy;

    return dx * dx + dy * dy;
}

function compareByX(a, b) {
    return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
}

function convexHull(points) {
    points.sort(compareByX);

    var lower = [];
    for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    var upper = [];
    for (var ii = points.length - 1; ii >= 0; ii--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[ii]) <= 0) {
            upper.pop();
        }
        upper.push(points[ii]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}

},{"point-in-polygon":43,"rbush":49,"robust-predicates/umd/orient2d.min.js":50,"tinyqueue":52}],36:[function(require,module,exports){
// https://d3js.org/d3-array/ v1.2.4 Copyright 2018 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;

function pairs(array, f) {
  if (f == null) f = pair;
  var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
  while (i < n) pairs[i] = f(p, p = array[++i]);
  return pairs;
}

function pair(a, b) {
  return [a, b];
}

function cross(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;

  if (reduce == null) reduce = pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}

function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

function number(x) {
  return x === null ? NaN : +x;
}

function variance(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
}

function deviation(array, f) {
  var v = variance(array, f);
  return v ? Math.sqrt(v) : v;
}

function extent(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}

var array = Array.prototype;

var slice = array.slice;
var map = array.map;

function constant(x) {
  return function() {
    return x;
  };
}

function identity(x) {
  return x;
}

function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function ticks(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));
    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));
    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

function sturges(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}

function histogram() {
  var value = identity,
      domain = extent,
      threshold = sturges;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisectRight(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
}

function quantile(values, p, valueof) {
  if (valueof == null) valueof = number;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}

function freedmanDiaconis(values, min, max) {
  values = map.call(values, number).sort(ascending);
  return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}

function scott(values, min, max) {
  return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
}

function max(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}

function mean(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) sum += value;
      else --m;
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) sum += value;
      else --m;
    }
  }

  if (m) return sum / m;
}

function median(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = number(values[i]))) {
        numbers.push(value);
      }
    }
  }

  else {
    while (++i < n) {
      if (!isNaN(value = number(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return quantile(numbers.sort(ascending), 0.5);
}

function merge(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;
  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;
    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}

function min(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) { // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;
        while (++i < n) { // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}

function permute(array, indexes) {
  var i = indexes.length, permutes = new Array(i);
  while (i--) permutes[i] = array[indexes[i]];
  return permutes;
}

function scan(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];

  if (compare == null) compare = ascending;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
}

function shuffle(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}

function sum(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  }

  else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}

function transpose(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }
  return transpose;
}

function length(d) {
  return d.length;
}

function zip() {
  return transpose(arguments);
}

exports.bisect = bisectRight;
exports.bisectRight = bisectRight;
exports.bisectLeft = bisectLeft;
exports.ascending = ascending;
exports.bisector = bisector;
exports.cross = cross;
exports.descending = descending;
exports.deviation = deviation;
exports.extent = extent;
exports.histogram = histogram;
exports.thresholdFreedmanDiaconis = freedmanDiaconis;
exports.thresholdScott = scott;
exports.thresholdSturges = sturges;
exports.max = max;
exports.mean = mean;
exports.median = median;
exports.merge = merge;
exports.min = min;
exports.pairs = pairs;
exports.permute = permute;
exports.quantile = quantile;
exports.range = range;
exports.scan = scan;
exports.shuffle = shuffle;
exports.sum = sum;
exports.ticks = ticks;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
exports.transpose = transpose;
exports.variance = variance;
exports.zip = zip;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],37:[function(require,module,exports){
// https://d3js.org/d3-geo/ Version 1.7.1. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Array) { 'use strict';

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/

var adder = function() {
  return new Adder;
};

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function() {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function(y) {
    add(temp, y, this.t);
    add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;
    else this.s = temp.t;
  },
  valueOf: function() {
    return this.s;
  }
};

var temp = new Adder;

function add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = (a - av) + (b - bv);
}

var epsilon = 1e-6;
var epsilon2 = 1e-12;
var pi = Math.PI;
var halfPi = pi / 2;
var quarterPi = pi / 4;
var tau = pi * 2;

var degrees = 180 / pi;
var radians = pi / 180;

var abs = Math.abs;
var atan = Math.atan;
var atan2 = Math.atan2;
var cos = Math.cos;
var ceil = Math.ceil;
var exp = Math.exp;

var log = Math.log;
var pow = Math.pow;
var sin = Math.sin;
var sign = Math.sign || function(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
var sqrt = Math.sqrt;
var tan = Math.tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}

function noop() {}

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function(object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function(object, stream) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};

var streamGeometryType = {
  Sphere: function(object, stream) {
    stream.sphere();
  },
  Point: function(object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function(object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function(object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function(object, stream) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function(object, stream) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  stream.lineStart();
  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1, n = coordinates.length;
  stream.polygonStart();
  while (++i < n) streamLine(coordinates[i], stream, 1);
  stream.polygonEnd();
}

var geoStream = function(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
};

var areaRingSum = adder();

var areaSum = adder();
var lambda00;
var phi00;
var lambda0;
var cosPhi0;
var sinPhi0;

var areaStream = {
  point: noop,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: function() {
    areaRingSum.reset();
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    var areaRing = +areaRingSum;
    areaSum.add(areaRing < 0 ? tau + areaRing : areaRing);
    this.lineStart = this.lineEnd = this.point = noop;
  },
  sphere: function() {
    areaSum.add(tau);
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaRingEnd() {
  areaPoint(lambda00, phi00);
}

function areaPointFirst(lambda, phi) {
  areaStream.point = areaPoint;
  lambda00 = lambda, phi00 = phi;
  lambda *= radians, phi *= radians;
  lambda0 = lambda, cosPhi0 = cos(phi = phi / 2 + quarterPi), sinPhi0 = sin(phi);
}

function areaPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  phi = phi / 2 + quarterPi; // half the angular distance from south pole

  // Spherical excess E for a spherical triangle with vertices: south pole,
  // previous point, current point.  Uses a formula derived from Cagnoli’s
  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
  var dLambda = lambda - lambda0,
      sdLambda = dLambda >= 0 ? 1 : -1,
      adLambda = sdLambda * dLambda,
      cosPhi = cos(phi),
      sinPhi = sin(phi),
      k = sinPhi0 * sinPhi,
      u = cosPhi0 * cosPhi + k * cos(adLambda),
      v = k * sdLambda * sin(adLambda);
  areaRingSum.add(atan2(v, u));

  // Advance the previous points.
  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
}

var area = function(object) {
  areaSum.reset();
  geoStream(object, areaStream);
  return areaSum * 2;
};

function spherical(cartesian) {
  return [atan2(cartesian[1], cartesian[0]), asin(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0], phi = spherical[1], cosPhi = cos(phi);
  return [cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

// TODO return a
function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
}

// TODO return d
function cartesianNormalizeInPlace(d) {
  var l = sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

var lambda0$1;
var phi0;
var lambda1;
var phi1;
var lambda2;
var lambda00$1;
var phi00$1;
var p0;
var deltaSum = adder();
var ranges;
var range$1;

var boundsStream = {
  point: boundsPoint,
  lineStart: boundsLineStart,
  lineEnd: boundsLineEnd,
  polygonStart: function() {
    boundsStream.point = boundsRingPoint;
    boundsStream.lineStart = boundsRingStart;
    boundsStream.lineEnd = boundsRingEnd;
    deltaSum.reset();
    areaStream.polygonStart();
  },
  polygonEnd: function() {
    areaStream.polygonEnd();
    boundsStream.point = boundsPoint;
    boundsStream.lineStart = boundsLineStart;
    boundsStream.lineEnd = boundsLineEnd;
    if (areaRingSum < 0) lambda0$1 = -(lambda1 = 180), phi0 = -(phi1 = 90);
    else if (deltaSum > epsilon) phi1 = 90;
    else if (deltaSum < -epsilon) phi0 = -90;
    range$1[0] = lambda0$1, range$1[1] = lambda1;
  }
};

function boundsPoint(lambda, phi) {
  ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
}

function linePoint(lambda, phi) {
  var p = cartesian([lambda * radians, phi * radians]);
  if (p0) {
    var normal = cartesianCross(p0, p),
        equatorial = [normal[1], -normal[0], 0],
        inflection = cartesianCross(equatorial, normal);
    cartesianNormalizeInPlace(inflection);
    inflection = spherical(inflection);
    var delta = lambda - lambda2,
        sign$$1 = delta > 0 ? 1 : -1,
        lambdai = inflection[0] * degrees * sign$$1,
        phii,
        antimeridian = abs(delta) > 180;
    if (antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
      phii = inflection[1] * degrees;
      if (phii > phi1) phi1 = phii;
    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign$$1 * lambda2 < lambdai && lambdai < sign$$1 * lambda)) {
      phii = -inflection[1] * degrees;
      if (phii < phi0) phi0 = phii;
    } else {
      if (phi < phi0) phi0 = phi;
      if (phi > phi1) phi1 = phi;
    }
    if (antimeridian) {
      if (lambda < lambda2) {
        if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
      } else {
        if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
      }
    } else {
      if (lambda1 >= lambda0$1) {
        if (lambda < lambda0$1) lambda0$1 = lambda;
        if (lambda > lambda1) lambda1 = lambda;
      } else {
        if (lambda > lambda2) {
          if (angle(lambda0$1, lambda) > angle(lambda0$1, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0$1, lambda1)) lambda0$1 = lambda;
        }
      }
    }
  } else {
    ranges.push(range$1 = [lambda0$1 = lambda, lambda1 = lambda]);
  }
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
  p0 = p, lambda2 = lambda;
}

function boundsLineStart() {
  boundsStream.point = linePoint;
}

function boundsLineEnd() {
  range$1[0] = lambda0$1, range$1[1] = lambda1;
  boundsStream.point = boundsPoint;
  p0 = null;
}

function boundsRingPoint(lambda, phi) {
  if (p0) {
    var delta = lambda - lambda2;
    deltaSum.add(abs(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
  } else {
    lambda00$1 = lambda, phi00$1 = phi;
  }
  areaStream.point(lambda, phi);
  linePoint(lambda, phi);
}

function boundsRingStart() {
  areaStream.lineStart();
}

function boundsRingEnd() {
  boundsRingPoint(lambda00$1, phi00$1);
  areaStream.lineEnd();
  if (abs(deltaSum) > epsilon) lambda0$1 = -(lambda1 = 180);
  range$1[0] = lambda0$1, range$1[1] = lambda1;
  p0 = null;
}

// Finds the left-right distance between two longitudes.
// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
// the distance between ±180° to be 360°.
function angle(lambda0, lambda1) {
  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
}

function rangeCompare(a, b) {
  return a[0] - b[0];
}

function rangeContains(range$$1, x) {
  return range$$1[0] <= range$$1[1] ? range$$1[0] <= x && x <= range$$1[1] : x < range$$1[0] || range$$1[1] < x;
}

var bounds = function(feature) {
  var i, n, a, b, merged, deltaMax, delta;

  phi1 = lambda1 = -(lambda0$1 = phi0 = Infinity);
  ranges = [];
  geoStream(feature, boundsStream);

  // First, sort ranges by their minimum longitudes.
  if (n = ranges.length) {
    ranges.sort(rangeCompare);

    // Then, merge any ranges that overlap.
    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
      b = ranges[i];
      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
      } else {
        merged.push(a = b);
      }
    }

    // Finally, find the largest gap between the merged ranges.
    // The final bounding box will be the inverse of this gap.
    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
      b = merged[i];
      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0$1 = b[0], lambda1 = a[1];
    }
  }

  ranges = range$1 = null;

  return lambda0$1 === Infinity || phi0 === Infinity
      ? [[NaN, NaN], [NaN, NaN]]
      : [[lambda0$1, phi0], [lambda1, phi1]];
};

var W0;
var W1;
var X0;
var Y0;
var Z0;
var X1;
var Y1;
var Z1;
var X2;
var Y2;
var Z2;
var lambda00$2;
var phi00$2;
var x0;
var y0;
var z0; // previous point

var centroidStream = {
  sphere: noop,
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function() {
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  }
};

// Arithmetic mean of Cartesian vectors.
function centroidPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi);
  centroidPointCartesian(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi));
}

function centroidPointCartesian(x, y, z) {
  ++W0;
  X0 += (x - X0) / W0;
  Y0 += (y - Y0) / W0;
  Z0 += (z - Z0) / W0;
}

function centroidLineStart() {
  centroidStream.point = centroidLinePointFirst;
}

function centroidLinePointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi);
  x0 = cosPhi * cos(lambda);
  y0 = cosPhi * sin(lambda);
  z0 = sin(phi);
  centroidStream.point = centroidLinePoint;
  centroidPointCartesian(x0, y0, z0);
}

function centroidLinePoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi),
      x = cosPhi * cos(lambda),
      y = cosPhi * sin(lambda),
      z = sin(phi),
      w = atan2(sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).
function centroidRingStart() {
  centroidStream.point = centroidRingPointFirst;
}

function centroidRingEnd() {
  centroidRingPoint(lambda00$2, phi00$2);
  centroidStream.point = centroidPoint;
}

function centroidRingPointFirst(lambda, phi) {
  lambda00$2 = lambda, phi00$2 = phi;
  lambda *= radians, phi *= radians;
  centroidStream.point = centroidRingPoint;
  var cosPhi = cos(phi);
  x0 = cosPhi * cos(lambda);
  y0 = cosPhi * sin(lambda);
  z0 = sin(phi);
  centroidPointCartesian(x0, y0, z0);
}

function centroidRingPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var cosPhi = cos(phi),
      x = cosPhi * cos(lambda),
      y = cosPhi * sin(lambda),
      z = sin(phi),
      cx = y0 * z - z0 * y,
      cy = z0 * x - x0 * z,
      cz = x0 * y - y0 * x,
      m = sqrt(cx * cx + cy * cy + cz * cz),
      w = asin(m), // line weight = angle
      v = m && -w / m; // area weight multiplier
  X2 += v * cx;
  Y2 += v * cy;
  Z2 += v * cz;
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

var centroid = function(object) {
  W0 = W1 =
  X0 = Y0 = Z0 =
  X1 = Y1 = Z1 =
  X2 = Y2 = Z2 = 0;
  geoStream(object, centroidStream);

  var x = X2,
      y = Y2,
      z = Z2,
      m = x * x + y * y + z * z;

  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
  if (m < epsilon2) {
    x = X1, y = Y1, z = Z1;
    // If the feature has zero length, fall back to arithmetic mean of point vectors.
    if (W1 < epsilon) x = X0, y = Y0, z = Z0;
    m = x * x + y * y + z * z;
    // If the feature still has an undefined ccentroid, then return.
    if (m < epsilon2) return [NaN, NaN];
  }

  return [atan2(y, x) * degrees, asin(z / sqrt(m)) * degrees];
};

var constant = function(x) {
  return function() {
    return x;
  };
};

var compose = function(a, b) {

  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function(x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };

  return compose;
};

function rotationIdentity(lambda, phi) {
  return [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= tau) ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : rotationIdentity);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    return lambda += deltaLambda, [lambda > pi ? lambda - tau : lambda < -pi ? lambda + tau : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = cos(deltaPhi),
      sinDeltaPhi = sin(deltaPhi),
      cosDeltaGamma = cos(deltaGamma),
      sinDeltaGamma = sin(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = cos(phi),
        x = cos(lambda) * cosPhi,
        y = sin(lambda) * cosPhi,
        z = sin(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      asin(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = cos(phi),
        x = cos(lambda) * cosPhi,
        y = sin(lambda) * cosPhi,
        z = sin(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      asin(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

var rotation = function(rotate) {
  rotate = rotateRadians(rotate[0] * radians, rotate[1] * radians, rotate.length > 2 ? rotate[2] * radians : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * radians, coordinates[1] * radians);
    return coordinates[0] *= degrees, coordinates[1] *= degrees, coordinates;
  };

  return forward;
};

// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = cos(radius),
      sinRadius = sin(radius),
      step = direction * delta;
  if (t0 == null) {
    t0 = radius + direction * tau;
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * tau;
  }
  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
    stream.point(point[0], point[1]);
  }
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = cartesian(point), point[0] -= cosRadius;
  cartesianNormalizeInPlace(point);
  var radius = acos(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
}

var circle = function() {
  var center = constant([0, 0]),
      radius = constant(90),
      precision = constant(6),
      ring,
      rotate,
      stream = {point: point};

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= degrees, x[1] *= degrees;
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * radians,
        p = precision.apply(this, arguments) * radians;
    ring = [];
    rotate = rotateRadians(-c[0] * radians, -c[1] * radians, 0).invert;
    circleStream(stream, r, p, 1);
    c = {type: "Polygon", coordinates: [ring]};
    ring = rotate = null;
    return c;
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), circle) : radius;
  };

  circle.precision = function(_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : constant(+_), circle) : precision;
  };

  return circle;
};

var clipBuffer = function() {
  var lines = [],
      line;
  return {
    point: function(x, y) {
      line.push([x, y]);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: noop,
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
};

var clipLine = function(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;

  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;
  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;
  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;
  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;
  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
};

var pointEqual = function(a, b) {
  return abs(a[0] - b[0]) < epsilon && abs(a[1] - b[1]) < epsilon;
};

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}

// A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.
var clipPolygon = function(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n], x;

    // If the first and last points of a segment are coincident, then treat as a
    // closed ring. TODO if all rings are closed, then the winding order of the
    // exterior ring should be checked.
    if (pointEqual(p0, p1)) {
      stream.lineStart();
      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);
      stream.lineEnd();
      return;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });

  if (!subject.length) return;

  clip.sort(compareIntersection);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    stream.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    stream.lineEnd();
  }
};

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}

var clipMax = 1e9;
var clipMin = -clipMax;

// TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipExtent(x0, y0, x1, y1) {

  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0, a1 = 0;
    if (from == null
        || (a = corner(from, direction)) !== (a1 = corner(to, direction))
        || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
      while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return abs(p[0] - x0) < epsilon ? direction > 0 ? 0 : 3
        : abs(p[0] - x1) < epsilon ? direction > 0 ? 2 : 1
        : abs(p[1] - y0) < epsilon ? direction > 0 ? 1 : 0
        : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb
        : ca === 0 ? b[1] - a[1]
        : ca === 1 ? a[0] - b[0]
        : ca === 2 ? a[1] - b[1]
        : b[0] - a[0];
  }

  return function(stream) {
    var activeStream = stream,
        bufferStream = clipBuffer(),
        segments,
        polygon,
        ring,
        x__, y__, v__, // first point
        x_, y_, v_, // previous point
        first,
        clean;

    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];
          if (a1 <= y1) { if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding; }
          else { if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding; }
        }
      }

      return winding;
    }

    // Buffer geometry within a polygon and then clip it en masse.
    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = d3Array.merge(segments)).length;
      if (cleanInside || visible) {
        stream.polygonStart();
        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }
        if (visible) {
          clipPolygon(segments, compareIntersection, startInside, interpolate, stream);
        }
        stream.polygonEnd();
      }
      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    }

    // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.
    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }
      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);
      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;
        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);
        else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];
          if (clipLine(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }
            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }
      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}

var extent = function() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;

  return clip = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = clipExtent(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function(_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
};

var sum = adder();

var polygonContains = function(polygon, point) {
  var lambda = point[0],
      phi = point[1],
      normal = [sin(lambda), -cos(lambda), 0],
      angle = 0,
      winding = 0;

  sum.reset();

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = point0[0],
        phi0 = point0[1] / 2 + quarterPi,
        sinPhi0 = sin(phi0),
        cosPhi0 = cos(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = point1[0],
          phi1 = point1[1] / 2 + quarterPi,
          sinPhi1 = sin(phi1),
          cosPhi1 = cos(phi1),
          delta = lambda1 - lambda0,
          sign$$1 = delta >= 0 ? 1 : -1,
          absDelta = sign$$1 * delta,
          antimeridian = absDelta > pi,
          k = sinPhi0 * sinPhi1;

      sum.add(atan2(k * sign$$1 * sin(absDelta), cosPhi0 * cosPhi1 + k * cos(absDelta)));
      angle += antimeridian ? delta + sign$$1 * tau : delta;

      // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?
      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = cartesianCross(cartesian(point0), cartesian(point1));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(normal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  return (angle < -epsilon || angle < epsilon && sum < -epsilon) ^ (winding & 1);
};

var lengthSum = adder();
var lambda0$2;
var sinPhi0$1;
var cosPhi0$1;

var lengthStream = {
  sphere: noop,
  point: noop,
  lineStart: lengthLineStart,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = noop;
}

function lengthPointFirst(lambda, phi) {
  lambda *= radians, phi *= radians;
  lambda0$2 = lambda, sinPhi0$1 = sin(phi), cosPhi0$1 = cos(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= radians, phi *= radians;
  var sinPhi = sin(phi),
      cosPhi = cos(phi),
      delta = abs(lambda - lambda0$2),
      cosDelta = cos(delta),
      sinDelta = sin(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0$1 * sinPhi - sinPhi0$1 * cosPhi * cosDelta,
      z = sinPhi0$1 * sinPhi + cosPhi0$1 * cosPhi * cosDelta;
  lengthSum.add(atan2(sqrt(x * x + y * y), z));
  lambda0$2 = lambda, sinPhi0$1 = sinPhi, cosPhi0$1 = cosPhi;
}

var length = function(object) {
  lengthSum.reset();
  geoStream(object, lengthStream);
  return +lengthSum;
};

var coordinates = [null, null];
var object = {type: "LineString", coordinates: coordinates};

var distance = function(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length(object);
};

var containsObjectType = {
  Feature: function(object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function(object, point) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;
    return false;
  }
};

var containsGeometryType = {
  Sphere: function() {
    return true;
  },
  Point: function(object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPoint(coordinates[i], point)) return true;
    return false;
  },
  LineString: function(object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsLine(coordinates[i], point)) return true;
    return false;
  },
  Polygon: function(object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function(object, point) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;
    return false;
  },
  GeometryCollection: function(object, point) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) if (containsGeometry(geometries[i], point)) return true;
    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type)
      ? containsGeometryType[geometry.type](geometry, point)
      : false;
}

function containsPoint(coordinates, point) {
  return distance(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ab = distance(coordinates[0], coordinates[1]),
      ao = distance(coordinates[0], point),
      ob = distance(point, coordinates[1]);
  return ao + ob <= ab + epsilon;
}

function containsPolygon(coordinates, point) {
  return !!polygonContains(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

var contains = function(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type)
      ? containsObjectType[object.type]
      : containsGeometry)(object, point);
};

function graticuleX(y0, y1, dy) {
  var y = d3Array.range(y0, y1 - epsilon, dy).concat(y1);
  return function(x) { return y.map(function(y) { return [x, y]; }); };
}

function graticuleY(x0, x1, dx) {
  var x = d3Array.range(x0, x1 - epsilon, dx).concat(x1);
  return function(y) { return x.map(function(x) { return [x, y]; }); };
}

function graticule() {
  var x1, x0, X1, X0,
      y1, y0, Y1, Y0,
      dx = 10, dy = dx, DX = 90, DY = 360,
      x, y, X, Y,
      precision = 2.5;

  function graticule() {
    return {type: "MultiLineString", coordinates: lines()};
  }

  function lines() {
    return d3Array.range(ceil(X0 / DX) * DX, X1, DX).map(X)
        .concat(d3Array.range(ceil(Y0 / DY) * DY, Y1, DY).map(Y))
        .concat(d3Array.range(ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return abs(x % DX) > epsilon; }).map(x))
        .concat(d3Array.range(ceil(y0 / dy) * dy, y1, dy).filter(function(y) { return abs(y % DY) > epsilon; }).map(y));
  }

  graticule.lines = function() {
    return lines().map(function(coordinates) { return {type: "LineString", coordinates: coordinates}; });
  };

  graticule.outline = function() {
    return {
      type: "Polygon",
      coordinates: [
        X(X0).concat(
        Y(Y1).slice(1),
        X(X1).reverse().slice(1),
        Y(Y0).reverse().slice(1))
      ]
    };
  };

  graticule.extent = function(_) {
    if (!arguments.length) return graticule.extentMinor();
    return graticule.extentMajor(_).extentMinor(_);
  };

  graticule.extentMajor = function(_) {
    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
    X0 = +_[0][0], X1 = +_[1][0];
    Y0 = +_[0][1], Y1 = +_[1][1];
    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
    return graticule.precision(precision);
  };

  graticule.extentMinor = function(_) {
    if (!arguments.length) return [[x0, y0], [x1, y1]];
    x0 = +_[0][0], x1 = +_[1][0];
    y0 = +_[0][1], y1 = +_[1][1];
    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
    return graticule.precision(precision);
  };

  graticule.step = function(_) {
    if (!arguments.length) return graticule.stepMinor();
    return graticule.stepMajor(_).stepMinor(_);
  };

  graticule.stepMajor = function(_) {
    if (!arguments.length) return [DX, DY];
    DX = +_[0], DY = +_[1];
    return graticule;
  };

  graticule.stepMinor = function(_) {
    if (!arguments.length) return [dx, dy];
    dx = +_[0], dy = +_[1];
    return graticule;
  };

  graticule.precision = function(_) {
    if (!arguments.length) return precision;
    precision = +_;
    x = graticuleX(y0, y1, 90);
    y = graticuleY(x0, x1, precision);
    X = graticuleX(Y0, Y1, 90);
    Y = graticuleY(X0, X1, precision);
    return graticule;
  };

  return graticule
      .extentMajor([[-180, -90 + epsilon], [180, 90 - epsilon]])
      .extentMinor([[-180, -80 - epsilon], [180, 80 + epsilon]]);
}

function graticule10() {
  return graticule()();
}

var interpolate = function(a, b) {
  var x0 = a[0] * radians,
      y0 = a[1] * radians,
      x1 = b[0] * radians,
      y1 = b[1] * radians,
      cy0 = cos(y0),
      sy0 = sin(y0),
      cy1 = cos(y1),
      sy1 = sin(y1),
      kx0 = cy0 * cos(x0),
      ky0 = cy0 * sin(x0),
      kx1 = cy1 * cos(x1),
      ky1 = cy1 * sin(x1),
      d = 2 * asin(sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
      k = sin(d);

  var interpolate = d ? function(t) {
    var B = sin(t *= d) / k,
        A = sin(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      atan2(y, x) * degrees,
      atan2(z, sqrt(x * x + y * y)) * degrees
    ];
  } : function() {
    return [x0 * degrees, y0 * degrees];
  };

  interpolate.distance = d;

  return interpolate;
};

var identity = function(x) {
  return x;
};

var areaSum$1 = adder();
var areaRingSum$1 = adder();
var x00;
var y00;
var x0$1;
var y0$1;

var areaStream$1 = {
  point: noop,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: function() {
    areaStream$1.lineStart = areaRingStart$1;
    areaStream$1.lineEnd = areaRingEnd$1;
  },
  polygonEnd: function() {
    areaStream$1.lineStart = areaStream$1.lineEnd = areaStream$1.point = noop;
    areaSum$1.add(abs(areaRingSum$1));
    areaRingSum$1.reset();
  },
  result: function() {
    var area = areaSum$1 / 2;
    areaSum$1.reset();
    return area;
  }
};

function areaRingStart$1() {
  areaStream$1.point = areaPointFirst$1;
}

function areaPointFirst$1(x, y) {
  areaStream$1.point = areaPoint$1;
  x00 = x0$1 = x, y00 = y0$1 = y;
}

function areaPoint$1(x, y) {
  areaRingSum$1.add(y0$1 * x - x0$1 * y);
  x0$1 = x, y0$1 = y;
}

function areaRingEnd$1() {
  areaPoint$1(x00, y00);
}

var x0$2 = Infinity;
var y0$2 = x0$2;
var x1 = -x0$2;
var y1 = x1;

var boundsStream$1 = {
  point: boundsPoint$1,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop,
  result: function() {
    var bounds = [[x0$2, y0$2], [x1, y1]];
    x1 = y1 = -(y0$2 = x0$2 = Infinity);
    return bounds;
  }
};

function boundsPoint$1(x, y) {
  if (x < x0$2) x0$2 = x;
  if (x > x1) x1 = x;
  if (y < y0$2) y0$2 = y;
  if (y > y1) y1 = y;
}

// TODO Enforce positive area for exterior, negative area for interior?

var X0$1 = 0;
var Y0$1 = 0;
var Z0$1 = 0;
var X1$1 = 0;
var Y1$1 = 0;
var Z1$1 = 0;
var X2$1 = 0;
var Y2$1 = 0;
var Z2$1 = 0;
var x00$1;
var y00$1;
var x0$3;
var y0$3;

var centroidStream$1 = {
  point: centroidPoint$1,
  lineStart: centroidLineStart$1,
  lineEnd: centroidLineEnd$1,
  polygonStart: function() {
    centroidStream$1.lineStart = centroidRingStart$1;
    centroidStream$1.lineEnd = centroidRingEnd$1;
  },
  polygonEnd: function() {
    centroidStream$1.point = centroidPoint$1;
    centroidStream$1.lineStart = centroidLineStart$1;
    centroidStream$1.lineEnd = centroidLineEnd$1;
  },
  result: function() {
    var centroid = Z2$1 ? [X2$1 / Z2$1, Y2$1 / Z2$1]
        : Z1$1 ? [X1$1 / Z1$1, Y1$1 / Z1$1]
        : Z0$1 ? [X0$1 / Z0$1, Y0$1 / Z0$1]
        : [NaN, NaN];
    X0$1 = Y0$1 = Z0$1 =
    X1$1 = Y1$1 = Z1$1 =
    X2$1 = Y2$1 = Z2$1 = 0;
    return centroid;
  }
};

function centroidPoint$1(x, y) {
  X0$1 += x;
  Y0$1 += y;
  ++Z0$1;
}

function centroidLineStart$1() {
  centroidStream$1.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream$1.point = centroidPointLine;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0$3, dy = y - y0$3, z = sqrt(dx * dx + dy * dy);
  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function centroidLineEnd$1() {
  centroidStream$1.point = centroidPoint$1;
}

function centroidRingStart$1() {
  centroidStream$1.point = centroidPointFirstRing;
}

function centroidRingEnd$1() {
  centroidPointRing(x00$1, y00$1);
}

function centroidPointFirstRing(x, y) {
  centroidStream$1.point = centroidPointRing;
  centroidPoint$1(x00$1 = x0$3 = x, y00$1 = y0$3 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0$3,
      dy = y - y0$3,
      z = sqrt(dx * dx + dy * dy);

  X1$1 += z * (x0$3 + x) / 2;
  Y1$1 += z * (y0$3 + y) / 2;
  Z1$1 += z;

  z = y0$3 * x - x0$3 * y;
  X2$1 += z * (x0$3 + x);
  Y2$1 += z * (y0$3 + y);
  Z2$1 += z * 3;
  centroidPoint$1(x0$3 = x, y0$3 = y);
}

function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function(_) {
    return this._radius = _, this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._context.moveTo(x, y);
        this._point = 1;
        break;
      }
      case 1: {
        this._context.lineTo(x, y);
        break;
      }
      default: {
        this._context.moveTo(x + this._radius, y);
        this._context.arc(x, y, this._radius, 0, tau);
        break;
      }
    }
  },
  result: noop
};

var lengthSum$1 = adder();
var lengthRing;
var x00$2;
var y00$2;
var x0$4;
var y0$4;

var lengthStream$1 = {
  point: noop,
  lineStart: function() {
    lengthStream$1.point = lengthPointFirst$1;
  },
  lineEnd: function() {
    if (lengthRing) lengthPoint$1(x00$2, y00$2);
    lengthStream$1.point = noop;
  },
  polygonStart: function() {
    lengthRing = true;
  },
  polygonEnd: function() {
    lengthRing = null;
  },
  result: function() {
    var length = +lengthSum$1;
    lengthSum$1.reset();
    return length;
  }
};

function lengthPointFirst$1(x, y) {
  lengthStream$1.point = lengthPoint$1;
  x00$2 = x0$4 = x, y00$2 = y0$4 = y;
}

function lengthPoint$1(x, y) {
  x0$4 -= x, y0$4 -= y;
  lengthSum$1.add(sqrt(x0$4 * x0$4 + y0$4 * y0$4));
  x0$4 = x, y0$4 = y;
}

function PathString() {
  this._string = [];
}

PathString.prototype = {
  _radius: 4.5,
  _circle: circle$1(4.5),
  pointRadius: function(_) {
    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
    return this;
  },
  polygonStart: function() {
    this._line = 0;
  },
  polygonEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function(x, y) {
    switch (this._point) {
      case 0: {
        this._string.push("M", x, ",", y);
        this._point = 1;
        break;
      }
      case 1: {
        this._string.push("L", x, ",", y);
        break;
      }
      default: {
        if (this._circle == null) this._circle = circle$1(this._radius);
        this._string.push("M", x, ",", y, this._circle);
        break;
      }
    }
  },
  result: function() {
    if (this._string.length) {
      var result = this._string.join("");
      this._string = [];
      return result;
    } else {
      return null;
    }
  }
};

function circle$1(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}

var index = function(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      geoStream(object, projectionStream(contextStream));
    }
    return contextStream.result();
  }

  path.area = function(object) {
    geoStream(object, projectionStream(areaStream$1));
    return areaStream$1.result();
  };

  path.measure = function(object) {
    geoStream(object, projectionStream(lengthStream$1));
    return lengthStream$1.result();
  };

  path.bounds = function(object) {
    geoStream(object, projectionStream(boundsStream$1));
    return boundsStream$1.result();
  };

  path.centroid = function(object) {
    geoStream(object, projectionStream(centroidStream$1));
    return centroidStream$1.result();
  };

  path.projection = function(_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity) : (projection = _).stream, path) : projection;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
};

var clip = function(pointVisible, clipLine, interpolate, start) {
  return function(rotate, sink) {
    var line = clipLine(sink),
        rotatedStart = rotate.invert(start[0], start[1]),
        ringBuffer = clipBuffer(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;

    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function() {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = d3Array.merge(segments);
        var startInside = polygonContains(polygon, rotatedStart);
        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          clipPolygon(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }
        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function() {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      var point = rotate(lambda, phi);
      if (pointVisible(lambda = point[0], phi = point[1])) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      var point = rotate(lambda, phi);
      line.point(point[0], point[1]);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      var point = rotate(lambda, phi);
      ringSink.point(point[0], point[1]);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();

      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i, n = ringSegments.length, m,
          segment,
          point;

      ring.pop();
      polygon.push(ring);
      ring = null;

      if (!n) return;

      // No intersections.
      if (clean & 1) {
        segment = ringSegments[0];
        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);
          sink.lineEnd();
        }
        return;
      }

      // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?
      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));

      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
};

function validSegment(segment) {
  return segment.length > 1;
}

// Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.
function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - halfPi - epsilon : halfPi - a[1])
       - ((b = b.x)[0] < 0 ? b[1] - halfPi - epsilon : halfPi - b[1]);
}

var clipAntimeridian = clip(
  function() { return true; },
  clipAntimeridianLine,
  clipAntimeridianInterpolate,
  [-pi, -halfPi]
);

// Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.
function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function() {
      stream.lineStart();
      clean = 1;
    },
    point: function(lambda1, phi1) {
      var sign1 = lambda1 > 0 ? pi : -pi,
          delta = abs(lambda1 - lambda0);
      if (abs(delta - pi) < epsilon) { // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? halfPi : -halfPi);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= pi) { // line crosses antimeridian
        if (abs(lambda0 - sign0) < epsilon) lambda0 -= sign0 * epsilon; // handle degeneracies
        if (abs(lambda1 - sign1) < epsilon) lambda1 -= sign1 * epsilon;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }
      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function() {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function() {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = sin(lambda0 - lambda1);
  return abs(sinLambda0Lambda1) > epsilon
      ? atan((sin(phi0) * (cosPhi1 = cos(phi1)) * sin(lambda1)
          - sin(phi1) * (cosPhi0 = cos(phi0)) * sin(lambda0))
          / (cosPhi0 * cosPhi1 * sinLambda0Lambda1))
      : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;
  if (from == null) {
    phi = direction * halfPi;
    stream.point(-pi, phi);
    stream.point(0, phi);
    stream.point(pi, phi);
    stream.point(pi, 0);
    stream.point(pi, -phi);
    stream.point(0, -phi);
    stream.point(-pi, -phi);
    stream.point(-pi, 0);
    stream.point(-pi, phi);
  } else if (abs(from[0] - to[0]) > epsilon) {
    var lambda = from[0] < to[0] ? pi : -pi;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}

var clipCircle = function(radius, delta) {
  var cr = cos(radius),
      smallRadius = cr > 0,
      notHemisphere = abs(cr) > epsilon; // TODO optimise for this common case

  function interpolate(from, to, direction, stream) {
    circleStream(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return cos(lambda) * cos(phi) > cr;
  }

  // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.
  function clipLine(stream) {
    var point0, // previous point
        c0, // code for previous point
        v0, // visibility of previous point
        v00, // visibility of first point
        clean; // no intersections
    return {
      lineStart: function() {
        v00 = v0 = false;
        clean = 1;
      },
      point: function(lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius
              ? v ? 0 : code(lambda, phi)
              : v ? code(lambda + (lambda < 0 ? pi : -pi), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart();
        // Handle degeneracies.
        // TODO ignore if not clipping polygons.
        if (v !== v0) {
          point2 = intersect(point0, point1);
          if (!point2 || pointEqual(point0, point2) || pointEqual(point1, point2)) {
            point1[0] += epsilon;
            point1[1] += epsilon;
            v = visible(point1[0], point1[1]);
          }
        }
        if (v !== v0) {
          clean = 0;
          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1]);
            stream.lineEnd();
          }
          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t;
          // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.
          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;
            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
            }
          }
        }
        if (v && (!point0 || !pointEqual(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }
        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function() {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function() {
        return clean | ((v00 && v0) << 1);
      }
    };
  }

  // Intersects the great circle between a and b with the clip circle.
  function intersect(a, b, two) {
    var pa = cartesian(a),
        pb = cartesian(b);

    // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).
    var n1 = [1, 0, 0], // normal
        n2 = cartesianCross(pa, pb),
        n2n2 = cartesianDot(n2, n2),
        n1n2 = n2[0], // cartesianDot(n1, n2),
        determinant = n2n2 - n1n2 * n1n2;

    // Two polar points.
    if (!determinant) return !two && a;

    var c1 =  cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = cartesianCross(n1, n2),
        A = cartesianScale(n1, c1),
        B = cartesianScale(n2, c2);
    cartesianAddInPlace(A, B);

    // Solve |p(t)|^2 = 1.
    var u = n1xn2,
        w = cartesianDot(A, u),
        uu = cartesianDot(u, u),
        t2 = w * w - uu * (cartesianDot(A, A) - 1);

    if (t2 < 0) return;

    var t = sqrt(t2),
        q = cartesianScale(u, (-w - t) / uu);
    cartesianAddInPlace(q, A);
    q = spherical(q);

    if (!two) return q;

    // Two intersection points.
    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;

    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = abs(delta - pi) < epsilon,
        meridian = polar || delta < epsilon;

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z;

    // Check that the first point is between a and b.
    if (meridian
        ? polar
          ? phi0 + phi1 > 0 ^ q[1] < (abs(q[0] - lambda0) < epsilon ? phi0 : phi1)
          : phi0 <= q[1] && q[1] <= phi1
        : delta > pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = cartesianScale(u, (-w + t) / uu);
      cartesianAddInPlace(q1, A);
      return [q, spherical(q1)];
    }
  }

  // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.
  function code(lambda, phi) {
    var r = smallRadius ? radius : pi - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right
    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above
    return code;
  }

  return clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-pi, radius - pi]);
};

var transform = function(methods) {
  return {
    stream: transformer(methods)
  };
};

function transformer(methods) {
  return function(stream) {
    var s = new TransformStream;
    for (var key in methods) s[key] = methods[key];
    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};

function fitExtent(projection, extent, object) {
  var w = extent[1][0] - extent[0][0],
      h = extent[1][1] - extent[0][1],
      clip = projection.clipExtent && projection.clipExtent();

  projection
      .scale(150)
      .translate([0, 0]);

  if (clip != null) projection.clipExtent(null);

  geoStream(object, projection.stream(boundsStream$1));

  var b = boundsStream$1.result(),
      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
      x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
      y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;

  if (clip != null) projection.clipExtent(clip);

  return projection
      .scale(k * 150)
      .translate([x, y]);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

var maxDepth = 16;
var cosMinDistance = cos(30 * radians); // cos(minimum angular distance)

var resample = function(project, delta2) {
  return +delta2 ? resample$1(project, delta2) : resampleNone(project);
};

function resampleNone(project) {
  return transformer({
    point: function(x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample$1(project, delta2) {

  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;
    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = sqrt(a * a + b * b + c * c),
          phi2 = asin(c /= m),
          lambda2 = abs(abs(c) - 1) < epsilon || abs(lambda0 - lambda1) < epsilon ? (lambda0 + lambda1) / 2 : atan2(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;
      if (dz * dz / d2 > delta2 // perpendicular projected distance
          || abs((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
          || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) { // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }
  return function(stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
        lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() { stream.polygonStart(); resampleStream.lineStart = ringStart; },
      polygonEnd: function() { stream.polygonEnd(); resampleStream.lineStart = lineStart; }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = cartesian([lambda, phi]), p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}

var transformRadians = transformer({
  point: function(x, y) {
    this.stream.point(x * radians, y * radians);
  }
});

function projection(project) {
  return projectionMutator(function() { return project; })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      x = 480, y = 250, // translate
      dx, dy, lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
      theta = null, preclip = clipAntimeridian, // clip angle
      x0 = null, y0, x1, y1, postclip = identity, // clip extent
      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
      cache,
      cacheStream;

  function projection(point) {
    point = projectRotate(point[0] * radians, point[1] * radians);
    return [point[0] * k + dx, dy - point[1] * k];
  }

  function invert(point) {
    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  function projectTransform(x, y) {
    return x = project(x, y), [x[0] * k + dx, dy - x[1] * k];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(preclip(rotate, projectResample(postclip(cacheStream = stream))));
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians, 6 * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
  };

  projection.fitExtent = function(extent$$1, object) {
    return fitExtent(projection, extent$$1, object);
  };

  projection.fitSize = function(size, object) {
    return fitSize(projection, size, object);
  };

  function recenter() {
    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
    var center = project(lambda, phi);
    dx = x - center[0] * k;
    dy = y + center[1] * k;
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}

function conicProjection(projectAt) {
  var phi0 = 0,
      phi1 = pi / 3,
      m = projectionMutator(projectAt),
      p = m(phi0, phi1);

  p.parallels = function(_) {
    return arguments.length ? m(phi0 = _[0] * radians, phi1 = _[1] * radians) : [phi0 * degrees, phi1 * degrees];
  };

  return p;
}

function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = cos(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, sin(phi) / cosPhi0];
  }

  forward.invert = function(x, y) {
    return [x / cosPhi0, asin(y * cosPhi0)];
  };

  return forward;
}

function conicEqualAreaRaw(y0, y1) {
  var sy0 = sin(y0), n = (sy0 + sin(y1)) / 2;

  // Are the parallels symmetrical around the Equator?
  if (abs(n) < epsilon) return cylindricalEqualAreaRaw(y0);

  var c = 1 + sy0 * (2 * n - sy0), r0 = sqrt(c) / n;

  function project(x, y) {
    var r = sqrt(c - 2 * n * sin(y)) / n;
    return [r * sin(x *= n), r0 - r * cos(x)];
  }

  project.invert = function(x, y) {
    var r0y = r0 - y;
    return [atan2(x, abs(r0y)) / n * sign(r0y), asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

var conicEqualArea = function() {
  return conicProjection(conicEqualAreaRaw)
      .scale(155.424)
      .center([0, 33.6442]);
};

var albers = function() {
  return conicEqualArea()
      .parallels([29.5, 45.5])
      .scale(1070)
      .translate([480, 250])
      .rotate([96, 0])
      .center([-0.6, 38.7]);
};

// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) { var i = -1; while (++i < n) streams[i].point(x, y); },
    sphere: function() { var i = -1; while (++i < n) streams[i].sphere(); },
    lineStart: function() { var i = -1; while (++i < n) streams[i].lineStart(); },
    lineEnd: function() { var i = -1; while (++i < n) streams[i].lineEnd(); },
    polygonStart: function() { var i = -1; while (++i < n) streams[i].polygonStart(); },
    polygonEnd: function() { var i = -1; while (++i < n) streams[i].polygonEnd(); }
  };
}

// A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
var albersUsa = function() {
  var cache,
      cacheStream,
      lower48 = albers(), lower48Point,
      alaska = conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), alaskaPoint, // EPSG:3338
      hawaii = conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), hawaiiPoint, // ESRI:102007
      point, pointStream = {point: function(x, y) { point = [x, y]; }};

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    return point = null,
        (lower48Point.point(x, y), point)
        || (alaskaPoint.point(x, y), point)
        || (hawaiiPoint.point(x, y), point);
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska
        : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii
        : lower48).invert(coordinates);
  };

  albersUsa.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
        .stream(pointStream);

    alaskaPoint = alaska
        .translate([x - 0.307 * k, y + 0.201 * k])
        .clipExtent([[x - 0.425 * k + epsilon, y + 0.120 * k + epsilon], [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    hawaiiPoint = hawaii
        .translate([x - 0.205 * k, y + 0.212 * k])
        .clipExtent([[x - 0.214 * k + epsilon, y + 0.166 * k + epsilon], [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
        .stream(pointStream);

    return reset();
  };

  albersUsa.fitExtent = function(extent, object) {
    return fitExtent(albersUsa, extent, object);
  };

  albersUsa.fitSize = function(size, object) {
    return fitSize(albersUsa, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }

  return albersUsa.scale(1070);
};

function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = cos(x),
        cy = cos(y),
        k = scale(cx * cy);
    return [
      k * cy * sin(x),
      k * sin(y)
    ];
  }
}

function azimuthalInvert(angle) {
  return function(x, y) {
    var z = sqrt(x * x + y * y),
        c = angle(z),
        sc = sin(c),
        cc = cos(c);
    return [
      atan2(x * sc, z * cc),
      asin(z && y * sc / z)
    ];
  }
}

var azimuthalEqualAreaRaw = azimuthalRaw(function(cxcy) {
  return sqrt(2 / (1 + cxcy));
});

azimuthalEqualAreaRaw.invert = azimuthalInvert(function(z) {
  return 2 * asin(z / 2);
});

var azimuthalEqualArea = function() {
  return projection(azimuthalEqualAreaRaw)
      .scale(124.75)
      .clipAngle(180 - 1e-3);
};

var azimuthalEquidistantRaw = azimuthalRaw(function(c) {
  return (c = acos(c)) && c / sin(c);
});

azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
  return z;
});

var azimuthalEquidistant = function() {
  return projection(azimuthalEquidistantRaw)
      .scale(79.4188)
      .clipAngle(180 - 1e-3);
};

function mercatorRaw(lambda, phi) {
  return [lambda, log(tan((halfPi + phi) / 2))];
}

mercatorRaw.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi];
};

var mercator = function() {
  return mercatorProjection(mercatorRaw)
      .scale(961 / tau);
};

function mercatorProjection(project) {
  var m = projection(project),
      center = m.center,
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null, y0, x1, y1; // clip extent

  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.center = function(_) {
    return arguments.length ? (center(_), reclip()) : center();
  };

  m.clipExtent = function(_) {
    return arguments.length ? ((_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1])), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  function reclip() {
    var k = pi * scale(),
        t = m(rotation(m.rotate()).invert([0, 0]));
    return clipExtent(x0 == null
        ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw
        ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]
        : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
  }

  return reclip();
}

function tany(y) {
  return tan((halfPi + y) / 2);
}

function conicConformalRaw(y0, y1) {
  var cy0 = cos(y0),
      n = y0 === y1 ? sin(y0) : log(cy0 / cos(y1)) / log(tany(y1) / tany(y0)),
      f = cy0 * pow(tany(y0), n) / n;

  if (!n) return mercatorRaw;

  function project(x, y) {
    if (f > 0) { if (y < -halfPi + epsilon) y = -halfPi + epsilon; }
    else { if (y > halfPi - epsilon) y = halfPi - epsilon; }
    var r = f / pow(tany(y), n);
    return [r * sin(n * x), f - r * cos(n * x)];
  }

  project.invert = function(x, y) {
    var fy = f - y, r = sign(n) * sqrt(x * x + fy * fy);
    return [atan2(x, abs(fy)) / n * sign(fy), 2 * atan(pow(f / r, 1 / n)) - halfPi];
  };

  return project;
}

var conicConformal = function() {
  return conicProjection(conicConformalRaw)
      .scale(109.5)
      .parallels([30, 30]);
};

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

equirectangularRaw.invert = equirectangularRaw;

var equirectangular = function() {
  return projection(equirectangularRaw)
      .scale(152.63);
};

function conicEquidistantRaw(y0, y1) {
  var cy0 = cos(y0),
      n = y0 === y1 ? sin(y0) : (cy0 - cos(y1)) / (y1 - y0),
      g = cy0 / n + y0;

  if (abs(n) < epsilon) return equirectangularRaw;

  function project(x, y) {
    var gy = g - y, nx = n * x;
    return [gy * sin(nx), g - gy * cos(nx)];
  }

  project.invert = function(x, y) {
    var gy = g - y;
    return [atan2(x, abs(gy)) / n * sign(gy), g - sign(n) * sqrt(x * x + gy * gy)];
  };

  return project;
}

var conicEquidistant = function() {
  return conicProjection(conicEquidistantRaw)
      .scale(131.154)
      .center([0, 13.9389]);
};

function gnomonicRaw(x, y) {
  var cy = cos(y), k = cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}

gnomonicRaw.invert = azimuthalInvert(atan);

var gnomonic = function() {
  return projection(gnomonicRaw)
      .scale(144.049)
      .clipAngle(60);
};

function scaleTranslate(kx, ky, tx, ty) {
  return kx === 1 && ky === 1 && tx === 0 && ty === 0 ? identity : transformer({
    point: function(x, y) {
      this.stream.point(x * kx + tx, y * ky + ty);
    }
  });
}

var identity$1 = function() {
  var k = 1, tx = 0, ty = 0, sx = 1, sy = 1, transform$$1 = identity, // scale, translate and reflect
      x0 = null, y0, x1, y1, clip = identity, // clip extent
      cache,
      cacheStream,
      projection;

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return projection = {
    stream: function(stream) {
      return cache && cacheStream === stream ? cache : cache = transform$$1(clip(cacheStream = stream));
    },
    clipExtent: function(_) {
      return arguments.length ? (clip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
    },
    scale: function(_) {
      return arguments.length ? (transform$$1 = scaleTranslate((k = +_) * sx, k * sy, tx, ty), reset()) : k;
    },
    translate: function(_) {
      return arguments.length ? (transform$$1 = scaleTranslate(k * sx, k * sy, tx = +_[0], ty = +_[1]), reset()) : [tx, ty];
    },
    reflectX: function(_) {
      return arguments.length ? (transform$$1 = scaleTranslate(k * (sx = _ ? -1 : 1), k * sy, tx, ty), reset()) : sx < 0;
    },
    reflectY: function(_) {
      return arguments.length ? (transform$$1 = scaleTranslate(k * sx, k * (sy = _ ? -1 : 1), tx, ty), reset()) : sy < 0;
    },
    fitExtent: function(extent$$1, object) {
      return fitExtent(projection, extent$$1, object);
    },
    fitSize: function(size, object) {
      return fitSize(projection, size, object);
    }
  };
};

function naturalEarth1Raw(lambda, phi) {
  var phi2 = phi * phi, phi4 = phi2 * phi2;
  return [
    lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))),
    phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))
  ];
}

naturalEarth1Raw.invert = function(x, y) {
  var phi = y, i = 25, delta;
  do {
    var phi2 = phi * phi, phi4 = phi2 * phi2;
    phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) /
        (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
  } while (abs(delta) > epsilon && --i > 0);
  return [
    x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))),
    phi
  ];
};

var naturalEarth1 = function() {
  return projection(naturalEarth1Raw)
      .scale(175.295);
};

function orthographicRaw(x, y) {
  return [cos(y) * sin(x), sin(y)];
}

orthographicRaw.invert = azimuthalInvert(asin);

var orthographic = function() {
  return projection(orthographicRaw)
      .scale(249.5)
      .clipAngle(90 + epsilon);
};

function stereographicRaw(x, y) {
  var cy = cos(y), k = 1 + cos(x) * cy;
  return [cy * sin(x) / k, sin(y) / k];
}

stereographicRaw.invert = azimuthalInvert(function(z) {
  return 2 * atan(z);
});

var stereographic = function() {
  return projection(stereographicRaw)
      .scale(250)
      .clipAngle(142);
};

function transverseMercatorRaw(lambda, phi) {
  return [log(tan((halfPi + phi) / 2)), -lambda];
}

transverseMercatorRaw.invert = function(x, y) {
  return [-y, 2 * atan(exp(x)) - halfPi];
};

var transverseMercator = function() {
  var m = mercatorProjection(transverseMercatorRaw),
      center = m.center,
      rotate = m.rotate;

  m.center = function(_) {
    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
  };

  m.rotate = function(_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };

  return rotate([0, 0, 90])
      .scale(159.155);
};

exports.geoArea = area;
exports.geoBounds = bounds;
exports.geoCentroid = centroid;
exports.geoCircle = circle;
exports.geoClipExtent = extent;
exports.geoContains = contains;
exports.geoDistance = distance;
exports.geoGraticule = graticule;
exports.geoGraticule10 = graticule10;
exports.geoInterpolate = interpolate;
exports.geoLength = length;
exports.geoPath = index;
exports.geoAlbers = albers;
exports.geoAlbersUsa = albersUsa;
exports.geoAzimuthalEqualArea = azimuthalEqualArea;
exports.geoAzimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
exports.geoAzimuthalEquidistant = azimuthalEquidistant;
exports.geoAzimuthalEquidistantRaw = azimuthalEquidistantRaw;
exports.geoConicConformal = conicConformal;
exports.geoConicConformalRaw = conicConformalRaw;
exports.geoConicEqualArea = conicEqualArea;
exports.geoConicEqualAreaRaw = conicEqualAreaRaw;
exports.geoConicEquidistant = conicEquidistant;
exports.geoConicEquidistantRaw = conicEquidistantRaw;
exports.geoEquirectangular = equirectangular;
exports.geoEquirectangularRaw = equirectangularRaw;
exports.geoGnomonic = gnomonic;
exports.geoGnomonicRaw = gnomonicRaw;
exports.geoIdentity = identity$1;
exports.geoProjection = projection;
exports.geoProjectionMutator = projectionMutator;
exports.geoMercator = mercator;
exports.geoMercatorRaw = mercatorRaw;
exports.geoNaturalEarth1 = naturalEarth1;
exports.geoNaturalEarth1Raw = naturalEarth1Raw;
exports.geoOrthographic = orthographic;
exports.geoOrthographicRaw = orthographicRaw;
exports.geoStereographic = stereographic;
exports.geoStereographicRaw = stereographicRaw;
exports.geoTransverseMercator = transverseMercator;
exports.geoTransverseMercatorRaw = transverseMercatorRaw;
exports.geoRotation = rotation;
exports.geoStream = geoStream;
exports.geoTransform = transform;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{"d3-array":36}],38:[function(require,module,exports){
module.exports = require('./lib/jsurl');
},{"./lib/jsurl":39}],39:[function(require,module,exports){
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
//
(function(exports) {
	"use strict";
	exports.stringify = function stringify(v) {
		function encode(s) {
			return !/[^\w-.]/.test(s) ? s : s.replace(/[^\w-.]/g, function(ch) {
				if (ch === '$') return '!';
				ch = ch.charCodeAt(0);
				// thanks to Douglas Crockford for the negative slice trick
				return ch < 0x100 ? '*' + ('00' + ch.toString(16)).slice(-2) : '**' + ('0000' + ch.toString(16)).slice(-4);
			});
		}

		var tmpAry;

		switch (typeof v) {
			case 'number':
				return isFinite(v) ? '~' + v : '~null';
			case 'boolean':
				return '~' + v;
			case 'string':
				return "~'" + encode(v);
			case 'object':
				if (!v) return '~null';

				tmpAry = [];

				if (Array.isArray(v)) {
					for (var i = 0; i < v.length; i++) {
						tmpAry[i] = stringify(v[i]) || '~null';
					}

					return '~(' + (tmpAry.join('') || '~') + ')';
				} else {
					for (var key in v) {
						if (v.hasOwnProperty(key)) {
							var val = stringify(v[key]);

							// skip undefined and functions
							if (val) {
								tmpAry.push(encode(key) + val);
							}
						}
					}

					return '~(' + tmpAry.join('~') + ')';
				}
			default:
				// function, undefined
				return;
		}
	};

	var reserved = {
		"true": true,
		"false": false,
		"null": null
	};

	exports.parse = function(s) {
		if (!s) return s;
		s = s.replace(/%(25)*27/g, "'");
		var i = 0,
			len = s.length;

		function eat(expected) {
			if (s.charAt(i) !== expected) throw new Error("bad JSURL syntax: expected " + expected + ", got " + (s && s.charAt(i)));
			i++;
		}

		function decode() {
			var beg = i,
				ch, r = "";
			while (i < len && (ch = s.charAt(i)) !== '~' && ch !== ')') {
				switch (ch) {
					case '*':
						if (beg < i) r += s.substring(beg, i);
						if (s.charAt(i + 1) === '*') r += String.fromCharCode(parseInt(s.substring(i + 2, i + 6), 16)), beg = (i += 6);
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
			switch (ch = s.charAt(i)) {
				case '(':
					i++;
					if (s.charAt(i) === '~') {
						result = [];
						if (s.charAt(i + 1) === ')') i++;
						else {
							do {
								result.push(parseOne());
							} while (s.charAt(i) === '~');
						}
					} else {
						result = {};
						if (s.charAt(i) !== ')') {
							do {
								var key = decode();
								result[key] = parseOne();
							} while (s.charAt(i) === '~' && ++i);
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
					while (i < len && /[^)~]/.test(s.charAt(i)))
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

	exports.tryParse = function(s, def) {
		try {
			return exports.parse(s);
		} catch (ex) {
			return def;
		}
	}

})(typeof exports !== 'undefined' ? exports : (window.JSURL = window.JSURL || {}));

},{}],40:[function(require,module,exports){
(function(previousMethods){
if (typeof previousMethods === 'undefined') {
    // Defining previously that object allows you to use that plugin even if you have overridden L.map
    previousMethods = {
        getCenter: L.Map.prototype.getCenter,
        setView: L.Map.prototype.setView,
        flyTo: L.Map.prototype.flyTo,
        setZoomAround: L.Map.prototype.setZoomAround,
        getBoundsZoom: L.Map.prototype.getBoundsZoom,
        PopupAdjustPan: L.Popup.prototype._adjustPan,
        RendererUpdate: L.Renderer.prototype._update
    };
}

L.Map.include({

    // Overrides L.Map.getBounds
    getBounds: function() {
        if (this._viewport) {
            return this.getViewportLatLngBounds()
        } else {
            var bounds = this.getPixelBounds(),
            sw = this.unproject(bounds.getBottomLeft()),
            ne = this.unproject(bounds.getTopRight());

            return new L.LatLngBounds(sw, ne);
        }
    },

    // Extends L.Map
    getViewport: function() {
        return this._viewport;
    },

    // Extends L.Map
    getViewportBounds: function() {
        var vp = this._viewport,
            topleft = L.point(vp.offsetLeft, vp.offsetTop),
            vpsize = L.point(vp.clientWidth, vp.clientHeight);

        if (vpsize.x === 0 || vpsize.y === 0) {
            //Our own viewport has no good size - so we fallback to the container size:
            vp = this.getContainer();
            if(vp){
              topleft = L.point(0, 0);
              vpsize = L.point(vp.clientWidth, vp.clientHeight);
            }

        }

        return L.bounds(topleft, topleft.add(vpsize));
    },

    // Extends L.Map
    getViewportLatLngBounds: function() {
        var bounds = this.getViewportBounds();
        return L.latLngBounds(this.containerPointToLatLng(bounds.min), this.containerPointToLatLng(bounds.max));
    },

    // Extends L.Map
    getOffset: function() {
        var mCenter = this.getSize().divideBy(2),
            vCenter = this.getViewportBounds().getCenter();

        return mCenter.subtract(vCenter);
    },

    // Overrides L.Map.getCenter
    getCenter: function (withoutViewport) {
        var center = previousMethods.getCenter.call(this);

        if (this.getViewport() && !withoutViewport) {
            var zoom = this.getZoom(),
                point = this.project(center, zoom);
            point = point.subtract(this.getOffset());

            center = this.unproject(point, zoom);
        }

        return center;
    },

    // Overrides L.Map.setView
    setView: function (center, zoom, options) {
        center = L.latLng(center);
        zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);

        if (this.getViewport()) {
            var point = this.project(center, this._limitZoom(zoom));
            point = point.add(this.getOffset());
            center = this.unproject(point, this._limitZoom(zoom));
        }

        return previousMethods.setView.call(this, center, zoom, options);
    },

    // Overrides L.Map.flyTo
    flyTo: function (targetCenter, targetZoom, options) {
        targetCenter = L.latLng(targetCenter);
        targetZoom = targetZoom === undefined ? startZoom : targetZoom;

        if (this.getViewport()) {
            var point = this.project(targetCenter, this._limitZoom(targetZoom));
            point = point.add(this.getOffset());
            targetCenter = this.unproject(point, this._limitZoom(targetZoom));
        }

        options = options || {};
        if (options.animate === false || !L.Browser.any3d) {
            return this.setView(targetCenter, targetZoom, options);
        }

        this._stop();

        var from = this.project(previousMethods.getCenter.call(this)),
            to = this.project(targetCenter),
            size = this.getSize(),
            startZoom = this._zoom;


        var w0 = Math.max(size.x, size.y),
            w1 = w0 * this.getZoomScale(startZoom, targetZoom),
            u1 = (to.distanceTo(from)) || 1,
            rho = 1.42,
            rho2 = rho * rho;

        function r(i) {
            var s1 = i ? -1 : 1,
                s2 = i ? w1 : w0,
                t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
                b1 = 2 * s2 * rho2 * u1,
                b = t1 / b1,
                sq = Math.sqrt(b * b + 1) - b;

                // workaround for floating point precision bug when sq = 0, log = -Infinite,
                // thus triggering an infinite loop in flyTo
                var log = sq < 0.000000001 ? -18 : Math.log(sq);

            return log;
        }

        function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
        function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
        function tanh(n) { return sinh(n) / cosh(n); }

        var r0 = r(0);

        function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
        function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

        function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

        var start = Date.now(),
            S = (r(1) - r0) / rho,
            duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

        function frame() {
            var t = (Date.now() - start) / duration,
                s = easeOut(t) * S;

            if (t <= 1) {
                this._flyToFrame = L.Util.requestAnimFrame(frame, this);

                this._move(
                    this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
                    this.getScaleZoom(w0 / w(s), startZoom),
                    {flyTo: true});

            } else {
                this
                    ._move(targetCenter, targetZoom)
                    ._moveEnd(true);
            }
        }

        this._moveStart(true, options.noMoveStart);

        frame.call(this);
        return this;
    },

    // Overrides L.Map.setZoomAround
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
            return previousMethods.setZoomAround.call(this, latlng, zoom, options);
        }
    },

    // Overrides L.Map.getBoundsZoom
    getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
        bounds = L.latLngBounds(bounds);
        padding = L.point(padding || [0, 0]);

        var zoom = this.getZoom() || 0,
            min = this.getMinZoom(),
            max = this.getMaxZoom(),
            nw = bounds.getNorthWest(),
            se = bounds.getSouthEast(),
            vp = this.getViewport(),
            size = (vp ? L.point(vp.clientWidth, vp.clientHeight) : this.getSize()).subtract(padding),
            boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)),
            snap = L.Browser.any3d ? this.options.zoomSnap : 1,
            scalex = size.x / boundsSize.x,
            scaley = size.y / boundsSize.y,
            scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

        zoom = this.getScaleZoom(scale, zoom);

        if (snap) {
            zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
            zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
        }

        return Math.max(min, Math.min(max, zoom));
    },

    // Extends L.Map
    setActiveArea: function (css, keepCenter, animate) {
        var center;
        if (keepCenter && this._zoom) {
            // save center if map is already initialized
            // and keepCenter is passed
            center = this.getCenter();
        }

        if( !this._viewport ){
            //Make viewport if not already made
            var container = this.getContainer();
            this._viewport = L.DomUtil.create('div', '');
            container.insertBefore(this._viewport, container.firstChild);
        }

        if (typeof css === 'string') {
            this._viewport.className = css;
        } else {
            L.extend(this._viewport.style, css);
        }

        if (center) {
            this.setView(center, this.getZoom(), { animate: !!animate });
        }
        return this;
    }
});

L.Renderer.include({

    // Overrides L.Renderer._onZoom
    _onZoom: function () {
        this._updateTransform(this._map.getCenter(true), this._map.getZoom());
    },

    // Overrides L.Renderer._update
    _update: function () {
        previousMethods.RendererUpdate.call(this);
        this._center = this._map.getCenter(true);
    }
});

L.GridLayer.include({

    // Overrides L.GridLayer._updateLevels
    _updateLevels: function () {

        var zoom = this._tileZoom,
            maxZoom = this.options.maxZoom;

        if (zoom === undefined) { return undefined; }

        for (var z in this._levels) {
            z = Number(z);
            if (this._levels[z].el.children.length || z === zoom) {
                this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
                this._onUpdateLevel(z);
            } else {
                L.DomUtil.remove(this._levels[z].el);
                this._removeTilesAtZoom(z);
                this._onRemoveLevel(z);
                delete this._levels[z];
            }
        }

        var level = this._levels[zoom],
            map = this._map;

        if (!level) {
            level = this._levels[zoom] = {};

            level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
            level.el.style.zIndex = maxZoom;

            level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
            level.zoom = zoom;

            this._setZoomTransform(level, map.getCenter(true), map.getZoom());

            // force the browser to consider the newly added element for transition
            L.Util.falseFn(level.el.offsetWidth);

            this._onCreateLevel(level);
        }

        this._level = level;

        return level;
    },

    // Overrides L.GridLayer._resetView
    _resetView: function (e) {
        var animating = e && (e.pinch || e.flyTo);
        this._setView(this._map.getCenter(true), this._map.getZoom(), animating, animating);
    },

    // Overrides L.GridLayer._update
    _update: function (center) {
        var map = this._map;
        if (!map) { return; }
        var zoom = this._clampZoom(map.getZoom());

        if (center === undefined) { center = map.getCenter(true); }
        if (this._tileZoom === undefined) { return; }   // if out of minzoom/maxzoom

        var pixelBounds = this._getTiledPixelBounds(center),
            tileRange = this._pxBoundsToTileRange(pixelBounds),
            tileCenter = tileRange.getCenter(),
            queue = [],
            margin = this.options.keepBuffer,
            noPruneRange = new L.Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
                                        tileRange.getTopRight().add([margin, -margin]));

        // Sanity check: panic if the tile range contains Infinity somewhere.
        if (!(isFinite(tileRange.min.x) &&
              isFinite(tileRange.min.y) &&
              isFinite(tileRange.max.x) &&
              isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

        for (var key in this._tiles) {
            var c = this._tiles[key].coords;
            if (c.z !== this._tileZoom || !noPruneRange.contains(new L.Point(c.x, c.y))) {
                this._tiles[key].current = false;
            }
        }

        // _update just loads more tiles. If the tile zoom level differs too much
        // from the map's, let _setView reset levels and prune old tiles.
        if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

        // create a queue of coordinates to load tiles from
        for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
            for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
                var coords = new L.Point(i, j);
                coords.z = this._tileZoom;

                if (!this._isValidTile(coords)) { continue; }

                var tile = this._tiles[this._tileCoordsToKey(coords)];
                if (tile) {
                    tile.current = true;
                } else {
                    queue.push(coords);
                }
            }
        }

        // sort tile queue to load tiles in order of their distance to center
        queue.sort(function (a, b) {
            return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
        });

        if (queue.length !== 0) {
            // if it's the first batch of tiles to load
            if (!this._loading) {
                this._loading = true;
                // @event loading: Event
                // Fired when the grid layer starts loading tiles.
                this.fire('loading');
            }

            // create DOM fragment to append tiles in one batch
            var fragment = document.createDocumentFragment();

            for (i = 0; i < queue.length; i++) {
                this._addTile(queue[i], fragment);
            }

            this._level.el.appendChild(fragment);
        }
    }
});

L.Popup.include({

    // Overrides L.Popup._adjustPan
    _adjustPan: function () {
        if (!this._map._viewport) {
            previousMethods.PopupAdjustPan.call(this);
        } else {
            if (!this.options.autoPan) { return; }
            if (this._map._panAnim) { this._map._panAnim.stop(); }

            var map = this._map,
                vp = map._viewport,
                containerHeight = this._container.offsetHeight,
                containerWidth = this._containerWidth,
                vpTopleft = L.point(vp.offsetLeft, vp.offsetTop),

                layerPos = new L.Point(
                    this._containerLeft - vpTopleft.x,
                    - containerHeight - this._containerBottom - vpTopleft.y);

            layerPos._add(L.DomUtil.getPosition(this._container));

            var containerPos = map.layerPointToContainerPoint(layerPos),
                padding = L.point(this.options.autoPanPadding),
                paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
                paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
                size = L.point(vp.clientWidth, vp.clientHeight),
                dx = 0,
                dy = 0;

            if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
                dx = containerPos.x + containerWidth - size.x + paddingBR.x;
            }
            if (containerPos.x - dx - paddingTL.x < 0) { // left
                dx = containerPos.x - paddingTL.x;
            }
            if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
                dy = containerPos.y + containerHeight - size.y + paddingBR.y;
            }
            if (containerPos.y - dy - paddingTL.y < 0) { // top
                dy = containerPos.y - paddingTL.y;
            }

            // @namespace Map
            // @section Popup events
            // @event autopanstart: Event
            // Fired when the map starts autopanning when opening a popup.
            if (dx || dy) {
                map
                    .fire('autopanstart')
                    .panBy([dx, dy]);
            }
        }
    }
});

})(window.leafletActiveAreaPreviousMethods);

},{}],41:[function(require,module,exports){
// Bing maps API: https://docs.microsoft.com/en-us/bingmaps/rest-services/

L.BingLayer = L.TileLayer.extend({
	options: {
		// imagerySet: https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-imagery-metadata#template-parameters
		// supported:
		// - Aerial, AerialWithLabels (Deprecated), AerialWithLabelsOnDemand
		// - Road (Deprecated), RoadOnDemand
		// - CanvasDark, CanvasLight, CanvasGray
		// not supported: Birdseye*, Streetside
		imagerySet: 'Aerial', // to be changed on next major version!!

		// https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/supported-culture-codes
		culture: '',

		// https://docs.microsoft.com/en-us/bingmaps/articles/custom-map-styles-in-bing-maps#custom-map-styles-in-the-rest-and-tile-services
		style: '',

		// https://blogs.bing.com/maps/2015/02/12/high-ppi-maps-now-available-in-the-bing-maps-ajax-control
		// not documented in REST API docs, but working
		// warning: deprecated imagery sets may not support some values (depending also on zoom level)
		retinaDpi: 'd2',

		attribution: 'Bing',
		minZoom: 1,
		maxZoom: 21
		// Actual `maxZoom` value may be less, depending on imagery set / coverage area
		// - 19~20 for all 'Aerial*'
		// - 20 for 'Road' (Deprecated)
	},

	initialize: function (key, options) {
		if (typeof key === 'object') {
			options = key;
			key = false;
		}
		L.TileLayer.prototype.initialize.call(this, null, options);

		options = this.options;
		options.key = options.key || options.bingMapsKey;
		options.imagerySet = options.imagerySet || options.type;
		if (key) { options.key = key; }
	},

	tile2quad: function (x, y, z) {
		var quad = '';
		for (var i = z; i > 0; i--) {
			var digit = 0;
			var mask = 1 << i - 1;
			if ((x & mask) !== 0) { digit += 1; }
			if ((y & mask) !== 0) { digit += 2; }
			quad = quad + digit;
		}
		return quad;
	},

	getTileUrl: function (coords) {
		var data = {
			subdomain: this._getSubdomain(coords),
			quadkey: this.tile2quad(coords.x, coords.y, this._getZoomForUrl()),
			culture: this.options.culture // compatibility for deprecated imagery sets ('Road' etc)
		};
		return L.Util.template(this._url, data);
	},

	callRestService: function (request, callback, context) {
		context = context || this;
		var uniqueName = '_bing_metadata_' + L.Util.stamp(this);
		while (window[uniqueName]) { uniqueName += '_'; }
		request += '&jsonp=' + uniqueName;
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', request);
		window[uniqueName] = function (response) {
			delete window[uniqueName];
			script.remove();
			if (response.errorDetails) {
				throw new Error(response.errorDetails);
			}
			callback.call(context, response);
		};
		document.body.appendChild(script);
	},

	_makeApiUrl: function (restApi, resourcePath, query) {
		var baseAPIparams = {
			version: 'v1',
			restApi: restApi,
			resourcePath: resourcePath
		};
		query = L.extend({
			// errorDetail: true, // seems no effect
			key: this.options.key
		}, query);

		// https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/base-url-structure
		var template = 'https://dev.virtualearth.net/REST/{version}/{restApi}/{resourcePath}'; // ?queryParameters&key=BingMapsKey
		return L.Util.template(template, baseAPIparams) + L.Util.getParamString(query);
	},

	loadMetadata: function () {
		if (this.metaRequested) { return; }
		this.metaRequested = true;
		var options = this.options;
		// https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-imagery-metadata#complete-metadata-urls
		var request = this._makeApiUrl('Imagery/Metadata', options.imagerySet, {
			UriScheme: 'https',
			include: 'ImageryProviders',
			culture: options.culture,
			style: options.style
		});
		this.callRestService(request, function (meta) {
			var r = meta.resourceSets[0].resources[0];
			if (!r.imageUrl) { throw new Error('imageUrl not found in response'); }
			if (r.imageUrlSubdomains) { options.subdomains = r.imageUrlSubdomains; }
			this._providers = r.imageryProviders ? this._prepAttrBounds(r.imageryProviders) : [];
			this._attributions = [];
			this._url = r.imageUrl;
			if (options.retinaDpi && options.detectRetina && options.zoomOffset) {
				this._url += '&dpi=' + options.retinaDpi;
			}
			this.fire('load', {meta: meta});
			if (this._map) { this._update(); }
		});
	},

	_prepAttrBounds: function (providers) {
		providers.forEach(function (provider) {
			provider.coverageAreas.forEach(function (area) {
				area.bounds = L.latLngBounds(
					[area.bbox[0], area.bbox[1]],
					[area.bbox[2], area.bbox[3]]
				);
			});
		});
		return providers;
	},

	_update: function (center) {
		if (!this._url) { return; }
		L.GridLayer.prototype._update.call(this, center);
		this._update_attribution();
	},

	_update_attribution: function (remove) {
		var attributionControl = this._map.attributionControl;
		if (!attributionControl) {
			this._attributions = {}; return;
		}
		var bounds = this._map.getBounds();
		bounds = L.latLngBounds(bounds.getSouthWest().wrap(), bounds.getNorthEast().wrap());
		var zoom = this._getZoomForUrl();
		var attributions = this._providers.map(function (provider) {
			return remove ? false : provider.coverageAreas.some(function (area) {
				return zoom <= area.zoomMax && zoom >= area.zoomMin &&
					bounds.intersects(area.bounds);
			});
		});
		attributions.forEach(function (a,i) {
			if (a == this._attributions[i]) { // eslint-disable-line eqeqeq
				return;
			} else if (a) {
				attributionControl.addAttribution(this._providers[i].attribution);
			} else {
				attributionControl.removeAttribution(this._providers[i].attribution);
			}
		}, this);
		this._attributions = attributions;
	},

	onAdd: function (map) {
		// Note: Metadata could be loaded earlier, on layer initialize,
		//       but according to docs even such request is billable:
		//       https://docs.microsoft.com/en-us/bingmaps/getting-started/bing-maps-dev-center-help/understanding-bing-maps-transactions#rest-services
		//       That's why it's important to defer it till BingLayer is actually added to map
		this.loadMetadata();
		L.GridLayer.prototype.onAdd.call(this, map);
	},

	onRemove: function (map) {
		if (this._providers) { this._update_attribution(true); }
		L.GridLayer.prototype.onRemove.call(this, map);
	}
});

L.bingLayer = function (key, options) {
	return new L.BingLayer(key, options);
};

},{}],42:[function(require,module,exports){
module.exports = function pointInPolygonFlat (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = (end-start)/2;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[start+i*2+0], yi = vs[start+i*2+1];
        var xj = vs[start+j*2+0], yj = vs[start+j*2+1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

},{}],43:[function(require,module,exports){
var pointInPolygonFlat = require('./flat.js')
var pointInPolygonNested = require('./nested.js')

module.exports = function pointInPolygon (point, vs, start, end) {
    if (vs.length > 0 && Array.isArray(vs[0])) {
        return pointInPolygonNested(point, vs, start, end);
    } else {
        return pointInPolygonFlat(point, vs, start, end);
    }
}
module.exports.nested = pointInPolygonNested
module.exports.flat = pointInPolygonFlat

},{"./flat.js":42,"./nested.js":44}],44:[function(require,module,exports){
// ray-casting algorithm based on
// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

module.exports = function pointInPolygonNested (point, vs, start, end) {
    var x = point[0], y = point[1];
    var inside = false;
    if (start === undefined) start = 0;
    if (end === undefined) end = vs.length;
    var len = end - start;
    for (var i = 0, j = len - 1; i < len; j = i++) {
        var xi = vs[i+start][0], yi = vs[i+start][1];
        var xj = vs[j+start][0], yj = vs[j+start][1];
        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

},{}],45:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":46,"./encode":47}],49:[function(require,module,exports){
!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t=t||self).RBush=i()}(this,function(){"use strict";function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h)}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1)}}(t,r,e||0,a||t.length-1,h||n)}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return-1}function a(t,i){h(t,0,t.children.length,i,t)}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h)}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r)}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h))}i=e.pop()}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return!1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return!0;n.push(e)}}i=n.pop()}return!1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var r=this.data;this.data=n,n=r}this._insert(n,this.data.height-n.height-1,!0)}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0])}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1))}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s)}i=h||i.children[0]}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i)},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o)},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox)},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p)}return r||n-i},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r)},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a)}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s)}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t)},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox)},r});

},{}],50:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).predicates={})}(this,function(t){"use strict";const e=134217729,n=33306690738754706e-32;function r(t,e,n,r,o){let f,i,u,c,s=e[0],a=r[0],d=0,l=0;a>s==a>-s?(f=s,s=e[++d]):(f=a,a=r[++l]);let p=0;if(d<t&&l<n)for(a>s==a>-s?(u=f-((i=s+f)-s),s=e[++d]):(u=f-((i=a+f)-a),a=r[++l]),f=i,0!==u&&(o[p++]=u);d<t&&l<n;)a>s==a>-s?(u=f-((i=f+s)-(c=i-f))+(s-c),s=e[++d]):(u=f-((i=f+a)-(c=i-f))+(a-c),a=r[++l]),f=i,0!==u&&(o[p++]=u);for(;d<t;)u=f-((i=f+s)-(c=i-f))+(s-c),s=e[++d],f=i,0!==u&&(o[p++]=u);for(;l<n;)u=f-((i=f+a)-(c=i-f))+(a-c),a=r[++l],f=i,0!==u&&(o[p++]=u);return 0===f&&0!==p||(o[p++]=f),p}function o(t){return new Float64Array(t)}const f=33306690738754716e-32,i=22204460492503146e-32,u=11093356479670487e-47,c=o(4),s=o(8),a=o(12),d=o(16),l=o(4);t.orient2d=function(t,o,p,b,y,h){const M=(o-h)*(p-y),x=(t-y)*(b-h),j=M-x;if(0===M||0===x||M>0!=x>0)return j;const m=Math.abs(M+x);return Math.abs(j)>=f*m?j:-function(t,o,f,p,b,y,h){let M,x,j,m,_,v,w,A,F,O,P,g,k,q,z,B,C,D;const E=t-b,G=f-b,H=o-y,I=p-y;_=(z=(A=E-(w=(v=e*E)-(v-E)))*(O=I-(F=(v=e*I)-(v-I)))-((q=E*I)-w*F-A*F-w*O))-(P=z-(C=(A=H-(w=(v=e*H)-(v-H)))*(O=G-(F=(v=e*G)-(v-G)))-((B=H*G)-w*F-A*F-w*O))),c[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),c[1]=k-(P+_)+(_-B),_=(D=g+P)-g,c[2]=g-(D-_)+(P-_),c[3]=D;let J=function(t,e){let n=e[0];for(let r=1;r<t;r++)n+=e[r];return n}(4,c),K=i*h;if(J>=K||-J>=K)return J;if(M=t-(E+(_=t-E))+(_-b),j=f-(G+(_=f-G))+(_-b),x=o-(H+(_=o-H))+(_-y),m=p-(I+(_=p-I))+(_-y),0===M&&0===x&&0===j&&0===m)return J;if(K=u*h+n*Math.abs(J),(J+=E*m+I*M-(H*j+G*x))>=K||-J>=K)return J;_=(z=(A=M-(w=(v=e*M)-(v-M)))*(O=I-(F=(v=e*I)-(v-I)))-((q=M*I)-w*F-A*F-w*O))-(P=z-(C=(A=x-(w=(v=e*x)-(v-x)))*(O=G-(F=(v=e*G)-(v-G)))-((B=x*G)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const L=r(4,c,4,l,s);_=(z=(A=E-(w=(v=e*E)-(v-E)))*(O=m-(F=(v=e*m)-(v-m)))-((q=E*m)-w*F-A*F-w*O))-(P=z-(C=(A=H-(w=(v=e*H)-(v-H)))*(O=j-(F=(v=e*j)-(v-j)))-((B=H*j)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const N=r(L,s,4,l,a);_=(z=(A=M-(w=(v=e*M)-(v-M)))*(O=m-(F=(v=e*m)-(v-m)))-((q=M*m)-w*F-A*F-w*O))-(P=z-(C=(A=x-(w=(v=e*x)-(v-x)))*(O=j-(F=(v=e*j)-(v-j)))-((B=x*j)-w*F-A*F-w*O))),l[0]=z-(P+_)+(_-C),_=(k=q-((g=q+P)-(_=g-q))+(P-_))-(P=k-B),l[1]=k-(P+_)+(_-B),_=(D=g+P)-g,l[2]=g-(D-_)+(P-_),l[3]=D;const Q=r(N,a,4,l,d);return d[Q-1]}(t,o,p,b,y,h,m)},t.orient2dfast=function(t,e,n,r,o,f){return(e-f)*(n-o)-(t-o)*(r-f)},Object.defineProperty(t,"__esModule",{value:!0})});

},{}],51:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":45,"timers":51}],52:[function(require,module,exports){
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
typeof define === 'function' && define.amd ? define(factory) :
(global = global || self, global.TinyQueue = factory());
}(this, function () { 'use strict';

var TinyQueue = function TinyQueue(data, compare) {
    if ( data === void 0 ) data = [];
    if ( compare === void 0 ) compare = defaultCompare;

    this.data = data;
    this.length = this.data.length;
    this.compare = compare;

    if (this.length > 0) {
        for (var i = (this.length >> 1) - 1; i >= 0; i--) { this._down(i); }
    }
};

TinyQueue.prototype.push = function push (item) {
    this.data.push(item);
    this.length++;
    this._up(this.length - 1);
};

TinyQueue.prototype.pop = function pop () {
    if (this.length === 0) { return undefined; }

    var top = this.data[0];
    var bottom = this.data.pop();
    this.length--;

    if (this.length > 0) {
        this.data[0] = bottom;
        this._down(0);
    }

    return top;
};

TinyQueue.prototype.peek = function peek () {
    return this.data[0];
};

TinyQueue.prototype._up = function _up (pos) {
    var ref = this;
        var data = ref.data;
        var compare = ref.compare;
    var item = data[pos];

    while (pos > 0) {
        var parent = (pos - 1) >> 1;
        var current = data[parent];
        if (compare(item, current) >= 0) { break; }
        data[pos] = current;
        pos = parent;
    }

    data[pos] = item;
};

TinyQueue.prototype._down = function _down (pos) {
    var ref = this;
        var data = ref.data;
        var compare = ref.compare;
    var halfLength = this.length >> 1;
    var item = data[pos];

    while (pos < halfLength) {
        var left = (pos << 1) + 1;
        var best = data[left];
        var right = left + 1;

        if (right < this.length && compare(data[right], best) < 0) {
            left = right;
            best = data[right];
        }
        if (compare(best, item) >= 0) { break; }

        data[pos] = best;
        pos = left;
    }

    data[pos] = item;
};

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

return TinyQueue;

}));

},{}],53:[function(require,module,exports){
(function (setImmediate){(function (){
/*!
 * typeahead.js 0.10.5
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

(function($) {
    var _ = function() {
        "use strict";
        return {
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
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
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
    }();
    var VERSION = "0.10.5";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }
        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }
        function getObjTokenizer(tokenizer) {
            return function setKey() {
                var args = [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(args, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";
        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
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
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
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
        "use strict";
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
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
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
        "use strict";
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastUrl = null;
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this, jqXhr;
                if (this.cancelled || url !== this.lastUrl) {
                    return;
                }
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
                    that._cache.set(url, resp);
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
                this.cancelled = false;
                this.lastUrl = url;
                if (resp = this._cache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this._get(url, o, cb);
                }
                return !!resp;
            },
            cancel: function() {
                this.cancelled = true;
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
        "use strict";
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
            for (var i = 0, len = array.length; i < len; i++) {
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
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
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
        "use strict";
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
                cache: true,
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
        "use strict";
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
                if (!this.transport) {
                    return;
                }
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _cancelLastRemoteRequest: function cancelLastRemoteRequest() {
                this.transport && this.transport.cancel();
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
                matches.length < this.limit ? cacheHit = this._getFromRemote(query, returnRemoteMatches) : this._cancelLastRemoteRequest();
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
    var html = function() {
        return {
            wrapper: '<span class="twitter-typeahead"></span>',
            dropdown: '<span class="tt-dropdown-menu"></span>',
            dataset: '<div class="tt-dataset-%CLASS%"></div>',
            suggestions: '<span class="tt-suggestions"></span>',
            suggestion: '<div class="tt-suggestion"></div>'
        };
    }();
    var css = function() {
        "use strict";
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
                boxShadow: "none",
                opacity: "1"
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
        return css;
    }();
    var EventBus = function() {
        "use strict";
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
        "use strict";
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
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
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
        "use strict";
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
                var match, patternNode, wrapperNode;
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
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
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
                this.query = inputValue;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query);
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
        "use strict";
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
                        className: "tt-highlight",
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
        "use strict";
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
        "use strict";
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
            this.$node = buildDom(o.input, o.withHint);
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
                val = _.toStr(val);
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
        function buildDom(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder required").prop("readonly", true).attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
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
        "use strict";
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
            var tts;
            if (methods[method] && method !== "initialize") {
                tts = this.filter(function() {
                    return !!$(this).data(typeaheadKey);
                });
                return methods[method].apply(tts, [].slice.call(arguments, 1));
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
}).call(this)}).call(this,require("timers").setImmediate)
},{"timers":51}],54:[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (function() {
  	var current = global._;
  	var exports = factory();
  	global._ = exports;
  	exports.noConflict = function() { global._ = current; return exports; };
  })();
}(this, (function () {

  //     Underscore.js 1.10.2
  //     https://underscorejs.org
  //     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Create references to these builtin functions because we override them.
  var _isNaN = root.isNaN,
      _isFinite = root.isFinite;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // The Underscore object. All exported functions below are added to it in the
  // modules/index-all.js using the mixin function.
  function _(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  }

  // Current version.
  var VERSION = _.VERSION = '1.10.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = iteratee;
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }

  // The function we actually call internally. It invokes _.iteratee if
  // overridden, otherwise baseIteratee.
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee) return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  function _has(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  function isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements match a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object matches a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction(path)) {
      func = path;
    } else if (isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? clone(obj) : values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
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
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (_has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (_has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Return the number of elements in an object.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Returns everything but the first entry of the array. Especially useful on
  // the arguments object. Passing an **n** will return the rest N values in the
  // array.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Internal implementation of a recursive `flatten` function.
  function _flatten(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          _flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Flatten out an array, either recursively (by default), or just one level.
  function flatten(array, shallow) {
    return _flatten(array, shallow, false);
  }

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(_flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = _flatten(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = array && max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of pairs.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generator function to create the findIndex and findLastIndex functions.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test.
  var findIndex = createPredicateIndexFinder(1);
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Generator function to create the indexOf and lastIndexOf functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  var bind = restArguments(function(func, context, args) {
    if (!isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, _keys) {
    _keys = _flatten(_keys, false, false);
    var index = _keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = _keys[index];
      obj[key] = bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, _keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_has(obj, prop) && !contains(_keys, prop)) _keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !contains(_keys, prop)) {
        _keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var _keys = [];
    for (var key in obj) if (_has(obj, key)) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve all the property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var _keys = [];
    for (var key in obj) _keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, _keys);
    return _keys;
  }

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to map it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of object.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            _keys = keysFunc(source),
            l = _keys.length;
        for (var i = 0; i < l; i++) {
          var key = _keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Returns the first key on an object that passes a predicate test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal pick helper function to determine if `obj` has key `key`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the whitelisted properties.
  var pick = restArguments(function(obj, _keys) {
    var result = {}, iteratee = _keys[0];
    if (obj == null) return result;
    if (isFunction(iteratee)) {
      if (_keys.length > 1) iteratee = optimizeCb(iteratee, _keys[1]);
      _keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      _keys = _flatten(_keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = _keys.length; i < length; i++) {
      var key = _keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  var omit = restArguments(function(obj, _keys) {
    var iteratee = _keys[0], context;
    if (isFunction(iteratee)) {
      iteratee = negate(iteratee);
      if (_keys.length > 1) context = _keys[1];
    } else {
      _keys = map(_flatten(_keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(_keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }


  // Internal recursive comparison function for `isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(_has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (isArray(obj) || isString(obj) || isArguments(obj))) return obj.length === 0;
    return keys(obj).length === 0;
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a toString-based type tester.
  function tagTester(name) {
    return function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  }

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  var isArray = nativeIsArray || tagTester('Array');

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  var isArguments = tagTester('Arguments');
  var isFunction = tagTester('Function');
  var isString = tagTester('String');
  var isNumber = tagTester('Number');
  var isDate = tagTester('Date');
  var isRegExp = tagTester('RegExp');
  var isError = tagTester('Error');
  var isSymbol = tagTester('Symbol');
  var isMap = tagTester('Map');
  var isWeakMap = tagTester('WeakMap');
  var isSet = tagTester('Set');
  var isWeakSet = tagTester('WeakSet');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return _has(obj, 'callee');
      };
    }
  }());

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  function isFinite(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !_isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  function has(obj, path) {
    if (!isArray(path)) {
      return _has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  }

  // Utility Functions
  // -----------------

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Predicate-generating functions. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  function noop(){}

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  function property(path) {
    if (!isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !isArray(path) ? obj[path] : deepGet(obj, path);
    };
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between min and max (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }
  var escape = createEscaper(escapeMap);
  var unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    if (!isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  var templateSettings = _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  var allExports = ({
    'default': _,
    VERSION: VERSION,
    iteratee: iteratee,
    restArguments: restArguments,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    find: find,
    detect: find,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    findWhere: findWhere,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    toArray: toArray,
    size: size,
    partition: partition,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    zip: zip,
    object: object,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    range: range,
    chunk: chunk,
    bind: bind,
    partial: partial,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    keys: keys,
    allKeys: allKeys,
    values: values,
    mapObject: mapObject,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    findKey: findKey,
    pick: pick,
    omit: omit,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    isMatch: isMatch,
    isEqual: isEqual,
    isEmpty: isEmpty,
    isElement: isElement,
    isArray: isArray,
    isObject: isObject,
    isArguments: isArguments,
    isFunction: isFunction,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    isFinite: isFinite,
    isNaN: isNaN,
    isBoolean: isBoolean,
    isNull: isNull,
    isUndefined: isUndefined,
    has: has,
    identity: identity,
    constant: constant,
    noop: noop,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: escape,
    unescape: unescape,
    result: result,
    uniqueId: uniqueId,
    templateSettings: templateSettings,
    template: template,
    chain: chain,
    mixin: mixin
  });

  // Add all of the Underscore functions to the wrapper object.
  var _$1 = mixin(allExports);
  // Legacy Node.js API
  _$1._ = _$1;

  return _$1;

})));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[20]);
