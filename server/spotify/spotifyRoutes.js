
var express = require('express');
const spotify = require('./spotify');

module.exports = function(app){

    app.get('/login', spotify.authorizeSpotify);
    app.get('/logout', spotify.removeAuthorization);
    app.get('/callback', spotify.getAccessToken);
    app.get('/playlist', spotify.getPlaylist);
    app.get('/tracks',spotify.getTracks);
    app.get('/getPlaylistTracks/:playlistId',spotify.getPlaylistTracks);
    app.get('/convertSpotify/:playlistId/:playlistName',spotify.convertPlaylist);
    //other routes..
}
