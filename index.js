const Rx = require('rxjs/Rx');
const http = require('http');
const parseUrl = require('url').parse;

const spotify = require('./spotify');
const observableToStream = require('./observable-to-node-stream');

function pluckArtistNameFromUrl(url){
  return unescape( parseUrl(url).pathname.split("/")[1] );
}

const server = http.createServer( function(req,res) {
  var artistName = pluckArtistNameFromUrl(req.url);

  if( artistName.length === 0 ){
    artistName = "Taylor Swift";
  }

  const firstArtistSearchResult = spotify.searchForArtist(artistName).take(1);

  const output = firstArtistSearchResult.flatMap( function(artist){
    const relatedArtistsAndTracks = spotify.sampleTracksFromArtistsRelatedTo(artist);

    return renderArtistAndRelatedArtists(artist,relatedArtistsAndTracks);
  });

  observableToStream(output,res);
});


const firstArtistSearchResult = spotify.searchForArtist('aphex').take(1);

function renderArtistAndRelatedArtists(artist,relatedArtists){
  return Rx.Observable.concat(
    renderArtist(artist),
    renderRelatedArtists(relatedArtists)
  );
}

function renderArtist(artist){
  return Rx.Observable.of("<html><h1>Artists related to "+artist.name+"</h1>");
}

function renderTracks(tracks){
  return tracks.map( function(track){
    return "<li>"+track.name+"</li>";
  });
}

function renderRelatedArtistAndTracks(artistPlusTracks){
  return Rx.Observable.concat(
    Rx.Observable.of("<p>related: "+artistPlusTracks.artist.name+"</p>"),
    renderTracks(artistPlusTracks.tracks)
  );
}

function renderRelatedArtists(relatedArtists){
  return Rx.Observable.concat(
    Rx.Observable.of("<section><h1>Related</h1>"),
    relatedArtists.concatMap( renderRelatedArtistAndTracks ),
    Rx.Observable.of("</section>")
  );

}

const port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);

