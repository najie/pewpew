function Player(game) {

  this.state = {
    fire: false
  };

  this.stats = {
    speed: 200,
    angularVelocity: 300,
    bulletSpeed: 500,
    bonus: {
      name: null,
      timeout: null
    },
    disableFire: true
  };

  this.cursors = null;
  this.sprite = {};

  this.bullets = [];
  this.bulletTime = 0;

  this.mainDatas = {};

  this.preload = function() {
    console.log(map.selectedMap.spawnsCoords, map.selectedMap.spawnsCoords.length);
    var spawnId = rand(1, map.selectedMap.spawnsCoords.length);
    this.spawnX = map.selectedMap.spawnsCoords[spawnId-1][0]+50;
    this.spawnY = map.selectedMap.spawnsCoords[spawnId-1][1]+50;
  };

  this.create = function(type) {
    this.sprite = game.add.sprite(this.spawnX, this.spawnY, 'player-'+type);
    this.sprite.anchor.set(0.5);
    this.sprite.health = 10;
    HUD.updateHealth(this.sprite.health);

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
    var speed = this.stats.speed,
        angularVelocity = this.stats.angularVelocity,
        action = null,
        _self = this;

    this.mainDatas = {
      pos: {
        x: this.sprite.x,
        y: this.sprite.y
      },
      rotation: this.sprite.angle,
      health: this.sprite.health,
      bonus: this.stats.bonus.name
    };

    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.angularVelocity = 0;

    this.sprite.bringToTop();

    if(game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
      angularVelocity = 100;
    }

    if(cursors.up.isDown) {
      action = "move";
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, speed, this.sprite.body.velocity);
      //this.sprite.body.y -= velocity;
    }
    else if(cursors.down.isDown) {
      action = "move";
      game.physics.arcade.velocityFromAngle(this.sprite.body.rotation, -(speed-100), this.sprite.body.velocity);
    }

    if(cursors.left.isDown) {
      action = "move";
      this.sprite.body.angularVelocity = -angularVelocity;
    }
    else if(cursors.right.isDown) {
      action = "move";
      this.sprite.body.angularVelocity = angularVelocity;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.sprite.health > 0 && !this.stats.disableFire) {
      this.fire();
      if(!this.state.fire) {
        socket.directEmit({action: 'fire', datas: this.mainDatas});
        this.state.fire = true;
      }
    }
    else {
      if(this.state.fire) {
        socket.directEmit({action: 'stopFire', datas: this.mainDatas});
        this.state.fire = false;
      }
    }

    enemies.uuids.forEach(function(uuid, index) {
      game.physics.arcade.overlap(_self.bullets, enemies.sprites[uuid], _self.onHitEnemy, null, _self);
    });

    if(action) {
      socket.emit({datas: this.mainDatas, action: action});
    }
  };

  this.onHitEnemy = function(enemy, bullet) {
    socket.emit({datas:{target: enemy.uuid}, action: 'hit'});
    bullet.kill();
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

        if(this.stats.bonus.name == 'bulletBounce') {
          bullet.body.collideWorldBounds = true;
          bullet.body.bounce.set(1);
        }
        else {
          bullet.body.collideWorldBounds = false;
        }

        game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.stats.bulletSpeed, bullet.body.velocity);
        this.bulletTime = game.time.now + 100;
      }
    }
  };

  this.hit = function() {
    if(this.sprite.health > 0) {
      this.sprite.health--;
      HUD.hit(this.sprite.health);
      console.log("You get hit !", this.sprite.health);
    }

    if(this.sprite.health == 0) {
      this.sprite.kill();
      socket.emit({action: 'death'});
    }
  }
}
