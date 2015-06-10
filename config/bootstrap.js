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

  setInterval(function() {
    var spawn = rand(1, 4)-1;
    console.log("Spawn bonus to zone "+spawn);
    sails.sockets.broadcast('room-1', 'popBonus', {bonus: 'health', value: 5, spawn: spawn});
  }, 10000);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};

function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}
