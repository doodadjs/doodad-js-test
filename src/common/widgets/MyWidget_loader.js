//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// dOOdad - Object-oriented programming framework
// File: MyWidget_loader.js - Test file
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

(function() {
	var global = this;

	var exports = {};
	
	//! BEGIN_REMOVE()
	if ((typeof process === 'object') && (typeof module === 'object')) {
	//! END_REMOVE()
		//! IF_DEF("serverSide")
			module.exports = exports;
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		return DD_MODULES;
	};
	
	exports.addScripts = function addScripts(DD_SCRIPTS) {
		DD_SCRIPTS = (DD_SCRIPTS || []);
		DD_SCRIPTS.push(
			{
				description: "Load 'doodad-js-io'",
				dependencies : [
					{
						optional: false,
						conditions: {
							include: [ // "and" conditions
								"root.Doodad.Namespaces.getNamespace('doodad-js')",
							],
							exclude: [ // "or" conditions
								"root.Doodad.Namespaces.getNamespace('doodad-js-io')",
							],
							before: false,
						},
						initializers: [
							"root.Doodad.Modules.load('doodad-js-io')",
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
								"root.Doodad.Namespaces.getNamespace('doodad-js-io')",
							],
							exclude: [ // "or" conditions
								"root.Doodad.Namespaces.getNamespace('doodad-js-widgets')",
							],
							before: false,
						},
						initializers: [
							"root.Doodad.Modules.load('doodad-js-widgets')",
						],
					}
				]
			},
			{
				description: "Load MyWidget.js",
				dependencies : [
					{
						optional: false,
						conditions: {
							include: [ // "and" conditions
								"root.Doodad.Namespaces.getNamespace('doodad-js-widgets')",
							],
							exclude: [ // "or" conditions
							],
							before: false,
						},
						scripts: [
							{
								fileType: 'css',
								fileName: 'MyWidget.css',
								baseUrl: function(root) {return root.Doodad.Modules.locate('doodad-js-test', (root.Doodad.NodeJs ? 'src/common/widgets/' : 'widgets/'))},
								media: 'screen',
							},
						],
						initializers: [
							function(root) {return root.Doodad.Modules.load('doodad-js-test', (root.Doodad.NodeJs ? 'src/common/widgets/MyWidget.js' : 'widgets/MyWidget.js'))},
						],
					}
				]
			}
		);
		return DD_SCRIPTS;
	};
	
	//! BEGIN_REMOVE()
	if ((typeof process !== 'object') || (typeof module !== 'object')) {
	//! END_REMOVE()
		//! IF_UNDEF("serverSide")
			// <PRB> export/import are not yet supported in browsers
			global.DD_MODULES = exports.add(global.DD_MODULES);
			global.DD_SCRIPTS = exports.addScripts(global.DD_SCRIPTS);
		//! END_IF()
	//! BEGIN_REMOVE()
	};
	//! END_REMOVE()
}).call(
	//! BEGIN_REMOVE()
	(typeof window !== 'undefined') ? window : ((typeof global !== 'undefined') ? global : this)
	//! END_REMOVE()
	//! IF_DEF("serverSide")
	//! 	INJECT("global")
	//! ELSE()
	//! 	INJECT("window")
	//! END_IF()
);