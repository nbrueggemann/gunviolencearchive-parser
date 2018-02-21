var request = require('request');
const cheerio = require('cheerio');

class IncidentParser {
    constructor() {

    }
    
    getDataWithDelay(url, delayMS) {
        return new Promise((resolve, reject) => { 
            setTimeout( () => {
                this.getData(url).then( (item) => {
                    resolve(item);
                });
            }, delayMS);
        });
    }

    getData(url) {
        return new Promise((resolve, reject) => { 
        
            request.get({ uri: url }, (err, resp, body) => {
                if (err) {
                    //res.send("No bueno!");
                }
                else {
                    var incidentId = this.getIncidentId(url);

                    const $ = cheerio.load(body);
    
                    var section = $('#block-system-main');
    
                    var location = this.getLocation($);

                    var date = this.getDate($);
                    var address = this.getAddress($);

                    var attributes = {
                        date: date,
                        city: address.city,
                        street: address.street,
                        placename: address.placeName,
                        id: incidentId
                    }
    
    
                    var parsedInfo = {
                        geometry: location,
                        attributes: attributes
                    };
    
                    resolve(parsedInfo);
                }
            });
        });
    }

    getIncidentId(url) {
        var urlParts = url.split('/');
        var incidentId = urlParts[urlParts.length-1];
        return incidentId;
    }

    getLocation($) {
        var geometry = null;
        var locationSection = $( "span:contains('Geolocation')" );
        if(locationSection[0]) {
            var locString = locationSection[0].childNodes[0].data
            var split = locString.split(' ');
            var latString = split[1];
            latString = latString.slice(0, -1); // Remove the ,
            var lonString = split[2];
            geometry = {
                y: parseFloat(latString),
                x: parseFloat(lonString),
                spatialReference: {
                    wkid: 4326
                }
            }
        }

        return geometry;
    }

    getDate($) {
        var date = null;
        if($('div h3', '#block-system-main')[0]) {
            date = $('div h3', '#block-system-main')[0].childNodes[0].data;
        }

        return date;
    }

    getAddress($) {
        var address = {};

        var placeName, city, street = null;
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

        address.placeName = placeName;
        address.street = street;
        address.city = city;

        return address;
    }

    getSources($) {
        // Get the h2 item with "Sources" in the text
        var sourcesHeader = $( "h2:contains('Sources')" );
        
        // Get the parent of the sources header.
        $(sourcesHeader[0].parentNode.children).each(function(index, item) {
            var i = 0;
            i++;
        })

        return [];
    }

} // end class

module.exports = IncidentParser;