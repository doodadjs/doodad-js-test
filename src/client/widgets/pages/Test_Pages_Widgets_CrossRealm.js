//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Test_Pages_Widgets_CrossRealm.js - Widgets cross-realms test page (client-side)
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

/* eslint no-alert: "off" */

//! IF_SET("mjs")
//! ELSE()
	"use strict";
//! END_IF()

exports.add = function add(modules) {
	modules = (modules || {});
	modules['Test.Pages.Widgets/crossRealm'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		//dependencies: [
		//	//{
		//	//	module: 'doodad-js/tests',
		//	//},
		//],
		type: 'Application',

		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				types = doodad.Types;
				//tools = doodad.Tools,
				//test = doodad.Test,
				//pages = root.Test.Pages;

			//const __Internal__ = {
			//};
				
			//tools.complete(_shared.Natives, {
			//});


			return function init(options) {
				if (global.setRealmRoot) {
					global.setRealmRoot(null, root);
				} else {
					types.defineProperty(global, 'setRealmRoot', {
						configurable: true,
						enumerable: true,
						//get: function() {
						//	return undefined;
						//},
						set: function(value) {
							types.defineProperty(global, 'setRealmRoot', {
								configurable: true,
								enumerable: true,
								writable: true,
								value: value,
							});
							value(null, root);
						},
					});
				};
			};
		},
	};
	return modules;
};

//! END_MODULE()
