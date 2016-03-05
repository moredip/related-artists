const querystring = require('querystring');

module.exports = {
  artistRelatedTo: urlForArtistsRelatedTo,
  artistSearch: urlForArtistSearch
};

function urlForArtistsRelatedTo(artistId){
  return "https://api.spotify.com/v1/artists/"+artistId+"/related-artists";
}

function urlForArtistSearch(searchString){
  return "https://api.spotify.com/v1/search?" + querystring.stringify({
    type: "artist",
    q: searchString
  });
}
