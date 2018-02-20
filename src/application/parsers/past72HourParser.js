var request = require('request');
const cheerio = require('cheerio');

class Past72HourParser {
    constructor() {

	}

    getData() {
        return new Promise(function(resolve, reject) { 
            var url = "http://www.gunviolencearchive.org/last-72-hours";
            
            request.get({ uri: url }, (err, resp, body) => {
                if (err) {
                    //res.send("No bueno!");
                }
                else {
                    const $ = cheerio.load(body);
    
                    var incidents = [];
                    $('a[href*="incident/"]').each(function(index, item) {
                        incidents.push(item.attribs.href);
                    });
    
                    resolve(incidents);
                }
            });
        });
    }

} // end class

module.exports = Past72HourParser;