// JavaScript Document

var SPRITESHEET_URL = "http://www.samkgo.com/training/edX/css-introduction/images/monster_sprites.png";
var SPRITE_WIDTH = 700;
var SPRITE_HEIGHT = 700;
var NB_POSTURES = 1;
var NB_FRAMES_PER_POSTURE = 16;

var canvas1, ctx;
var spritesheet;
var monster;

window.onload = function () {
	canvas1 = document.getElementById("canvas1");
	ctx = canvas1.getContext("2d");

	// load the spritesheet
	spritesheet = new Image();
	spritesheet.src = SPRITESHEET_URL;

	// Called when the spritesheet has been loaded
	spritesheet.onload = function () {

		// Resize small canvas to the size of the spritesheet image
		canvas1.width = SPRITE_WIDTH;
		canvas1.height = SPRITE_HEIGHT;

		// get the sprite array
		monster = new Sprite();

		monster.extractSprites(spritesheet, NB_POSTURES,
			NB_FRAMES_PER_POSTURE,
			SPRITE_WIDTH, SPRITE_HEIGHT);
		monster.setNbImagesPerSecond(7);

		requestAnimationFrame(mainloop);
	}; // onload
};

function mainloop() {
	// clear the canvas
	ctx.clearRect(0, 0, canvas1.width, canvas1.height);
	// draw sprite at 0, 0 in the small canvas
	monster.draw(ctx, 0, 0, 1);

	requestAnimationFrame(mainloop);
}

// ------------------------
// Sprite utility functions
// ------------------------
function SpriteImage(img, x, y, width, height) {
	this.img = img; // the whole image that contains all sprites
	this.x = x; // x, y position of the sprite image in the whole image
	this.y = y;
	this.width = width; // width and height of the sprite image
	this.height = height;
	// xPos and yPos = position where the sprite should be drawn,
	// scale = rescaling factor between 0 and 1
	this.draw = function (ctx, xPos, yPos, scale) {
		ctx.drawImage(this.img,
			this.x, this.y, // x, y, width and height of img to extract
			this.width, this.height,
			xPos, yPos, // x, y, width and height of img to draw
			this.width * scale, this.height * scale);
	};
}

function Sprite() {
	this.spriteArray = [];
	this.currentFrame = 0;
	this.delayBetweenFrames = 10;

	this.extractSprites = function (spritesheet, nbPostures, nbFramesPerPosture,
		spriteWidth, spriteHeight) {
		// number of sprites to extract
		var nbSprites = nbPostures * nbFramesPerPosture - 1;
		// number of sprites per row in the spritesheet
		var nbSpritesPerRow = Math.floor(spritesheet.width / spriteWidth);

		// Extract each sprite
		for (var index = 0; index < nbSprites; index++) {
			// Computation of the x and y position that corresponds to the sprite
			// index
			// x is the rest of index/nbSpritesPerRow * width of a sprite
			var x = (index % nbSpritesPerRow) * spriteWidth;
			// y is the divisor of index by nbSpritesPerRow * height of a sprite
			var y = Math.floor(index / nbSpritesPerRow) * spriteHeight;

			// build a spriteImage object
			var s = new SpriteImage(spritesheet, x, y, spriteWidth, spriteHeight);

			this.spriteArray.push(s);
		}
	};

	this.then = performance.now();
	this.totalTimeSinceLastRedraw = 0;

	this.draw = function (ctx, x, y) {
		// Use time based animation to draw only a few images per second
		var now = performance.now();
		var delta = now - this.then;

		// draw currentSpriteImage
		var currentSpriteImage = this.spriteArray[this.currentFrame];
		// x, y, scale. 1 = size unchanged
		currentSpriteImage.draw(ctx, x, y, 1);

		// if the delay between images is elapsed, go to the next one
		if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
			// Go to the next sprite image
			this.currentFrame++;
			this.currentFrame %= this.spriteArray.length;

			// reset the total time since last image has been drawn
			this.totalTimeSinceLastRedraw = 0;
		} else {

			// sum the total time since last redraw
			this.totalTimeSinceLastRedraw += delta;
		}

		this.then = now;
	};

	this.setNbImagesPerSecond = function (nb) {
		// elay in ms between images
		this.delayBetweenFrames = 1000 / nb;
	};
}

// JavaScript Document

var canvas;
var context2D;

var particles = [];

function randomFloat(min, max) {
	return min + Math.random() * (max - min);
}

/*A single explosion particle*/
function Particle() {
	this.scale = 1.0;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = "#000";
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;
	this.useGravity = false;

	this.update = function (ms) {
		// shrinking
		this.scale -= this.scaleSpeed * ms / 1000.0;

		if (this.scale <= 0) {
			this.scale = 0;
		}

		// moving away from explosion center
		this.x += this.velocityX * ms / 1000.0;
		this.y += this.velocityY * ms / 1000.0;

		// and then later come downwards when our
		// gravity is added to it. We should add parameters 
		// for the values that fake the gravity
		if (this.useGravity) {
			this.velocityY += Math.random() * 4 + 4;
		}
	};

	this.draw = function (context2D) {
		// translating the 2D context to the particle coordinates
		context2D.save();
		context2D.translate(this.x, this.y);
		context2D.scale(this.scale, this.scale);

		// drawing a filled circle in the particle's local space
		context2D.beginPath();
		context2D.arc(0, 0, this.radius, 0, Math.PI * 2, true);
		context2D.closePath();

		context2D.fillStyle = this.color;
		context2D.fill();

		context2D.restore();
	};
}

/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 * 
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color) {

	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;

	for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
		var particle = new Particle();

		particle.x = x;
		particle.y = y;

		// size of particle
		particle.radius = randomFloat(5, 15);

		particle.color = color;

		// life time, the higher the value the faster particle will die
		particle.scaleSpeed = randomFloat(0.3, 0.5);

		// use gravity
		particle.useGravity = true;

		var speed = randomFloat(minSpeed, maxSpeed);

		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		particles.push(particle);
	}
}

function update(frameDelay) {
	// Clear canvas
	context2D.clearRect(0, 0, canvas.width, canvas.height);

	// update and draw particles
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];

		particle.update(frameDelay);
		particle.draw(context2D);
	}
}

window.addEventListener("load", function () {
	// canvas and 2D context initialization
	canvas = document.getElementById("canvas2");
	context2D = canvas.getContext("2d");

	// Sound
	var sound = new Howl({
		src: ['http://www.samkgo.com/training/edX/css-introduction/audio/sound1.mp3', 'http://www.samkgo.com/training/edX/css-introduction/audio/sound1.wav']
	});

	// Button click: Congratulate!
	var button = document.getElementById("congratulate");
	button.addEventListener("click", function () {
		var x = randomFloat(300, 600);
		var y = randomFloat(50, 200);

		createExplosion(x, y, "#481A7C");
		createExplosion(x, y, "#931702");
		createExplosion(x, y, "#D9D827");

		sound.play();
	});

	// starting the game loop at 60 frames per second
	var frameRate = 60.0;
	var frameDelay = 1000.0 / frameRate;

	setInterval(function () {
		update(frameDelay);

	}, frameDelay);
});
