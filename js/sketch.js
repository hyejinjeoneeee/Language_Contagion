/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/697891

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

const textToWrite = "Language    Contagion";
const SEGMENTS = 90;
//auto start variables
let centerX, centerY, fontSize, INNER_RADIUS, RADIUS_VARIATION, pg;
let theta = 0.0;
let play = true;
let waveSpeed;

var margin = innerWidth / 12;  // gives some space from edges before placing slider lines
var line_y = innerHeight / 2.5;
var line_length = 360;  // allows for 360 degess of colour

var hue_pos_y;
var side = 30;

let timer = 30;

var button1, button2;

let overButton = false;



function setup() {
	createCanvas(windowWidth, windowHeight);
	pg = createGraphics(windowWidth, windowHeight);
	centerX = windowWidth / 1.165;
	centerY = windowHeight / 1.7;
	smooth();
	let screenPct = min(height, width) / 1000;
	fontSize = screenPct * 45;
	INNER_RADIUS = screenPct * 85;
	RADIUS_VARIATION = screenPct * 115;

	textFont('Roboto Mono');
	textSize(fontSize);
	noCursor();

	button1 = loadImage("img/button.png");
	button2 = loadImage("img/overbuttonHover.png");

	hue_pos_y = 1.8 * line_y;

}

//code adapted from @GoToLoop
//generates a circular noise with perfect looping
//https://forum.processing.org/one/topic/how-to-make-perlin-noise-loop.html
function pointForIndex(pct) {
	const NOISE_SCALE = 1.5;
	let angle = pct * TWO_PI;
	let cosAngle = cos(angle);
	let sinAngle = sin(angle);
	let time = frameCount / 100;
	let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
	let radius = INNER_RADIUS + RADIUS_VARIATION * noiseValue;
	return {
		x: radius * cosAngle + centerX,
		y: radius * sinAngle + centerY
	};
}



function draw() {
	background(0);
	fill(0, 255, 0);
	noStroke();
	rectMode(CENTER);
	//rect(width * 0.577, height * 0.84, 60, 60);
	//rect(mouseX, mouseY, 40, 40);

	//draw sphere
	beginShape();
	for (let i = 0; i < SEGMENTS; i++) {
		let p0 = pointForIndex(i / SEGMENTS);
		vertex(p0.x, p0.y);
	}
	endShape(CLOSE);

	pg.fill(0);
	/*
		button1.resize(100, 100);
		button2.resize(100, 100);
		if (overButton == true) {
			image(button2, 500, 300);
		} else {
			image(button1, 500, 300);
		}
	*/
	pg.stroke(0);
	pg.strokeWeight(10);
	//  pg.textFont(font);
	pg.textSize(30);

	pg.fill(0, 255, 0);
	pg.push();
	pg.translate(width / 2.6, height / 2.3);
	pg.textAlign(CENTER, TOP);
	pg.text("언어 전염을 설명하는 데 있어 재미있는 표현은\n 오염(contamination)과 전염(contagion)이다. \n 새로운 시각과 언어가 전염되는 것이다. 빼앗기고 변형되고, \n옮겨지는 것은 일반적으로 부정적으로 지각되지만, \n언어전염에서 변이는 메타상상의 가능성으로 해석되며,\n 언어가 탈맥락함에 따라 그것에 대한 시각이 바뀌는 것을 의미한다.", 0, 0);
	pg.pop();


	let tilesX = 40;
	let tilesY = 40;

	let tileW = round(width / tilesX);
	let tileH = round(height / tilesY);

	let virusPos = map(hue_pos_y, 30, 1.8 * line_y, 100, 0);

	if (play) {
		theta += 0.5;
		theta %= 360;

	} else {
		theta = theta;
	}
	waveSpeed = virusPos;

	for (let y = 0; y < tilesY; y++) {
		for (let x = 0; x < tilesX; x++) {

			// WARP
			const wave = sin(theta * 0.1 + (x * y) * -0.4) * waveSpeed;

			// SOURCE
			const sx = x * tileW - wave;
			const sy = y * tileH - wave;
			const sw = tileW;
			const sh = tileH;

			// DESTINATION
			const dx = x * tileW + wave;
			const dy = y * tileH;
			const dw = tileW;
			const dh = tileH;

			image(pg, sx, sy, sw, sh, dx, dy, dw, dh);


		}
	}


	//draw text
	let pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI;//follow mouse
	//let pct = 0;//dont follow mouse
	let pixToAngularPct = 1 / ((INNER_RADIUS + RADIUS_VARIATION / 2) * TWO_PI);
	for (var i = 0; i < textToWrite.length; i++) {
		let charWidth = textWidth(textToWrite.charAt(i));
		pct += charWidth / 2 * pixToAngularPct;

		//calculate angle
		let leftP = pointForIndex(pct - 0.01);
		let rightP = pointForIndex(pct + 0.01);
		let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;

		push();
		let p = pointForIndex(pct);
		//apply angle
		translate(p.x, p.y);
		rotate(angle);
		translate(-p.x, -p.y);
		fill(255);
		text(textToWrite.charAt(i), p.x - charWidth / 2, p.y);
		pop();

		pct += charWidth / 2 * pixToAngularPct;
	}//for

	drawLines();
	drawSliders();


	if (frameCount % 60 == 0 && timer > 0) {
		timer--;
	} if (timer == 0) {
		location.href = "index.html"
	}

}


function drawLines() {

	//  line for hue
	stroke(0, 255, 0);
	strokeWeight(8);
	line(margin, line_y, margin, 1.8 * line_y);

}  // end of drawLine



function mouseDragged() {

	if ((margin - 30 < mouseX && mouseX < margin + 30) && (line_y - 10 < mouseY && mouseY < 1.8 * line_y + 10)) {
		hue_pos_y = mouseY;

	}
	timer = 30;

}

function mouseMoved() {
	timer = 30;
	//checkButton();
}


function drawSliders() {

	fill(0, 255, 0);
	noStroke();
	rect(margin, hue_pos_y, side, side);


}  //  end of drawSlider function


function mousePressed() {

}



function keyPressed() {

	timer = 30;

	if (keyCode === 32)
		if (play) {
			play = false;

		} else {
			play = true;
		}

}

