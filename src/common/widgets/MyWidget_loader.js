//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: MyWidget_loader.js - Test file
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

exports.add = function add(DD_MODULES) {
	DD_MODULES = (DD_MODULES || {});
	DD_MODULES['MyWidget'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		dependencies: [
			{
				name: 'doodad-js-loader',
				version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js-loader'))) */ null /*! END_REPLACE() */,
				type: /*! REPLACE_BY(TO_SOURCE(MAKE_MANIFEST('type', 'doodad-js-loader'))) */ 'Package' /*! END_REPLACE() */,
			}, 
		],
			
		create: function create(root, /*optional*/_options, _shared) {
			"use strict";

			const doodad = root.Doodad,
				loader = doodad.Loader;

			return function init(options) {
				const DD_SCRIPTS = [
					/*{
						description: "Load 'doodad-js-io'",
						dependencies : [
							{
								optional: false,
								conditions: {
									include: [ // "and" conditions
										"root.Doodad.Namespaces.get('doodad-js')",
									],
									exclude: [ // "or" conditions
										"root.Doodad.Namespaces.get('doodad-js-io')",
									],
									before: false,
								},
								initializers: [
									function(root) {return root.Doodad.Modules.load([{module: 'doodad-js-io'}], {startup: {secret: _shared.SECRET}})},
								],
							}
						]
					},
					{
						description: "Load 'doodad-js-widgets'",
						dependencies : [
							{
								optional: false,
								conditions: {
									include: [ // "and" conditions
										"root.Doodad.Namespaces.get('doodad-js-io')",
									],
									exclude: [ // "or" conditions
										"root.Doodad.Namespaces.get('doodad-js-widgets')",
									],
									before: false,
								},
								initializers: [
									function(root) {return root.Doodad.Modules.load([{module: 'doodad-js-widgets'}], {startup: {secret: _shared.SECRET}})},
								],
							}
						]
					},*/
					{
						description: "Load MyWidget.js",
						dependencies : [
							{
								optional: false,
								conditions: {
									include: [ // "and" conditions
										//"root.Doodad.Namespaces.get('doodad-js-widgets')",
									],
									exclude: [ // "or" conditions
									],
									before: false,
								},
								//scripts: [
								//	{
								//		fileType: 'css',
								//		fileName: 'index.css',
								//		baseUrl: function(root) {return root.Doodad.Modules.locate('doodad-js-test', 'widgets/css/')},
								//		media: 'screen',
								//	},
								//],
								initializers: [
									function(root) {
										// TODO: Auto-Load from "src" or "build" or whatever else.
										return root.Doodad.Modules.load([{module: 'doodad-js-test', path: (root.getOptions().fromSource ? 'src/common/widgets/MyWidget.js' : (root.serverSide ? 'build/widgets/MyWidget.js' : 'widgets/MyWidget.js'))}], {startup: {secret: _shared.SECRET}});
									},
								],
							}
						]
					},
				];
					
				return loader.loadScripts(DD_SCRIPTS, {secret: _shared.SECRET});
			};
		},
	};
	return DD_MODULES;
};

//! END_MODULE()