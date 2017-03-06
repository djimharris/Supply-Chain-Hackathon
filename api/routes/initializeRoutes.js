var bodyParser = require("body-parser");
var path = require("path")
var jwt = require("jsonwebtoken")
var initData = require('../serverStarter')
var dbFuncs = require('../database/databaseOps');
var logger = require('../config/logger')
var express = require('express');
var statusCodes = require('../config/statusCodes');
var config = require('/home/akshayd31/CPRQ/config');
var companyRoutes = require("./companyRoutes");
var drayageRoutes = require("./drayageRoutes");
// var shippingRoutes = require("./shippingRoutes");
var portMtoRoutes = require("./portMtoRoutes");
var portAdminRoutes = require("./portAdminRoutes");
// var portLaborRoutes = require("./portLaborRoutes");

var stakeholdersCollection = null;
var pendingApprovalsCollection = null;

//Function to load routes for publicly and privately accessible routes
function loadAppRoutes(app){
	//To support JSON-encoded bodies
	app.use(bodyParser.json());
	app.use(express.static(path.join(__dirname, '../../')));
	//To support URL-encoded bodies
	app.use(bodyParser.urlencoded({extended:false}));

	//Load routes which require no authorization (publicly available)
	app.use("/store", companyRoutes);

	//Load routes which require authorization (secured access)
	app.use("/drayage", drayageRoutes);

	// app.use("/shippingline", shippingRoutes);
	app.use("/portmto", portMtoRoutes);
	app.use("/portadmin", portAdminRoutes);
	// app.use("/portlabor", portLaborRoutes);

	//TEST route for checking successful deployment
	app.get("/", function(req,res){
		//Send homepage
		res.sendFile(path.resolve("index.html"));
	});

	app.post("/register", function(req, res){
		stakeholdersCollection = initData.returnStakeholdersCollection();
		pendingApprovalsCollection = initData.returnPendingApprovalsCollection();
		res.setHeader('Content-Type', 'application/json')

		if(req.body.userName==""||req.body.password==""||req.body.role==""||req.body.pointOfContact==""||req.body.email==""){
			res.send(JSON.stringify({
				"success": 0,
				"error": statusCodes.emptyReqBodyMessage
			}));
		}

		var jsonCheckQuery = JSON.parse(JSON.stringify({
			"userName": req.body.userName
		}));

		dbFuncs.searchDetails(pendingApprovalsCollection, jsonCheckQuery, function(code, item, message){
			if(code=="0"){
				dbFuncs.searchDetails(stakeholdersCollection, jsonCheckQuery, function(code, item, message){
					if(code=="0"){
						var jsonInsertQuery = JSON.parse(JSON.stringify({
							"userName": req.body.userName,
							"password": req.body.password,
							"role": req.body.role,
							"pointOfContact": req.body.pointOfContact,
							"email": req.body.email,
							"company": req.body.company,
							"isApproved": "Pending"					
						}));

						dbFuncs.insertDetails(pendingApprovalsCollection, jsonInsertQuery, function(code, message){
							if(code=="1"){
								logger.info("/register: User name <" + req.body.userName + "> registered successfully");
								res.send(JSON.stringify({
									"success": 1,
									"error": null
								}));
							}
							else if(code=="-1"){
								logger.error("/register: User name <" + req.body.userName + "> not registered");
								res.status(500).send(JSON.stringify({
									"success": -1,
									"error": message
								}));
							}
						});		
					}
					else if(code=="1"){
						logger.error("/register: User name <" + req.body.userName + "> not registered");
						res.send(JSON.stringify({
							"success": 0,
							"error": "User name already exists!"
						}));
					}
					else if(code=="-1"){
						logger.error("/register: User name <" + req.body.userName + "> not registered");
						res.status(500).send(({
							"success": -1,
							"error": message
						}));
					}
				});
			}
			else if(code=="1"){
				res.send(JSON.stringify({
					"success": 0,
					"error": "User name already exists!"
				}));
			}
			else if(code=="-1"){
				res.status(500).send(JSON.stringify({
					"success": -1,
					"error": message
				}));
			}
		});

	});

	app.post("/login", function(req, res){
		res.setHeader("Content-Type","application/json");

		if(req.body.userName==""||req.body.password==""){
			res.send(JSON.stringify({
				"success": 0,
				"error": statusCodes.emptyReqBodyMessage
			}))
		}

		var jsonQuery = JSON.parse(JSON.stringify({
			"userName": req.body.userName,
			"password": req.body.password
		}));

		stakeholdersCollection = initData.returnStakeholdersCollection();
		pendingApprovalsCollection = initData.returnPendingApprovalsCollection();

		dbFuncs.searchDetails(pendingApprovalsCollection, jsonQuery, function(code, item, message){
			if(code=="1"){
				res.status(403).send(JSON.stringify({
					"success": -1,
					"error": null
				}));
			}
			else if(code=="-1"){
				res.status(500).send(JSON.stringify({
					"success": -1,
					"error": message
				}));
			}
			else if(code=="0"){
				dbFuncs.searchDetails(stakeholdersCollection, jsonQuery, function(code, item, message){
					if(code=="1"){
						logger.info("/login: User name <" + req.body.userName + "> logged in");
						var token = jwt.sign(item, config.secret, {
							expiresIn: 86400
						});
						res.send(JSON.stringify({
							"success": 1,
							"error": null,
							"token": token,
							"role": item.role
						}));
					}
					else if(code=="0"){
						res.send(JSON.stringify({
							"success": 0,
							"error": "Not registered!"
						}));
					}
					else if(code=="-1"){
						res.status(500).send(JSON.stringify({
							"success": -1,
							"error": message
						}));
					}
				});		
			}
		});

		
	});
}

exports.loadAppRoutes = loadAppRoutes;