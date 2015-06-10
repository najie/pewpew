var uuid = null;
var game = new Phaser.Game(800, 400, Phaser.AUTO, 'pewpew', { preload: preload, create: create, update: update });

var socket = new Socket(),
    player = new Player(game),
    enemies = new Enemies(game),
    map = new Map(),
    HUD = new HUD(),
    bonus = new Bonus();

map.load('map1');

var cursors = {};

function preload() {
  game.load.image('player-red', '/images/player-red.png');
  game.load.image('player-yellow', '/images/player-yellow.png');
  game.load.image('player-blue', '/images/player-blue.png');
  game.load.image('player-green', '/images/player-green.png');
  game.load.image('player-white', '/images/player-white.png');
  game.load.image('bullet', '/images/bullet.png');

  player.preload();
  enemies.preload();
  map.preload();
  bonus.preload();
}

function create() {
  map.create();
  socket.init(function(type) {
    player.create(type);
  });
  bonus.create();

  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.SHIFT ]);
}

function update() {
  if(player.sprite.body)
    player.update(cursors);
  enemies.update();
  map.update();
  bonus.update();
}

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}
