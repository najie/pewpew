function Bonus() {

  this.sprites = [];
  this.bonusOnSpawn = [];

  this.preload = function () {
    game.load.image('bonus-health', '/images/bonus-health.png');
  };

  this.create = function() {
    var bonus = game.add.group();
    bonus.enableBody = true;
    bonus.physicsBodyType = Phaser.Physics.ARCADE;

    this.sprites = bonus;
  };

  this.add = function(bonus, value, spawn) {
    if(!this.bonusOnSpawn[spawn]) {
      console.log(spawn, map);
      var sprite = this.sprites.create(map.selectedMap.bonusSpawns[spawn][0], map.selectedMap.bonusSpawns[spawn][1], 'bonus-'+bonus);
      sprite.spawn = spawn;
      sprite.bonus = bonus;
    }
    else {
      console.log('A bonus already here on this spawn');
    }
    this.bonusOnSpawn[spawn] = true;
  };

  this.update = function () {
    var _self = this;
    game.physics.arcade.overlap(player.sprite, this.sprites, function(player, bonus) {
      bonus.kill();
      console.log(bonus.spawn);
      delete _self.bonusOnSpawn[bonus.spawn];
      switch(bonus.bonus) {
        case 'health':
          player.health += 5;
          HUD.updateHealth(player.health);
          break;
      }
    });
  };

  this.remove = function(spawn) {

  };

}
