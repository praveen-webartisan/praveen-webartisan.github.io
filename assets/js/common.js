(function($) {

	// Initialize nav button for mobile new
	$(document).on('click', '.navbar-burger', function() {
		$('#' + $(this).attr('data-target')).toggleClass('is-active');
		$(this).toggleClass('is-active');
	});

	// 

}) (jQuery);