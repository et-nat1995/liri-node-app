require("dotenv").config();
const keys = require("./key")
var spotify = new Spotify(keys.spotify);

console.log(keys);