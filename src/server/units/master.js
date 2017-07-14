//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: master.js - Test startup file for NodeJs
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

// TODO: Make an argument
const MAX_CPUS = 4;

module.exports = function(root, options, _shared) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		modules = doodad.Modules,
		types = doodad.Types,
		tools = doodad.Tools,
		
		nodeOs = require('os'),
		nodeCluster = require('cluster'),
		nodeChildProcess = require('child_process'),
		
		Promise = types.getPromise();


	function startup() {
		const server = doodad.Server;

		const args = tools.getCurrentLocation().args,
			unitName = args.get('unit');
	
		if (unitName !== undefined) {
			return modules.load([
					/*{
						module: 'doodad-js',
						path: 'test/doodad-js_tests.js',
					},*/
					{
						module: 'doodad-js-safeeval',
						path: 'test/doodad-js-safeeval_tests.js',
					},
				], types.depthExtend(15, options, {startup: {secret: _shared.SECRET}}))
				.then(function(dummy) {
					const test = doodad.Test;
					const success = test.run({name: (unitName || test.DD_FULL_NAME)});
					if (success) {
						tools.abortScript(0);
					} else {
						tools.abortScript(1);
					};
				});

		} else {
			function startWorkers() {
				return Promise.try(function tryStartWorkers() {
					if (cpus > 1) {
						nodeCluster.setupMaster({
							silent: true,
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
						return require('./worker.js')(root, options, _shared);

					};
				});
			};

			let ready = false;

			const cpus = Math.min(nodeOs.cpus().length, MAX_CPUS);

			const nodejs = doodad.NodeJs,
				cluster = nodejs.Cluster;

			if (process.stdout.isTTY && process.stdin.setRawMode) {
				process.stdin.setRawMode(true);
			
				const messenger = new cluster.ClusterMessenger(server.Ipc.ServiceManager);
				messenger.connect();
			
				const TIMEOUT = 1000 * 60 * 2;

				const mapWorkers = function mapWorkers(result) {
					const retval = {};
					tools.forEach(result, function(workerResult, workerId) {
						retval['W:' + workerId] = workerResult;
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
						if (ready) {
							if (cpus > 1) {
								return messenger.callService('MyPrivateService', 'stats', null, {
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
									.then(mapWorkers);
							} else {
								return Promise.resolve(nodejs.Server.Http.Request.$getStats());
							};
						};
					});
			
				const actives = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(string)',
						description: "Returns the URLs of the active requests.",
					}, function() {
						if (ready) {
							if (cpus > 1) {
								return messenger.callService('MyPrivateService', 'actives', null, {
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
									.then(mapWorkers);
							} else {
								return Promise.resolve(nodejs.Server.Http.Request.$getActives());
							};
						};
					});
			
				const uptime = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(object)',
						description: "Returns server uptime.",
					}, function() {
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
									})
							} else {
								return Promise.resolve(tools.Dates.secondsToPeriod(process.uptime()));
							};
						};
					});
			
				const ping = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'arrayof(object)',
						description: "Pings each worker and returns the delays.",
					}, function() {
						if (ready) {
							if (cpus > 1) {
								return messenger.ping({
										ttl: 500, // ms
										retryDelay: 100, // ms
										timeout: TIMEOUT,
									})
									.then(mapWorkers);
							} else {
								return Promise.reject(new types.NotAvailable("Command not available."));
							};
						};
					});
			
				const browser = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params: null,
						returns: 'undefined',
						description: "Opens your favorite browser to the application's main page.",
					}, function() {
						if (ready) {
							return Promise.try(function browserPromise() { // Sets Promise's name to "browserPromise" instead of "statsPromise"
									return stats();
								})
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
												reject(new types.Error("Failed to start browser. Please manually navigate to ' ~0~ '.", [url]));
											};
										});
										child.on('error', function(err) {
											reject(new types.Error("Failed to start browser. Please manually navigate to ' ~0~ '.", [url]));
										});
									};
								});
						};
					});
			
				const run = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params:  {
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
						},
						returns: 'any',
						description: "Runs an arbitrary function on the specified worker.",
					}, function(wid, fn, /*optional*/timeout) {
						if (ready) {
							if (!types.isInteger(wid)) {
								throw new types.TypeError("Invalid worker id.");
							};
							if (!types.isCustomFunction(fn)) {
								throw new types.TypeError("Invalid function.");
							};
							if (cpus > 1) {
								return messenger.callService('MyPrivateService', 'run', [fn.toString()], {
										ttl: (types.isNothing(timeout) ? TIMEOUT : timeout), // ms
										worker: wid,
									})
									.then(function(result) {
										return result[wid];
									});
							} else {
								return Promise.reject(new types.NotAvailable("Command not available."));
							};
						};
					});

				const clearCache = root.DD_DOC(
					{
						author: "Claude Petit",
						revision: 0,
						params:  null,
						returns: 'undefined',
						description: tools.format("Clears the cache folder. Warning: Before running this command, be sure you have nothing important in that folder: '~0~'.", [options.cachePath.toString()]),
					}, function clearCache() {
						return tools.Files.rmdirAsync(options.cachePath, {force: true})
							.then(dummy => {
								console.info(tools.format('Cache folder "~0~" deleted.', [options.cachePath.toString()]));
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
						stats: stats,
						actives: actives,
						uptime: uptime,
						ping: ping,
						getAttribute: _shared.getAttribute,
						setAttribute: _shared.setAttribute,
						browser: browser,
						w: run,
						clearCache: clearCache,
					},
				});
				nodejs.Console.capture(function(name, args) {
					term.consoleWrite(name, args);
				});
				term.listen();
			};

			return startWorkers()
				.then(() => {ready = true});
		};
	};


	//const DD_MODULES = {};
	//require('doodad-js/test/tests.js').add(DD_MODULES);
	//require('doodad-js-safeeval/test/tests.js').add(DD_MODULES);
	//require('doodad-js-terminal').add(DD_MODULES);
	//require('doodad-js-test').add(DD_MODULES);

	//return namespaces.load(DD_MODULES, {startup: {secret: _shared.SECRET}}, startup);

	return modules.load([
			{
				module: 'doodad-js-cluster',
			},
			{
				module: 'doodad-js-terminal',
			},
		], types.depthExtend(15, options, {startup: {secret: _shared.SECRET}}))
			.then(startup);
};