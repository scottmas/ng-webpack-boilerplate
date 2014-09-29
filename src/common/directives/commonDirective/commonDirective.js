var commonDirective = angular.module('commonDirective', []);

commonDirective.directive('commonDirective', function($rootScope){
    $rootScope.loaded = $rootScope.loaded || {};
    $rootScope.loaded.commonDirective = true;

    return {
        template: '<div>Replaced</div>',
        replace: true,
        link: function(){
            //console.log('commonDirective called');
        }
    }
});