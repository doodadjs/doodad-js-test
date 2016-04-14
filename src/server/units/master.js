//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: master.js - Test startup file for NodeJs
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

const MAX_CPUS = 4,
	cluster = require('cluster'),
	util = require('util');

module.exports = function(root, options) {
	const doodad = root.Doodad,
		namespaces = doodad.Namespaces,
		types = doodad.Types,
		tools = doodad.Tools,
		server = doodad.Server,
		nodejs = doodad.NodeJs,
		
		nodeOs = require('os'),
		Promise = types.getPromise();

	function startup() {
		const cpus = Math.min(nodeOs.cpus().length, MAX_CPUS);

		function startWorkers() {
			tools.Files.mkdir(options.jsCachePath);
			
			cluster.setupMaster({
				silent: true,
			});
			
			if (cpus > 1) {
				for (let i = 0; i < cpus; i++) {
					cluster.fork();
				};
			} else {
				options.noCluster = true;
				require('./worker.js')(root, options);
			};
		};
		
		const test = doodad.Test,
			nodejsCluster = nodejs.Cluster;
		
		const success = test.run();
		if (!success) {
			process.exit(1);
		};
		
		if (process.stdout.isTTY && process.stdin.setRawMode) {
			process.stdin.setRawMode(true);
			
			const messenger = new nodejsCluster.ClusterMessenger(server.Ipc.ServiceManager);
			messenger.connect();
			
			const term = new nodejs.Terminal.Ansi.Javascript(0, {
				infoColor: 'Green',
				warnColor: 'Yellow',
				errorColor: 'Red',
				commands: {
					stats: function() {
						if (cpus > 1) {
							const output = {};
							let count = types.keys(cluster.workers).length;
							return new Promise(function(resolve, reject) {
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
							return new Promise(function(resolve, reject) {
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
							// TODO: "types.NotAvailable" error
							throw new types.Error("Command not available.");
						};
					},
				},
			});
			term.listen();
			
			nodejs.Console.capture(function(name, args) {
				term.consoleWrite(name, args);
			});

			term.ask(tools.format('Safe to delete folder "~0~" and its content [yes/NO] ?', [options.jsCachePath.toString()]), new doodad.Callback(this, function(resp) {
				resp = resp.toLowerCase();
				if (resp === 'yes') {
					tools.Files.rmdir(options.jsCachePath, {force: true});
					console.info(tools.format('Folder "~0~" deleted.', [options.jsCachePath.toString()]));
				};
				
				startWorkers();
			}));
		} else {
			startWorkers();
		};
	};

	const DD_MODULES = {};
	
	require('doodad-js-terminal').add(DD_MODULES);
	require('doodad-js-test').add(DD_MODULES);
	require('doodad-js-test/src/common/units/index.js').add(DD_MODULES);

	namespaces.load(DD_MODULES, startup)
		['catch'](function(err) {
			console.error(err.stack);
			process.exit(1);
		});
};