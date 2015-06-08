function Enemies(game) {

  this.sprites = [];
  this.bullets = [];
  this.rotation = 0;
  this.doUpdate = false;
  this.bulletTime = 0;

  this.preload = function() {
  };

  this.add = function(uuid, pos, type) {
    var sprite = game.add.sprite(pos.x, pos.y, 'player-'+type);
    sprite.anchor.set(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    this.sprites[uuid] = sprite;

    var bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    console.log(uuid);
    this.bullets[uuid] = bullets;
  };

  this.destroy = function(uuid) {
    if(this.sprites[uuid])
      this.sprites[uuid].kill();

    if(this.bullets[uuid])
      this.bullets[uuid].destroy();
  };

  this.update = function() {
      if(this.doUpdate.action == 'fire') {
        this.fire(this.doUpdate.uuid);
      }
  };

  this.receive = function(datas) {
    if(this.sprites[datas.uuid]) {
      console.log("Enemy found... update", datas);
      this.sprites[datas.uuid].x = datas.pos.x;
      this.sprites[datas.uuid].y = datas.pos.y;
      this.sprites[datas.uuid].angle = datas.rotation;
      if(datas.action == 'fire') {
        console.log("fire");
        this.doUpdate = {action: 'fire', uuid: uuid};
      }
    }
  };

  this.fire = function(uuid) {
    if (game.time.now > this.bulletTime) {
      console.log(this.bullets, uuid);
      var bullet = this.bullets[uuid].getFirstExists(false),
          bulletLifespan = 2000,
          _self = this;

      if (bullet) {
        bullet.reset(this.sprite.body.x + 12, this.sprite.body.y + 12);
        bullet.lifespan = bulletLifespan;
        bullet.rotation = this.sprite.rotation;
        game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, bullet.body.velocity);
        this.bulletTime = game.time.now + 100;
        setTimeout(function() {
          _self.doUpdate = null;
        }, bulletLifespan);
      }
    }
  };
}
