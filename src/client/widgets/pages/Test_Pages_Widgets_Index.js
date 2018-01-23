//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Test_Pages_Widgets_Index.js - Widgets index test page (client-side).
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

exports.add = function add(DD_MODULES) {
	DD_MODULES = (DD_MODULES || {});
	DD_MODULES['Test.Pages.Widgets/index'] = {
		version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
		type: 'Application',

		create: function create(root, /*optional*/_options, _shared) {
			const doodad = root.Doodad,
				types = doodad.Types,
				tools = doodad.Tools,
				modules = doodad.Modules,
				mixIns = doodad.MixIns;
				//test = doodad.Test,
				//pages = root.Test.Pages;

			//tools.complete(_shared.Natives, {
			//});

			return function init(options) {
				const Promise = types.getPromise();

				const realmWindow = document.getElementById('crossRealm').contentWindow;

				return new Promise(function(resolve, reject) {
						realmWindow.setRealmRoot = function(err, root) {
							if (err) {
								reject(err);
							} else {
								resolve(root);
							};
						};
					})
					.then(function(realmRoot) {
						const loadingImg = document.getElementById('loading');
						const oldLoadingDisplayStyle = loadingImg && loadingImg.style.display;
						if (loadingImg) {
							loadingImg.style.display = 'none';
						};

						let msg = '';
						msg += types.isType(realmRoot.Doodad.Types.Namespace) + ',';
						msg += types._instanceof(types, realmRoot.Doodad.Types.Namespace) + ',';
						msg += types._instanceof(realmRoot.Doodad.Types, types.Namespace) + ',';
						msg += types._instanceof(realmRoot.Doodad.Types, types.Type) + ',';
						msg += types._instanceof(new realmRoot.Doodad.Object(), doodad.Object) + ',';
						//msg += types._implements(realmRoot.Doodad.Object, mixIns.Creatable) + ',';
						msg += realmRoot.Doodad.Object._implements(mixIns.Creatable) + ',';
						msg += types.isType(realmRoot.Doodad.Types.Type) + ',';
						msg += types._instanceof(new realmWindow.Object(), Object) + ',';
						msg += ((typeof Symbol === 'undefined') ? 'true' : types._instanceof(realmWindow.Object(realmWindow.Symbol()), Symbol)) + ',';
						msg += types.isPromise(realmRoot.Doodad.Types.getPromise().resolve()) + ',';
						msg += types.isErrorType(realmRoot.Doodad.Types.Error) + ',';
						msg += types.isError(new (realmRoot.Doodad.Types.Error)("test"));
						msg += "  <=== Must be all 'true'";
						tools.alert(msg);

						if (loadingImg) {
							loadingImg.style.display = oldLoadingDisplayStyle;
						};

						return modules.load([
							/*{
								module: '@doodad-js/unicode',
							},
							{
								module: '@doodad-js/locale',
							},
							{
								module: '@doodad-js/safeeval',
							},
							{
								module: '@doodad-js/loader',  NOTE: Loaded by "MyWidget_loader.js"
							},*/
							{
								module: '@doodad-js/test',
								path: 'widgets/MyWidget_loader.js',
							},
						], {startup: {secret: _shared.SECRET}});
					})
					.nodeify(function(err, dummy) {
						const loadingImg = document.getElementById('loading');
						if (loadingImg) {
							loadingImg.style.display = 'none';
						};

						if (err) {
							alert(err);
						};
					});
			};
		},
	};
	return DD_MODULES;
};

//! END_MODULE()