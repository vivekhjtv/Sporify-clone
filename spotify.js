const clientID = "751efcf7b21446de95d4e8c055712772";
const clientSecret = "10b73cab7c1d4792936557bade44ceb0";
var access_token;
var auth_access_token;
function GetToken() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
    }
  };
  xhttp.open("POST", "https://accounts.spotify.com/api/token", true); //endpoint 1 Token
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader(
    "Authorization",
    "Basic " + btoa(clientID + ":" + clientSecret)
  );
  xhttp.send(["grant_type=client_credentials"]);
}
function myFunction(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  access_token = myObj.access_token;
  GetPlayLists();
  GetNewReleasess();
  GetGenres();
}
window.onload(GetToken());
function GetSongs(href) {
  console.log(href);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetSong(this);
    }
  };
  xhttp.open("GET", href, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetSong(json) {
  $("#exampleModal").modal("hide");
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  trackName = myObj.name;
  trackArtist = myObj.artists[0].name;
  if (myObj.preview_url == null) {
    alert("Preview is not available for this song.");
  } else {
    playAudio(myObj.preview_url);
  }
}

function GetArtists(href) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetArtist(this);
    }
  };
  xhttp.open("GET", href, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetArtist(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  document.getElementById("ArtistCover").innerHTML = "";
  $("#ArtistCover").append(
    '<div  class="item">' +
      '<img height="300px" width="300" src="' +
      myObj.images[0].url +
      '" />' +
      "<h4>" +
      myObj.name +
      "</h4>" +
      "<p>" +
      myObj.type +
      "</p>" +
      "<p>Popularity " +
      myObj.popularity +
      "</p>" +
      "</div>"
  );
  $("#ArtistCoverModal").modal("show");
}

function GetAlbums(href) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetAlbum(this);
    }
  };
  xhttp.open("GET", href, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetAlbum(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  document.getElementById("exampleModalLabel").innerHTML =
    "Album Name: " + myObj.name;
  document.getElementById("AlbumSongs").innerHTML = "";
  $.each(myObj.tracks.items, function (key, value) {
    $("#AlbumSongs").append(
      '<div style="cursor:pointer;" class="item" onclick=GetSongs("' +
        value.href +
        '")>' +
        '<div class="play">' +
        "</div>" +
        "<h4 >" +
        value.name +
        "</h4>" +
        "<p >" +
        value.artists[0].name +
        "</p>" +
        "</div>"
    );
  });
  document.getElementById("mybutton").click();
}
function GetGenres() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetGenre(this);
    }
  };
  xhttp.open(
    "GET",
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    true
  ); //endpoint 2 Genres
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetGenre(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  $.each(myObj.genres, function (key, value) {
    if (key < 11) {
      $("#genres").append(
        "<li>" +
          '<a href="#" onclick="GetRecommendations(\'' +
          value +
          "')\">" +
          value +
          "</a>" +
          "</li>"
      );
    }
  });
}
function GetPlayLists() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetPlayList(this);
    }
  };
  xhttp.open(
    "GET",
    "https://api.spotify.com/v1/browse/featured-playlists",
    true
  ); //endpoint 3 Featured playlist
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetPlayList(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  $.each(myObj.playlists.items, function (key, value) {
    console.log(key);
    $("#playlists").append(
      '<div onclick=GetPlaylistTracks("' +
        value.tracks.href +
        '") class="item">' +
        '<img src="' +
        value.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.description +
        "</p>" +
        "</div>"
    );
    if ((key = 9)) {
      ("\n");
    }
  });
}

function GetPlaylistTracks(urll) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetPlaylistTrack(this);
    }
  };
  xhttp.open("GET", urll, true);
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
var trackName;
var trackArtist;
function GetPlaylistTrack(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  document.getElementById("AlbumSongs").innerHTML = "";
  $.each(myObj.items, function (key, value) {
    console.log(key);
    trackName = value.track.name;
    trackArtist = value.track.artists[0].name;
    $("#AlbumSongs").append(
      '<div style="cursor: pointer; border-bottom: solid 2px green; margin: 10px;" onclick=GetSongs("' +
        value.track.href +
        '") class="item">' +
        '<div class="row">' +
        '<div class="col">' +
        "<h4>" +
        value.track.name +
        "</h4>" +
        "<p>" +
        value.track.artists[0].name +
        "</p>" +
        "</div>" +
        "</div>" +
        "</div>"
    );
  });
  document.getElementById("mybutton").click();
}
var audio;

function pauseAudio() {
  // If audio is not undefined and if is playing, pause it
  if (audio && !audio.paused) {
    audio.pause();
    // audio.currentTime = 0; // Rewind track to beginning (is you need this)
    let output =
      '<div class="text"><h6>' +
      trackName +
      "</h6><p>" +
      trackArtist +
      "</p></div>" +
      '<div class="button"><button type="button" onclick="play()"> <span class="fa fa-play"></span></button></div>';
    document.getElementById("player").innerHTML = output;
  }
}
function play() {
  // If audio is not undefined and if is playing, pause it
  if (audio && audio.paused) {
    audio.play();
    // audio.currentTime = 0; // Rewind track to beginning (is you need this)
    let output =
      '<div class="text"><h6>' +
      trackName +
      "</h6><p>" +
      trackArtist +
      "</p></div>" +
      '<div class="button"><button type="button" onclick="pauseAudio()"> <span class="fa fa-pause"></span></button></div>';
    document.getElementById("player").innerHTML = output;
  }
}

function playAudio(src) {
  pauseAudio();
  let trackUrl = src;
  document.getElementById("player").innerHTML = "";
  let output =
    '<div class="text"><h6>' +
    trackName +
    "</h6><p>" +
    trackArtist +
    "</p></div>" +
    '<div class="button"><button type="button" onclick="pauseAudio()"> <span class="fa fa-pause"></span></button></div>';
  document.getElementById("player").innerHTML = output;
  audio = new Audio(); // Save a reference
  audio.src = trackUrl;
  audio.play();
}

function GetMarkets() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetMarket(this);
    }
  };
  xhttp.open("GET", "https://api.spotify.com/v1/markets", true); //endpoint 4 Markets displayed in console only
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetMarket(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj.markets);
}
function GetNewReleasess() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetNewReleases(this);
    }
  };
  xhttp.open("GET", "https://api.spotify.com/v1/browse/new-releases", true); //endpoint 5 New Releases
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetNewReleases(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj.albums.items);
  $.each(myObj.albums.items, function (key, value) {
    $("#newreleases").append(
      '<div onclick=GetAlbums("' +
        value.href +
        '") class="item">' +
        '<img src="' +
        value.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.artists[0].name +
        "</p>" +
        "</div>"
    );
  });
}
function getSearches() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      getSearch(this);
    }
  };

  var searchItem = document.getElementById("searchbox").value;
  if (searchItem == "") {
    xhttp.open(
      "GET",
      "https://api.spotify.com/v1/search?q=popular&type=album,track,playlist,audiobook,artist",
      true
    ); //endpoint 6 Default Search
  } else {
    xhttp.open(
      "GET",
      "https://api.spotify.com/v1/search?q=" +
        searchItem +
        "&type=album,track,playlist,audiobook,artist",
      true
    ); //endpoint 7 User Search
  }
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}

function getSearch(json) {
  var jsonData = json.responseText;
  var myObj = JSON.parse(jsonData);
  var temp = console.log(myObj);
  document.getElementById("searchresults").innerHTML = "";
  $("#searchresults").append(
    "<h2> Search Results </h2>" +
      "<h2> Playlists </h2>" +
      '<div id="searchPlaylists"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks from Playlists</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.playlists.items, function (key, value) {
    console.log(key);
    $("#searchPlaylists").append(
      '<div onclick=GetPlaylistTracks("' +
        value.tracks.href +
        '") class="item">' +
        '<img src="' +
        value.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.owner.display_name +
        "</p>" +
        "</div>"
    );
  });
  $("#searchresults").append(
    "<h2> Albums </h2>" +
      '<div id="searchalbums"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks from Albums</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.albums.items, function (key, value) {
    console.log(key);
    $("#searchalbums").append(
      '<div onclick=GetAlbums("' +
        value.href +
        '") class="item">' +
        '<img src="' +
        value.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.artists[0].name +
        "</p>" +
        "</div>"
    );
  });
  $("#searchresults").append(
    "<h2> Tracks </h2>" +
      '<div id="searchtracks"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.tracks.items, function (key, value) {
    console.log(key);
    $("#searchtracks").append(
      '<div onclick=GetSongs("' +
        value.href +
        '") class="item">' +
        '<img src="' +
        value.album.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.artists[0].name +
        "</p>" +
        "</div>"
    );
  });
  $("#searchresults").append(
    "<h2> AudioBooks </h2>" +
      '<div id="searchaudiobooks"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.audiobooks.items, function (key, value) {
    console.log(key);
    $("#searchaudiobooks").append(
      '<div onclick=GetAudioBooks("' +
        value.href +
        '") class="item">' +
        '<img src="' +
        value.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.authors[0].name +
        "</p>" +
        "</div>"
    );
  });
  $("#searchresults").append(
    "<h2> Artists </h2>" +
      '<div id="searchArtists"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.artists.items, function (key, value) {
    console.log(key);

    $("#searchArtists").append(
      '<div  class="item" onclick=GetArtists("' +
        value.href +
        '")>' +
        //'<img src="' + value.images[0].url +'" />'
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.genres[0] +
        "</p>" +
        "</div>"
    );
  });
  $("#SearchModal").modal("hide");
}
function GetAudioBooks() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetAudioBook(this);
    }
  };
  xhttp.open(
    "GET",
    "https://api.spotify.com/v1/audiobooks/2IEBhnu61ieYGFRPEJIO40",
    true
  ); //endpoint 8 Audiobooks
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetAudioBook(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
}
function GetRecommendations(genre) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      GetRecommendation(this);
    }
  };
  xhttp.open(
    "GET",
    "https://api.spotify.com/v1/recommendations?limit=40&seed_genres=" + genre,
    true
  ); //endpoint 9 Recommendations by Genre
  xhttp.setRequestHeader("Authorization", "Bearer " + access_token);
  xhttp.send();
  console.log(access_token);
}
function GetRecommendation(json) {
  var jsonDoc = json.responseText;
  var myObj = JSON.parse(jsonDoc);
  var dd = console.log(myObj);
  document.getElementById("searchresults").innerHTML = "";
  $("#searchresults").append(
    "<h2> Recommendations </h2>" +
      '<div id="genreRecommendations"  class="list row">' +
      "</div>" +
      ' <h6 id="tracksfp" style="color: whitesmoke; visibility: hidden;">Tracks</h6>' +
      '<div id="playlist"  class="list">' +
      "</div>"
  );
  $.each(myObj.tracks, function (key, value) {
    console.log(key);
    $("#genreRecommendations").append(
      '<div onclick=GetSongs("' +
        value.href +
        '") class="item">' +
        '<img src="' +
        value.album.images[0].url +
        '" />' +
        '<div class="play">' +
        '<span class="fa fa-play" ></span>' +
        "</div>" +
        "<h4>" +
        value.name +
        "</h4>" +
        "<p>" +
        value.artists[0].name +
        "</p>" +
        "</div>"
    );
  });
}
function pageReload() {
  location.reload();
}
