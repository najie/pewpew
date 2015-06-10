var maps = [];

function Map() {
  this.selectedMap = {};

  this.load = function(mapName) {
    console.log("Map selected: "+mapName);
    this.selectedMap = maps[mapName];
  };

  this.preload = function() {
    this.selectedMap.preload();
  };

  this.create = function() {
    this.selectedMap.create();
  };
  this.update = function() {
    this.selectedMap.update();
  }

}
