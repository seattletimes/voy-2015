require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

var ready = require("./brightcove");
var dot = require("./lib/dot");
var playlistTemplate = dot.compile(require("./_playlist.html"));
var videoContainer = document.querySelector(".video-container");
var playlistContainer = document.querySelector(".playlist-container");

var log = console.log.bind(console);

var playlistIDs = {
  top: 4663810165001,
  popular: 4664303231001
};

var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));

var closest = function(element, className) {
  while (element && !element.classList.contains(className)) element = element.parentElement;
  return element;
};

ready(function(player) {
  window.player = player;
  
  var playlistCache = {};
  
  var retrievePlaylist = function(id, callback) {
    if (playlistCache[id]) return callback(playlistCache[id]);
    player.catalog.getPlaylist(id, function(err, playlist) {
      playlistCache[id] = playlist;
      callback(playlist);
    });
  };
  
  var loadPlaylist = function(id) {
    retrievePlaylist(id, function(playlist) {
      playlistContainer.innerHTML = playlistTemplate(playlist);
      player.catalog.load(playlist);
    });
  };
  
  loadPlaylist(playlistIDs.top);
  
  var onClickPlaylist = function() {
    var id = this.getAttribute("data-playlist");
    playlistContainer.innerHTML = "Loading playlist...";
    loadPlaylist(id);
  };
  
  qsa(".choose-playlist li").forEach(el => el.addEventListener("click", onClickPlaylist));

  // player.catalog.getPlaylist(playlistID, function(err, playlist) {
  //   playlist.forEach(p => p.caption = ids[p.id]);
  //   playlistContainer.innerHTML = playlistTemplate(playlist);
  //   player.catalog.load(playlist);

  //   var lookup = {};
  //   playlist.forEach((v, i) => lookup[v.id] = v);

  //   playlistContainer.addEventListener("click", function(e) {
  //     if (playlistContainer.getAttribute("data-enabled") == "false") return;
  //     var li = closest(e.target, "playlist-item");
  //     var id = li.getAttribute("data-id");
  //     var index = player.playlist.indexOf(lookup[id]);
  //     window.location = "#player";
  //     player.playlist.currentItem(index);
  //     player.play();
  //   });

  //   var update = function(e) {
  //     if (e.type == "play") videoContainer.classList.remove("pending");
  //     var active = document.querySelector("li.playlist-item.active");
  //     if (active) active.classList.remove("active");
  //     var playingAd = player.ads.state == "ad-playback";
  //     playlistContainer.setAttribute("data-enabled", !playingAd);
  //     if (playingAd) return;
  //     playlistContainer.classList.add("enabled");
  //     if (player.paused()) return;
  //     var id = player.mediainfo.id;
  //     var li = document.querySelector(`li[data-id="${id}"]`);
  //     if (li) {
  //       li.classList.add("active");
  //     }
  //   };

  //   "play playing blocked adstart adend loadstart loadedmetadata loadeddata".split(" ").forEach(e => player.on(e, update));

  // });
});
