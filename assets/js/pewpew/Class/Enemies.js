function Enemies(game) {
  this.states = [];

  this.bonuses = [];
  this.sprites = [];
  this.uuids = [];
  this.bullets = [];
  this.rotation = 0;
  this.bulletTime = 0;

  this.preload = function() {
  };

  this.add = function(uuid, pos, type) {
    this.uuids.push(uuid);

    var sprite = game.add.sprite(pos.x, pos.y, 'player-'+type);
    sprite.anchor.set(0.5);
    sprite.health = 10;
    sprite.uuid = uuid;
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    this.sprites[uuid] = sprite;

    var bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    this.bullets[uuid] = bullets;

    this.states.push({
      uuid: uuid,
      fire: false
    });

    HUD.addPlayer(uuid, type);
  };

  this.destroy = function(uuid) {
    if(this.sprites[uuid])
      this.sprites[uuid].kill();

    if(this.bullets[uuid])
      delete this.bullets[uuid];

    HUD.removePlayer(uuid);
  };

  this.update = function() {
    var _self = this;

    this.states.forEach(function(state, index) {
      if(state.fire) {
        _self._fire(state.uuid);
      }
    });
  };

  this.move = function(uuid, pInfos) {
    console.log("Enemy datas", pInfos.pos.y);
    if(this.sprites[uuid]) {
      console.log("Enemy found... update", pInfos);
      this.sprites[uuid].x = pInfos.pos.x;
      this.sprites[uuid].y = pInfos.pos.y;
      this.sprites[uuid].angle = pInfos.rotation;
      this.bonuses[uuid] = pInfos.bonus;
    }
  };

  this.fire = function(uuid) {
    this.states.forEach(function(state, index) {
      if(state.uuid == uuid) {
        state.fire = true;
      }
    });
  };

  this.stopFire = function(uuid) {
    this.states.forEach(function(state, index) {
      if(state.uuid == uuid) {
        state.fire = false;
      }
    });
  };

  this._fire = function(uuid) {
    if (game.time.now > this.bulletTime) {
      var bullet = this.bullets[uuid].getFirstExists(false),
          bulletLifespan = 2000,
          _self = this;

      if (bullet) {
        bullet.reset(this.sprites[uuid].body.x + 12, this.sprites[uuid].body.y + 12);
        bullet.lifespan = bulletLifespan;
        bullet.rotation = this.sprites[uuid].rotation;

        var bulletVelocity = 400;
        if(this.bonuses[uuid] == 'speed')
          bulletVelocity = 800;

        if(this.bonuses[uuid] == 'bulletBounce') {
          bullet.body.collideWorldBounds = true;
          bullet.body.bounce.set(1);
        }
        else {
          bullet.body.collideWorldBounds = false;
        }

        game.physics.arcade.velocityFromRotation(this.sprites[uuid].rotation, bulletVelocity, bullet.body.velocity);
        this.bulletTime = game.time.now + 100;
      }
    }
  };

  this.hit = function(target) {
    this.sprites[target].health--;
  };
}
