$( document ).ready(function() {
	/**
	 * We define the digit segments required for display for each number.
	 * This will override the style assigned to each to "light" the segment.
	 * These are defined in clockwise notation.
	 */
	var digits = [
		/* 0 */	['.top','.upper.right', '.lower.right', '.bottom', '.lower.left', '.upper.left'],
		/* 1 */	['.upper.right', '.lower.right'],
		/* 2 */	['.top', '.upper.right', '.bottom', '.lower.left', '.middle'],
		/* 3 */	['.top', '.upper.right', '.lower.right', '.bottom', '.middle'],
		/* 4 */	['.upper.right', '.lower.right', '.upper.left', '.middle'],
		/* 5 */	['.top', '.lower.right', '.bottom', '.upper.left', '.middle'],
		/* 6 */	['.top', '.lower.right', '.bottom', '.lower.left', '.upper.left', '.middle'],
		/* 7 */	['.top', '.upper.right', '.lower.right'],
		/* 8 */	['.top','.upper.right', '.lower.right', '.bottom', '.lower.left', '.upper.left', '.middle'],
		/* 9 */	['.top','.upper.right', '.lower.right', '.bottom', '.upper.left', '.middle']
	];

	/**
	 * The interval id for the clock.
	 */
	var intervalId;

	var maxAmount = 59;

	var minAmount = 1;

	/**
	 * Whether the clock is running or not.
	 */
	var running = false;

	/**
	 * The state of the pomodoro cycle. Either work or rest
	 */
	var state = 'work';

	/**
	 * The initial amount of time to be set for the clock.
	 */
	var time = $('#work .amount').text()*60;

	/**
	 * Setup a callback function to display the digit for each segment cluster
	 */
	var displayDigit = function(cluster, digit) {
		$(cluster + ' .segment').removeClass(state);
		digits[digit].forEach(function(value){
			$(cluster + ' ' + value).addClass(state);
		});
	};

	/**
	 * Setup a callback to render the minutes clusters.
	 */
	var renderMinutes = function(minutes) {
		var set = minutes.split('');
		displayDigit('#ten-min',set[0]);
		displayDigit('#min',set[1]);
	}

	/**
	 * Setup a callback to render the seconds clusters.
	 */
	var renderSeconds = function(seconds) {
		var set = seconds.split('');
		displayDigit('#ten-sec',set[0]);
		displayDigit('#sec',set[1]);
		$('.dot').addClass(state);
		setTimeout(function(){
			if(running) {
				$('.dot').removeClass(state);
			}
		}, 500);
	}

	/**
	 * This pads the time with a zero if it is a single digit and returns a string.
	 */
	var padTime = function(time) {
		if(time < 10) {
			time = "0" + time;
		}

		return time.toString();
	}

	/**
	 * This is called when the Work adustment plus or minus are clicked.
	 * The event data should be either minus or plus
	 */
	var adjustClock = function(event) {
		var amount = $('#' + event.data.state  + ' .amount').text();
		if(event.data.action == 'minus') {
			amount--;
		} else {
			amount++;
		}

		if(amount < minAmount) {
			amount = minAmount;
		}

		if(amount > maxAmount) {
			amount = maxAmount;
		}

		$('#' + event.data.state  + ' .amount').text(amount);

		if(state === event.data.state) {
			stopClock();
			time = amount * 60;
			initClock();
		}
	}

	/**
	 * This initializes the Clock display
	 */
	var initClock = function() {
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		renderMinutes(padTime(minutes));
		renderSeconds(padTime(seconds));
	}

	/**
	 * This resets the clock and also the state
	 */
	var resetClock = function() {
		state = 'rest';
		switchState();
		stopClock();
		time = $('#work .amount').text() * 60;
		initClock();
	}

	/**
	 * This will run the clock. It checks the state of running and will only run if set to false.
	 * This will also set the intervalId so that the clock can be stopped.
	 */
	var runClock = function() {
		if (!running){
			running = true;
			intervalId = setInterval(function(){
				time--;
				if(time < 0) {
					stopClock();
					switchState();
				} else {
					var minutes = Math.floor(time / 60);
					var seconds = time - minutes * 60;
					renderMinutes(padTime(minutes));
					renderSeconds(padTime(seconds));
				}
			}, 1000);
		}
	}

	/**
	 * This stops the clock, and clears the interval
	 */
	var stopClock = function() {
		running = false;
		clearInterval(intervalId);
	}

	var switchState = function() {
		if(state === 'work') {
			state = 'rest';
			$('.segment, .dot').removeClass('work');
			$('h1, #wrap').addClass('rest');
			time = $('#' + state + ' .amount').text() * 60;
			runClock();
		} else {
			state = 'work';
			$('.segment, .dot, h1, #wrap').removeClass('rest');
			time = $('#' + state + ' .amount').text() * 60;
			initClock();
		}

	}
	/**
	 * Click events for the various controls.
	 */
	$('#start').on('click', runClock);
	$('#stop').on('click', stopClock);
	$('#reset').on('click', resetClock);
	$('#rest .minus').on('click',{action: 'minus', state: 'rest'}, adjustClock);
	$('#rest .plus').on('click',{action: 'plus', state: 'rest'}, adjustClock);
	$('#work .minus').on('click',{action: 'minus', state: 'work'}, adjustClock);
	$('#work .plus').on('click',{action: 'plus', state: 'work'}, adjustClock);
	initClock();
});
