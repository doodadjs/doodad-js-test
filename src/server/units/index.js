//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: index.js - Test startup file for NodeJs
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

const SECRET = Symbol();

const cluster = require('cluster');

function startup(root, _shared) {
	const doodad = root.Doodad,
		tools = doodad.Tools,
		files = tools.Files;
					
	const cachePath = files.Path.parse(tools.Files.getTempFolder()).combine('./nodesjs/doodad-js/', {os: 'linux'});
	tools.Files.mkdir(cachePath, {makeParents: true});
	
	const options = {
		cachePath: cachePath,
	};
	
	if (cluster.isMaster) {
		return require('./master.js')(root, options, _shared);
	} else {
		return require('./worker.js')(root, options, _shared);
	};
};

const options = {
	secret: SECRET,
//	startup: {fromSource: true},
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

const root = require('doodad-js').createRoot(DD_MODULES, options);

root.Doodad.Types.trapUnhandledRejections();

root.Doodad.Namespaces.load(DD_MODULES, startup, options)
		['catch'](function(err) {
			err && !err.trapped && console.error(err.stack);
			if (!process.exitCode) {
				process.exitCode = 1;
			};
		});


/* Cross-Origin (simple request) : Should return an index file with appropriated headers
GET /app/doodad-js-test/ HTTP/1.0
Content-Type: text/html
User-Agent: HTTPTool/1.0
Origin: www.test.local
Host: www.doodad-js.local

*/

/* Cross-Origin (full request) : Should return appropriated headers, without content
OPTIONS /app/doodad-js-test/ HTTP/1.0
Content-Type: text/html
User-Agent: HTTPTool/1.0
Origin: www.test.local
Access-Control-Request-Method: GET
Host: www.doodad-js.local

*/

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

/* Should return the content and headers. Request should not be aborted or stalled.
GET /app/doodad-js/common/Doodad.js HTTP/1.0
Accept: application/javascript

*/

/* CacheHandler: First request should generate the cache file and send headers and result. Subsequent requests should send the file and its headers from cache. In both case, content should be minified.
GET /app/lib/sax/sax.js HTTP/1.0
Accept: application/javascript

*/

/* CacheHandler: First request should generate the cache file and send headers and result compressed. Subsequent requests should send the file and its headers from cache. In both case, content should be minified.
GET /app/lib/sax/sax.js HTTP/1.0
Accept: application/javascript
Accept-Encoding: gzip

*/

/* Should send the headers only
HEAD /app/lib/sax/sax.js HTTP/1.0
Accept: application/javascript

*/

/* Should return folder's content in JSON
GET /app/doodad-js-locale/locales/ HTTP/1.0
Accept: application/json

*/

/* Should return folder's content in JSON compressed
GET /app/doodad-js-locale/locales/ HTTP/1.0
Accept: application/json
Accept-Encoding: gzip

*/