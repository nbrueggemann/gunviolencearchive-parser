var request = require('request');
const cheerio = require('cheerio');

class Past72HourParser {
    constructor() {
        this.past72HourBaseUrl = "http://www.gunviolencearchive.org/last-72-hours";
    }
    
    getData() {
        return new Promise((resolve, reject) => { 
            var results = [];
            var promises = [];

            // Lets see how many pages of data there are.
            var totalPages = this.getTotalPages().then((pageCount) => {
                var pageURLs = this.getPageUrls(pageCount);
                
                // Loop through each page and get data
                pageURLs.forEach( (url) => {
                    var promise = this.getDataOnPage(url).then( (data) => {
                        results = results.concat(data);
                    });
                    promises.push(promise);
                });

                Promise.all(promises).then(() =>{
                    resolve(results);
                });
            });
            

            //resolve();
        });
    }

    getDataOnPage(url) {
        return new Promise((resolve, reject) => { 
            
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

    getTotalPages() {
        return new Promise((resolve, reject) => { 
            
            request.get({ uri: this.past72HourBaseUrl }, (err, resp, body) => {
                if (err) {
                    
                }
                else {
                    var pageCount = null;

                    const $ = cheerio.load(body);
                    var lastPageNode = $(".pager-last");
                    var href = lastPageNode[0].childNodes[0].attribs.href;
                    var parts = href.split("=");
                    var pageCountString = parts[1];
                    pageCount = parseInt(pageCountString);

                    resolve(pageCount);
                }
            });
        });
    }

    getPageUrls(pageCount) {
        var pageURLs = [];

        for(var i = 0; i <= pageCount; i++) {
            if(i === 0) {
                pageURLs.push(this.past72HourBaseUrl);
            } else {
                pageURLs.push(this.past72HourBaseUrl + "?page=" + i.toString())
            }
        }

        return pageURLs;
    }

} // end class

module.exports = Past72HourParser;