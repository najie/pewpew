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
    var _self = this;
    if(req.isSocket) {
      console.log("A player want to join", req.param('pos'));

      sails.sockets.join(req.socket, this.defaultRoom);
      sails.sockets.broadcast(this.defaultRoom, 'newPlayer', {uuid: req.param('uuid'), pos: req.param('pos')});



      Pewpew.find({roomId: this.defaultRoom}).exec(function(err, players) {
        var i = 0,
          playersPos = [];

        Pewpew.create({
          roomId: _self.defaultRoom,
          playerId: req.param('uuid'),
          spawnX: req.param('pos').x,
          spawnY: req.param('pos').y
        }).exec(function(err, pewpew) {
          console.log("create a pew", pewpew);
          if(err) {
            console.log("Erreur pewpew create", err);
          }
        });

        if(players) {
          players.forEach(function(player, index) {
            i++;

            playersPos.push({uuid: player.playerId, pos:{x: player.spawnX, y: player.spawnY}});

            if(i == players.length || players.length == 0) {
              res.json({status: 'connected', players:playersPos});
            }
          });
        }
        else {
          res.json({status: 'connected', players:[]});
        }

      });
    }
    else {
      res.badRequest();
    }
  },
  updatePlayer: function(req, res) {
    if(req.isSocket) {
      sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
        uuid: req.param('uuid'),
        pos: req.param('pos'),
        rotation: req.param('rotation')
      }, req.socket);

      res.ok();
    }
  },
  cleanRoom: function(req, res) {
    var roomId = req.param('id');
    if(roomId) {
      Pewpew.destroy({roomId: roomId}).exec(function(err, pewpew) {
        console.log(err, pewpew);
        res.ok();
      });
    }
    else {
      res.badRequest();
    }

  }
};

