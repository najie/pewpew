/**
 * PewpewController
 *
 * @description :: Server-side logic for managing pewpews
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  defaultRoom: 'room-1',
  types: [
    'red',
    'yellow',
    'blue',
    'green',
    'white'
  ],
  actions: [],
  connect: function(req, res) {
    var _self = this;
    if(req.isSocket) {
      var nbPlayer = sails.sockets.subscribers('room-1').length;
      if(nbPlayer < 5) {
        Pewpew.find({roomId: 'room-1'}).exec(function(err, players) {
          var i = 0;
          while(!typeFound) {
            var typeFound = true;
            var type = _self.types[i];
            players.forEach(function (player, j) {
              if (player.type == type) {
                typeFound = false;
                i++;
              }
            });
          }

          res.json({id: req.socket.id, type: type});
        });
      }
      else {
        res.badRequest();
      }
    }
  },
	join: function(req, res) {
    var _self = this;
    if(req.isSocket) {
      console.log("A player want to join", req.param('pos'));
      if(sails.sockets.subscribers('room-1').length > 5) {
        res.json({status: 'Room is full'});
      }
      else {
        sails.sockets.join(req.socket, this.defaultRoom);
        sails.sockets.broadcast(this.defaultRoom, 'newPlayer', {
          uuid: req.param('uuid'),
          pos: req.param('pos'),
          type: req.param('type')
        }, req.socket);

        Pewpew.find({roomId: this.defaultRoom}).exec(function(err, players) {
          var i = 0,
            playersPos = [];

          Pewpew.create({
            roomId: _self.defaultRoom,
            uuid: req.param('uuid'),
            posX: req.param('pos').x,
            posY: req.param('pos').y,
            rotation: 0,
            type: req.param('type')
          }).exec(function(err, pewpew) {
            console.log("create a pew", pewpew);
            if(err) {
              console.log("Error pewpew create", err);
            }
          });

          if(players) {
            players.forEach(function(player, index) {
              i++;
              playersPos.push({uuid: player.uuid, pos:{x: player.posX, y: player.posY}, type: player.type});

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
    }
    else {
      res.badRequest();
    }
  },
  updatePlayer: function(req, res) {
    var _self = this,
        datas = req.param('datas'),
        action = req.param('action'),
        uuid = req.param('uuid');

    if(req.isSocket) {
      this.actions.push({id: req.socket.id});
      switch(action) {
        case 'move':
        case 'fire':
          sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
            pInfos: datas,
            uuid: req.socket.id,
            action: action
          }, req.socket);
          break;
        case 'hit':
          sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
            pInfos: datas,
            uuid: req.socket.id,
            action: action
          }, req.socket);
          break;
        case 'death':
          sails.sockets.broadcast(this.defaultRoom, 'updatePlayer', {
            uuid: req.socket.id,
            action: action
          }, req.socket);
          break;
      }
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

