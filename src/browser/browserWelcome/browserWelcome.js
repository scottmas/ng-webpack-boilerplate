//Modules
require('script!angular-route');
require('component2');
require('component1');
require('commonService');

//SCSS
require('./browserWelcome.scss');

var browserWelcome = angular.module('browserWelcome', ['ngRoute', 'component2', 'component1', 'commonService']);

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
