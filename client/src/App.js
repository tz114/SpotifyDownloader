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
    fetch('/playlist')
      .then(res => res.json())
      .then(data => {
        this.setState({
          playlists: data,
        });
      })
      .catch(error => console.log(error));
      
    
    fetch('/tracks')
    .then(res => res.json())
      .then(data => {
        this.setState({
          tracks: data,
        });
      })
      .catch(error => console.log(error));
    
    fetch('/youtubeplaylist')
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
  .then((res) => 
    res.blob()
  )
  .then((blob) => {
    console.log(blob);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.mp4`);
    // 3. Append to html page
    document.body.appendChild(link);
    // 4. Force download
    link.click();
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link);
  })
  .catch(error => console.log(error));
 }

 getPlaylistTracks = (playlistId,playlistName, playlistPic) => {
  fetch(`/getPlaylistTracks/${playlistId}`)
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
  fetch(`/downloadUrl/${url}`)
  .then((res) => 
    res.blob()
  )
  .then((blob) => {
    console.log(blob);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `song.mp4`);
    // 3. Append to html page
    document.body.appendChild(link);
    // 4. Force download
    link.click();
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link);
  })
  .catch(error => console.log(error));
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
              <div label="Playlists" >{playlists.length !== 0 ? <Table label="Playlists" action={this.getPlaylistTracks} items={playlists} /> : null} {playlistTracks.length !== 0 ? <Tracks playlistTracks={playlistTracks} action={this.downloadTrack} name={showPlaylist} pic={showPlaylistPic}/> : null}</div>
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

          
         </div>
          
      
     </div>
   );
 }
}

export default App;
