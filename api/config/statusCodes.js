//Universal success message
exports.successMessage = null;

//For token verification
exports.authenticationFailure = "-1";
exports.authenticationFailureErrorMessage = "Failed to authenticate token!";
exports.authenticationTokenNotProvided = "0";
exports.authenticationTokenNotProvidedErrorMessage = "No token provided!";

//For MongoDB/File operations
exports.opError = "-1";							//Error on Mongo's side (applies to files)
exports.opNotFound = "0";								//No error but the details do not exist
exports.notFoundMessage = "Data not found!";
exports.opSuccess = "1";							//Operation was executed smoothly

exports.emptyReqBodyMessage = "Empty request body!"