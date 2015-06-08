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

  var gameloop = require('node-gameloop');

// start the loop at 30 fps (1000/30ms per frame) and grab its id
  var frameCount = 0;
  var id = gameloop.setGameLoop(function(delta) {
    // `delta` is the delta time from the last frame

    Action.find().exec(function(err, players) {
      if(players.length > 0) {
        console.log("Action to send", players.length, players);
        sails.sockets.broadcast('room-1', 'updatePlayer', players);
        Action.destroy({roomId: 'room-1'}).exec(function(){});
      }
    });

  }, 1000 / 30);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
