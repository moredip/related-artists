const Rx = require('rxjs/Rx');
const request = require('request');
const JSONStream = require('JSONStream');

const urls = require('./spotify-urls');
const observableFromStream = require('./observable-from-node-stream');

var artistName = process.argv[2] || "Aphex Twin";

function searchForArtist(artistName){
  const artistsStream = request.get(urls.artistSearch(artistName))
      .pipe(JSONStream.parse("artists.items"));

  return observableFromStream(artistsStream)
    .flatMap(Rx.Observable.fromArray);
}

searchForArtist(artistName)
  .subscribe( (_)=> console.log(_) );

