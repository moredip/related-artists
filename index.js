const Rx = require('rxjs/Rx');
const http = require('http');
const parseUrl = require('url').parse;

const spotify = require('./spotify');
const observableToStream = require('./observable-to-node-stream');
const render = require('./render');

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

    return render.artistAndRelatedArtists(artist,relatedArtistsAndTracks);
  });

  observableToStream(output,res);
});



const port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);

