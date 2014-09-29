//Shim the browser environment
var jsdom = require("jsdom").jsdom;
global.document = jsdom(undefined, {});
global.window = document.parentWindow;
global.navigator = window.navigator = {};

//Expose global variables created by mocha CL tool on the window (where angular-mocks expects them to be).
//These globals are documented here: http://visionmedia.github.io/mocha/#interfaces
window.mocha = {}; //When triggering Mocha through the CLI, it doesn't create a Mocha object like the browser version does. As far as I can tell, besides an initial check for it, its not used in Angular Mocks
window.it = global.it;
window.describe = global.describe;
window.context = global.context;
window.before = global.before;
window.after = global.after;
window.afterEach = global.afterEach;
window.beforeEach = global.beforeEach;
window.suite = global.suite;
window.test = global.test;
window.teardown = global.teardown;
window.setup = global.setup;
window.specify = global.specify;
window.xcontext = global.xcontext;
window.xdescribe = global.xdescribe;
window.xit = global.xit;
window.xspecify = global.xspecify;

//Load the entire application. But no code executes yet, since angular hasn't been bootstrapped
require('./build/browser/index.js');

//Load mocking libraries
require('./bower_components/angular-mocks/angular-mocks.js');

//Convenience
//for convenience so we don't have to type window.angular.mock every time we want to declare a module or inject
//Note: I would have just exposed "module" and "inject" on the global namespace but "module" is already being used by node.
global.mock = window.angular.mock;



require('./test.spec.js');