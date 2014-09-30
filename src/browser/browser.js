//Load globals
require('script!jquery');
require('script!angular');

//Load app scripts
require('script!angular-moment');
require('script!angular-route');

//Load pages
require('./browserWelcome/browserWelcome.js');
require('./browserAbout/browserAbout.js');

var browser = angular.module('browser', [
        'ngRoute',
        'browserWelcome',
        'browserAbout'
]);

browser.config(function($routeProvider){
    $routeProvider
    .otherwise({redirectTo: '/welcome'})
});

browser.run(function(){
    console.log('main app')
});