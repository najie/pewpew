var uuid = null;
var game = new Phaser.Game(400, 200, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var socket = new Socket();

var player = new Player(game);
var enemies = new Enemies(game);

var cursors = {};

function preload() {
  game.load.image('wall-200', '/images/wall-200.png');
  game.load.image('player-red', '/images/player-red.png');
  game.load.image('player-yellow', '/images/player-yellow.png');
  game.load.image('player-blue', '/images/player-blue.png');
  game.load.image('player-green', '/images/player-green.png');
  game.load.image('player-white', '/images/player-white.png');

  player.preload();
  enemies.preload();
}

function create() {
  socket.init(function(type) {
    player.create(type);
  });

  game.physics.startSystem(Phaser.Physics.ARCADE);
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  if(player.sprite.body)
    player.update(cursors);
}

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}
