//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: worker.js - Test startup file for NodeJs
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2017 Claude Petit
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
		nodejs = doodad.NodeJs,

		util = require('util'),
		cluster = require('cluster'),
		fs = require('fs');

	function startup() {
		const nodejsCluster = nodejs.Cluster;

		let messenger = null;
		if (!options.noCluster) {
			messenger = new nodejsCluster.ClusterMessenger(server.Ipc.ServiceManager);
			messenger.connect();
				
			const con = messenger.getInterface(ioInterfaces.IConsole);
			
			// Captures "console.XXX()"
			nodejs.Console.capture(function(fn, args) {
				// TODO: Do like "Terminal.consoleWrite"
				con[fn].call(con, '<W:' + cluster.worker.id + '>  ' + args[0]);
			});
			
			// Captures "tools.log()"
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
		};

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

		let momentPath;
		try {
			momentPath = files.Path.parse(require.resolve('moment/package.json'))
				.set({file: ''})
				.combine('./min/', {os: 'linux'});
			fs.statSync(momentPath.toString());
		} catch(ex) {
			console.warn("The library 'moment' is not available. Serving the library to the client browser will be disabled.");
		};

		let momentTzPath;
		try {
			momentTzPath = files.Path.parse(require.resolve('moment-timezone/package.json'))
				.set({file: ''})
				.combine('./builds/', {os: 'linux'});
			fs.statSync(momentTzPath.toString());
		} catch(ex) {
			console.warn("The library 'moment-timezone' is not available. Serving the library to the client browser will be disabled.");
		};

		let momentTzDataPath;
		try {
			momentTzDataPath = files.Path.parse(require.resolve('moment-timezone/package.json'))
				.set({file: ''})
				.combine('./data/packed/', {os: 'linux'});
			fs.statSync(momentTzPath.toString());
		} catch(ex) {
			console.warn("The data of the library 'moment-timezone' are not available. Serving the library's data to the client browser will be disabled.");
		};

		const staticMimeTypes = ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8', 'text/html; charset=utf-8', 'text/css; charset=utf-8', 'application/json; charset=utf-8', 'text/json; charset=utf-8', '*/*'];

		const handlers = [
			//{
			//	handler: server.Http.UpgradeInsecureRequestsHandler,
			//	sslPort: 8181,
			//	hstsSafe: true,
			//},
			{
				handler: new server.Http.Routes({
					'/': {
						handlers: [
							{
								handler: server.Http.RedirectHandler,
								targetUrl: '/app/doodad-js-test/units/Test.html',
							},
						],
					},
					'/form?id=(\\d{1,4})&mode=(view|edit)': {
						handlers: [
							{
								handler: function(request) {
									const handlerState = request.getHandlerState(),
										args = handlerState.matcherResult.queryArgs;
									return request.response.getStream({contentType: 'text/plain', encoding: 'utf-8'}).then(function(stream) {
										stream.write((args.mode === 'edit' ? "Editing" : "Viewing") + " id " + args.id);
									});
								},
							},
						],
					},
					'/form/mode:(view|edit)/id:(\\d{1,4})': {
						handlers: [
							{
								handler: function(request) {
									const handlerState = request.getHandlerState(),
										args = handlerState.matcherResult.urlArgs;
									return request.response.getStream({contentType: 'text/plain', encoding: 'utf-8'}).then(function(stream) {
										stream.write((args.mode === 'edit' ? "Editing" : "Viewing") + " id " + args.id);
									});
								},
							},
						],
					},
					'/rpc': {
						//verbs: ['POST'],
						handlers: [
							{
								handler: server.Http.Base64BodyHandler,
							},
							{
								handler: nodejs.Server.Http.CompressionBodyHandler,
							},
							{
								handler: server.Http.JsonBodyHandler,
								verbs: ['POST'],
							},
							{
								handler: server.Http.JsonRpc.Page,
								service: server.Ipc.ServiceManager,
								//batchLimit: 2,
							},
						],
					},
					'/multipart': {
						verbs: ['POST'],
						handlers: [
							{
								handler: server.Http.Base64BodyHandler,
							},
							{
								handler: nodejs.Server.Http.CompressionBodyHandler,
							},
							{
								handler: server.Http.FormMultipartBodyHandler,
							},
							{
								handler: server.Http.TextBodyHandler,
							},
							{
								handler: server.Http.UrlBodyHandler,
							},
							{
								handler: function(request) {
									const Promise = types.getPromise();
									return request.getStream()
										.then(function(mpStream) {
											// TODO: Write an helper function for that
											// TODO: Try "rxjs" (Observables), but I doubt it will be as fast
											mpStream.setOptions({flushMode: 'half'});
											return request.response.getStream({contentType: 'text/plain; charset=utf-8'})
												.then(function(resStream) {
													return Promise.create(function onReadyHook(mpResolve, mpReject) {
														const state = {aborted: false, mpStreamEnd: null};
														let mpStreamReadyCb, mpStreamErrorCb;
														state.mpStreamEnd = function(err) {
															mpStream.onReady.detach(null, mpStreamReadyCb);
															mpStream.onError.detach(null, mpStreamErrorCb);
															if (err) {
																state.aborted = true;
																mpReject(err);
															} else {
																mpResolve(/* returns nothing*/);
															};
														};
														mpStream.onReady.attach(null, mpStreamReadyCb = function(ev) {
															ev.preventDefault();
															if (ev.data.raw === io.BOF) {
																ev.data.delayed = true;
																mpStream.onReady.detach(null, mpStreamReadyCb);
																request.getStream()
																	.then(function(reqStream) {
																		return !state.aborted && Promise.create(function onReadyHook(reqResolve, reqReject) {
																			let reqStreamReadyCb, reqStreamErrorCb;
																			const reqStreamEnd = function(err) {
																				reqStream.onReady.detach(null, reqStreamReadyCb);
																				reqStream.onError.detach(null, reqStreamErrorCb);
																				if (err) {
																					reqReject(err);
																				} else {
																					if (!state.aborted) {
																						mpStream.onReady.attach(null, mpStreamReadyCb);
																						mpStream.listen();
																						mpStream.flush();
																					};
																					reqResolve();
																				};
																			};
																			reqStream.onReady.attach(null, reqStreamReadyCb = function(ev) {
																				ev.preventDefault();
																				if (state.aborted || (ev.data.raw === io.EOF)) {
																					reqStreamEnd();
																				} else {
																					ev.data.delayed = true;   // Will be ocnsumed later
																					resStream.write(ev.data.valueOf(), {callback: function() {
																						reqStream.__consumeData(ev.data);
																					}});
																				};
																			});
																			reqStream.onError.attachOnce(null, reqStreamErrorCb = function(ev) {
																				reqStreamEnd(ev.error);
																			});
																			reqStream.listen();
																			mpStream.flush();
																			reqStream.flush();
																			mpStream.__consumeData(ev.data);
																		});
																	})
																	.catch(state.mpStreamEnd);
															} else {
																state.mpStreamEnd();
															};
														});
														mpStream.onError.attachOnce(null, mpStreamErrorCb = function(ev) {
															state.mpStreamEnd(ev.error);
														});
														mpStream.listen();
														mpStream.flush();
													}, this);
												});


/* CUTE, BUT SLOW
											return request.response.getStream({contentType: 'text/plain; charset=utf-8'})
												.then(function(resStream) {
													const parse = function parse(reqStream) {
														reqStream.listen();
														const promise = reqStream.onReady.promise(function(ev) {
															const data = ev.data;
															ev.preventDefault();
															if (data.raw !== io.EOF) {
																data.consumed = true;  // Will be consumed later
																return resStream.writeAsync(data.valueOf())
																	.then(function() {
																		data.consumed = false;
																		reqStream.__consumeData(data);
																		return parse(reqStream);
																	});
															};
														});
														mpStream.flush();
														reqStream.flush({count: 1});
														return promise;
													};
													const newPart = function newPart() {
														mpStream.listen();
														const promise = mpStream.onReady.promise(function(ev) {
															ev.preventDefault();
															const data = ev.data;
															if (data.raw === io.BOF) {
																return request.getStream()
																	.then(parse)
																	.then(newPart);
															};
														});
														mpStream.flush({count: 1});
														return promise;
													};
													return newPart()
														.then(function() {
															// Return nothing
														});
												});
*/
										});
								},
							},
						],
					},
					'/url': {
						verbs: ['POST'],
						handlers: [
							{
								handler: server.Http.UrlBodyHandler,
							},
							{
								handler: function(request) {
									return request.getStream()
										.then(function(input) {
											return request.response.getStream({contentType: 'text/plain; charset=utf-8'})
												.then(function(output) {
													let obj = {},
														key = null;
													input.onReady.attach(this, function(ev) {
														ev.preventDefault();
														if (ev.data.raw === io.EOF) {
															if (key) {
																obj[key] = null;
															};
															output.write(JSON.stringify(obj));
															output.write(io.EOF);
														} else {
															if (ev.data.mode === ev.data.Modes.Key) {
																key = ev.data.valueOf();
															} else if (key) {
																obj[key] = ev.data.valueOf();
																key = null;
															};
														};
													});
													input.listen();
													return input.onEOF.promise()
														.then(function(ev) {
															// Return nothing
														});
												});
										});
								},
							},
						],
					},
					'/*/hello': {
						verbs: ['GET'],
						handlers: [
							{
								handler: function(request) {
									request.response.getStream({contentType: 'text/plain; charset=utf-8'}).then(stream => stream.write("Hello !"));
								},
							},
						],
					},
					'/**/bonjour': {
						verbs: ['GET'],
						handlers: [
							{
								handler: function(request) {
									request.response.getStream({contentType: 'text/plain; charset=utf-8'}).then(stream => stream.write("Bonjour !"));
								},
							},
						],
					},
					'/app': {
						//verbs: ['GET', 'HEAD'],
						handlers: [
							{
								handler: server.Http.CrossOriginHandler, 
							},
							{
								handler: server.Http.ClientCrashHandler,
							},
							{
								handler: nodejs.Server.Http.CacheHandler,
								mimeTypes: ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8', 'text/html; charset=utf-8'],
								cachePath: options.cachePath,
								verbs: ['GET', 'HEAD'],
								//verbs: ['GET'],
							},
							{
								handler: nodejs.Server.Http.CompressionHandler,
								mimeTypes: ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8', 'text/html; charset=utf-8', 'text/css; charset=utf-8', 'application/json; charset=utf-8', 'text/json; charset=utf-8'],
								//encodings: ['gzip'],  // to force 'gzip'
								//encodings: ['deflate'],  // to force 'deflate'
							},
							{
								handler: new server.Http.Routes({
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
									'/doodad-js': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js')).set({file: null}).combine('./dist/doodad-js/', {os: 'linux'}),
												showFolders: true,
												//mimeTypes: ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8'],  // TEST FILTER ON FOLDER DISPLAY
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-dates': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-dates')).set({file: null}).combine('./dist/doodad-js-dates/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-io': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-io')).set({file: null}).combine('./dist/doodad-js-io/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-locale': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-locale')).set({file: null}).combine('./dist/doodad-js-locale/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-mime': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-mime')).set({file: null}).combine('./dist/doodad-js-mime/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-minifiers': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-minifiers')).set({file: null}).combine('./dist/doodad-js-minifiers/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-templates': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-templates')).set({file: null}).combine('./dist/doodad-js-templates/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-test': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-test')).set({file: null}).combine('./dist/doodad-js-test/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-widgets': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-widgets')).set({file: null}).combine('./dist/doodad-js-widgets/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-xml': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-xml')).set({file: null}).combine('./dist/doodad-js-xml/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-loader': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-loader')).set({file: null}).combine('./dist/doodad-js-loader/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-safeeval': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-safeeval')).set({file: null}).combine('./dist/doodad-js-safeeval/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/doodad-js-unicode': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(require.resolve('doodad-js-unicode')).set({file: null}).combine('./dist/doodad-js-unicode/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/lib/sax': saxPath && {
										handlers: [
											{
												handler: nodejs.Server.Http.JavascriptPage,
												path: saxPath,
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/lib/es6-promise': promisePath && {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: promisePath,
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/lib/moment': momentPath && {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: momentPath,
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/lib/moment-timezone': momentTzPath && {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: momentTzPath,
												showFolders: true,
												mimeTypes: staticMimeTypes,
											},
										],
									},
									'/lib/moment-timezone/data': momentTzDataPath && {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: momentTzDataPath,
												showFolders: true,
												mimeTypes: staticMimeTypes,
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
				}),
			},
		];

		function onerror(ev) {
			ev.preventDefault();
		};

		function onstatus(ev) {
			const response = ev.obj,
				status = response.status;
			if (status >= 300) {
				ev.preventDefault();
				ev.data.promise = ev.data.promise
					.then(() => response.getStream({contentType: 'text/plain', encoding: 'utf-8'}))
					.then(stream => stream.write(types.toString(status)))
					.catch(ex => {});
			};
		};

		function onrequest(ev) {
			const request = ev.data.request;
			request.onError.attach(null, onerror);
			request.response.onError.attach(null, onerror);
			request.response.onStatus.attach(null, onstatus);
		};

		const service = new nodejs.Server.Http.Server(handlers, {messenger: messenger /*, validHosts: ['www.doodad-js.local']*/});
		service.onError.attach(null, onerror);
		service.onNewRequest.attach(null, onrequest);
		service.listen({
			target: options.listeningAddress, 
			port: options.listeningPort,
		});

		const service2 = new nodejs.Server.Http.Server(handlers, {messenger: messenger /*, validHosts: ['www.doodad-js.local']*/});
		service2.onError.attach(null, onerror);
		service2.onNewRequest.attach(null, onrequest);
		service2.listen({
			protocol: 'https',
			certFile: __dirname + tools.getOS().dirChar + 'www.doodad-js.local.crt',
			keyFile: __dirname + tools.getOS().dirChar + 'www.doodad-js.local.key',
			target: options.listeningAddress, 
			port: options.listeningSSLPort,
		});
	};
	
	const DD_MODULES = {};
	require('doodad-js-widgets').add(DD_MODULES);
	require('doodad-js-mime').add(DD_MODULES);
	require('doodad-js-xml').add(DD_MODULES);
	require('doodad-js-templates').add(DD_MODULES);
	require('doodad-js-minifiers').add(DD_MODULES);
	require('doodad-js-json').add(DD_MODULES);
	require('doodad-js-http').add(DD_MODULES);
	require('doodad-js-http_jsonrpc').add(DD_MODULES);
	
	return namespaces.load(DD_MODULES, {startup: {secret: _shared.SECRET}}, startup);
};