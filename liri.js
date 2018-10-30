require("dotenv").config();

const Spotify = require('node-spotify-api');
const request = require("request");
const fs = require("fs");
const moment = require("moment");
const keys = require("./key.js");

const userInput = process.argv[2];

var spotify = new Spotify(keys.spotify);

switch (userInput) {
    case 'concert-this':
        findBad();
        break;
    case 'spotify-this-song':
        findSong();
        break;
    case 'movie-this':
        findMovie();
        break;

    case 'do-what-it-says':
        readFile();
        break;
    default:
        console.log("Something went wrong mate...");
        break;
}

function findMovie() {
    var movieName = process.argv;
    var newString = "";

    if (process.argv[3]) {
        for (var i = 3; i < movieName.length; i++) {
            newString += movieName[i] + "+";
        }
        newString = newString.slice(0, -1);
    }
    else {
        newString = "Mr.+Nobody."
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + newString + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, (err, response, body) => {

        if (!err && response.statusCode === 200) {
            console.log("-----------------");
            console.log("* Movie Title: " + JSON.parse(body).Title);
            console.log("* Year: " + JSON.parse(body).Year);

            for (var rating in JSON.parse(body).Ratings) {
                console.log("* " + JSON.parse(body).Ratings[rating].Source + ": " + JSON.parse(body).Ratings[rating].Value);
            }

            console.log("* Language: " + JSON.parse(body).Language);
            console.log("* Plot: " + JSON.parse(body).Plot);
            console.log("* Actors: " + JSON.parse(body).Actors);
            console.log("-----------------");
        }
    });
}

function findBad() {
    var bandName = process.argv;
    var newString = "";

    for (var i = 3; i < bandName.length; i++) {
        newString += bandName[i];
    }
    // newString = newString.slice(0, -1);
    var queryUrl = "https://rest.bandsintown.com/artists/" + newString + "/events?app_id=codingbootcamp";

    request(queryUrl, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            for (var i = 0; i < JSON.parse(body).length; i++) {
                console.log("-----------------");
                console.log("Venue: " + JSON.parse(body)[i].venue.name);
                console.log("Location: " + JSON.parse(body)[i].venue.city);

                var day = JSON.parse(body)[i].datetime.split("T");
                day = day[0];

                console.log("Day: " + moment(day).format("MM/DD/YYYY"));
                console.log("-----------------");
            }
        }
    });
}

function findSong() {

    var songName = process.argv;
    var song = "";

    for (var i = 3; i < songName.length; i++) {
        song += songName[i] + " ";
    }
    song = song.slice(0, -1);

    var musicObj = {
        type: 'track',
        query: song,
        limit: 5
    };

    spotify.search(musicObj, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i in data.tracks.items) {
            console.log("-----------------");
            console.log(data.tracks.items[i].album.name);
            console.log(data.tracks.items[i].artists[0].name);
            console.log(data.tracks.items[i].name);
            console.log(data.tracks.items[i].preview_url);
            console.log("-----------------");
        }

    });
}

function readFile() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var newData = data.split(",");

        newData[1] = newData[1].slice(0, -1);
        newData[1] = newData[1].slice(1);

        process.argv.push(newData[1]);
        
        switch (newData[0]) {
            case 'concert-this':
                console.log("You be looking for a concert?");
                findBad();
                break;
            case 'spotify-this-song':
                console.log("You be looking for a song?");
                findSong();
                break;
            case 'movie-this':
                findMovie();
                break;
            default:
                console.log("Something went wrong mate...");
                break;
        }
    })
}