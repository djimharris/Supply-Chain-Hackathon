var angular = require('angular');

angular.module('portApp')
.component('register', {
    templateUrl: 'app/home/register/register.html',
    controller: function($http, $scope) {
        $scope.registerUser = function() {
             $http.post("http://localhost:3000/register", {
                userName: $scope.username,
                password: $scope.password,
                role: $scope.role,
                pointOfContact: $scope.fullname,
                email: $scope.email,
                company: $scope.companyName
            }).then(function(response) {

            }, function(response) {

            });
        };
    }
});
