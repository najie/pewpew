function Enemies(game) {

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
  };

  this.move = function(datas) {
    console.log("Enemy datas", datas.pos.y);
    if(this.sprites[datas.uuid]) {
      console.log("Enemy found... update", datas);
      this.sprites[datas.uuid].x = datas.pos.x;
      this.sprites[datas.uuid].y = datas.pos.y;
      this.sprites[datas.uuid].angle = datas.rotation;
    }
  };

  this.fire = function(uuid) {
    if (game.time.now > this.bulletTime) {
      var bullet = this.bullets[uuid].getFirstExists(false),
          bulletLifespan = 2000,
          _self = this;

      if (bullet) {
        bullet.reset(this.sprites[uuid].body.x + 12, this.sprites[uuid].body.y + 12);
        bullet.lifespan = bulletLifespan;
        bullet.rotation = this.sprites[uuid].rotation;
        game.physics.arcade.velocityFromRotation(this.sprites[uuid].rotation, 400, bullet.body.velocity);
        this.bulletTime = game.time.now + 100;
      }
    }
  };

  this.hit = function(target) {
    this.sprites[target].health--;
  };

  this.updateHUD = function(datas) {

  };
}
