var angular = require('angular');

angular.module('portApp')
.component('admin', {
    templateUrl: 'app/portal/admin/admin.html',
    controller: function($scope, $http, authService) {

        $http.post('http://localhost:3000/portadmin/pendingApprovals', {token: authService.getToken()}).then(function(response) {
            $scope.approvals = response.data.pendingApprovals;
        }, function(response) {
            console.error('F!');
        });

        $scope.approveUser = function(username){
             $http.post('http://localhost:3000/portadmin/approvals', {userName: username,token: authService.getToken()}).then(function(response) {
//            $scope.approvals = response.data.pendingApprovals;
        }, function(response) {

        });
        }
    }
});
