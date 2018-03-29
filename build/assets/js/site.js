import $ from 'jquery';
import moment from 'moment';
//var Tour = require('bootstrap-tour.js');

var BaxaltaUrlShortener = {
	
	VERSION : '1.0.0.1',
	
	Init: function () {
		let me = this,
			offset = new Date().getTimezoneOffset(); // in minutes from utc
		
		$('.datetime').each(function () {
			let me = $(this),
				val = new Date(me.text()),

				//convert the offset to milliseconds, add to database time, and make a new Date
				offsetTime = new Date(val.getTime() + -1 * offset * 60 * 1000);

			me.text(moment(offsetTime).format('ddd, MMM DD, YYYY hh:mm:ss A'));
		});
		
		function goHome() {
			if (window.home) {
				window.home();
			} else {
				if (document.all) {
					var ieVer = parseFloat(navigator.appVersion.split('MSIE')[1]);
					if (ieVer <= 7) {
						window.location = 'about:home';
					} else {
						hp.navigateHomePage();
					}
				} else {
					window.location = 'about:home';
				}
			}
		}
		
		$('body').on('click', '.logout-link', function () {
			goHome();
			return false;
		});

		$('form').on('click', '#short_url_link', function () {
			$('div#custom_url_fields').toggle(400, function () {
				$(this).find('input').val('');
			});
			return false;
		});

		// check if there are errors and if so, show the custom url field if it is a related error
		if ($('div.validation-summary-errors').length > 0 &&
												$('div.validation-summary-errors ul li').text().indexOf('custom URL') > 0) {
			$('div#custom_url_fields').show();
		}

		var pageUrl = window.location.href.split('?')[0].split('#')[0].substr(window.location.href.split('?')[0].split('#')[0].lastIndexOf('/') + 1);

		if (pageUrl !== '' && String(pageUrl) !== 'Index') {
			$('#take_a_tour_content').hide();
		}

		function getBaseURL() { 
			let url = location.href, // entire url including querystring - also: window.location.href; 
				baseURL = url.substring(0, url.indexOf('/', 14)),
				paths = location.pathname.split('/'),
				path = paths[paths.length - 1];

			return url.substr(0, url.indexOf(path) - 1); // pull off the lowest level path
		}


		$('body').on('click', '.remove-url', function (e) {
			e.preventDefault();
			let me = $(this);
			if (me.closest('div[data-isowner]').data('isowner') === 'True') {
				if (confirm('Do you want to remove this Short URL?')) {
					let elm = me,
						action = elm.attr('href');
					
					$.ajax({
						url: action,
						type: 'DELETE'
					}).done(function (data) {
						if (data.complete === true) {
							elm.closest('.url-list-item').remove();
						}
					}).fail(function (jqXHR, textStatus, errorThrown) {
						console.error(errorThrown);
						
						let resp = jQuery.parseJSON(jqXHR.responseText);
						
						if (resp !== null && resp.error !== null) {
							alert('Error: ' + resp.error);
						} else {
							alert(jqXHR.statusText);
						}
					});
				}
			}
			return false;
		});

		$('body').on('click', '.favorite', function () {
			let elm = $(this),
				id = elm.data('id');
			
			$.post('/Favorites/' + id, function (data) {
				elm.find('i.glyphicon-heart-empty').removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
			});
			return false;
		});

		$('body').on('click', '.remove-favorite', function () {
			if (confirm('Do you want to remove this favorite?')) {
				let elm = $(this),
					id = elm.data('id');
				
				$.ajax({
					url: '/Favorites/' + id,
					type: 'DELETE'
				}).done(function (data) {
					if (data.complete === true) {
						elm.closest('.url-list-item').remove();
					}
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.error(errorThrown);
					
					let resp = jQuery.parseJSON(jqXHR.responseText);
					
					if (resp !== null && resp.error !== null) {
						alert('Error: ' + resp.error);
					} else {
						alert(jqXHR.statusText);
					}
				});
			}
			return false;
		});

		$('body').on('click', 'div[class*="url-title"] span:first-child', function () {
			let me = $(this);
			
			if (me.closest('div[data-isowner]').data('isowner') === 'True') {
				let val = me.text(),
					parent = me.parent(),
					id = parent.attr('id');

				me.remove();
				$('<input type="text" class="form-control" id="url-' + id + '" name="title" value="' + val + '" />').prependTo(parent).focus();
			}
		});

		$('div[class*="url-title"]').on('blur', 'input[type=text][name=title]', function () {
			let me = $(this);
			
			if (me.closest('div[data-isowner]').data('isowner') === 'True') {
				let val = me.val(),
					parent = me.parent(),
					id = parent.attr('id');
				
				$.ajax({
					url: getBaseURL() + '/Manage/' + id,
					type: 'POST',
					data: 'title=' + escape(val)
				}).done(function (data) {
					if (data.complete === true) {
						me.remove();
						parent.prepend('<span>' + val + '</span>');
					}
				}).fail(function (jqXHR, textStatus, errorThrown) {
					console.error(errorThrown);
					
					let resp = jQuery.parseJSON(jqXHR.responseText);
					
					if (resp !== null && resp.error !== null) {
						alert('Error: ' + resp.error);
					} else {
						alert(jqXHR.statusText);
					}
				});
			}
		});

		return me;
	},
	
	InitTour: function () {
		// Instance the tour 
		let tour = new Tour({
			//debug: true, 
			steps: [
				{
					element: '#Url',
					title: 'How To Create a Short URL',
					content: 'A Short URL is a substantially shorter length URL (Uniform Resource Locator) that still directs you to the required page. Short URLs are more convenient for websites, IM, mobile, or hard copy publications. Copy and paste a URL from the page you want to create a shorter URL for into the text box.'
				},
				{
					element: '#short_url_link',
					title: 'You Can Create a Customized Short URL',
					content: 'A custom short URL is a shortened URL with a unique name that is created by a person instead of an automatically created one. To create one click "custom".',
					onNext: function (tour) {
						if ($('#ShortenedUrl').is(':hidden')) {
							$('#short_url_link').click();
						}
					}
				},
				{
					element: '#ShortenedUrl',
					title: 'Type in a Custom Short URL',
					content: 'You can create your own unique Short URL by typing in a word or words (with no spaces) up to 50 letters or numbers',
					onNext: function (tour) {
						if ($('#ShortenedUrl').is(':visible')) {
							$('#short_url_link').click();
						}
					}
				},
				{
					element: '#create_short_url_button',
					title: 'Create a Short URL',
					content: 'When finished click "create".',
					placement: 'top'
				}
			]
		});

		// Initialize the tour 
		tour.init();

		// Start the tour 
		tour.start();

		$('body').on('click', '#take_a_tour_link', function () {
			if (tour.ended()) {
				tour.restart();
			} else {
				// Initialize the tour 
				tour.init();

				// Start the tour 
				tour.start();
			}
			return false;
		});
	}
};

//module.exports = BaxaltaUrlShortener;
export default BaxaltaUrlShortener;