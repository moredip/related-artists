const Rx = require('rxjs/Rx');
const request = require('request');
const JSONStream = require('JSONStream');

const urls = require('./spotify-urls');
const observableFromStream = require('./observable-from-node-stream');

module.exports = {
  searchForArtist: searchForArtist,
  relatedArtists: artistsRelatedTo,
  sampleTracksFromArtistsRelatedTo: sampleTracksFromArtistsRelatedTo
};

function JSONFromUrl(url,jsonPath){
  const nodeStream = request.get(url)
      .pipe(JSONStream.parse(jsonPath));

  return observableFromStream(nodeStream);
}

function searchForArtist(artistName){
  return JSONFromUrl(
    urls.artistSearch(artistName),
    "artists.items.*"
  );
}

function artistsRelatedTo(artist){
  return JSONFromUrl(
    urls.artistsRelatedTo(artist.id),
    "artists.*"
  );
}

function topTracksFor(artist){
  return JSONFromUrl(
    urls.topTracksFor(artist.id),
    "tracks.*"
  );
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
