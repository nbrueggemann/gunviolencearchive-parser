var Past72HourParser = require('../parsers/past72HourParser');
var IncidentParser = require('../parsers/incidentParser');
var WriteToFeatureService = require('../writeData/writeToFeatureService');

class Past72HourFeed {
    constructor() {

	}

    runFeed() {   
        var baseUrl = "http://www.gunviolencearchive.org";
        
        var past72Parser = new Past72HourParser();
        var incidentParser = new IncidentParser();
        var writer = new WriteToFeatureService();

        past72Parser.getData().then((data) => {
            var promises = [];
            var results = [];
            var itemCount = 0;
            var delayPerItemMS = 2000;

            data.forEach((item) => {
                console.log("Getting data for: " + item);
                var url = baseUrl + item;
                var promise = incidentParser.getDataWithDelay(url, itemCount*delayPerItemMS).then((incident) => {
                    writer.addData(incident);
                });
                promises.push(promise);
                itemCount++;
            });
        });
    }

} // end class

module.exports = Past72HourFeed;