//Libraries
var gulp = require('gulp');
var exec = require('exec');
var clc = require('cli-color');
var extend = require('extend');
var webpack = require('webpack');
var webpackOpts = require('./webpack.config.js');
var ngAnnotatePlugin = require("ng-annotate-webpack-plugin");
var inject = require('gulp-inject');


//Globals
var webpackError = false;

//Tasks
gulp.task('dev', ['dev-onetime'], function(cb){
    gulp.run(['dev:webpack', 'dev:mocha', 'dev:servers', 'dev:misc'], cb)
});

//I hate dev-onetime but gulp runs tasks concurrently, so the first time the dev
//command is run, the mocha task fails because the webpack bundle hasn't been built yet.
//Todo: Is there a better way?
gulp.task('dev-onetime', ['dev-onetime:webpack']);

gulp.task('dev-onetime:webpack', function(cb){
    extend(true, webpackOpts, {
        output: {path: './build/dev', pathinfo: true},
        devtool: '#eval',
        debug: true
    });

    doWebpack('dev', webpackOpts, cb)
});

gulp.task('build', function(cb){
    gulp.run('build:webpack', function(){
        gulp.run('build:mocha', cb);
    })
});
gulp.task('default', ['dev']);

gulp.task('dev:mocha', function(cb){
    doMocha(['-w', '-R', 'min'], cb)
});

gulp.task("dev:misc", []);

gulp.task('build:mocha', function(cb){
    doMocha([], cb)
});

gulp.task('build:misc', []);

gulp.task('dev:webpack', function(cb){
    extend(true, webpackOpts, {
        output: {path: './build/dev', pathinfo: true},
        watch: true,
        watchDelay: 200,
        devtool: '#eval',
        debug: true
    });

    doWebpack('dev', webpackOpts, cb)
});

gulp.task('build:webpack', function(cb){
    extend(true, webpackOpts, {
        output: {path: './build/production'},
        devtool: '#source-map'
    });

    webpackOpts.plugins = webpackOpts.plugins.concat([
        new ngAnnotatePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);

    doWebpack('build', webpackOpts, cb)
});

gulp.task('dev:servers', function(){
    var express  = require('express');
    var browser = express();
    browser.use(express.static('./build/dev', {index: 'browser.html'}));
    browser.listen(9000);

    //TODO: Change index.html to native.html once we get Jim to update the native client
    var native = express();
    native.use(express.static('./build/dev', {index: 'index.html'}));
    native.listen(8080);
});

//Helper functions (the meat of the tasks)
function doMocha(extraArgs, cb){
    //Note: The mocha node API sucks, so we just spawn a process via commandn line.
    var args = ['node', 'node_modules/mocha/bin/mocha', 'test/testEntry.js'];

    var mochaProc = exec(args.concat(extraArgs || []), cb);

    mochaProc.stdout.on('data', function(data){
        if(webpackError) return;
        process.stdout.write(clc.red(String(data)));

    });

    mochaProc.stderr.on('data', function(data){
        if(webpackError) return;
        process.stdout.write(clc.red(String(data)))
    });
}

function doWebpack(mode, opts, cb){
    var softErr;

    console.log(clc.green("Webpack building..."));
    webpack(opts, function(err, stats){
        if(err){
            webpackError = true;
            console.log(clc.red(String(err)));
        }
        else if((softErr = stats.toJson().errors).length > 0){ //Clean up the unreadable error message created by webpack.
            softErr = softErr[0].slice(softErr[0].indexOf('Error'));
            softErr = softErr.slice(0, softErr.indexOf('\n'));
            console.log(clc.red(softErr));
            webpackError = true;
        } else{
            injectScripts(mode, stats.toJson().chunks);
            console.log(clc.green("Webpack bundle successfully built..."));
            webpackError = false;
        }
        if(!opts.watch && cb) cb();

    });

    function injectScripts(mode, chunks){

        var scripts = [];
        chunks.forEach(function(chunk){
            var file = chunk.files[0];
            if(file.charAt(0) === '/') file = file.slice(1);
            if(chunk.initial && chunk.entry){
                scripts.unshift("./build/dev/" + file); //Todo: Is it always files[0]? Thus far yes, but it may not always
            } else if(chunk.names[0] === 'native' || chunk.names[0] === 'browser'){
                //do nothing
            }
            else{
                scripts.push("./build/dev/" + file)
            }
        });

        gulp.src('./src/browser/browser.html')
            .pipe(inject(gulp.src(scripts.concat(["./build/dev/browser.bundle.js"])),  {addRootSlash: false, ignorePath: 'build/dev/'}))
            .pipe(gulp.dest('./build/dev'));

        gulp.src('./src/native/index.html')
            .pipe(inject(gulp.src(scripts.concat(["./build/dev/native.bundle.js"])),  {addRootSlash: false, ignorePath: 'build/dev/'}))
            .pipe(gulp.dest('./build/dev'));

    }
}




//SVG Icons
//Generate an svg with all the svgs concatenated together and easily referenceable.
//gulp.task('svg-icons',function() {
//    return gulp.src('src/common/assets/images/icons/*.svg')
//        .pipe($.rename(function(path) {
//            path.basename = path.basename.slice(6);
//        }))
//        .pipe($.svgSymbols({css: false}))
//        .pipe(gulp.dest('src/common/assets/images/generated_icons'));
//});

//
// /*
// *  Prepend imports to our mixin and variable files found in src/styleVariables. This enables us to:
// *    (a) Allow gulp to glob our scss files and still have access to variables and mixins
// *    (b) Rebuild individual scss files on change, reducing compile times on huge projects
// */
//gulp.task('prepend-imports', function(){
//
//    var startFlag = '/*Begin imports*/ ';
//    var imports = glob('src/common/styleVariables/*.scss').map(function(val){
//        return "@import '" + path.basename(val, '.scss') + "'; ";
//    }).join('');
//    var endFlag = '/*End imports*/';
//
//    var importString = [startFlag, imports, endFlag, '\n'].join('');
//
//    glob(files['styles']).forEach(function(filePath){
//        //Only scss files
//        if(path.extname(filePath) !== '.scss')
//            return;
//
//        var thisFile = fs.readFileSync(filePath).toString();
//
//        //The file already has the requisite imports
//        if(thisFile.indexOf(importString) !== -1)
//            return;
//
//        //styleVariables folder has changed
//        if(thisFile.indexOf(startFlag) !== -1){
//            thisFile = thisFile.slice(thisFile.indexOf(endFlag) + endFlag.length + 1);
//        }
//
//        fs.writeFileSync(filePath, importString + thisFile);
//
//    });
//});


////Generate a custom build of twitter bootstrap using the style variables found in src/styleVariables.
//gulp.task('build-bootstrap-css', function(){
//    var mainBootstrapFile = getBower('scss', {devDependencies: true, dependencies: false})[0];
//
//    var fileContents = String(fs.readFileSync(mainBootstrapFile)).split('\n');
//
//    //Instead of using the file variables.scss defined in bower, replace it with your our own variables file
//    fileContents.some(function(val, i){
//        if(val.indexOf('variables') !== -1 && val.indexOf('@import') !== -1){
//            fileContents[i] = readGlob("src/common/styleVariables/*.scss");
//            return true;
//        }
//    });
//
//    fileContents = fileContents.join('\n');
//
//    var css = sass.renderSync({
//        data: fileContents,
//        includePaths: [path.dirname(mainBootstrapFile)]
//    });
//
//    fs.writeFileSync('src/common/libs/bootstrap-build.css', css);
//});

//Pre commit hook
//Warning: On windows a failing task (called via process.exit(1)) will NOT cause the commit to fail. You can only log errors
//gulp.task('pre-commit',  function () {
//    return gulp.src('app/scripts/**/*.js')
//        .pipe($.jshint('config/jshint.json'))
//        .pipe($.jshint.reporter('jshint-stylish'))
//        .pipe(preCommitReporter());
//
//
//    //TODO: enforce code coverage on commits
//    //test coverage. Described: http://ariya.ofilabs.com/2013/05/hard-thresholds-on-javascript-code-coverage.html
//    //var report = require('istanbul').Report.create('text-summary');
//
//
//});