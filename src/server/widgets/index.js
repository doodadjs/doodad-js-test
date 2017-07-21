//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: index.js - Test startup file for NodeJs
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

const SECRET = Symbol();

const fs = require('fs'),
	app_module_path = require('app-module-path');

function addSearchPaths(root) {
	const doodad = root.Doodad,
		tools = doodad.Tools,
		files = tools.Files;

	// Add Node packages search paths for the application
	const paths = require.main.paths;
	for (let i = 0; i < paths.length; i++) {
		const path = files.Path.parse(paths[i], {file: ''});

		let folders = null;

		// Get the list of packages in that "node_modules" folder
		try {
			folders = files.readdir(path, {depth: 0});
		} catch(ex) {
			if (ex.code !== 'ENOENT') {
				throw ex;
			};
		};

		if (folders) {
			// Application (doodad-js-test) packages folder found.
			
			let name;

			// Include the "node_modules" folder of these packages in the search path.
			for (let j = 0; j < folders.length; j++) {
				const folder = folders[j];
				if (!folder.isFile) {
					name = folder.path.combine('node_modules').toString();
					try {
						fs.statSync(name);
						app_module_path.addPath(name);
					} catch(ex) {
						if (ex.code !== 'ENOENT') {
							throw ex;
						};
					};
				};
			};
			
			// Include application (doodad-js-test) folder as a package.
			name = path.moveUp(2).toString();
			fs.statSync(name);
			app_module_path.addPath(name);
			
			// We should have all the search paths we need.
			break;
		};
	};
};
			
function startup(root, _shared) {
	const doodad = root.Doodad,
		//namespaces = doodad.Namespaces,
		modules = doodad.Modules;
					
	addSearchPaths(root);
	
	//const DD_MODULES = {};
	//require("../../common/widgets/MyWidget_loader.js").add(DD_MODULES);

	//return namespaces.load(DD_MODULES, {startup: {secret: _shared.SECRET}});

	return modules.load([
			{
				module: 'doodad-js-test',
				// TODO: Auto-Load from "src" or "build".
				path: (root.getOptions().fromSource ? 'src/common/widgets/MyWidget_loader.js' : 'build/widgets/MyWidget_loader.js'),
			},
		], {startup: {secret: _shared.SECRET}});
};

const options = {
	startup: {secret: SECRET},
};

//const DD_MODULES = {};
//require('doodad-js-unicode').add(DD_MODULES);
//require('doodad-js-locale').add(DD_MODULES);
//require('doodad-js-safeeval').add(DD_MODULES);
//require('doodad-js-loader').add(DD_MODULES);

//require('doodad-js').createRoot(DD_MODULES, options, startup);

require('doodad-js').createRoot(null, options, startup);