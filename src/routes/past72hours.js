
var Past72HourParser = require('../application/parsers/past72HourParser');
var IncidentParser = require('../application/parsers/incidentParser');

module.exports = function(express, appConfig, esClient, rootDir) {
    express.get('/past72hours/', function (req, res) {
        var baseUrl = "http://www.gunviolencearchive.org";

        var parser = new Past72HourParser();
        var incidentParser = new IncidentParser();

        parser.getData().then((data) => {
            var promises = [];
            var results = [];
            data.forEach((item) => {
                var url = baseUrl + item;
                var promise = incidentParser.getData(url).then((incident) => {
                    results.push(incident);
                });
                promises.push(promise);
            });

            Promise.all(promises).then(() =>{
                res.send(results);
            });
        });
    });
}
