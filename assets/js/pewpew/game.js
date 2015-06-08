var uuid = null;
var game = new Phaser.Game(400, 200, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var socket = new Socket();

var player = new Player(game);
var enemies = new Enemies(game);

var cursors = {};

function preload() {
  game.load.image('wall-200', '/images/wall-200.png');

  player.preload();
  enemies.preload();
}

function create() {
  socket.init();
  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
  player.create();
}

function update() {
  player.update(cursors);
}

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}
