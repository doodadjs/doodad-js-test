//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: worker.js - Test startup file for NodeJs
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2018 Claude Petit
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
		types = doodad.Types,
		tools = doodad.Tools,
		modules = doodad.Modules,

		nodeCluster = require('cluster'),
		nodeFs = require('fs');

	function startup() {
		const files = tools.Files,
			io = doodad.IO,
			ioInterfaces = io.Interfaces,
			ioMixIns = io.MixIns,
			server = doodad.Server,
			nodejs = doodad.NodeJs;

		let messenger = null;
		if (!options.noCluster) {
			messenger = new nodejs.Cluster.ClusterMessenger(server.Ipc.ServiceManager);
			messenger.connect();

			const con = messenger.getInterface(ioInterfaces.IConsole);

			// Captures "console.XXX()"
			nodejs.Console.capture(function(fn, args) {
				con[fn].call(con, '<W:' + nodeCluster.worker.id + '>  ' + args[0]);
			});

			// Captures "tools.log()"
			_shared.consoleHook = function consoleHook(level, message) {
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
				con[fn].call(con, '<W:' + nodeCluster.worker.id + '>  ' + message);
			};

			root.REGISTER(doodad.Object.$extend(
							server.Ipc.MixIns.Service,
			{
				$TYPE_NAME: 'MyPrivateService',
			
				stats: server.Ipc.CALLABLE(function stats(request) {
					return nodejs.Server.Http.Request.$getStats();
				}),

				actives: server.Ipc.CALLABLE(function actives(request) {
					return nodejs.Server.Http.Request.$getActives();
				}),

				uptime: server.Ipc.CALLABLE(function uptime(request) {
					return tools.Dates.secondsToPeriod(process.uptime());
				}),

				run: server.Ipc.CALLABLE(function run(request, fnStr) {
					const fn = tools.SafeEval.eval(fnStr, null, null, {
						allowFunctions: true, 
						allowNew: true,
					});
					return fn(root);
				}),
			}));

			root.REGISTER(doodad.Object.$extend(
							server.Http.JsonRpc.MixIns.Service,
			{
				$TYPE_NAME: 'MyService',
			
				hello: server.Ipc.CALLABLE(function hello(request) {
					return "Hello world !";
				}),
			}));
		};

		const currentPath = files.Path.parse(__dirname);
		
		let saxPath;
		try {
			saxPath = files.Path.parse(modules.resolve('sax/package.json'))
				.set({file: ''})
				.combine('./lib/', {os: 'linux'});
			nodeFs.statSync(saxPath.toString());
		} catch(ex) {
			console.warn("The library 'sax' is not available. Some features, like page templates, will be disabled.");
		};
		
		let momentPath;
		try {
			momentPath = files.Path.parse(modules.resolve('moment/package.json'))
				.set({file: ''})
				.combine('./min/', {os: 'linux'});
			nodeFs.statSync(momentPath.toString());
		} catch(ex) {
			console.warn("The library 'moment' is not available. Serving the library to the client browser will be disabled.");
		};

		let momentTzPath;
		try {
			momentTzPath = files.Path.parse(modules.resolve('moment-timezone/package.json'))
				.set({file: ''})
				.combine('./builds/', {os: 'linux'});
			nodeFs.statSync(momentTzPath.toString());
		} catch(ex) {
			console.warn("The library 'moment-timezone' is not available. Serving the library to the client browser will be disabled.");
		};

		let momentTzDataPath;
		try {
			momentTzDataPath = files.Path.parse(modules.resolve('moment-timezone/package.json'))
				.set({file: ''})
				.combine('./data/packed/', {os: 'linux'});
			nodeFs.statSync(momentTzPath.toString());
		} catch(ex) {
			console.warn("The data of the library 'moment-timezone' are not available. Serving the library's data to the client browser will be disabled.");
		};

		const staticMimeTypes = ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8', 'text/html; charset=utf-8', 'text/css; charset=utf-8', 'application/json; charset=utf-8', 'text/json; charset=utf-8', 'application/xml; charset=utf-8', 'text/xml; charset=utf-8', '*/*'];

		const forceCaseSensitive = !tools.getOS().caseSensitive;

		const staticVariables = {
			modulesUri: "../../..",
			momentDataUri: "/app/lib/moment-timezone/data/",
		};

		const handlers = [
			{
				handler: server.Http.ContentSecurityPolicyHandler,
				policy: "default-src 'self' 'unsafe-eval' 'unsafe-inline';",
				mimeTypes: ['text/html'],
			},
			//{
			//	handler: server.Http.ContentSecurityPolicyReportHandler,
			//},
			//{
			//	handler: server.Http.UpgradeInsecureRequestsHandler,
			//	sslPort: 8181,
			//	hstsSafe: true,
			//},
			{
				handler: nodejs.Server.Http.ClusterDataHandler,
				messenger: messenger,
			},
			{
				caseSensitive: true,

				handler: new server.Http.Routes({
					'/': {
						handlers: [
							{
								handler: server.Http.RedirectHandler,
								targetUrl: '/app/@doodad-js/test/units/index.ddtx',
							},
						],
					},
					'/form?id=(\\d{1,4})&mode=(view|edit)': {
						verbs: ['GET','HEAD'],
						handlers: [
							{
								handler: function(request) {
									const handlerState = request.getHandlerState(),
										args = handlerState.matcherResult.queryArgs;
									return request.response.getStream({contentType: 'text/plain', encoding: 'utf-8'}).then(function(stream) {
											if (request.verb !== 'HEAD') {
												return stream.writeAsync((args.mode === 'edit' ? "Editing" : "Viewing") + " id " + args.id);
											};
										})
										.then(function(dummy) {});
								},
							},
						],
					},
					'/form/mode:(view|edit)/id:(\\d{1,4})': {
						verbs: ['GET','HEAD'],
						handlers: [
							{
								handler: function(request) {
									const handlerState = request.getHandlerState(),
										args = handlerState.matcherResult.urlArgs;
									return request.response.getStream({contentType: 'text/plain', encoding: 'utf-8'}).then(function(stream) {
											if (request.verb !== 'HEAD') {
												return stream.writeAsync((args.mode === 'edit' ? "Editing" : "Viewing") + " id " + args.id);
											};
										})
										.then(function(dummy) {});
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
								service: server.Http.JsonRpc.ServiceManager,
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
									return request.response.getStream({contentType: 'text/plain; charset=utf-8'})
										.then(function(resStream) {
											return request.getStream()
												.then(function(mpStream) {
													const state = {eof: true};
													const promise = mpStream.onData.promise(function mpOnData(ev) {
														if (ev.data.raw === io.BOF) {
															ev.preventDefault();
															mpStream.setOptions({flushMode: 'manual', bufferSize: 1024});
															request.getStream()
																.then(function(reqStream) {
																	state.eof = false;
																	reqStream.onData.promise(function reqOnData(ev) {
																		ev.preventDefault();
																		mpStream.setOptions({flushMode: 'auto', bufferSize: 1});
																		if (ev.data.raw === io.EOF) {
																			state.eof = true;
																			mpStream.flush();
																		} else {
																			resStream.write(ev.data.valueOf());
																			mpStream.flush();
																			return false;
																		};
																	});
																	mpStream.flush();
																});
															mpStream.flush();
															return false;
														} else if (state.eof && (ev.data.raw === io.EOF)) {
															ev.preventDefault();
														} else {
															mpStream.flush();
															return false;
														};
													})
													mpStream.flush();
													return promise;
												});
										})
										.then(function(dummy) {
											// Returns nothing
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
									return request.response.getStream({contentType: 'text/plain; charset=utf-8'})
										.then(function(resStream) {
											return request.getStream()
												.then(function(reqStream) {
													let obj = {},
														key = null;
													return reqStream.onData.promise(function reqOnData(ev) {
														ev.preventDefault();
														if (ev.data.raw === io.EOF) {
															if (key) {
																obj[key] = null;
															};
															resStream.write(JSON.stringify(obj));
															resStream.write(io.EOF);
														} else {
															if (ev.data.raw.mode === ev.data.raw.Modes.Key) {
																key = ev.data.raw.text;
															} else if (key) {
																obj[key] = ev.data.raw.text;
																key = null;
															};
															return false;
														};
													});
												});
										})
										.then(function(dummy) {
											// Returns nothing
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
									request.response.getStream({contentType: 'text/plain; charset=utf-8'})
										.then(function(stream) {return stream.writeAsync("Hello !")})
										.then(function(dummy) {});
								},
							},
						],
					},
					'/**/bonjour': {
						verbs: ['GET'],
						handlers: [
							{
								handler: function(request) {
									request.response.getStream({contentType: 'text/plain; charset=utf-8'})
										.then(function(stream) {return stream.writeAsync("Bonjour !")})
										.then(function(dummy) {});
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
									'/@doodad-js/test/widgets': {
										handlers: [
											{
												handler: server.Http.RedirectHandler,
												targetUrl: 'index.ddtx',
											}
										],
									},
									'/@doodad-js/test/units': {
										handlers: [
											{
												handler: server.Http.RedirectHandler,
												targetUrl: 'index.ddtx',
											},
										],
									},
									'/@doodad-js/test/browserify': {
										handlers: [
											{
												handler: server.Http.RedirectHandler,
												targetUrl: 'index.ddtx',
											},
										],
									},
									'/@doodad-js/test/webpack': {
										handlers: [
											{
												handler: server.Http.RedirectHandler,
												targetUrl: 'index.ddtx',
											},
										],
									},
									'/@doodad-js/core': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/core')).set({file: null}).combine('./dist/@doodad-js/core/', {os: 'linux'}),
												showFolders: true,
												//mimeTypes: ['application/javascript; charset=utf-8', 'application/x-javascript; charset=utf-8'],  // TEST FILTER ON FOLDER DISPLAY
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/dates': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/dates')).set({file: null}).combine('./dist/@doodad-js/dates/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/io': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/io')).set({file: null}).combine('./dist/@doodad-js/io/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/locale': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/locale')).set({file: null}).combine('./dist/@doodad-js/locale/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/mime': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/mime')).set({file: null}).combine('./dist/@doodad-js/mime/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/minifiers': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/minifiers')).set({file: null}).combine('./dist/@doodad-js/minifiers/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/templates': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/templates')).set({file: null}).combine('./dist/@doodad-js/templates/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/templates/Boot.min.js': {
										handlers: [
											{
												handler: nodejs.Server.Http.JavascriptPage,
												path: files.Path.parse(modules.resolve('@doodad-js/templates')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/res/js/Boot.templ.js' : './build/server/res/js/Boot.templ.js'), {os: 'linux'}),
												showFolders: false,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												runDirectives: true,
											},
										],
									},
									'/@doodad-js/test': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine('./dist/@doodad-js/test/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/test/units/index.ddtx': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												// TODO: Auto-build
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/units/pages/Test_Pages_Units_Index.ddt' : './build/server/units/pages/Test_Pages_Units_Index.ddtx'), {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/test/widgets/index.ddtx': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												// TODO: Auto-build
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/widgets/pages/Test_Pages_Widgets_Index.ddt' : './build/server/widgets/pages/Test_Pages_Widgets_Index.ddtx'), {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/test/widgets/crossRealm.ddtx': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												// TODO: Auto-build
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/widgets/pages/Test_Pages_Widgets_CrossRealm.ddt' : './build/server/widgets/pages/Test_Pages_Widgets_CrossRealm.ddtx'), {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/test/browserify/index.ddtx': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												// TODO: Auto-build
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/browserify/pages/Test_Pages_Browserify_Index.ddt' : './build/server/browserify/pages/Test_Pages_Browserify_Index.ddtx'), {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/test/webpack/index.ddtx': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												// TODO: Auto-build
												path: files.Path.parse(modules.resolve('@doodad-js/test')).set({file: null}).combine((root.getOptions().fromSource ? './src/server/webpack/pages/Test_Pages_Webpack_Index.ddt' : './build/server/webpack/pages/Test_Pages_Webpack_Index.ddtx'), {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/widgets': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/widgets')).set({file: null}).combine('./dist/@doodad-js/widgets/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/xml': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/xml')).set({file: null}).combine('./dist/@doodad-js/xml/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/loader': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/loader')).set({file: null}).combine('./dist/@doodad-js/loader/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/safeeval': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/safeeval')).set({file: null}).combine('./dist/@doodad-js/safeeval/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
											},
										],
									},
									'/@doodad-js/unicode': {
										handlers: [
											{
												handler: nodejs.Server.Http.StaticPage,
												path: files.Path.parse(modules.resolve('@doodad-js/unicode')).set({file: null}).combine('./dist/@doodad-js/unicode/', {os: 'linux'}),
												showFolders: true,
												mimeTypes: staticMimeTypes,
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
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
												forceCaseSensitive: forceCaseSensitive,
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
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
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
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
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
												forceCaseSensitive: forceCaseSensitive,
												variables: staticVariables,
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
			if (!ev.error.trapped) {
				ev.preventDefault();
				console.error(ev.error);
			};
		};

		function onstatus(ev) {
			// TODO: Real status page
			const response = ev.obj,
				status = response.status;
			if (/*root.getOptions().debug &&*/ (status >= 500)) {
				if (response.statusData) {
					console.error('HTTP ' + status + ': ' + response.statusData.stack);
				} else {
					console.error('HTTP ' + status + ': No error information.');
				};
			};
			if (status >= 300) {
				ev.preventDefault();
				ev.data.promise = ev.data.promise
					.then(function(dummy) {return response.getStream({contentType: 'text/plain', encoding: 'utf-8'})})
					.then(function(stream) {return stream.writeAsync(types.toString(status))})
					.then(function(dummy) {})
					.catch(function(ex) {
						if (root.getOptions().debug) {
							console.error(ex);
						};
					});
			};
		};

		function onrequest(ev) {
			const request = ev.data.request;
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
			certFile: currentPath.combine('www.doodad-js.local.crt'),
			keyFile: currentPath.combine('www.doodad-js.local.key'),
			target: options.listeningAddress, 
			port: options.listeningSSLPort,
		});
	};
	
	return modules.load([
			{
				module: '@doodad-js/cluster',
			},
			{
				module: '@doodad-js/http_jsonrpc',
			},
		], tools.depthExtend(15, options, {startup: {secret: _shared.SECRET}}))
			.then(startup);
};