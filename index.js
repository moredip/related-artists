const http = require('http');
const parseUrl = require('url').parse;

const spotify = require('./spotify');
const observableToStream = require('./observable-to-node-stream');

function pluckArtistNameFromUrl(url){
  return unescape( parseUrl(url).pathname.split("/")[1] );
}

const server = http.createServer( function(req,res) {
  res.setHeader('Content-Type', 'text/html');
  
  var artistName = pluckArtistNameFromUrl(req.url);

  if( artistName.length === 0 ){
    artistName = "Taylor Swift";
  }

  const relatedArtists$ = spotify.searchForArtist(artistName)
    .take(1)
    .flatMap(spotify.relatedArtists);

  const html$ = relatedArtists$.map( (a) => `<li>${a.name}</li>` );

  observableToStream( html$, res );
});


const port = (process.argv[2] || 8000);
console.log("SERVER LISTENING ON PORT "+port);
server.listen(port);

