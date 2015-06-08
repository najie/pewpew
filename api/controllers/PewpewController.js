/**
 * PewpewController
 *
 * @description :: Server-side logic for managing pewpews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  defaultRoom: 'room-1',
  actions: [],
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
      sails.sockets.broadcast(this.defaultRoom, 'newPlayer', {uuid: req.param('uuid'), pos: req.param('pos')}, req.socket);

      Pewpew.find({roomId: this.defaultRoom}).exec(function(err, players) {
        var i = 0,
          playersPos = [];

        Pewpew.create({
          roomId: _self.defaultRoom,
          uuid: req.param('uuid'),
          posX: req.param('pos').x,
          posY: req.param('pos').y,
          rotation: 0
        }).exec(function(err, pewpew) {
          console.log("create a pew", pewpew);
          if(err) {
            console.log("Error pewpew create", err);
          }
        });

        if(players) {
          players.forEach(function(player, index) {
            i++;
            playersPos.push({uuid: player.uuid, pos:{x: player.spawnX, y: player.spawnY}});

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
    var _self = this;
    if(req.isSocket) {
      this.actions.push({id: req.socket.id});
      sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
        pos: req.param('pos'),
        rotation: req.param('rotation'),
        uuid: req.param('uuid')
      }, req.socket);
    }
    res.ok();
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

