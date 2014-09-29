var browserWelcome = angular.module('browserWelcome', ['ngRoute', 'component2', 'component1', 'commonService']);

require('./browserWelcome.scss');

browserWelcome.config(function($routeProvider){
    $routeProvider
        .when('/welcome', {
            template: require('./browserWelcome.html'),
            controller: 'welcome'
            //css: require('./page1.scss') //TODO: inject css string on page load
        })
});

browserWelcome.factory('page1Service', function(){
    return {
        get: function(){
            return "A STRING!";
        }
    }
});

browserWelcome.controller('welcome', function(){
    console.log('welcome');
});