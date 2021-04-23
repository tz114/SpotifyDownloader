const youtube = require('./youtube');

module.exports = function(app){

    app.get('/loginyoutube', youtube.authorizeYoutube);
    app.get('/youtubecallback',youtube.getAccessToken);
    app.get('/youtubeplaylist',youtube.getPlaylist);
    app.get('/downloadUrl/:url',youtube.downloadUrl);
    app.get('/downloadTrack/:name/:artist', youtube.downloadTrack);
    //other routes..
}
