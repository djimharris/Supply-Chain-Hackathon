portNo = process.env.PORT || 3000;
database = process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/hackathon";
exportInfoCollection = "exportInfo";
importInfoCollection = "importInfo";
stakeholdersCollection = "stakeholders";
drayageRegistryCollection = "drayageRegistry";
pendingApprovalsCollection = "pendingApprovals";

exports.portNo = portNo;
exports.database = database;
exports.exportInfoCollection = exportInfoCollection;
exports.importInfoCollection = importInfoCollection;
exports.stakeholdersCollection = stakeholdersCollection;
exports.drayageRegistryCollection = drayageRegistryCollection;
exports.pendingApprovalsCollection = pendingApprovalsCollection;