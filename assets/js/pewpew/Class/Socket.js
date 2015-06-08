function Socket() {
  var apiUrl = "localhost:1337";
  this.lastUpdate = Date.now();

  this.init = function() {
    var _self = this;
    io.socket.get(apiUrl+'/pewpew/connect', function(response) {
      console.log('Asking your uuid...', response);
      uuid = response.id;

      _self.join({pos:{x:player.spawnX, y: player.spawnY}});
    });

    io.socket.on('newPlayer', function(datas) {
      console.log('New player', uuid);
      enemies.add(datas.uuid, datas.pos);
    });
    io.socket.on('leavePlayer', function(datas) {
      console.log("A player leave the game");
      enemies.destroy(datas.uuid);
    });
    io.socket.on('updatePlayer', function(datas) {
      console.log("update");
      if(datas) {
        enemies.receive({uuid: datas.uuid, pos:{x: datas.pos.x, y: datas.pos.y}, rotation: datas.rotation});
      }
    });
  };

  this.join = function(datas) {
    datas.uuid = uuid;
    io.socket.post(apiUrl+"/pewpew/join", datas, function(response) {
      if(response.status == 'connected') {
        console.log("You join the room !", response);
        if(response.players) {
          response.players.forEach(function(player, index) {
            console.log(player);
            enemies.add(player.uuid, player.pos);
          });
        }
      }
    });
  };

  this.emit = function(datas) {
    datas.uuid = uuid;
    if(Date.now() - this.lastUpdate > 30) {
      this.lastUpdate = Date.now();
      io.socket.post(apiUrl+"/pewpew/updatePlayer", datas, function() {});
    }
  };

}
