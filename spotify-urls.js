const querystring = require('querystring');

module.exports = {
  artistSearch: urlForArtistSearch,
  artistsRelatedTo: urlForArtistsRelatedTo,
  topTracksFor: urlForTopTracksFor
};

function urlForArtistSearch(searchString){
  return "https://api.spotify.com/v1/search?" + querystring.stringify({
    type: "artist",
    q: searchString
  });
}

function urlForArtistsRelatedTo(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

function urlForTopTracksFor(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/top-tracks?country=US";
}
