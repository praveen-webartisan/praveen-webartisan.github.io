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

	function textTypingEffect(elem, charIndex = 0, direction = 'right') {
		let typingContent = elem.prop('typingContent');

		if (charIndex == 0) {
			elem.html('');
		} else if (charIndex > typingContent.length) {
			setTimeout(() => {
				textTypingEffect(elem, (typingContent.length - 1), 'left');
			}, 1000);

			return;
		} else if (charIndex < 0) {
			setTimeout(() => {
				textTypingEffect(elem, 0);
			}, 1000);

			return;
		}

		elem.html(typingContent.substr(0, charIndex));

		setTimeout(() => {
			textTypingEffect(elem, (direction == 'right' ? charIndex + 1 : charIndex - 1), direction);
		}, 50);
	}

	function initTypingEffect() {
		$('.typing-effect').each(function() {
			let initialContent = $(this).text();

			$(this).prop('typingContent', initialContent);

			textTypingEffect($(this));
		});
	}

	$(document).ready(function() {
		initTypingEffect();
	});

}) (jQuery);