//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework with some extras
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

const DD_MODULES = {};
require("../../common/widgets/MyWidget_loader.js").add(DD_MODULES);
require('doodad-js-loader').add(DD_MODULES);

const root = require('doodad-js').createRoot(DD_MODULES),
	doodad = root.Doodad,
	namespaces = doodad.Namespaces;

function startup() {
	doodad.Loader.loadScripts(global.DD_SCRIPTS)
		['catch'](function(err){console.log(err.stack)});
};

namespaces.loadNamespaces(startup, false, null, DD_MODULES)
	['catch'](function(err){console.log(err.stack)});
