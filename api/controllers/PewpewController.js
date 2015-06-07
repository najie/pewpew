/**
 * PewpewController
 *
 * @description :: Server-side logic for managing pewpews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  defaultRoom: 'room-1',
  connect: function(req, res) {
    if(req.isSocket) {
      res.json({id: req.socket.id});
    }
  },
	join: function(req, res) {
    if(req.isSocket) {
      console.log("A player try to join", req.param('pos'));

      sails.sockets.join(req.socket, this.defaultRoom);
      sails.sockets.broadcast(this.defaultRoom, 'newPlayer', {uuid: req.param('uuid'), pos: req.param('pos')});

      res.json({status: 'connected'});
    }
    else {
      res.badRequest();
    }
  },
  updatePlayer: function(req, res) {
    console.log(req.param('angle'));
    if(req.isSocket) {
      sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
        uuid: req.param('uuid'),
        pos: req.param('pos'),
        rotation: req.param('rotation')
      }, req.socket);

      res.ok();
    }
  }
};

