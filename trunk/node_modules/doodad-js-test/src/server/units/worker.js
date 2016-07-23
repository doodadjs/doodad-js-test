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

module.exports = function(root, options, _shared) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		types = doodad.Types,
		tools = doodad.Tools,
		files = tools.Files,
		io = doodad.IO,
		ioInterfaces = io.Interfaces,
		ioMixIns = io.MixIns,
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
			
			_shared.consoleHook = function consoleHook(level, message) {
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
			};
		};

		root.REGISTER(doodad.Object.$extend(
						server.Ipc.MixIns.Service,
		{
			$TYPE_NAME: 'MyService',
			
			hello: server.Ipc.CALLABLE(function hello(request) {
				return "Hello world !";
			}),
			
			stats: server.Ipc.CALLABLE(function hello(request) {
				return nodejs.Server.Http.Request.$getStats();
			}),
		}));

		let saxPath;
		try {
			saxPath = files.Path.parse(require.resolve('sax/package.json'))
				.set({file: ''})
				.combine('./lib/', {os: 'linux'});
			fs.statSync(saxPath.toString());
		} catch(ex) {
			console.warn("The library 'sax-js' is not available. Some features, like page templates, will be disabled.");
		};
		
		let promisePath;
		try {
			promisePath = files.Path.parse(require.resolve('es6-promise/package.json'))
				.set({file: ''})
				.combine('./dist/', {os: 'linux'});
			fs.statSync(promisePath.toString());
		} catch(ex) {
			console.warn("The library 'es6-promise' is not available. Serving the library to the client browser will be disabled.");
		};
		
		const factory = new server.Http.Routes({
			'/': {
				handlers: [
					{
						handler: server.Http.RedirectHandler,
						targetUrl: '/nodejs/static/doodad-js-test/widgets/test.html',
					},
				],
			},
			'/rpc': {
				//verbs: ['POST'],
				handlers: [
					{
						handler: server.Http.JsonRpc.Page,
						service: server.Ipc.ServiceManager,
					},
				],
			},
			'/*/hello': {
				verbs: ['GET'],
				handlers: [
					{
						handler: function(request) {
							request.getResponseStream({contentType: 'text/plain'}).write("Hello !");
						},
					},
				],
			},
			'/**/bonjour': {
				verbs: ['GET'],
				handlers: [
					{
						handler: function(request) {
							request.getResponseStream({contentType: 'text/plain'}).write("Bonjour !");
						},
					},
				],
			},
			'/nodejs/static/': {
				//verbs: ['GET', 'HEAD'],
				handlers: [
					//{
					//	handler: server.Http.UpgradeInsecureRequestsHandler,
					//	sslPort: 8181,
					//	hstsSafe: true,
					//	depth: Infinity,
					//},
					{
						handler: server.Http.CrossOriginHandler, 
						depth: Infinity,
					},
					//{
					//	handler: nodejs.Server.Http.CompressionHandler,
					//	mimeTypes: ['application/javascript', 'application/x-javascript', 'text/html', 'text/css'],
					//	depth: Infinity,
					//},
					{
						handler: new server.Http.Routes({
							'/doodad-js': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js')).set({file: null}).combine('./dist/doodad-js/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-dates': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-dates')).set({file: null}).combine('./dist/doodad-js-dates/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-http': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-http')).set({file: null}).combine('./dist/doodad-js-http/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-io': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-io')).set({file: null}).combine('./dist/doodad-js-io/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-locale': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-locale')).set({file: null}).combine('./dist/doodad-js-locale/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-mime': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-mime')).set({file: null}).combine('./dist/doodad-js-mime/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-minifiers': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-minifiers')).set({file: null}).combine('./dist/doodad-js-minifiers/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-templates': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-templates')).set({file: null}).combine('./dist/doodad-js-templates/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-test': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-test')).set({file: null}).combine('./dist/doodad-js-test/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-widgets': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-widgets')).set({file: null}).combine('./dist/doodad-js-widgets/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-xml': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-xml')).set({file: null}).combine('./dist/doodad-js-xml/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-loader': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-loader')).set({file: null}).combine('./dist/doodad-js-loader/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-safeeval': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-safeeval')).set({file: null}).combine('./dist/doodad-js-safeeval/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/doodad-js-unicode': {
								depth: Infinity,
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: files.Path.parse(require.resolve('doodad-js-unicode')).set({file: null}).combine('./dist/doodad-js-unicode/', {os: 'linux'}),
										showFolders: true,
									},
								],
							},
							'/lib/sax': saxPath && {
								depth: Infinity,
								mimeTypes: ['application/javascript', 'application/x-javascript'],
								handlers: [
									{
										handler: nodejs.Server.Http.JavascriptPage,
										path: saxPath,
										cachePath: options.jsCachePath,
										showFolders: true,
									},
								],
							},
							'/lib/es6-promise': promisePath && {
								depth: Infinity,
								mimeTypes: ['application/javascript', 'application/x-javascript'],
								handlers: [
									{
										handler: nodejs.Server.Http.StaticPage,
										path: promisePath,
									},
								],
							},
							'/doodad-js-test/widgets/': {
								handlers: [
									{
										handler: server.Http.RedirectHandler,
										targetUrl: 'test.html',
									}
								],
							},
							'/doodad-js-test/units/': {
								handlers: [
									{
										handler: server.Http.RedirectHandler,
										targetUrl: 'Test.html',
									},
								],
							},
							'/doodad-js-test/browserify/': {
								handlers: [
									{
										handler: server.Http.RedirectHandler,
										targetUrl: 'index.html',
									},
								],
							},
							'/doodad-js-test/webpack/': {
								handlers: [
									{
										handler: server.Http.RedirectHandler,
										targetUrl: 'index.html',
									},
								],
							},
						}),
					},
				],
			},
			
			//  Test infinite redirects
			//'/favicon.ico': {
			//	handlers: [
			//		{
			//			handler: server.Http.RedirectPage,
			//			targetUrl: '/favicon.ico',
			//		},
			//	],
			//},
		});

		function onerror(ev) {
			console.error(ev.error.stack);
		};

		function onstatus(ev) {
			const request = ev.obj,
				status = request.responseStatus;
			if (status >= 300) {
				if (!request.hasResponseStream()) {
					const stream = request.getResponseStream({contentType: 'text/plain', encoding: 'utf-8'});
					stream.write(types.toString(status));
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
	
	return namespaces.load(DD_MODULES, startup);
};