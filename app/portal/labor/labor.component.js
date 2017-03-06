var angular = require('angular');

angular.module('portApp')
.component('labor', {
    templateUrl: 'app/portal/labor/labor.html',
    controller: function($http, authService) {
        this.container = undefined;
        this.searched = true;
        this.makeAppointment = true;
        this.detailsWidth = this.makeAppointment ? 'col-xs-6': 'col-xs-12';
        $http.post('http://localhost:3000/portmto/newArrivals', {token: authService.getToken()}).then(function(response) {
            $scope.tasks = response.data.containers;

        }, function(response) {

        });
    }
});
