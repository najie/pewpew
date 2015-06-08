function Player(game) {

  this.cursors = null;
  this.sprite = {};
  this.spawnX = rand(10, 300);
  this.spawnY = rand(10, 100);

  this.bullets = null;
  this.bulletTime = 0;

  this.preload = function() {
  };

  this.create = function(type) {
    this.sprite = game.add.sprite(this.spawnX, this.spawnY, 'player-'+type);
    this.sprite.anchor.set(0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.rotation = 0;
    this.sprite.body.collideWorldBounds = true;

    var bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    this.bullets = bullets;
  };

  this.update = function(cursors) {
    var speed = 200;
    var doEmit = false;
    var action = null;

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.angularVelocity = 0;

    this.sprite.bringToTop();

    if(cursors.up.isDown) {
      action = "moveForward";
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, speed, this.sprite.body.velocity);
      //this.sprite.body.y -= velocity;
    }
    else if(cursors.down.isDown) {
      action = "moveBackward";
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, -(speed-100), this.sprite.body.velocity);
    }

    if(cursors.left.isDown) {
      action = "turnLeft";
      this.sprite.body.angularVelocity = -300;
    }
    else if(cursors.right.isDown) {
      action = "turnRight";
      this.sprite.body.angularVelocity = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.fire();
    }

    if(action) {
      socket.emit({pos: {x: this.sprite.x, y: this.sprite.y}, rotation: this.sprite.angle, action: action});
    }
  };

  this.fire = function() {
    if (game.time.now > this.bulletTime)
    {
      var bullet = this.bullets.getFirstExists(false);

      if (bullet)
      {
        bullet.reset(this.sprite.body.x+12, this.sprite.body.y+12);
        bullet.lifespan = 2000;
        bullet.rotation = this.sprite.rotation;
        game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, bullet.body.velocity);
        this.bulletTime = game.time.now + 100;

        socket.emit({pos: {x: this.sprite.x, y: this.sprite.y}, rotation: this.sprite.angle, action: 'fire'});
      }
    }
  };
}
