var environmentVariables = require("./config/environmentVars");
var routeLoader = require("./routes/initializeRoutes");
var logger = require("./config/logger");

//For Express
var express = require("express");
var app = express();

//For MongoDB
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var uri = environmentVariables.database;
var database = null;
var exportInfoCollection = null;
var importInfoCollection = null;
var drayageRegistryCollection = null;
var stakeholdersCollection = null;
var pendingApprovalsCollection = null;

//Function to start Express server
function startExpressServer(){
	server = app.listen(environmentVariables.portNo, function(){
		var host = server.address().address;
		var port = server.address().port;

		logger.info("Express Server - Server is operational: " + host + " " + port);
	});
	//Function call to load routes
	routeLoader.loadAppRoutes(app);
}

//Function to start MongoDB server and initialize collections in Mongo interfaces
function startMongoServer(){
	MongoClient.connect(uri, function(err,db){
		if(err)
			logger.error("MongoDB Server - Error in connecting to database: " + err);
		else if(db){
			logger.info("MongoDb Server - Successfully connected to database!");

			//exportInfo Collection
			exportInfoCollection = db.collection(environmentVariables.exportInfoCollection);
			exportInfoCollection.ensureIndex({"_id":1, unique:true}, function(err,results){
				if(err)
					logger.error("ExportInfo Collection - Error in ensuring index for id: "+err);
				else if(results){
					logger.info("ExportInfo Collection - Index creation is successful for id!");
				}
			});

			//importInfo Collection
			importInfoCollection = db.collection(environmentVariables.importInfoCollection);
			importInfoCollection.ensureIndex({"_id":1, unique:true}, function(err,results){
				if(err)
					logger.error("ImportInfo Collection - Error in ensuring index for id: "+err);
				else if(results){
					logger.info("ImportInfo Collection - Index creation is successful for id!");
				}
			});

			//drayageRegistry Collection
			drayageRegistryCollection = db.collection(environmentVariables.drayageRegistryCollection);
			drayageRegistryCollection.ensureIndex({"_id":1, unique:true}, function(err,results){
				if(err)
					logger.error("DrayageRegistry Collection - Error in ensuring index for id: "+err);
				else if(results){
					logger.info("DrayageRegistry Collection - Index creation is successful for id!");
				}
			});

			//stakeholdersCollection Collection
			stakeholdersCollection = db.collection(environmentVariables.stakeholdersCollection);
			stakeholdersCollection.ensureIndex({"userName":1, unique:true}, function(err,results){
				if(err)
					logger.error("Stakeholders Collection - Error in ensuring index for id: "+err);
				else if(results){
					logger.info("Stakeholders Collection - Index creation is successful for id!");
				}
			});

			//pendingApprovals Collection
			pendingApprovalsCollection = db.collection(environmentVariables.pendingApprovalsCollection);
			pendingApprovalsCollection.ensureIndex({"userName":1, unique:true}, function(err,results){
				if(err)
					logger.error("PendingApprovals Collection - Error in ensuring index for id: "+err);
				else if(results){
					logger.info("PendingApprovals Collection - Index creation is successful for id!");
				}
			});				
		}
	});
}

function returnExportInfoCollection(){
	return exportInfoCollection;
}

function returnImportInfoCollection(){
	return importInfoCollection;
}

function returnDrayageRegistryCollection(){
	return drayageRegistryCollection;
}

function returnStakeholdersCollection(){
	return stakeholdersCollection;
}

function returnPendingApprovalsCollection(){
	return pendingApprovalsCollection;
}

//Exporting functions for access from main.js
exports.startExpressServer = startExpressServer;
exports.startMongoServer = startMongoServer;

//Exporting functions relevant to MongoDB
exports.returnExportInfoCollection = returnExportInfoCollection;
exports.returnImportInfoCollection = returnImportInfoCollection;
exports.returnDrayageRegistryCollection = returnDrayageRegistryCollection;
exports.returnStakeholdersCollection = returnStakeholdersCollection;
exports.returnPendingApprovalsCollection = returnPendingApprovalsCollection;