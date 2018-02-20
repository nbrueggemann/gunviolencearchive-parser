# Install

npm install

# Run

node src/main.js

# Endpoints

* GET localhost:55558/past72hours
* POST localhost:55558/incident
    body: {
        "url": "http://www.gunviolencearchive.org/incident/<incident-id>"
    }