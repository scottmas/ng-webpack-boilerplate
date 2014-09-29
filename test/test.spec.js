var assert = require('assert');

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});


describe('acImage', function(){

    var $rootScope, $compile;

    beforeEach(mock.module('browserWelcome'));

    beforeEach(mock.inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_,
        $compile = _$compile_;
    }));

    it('should throw an error when an acImage directive is declared WITHOUT a name attribute', function(){

    });

});



/*
 var inject = window.angular.injector(['ng', 'page1']).invoke;


 inject(function(page1Service){
 console.log(page1Service.get());
 });
 */
