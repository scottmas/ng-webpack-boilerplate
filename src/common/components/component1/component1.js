require('./component1.scss');
var component1 = angular.module('component1', ['commonDirective']);

component1.directive('component1', function($rootScope){
    $rootScope.loaded = $rootScope.loaded || {};
    $rootScope.loaded.component1 = true;

    return {
        replace: true,
        template: require('./component1.html'),
        //css: require('./component1.scss'), //TODO: Inject css first time the directive is created. Have to remove style-loader
        link: function(scope, elm){
            //console.log('component1 called');
        }
    }
});

