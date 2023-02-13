(function($) {
	const matrixEffectTileSize = 20, matrixEffectFadeFactor = 0.05;

	// Initialize nav button for mobile new
	$(document).on('click', '.navbar-burger', function() {
		$('#' + $(this).attr('data-target')).toggleClass('is-active');
		$(this).toggleClass('is-active');
	});

	$(document).on('click', '.modal-background, .modal-close', function(e) {
		e.preventDefault();

		$(this).closest('.modal').removeClass('is-active');
	});

	$(document).on('click', '.open-modal[data-target]', function(e) {
		e.preventDefault();

		$('.modal' + $(this).attr('data-target')).addClass('is-active');
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

		window.location.href = mailToURL;
	});

	$(document).on('mouseover focus', '#contactForm button', function(e) {
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

		if ($(this).is(':focus')) {
			$(this).blur();
		}
	});

	function textTypingEffect(elem, charIndex = 0, direction = 'right') {
		let typingContent = elem.prop('typingContent');

		if (charIndex == 0) {
			elem.addClass('typing');
			elem.html('');
		} else if (charIndex > typingContent.length) {
			if (elem.prop('typingSeqElements') != undefined) {
				$('.typing-effect[data-type-seq="' + elem.prop('typingSeqElements') + '"]').each(function() {
					textTypingEffect($(this));
				});
			}

			if (elem.hasClass('type-infinite')) {
				// After typed entire sentence, delete them
				setTimeout(() => {
					textTypingEffect(elem, (typingContent.length - 1), 'left');
				}, 1000);
			} else {
				// Retain blinking cursor on last element
				if (elem.prop('typingSeqElements') != undefined) {
					elem.removeProp('typingSeqElements');

					elem.removeClass('typing');
				}
			}

			return;
		} else if (charIndex < 0) {
			// After deleted all the letters, start typing
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
		let seqList = [];

		$('.typing-effect').each(function() {
			let initialContent = $(this).text();

			$(this).prop('typingContent', initialContent);

			// Initialize sequenced containers later
			if ($(this).attr('data-type-seq') == undefined) {
				textTypingEffect($(this));
			} else {
				$(this).html('');

				let seq = $(this).attr('data-type-seq');

				if (seq.indexOf('-') > -1) {
					seq = seq.split('-');

					if (seq.length == 2) {
						if (Number(seq[0]) != isNaN && Number(seq[1]) != isNaN) {
							if (seqList[ seq[0] ] == undefined) {
								seqList[ seq[0] ] = [
									seq[1]
								];
							} else {
								seqList[ seq[0] ].push( seq[1] );
							}
						}
					}
				}
			}
		});

		seqList.sort();

		seqList.forEach(function(seq, firstPart) {
			seq.sort();

			seq.forEach(function(secondPart, i) {
				if (i < (seq.length - 1)) {
					$(`.typing-effect[data-type-seq="${firstPart}-${ secondPart }"]`).prop('typingSeqElements', `${firstPart}-${seq[i + 1]}`);
				}
			});

			textTypingEffect($(`.typing-effect[data-type-seq="${firstPart}-${ seq[0] }"]`));
		});
	}

	function matrixEffect(canvas, context, columns, maxStackHeight) {
		context.fillStyle = `rgba(0, 0, 0, ${matrixEffectFadeFactor})`;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = (matrixEffectTileSize - 2) + 'px monospace';
		context.fillStyle = 'rgb(0, 255, 0)';

		for (let i = 0; i < columns.length; ++i) {
			let randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));

			context.fillText(randomChar, columns[i].x, columns[i].stackCounter * matrixEffectTileSize + matrixEffectTileSize);

			if (++columns[i].stackCounter >= columns[i].stackHeight) {
				columns[i].stackHeight = 10 + Math.random() * maxStackHeight;
				columns[i].stackCounter = 0;
			}
		}

		setTimeout(() => {
			matrixEffect(canvas, context, columns, maxStackHeight);
		}, 50);
	}

	function initMatrixEffect() {
		$('.matrix-effect').each(function() {
			const canvas = this;

			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			const context = canvas.getContext('2d');

			const maxStackHeight = Math.ceil(canvas.height / matrixEffectTileSize);
			let columns = [];

			for (let i = 0; i < canvas.width / matrixEffectTileSize; ++i) {
				columns.push({
					'x': i * matrixEffectTileSize,
					'stackHeight': 10 + Math.random() * maxStackHeight,
					'stackCounter': 0,
				});
			}

			matrixEffect(canvas, context, columns, maxStackHeight);
		});
	}

	$(document).ready(function() {
		initTypingEffect();
		initMatrixEffect();
	});

}) (jQuery);