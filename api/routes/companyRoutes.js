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
        else if(decoded.role!="store"){
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

secureRouter.post('/getInfo', function(req, res){
  exportInfoCollection = initData.returnExportInfoCollection();
  importInfoCollection = initData.returnImportInfoCollection();

  var jsonQuery = JSON.parse(JSON.stringify({
    "billOfLading#": req.body['billOfLading#']
  }));

  dbFuncs.searchAllDetails(exportInfoCollection, jsonQuery, function(code, cursor, message){
    if(code=="1"){
      res.send(JSON.stringify({
        "success": 1,
        "error": null,
        "containers": cursor
      }));
    }
    else{
      dbFuncs.searchAllDetails(importInfoCollection, jsonQuery, function(code, cursor2, message){
        if(code=="1"){
          res.send(JSON.stringify({
            "success": 1,
            "error": null,
            "containers": cursor2
          }));
        }
        else{
          res.send(JSON.stringify({
            "success": -1,
            "error": message
          }));
        }
      });
    }
  });
});

module.exports = secureRouter;