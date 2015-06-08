function Enemies(game) {

  this.sprites = [];
  this.rotation = 0;

  this.preload = function() {
  };

  this.add = function(uuid, pos, type) {
    var sprite = game.add.sprite(pos.x, pos.y, 'player-'+type);
    sprite.anchor.set(0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    this.sprites[uuid] = sprite;
  };

  this.destroy = function(uuid) {
    if(this.sprites[uuid])
      this.sprites[uuid].kill();
  };

  this.receive = function(datas) {
    if(this.sprites[datas.uuid]) {
      console.log("Enemy found... update");
      this.sprites[datas.uuid].x = datas.pos.x;
      this.sprites[datas.uuid].y = datas.pos.y;
      this.sprites[datas.uuid].angle = datas.rotation;
    }
  };
}
