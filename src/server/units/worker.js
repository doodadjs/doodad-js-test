//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
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
		files = tools.Files,
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
			
			nodejs.Console.capture(function(fn, args) {
				// TODO: Do like "Terminal.consoleWrite"
				con[fn].call(con, '<W:' + cluster.worker.id + '>  ' + args[0]);
			});
			
			tools.setOptions({
				hooks: {
					console: function consoleHook(level, message) {
						// TODO: Do like "Terminal.consoleWrite"
						var fn;
						if (level === tools.LogLevels.Info) {
							fn = 'info';
						} else if (level === tools.LogLevels.Warning) {
							fn = 'warn';
						} else if (level === tools.LogLevels.Error) {
							fn = 'error';
						} else {
							fn = 'log';
						};
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
			saxPath = files.Path.parse(require.resolve('sax/package.json'))
				.set({file: ''})
				.combine('./lib/', {os: 'linux', isRelative: true});
			fs.statSync(saxPath.toString());
		} catch(ex) {
			console.warn("The library 'sax-js' is not available. Some features, like page templates, will be disabled.");
		};
		
		let promisePath;
		try {
			promisePath = files.Path.parse(require.resolve('es6-promise/package.json'))
				.set({file: ''})
				.combine('./dist/', {os: 'linux', isRelative: true});
			fs.statSync(promisePath.toString());
		} catch(ex) {
			console.warn("The library 'es6-promise' is not available. Serving the library to the client browser will be disabled.");
		};
		
		const factory = new server.Http.PageFactory({
			'/': {
				responses: server.Http.RedirectPage,
				targetUrl: '/nodejs/static/doodad-js-test/widgets/test.html',
			},
			'/rpc': {
				responses: server.Http.JsonRpc.Page,
				service: server.Ipc.ServiceManager,
				//verbs: ['POST'],
			},
			'/nodejs/static/': {
				//verbs: ['GET', 'HEAD'],
				depth: Infinity,
				//sslPort: 8181,
				//hstsSafe: true,
				responses: [/*server.Http.UpgradeInsecureRequestsResponse,*/ server.Http.CrossOriginResponse, new server.Http.PageFactory({
					'/doodad-js': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js')).set({file: null}).combine('./dist/doodad-js/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-dates': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-dates')).set({file: null}).combine('./dist/doodad-js-dates/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-http': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-http')).set({file: null}).combine('./dist/doodad-js-http/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-io': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-io')).set({file: null}).combine('./dist/doodad-js-io/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-locale': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-locale')).set({file: null}).combine('./dist/doodad-js-locale/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-mime': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-mime')).set({file: null}).combine('./dist/doodad-js-mime/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-minifiers': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-minifiers')).set({file: null}).combine('./dist/doodad-js-minifiers/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-templates': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-templates')).set({file: null}).combine('./dist/doodad-js-templates/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-test': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-test')).set({file: null}).combine('./dist/doodad-js-test/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-widgets': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-widgets')).set({file: null}).combine('./dist/doodad-js-widgets/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-xml': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-xml')).set({file: null}).combine('./dist/doodad-js-xml/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-loader': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-loader')).set({file: null}).combine('./dist/doodad-js-loader/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-safeeval': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-safeeval')).set({file: null}).combine('./dist/doodad-js-safeeval/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/doodad-js-unicode': {
						responses: nodejs.Server.Http.StaticPage,
						path: files.Path.parse(require.resolve('doodad-js-unicode')).set({file: null}).combine('./dist/doodad-js-unicode/', {os: 'linux', dirChar: '/'}),
						showFolders: true,
						depth: Infinity,
					},
					'/lib/sax': saxPath && {
						responses: nodejs.Server.Http.JavascriptPage,
						path: saxPath,
						mimeTypes: ['application/javascript', 'application/x-javascript'],
						cachePath: options.jsCachePath,
						depth: Infinity,
					},
					'/lib/es6-promise': promisePath && {
						responses: nodejs.Server.Http.StaticPage,
						path: promisePath,
						depth: Infinity,
					},
					'/doodad-js-test/widgets/': {
						responses: server.Http.RedirectPage,
						targetUrl: '/nodejs/static/doodad-js-test/widgets/test.html',
					},
					'/doodad-js-test/units/': {
						responses: server.Http.RedirectPage,
						targetUrl: '/nodejs/static/doodad-js-test/units/Test.html',
					},
					'/doodad-js-test/browserify/': {
						responses: server.Http.RedirectPage,
						targetUrl: '/nodejs/static/doodad-js-test/browserify/index.html',
					},
				})],
			},
			
			//  Test infinite redirects
			//'/favicon.ico': {
			//	responses: server.Http.RedirectPage,
			//	targetUrl: '/favicon.ico',
			//},
		});

		function onerror(ev) {
			console.error(ev.error.stack);
		};

		function onstatus(ev) {
			const request = ev.obj,
				status = request.responseStatus;
			if (status >= 300) {
				const stream = request.getResponseStream();
				if (stream) {
					stream.write(String(status));
				};
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
	
	namespaces.load(DD_MODULES, startup)
		['catch'](function(err) {
			console.error(err.stack);
			//process.exit(1);
		});
};