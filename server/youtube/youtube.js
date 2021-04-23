// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const path = require('path');
const {google} = require('googleapis');
const url = require('url');
const { resolve } = require('path');
const youtube = google.youtube('v3');
const people = google.people('v1');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

const scopes = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.third-party-link.creator',
  'profile',
];

/**
 * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
 */

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({auth: oauth2Client});


const authorizeYoutube = (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });
  console.log(authorizeUrl)
  res.redirect(authorizeUrl);
}

const getAccessToken = async (req, res) =>{
  const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
  const {tokens} = await oauth2Client.getToken(qs.get('code'));
  oauth2Client.credentials = tokens; 
  oauth2Client.apiKey = "AIzaSyBO72i3tRdwO9HPyiT6xZhPDpiaxHRg1Nc";
  res.redirect(`http://localhost:3000/?authorized=true`)
}

const getPlaylist = async (req, res) => {
  const response = await youtube.playlists.list({
    part: 'id,snippet',
    mine: true,
    maxResults: 25,
  })
  //console.log(response.data);
  const arr = response.data.items.map(e => ({
    name: e.snippet.title,
  }))

  res.json(arr);
}

const search = async (query) => {
  const searchResults = await ytsr(query,{limit: 1, pages: 1})
  return searchResults.items[0].url;
}

const downloadUrl = async (req,res) => {
  const url = req.params.url;
  console.log(url);
  const info = await ytdl.getInfo(url);
  let format = ytdl.chooseFormat(info.formats, {quality: "highestaudio"})
  ytdl.downloadFromInfo(info, {
    quality: 'highestaudio'
  })
  ytdl(url,{
    quality: 'highestaudio',
    filter: 'audioonly',
  })
  .pipe(fs.createWriteStream('video.mp4'));
}

const createPlaylist = async (name) => {
  const playlist = await youtube.playlists.insert(
    { 
      part: "snippet", 
      requestBody: {
        snippet: {
          title: name,
          description: "Created using spotify playlist converter"
        }
      }
    },
   );
   return playlist
}


const addToPlaylist = async(playlistId,vidId) => {
  await youtube.playlistItems.insert({
    part: "snippet",
    requestBody: {
      snippet:{
        playlistId: playlistId,
        resourceId: vidId,
      }
    }
  })
}

const downloadTrack = async(req,res) => {
  const track = req.params.name;
  const artist = req.params.artist;
  const query = track + " " + artist; 
  const url = await search(query);
  ytdl(url,{
    quality: 'highestaudio',
    filter: 'audioonly',
  })
  .pipe(fs.createWriteStream(track+".mp4"));

}

module.exports = {
  authorizeYoutube: authorizeYoutube,
  getAccessToken: getAccessToken,
  getPlaylist: getPlaylist,
  search: search,
  createPlaylist: createPlaylist,
  addToPlaylist: addToPlaylist,
  downloadUrl: downloadUrl,
  downloadTrack: downloadTrack,
}

