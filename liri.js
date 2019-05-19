// npm's
require("dotenv").config();
var axios = require('axios')
var moment = require('moment');
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');

// moment test
// logs today's date and time: test ok
// console.log(moment().toString());

// this function queries omdb and logs the title rating and plot
let movieSearch = () => {
    let userInput = '';
    let movieTerm = [];
    if (process.argv[3] === undefined) {
        userInput = 'Mr.Nobody';
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            // if a single word is used for title
            if (process.argv.length === 4) {
                movieTerm = process.argv[3];
            }
            // if multiple words are used in title
            if (process.argv.length > 3) {
                // for the first word of title
                if (i === 3) {
                    movieTerm.push(process.argv[i]);
                }
                // for all other terms of title
                else {
                    movieTerm.push("+" + process.argv[i]);
                }
            }
        }
    };
    // gives term for user input (used in query)
    if (movieTerm.length >= 0) {
        userInput = movieTerm.join('');
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
    console.log(movieQueryUrl);
    axios.get(movieQueryUrl).then(
        function (response) {
            console.log("The movie's title is: " + response.data.Title + "\n");
            console.log("The movie was realeased on: " + response.data.Released + "\n");
            console.log("The movie's country of origin is: " + response.data.Country + "\n");
            console.log("The movie's language is: " + response.data.Language + "\n");
            console.log("The movie's imdb rating is: " + response.data.imdbRating + "\n");
            console.log("The movie's rotten tomatoes rating is: " + response.data.Ratings[1].Source + ' ' + response.data.Ratings[1].Value + '\n');
            console.log("The movie's plot is: " + response.data.Plot + "\n");
        }
    );
};
// spotify api functions
let spotifySearch = () => {
    let userInput = '';
    let musicTerm = [];
    if (process.argv[3] === undefined) {
        userInput = 'all the small things';
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            // if a single word is used for title
            if (process.argv.length === 4) {
                userInput = process.argv[3];
            }
            // if multiple words are used in title
            if (process.argv.length > 4) {
                // for the first word of title
                if (i === 3) {
                    musicTerm.push(process.argv[i]);
                }
                // for all other terms of title
                else {
                    musicTerm.push("+" + process.argv[i]);
                }
            }
        }
        if (musicTerm.length > 0) {
            userInput = musicTerm.join('');
        }
    }
    spotify.search({
        type: 'track',
        query: userInput,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('track name is ' + data.tracks.items[0].name + '\n');
        console.log('track album is ' + data.tracks.items[0].album.name + '\n');
        console.log('the artist is/are ' + data.tracks.items[0].artists[0].name + '\n');
        console.log('this is the url ' + data.tracks.items[0].preview_url + '\n');
    });
}

// this function queries the bands-in-town api for a event search on an artist
let bandQuery = () => {
    let userInput = '';
    let artist = [];

    if (process.argv.length === 3) {
        userInput = 'drake';
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            // if a single word is used for artist
            if (process.argv.length === 4) {
                artist = process.argv[3];
            }
            // if multiple words are used in artist
            if (process.argv.length > 4) {
                // for the first word of artist
                if (i === 3) {
                    artist.push(process.argv[i]);
                }
                // for all other terms of artist
                else {
                    artist.push("+" + process.argv[i]);
                }
            }
        }
        userInput = artist.join('');
    }
    console.log(userInput);

    let bandQueryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

    axios.get(bandQueryUrl).then(
        function (response) {
            console.log(response.data[0].venue.name + '\n');
            console.log(response.data[0].venue.city + ' ' + response.data[0].venue.region + ' ' + response.data[0].venue.country + '\n');
            console.log(response.data[0].datetime + '\n');
        })
};

// this function is for choosing a random action from the random.txt file
let randomTxt = () => {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        else {
            process.argv.push(data.split(','));
            liriSearch();
        }
    })
};

let liriSearch = () => {
    switch (process.argv[2]) {
        case 'concert-this':
            bandQuery();
            break;

        case 'spotify-this-song':
            spotifySearch();
            break;

        case 'movie-this':
            movieSearch();
            break;

        case 'do-what-this-says':
            randomTxt();
            break;

        default:
            break;
    }
};
liriSearch();