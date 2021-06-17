const youtube = require('../youtube/youtube');
var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-library-read','user-read-private', 'user-read-email','playlist-modify-public','playlist-modify-private','user-read-email', 'playlist-read-private']

var spotifyApi = new SpotifyWebApi({
})



const authorizeSpotify = (req, res) => {
  var url = spotifyApi.createAuthorizeURL(scopes);
  //console.log(url);
  res.redirect(url);
};

const removeAuthorization = (req, res) =>{
  spotifyApi.resetAccessToken();
  res.redirect(`http://localhost:3000/`);
}

const getAccessToken = (req, res) => {
  const { code } = req.query;

  if (code) {
     spotifyApi.authorizationCodeGrant(code).then( (data)=>{
        const { access_token, refresh_token } = data.body;
        // console.log('The token expires in ' + data.body['expires_in']);
        // console.log('The access token is ' + data.body['access_token']);
        // console.log('The refresh token is ' + data.body['refresh_token']);
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        res.redirect(`http://localhost:3001/loginyoutube`)
       }
     )
   };
 }

const getPlaylist = (req, res, next) =>{
  spotifyApi.getUserPlaylists({user:'carldeag',limit: 30})
    .then(function(data) {
    //console.log('Retrieved playlists');
    const arr = data.body.items.map(e => ({
      name: e.name,
      id: e.id,
      uri: e.uri,
      images: e.images
    }))
    console.log(arr);
    res.json(arr);
  },function(err) {
    //console.log('Something went wrong!', err);
  });
}

const getTracks = async (req, res) =>{
  let tracks = await spotifyApi.getMySavedTracks({
    limit: 50,
    offset: 0
  })

  let offset = 50;
  let limit = 50;
  const total = tracks.body.total
  console.log(total);
  let arr = [];
  tracks.body.items.forEach(e => {
    arr.push({
    name: e.track.name,
    artist: e.track.artists[0].name,
    id: e.track.id,
    image: e.track.album.images[0],
    })
  })
  
  while(offset<total){
    
    tracks = await spotifyApi.getMySavedTracks({limit: 50, offset: offset});
    tracks.body.items.forEach(e => {
      arr.push({
      name: e.track.name,
      artist: e.track.artists[0].name,
      id: e.track.id,
      image: e.track.album.images[0],
      })
    })
    offset += limit;
  }
  console.log(tracks);
  res.json(arr);
}

const convertPlaylist = async (req, res) =>{
  let playlist = await spotifyApi.getPlaylistTracks(req.params.playlistId)
  let offset = 0;
  let limit = 100;
  let playlistExists = false;
  const total = playlist.body.total
  console.log("starting");
  let youtubePlaylist;
  const myYoutubePlaylists = await youtube.getPlaylist();
  for(i=0; i<myYoutubePlaylists.data.items.size; i++){
    if (req.params.playlistname == myYoutubePlaylists.data.items[i].name){
      i=myYoutubePlaylists.data.items.size;
      youtubePlaylist = myYoutubePlaylists.data.items[i]
      playlistExists = true;
    }
  }
  if(!playlistExists){
    const youtubePlaylist = await youtube.createPlaylist(req.params.playlistName);
  }
  await youtube.search("huey lewis and the news hip to be square");
  // while(offset<total){
  //   offset += limit;
  //   playlist.body.items.forEach(async (item) => {
  //     const query = item.track.name + " " + item.track.artists[0].name;
  //     const vidId = await youtube.search(query)
  //     youtube.addToPlaylist(youtubePlaylist.data.id,vidId);
  //   })
  //   playlist = await spotifyApi.getPlaylistTracks(req.params.playlistId,{offset: offset});
  // }
  res.send("hi");
}

const convertTrack = async (req, res) => {

}

const getPlaylistTracks = async(req, res) =>{
  let playlist = await spotifyApi.getPlaylistTracks(req.params.playlistId)
  let offset = 100;
  let limit = 100;
  const total = playlist.body.total
  let arr = [];
  playlist.body.items.forEach(e => {
    arr.push({
    name: e.track.name,
    artist: e.track.artists[0].name,
    id: e.track.id,
    image: e.track.album.images[0],
    })
  })
  
  while(offset<total){
    
    playlist = await spotifyApi.getPlaylistTracks(req.params.playlistId,{offset: offset});
    playlist.body.items.forEach(e => {
      arr.push({
      name: e.track.name,
      artist: e.track.artists[0].name,
      id: e.track.id,
      image: e.track.album.images[0],
      })
    })
    offset += limit;
  }
  res.json(arr);
}
module.exports = {
  authorizeSpotify: authorizeSpotify,
  getAccessToken: getAccessToken,
  getPlaylist: getPlaylist,
  getTracks: getTracks,
  removeAuthorization: removeAuthorization,
  convertPlaylist: convertPlaylist,
  getPlaylistTracks: getPlaylistTracks,
  convertTrack: convertTrack,
}
