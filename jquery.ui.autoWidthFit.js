/*!
 * jQuery.ui.autoWidthFit
 *
 * @author    : Takeshi Takatsudo (takazudo[at]gmail.com)
 * @copyright : Takeshi Takatsudo
 * @license   : The MIT License
 * @link      : https://github.com/Takazudo/jQuery.ui.autoWidthFit
 * @modified  : 2011/08/13
 * @version   : 0.1
 */
(function($, window, document, undefined){

var $window = $(window);

/**
 * utils
 * caliculate colcount from current window size
 */
function calcColStat(colWidth, colMargin, bodyMarginLeft, bodyMarginRight){
	var winWidth = $window.width();
	var maxContainerWidth = winWidth - bodyMarginLeft - bodyMarginRight;
	var colCount, containerWidth;
	for(var i=1, currentContainerWidth, lastContainerWidth; true; i++){
		currentContainerWidth = (colWidth * i) + (colMargin * (i-1));
		if(currentContainerWidth > maxContainerWidth){
			colCount = i-1;
			containerWidth = lastContainerWidth;
			break;
		}
		lastContainerWidth = currentContainerWidth;
		if(i > 9999){
			$.error('something wrong about layout ;(');
			break;
		}
	}
	return {
		colCount: colCount,
		containerWidth: containerWidth
	};
}

/**
 * ui.autoWidthFit
 */
$.widget('ui.autoWidthFit', {
	options: {
		bodyMarginLeft: 30,
		bodyMarginRight: 30,
		colWidth: 180,
		colMargin: 20,
		widthChangeAnimationDuration: 400,
		widthChangeAnimationEasing: 'easeOutExpo',
		animate: true
	},
	_lastColCount: null,
	_create: function(){
		var self = this;
		self.widgetEventPrefix = 'autowidthfit.';
		var $el = self._$el = self.element;

		/* I don't want the container to be shown till first resizing is complete */
		$el
			.css('display', 'none')
			.one('autowidthfit.widthchange', function(){
				self._$el.css('display', 'block');
				self._trigger('firstwidthchange');
			});

		self._eventify();
		self._handleWinResize(); // invoke first resize
		return self;
	},
	_eventify: function(){
		var self = this;
		$window.resize(function(){
			self._handleWinResize(false);
		});
		return this;
	},
	_fitContainer: function(width, colCount, noAnimate){
		var self = this;
		self._lastColCount = colCount;
		var o = self.options;
		var d = o.widthChangeAnimationDuration;
		var easing = o.widthChangeAnimationEasing;
		var done = function(){
			self._trigger('widthchange');
		};
		if(noAnimate || o.animate === false){
			self._$el.stop().width(width);
			done();
		}else{
			self._$el.stop().animate({
				width: width
			}, d, easing, function(){
				done();
			});
		}
		return this;
	},
	_handleWinResize: function(noAnimate){
		var o = this.options;
		var colStat = calcColStat(
			o.colWidth,
			o.colMargin,
			o.bodyMarginLeft,
			o.bodyMarginRight
		);
		if(this._lastColCount === colStat.colCount){
			return this;
		}
		this._fitContainer(colStat.containerWidth, colStat.colCount, noAnimate);
		return this;
	}
});

})(jQuery, this, this.document);
