// dOOdad - Object-oriented programming framework
// File: index.js - Loader module startup file
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
	
	var MODULE_NAME = 'doodad-js-test';
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES[MODULE_NAME + '.units'] = {
			type: 'Package',
			version: '0b',
			dependencies: [
				{
					name: 'doodad-js',
					version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js'))) */ null /*! END_REPLACE() */,
				}, 
				{
					name: 'doodad-js-test',
					version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js-test'))) */ null /*! END_REPLACE() */,
				}, 
				//{
				//	name: 'doodad-js-safeeval',
				//	version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js-safeeval'))) */ null /*! END_REPLACE() */,
				//}, 
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";
				
				var doodad = root.Doodad,
					modules = doodad.Modules;
				
				//var fromSource = root.getOptions().fromSource;
				var path = (doodad.NodeJs ? '/src/common/units/' : '/units/');
				
				return modules.load(MODULE_NAME, [
							path + "Unit_Types.js",
							path + "Unit_Types_Is.js",
							path + "Unit_Types_Type.js",
							path + "Unit_Types_Conversion.js",
							path + "Unit_Types_Dictionary.js",
							path + "Unit_Types_Array.js",
							path + "Unit_Types_ToSource.js",
							path + "Unit_Tools.js",
							//path + "Unit_Tools_SafeEval.js",
							path + "Unit_Tools_Files.js",
							path + "Unit_Tools_Files_Path.js",
							path + "Unit_Tools_Files_Urls.js",
							path + "Unit_Tools_String.js",
							path + "Unit_Tools_Array.js",
							path + "Unit_Tools_Dictionary.js",
							path + "Unit_Tools_Misc.js",
						], _options)
					.then(function() {
						// Returns nothing
					});
			},
		};
		return DD_MODULES;
	};
	
	//! BEGIN_REMOVE()
	if ((typeof process !== 'object') || (typeof module !== 'object')) {
	//! END_REMOVE()
		//! IF_UNDEF("serverSide")
			// <PRB> export/import are not yet supported in browsers
			global.DD_MODULES = exports.add(global.DD_MODULES);
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