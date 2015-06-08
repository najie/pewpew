function Enemies(game) {

  this.sprite = null;
  this.rotation = 0;

  this.preload = function() {
    game.load.image('enemy', '/images/player.png');
  };

  this.add = function(enemyUuid, pos) {
    this.sprite = game.add.sprite(pos.x, pos.y, 'enemy');
    this.sprite.anchor.set(0.5);
    this.sprite.id = enemyUuid;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  };

  this.destroy = function(uuid) {
    if(this.sprite)
      this.sprite.kill();
  };

  this.receive = function(datas) {
    if(this.sprite) {
      this.sprite.x = datas.pos.x;
      this.sprite.y = datas.pos.y;
      if(this.sprite.body) {
        this.sprite.angle = datas.rotation;
      }
    }
  };
}
