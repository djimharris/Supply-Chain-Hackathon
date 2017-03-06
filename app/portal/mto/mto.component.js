var angular = require('angular');

angular.module('portApp')
.component('mto', {
    templateUrl: 'app/portal/mto/mto.html',
    controller: function($http, $scope, authService) {

        $http.post('http://localhost:3000/portmto/viewData', {token: authService.getToken()}).then(function(response) {
            $scope.exports = response.data.exportInfo;
            $scope.imports = response.data.importInfo;
            console.log($scope.exports);
        }, function(response) {
            console.error('F!');
        });

        $http.post('http://localhost:3000/portmto/newArrivals', {token: authService.getToken()}).then(function(response) {
            $scope.fillData = response.data.containers;

        }, function(response) {
            console.error('F!');
        });

        $scope.updateData = function(row){
            $http.post('http://localhost:3000/portmto/updateLocationImp', {
                "container#" : row['container#'],
                "lotNumber" : row.lotNumber,
                "berthNumber" : row.berthNumber,
                "lastDayForPickup" : row.lastDayForPickup,
                token: authService.getToken()
            }).then(function(response) {
                alert("Update Successful");
                console.log("Works");
            }, function(response) {
                console.error('F!');
            });
        }

        $scope.hasArrived = function(){
         $http.post("http://localhost:3000/portmto/postArrivals", {
                vesselName: $scope.shipArrived,
                arrivingTerminal: $scope.shipTerminal,
                token: authService.getToken()
            }).then(function(response) {
                alert('YAY!');
            }, function(response) {
                 alert('NAY!');
            });
        };

    }
});
