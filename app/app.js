var angular = require('angular');

require('angular-ui-router');
require('angular-ui-bootstrap');

var app = angular.module('portApp', ['ui.router', 'ui.bootstrap']);

require('./home/drayage/drayage.component.js');
require('./home/register/register.component.js');

require('./portal/store/store.component.js');
require('./portal/distributor/distributor.component.js');
require('./portal/labor/labor.component.js');
require('./portal/shipper/shipper.component.js');
require('./portal/admin/admin.component.js');
require('./portal/mto/mto.component.js');

app.factory('authService', function() {
    var token = undefined;
    
    function getToken() {
        return token;
    } 
    
    function setToken(newToken) {
        token = newToken;
    }
        
    return {
        getToken: getToken,
        setToken: setToken
    }
});

app.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home/drayage');
        
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: function($http, $scope, $state, authService) {

                $scope.loginf = function(){
                    $http.post('http://localhost:3000/login', {
                        userName: $scope.username,
                        password: $scope.password
                    }).then(function(response) {
                        authService.setToken(response.data.token);
                        $state.transitionTo('portal.' + response.data.role);
                    }, function(response) {
                    });
                };
            }
        });
        
        $stateProvider.state('home.drayage', {
            url: '/drayage',
            template: '<drayage class="center-content"></drayage>'
        });
        
        $stateProvider.state('home.register', {
            url: '/register',
            template: '<register class="center-content"></register>'
        });
        
        $stateProvider.state('portal', {
            url: '/portal',
            templateUrl: 'app/portal/portal.html'
        });
        
        $stateProvider.state('portal.store', {
            url: '/store',
            template: '<store class="center-content"></store>'
        });
        
        $stateProvider.state('portal.distributor', {
            url: '/distributor',
            template: '<distributor class="center-content"></distributor>'
        });
        
        $stateProvider.state('portal.labor', {
            url: '/labor',
            template: '<labor class="center-content"></labor>'
        });
        
        $stateProvider.state('portal.shipper', {
            url: '/shipper',
            template: '<shipper class="center-content"></shipper>'
        });
        
        $stateProvider.state('portal.admin', {
            url: '/admin',
            template: '<admin class="center-content"></admin>'
        });
        
        $stateProvider.state('portal.mto', {
            url: '/mto',
            template: '<mto class="center-content"></mto>'
        });
    }
]);