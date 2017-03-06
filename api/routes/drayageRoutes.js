var jwt = require('jsonwebtoken');
var express = require('express');
var path = require('path');
var config = require('/home/akshayd31/CPRQ/config');
var statusCodes = require('../config/statusCodes');
var initData = require('../serverStarter')
var dbFuncs = require('../database/databaseOps');
var logger = require('../config/logger')
var publicRouter = express.Router();

var importInfoCollection = null;

publicRouter.post('/checkAvailability', function(req, res){
  importInfoCollection = initData.returnImportInfoCollection();

  var jsonQuery = JSON.parse(JSON.stringify({
    "container#": req.body['container#'],
    "hasArrived": true,
    "isPickedUp": false
  }));

  dbFuncs.searchDetails(importInfoCollection, jsonQuery, function(code, item, message){
    if(code=="1"){
      res.send(JSON.stringify({
        "container#": item['container#'],
        "cargoType": item.cargoType,
        "containerSizeType": item.containerSizeType,
        "lotNumber": item.lotNumber,
        "berthNumber": item.berthNumber,
        "lastDayForPickup": item.lastDayForPickup,
        "appointmentReq": item.appointmentReq,
        "success": 1,
        "error": null
      }));
    }
    else{
      res.send(JSON.stringify({
        "success": -1,
        "error": "Not available"
      }))
    }
  });
});

module.exports = publicRouter;