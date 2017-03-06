var jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path');
var config = require('/home/akshayd31/CPRQ/config');
var statusCodes = require('../config/statusCodes');
var initData = require('../serverStarter')
var dbFuncs = require('../database/databaseOps');
var logger = require('../config/logger')
var secureRouter = express.Router();

var exportInfoCollection = null;
var importInfoCollection = null;

secureRouter.use(function(req, res, next){
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {

      // verifies secret and checks expiration time
      jwt.verify(token, config.secret, function(err, decoded) {      
        if (err) {
          res.setHeader('Content-Type', 'application/json');
          res.status(500).send(JSON.stringify({
            "success": statusCodes.authenticationFailure, 
            "error": statusCodes.authenticationFailureErrorMessage
          }));  
        } 
        else if(decoded.role!="mto"){
          res.setHeader('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
              "success": statusCodes.authenticationFailure, 
              "error": statusCodes.authenticationFailureErrorMessage
            }));
        }
        else{
          // if everything is good, save to request for use in other routes
            req.decoded = decoded; 
            next();
        }
      });

    } 
    else {

      // if there is no token
      // return an error
      res.setHeader('Content-Type', 'application/json');
      res.status(404).send(JSON.stringify({
        "success": statusCodes.authenticationTokenNotProvided, 
        "error": statusCodes.authenticationTokenNotProvidedErrorMessage 
      }));
    }
});

secureRouter.post('/viewData', function(req, res){
  exportInfoCollection = initData.returnExportInfoCollection();
  importInfoCollection = initData.returnImportInfoCollection();

  dbFuncs.searchAllDetails(exportInfoCollection, null, function(code, cursor1, message){
    if(code=="-1"){
      logger.error("/viewData: Cannot retrieve list of exports");
      dbFuncs.searchAllDetails(importInfoCollection, null, function(code, cursor2, message){
        if(code=="-1"){
          logger.error("/viewData: Cannot retrieve list of imports");
          res.status(500).send(JSON.stringify({
            "success": -1,
            "error": message
          }));
        }
        else if(code=="0"){
          logger.info("/viewData: Imports list is empty");
          res.status(500).send(JSON.stringify({
            "success": -1,
            "error": null
          }));
        }
        else if(code=="1"){
          logger.info("/viewData: Retrieved list of imports");
          res.send(JSON.stringify({
            "success": 1,
            "error": null,
            "importInfo": cursor2
          }));
        }
      });
    }
    else if(code=="0"){
      logger.info("/viewData: Exports list is empty");
      dbFuncs.searchAllDetails(importInfoCollection, null, function(code, cursor2, message){
        if(code=="-1"){
          logger.error("/viewData: Cannot retrieve list of imports");
          res.status(500).send(JSON.stringify({
            "success": -1,
            "error": message
          }));
        }
        else if(code=="0"){
          logger.info("/viewData: Imports list is empty");
          res.send(JSON.stringify({
            "success": 0,
            "error": "Empty exports and imports"
          }));
        }
        else if(code=="1"){
          logger.info("/viewData: Retrieved list of imports");
          res.send(JSON.stringify({
            "success": 1,
            "error": null,
            "importInfo": cursor2
          }));
        }
      });
    }
    else if(code=="1"){
      logger.info("/viewData: Retrieved list of exports");
      dbFuncs.searchAllDetails(importInfoCollection, null, function(code, cursor2, message){
        if(code=="-1"){
          logger.error("/viewData: Cannot retrieve list of imports");
          res.send(JSON.stringify({
            "success": 1,
            "error": message,
            "exportInfo": cursor1
          }));
        }
        else if(code=="0"){
          logger.info("/viewData: Imports list is empty");
          res.send(JSON.stringify({
            "success": 1,
            "error": null,
            "exportInfo": cursor1
          }));
        }
        else if(code=="1"){
          logger.info("/viewData: Retrieved list of imports");
          res.send(JSON.stringify({
            "success": 1,
            "error": null,
            "exportInfo": cursor1,
            "importInfo": cursor2
          }));
        }
      });
    }
  });
});

secureRouter.post('/postArrivals', function(req, res){
  importInfoCollection = initData.returnImportInfoCollection();
  exportInfoCollection = initData.returnExportInfoCollection();

  var now = new Date();
  var todayDate = now.getMonth() + "/" + now.getDate() + "/" + now.getFullYear();
  var availDate = (now.getDate() + 1)%30;
  if(availDate==0)
    availDate = 1;
  var lastPickupDate = (now.getDate() + 7)%30;
  if(lastPickupDate==0)
    lastPickupDate = 1;
  var actualAvailabilityDate = now.getMonth() + "/" + availDate + "/" + now.getFullYear();
  var lastPickup = now.getMonth() + "/" + lastPickupDate + "/" + now.getFullYear();

  var jsonSearch = JSON.parse(JSON.stringify({
    "vesselName": req.body.vesselName
  }));

  var jsonQuery = JSON.parse(JSON.stringify({
    "arrivingTerminal": req.body.arrivingTerminal,
    "actualShipArrival": todayDate,
    "actualAvailability": actualAvailabilityDate,
    "lastDayForPickup": lastPickup,
    "customStatus": "Cleared",
    "lotNumber": "A1",
    "berthNumber": "A1-C6",
    "hasArrived": true
  }));

  var counter = 0;
  dbFuncs.updateAllDetails(importInfoCollection, jsonSearch, jsonQuery, function(code, message){
    if(code=="1"){
      res.send(JSON.stringify({
        "success": 1,
        "error": null
      }));
    }
    else{
      res.send(JSON.stringify({
        "success": -1,
        "error": null
      }));
    }
  });
});

secureRouter.post('/newArrivals', function(req, res){
  importInfoCollection = initData.returnImportInfoCollection();

  var jsonQuery = JSON.parse(JSON.stringify({
    "hasArrived": true,
    "isPickedUp": false
  }));

  dbFuncs.searchAllDetails(importInfoCollection, jsonQuery, function(code, cursor, message){
    if(code=="1"){
      res.send(JSON.stringify({
        "success": 1,
        "error": null,
        "containers": cursor
      }));
    }
    else{
      res.send(JSON.stringify({
        "success": -1,
        "error": null,
      }));
    }
  });
});

secureRouter.post('/updateLocationImp', function(req, res){
  importInfoCollection = initData.returnImportInfoCollection();

  var jsonQuery = JSON.parse(JSON.stringify({
    "container#": req.body['container#']
  }));

  var jsonEntry = JSON.parse(JSON.stringify({
    "lotNumber": req.body.lotNumber,
    "berthNumber": req.body.berthNumber,
    "lastDayForPickup": req.body.lastDayForPickup
  }));

  dbFuncs.updateDetails(importInfoCollection, jsonQuery, jsonEntry, function(code, message){
    if(code=="1"){
      res.send(JSON.stringify({
        "success": 1,
        "error": null
      }));
    }
    else{
      res.send(JSON.stringify({
        "success": -1,
        "error": message
      }));
    }
  });
});

module.exports = secureRouter;