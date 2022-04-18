/************* EASY HELPER FUNCTIONS *************/

// Easy selector helper func
const selectElem = (el, all = false) => {
	el = el.trim();
	if (all) {
		return [...document.querySelectorAll(el)];
	} else {
		return document.querySelector(el);
	}
};
// Easy event listener func
const On = (type, el, listener, all = false) => {
	let selectEl = selectElem(el, all);
	if (selectEl) {
		if (all) {
			selectEl.forEach(e => e.addEventListener(type, listener));
		} else {
			selectEl.addEventListener(type, listener);
		}
	}
};
// Scrolls to an element with header offset
const scrollto = elem => {
	let headerOffset = selectElem('#header').offsetHeight;
	let elementPos = selectElem(elem).offsetTop;
	elementPos = elementPos - headerOffset;

	window.scrollTo({
		top: elementPos,
		behavior: 'smooth'
	});
};
/** END **/

(function() {
	/************* CUSTOM FUNCTIONS *************/
	setTimeout(() => {
		selectElem('#preloader').classList.add('hide');
		document.body.style.overflowY = 'auto';
	}, 3500);

	// LOAD CLICK SOUND
	const clickSound = new Audio();
	clickSound.src = './assets/click.mp3';
	clickSound.playbackRate = 3;

	/** TOGGLE MOBILE MENU  */
	const mobileNavToggle = e => {
		selectElem('#mobile_navbar').classList.toggle('sb_show');
		selectElem('body').classList.toggle('nonScroll');
		selectElem('#toggleBtn').classList.toggle('active');
		// PLAY SOUND ON BUTTON CLICK
		clickSound.play();
	};

	// CLOSE MOBILE MENU
	const closeMobileNav = () => {
		selectElem('#mobile_navbar').classList.remove('sb_show');
		selectElem('body').classList.remove('nonScroll');
		selectElem('#toggleBtn').classList.remove('active');
	};

	// SEND EMAIL -+
	const sendEmail = e => {
		e.preventDefault();
		$('.email_status').css('opacity', 0);
		$('form button').html('SENDING..');

		$.ajax({
			type: 'POST',
			url: 'SendMail.php',
			data: {
				name: $('input#full_name').val(),
				email: $('input#email').val(),
				phone_no: $('input#phone_no').val(),
				service: $('select#service').val(),
				message: $('textarea#message').val()
			},

			success: function() {
				$('.email_status').css('opacity', 1);
				// CLEAR INPUTS VALUE
				$('form')[0].reset();
				$('form input#email ~ span').removeClass('text_focus');
			},
			error: function() {
				$('.email_status')
					.html('Failed. Message not sent')
					.css('opacity', 1);
			},
			complete: function() {
				$('form button').html('SEND');
			}
		});
	};

	// SCROLL TARGET SECTION ON CLICK
	const scrollToSection = e => {
		e.preventDefault();
		let sectionId = e.target.getAttribute('href');
		scrollto(sectionId);
		// SCROLL TARGET SECTION ON CLICK
	};

	// REMOVE ACTIVE CLASS FROM ALL NAV LINKS
	const setActiveClass = (elem, target) => {
		selectElem(elem, true).forEach(elem => {
			elem.classList.remove('active');
		});
		selectElem(elem + target, true).forEach(elem =>
			elem.classList.add('active')
		);
	};

	// TOGGLE TEXT_FOCUS CLASS ON INPUT#EMAIL CHANGE
	const TextFocusInputEmail = e => {
		let value = e.target.value;
		if (value) {
			selectElem('input#email ~ span').classList.add('text_focus');
		} else {
			selectElem('input#email ~ span').classList.remove('text_focus');
		}
	};

	/************* FUNCTIONS CALLS *************/
	On('click', '#toggleBtn', mobileNavToggle);
	On('click', '#mobile_navbar li a', closeMobileNav, true);
	On('click', '#header nav li a', scrollToSection, true);
	On('change', 'form input#email', TextFocusInputEmail);
	On('submit', '#contact_form', sendEmail);
	On(
		'click',
		'#intro a.btn',
		function(e) {
			e.preventDefault();
			scrollto('#contact');
		},
		true
	);

	// WINDOW ONSCROLL FUNCTION
	window.onscroll = () => {
		let currentPos = window.pageYOffset;
		selectElem('main > section', true).forEach(elem => {
			let offset = elem.offsetTop;
			if (currentPos + 100 > offset) {
				let sectionId = elem.getAttribute('id');
				setActiveClass('header nav li a', '.' + sectionId);
			}
		});
		if (currentPos < 140) {
			setActiveClass('header nav li a', '.home');
		}
	};
})();
