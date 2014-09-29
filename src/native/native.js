window.$ = require('jquery');

var native = angular.module('native', ['ngRoute', 'nativeWelcome', 'nativeAbout']);

native.config(function($routeProvider){
    $routeProvider
    .otherwise({redirectTo: '/page1'})
});

native.run(function(){
    console.log('main app')
});