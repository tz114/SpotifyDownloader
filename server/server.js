const express = require("express");
const prompt = require('prompt-sync')({sigint: true});
const app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
const port = 3001

app.use(express.static(__dirname + '/views'))
  .use(cors())
  .use(cookieParser());

require('./spotify/spotifyRoutes')(app);
require('./youtube/youtubeRoutes')(app);






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
