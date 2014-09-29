var $ = require('jquery');

var browser = angular.module('browser', ['ngRoute', 'browserWelcome', 'browserAbout']);

browser.config(function($routeProvider){
    $routeProvider
    .otherwise({redirectTo: '/welcome'})
});

browser.run(function(){
    console.log('main app')
});