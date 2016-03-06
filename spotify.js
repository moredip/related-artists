const Rx = require('rxjs/Rx');
const request = require('request');
const JSONStream = require('JSONStream');

const urls = require('./spotify-urls');
const observableFromStream = require('./observable-from-node-stream');

module.exports = {
  searchForArtist: searchForArtist,
  sampleTracksFromArtistsRelatedTo: sampleTracksFromArtistsRelatedTo
};

function searchForArtist(artistName){
  const artistsStream = request.get(urls.artistSearch(artistName))
      .pipe(JSONStream.parse("artists.items"));

  return observableFromStream(artistsStream)
    .flatMap(Rx.Observable.fromArray);
}

function artistsRelatedTo(artist){
  const artistsStream = 
    request.get(urls.artistsRelatedTo(artist.id))
      .pipe(JSONStream.parse("artists.*"));

  return observableFromStream(artistsStream);
}

function topTracksFor(artist){
  const tracksStream = request.get(urls.topTracksFor(artist.id))
    .pipe(JSONStream.parse("tracks.*"));

  return observableFromStream(tracksStream);
}

function sampleTracksFromArtistsRelatedTo(artist){
  const relatedArtists$ = artistsRelatedTo(artist);

  return relatedArtists$.map( function(relatedArtist){
    return {
      artist:relatedArtist,
      tracks:topTracksFor(relatedArtist)
    };
  });
}


//const firstArtistSearchResult = searchForArtist(artistName).take(1);

//firstArtistSearchResult
  //.flatMap( sampleTracksFromArtistsRelatedTo )
  //.subscribe( (_)=> console.log(_) );
