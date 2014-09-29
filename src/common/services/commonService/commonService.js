var commonService = angular.module('commonService', []);

commonService.factory('commonService', function($rootScope){
    $rootScope.loaded = $rootScope.loaded || {};
    $rootScope.loaded.commonService = true;

    return function(){
        //console.log('commonService called');
    }
});