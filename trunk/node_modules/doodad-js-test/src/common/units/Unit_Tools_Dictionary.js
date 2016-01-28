//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Unit_Tools_Dictionary.js - Unit testing module file
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
	if (typeof process === 'object') {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Test.Tools.Dictionary'] = {
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
					
					
					var command = test.prepareCommand(newTools.findItem, "Doodad.Tools.findItem");
					
					command.run(null,                                             {repetitions: 100}  /**/);
					command.run(null,                                             {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"});
					command.run(null,                                             {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "zzz");
					command.run('b',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "hi");
					command.run('a',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "there");
					command.run('a',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, function(val, key, obj) {return val === "there"});
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.findLastItem, "Doodad.Tools.findLastItem");
					
					command.run(null,                                             {repetitions: 100}  /**/);
					command.run(null,                                             {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"});
					command.run(null,                                             {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "zzz");
					command.run('b',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "hi");
					command.run('c',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "there");
					command.run('c',                                              {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, function(val, key, obj) {return val === "there"});
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.findItems, "Doodad.Tools.findItems");
					
					command.run([],                                               {repetitions: 100}  /**/);
					command.run([],                                               {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"});
					command.run([],                                               {repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "zzz");
					command.run(['b'],                                            {contains: true, repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "hi");
					command.run(['a', 'c'],                                       {contains: true, repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, "there");
					command.run(['a', 'c'],                                       {contains: true, repetitions: 100}, /**/ {a: "there", b: "hi", c: "there"}, function(val, key, obj) {return val === "there"});
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.map, "Doodad.Tools.map");
					
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"});
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, "");
					command.run({val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, function(val, key, obj) {return val});

					command.end();
					
					
					var command = test.prepareCommand(function(obj) {
						var result = [];
						newTools.forEach(obj, function(val, key, obj) {
							result.push(val);
						});
						return result;
					}, "Doodad.Tools.forEach");
					
					command.run([],                                               {repetitions: 100}  /**/ );
					command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"});

					command.end();
					
					
					var command = test.prepareCommand(newTools.filter, "Doodad.Tools.filter");
					
					command.run(undefined,                                        {repetitions: 100}  /**/);
					command.run({},                                               {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"});
					command.run({val1: 'a'},                                      {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, "a");
					command.run({val1: 'a'},                                      {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['a']);
					command.run({val1: 'a', val2: 'b'},                           {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['a', 'b']);
					command.run({val1: 'a'},                                      {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, function(val, key, obj) {return val === 'a'});
					command.run({val3: 'c', val4: 'd', val5: 'e', val6: 'f'},     {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['a', 'b'], null, true);
					command.run({val3: 'c', val4: 'd', val5: 'e', val6: 'f'},     {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, function(val, key, obj) {return val === 'a' || val === 'b'}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.filterKeys, "Doodad.Tools.filterKeys");
					
					command.run(undefined,                                        {repetitions: 100}  /**/);
					command.run({},                                               {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"});
					command.run({val1: 'a'},                                      {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['val1']);
					command.run({val1: 'a', val2: 'b'},                           {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['val1', 'val2']);
					command.run({val1: 'a'},                                      {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, function(val, key, obj) {return key === 'val1'});
					command.run({val3: 'c', val4: 'd', val5: 'e', val6: 'f'},     {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, ['val1', 'val2'], null, true);
					command.run({val3: 'c', val4: 'd', val5: 'e', val6: 'f'},     {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "c", val4: "d", val5: "e", val6: "f"}, function(val, key, obj) {return key === 'val1' || key === 'val2'}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.every, "Doodad.Tools.every");
					
					command.run(false,                                            {repetitions: 100}  /**/);
					command.run(true,                                             {repetitions: 100}, /**/ {});
					command.run(true,                                             {repetitions: 100}, /**/ {}, "a");
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"});
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, "a");
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, ["a"]);
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, "b");
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, "ab");
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, ["ab"]);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, ["a", "b"]);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, ["a", "b", "c"]);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, {val1: "a", val2: "b"});
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "b", val3: "a", val4: "b", val5: "a"}, {val1: "a", val2: "b", val3: "c"});
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, "a", null, true);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, "b", null, true);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, function(val, key, obj) {return val === "a"});
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, function(val, key, obj) {return val === "a"}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.some, "Doodad.Tools.some");
					
					command.run(false,                                            {repetitions: 100}  /**/);
					command.run(false,                                            {repetitions: 100}, /**/ {});
					command.run(false,                                            {repetitions: 100}, /**/ {}, "b");
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"});
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, "b");
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, ["b"]);
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "a", val5: "a"}, "b");
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, "bc");
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, ["b", "c"]);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, {val1: "b", val2: "c"});
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, "b", null, true);
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, ["a", "b"], null, true);
					command.run(true,                                             {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, function(val, key, obj) {return val === "b"});
					command.run(false,                                            {repetitions: 100}, /**/ {val1: "a", val2: "a", val3: "a", val4: "b", val5: "a"}, function(val, key, obj) {return val === "a" || val === "b"}, null, true);

					command.end();
					
					
				},
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));