var request = require('request');

class WriteToFeatureService {
    constructor() {

	}

    addData(data) {
        console.log("Adding data to feature service");
        // First query for an item with this id to see if we already have the entry
        var id = data.attributes.id;
        request('https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/gunviolencearchive/FeatureServer/0/query?where=id%3D' + id + '&returnCountOnly=true&f=pjson', (err, res, body) => {
            var body = JSON.parse(body);
            if(body.count === 0) { // Only add if it doesn't already exist
                console.log("Item does not exist yet");
                request.post({
                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                    url:     'https://services1.arcgis.com/g2TonOxuRkIqSOFx/arcgis/rest/services/gunviolencearchive/FeatureServer/0/applyEdits',
                    body:    "adds=" + JSON.stringify(data)
                }, function(error, response, body){
                    console.log("Done adding item.");
                });
            }
        });
    }

} // end class

module.exports = WriteToFeatureService;