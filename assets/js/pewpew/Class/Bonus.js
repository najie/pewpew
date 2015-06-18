function Bonus() {

  this.sprites = [];
  this.bonusOnSpawn = [];

  this.preload = function () {
    game.load.image('bonus-health', '/images/bonus-health.png');
    game.load.image('bonus-speed', '/images/bonus-speed.png');
    game.load.image('bonus-bulletBounce', '/images/bonus-bulletBounce.png');
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
      sprite.bonusName = bonus;
      sprite.bonusValue = value;
    }
    else {
      console.log('A bonus already here on this spawn');
    }
    this.bonusOnSpawn[spawn] = true;
  };

  this.update = function () {
    var _self = this;
    game.physics.arcade.overlap(player.sprite, this.sprites, function(playerSprite, bonus) {
      console.log(bonus.spawn);
      _self.remove(bonus.spawn);
      socket.directEmit({action: 'pickBonus', datas: {spawn: bonus.spawn}});
      switch(bonus.bonusName) {
        case 'health':
          playerSprite.health += bonus.bonusValue;
          HUD.updateHealth(playerSprite.health);
          break;
        case 'speed':
          console.log("bonus speed", player);
          if(player.stats.bonus.name) {
            clearTimeout(player.stats.bonus.timeout);
            _self.clear(player.stats.bonus.name);
          }
          console.log(player.stats);
          player.stats.speed = 280;
          player.stats.bulletSpeed = 1000;
          player.stats.bonus = {
            name: 'speed',
            timeout: setTimeout(function() {
                _self.clear('speed');
              },
              bonus.bonusValue)
          };
          break;
        case 'bulletBounce':
          player.stats.bonus = {
            name: 'bulletBounce',
            timeout: setTimeout(function() {
                _self.clear('bulletBounce');
              },
              bonus.bonusValue)
          };
          break;
      }
    });
  };

  this.remove = function(spawn) {
    this.sprites.forEach(function(sprite, index) {
      if(sprite.spawn == spawn)
        sprite.kill();
    });
    delete this.bonusOnSpawn[spawn];
  };

  this.clear = function(bonusName) {
    console.log("clear bonus "+bonusName);
    switch(bonusName) {
      case 'speed':
        player.stats.speed = 200;
        player.stats.bulletSpeed = 400;
        player.stats.bonus = {name: null, timeout: null};
        break;
      case 'bulletBounce':
        player.stats.bonus = {name: null, timeout: null};
        break;
    }
  }

}
