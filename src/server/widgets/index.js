//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: index.js - Test startup file for NodeJs
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

const SECRET = Symbol("SECRET");

const nodeFs = require('fs');

const addSearchPaths = function _addSearchPaths(root) {
	const doodad = root.Doodad,
		tools = doodad.Tools,
		files = tools.Files,
		modules = doodad.Modules;

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
			// Application (@doodad-js/test) packages folder found.
			
			let name;

			// Include the "node_modules" folder of these packages in the search path.
			for (let j = 0; j < folders.length; j++) {
				const folder = folders[j];
				if (!folder.isFile) {
					name = folder.path.combine('node_modules').toString();
					try {
						nodeFs.statSync(name);
						modules.addSearchPath(name);
					} catch(ex) {
						if (ex.code !== 'ENOENT') {
							throw ex;
						};
					};
				};
			};
			
			// Include application (@doodad-js/test) folder as a package.
			name = path.moveUp(2).toString();
			nodeFs.statSync(name);
			modules.addSearchPath(name);
			
			// We should have all the search paths we need.
			break;
		};
	};
};
			
const startup = function _startup(root, _shared) {
	const doodad = root.Doodad,
		modules = doodad.Modules;
					
	addSearchPaths(root);
	
	return modules.load([
			{
				module: '@doodad-js/test',
				// TODO: Auto-Load from "src" or "build".
				path: (root.getOptions().fromSource ? 'src/common/widgets/MyWidget_loader.js' : 'build/widgets/MyWidget_loader.js'),
			},
		], {startup: {secret: _shared.SECRET}});
};

const options = {
	startup: {secret: SECRET},
};

require('@doodad-js/core').createRoot(null, options, startup);
