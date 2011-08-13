(function($, window, document, undefined){

$(function(){
	var $console = $('#console');
	window.log = function(msg){
		$console.prepend(
			'<div>' + msg + ' (' + (new Date).toString() + ')</div>'
		)
	};
});

})(jQuery, this, this.document);
