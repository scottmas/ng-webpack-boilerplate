var page1 = angular.module('page1', ['ngRoute', 'component2', 'component1', 'commonService']);

require('./nativeWelcome.scss');

page1.config(function($routeProvider){
    $routeProvider
        .when('/page1', {
            template: "<div>asdfasdf</div>",
            controller: 'page1'
            //css: require('./page1.scss') //TODO: inject css string on page load
        })
});

page1.factory('page1Service', function(){
    return {
        get: function(){
            return "A STRING!";
        }
    }
});

page1.controller('page1', function(){
    console.log('page1');
});