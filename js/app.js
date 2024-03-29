// STUDIOCLOCK - a simple local web implementation of the clocks used in radio and video broadcast studio environments | https://www.github.com/kretchy/studiockock 

// -----------------------------------
// --- customize ---------------------
// -----------------------------------

// define factors for radius (distance) of inner, outer, labels - relative to window height

var radiusInnerFactor = 2.9;
var radiusOuterFactor = 2.6;
var radiusLabelsFactor = 2.25;

// define factors for distance (up and down) for meta information = #studio, #day

var distanceUp = 0.75;
var distanceDown = 1.25;

// define factors for dot size (inner and outer circle) - relative to window height - the smaller the value, the larger the dot size (initial value 60)

var dotSizeFactor = 55;

// --------------------------------------
// --- *** no customisation below *** ---
// --------------------------------------

// import colours from pseudo html-divs (this way the color definition can remain in CSS)

var sourceInner = document.getElementById("pseudo-inner");
var colorInner = window.getComputedStyle(sourceInner,null).getPropertyValue("color");
var sourceOuter = document.getElementById("pseudo-outer");
var colorOuter = window.getComputedStyle(sourceOuter,null).getPropertyValue("color");
var sourceActive = document.getElementById("pseudo-active");
var colorActive = window.getComputedStyle(sourceActive,null).getPropertyValue("color");

// define number of dots on the inner and outer circle

var theDotsInner = 60;
var theDotsOuter = 12;

// define canvas object, precalculate some variables for the circle

var canvas = document.getElementById("the_circle");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var intervalInner = (Math.PI*2)/theDotsInner;   

// define the radius of the dotted circle according to window dimensions aiming for the perfect centered fit, with reasonable distance from the digital clock

if ( window.innerHeight <= window.innerWidth ) {
	var theDimension = window.innerHeight;
}
else {
	var theDimension = window.innerWidth;
}
 
var radiusInner = theDimension/radiusInnerFactor;
var intervalOuter = (Math.PI*2)/theDotsOuter;
var radiusOuter = theDimension/radiusOuterFactor;	
var radiusLabels = theDimension/radiusLabelsFactor;

var centerX = window.innerWidth/2;
var centerY = window.innerHeight/2;
var dotSize = radiusInner/dotSizeFactor;

// draw the inner circle of dots, one per second

function initInnerClock(theLimit,theOffset,theColor) {
	for(var i=0;i<=theLimit;i++){
		theRadian = intervalInner*(i+theOffset);
		var x = centerX+radiusInner*Math.cos(theRadian-Math.PI/2);
		var y = centerY+radiusInner*Math.sin(theRadian-Math.PI/2);
		context.beginPath();
		context.arc(x,y,dotSize,0,Math.PI*2);
		context.closePath();
		context.fillStyle = theColor;
		context.fill();
	}
}

// draw the outer circle of dots, one every five seconds

function initOuterClock(theLimit,theOffset,theColor) {
	for(var i=0;i<theLimit;i++){
		theRadian = intervalOuter*(i+theOffset);
		var x = centerX+radiusOuter*Math.cos(theRadian-Math.PI/2);
		var y = centerY+radiusOuter*Math.sin(theRadian-Math.PI/2);
		context.beginPath();
		context.arc(x,y,dotSize,0,Math.PI*2);		
		context.closePath();
		context.fillStyle = theColor;
		context.fill();
	}
}

// initialise the label positions on the clock face

function initLabelsClock(theLimit,theOffset) {
	for(var i=0;i<theLimit;i++){
		theRadian = intervalOuter*(i+theOffset);
		var posNum = (i)*5;
		var posNumString = "pos" + posNum.toString();
		var widthX = document.getElementById(posNumString).offsetWidth;
		var widthY = document.getElementById(posNumString).offsetHeight;
		var corrX = widthX/2; 
		var corrY = widthY/2;
		var posX = centerX+radiusLabels*Math.cos(theRadian-Math.PI/2)-corrX;
		var posY = centerY+radiusLabels*Math.sin(theRadian-Math.PI/2)-corrY;
		document.getElementById(posNumString).style.marginLeft = posX.toString() + "px";
		document.getElementById(posNumString).style.marginTop = posY.toString() + "px";
	}
}

// just draw the top dot in outer circle for the single event of second 00

function singleTopOuter(theColor) {
	theRadian = 0;
	var x = centerX+radiusOuter*Math.cos(theRadian-Math.PI/2);
	var y = centerY+radiusOuter*Math.sin(theRadian-Math.PI/2);
	context.beginPath();
	context.arc(x,y,dotSize,0,Math.PI*2);		
	context.closePath();
	context.fillStyle = theColor;
	context.fill();
}

// calculate best position for meta information #studio and #day (relative to window height)

function initMetaPosition(disUp,disDown) {
	var studioPosY = (window.innerHeight/2)*disUp;
	var dayPosY = (window.innerHeight/2)*disDown;
	document.getElementById("studio").style.top = studioPosY + "px";
	document.getElementById("day").style.top = dayPosY + "px";
}

// get the current time and overwrite the content of html-divs with id "clock" and "day", the secondsInt serves as the base for redrawing the dots on the inner and outer circle

function updateClock() {
	
	var time = new Date();
	var hours = time.getHours().toString();
	var minutes = time.getMinutes().toString();
	var seconds = time.getSeconds().toString();	
	var dateFormat = time.toISOString().slice(0,10);
	var secondsInt = time.getSeconds();
	if (hours.length < 2) { hours = '0' + hours; }
	if (minutes.length < 2) { minutes = '0' + minutes; }
	if (seconds.length < 2) { seconds = '0' + seconds; }
	var clockStr = hours + ':' + minutes + ':' + seconds;	

	clock.textContent = clockStr;
	day.textContent = dateFormat;
	
	if ( secondsInt == 0 ) {
		initInnerClock(theDotsInner,0,colorInner);
		initOuterClock(theDotsOuter,0,colorOuter);
		initInnerClock(0,0,colorActive);
		singleTopOuter(colorActive);
	}
	else { 
		singleTopOuter(colorOuter);
		initInnerClock(secondsInt,0,colorActive);
		if ( Number.isInteger(secondsInt/5) ) {
			initOuterClock(secondsInt/5,1,colorActive);
		}
	}
}

// initialise (onload) the inner and outer circle as well as rewriting the label positions, also put the meta information (#studio and #day) with a distance to the digital clock relative to the window height

initInnerClock(theDotsInner,0,colorInner);
initOuterClock(theDotsOuter,0,colorOuter);
initLabelsClock(theDotsOuter,0);
initMetaPosition(distanceUp,distanceDown);

// every second (interval: 1000 ms) update the clock (numbers and dots)

updateClock();
setInterval(updateClock, 1000);

// when window is resized, reload the whole page in order to redraw everything (with new dimension)

window.onresize = function(){ location.reload(); }