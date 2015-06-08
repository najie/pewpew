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
      if(datas.uuid !== uuid) {
        console.log('Nouveau joueur');
        enemies.add(datas.uuid, datas.pos);
      }
    });
    io.socket.on('leavePlayer', function(datas) {
      enemies.destroy(datas.uuid);
    });
    io.socket.on('updatePlayer', function(datas) {
      console.log('update');
      if(datas.uuid !== uuid)
        enemies.receive(datas);
    });
  };

  this.join = function(datas) {
    datas.uuid = uuid;
    io.socket.post(apiUrl+"/pewpew/join", datas, function(response) {
      if(response.status == 'connected') {
        console.log("You join the room !");
      }
    });
  };

  this.emit = function(datas) {
    datas.uuid = uuid;
    if(Date.now() - this.lastUpdate > 25) {
      this.lastUpdate = Date.now();
      io.socket.post(apiUrl+"/pewpew/updatePlayer", datas, function() {

      });
    }
  };

}
