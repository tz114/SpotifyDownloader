import React, { Component } from 'react';
import ConnectSpotify from './components/auth';
import Table from './components/table';
import './App.css';
import Tabs from './components/tab';
import Tracks from './components/tracks';
class App extends Component {
 constructor() {
   super();
   const urlParams = new URLSearchParams(window.location.search);
   const isUserAuthorized = urlParams.has('authorized') ? true : false;

   this.state = {
     isUserAuthorized,
     playlists: [],
     tracks: [],
     youtubePlaylists: [],
     playlistTracks: [],
     showPlaylist: "",
     url: "",
   };
   this.updateUrl = this.updateUrl.bind(this);
 }
 updateUrl(e) {
  this.setState({url: e.target.value});
  }
 componentDidMount(){
  const { isUserAuthorized } = this.state;

  if (isUserAuthorized) {
    fetch('http://localhost:3001/playlist')
      .then(res => res.json())
      .then(data => {
        this.setState({
          playlists: data,
        });
      })
      .catch(error => console.log(error));
      
    
    fetch('http://localhost:3001/tracks')
    .then(res => res.json())
      .then(data => {
        this.setState({
          tracks: data,
        });
      })
      .catch(error => console.log(error));
    
    fetch('http://localhost:3001/youtubeplaylist')
    .then(res => res.json())
    .then(data => {
      this.setState({
        youtubePlaylists: data,
      });
    })
    .catch(error => console.log(error));
  }
 }

 convertPlaylist = (playlistId,playlistName) => {
  fetch(`http://localhost:3001/convertSpotify/${playlistId}/${playlistName}`)
  .then(res => res.json())
  .then(data => {
    this.setState({
      youtubePlaylists: data,
    });
  })
  .catch(error => console.log(error));
 }

 downloadTrack = (name,artist) => {
  fetch(`http://localhost:3001/downloadTrack/${name}/${artist}`)
  .catch(error => console.log(error));
 }

 getPlaylistTracks = (playlistId,playlistName, playlistPic) => {
  fetch(`http://localhost:3001/getPlaylistTracks/${playlistId}`)
  .then(res => res.json())
  .then(data => {
    this.setState({
      showPlaylist: playlistName,
      showPlaylistPic: playlistPic,
      playlistTracks: data,
    });
    console.log(this.state.playlistTracks)
  })
  .catch(error => console.log(error));
 }


 downloadUrl = (event) => {
   event.preventDefault();
   const url = encodeURIComponent(this.state.url);
  fetch(`http://localhost:3001/downloadUrl/${url}`).catch(error => console.log(error));
 }
 render() {
   const { isUserAuthorized, playlists, tracks, youtubePlaylists, playlistTracks,showPlaylist, showPlaylistPic } = this.state;

   return (
     <div className="App">
       <div className="header">
          <div className="headerInner">
            <h1 class="pageTitle">Music Downloader </h1>
            <ConnectSpotify isUserAuthorized={ isUserAuthorized } />
          </div>
         
         </div>
         <div className="main">
          <Tabs>
              <div label="Playlists" >{playlists.length !== 0 ? <Table label="Playlists" action={this.getPlaylistTracks} items={playlists} /> : null}</div>
              <div label="Tracks">{tracks.length !== 0 ? <Tracks label="Tracks" action={this.downloadTrack} playlistTracks={tracks} name="All saved tracks" pic="sad" /> : null}</div>
              <div label="Url">
              <form onSubmit={this.downloadUrl}>
                <label>
                  Url:
                  <input type="text" value={this.state.url} onChange = {this.updateUrl} />
                </label>
                <input type="submit" value="Submit" />
              </form>
              </div>
          </Tabs>

          {playlistTracks.length !== 0 ? <Tracks playlistTracks={playlistTracks} name={showPlaylist} pic={showPlaylistPic}/> : null}
         </div>
          
      
     </div>
   );
 }
}

export default App;
