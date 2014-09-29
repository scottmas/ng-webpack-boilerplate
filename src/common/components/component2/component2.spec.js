describe('component2', function(){


    it('does stuff', function(){
        module('component2');

        inject(function($rootScope, $compile){

            console.log('before component2 called', $rootScope.loaded);

            var scope = $rootScope.$new();
            var element = '<div component2></div>';
            element = $compile(element)(scope);

            console.log('after component used: ', $rootScope.loaded, element);
        })
    });

    it('does stuff', function(){
        module('component1');
        module('component2');

        inject(function($rootScope, $compile){

            console.log('before component1 called', $rootScope.loaded);

            var scope = $rootScope.$new();
            var element = '<div component1></div>';
            element = $compile(element)(scope);

            console.log('after component1 used: ', $rootScope.loaded, element);
        })
    });

});