/**
 * Created by jeremylaurain on 10/06/15.
 */
maps['map1'] = {
  walls : [],
  spawnsCoords : [
    [600,50], [650, 250], [50,150]
  ],
  bonusSpawns: [
    [90, 30],
    [90, 340],
    [280, 193],
    [460, 193],
    [760, 360]
  ],

  preload: function() {
    console.log('preload map1');
    game.load.image('wall-100-h', '/images/wall-100-h.jpg');
    game.load.image('wall-100-v', '/images/wall-100-v.jpg');
    game.load.image('block-100', '/images/block-100.jpg');
    game.load.image('spawn-100', '/images/spawn-100.png');
  },
  create: function() {
    game.stage.setBackgroundColor('#808C86');
    var walls = game.add.group();
    var spawns = game.add.group();
    spawns.enableBody = true;
    spawns.physicsBodyType = Phaser.Physics.ARCADE;
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;

    walls.create(200,0, 'wall-100-v');
    walls.create(200, 300, 'wall-100-v');

    // Middle Left
    //walls.create(250, 150, 'wall-100-v');
    walls.create(250, 150, 'wall-100-h');
    walls.create(250, 250, 'wall-100-h');
    // Middle Right
    //walls.create(510, 150, 'wall-100-v');
    walls.create(420, 150, 'wall-100-h');
    walls.create(420, 250, 'wall-100-h');

    spawns.create(this.spawnsCoords[0][0], this.spawnsCoords[0][1], 'spawn-100');
    spawns.create(this.spawnsCoords[1][0], this.spawnsCoords[1][1], 'spawn-100');
    spawns.create(this.spawnsCoords[2][0], this.spawnsCoords[2][1], 'spawn-100');

    walls.setAll('body.immovable', true);
    spawns.setAll('body.immovable', true);
    this.walls = walls;
    this.spawns = spawns;
  },
  update: function() {
    var _self = this;
    game.physics.arcade.collide(player.sprite, this.walls);
    game.physics.arcade.collide(player.sprite, this.spawns);

    player.stats.disableFire = false;
    game.physics.arcade.overlap(player.sprite, this.spawns, function(bullet, wall) {
      player.stats.disableFire = true;
    });

    game.physics.arcade.collide(player.bullets, this.walls, function(bullet, wall) {
      if(player.stats.bonus.name !== 'bulletBounce')
        bullet.kill();
    });

    game.physics.arcade.collide(player.bullets, this.spawns, function(bullet, wall) {
      if(player.stats.bonus.name !== 'bulletBounce')
        bullet.kill();
    });

    enemies.uuids.forEach(function(uuid, index) {
      game.physics.arcade.collide(enemies.bullets[uuid], _self.walls, function(bullet, wall) {
        if(enemies.bonuses[uuid] !== 'bulletBounce')
          bullet.kill();
      });

      game.physics.arcade.collide(enemies.bullets[uuid], _self.spawns, function(bullet, spawn) {
        if(enemies.bonuses[uuid] !== 'bulletBounce')
          bullet.kill();
      });
    });

  }

};
