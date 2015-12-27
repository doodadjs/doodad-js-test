//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Class library for Javascript (BETA) with some extras (ALPHA)
// File: Unit_Tools_Misc.js - Unit testing module file
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

(function() {
	var global = this;

	global.DD_MODULES = (global.DD_MODULES || {});
	global.DD_MODULES['Doodad.Test.Tools.Misc'] = {
		type: 'TestUnit',
		version: '0d',
		namespaces: null,
		dependencies: ['Doodad.Test.Tools'],

		// Unit
		priority: null,
			proto: {
			run: null,
		},

		proto: {
			run: function run(entry, /*optional*/options) {
				"use strict";

				var root = entry.root,
					doodad = root.Doodad,
					namespaces = doodad.Namespaces,
					test = doodad.Test,
					unit = test.Types.Is,
					types = doodad.Types,
					io = doodad.IO,
					newRoot = test.NewRoot,
					newTypes = newRoot.Doodad.Types,
					newTools = newRoot.Doodad.Tools;

					
				if (!options) {
					options = {};
				};
				
				
				var command = test.prepareCommand(newTools.escapeHtml, "Doodad.Tools.escapeHtml");
				
				command.run(undefined,                                       {repetitions: 100}  /**/);
				command.run(newTypes.AssertionFailed,                        {mode: 'isinstance'}, /**/ 1);
				command.run("",                                              {repetitions: 100}, /**/ "");
				command.run("&lt;script onload=&quot;go(&#39;&amp;#20&#39;)&quot;&gt;", {repetitions: 100}, /**/ '<script onload="go(\'&#20\')">');

				command.end();
				
			
				var command = test.prepareCommand(newTools.escapeRegExp, "Doodad.Tools.escapeRegExp");
				
				command.run(undefined,                                       {repetitions: 100}  /**/);
				command.run(newTypes.AssertionFailed,                        {mode: 'isinstance'}, /**/ 1);
				command.run("",                                              {repetitions: 100}, /**/ "");
				command.run("\\[\\(\\$1\\+\\$2\\)\\|\\(\\^\\$3\\)\\]",       {repetitions: 100}, /**/ '[($1+$2)|(^$3)]');

				command.end();
				
			
				var command = test.prepareCommand(newTools.sign, "Doodad.Tools.sign");
				
				command.run(NaN,                                             {repetitions: 100}  /**/);
				command.run(0,                                               {repetitions: 100}, /**/ null);
				command.run(NaN,                                             {repetitions: 100}, /**/ NaN);
				command.run(1,                                               {repetitions: 100}, /**/ Infinity);
				command.run(-1,                                              {repetitions: 100}, /**/ -Infinity);
				command.run(0,                                               {repetitions: 100}, /**/ 0);
				command.run(-0,                                              {repetitions: 100}, /**/ -0);
				command.run(1,                                               {repetitions: 100}, /**/ 2);
				command.run(-1,                                              {repetitions: 100}, /**/ -2);

				command.end();
				
			
			},
		},
	};
})();