//A super simplified plugin to the webpack require method that is more sensible, esp. for angular
//Copied and pasted from the angular-webpack-plugin

//Todo: Currently this module is only a subset of the angular webpack plugin's functionality.
// But a pull request to allow users to specify in plugin config which of the plugins features they
// want would probably be accepted.


// © Copyright 2014 Paul Thomas <paul@stackfull.com>.
// Licensed under the MIT license.
//
// Main entry point of the angular-webpack-plugin module
// Defines a plugin for webpack to help it understand angular modules.

var path = require('path');

function AngularPlugin() {}

module.exports = AngularPlugin;

function bindCallbackMethod(source, plugname, obj, method){
    source.plugin(plugname, method.bind(obj, source));
}

function containsSlash(str){
    return str.indexOf("/") >= 0 || str.indexOf("\\") >= 0;
}

// Try to resolve a file of the form /somepath/module/module
// (calling it modmod for want of a better term)
function resolveModModFile(resolver, request, callback){
    var joined = path.join(request.request, request.request);
    return resolver.doResolve("file", {
        path: request.path,
        request: joined,
        query: request.query
    }, callback, true);
}

function requestIsModModFile(request){
    if( containsSlash(request.request) || ! request.file ){
        return false;
    }
    var starting = request.path.length - request.request.length;
    var match = request.path.lastIndexOf(request.request);
    return match === starting &&
        (request.path[starting-1] === '/' || request.path[starting-1] === '\\');
}

AngularPlugin.prototype = {
    constructor: AngularPlugin,

    // This is the entrypoint that is called when the plugin is added to a
    // compiler
    apply: function(compiler){
        bindCallbackMethod(compiler.resolvers.normal, "module-module",
            this, this.resolveModule);
    },

    // #### Plugin Callbacks


    // Additional module resolving specific to angular modules.
    //
    // We're trying to follow as many existing conventions as possible. Including:
    // - dots as path separators
    // - camelCase module names convert to dashed file names
    // - module, directory and file names all the same.
    // - files containing multiple modules (shared prefix)
    //
    resolveModule: function(resolver, request, callback){
        if( containsSlash(request.request) ){
            return callback();
        }
        var split = request.request.split('.');
        if( split.length === 1 ) {
            if( ! requestIsModModFile(request) ){
                return resolveModModFile(resolver, request, callback);
            }
        }else{
            // Try treating `.` as a path separator, but in a non-greedy way.
            // There are lots of options here because we allow the file name to be
            // just a prefix.
            // prefer the segments to be directories and prefer the full name to be
            // used.
            var namespaced = [], ns, mod;
            for( var j = 0; j < split.length; j++ ){
                ns = split.slice(0, -j);
                mod = split.slice(-j);
                namespaced.push({
                    namespace: ns,
                    module: mod.join('.')
                });
            }
            for( var k = 0; k < split.length; k++ ){
                ns = split.slice(0, -k);
                mod = split.slice(-k);
                for( var i = 1; i < mod.length; i++ ){
                    namespaced.push({
                        namespace: ns,
                        module: mod.slice(0, -i).join('.')
                    });
                }
            }
            namespaced.shift();

            return resolver.forEachBail(namespaced, function(nsmod, cb){
                callback.log("resolve module " + nsmod.module +
                    " in namespace " + JSON.stringify(nsmod.namespace));
                var req = {
                    path: request.path,
                    request: path.join.apply(path, nsmod.namespace.concat(nsmod.module)),
                    query: request.query
                };
                callback.log(JSON.stringify(req));
                return resolver.doResolve("module", req, cb, true);
            }, function(err, resolved){
                if( err || !resolved ){
                    return callback(err);
                }
                if( resolved.file ){
                    // We're taking this as resolved. It should contain other modules with
                    // this prefix
                    return resolver.doResolve("result", resolved, callback);
                }
                if(callback.log){
                    callback.log(" is not an angular module");
                }
                callback();
            });
        }
        return callback();
    }
};