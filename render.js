const Rx = require('rxjs/Rx');

module.exports = {
  artistAndRelatedArtists: renderArtistAndRelatedArtists
};

function wrapped(above,content,below){
  above = above || "";
  below = below || "";

  return Rx.Observable.concat(
    Rx.Observable.of(above),
    content,
    Rx.Observable.of(below)
  );
}

function renderArtistAndRelatedArtists(artist,relatedArtists){
  return wrapped(
    `<body><h1>Artist: ${artist.name}</h1>`,
    renderRelatedArtists(relatedArtists),
    "</body>"
  );
}

function renderRelatedArtists(relatedArtists){
  return wrapped(
    "<section><h1>related artists</h1>",
    relatedArtists.concatMap( renderRelatedArtistAndTracks ),
    "</section>"
  );
}

function renderTracks(tracks){
  return wrapped(
    "<div><h4>top tracks</h4>",
    tracks.concatMap( renderTrack  ),
    "</div>"
  );
}

function renderTrack(track){
  return `<div><a href="${track.preview_url}">${track.name}</a></div>`;
}

function renderRelatedArtistAndTracks(artistPlusTracks){
  return wrapped(
    `<div><h3>${artistPlusTracks.artist.name}</h3>`,
    renderTracks(artistPlusTracks.tracks),
    "</div>"
  );
}

