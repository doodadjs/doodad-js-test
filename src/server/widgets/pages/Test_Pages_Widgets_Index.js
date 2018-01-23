//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Test_Pages_Widgets_Index.js - Widgets tests index page.
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

//! IF_SET("mjs")
//! ELSE()
	"use strict";
//! END_IF()

exports.add = function add(DD_MODULES) {
	DD_MODULES = (DD_MODULES || {});
	DD_MODULES['Test.Pages.Widgets/index'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		dependencies: ['@doodad-js/templates'],

		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				//types = doodad.Types,
				//tools = doodad.Tools,
				templates = doodad.Templates,
				templatesHtml = templates.Html,
				test = root.Test,
				pages = test.Pages,
				pagesWidgets = pages.Widgets;

			//const __Internal__ = {
			//};
				
			//tools.complete(_shared.Natives, {
			//});


			pagesWidgets.REGISTER(doodad.BASE(templatesHtml.PageTemplate.$extend(
			{
				$TYPE_NAME: 'Index',

				//create: doodad.OVERRIDE(function create(request, cacheHandler) {
				//}),
			})));
		},
	};
	return DD_MODULES;
};

//! END_MODULE()