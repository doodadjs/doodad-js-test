//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Class library for Javascript (BETA) with some extras (ALPHA)
// File: index.js - Test startup file for NodeJs
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015 Claude Petit
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

const DEV_MODE = (process.env.node_env === 'development'),
	cluster = require('cluster');

let root,
	namespaces;
	
function startup() {
	namespaces.removeEventListener('ready', startup);

	const doodad = root.Doodad,
		tools = doodad.Tools;
					
	const cachePath = tools.Path.parse(tools.Files.getTempFolder()).combine('/nodesjs/doodad-js/', {os: 'linux'});
	tools.Files.mkdir(cachePath, {makeParents: true});
	
	const options = {
		jsCachePath: cachePath.combine('/jsCache/', {os: 'linux'}),
	};
	
	if (cluster.isMaster) {
		require('./master.js')(root, options);
	} else {
		require('./worker.js')(root, options);
	};
};


DEV_MODE && require("../../core/Debug.js");
require("../../core/Types.js");
require("../../core/Tools.js");
require("../../core/Namespaces.js");
require("../../server/nodejs/core/NodeJs.js");
require("../../core/Doodad.js");

root = require("../../core/Bootstrap.js").createRoot(global.DD_MODULES, {startup: {settings: {enableProperties: DEV_MODE}}});

require("../../common/Tools_Locale.js");
require("../../common/Tools_Dates.js");
require("../../common/IO.js");
require("../../server/common/Server.js");
require("../../server/common/Server_Ipc.js");
require("../../server/nodejs/NodeJs_IO.js");
require("../../server/nodejs/NodeJs_Cluster.js");

namespaces = root.Doodad.Namespaces;
namespaces.addEventListener('ready', startup);
namespaces.loadNamespaces(false);




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