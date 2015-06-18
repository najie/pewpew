function Socket() {
  var apiUrl = "localhost:1337",
      latency = 30;

  this.lastUpdate = Date.now();

  this.init = function(cb) {
    var _self = this;
    io.socket.get(apiUrl+'/pewpew/connect', function(response) {
      console.log('Asking your uuid...', response);
      uuid = response.id;
      cb(response.type);

      _self.join({pos:{x:player.spawnX, y: player.spawnY}, type: response.type});
    });

    io.socket.on('newPlayer', function(datas) {
      console.log('New player', uuid);
      enemies.add(datas.uuid, datas.pos, datas.type);
    });
    io.socket.on('leavePlayer', function(datas) {
      console.log("A player leave the game");
      enemies.destroy(datas.uuid);
    });
    io.socket.on('updatePlayer', function(datas) {
      console.log("Action receive", datas);
      if(datas.pInfos && datas.pInfos.health) {
        HUD.updatePlayer(datas);
      }
      switch(datas.action) {
        case 'move':
          enemies.move(datas.uuid, datas.pInfos);
          break;
        case 'fire':
          enemies.move(datas.uuid, datas.pInfos);
          enemies.fire(datas.uuid, datas.bonus);
          break;
        case 'stopFire':
          enemies.move(datas.uuid, datas.pInfos);
          enemies.stopFire(datas.uuid);
          break;
        case 'pickBonus':
          bonus.remove(datas.spawn);
        case 'hit':
          if(datas.pInfos.target !== uuid)
            enemies.hit(datas.target);
          else {
            player.hit();
          }
          break;
        case 'death':
          console.log('SOMEONE DIED');
          enemies.destroy(datas.uuid);
      }
    });
    io.socket.on('popBonus', function(datas) {
      bonus.add(datas.bonus, datas.value, datas.spawn);
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
            enemies.add(player.uuid, player.pos, player.type);
          });
        }
      }
    });
  };

  this.emit = function(datas) {
    datas.uuid = uuid;
    if(Date.now() - this.lastUpdate > latency) {
      this.lastUpdate = Date.now();
      io.socket.post(apiUrl+"/pewpew/updatePlayer", datas, function(response) {});
    }
  };

  this.directEmit = function(datas) {
    io.socket.post(apiUrl+"/pewpew/updatePlayer", datas, function(response) {});
  }

}
