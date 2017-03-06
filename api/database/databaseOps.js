var logger = require("../config/logger");
var statusCodes = require("../config/statusCodes");

function insertDetails(collectionName, jsonEntry, callback){
	collectionName.insertOne(jsonEntry, function(err, result){
		if(err){
			logger.error(collectionName + ": Insert op unsuccessful for " + jsonEntry);
			return callback(statusCodes.opError, err);
		}
		else if(result){
			logger.info(collectionName + ": Insert op successful for " + jsonEntry);
			return callback(statusCodes.opSuccess, statusCodes.successMessage);
		}
	});
}

function searchDetails(collectionName, jsonQuery, callback){
	collectionName.findOne(jsonQuery, function(err, item){
		if(err){
			logger.info(collectionName + ": Search op unsuccessful for " + jsonQuery);
			callback(statusCodes.opError, item, err);
		}
		else if(err==null && item==null){
			logger.warn(collectionName + ": " + jsonQuery + " does not exist");
			callback(statusCodes.opNotFound, item, statusCodes.notFoundMessage);		
		}
		else if(err==null && item!=null){
			logger.info(collectionName + ": Search op successful for " + jsonQuery);
			callback(statusCodes.opSuccess, item, statusCodes.successMessage);
		}
	})
}

function searchAllDetails(collectionName, jsonQuery, callback){
	collectionName.find(jsonQuery, {"limit": 20}).toArray(function (err, result) {
    	if(err){
			logger.info(collectionName + ": Search op unsuccessful for " + jsonQuery);
			callback(statusCodes.opError, result, err);
		} 
		else if(err==null && result.length==0){
			logger.warn(collectionName + ": " + jsonQuery + " does not exist");
			callback(statusCodes.opNotFound, result, statusCodes.notFoundMessage);		
		} 
		else if(err==null && result.length){
			logger.info(collectionName + ": Search op successful for " + jsonQuery);
			callback(statusCodes.opSuccess, result, statusCodes.successMessage);
		}
    });
}

function updateAllDetails(collectionName, jsonQuery, jsonEntry, callback){
	collectionName.updateMany(jsonQuery,  {$set:jsonEntry}, {w:1}, function(err,object){
		var result = JSON.parse(object);
		if(err){
			logger.error(collectionName + ": Update op unsuccessful for " + jsonQuery + " and " + jsonEntry);
			callback(statusCodes.opError, err);
		}
		else if(result.n==0){
			logger.warn(collectionName + ": " + jsonQuery + " does not exist");
			callback(statusCodes.opNotFound, statusCodes.notFoundMessage);	
		}
		else{
			logger.info(collectionName + ": Update op successful for " + jsonQuery + " and " + jsonEntry);
			callback(statusCodes.opSuccess, statusCodes.successMessage);
		}
	});
}

function updateDetails(collectionName, jsonQuery, jsonEntry, callback){
	collectionName.updateOne(jsonQuery,  {$set:jsonEntry}, {w:1}, function(err,object){
		var result = JSON.parse(object);
		if(err){
			logger.error(collectionName + ": Update op unsuccessful for " + jsonQuery + " and " + jsonEntry);
			callback(statusCodes.opError, err);
		}
		else if(result.n==0){
			logger.warn(collectionName + ": " + jsonQuery + " does not exist");
			callback(statusCodes.opNotFound, statusCodes.notFoundMessage);	
		}
		else{
			logger.info(collectionName + ": Update op successful for " + jsonQuery + " and " + jsonEntry);
			callback(statusCodes.opSuccess, statusCodes.successMessage);
		}
	});
}

//To update the status of the particular login field during account deletion
function deleteDetails(collectionName, jsonRemove, callback){
	collectionName.deleteOne(jsonRemove, function(err,object){
		var result = JSON.parse(object);
		if(err){
			logger.error(collectionName + ": Delete op unsuccessful for " + jsonRemove);
			callback(statusCodes.opError, err);
		}
		else if(result.n==0){
			logger.warn(collectionName + ": " + jsonRemove + " does not exist");
			callback(statusCodes.opNotFound, statusCodes.notFoundMessage);
		}
		else{
			console.log(collectionName + ": Delete op successful for " + jsonRemove);
			callback(statusCodes.opSuccess, statusCodes.successMessage);
		}
	});
}

exports.insertDetails = insertDetails;
exports.searchDetails = searchDetails;
exports.updateDetails = updateDetails;
exports.updateAllDetails = updateAllDetails;
exports.deleteDetails = deleteDetails;
exports.searchAllDetails = searchAllDetails;