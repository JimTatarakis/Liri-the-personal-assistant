// take in commands via terminal
// commands like....
// spotify search for songs
// see which bands are in town
// omdb search
// i will need moment for the current time and date
// i will also need a location and search parameters
// psuedocoding starts here..

// take in npms
// Set up Api
// write base codes for the functions themselves
// write code that runs when a command is given (use call backs)

// npm's
var axios = require('axios')
var moment = require('moment');
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// global variables
let movieTerm = [];

var queryUrl = "http://www.omdbapi.com/?t=" + movieTerm.join('') + "&y=&plot=short&apikey=trilogy";

// npm tests
// moment test
// logs today's date and time: test ok
console.log(moment().toString());

// axios' test 
// omdb test ok
axios.get("http://www.omdbapi.com/?t=avengers&y=&plot=short&apikey=f6ec85c6").then(
    function (response) {
        console.log(response.data);
        console.log("The movie's rating is: " + response.data.imdbRating);
    }
);
// functions for liri to call on.

// omdb functions for movie search.

// this function can go through the user input and add to the search term for the query.
let movieName = () => {
    for (let i = 2; i < process.argv.length; i++) {
        // if a single word is used for title
        if (process.argv.length === 3) {
            movieTerm = process.argv[2];
        }
        // if multiple words are used in title
        if (process.argv.length > 2) {
            // for the first word of title
            if (i === 2) {
                movieTerm.push(process.argv[i]);
            }
            // for all other terms of title
            else {
                movieTerm.push("+" + process.argv[i]);
            }
        }
    }
}
// this function queries omdb and logs the title rating and plot
let movieSearch = () => {
    axios.get(queryUrl).then(
        function (response) {
            console.log("The movie's title is: " + response.data.title + "\n");
            console.log("The movie was realeased on: " + response.data.year + "\n");
            console.log("The movie's country of origin is: " + response.data.country + "\n");
            console.log("The movie's language is: " + response.data.language + "\n");
            console.log("The movie's imdb rating is: " + response.data.imdbRating + "\n");
            console.log("The movie's rotten tomatoes rating is: " + response.data.ratings[2] + "\n");
            console.log("The movie's plot is: " + response.data.plot + "\n");
        }
    );
};

// spotify api functions
let spotifySearch = () => {
    spotify.search({ type: 'track', query: 'All the Small Things', limit:1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log('track name is ' + data.tracks.items[0].name + '\n');
        console.log('track album is ' + data.tracks.items[0].album.name + '\n');
        console.log('the artist is/are ' + data.tracks.items[0].artists[0].name + '\n');
        console.log('this is the url ' + data.tracks.items[0].preview_url + '\n');
    });
}

