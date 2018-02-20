var request = require('request');
const cheerio = require('cheerio');

class IncidentParser {
    constructor() {

	}

    getData(url) {
        return new Promise(function(resolve, reject) { 
            
            request.get({ uri: url }, (err, resp, body) => {
                if (err) {
                    //res.send("No bueno!");
                }
                else {

                    var urlParts = url.split('/');
                    var incidentId = urlParts[urlParts.length-1];

                    const $ = cheerio.load(body);
    
                    var section = $('#block-system-main');
    
                    var date = "";
                    if($('div h3', '#block-system-main')[0]) {
                        date = $('div h3', '#block-system-main')[0].childNodes[0].data;
                    }
                    
                    var placeName, city, street = "";
                    var addressParts = $('div span', '#block-system-main');
    
                    if(addressParts[addressParts.length-4]) {
                        placeName = addressParts[addressParts.length-4].childNodes[0].data; 
                    }
    
                    if(addressParts[addressParts.length-3]) {
                        if(addressParts[addressParts.length-3].childNodes[0]) {
                            street = addressParts[addressParts.length-3].childNodes[0].data; 
                        }
                    }
    
                    if(addressParts[addressParts.length-2]) {
                        city = addressParts[addressParts.length-2].childNodes[0].data; // City is last item
                    }
    
                    // var locationDiv = cheerio.load(section[0].childNodes[3].toString());
                    // var locationParts = locationDiv('div span');
    
                    // Get the location
                    var location = null;
                    var locationSection = $( "span:contains('Geolocation')" );
                    if(locationSection[0]) {
                        var locString = locationSection[0].childNodes[0].data
                        var split = locString.split(' ');
                        var latString = split[1];
                        latString = latString.slice(0, -1); // Remove the ,
                        var lonString = split[2];
                        location = {
                            lat: parseFloat(latString),
                            lon: parseFloat(lonString)
                        }
                    }
    
                    var sources = [];
    
                    var parsedInfo = {id: incidentId,
                        date: date,
                        placeName: placeName,
                        street: street,
                        city: city,
                        location: location,
                        sources: sources
                    };
    
                    resolve(parsedInfo);
                }
            });
        });
    }

} // end class

module.exports = IncidentParser;