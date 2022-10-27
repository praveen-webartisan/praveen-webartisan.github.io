(function($) {

	// Initialize nav button for mobile new
	$(document).on('click', '.navbar-burger', function() {
		$('#' + $(this).attr('data-target')).toggleClass('is-active');
		$(this).toggleClass('is-active');
	});

	function isValidContactForm() {
		let formData, subject;
		let contactForm = $('#contactForm');

		contactForm.find('.help').remove();

		contactForm.find('[required]').each(function() {
			if ($(this).val()) {
				$(this).removeClass('is-danger');
				$(this).closest('.field').find('.help').remove();
			} else {
				$(this).addClass('is-danger');
				$(this).closest('.field').append('<p class="help is-danger">Required</p>');
			}
		});

		if (contactForm.find('.help').length > 0) {
			return false;
		}

		formData = '';

		contactForm.find('input, textarea').each(function() {
			if ($(this).attr('name').toLowerCase() == 'subject') {
				subject = $(this).val();
			}

			if (formData) {
				formData += '\n';
			}

			formData += $(this).attr('name').toUpperCase() + ' : ' + $(this).val();
		});

		return {
			'data': formData,
			'subject': subject,
		};
	}

	$(document).on('submit', '#contactForm', function(e) {
		e.preventDefault();
		e.stopPropagation();

		let formValidation = isValidContactForm();
		let mailToURL = encodeURI('mailto:thisispraveenj@gmail.com?body=' + (formValidation.data || '') + '&subject=' + (formValidation.subject || ''));
		console.log(mailToURL);

		window.location.href = mailToURL;
	});

	$(document).on('mouseover', '#contactForm button', function(e) {
		if (isValidContactForm()) {
			$(this).removeClass('is-pulled-left is-pulled-right');
		} else {
			if ($(this).hasClass('is-pulled-left')) {
				$(this).removeClass('is-pulled-left').addClass('is-pulled-right');
			} else if ($(this).hasClass('is-pulled-right')) {
				$(this).removeClass('is-pulled-right').addClass('is-pulled-left');
			} else {
				$(this).addClass('is-pulled-right');
			}
		}
	});

	$(document).ready(function() {
		// 
	});

}) (jQuery);