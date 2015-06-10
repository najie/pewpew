/**
 * Created by jeremylaurain on 10/06/15.
 */
maps['map1'] = {
  sprites : [],
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
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.ARCADE;

    walls.create(200,0, 'wall-100-v');
    walls.create(200, 300, 'wall-100-v');

    walls.create(250, 150, 'wall-100-v');
    walls.create(250, 150, 'wall-100-h');
    walls.create(250, 250, 'wall-100-h');

    walls.create(490, 150, 'wall-100-v');
    walls.create(400, 150, 'wall-100-h');
    walls.create(400, 250, 'wall-100-h');

    walls.create(600, 50, 'spawn-100');
    walls.create(650, 250, 'spawn-100');
    walls.create(50, 150, 'spawn-100');

    walls.setAll('body.immovable', true);
    this.sprites = walls;

    /*this.sprite = game.add.sprite(200, 0, 'wall-100-v');
    this.sprite.body.immovable = true;*/
  },
  update: function() {
    var _self = this;
    game.physics.arcade.collide(player.sprite, this.sprites);
    game.physics.arcade.collide(player.bullets, this.sprites, function(bullet, wall) {
      bullet.kill();
    });
    enemies.uuids.forEach(function(uuid, index) {
      game.physics.arcade.collide(enemies.bullets[uuid], _self.sprites, function(bullet, wall) {
        bullet.kill();
      });
    });

  }

};
