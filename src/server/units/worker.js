//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: worker.js - Test startup file for NodeJs
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2016 Claude Petit
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//! END_REPLACE()

"use strict";

const util = require('util'),
	cluster = require('cluster'),
	fs = require('fs');

module.exports = function(root, options) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		types = doodad.Types,
		tools = doodad.Tools,
		io = doodad.IO,
		ioInterfaces = io.Interfaces,
		server = doodad.Server,
		nodejs = doodad.NodeJs;

	function startup() {
		const nodejsCluster = nodejs.Cluster;

		if (!options.noCluster) {
			const messenger = new nodejsCluster.ClusterMessenger(server.Ipc.ServiceManager);
			messenger.connect();
				
			const con = messenger.getInterface(ioInterfaces.IConsole);
			
			nodejs.Console.capture(function(name, args) {
				// TODO: Do like "Terminal.consoleWrite"
				con[name].call(con, '<W:' + cluster.worker.id + '>  ' + args[0]);
			});
			
			tools.setOptions({
				hooks: {
					console: function consoleHook(fn, message) {
						// TODO: Do like "Terminal.consoleWrite"
						con[fn].call(con, '<W:' + cluster.worker.id + '>  ' + message);
					},
				},
			});
		};

		root.REGISTER(doodad.Object.$extend(
						server.Ipc.MixIns.Service,
		{
			$TYPE_NAME: 'MyService',
			
			hello: server.Ipc.CALLABLE(function hello(request) {
				request.end("Hello world !");
			}),
			
			stats: server.Ipc.CALLABLE(function hello(request) {
				request.end(nodejs.Server.Http.Request.$getStats());
			}),
		}));

		let saxPath;
		try {
			saxPath = tools.Path.parse(require.resolve('sax/package.json'))
				.set({file: ''})
				.combine('./lib/', {os: 'linux', isRelative: true});
			fs.statSync(saxPath.toString());
		} catch(ex) {
			console.warn("The library 'sax-js' is not available. Some features, like page templates, will be disabled.");
		};
		
		let promisePath;
		try {
			promisePath = tools.Path.parse(require.resolve('es6-promise/package.json'))
				.set({file: ''})
				.combine('./dist/', {os: 'linux', isRelative: true});
			fs.statSync(promisePath.toString());
		} catch(ex) {
			console.warn("The library 'es6-promise' is not available. Serving the library to the client browser will be disabled.");
		};
		
		const folderTemplate = tools.Path.parse(require.resolve('doodad-js-http')).set({file: null}).combine("./res/templates/Folder.ddt", {isRelative: true, os: 'linux'});
		
		const factory = new server.Http.PageFactory({
			'/': {
				page: server.Http.RedirectPage,
				targetUrl: '/nodejs/static/doodad-js-test/widgets/test.html',
			},
			'/rpc': {
				page: nodejs.Server.Http.JsonRpc.Page,
				service: server.Ipc.ServiceManager,
				//verbs: ['POST'],
			},
			'/nodejs/static/doodad-js/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js')).set({file: null}).combine('./dist/doodad-js/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-dates/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-dates')).set({file: null}).combine('./dist/doodad-js-dates/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-http/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-http')).set({file: null}).combine('./dist/doodad-js-http/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-io/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-io')).set({file: null}).combine('./dist/doodad-js-io/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-locale/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-locale')).set({file: null}).combine('./dist/doodad-js-locale/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-mime/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-mime')).set({file: null}).combine('./dist/doodad-js-mime/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-minifiers/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-minifiers')).set({file: null}).combine('./dist/doodad-js-minifiers/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-templates/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-templates')).set({file: null}).combine('./dist/doodad-js-templates/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-test/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-test')).set({file: null}).combine('./dist/doodad-js-test/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-widgets/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-widgets')).set({file: null}).combine('./dist/doodad-js-widgets/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-xml/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-xml')).set({file: null}).combine('./dist/doodad-js-xml/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/doodad-js-loader/': {
				page: nodejs.Server.Http.StaticPage,
				path: tools.Path.parse(require.resolve('doodad-js-loader')).set({file: null}).combine('./dist/doodad-js-loader/', {os: 'linux', dirChar: '/'}),
				showFolders: true,
				folderTemplate: folderTemplate,
			},
			'/nodejs/static/lib/sax/': saxPath && {
				page: nodejs.Server.Http.JavascriptPage,
				path: saxPath,
				mimeTypes: ['application/javascript', 'application/x-javascript'],
				cachePath: options.jsCachePath,
			},
			'/nodejs/static/lib/es6-promise/': promisePath && {
				page: nodejs.Server.Http.StaticPage,
				path: promisePath,
			},
			'/nodejs/static/doodad-js-test/widgets/': {
				page: server.Http.RedirectPage,
				targetUrl: '/nodejs/static/doodad-js-test/widgets/test.html',
				depth: 0,
			},
			'/nodejs/static/doodad-js-test/units/': {
				page: server.Http.RedirectPage,
				targetUrl: '/nodejs/static/doodad-js-test/units/Test.html',
				depth: 0,
			},
			'/nodejs/static/doodad-js-test/browserify/': {
				page: server.Http.RedirectPage,
				targetUrl: '/nodejs/static/doodad-js-test/browserify/index.html',
				depth: 0,
			},
			
			//  Test infinite redirects
			//'/favicon.ico': {
			//	page: server.Http.RedirectPage,
			//	targetUrl: '/favicon.ico',
			//},
			'/favicon.ico': {
				page: server.Http.StatusPage,
				status: types.HttpStatus.NotFound,
			},
		});

		function onerror(ev) {
			console.error(ev.error.stack);
		};

		function onstatus(ev) {
			const request = ev.obj,
				status = request.responseStatus;
			if (status >= 300) {
				request.getResponseStream().write(String(status));
			};
		};

		function onrequest(ev) {
			const request = ev.data.request;
			request.onError.attach(null, onerror);
			request.onStatus.attach(null, onstatus);
		};

		const service = new nodejs.Server.Http.Server(factory);
		service.onError.attach(null, onerror);
		service.onNewRequest.attach(null, onrequest);
		service.listen({
			target: '0.0.0.0', 
			port: 8080,
		});

		const service2 = new nodejs.Server.Http.Server(factory);
		service2.onError.attach(null, onerror);
		service2.onNewRequest.attach(null, onrequest);
		service2.listen({
			protocol: 'https',
			certFile: 'www.doodad-js.local.crt',
			keyFile: 'www.doodad-js.local.key',
			target: '0.0.0.0', 
			port: 8181,
		});
	};
	
	const DD_MODULES = {};
	
	require('doodad-js-widgets').add(DD_MODULES);
	require('doodad-js-mime').add(DD_MODULES);
	require('doodad-js-xml').add(DD_MODULES);
	require('doodad-js-templates').add(DD_MODULES);
	require('doodad-js-minifiers').add(DD_MODULES);
	require('doodad-js-http').add(DD_MODULES);
	require('doodad-js-http_jsonrpc').add(DD_MODULES);
	
	namespaces.loadNamespaces(startup, false, null, DD_MODULES)
		['catch'](function(err) {
			console.error(err.stack);
			//process.exit(1);
		});
};