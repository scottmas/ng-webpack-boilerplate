var component2 = angular.module('component2', ['commonService', 'commonDirective'])

component2.directive('component2', function($rootScope, commonService){
    $rootScope.loaded = $rootScope.loaded || {};
    $rootScope.loaded.component2 = true;

    return {
        replace: true,
        template: require('./component2.html'),
        link: function(scope, elm){
            //console.log('component2 called');
        }
    }
});

