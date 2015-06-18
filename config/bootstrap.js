/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  Action.destroy({roomId: 'room-1'}).exec(function(){});
  Pewpew.destroy({roomId: 'room-1'}).exec(function(){});

  var loopServer = true;

  var nbSpawn = 5;
  var bonuses = [{
    name: 'health',
    value: 5
  }, {
    name: 'speed',
    value: 20000
  }, {
    name: 'bulletBounce',
    value: 5000
  }];

  if(loopServer) {
    setInterval(function() {
      var spawn = rand(1, nbSpawn)-1;
      var bonus = bonuses[rand(1, bonuses.length)-1];
      console.log("Spawn bonus ("+bonus.name+") to zone "+spawn);
      sails.sockets.broadcast('room-1', 'popBonus', {bonus: bonus.name, value: bonus.value, spawn: spawn});
    }, 1000);
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}
