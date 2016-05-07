//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: index.js - Test startup file for NodeJs
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

const cluster = require('cluster');

let root,
	namespaces;
	
function startup() {
	const doodad = root.Doodad,
		tools = doodad.Tools,
		files = tools.Files;
					
	const cachePath = files.Path.parse(tools.Files.getTempFolder()).combine('./nodesjs/doodad-js/', {os: 'linux'});
	tools.Files.mkdir(cachePath, {makeParents: true});
	
	const options = {
		jsCachePath: cachePath.combine('./jsCache/', {os: 'linux'}),
	};
	
	if (cluster.isMaster) {
		require('./master.js')(root, options);
	} else {
		require('./worker.js')(root, options);
	};
};

const options = {
};

const DD_MODULES = {};

require('doodad-js-unicode').add(DD_MODULES);
require('doodad-js-locale').add(DD_MODULES);
require('doodad-js-dates').add(DD_MODULES);
require('doodad-js-io').add(DD_MODULES);
require('doodad-js-server').add(DD_MODULES);
require('doodad-js-ipc').add(DD_MODULES);
require('doodad-js-cluster').add(DD_MODULES);
require('doodad-js-safeeval').add(DD_MODULES);

root = require('doodad-js').createRoot(DD_MODULES);

namespaces = root.Doodad.Namespaces;

return namespaces.load(DD_MODULES, startup, options)
		['catch'](function (err) {
			console.error(err.stack);
			process.exit(1);
		});





// RPC GET : /rpc?method=%22callService%22&params=[%22MyService%22,%22hello%22]

/* RPC POST
POST /rpc
Content-Type: application/json
Content-Length: 86

{"jsonrpc": "2.0", "method": "callService", "params": ["MyService", "hello"], "id": 1}
*/

/* RPC POST
POST /rpc
Content-Type: application/json
Content-Length: 384

[{"jsonrpc": "2.0", "method": "getService", "params": ["MyService"], "id": 1},{"jsonrpc": "2.0", "method": "callService", "params": [-1, "hello"], "id": 2},{"jsonrpc": "2.0", "method": "callService", "params": [-1, "hello"], "id": 3},{"jsonrpc": "2.0", "method": "callService", "params": [-1, "hello"], "id": 4},{"jsonrpc": "2.0", "method": "releaseService", "params": [-1], "id": 5}]
*/