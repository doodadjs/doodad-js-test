//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
	// doodad-js - Object-oriented programming framework
	// File: master.js - Test startup file for NodeJs
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

/* eslint no-console: "off" */

const nodeOs = require('os'),
	nodeCluster = require('cluster'),
	nodeChildProcess = require('child_process'),
	nodeUtil = require('util');

module.exports = function(root, options, _shared) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		modules = doodad.Modules,
		types = doodad.Types,
		tools = doodad.Tools,

		Promise = types.getPromise();


	const startup = function _startup() {
		const server = doodad.Server;

		const location = tools.getCurrentLocation(),
			maxCpus = types.toInteger(location.getArg('cpus', true) || process.env.NODE_CPUS) || 4,
			unitName = location.getArg('unit', true),
			toolsOptions = tools.getOptions();

		if (unitName !== undefined) {
			return modules.load([
				/*{
						module: '@doodad-js/core',
						path: 'test/test_package.js',
					},*/
				{
					module: '@doodad-js/safeeval',
				},
				{
					module: '@doodad-js/safeeval',
					path: 'test/safeeval_test.js',
				},
			], tools.depthExtend(15, options, {startup: {secret: _shared.SECRET}}))
				.then(function(dummy) {
					const test = doodad.Test;
					if (toolsOptions.logLevel > tools.LogLevels.Info) {
						test.setOutput(new doodad.IO.NullTextOutputStream());
					};
					return test.run({name: (unitName || test.DD_FULL_NAME)})
						.then(function(success) {
							if (success) {
								tools.abortScript(0);
							} else {
								tools.abortScript(1);
							};
						});
				});

		} else {
			const cpus = Math.min(nodeOs.cpus().length, maxCpus);

			const startWorkers = function _startWorkers() {
				return Promise.try(function tryStartWorkers() {
					if (cpus > 1) {
						nodeCluster.setupMaster({
							silent: true, // TODO: Find a way to be non-silent on errors only !
						});

						nodeCluster.on('exit', (worker, code, signal) => {
							if (!signal) {
								nodeCluster.fork();
							};
						});

						for (let i = 0; i < cpus; i++) {
							nodeCluster.fork();
						};

					} else {
						options.noCluster = true;
						/* eslint global-require: "off" */
						return require('./worker.js')(root, options, _shared);

					};

					return undefined;
				});
			};

			let ready = false;

			const nodejs = doodad.NodeJs;

			if (process.stdout.isTTY && process.stdin.setRawMode) {
				process.stdin.setRawMode(true);

				const inspectSymbol = nodejs.getCustomInspectSymbol();

				const messenger = new nodejs.Cluster.ClusterMessenger(server.Ipc.ServiceManager);
				messenger.connect();

				const TIMEOUT = 1000 * 60 * 2;

				const mapWorkers = function mapWorkers(result) {
					const retval = {};
					tools.forEach(result, function(workerResult, workerId) {
						retval['W:' + workerId] = {
							[inspectSymbol]: function(depth, options) {
								return nodeUtil.inspect(workerResult, tools.extend(options, {depth: 1}));
							}
						};
					});
					return retval;
				};

				const stats = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(object)',
						description: "Returns server statistics.",
					}, function() {
						return Promise.try(function statsPromise() {
							if (ready) {
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'stats', null, {
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
										.then(mapWorkers);
								} else {
									return nodejs.Server.Http.Request.$getStats();
								};
							};
							return undefined;
						});
					});

				const actives = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(string)',
						description: "Returns the URLs of the active requests.",
					}, function() {
						return Promise.try(function activesPromise() {
							if (ready) {
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'actives', null, {
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
										.then(mapWorkers);
								} else {
									return nodejs.Server.Http.Request.$getActives();
								};
							};
							return undefined;
						});
					});

				const uptime = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(object)',
						description: "Returns server uptime.",
					}, function() {
						return Promise.try(function uptimePromise() {
							if (ready) {
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'uptime', null, {
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
										.then(mapWorkers)
										.then(function(result) {
											result['M:1'] = tools.Dates.secondsToPeriod(process.uptime());
											return result;
										});
								} else {
									return tools.Dates.secondsToPeriod(process.uptime());
								};
							};
							return undefined;
						});
					});

				const ping = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(object)',
						description: "Pings each worker and returns the delays.",
					}, function() {
						return Promise.try(function pingPromise() {
							if (ready) {
								if (cpus > 1) {
									return messenger.ping({
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
										.then(mapWorkers);
								} else {
									throw new types.NotAvailable("Command not available.");
								};
							};
							return undefined;
						});
					});

				const browser = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'undefined',
						description: "Opens your favorite browser to the application's main page.",
					}, function() {
						return Promise.try(function browserPromise() {
							if (ready) {
								return stats()
									.thenCreate(function launchBrowser(result, resolve, reject) {
										let url = "http://";
										url += (options.listeningAddress === '0.0.0.0' ? '127.0.0.1' : options.listeningAddress);
										url += ':' + options.listeningPort;
										url += '/';
										const os = tools.getOS();
										// Reference: http://www.dwheeler.com/essays/open-files-urls.html
										let child = null;
										if (os.name === 'win32') {
											child = nodeChildProcess.spawn("start", [url], {shell: true});
										} else if (os.name === 'darwin') {
											child = nodeChildProcess.spawn("open", [url]);
										} else {
											child = nodeChildProcess.spawn("xdg-open", [url]);
										};
										if (child) {
											child.on('exit', function(code, signal) {
												if (code === 0) {
													resolve();
												} else {
													throw new types.Error("Failed to start browser. Please manually navigate to ' ~0~ '.", [url]);
												};
											});
											child.on('error', function(err) {
												throw new types.Error("Failed to start browser. Please manually navigate to ' ~0~ '.", [url]);
											});
										};
									});
							};
							return undefined;
						});
					});

				// NOTE: Experimental
				const run = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 1,
						params: {
							wid: {
								type: 'integer',
								optional: false,
								description: "Worker ID",
							},
							fn: {
								type: 'function',
								optional: false,
								description: "Function to run on the worker. That function receives 'root' as its first argument.",
							},
							timeout: {
								type: 'integer',
								optional: true,
								description: "Timeout in milliseconds.",
							},
						},
						returns: 'any',
						description: "<EXPERIMENTAL> Runs an arbitrary function on the specified worker.",
					}, function(wid, fn, /*optional*/timeout) {
						return Promise.try(function runPromise() {
							if (ready) {
								if (!types.isInteger(wid)) {
									throw new types.ValueError("Invalid worker id.");
								};
								if (!types.isCustomFunction(fn)) {
									throw new types.ValueError("Invalid function.");
								};
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'run', [fn.toString()], {
										ttl: (types.isNothing(timeout) ? TIMEOUT : timeout), // ms
										worker: wid,
									})
										.then(function(result) {
											const retVal = result[wid];
											if (types._instanceof(retVal, root.MyTask)) {
												console.log(`New task created. To cancel, please run : cancel(${tools.toSource(wid)}, ${tools.toSource(retVal.id)})`);
												return undefined;
											};
											return retVal;
										});
								} else {
									throw new types.NotAvailable("Command not available.");
								};
							};
							return undefined;
						});
					});

				// NOTE: Experimental
				const cancel = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: {
							wid: {
								type: 'integer',
								optional: false,
								description: "Worker ID",
							},
							taskId: {
								type: 'string',
								optional: false,
								description: "ID of the task to cancel.",
							},
							reason: {
								type: 'Error',
								optional: true,
								description: "Reason.",
							},
						},
						returns: 'any',
						description: "<EXPERIMENTAL> Cancels a task.",
					}, function(wid, taskId, /*optional*/reason) {
						return Promise.try(function cancelPromise() {
							if (ready) {
								if (!types.isInteger(wid)) {
									throw new types.ValueError("Invalid worker id.");
								};
								if (!types.isStringAndNotEmpty(taskId)) {
									throw new types.ValueError("Invalid task id.");
								};
								if (!types.isNothing(reason) && !types.isError(reason)) {
									throw new types.ValueError("Invalid reason.");
								};
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'cancel', [taskId], {
										worker: wid,
									})
										.then(function(result) {
											return result[wid];
										});
								} else {
									throw new types.NotAvailable("Command not available.");
								};
							};
							return undefined;
						});
					});

				const clearCache = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'undefined',
						description: tools.format('Clears the cache folder. Warning: Before running this command, be sure you have nothing important in that folder: "~0~".', [options.cachePath.toString()]),
					}, function clearCache() {
						// TODO: Abort and invalidate all cached objects before, and have an argument to delete the folder.
						return Promise.try(function clearCachePromise() {
							return tools.Files.rmdirAsync(options.cachePath, {force: true})
								.then((dummy) => {
									console.info(tools.format('Cache folder "~0~" deleted.', [options.cachePath.toString()]));
								});
						});
					});

				const expire = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: {
							name: 'keyHash',
							type: 'string',
							description: "Key hash.",
						},
						returns: 'undefined',
						description: "Expires the specified cached object by its key hash.",
					}, function expire(/*optional*/keyHash) {
						// TODO: Abort and invalidate all cached objects before, and have an argument to delete the folder.
						return Promise.try(function expirePromise() {
							if (ready) {
								if (cpus > 1) {
									return messenger.callService('MyPrivateService', 'expireCached', [keyHash])
										.then(mapWorkers);
								} else {
									return nodejs.Server.Http.CacheHandler.$expire(keyHash);
								};
							};
							return undefined;
						});
					});

				const term = new nodejs.Terminal.Ansi.Javascript(0, {
					infoColor: 'Green',
					warnColor: 'Yellow',
					errorColor: 'Red',
					restricted: false,
					locals: {
						root: root,
						doodad: doodad,
						types: types,
						tools: tools,
						namespaces: namespaces,
						io: doodad.IO,
						nodejs: doodad.NodeJs,
						Promise: Promise,
					},
					commands: {
						stats,
						actives,
						uptime,
						ping,
						browser,
						run,
						cancel,
						clearCache,
						expire,
					},
				});

				nodejs.Console.capture(function(name, args) {
					const msg = tools.reduce(args, function(result, val) {
						return result + ' ' + nodeUtil.format(val);
					}, '');
					term.consoleWrite(name, [msg.slice(1)]);
				});

				term.listen();

				// NOTE: Experimental
				// TODO: Make an official service for Tasks
				root.REGISTER(doodad.Object.$extend(
					server.Ipc.MixIns.Service,
					{
						$TYPE_NAME: 'MyServerService',

						sendResult: server.Ipc.CALLABLE(function sendResult(request, taskId, result) {
							// TODO: Change "terminal" to make a "printAsyncResult" available
							const ansi = nodeUtil.inspect(result, {colors: true});
							term.consoleWrite('log', [`<W:${request.msg.worker.id} TASK:${tools.toSource(taskId)}> ${ansi}`], {callback: doodad.AsyncCallback(null, function(err) {
								if (!err) {
									term.refresh();
								};
							})});
						}),
					}));
			};

			return startWorkers()
				.then(() => {
					ready = true;
				});
		};
	};

	return modules.load([
		{
			module: '@doodad-js/http',
		},
		{
			module: '@doodad-js/cluster',
		},
		{
			module: '@doodad-js/terminal',
		},
	], [options, {startup: {secret: _shared.SECRET}}])
		.then(startup)
		.catch(function(err) {
			if (!err.bubble) {
				console.error(err.stack);
			};
		});
};
