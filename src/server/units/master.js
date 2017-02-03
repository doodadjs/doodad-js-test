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

const MAX_CPUS = 4;

module.exports = function(root, options, _shared) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		types = doodad.Types,
		tools = doodad.Tools,
		server = doodad.Server,
		nodejs = doodad.NodeJs,
		
		nodeOs = require('os'),
		nodeCluster = require('cluster'),
		util = require('util'),
		child_process = require('child_process'),
		
		Promise = types.getPromise();


	function startup() {
		const cpus = Math.min(nodeOs.cpus().length, MAX_CPUS);

		function startWorkers() {
			tools.Files.mkdir(options.cachePath);
			
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
				require('./worker.js')(root, options, _shared);

			};
		};
		
		const test = doodad.Test,
			args = tools.getCurrentLocation().args,
			unitName = args.get('unit');
	
		if (unitName !== undefined) {
			const success = test.run({name: (unitName || test.DD_FULL_NAME)});
			if (success) {
				tools.abortScript(0);
			} else {
				tools.abortScript(1);
			};
		} else {
			const cluster = nodejs.Cluster;

			if (process.stdout.isTTY && process.stdin.setRawMode) {
				process.stdin.setRawMode(true);
			
				const messenger = new cluster.ClusterMessenger(server.Ipc.ServiceManager);
				messenger.connect();
			
				const stats = function() {
					if (cpus > 1) {
						const TIMEOUT = 1000 * 60 * 2;
						const output = {};
						let count = types.keys(nodeCluster.workers).length;
						return Promise.create(function statsPromise(resolve, reject) {
							let retval;
							const timeId = setTimeout(function() {
								messenger.cancel(retval);
								count = 0;
								reject(output);
							}, TIMEOUT);
							retval = messenger.callService('MyService', 'stats', null, {
								ttl: 500, // ms
								retryDelay: 100, // ms
								callback: function(err, result, worker) {
									if (count > 0) {
										output['W:' + worker.id] = err || result;
										count--;
										if (count === 0) {
											clearTimeout(timeId);
											resolve(output);
										};
									};
								},
							});
						});
					} else {
						return Promise.resolve(nodejs.Server.Http.Request.$getStats());
					};
				};
			
				const ping = function() {
					if (cpus > 1) {
						const TIMEOUT = 1000 * 60 * 2;
						const output = {};
						let count = types.keys(nodeCluster.workers).length;
						return Promise.create(function pingPromise(resolve, reject) {
							let retval;
							const timeId = setTimeout(function() {
								messenger.cancel(retval);
								count = 0;
								reject(output);
							}, TIMEOUT);
							retval = messenger.ping({
								ttl: 500, // ms
								retryDelay: 100, // ms
								callback: function(err, result, worker) {
									if (count > 0) {
										output['W:' + worker.id] = err || result;
										count--;
										if (count === 0) {
											clearTimeout(timeId);
											resolve(output);
										};
									};
								},
							});
						});
					} else {
						return Promise.reject(new types.NotAvailable("Command not available."));
					};
				};
			
				const browser = function() {
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
								child = child_process.spawn("start", [url], {shell: true});
							} else if (os.name === 'darwin') {
								child = child_process.spawn("open", [url]);
							} else {
								child = child_process.spawn("xdg-open", [url]);
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
					},
					commands: {
						stats: stats,
						ping: ping,
						getAttribute: _shared.getAttribute,
						setAttribute: _shared.setAttribute,
						browser: browser,
					},
				});
				term.onListen.attachOnce(null, function(ev) {
					term.ask(tools.format('Safe to delete folder "~0~" and its content [yes/NO] ?', [options.cachePath.toString()]), function(resp) {
						resp = resp.toLowerCase();
						if (resp === 'yes') {
							tools.Files.rmdir(options.cachePath, {force: true});
							console.info(tools.format('Folder "~0~" deleted.', [options.cachePath.toString()]));
						};
					
						startWorkers();
					});
				});
				nodejs.Console.capture(function(name, args) {
					term.consoleWrite(name, args);
				});
				term.listen();
			} else {
				startWorkers();
			};
		};
	};

	const DD_MODULES = {};
	require('doodad-js/test/tests.js').add(DD_MODULES);
	require('doodad-js-safeeval/test/tests.js').add(DD_MODULES);
	require('doodad-js-terminal').add(DD_MODULES);
	require('doodad-js-test').add(DD_MODULES);

	return namespaces.load(DD_MODULES, {startup: {secret: _shared.SECRET}}, startup);
};