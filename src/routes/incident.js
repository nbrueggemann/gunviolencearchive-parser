
var IncidentParser = require('../application/parsers/incidentParser');

module.exports = function(express, appConfig, esClient, rootDir) {
    express.post('/incident/', function (req, res) {

        var url = req.body.url;

        var parser = new IncidentParser(url);
        parser.getData(url).then((data) => {
            res.send(data);
        });
    });
}
