//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: master.js - Test startup file for NodeJs
// Project home: https://github.com/doodadjs/
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

const MAX_CPUS = 4;

module.exports = function(root, options, _shared) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		types = doodad.Types,
		tools = doodad.Tools,
		server = doodad.Server,
		nodejs = doodad.NodeJs,
		
		nodeOs = require('os'),
		cluster = require('cluster'),
		util = require('util'),
		
		Promise = types.getPromise();


	function startup() {
		const cpus = Math.min(nodeOs.cpus().length, MAX_CPUS);

		function startWorkers() {
			tools.Files.mkdir(options.cachePath);
			
			cluster.setupMaster({
				silent: true,
			});
			
			if (cpus > 1) {
				for (let i = 0; i < cpus; i++) {
					cluster.fork();
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
			const nodejsCluster = nodejs.Cluster;

			if (process.stdout.isTTY && process.stdin.setRawMode) {
				process.stdin.setRawMode(true);
			
				const messenger = new nodejsCluster.ClusterMessenger(server.Ipc.ServiceManager);
				messenger.connect();
			
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
					},
					commands: {
						stats: function() {
							if (cpus > 1) {
								const output = {};
								let count = types.keys(cluster.workers).length;
								return Promise.create(function statsPromise(resolve, reject) {
									const timeId = setTimeout(function() {
										reject(output);
									}, 1000 * 60 * 2);
									messenger.callService('MyService', 'stats', null, {
										callback: function(err, result, worker) {
											output['W:' + worker.id] = err || result;
											count--;
											if (count === 0) {
												clearTimeout(timeId);
												resolve(output);
											};
										},
									});
								});
							} else {
								return nodejs.Server.Http.Request.$getStats();
							};
						},
						ping: function() {
							if (cpus > 1) {
								const output = {};
								let count = types.keys(cluster.workers).length;
								return Promise.create(function pingPromise(resolve, reject) {
									const timeId = setTimeout(function() {
										reject(output);
									}, 1000 * 60 * 2);
									messenger.ping({
										callback: function(err, result, worker) {
											output['W:' + worker.id] = err || result;
											count--;
											if (count === 0) {
												clearTimeout(timeId);
												resolve(output);
											};
										},
									});
								});
							} else {
								throw new types.NotAvailable("Command not available.");
							};
						},
						getAttribute: _shared.getAttribute,
						setAttribute: _shared.setAttribute,
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