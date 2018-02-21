
var WriteToFeatureService = require('../application/writeData/writeToFeatureService');
var Past72HourFeed = require('../application/feeds/past72HourFeed');

module.exports = function(express, appConfig, esClient, rootDir) {
    express.get('/writeTest/', function (req, res) {

        var feed = new Past72HourFeed();
        feed.runFeed();
    });
}
