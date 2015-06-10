function HUD() {

  this.addPlayer = function(uuid, type) {
    $('#players').append('<li class="'+uuid+'"><img src="/images/player-'+type+'.png" height="25" /><span class="health">Vie: <span class="value">10</span></span></li>');
  };

  this.updatePlayer = function(datas) {
    $('#players .'+datas.uuid+' .health .value').html(datas.pInfos.health);
  };

  this.removePlayer = function(uuid) {
    $('#players .'+uuid).remove();
  };

  this.updateHealth = function(health) {
    $('#me .health .value').html(health);
  };
}
