function Player(game) {

  this.cursors = null;
  this.sprite = {};
  this.spawnX = rand(10, 300);
  this.spawnY = rand(10, 100);

  this.preload = function() {
    game.load.image('player', '/images/player.png');
  };

  this.create = function() {
    this.sprite = game.add.sprite(this.spawnX, this.spawnY, 'player');
    this.sprite.anchor.set(0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.rotation = 0;
    this.sprite.body.collideWorldBounds = true;
  };

  this.update = function(cursors) {
    var speed = 200;
    var doEmit = false;

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.angularVelocity = 0;

    if(cursors.up.isDown) {
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, speed, this.sprite.body.velocity);
      doEmit = true;
      //this.sprite.body.y -= velocity;
    }
    else if(cursors.down.isDown) {
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, -(speed-100), this.sprite.body.velocity);
      doEmit = true;
    }

    if(cursors.left.isDown) {
      this.sprite.body.angularVelocity = -300;
      doEmit = true;
    }
    else if(cursors.right.isDown) {
      this.sprite.body.angularVelocity = 300;
      doEmit = true;
    }

    if(doEmit) {
      socket.emit({pos: {x: this.sprite.x, y: this.sprite.y}, rotation: this.sprite.angle});
    }
  };

}
