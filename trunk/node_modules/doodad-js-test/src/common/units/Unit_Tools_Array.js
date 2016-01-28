//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Unit_Tools_Array.js - Unit testing module file
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
		DD_MODULES['Doodad.Test.Tools.Array'] = {
			type: 'TestUnit',
			version: '0d',
			namespaces: null,
			dependencies: ['Doodad.Test.Tools'],

			// Unit
			priority: null,

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
					command.run(null,                                             {repetitions: 100}, /**/ ["there", "hi", "there"]);
					command.run(null,                                             {repetitions: 100}, /**/ ["there", "hi", "there"], "zzz");
					command.run(1,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], "hi");
					command.run(0,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], "there");
					command.run(0,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], function(val, key, obj) {return val === "there"});
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.findLastItem, "Doodad.Tools.findLastItem");
					
					command.run(null,                                             {repetitions: 100}  /**/);
					command.run(null,                                             {repetitions: 100}, /**/ ["there", "hi", "there"]);
					command.run(null,                                             {repetitions: 100}, /**/ ["there", "hi", "there"], "zzz");
					command.run(1,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], "hi");
					command.run(2,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], "there");
					command.run(2,                                                {repetitions: 100}, /**/ ["there", "hi", "there"], function(val, key, obj) {return val === "there"});
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.findItems, "Doodad.Tools.findItems");
					
					command.run([],                                               {repetitions: 100}  /**/);
					command.run([],                                               {repetitions: 100}, /**/ ["there", "hi", "there"]);
					command.run([],                                               {repetitions: 100}, /**/ ["there", "hi", "there"], "zzz");
					command.run([1],                                              {contains: true, repetitions: 100}, /**/ ["there", "hi", "there"], "hi");
					command.run([0, 2],                                           {contains: true, repetitions: 100}, /**/ ["there", "hi", "there"], "there");
					command.run([0, 2],                                           {contains: true, repetitions: 100}, /**/ ["there", "hi", "there"], function(val, key, obj) {return val === "there"});
					command.run([0, 1, 2],                                        {contains: true, repetitions: 100}, /**/ ["there", "hi", "there"], ["hi", "there"]);

					command.end();
					
					
					var command = test.prepareCommand(newTools.trim, "Doodad.Tools.trim");
					
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
					command.run([" ", " ", "a", " ", " "],                        {mode: 'isinstance'}, /**/ [" ", " ", "a", " ", " "], 0);
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ [" ", " ", "a", " ", " "], " ", "");
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ [" ", " ", "a", " ", " "], " ", 0, "");
					command.run(["a"],                                            {repetitions: 100}, /**/ [" ", " ", "a", " ", " "]);
					command.run(["a"],                                            {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], " ");
					command.run(["a"],                                            {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], " ", 0);
					command.run(["a", " ", " "],                                  {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], " ", 1);
					command.run([" ", " ", "a"],                                  {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], " ", -1);
					command.run([" ", "a", " "],                                  {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], " ", 0, 1);
					command.run([" ", " ", "a", " ", " "],                        {repetitions: 100}, /**/ [" ", " ", "a", " ", " "], "_");
					command.run([" ", "a", " "],                                  {repetitions: 100}, /**/ ["_", " ", "a", " ", "_"], "_");
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.join, "Doodad.Tools.join");
					
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "");
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ ['a', 'b', 'c'], 0);
					command.run("abc",                                            {repetitions: 100}, /**/ ['a', 'b', 'c']);
					command.run("a,b,c",                                          {repetitions: 100}, /**/ ['a', 'b', 'c'], ",");
					command.run("1,2,3",                                          {repetitions: 100}, /**/ [1, 2, 3], ",");
					
					command.end();
					
					
					var command = test.prepareCommand(newTools.indexOf, "Doodad.Tools.indexOf");
					
					command.run(-1,                                               {repetitions: 100}  /**/);
					command.run(-1,                                               {repetitions: 100}, /**/ ["hi", "there", "hi"]);
					command.run(-1,                                               {repetitions: 100}, /**/ ["hi", "there", "hi"], "zzz");
					command.run(1,                                                {repetitions: 100}, /**/ ["hi", "there", "hi"], "there");

					command.end();
					
					
					var command = test.prepareCommand(newTools.lastIndexOf, "Doodad.Tools.lastIndexOf");
					
					command.run(-1,                                               {repetitions: 100}  /**/);
					command.run(-1,                                               {repetitions: 100}, /**/ ["hi", "there", "hi"]);
					command.run(-1,                                               {repetitions: 100}, /**/ ["hi", "there", "hi"], "zzz");
					command.run(2,                                                {repetitions: 100}, /**/ ["hi", "there", "hi"], "hi");

					command.end();
					
					
					var command = test.prepareCommand(newTools.map, "Doodad.Tools.map");
					
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ ["a", "b", "c", "d", "e", "f"]);
					newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ ["a", "b", "c", "d", "e", "f"], "");
					command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], function(val, key, obj) {return val});

					command.end();
					
					
					var command = test.prepareCommand(function(obj) {
						var result = [];
						newTools.forEach(obj, function(val, key, obj) {
							result.push(val);
						});
						return result;
					}, "Doodad.Tools.forEach");
					
					command.run([],                                               {repetitions: 100}  /**/ );
					command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"]);

					command.end();
					
					
					var command = test.prepareCommand(newTools.filter, "Doodad.Tools.filter");
					
					command.run(undefined,                                        {repetitions: 100}  /**/);
					command.run([],                                               {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"]);
					command.run(['a'],                                            {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], "a");
					command.run(['a'],                                            {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], ['a']);
					command.run(['a', 'b'],                                       {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], ['a', 'b']);
					command.run(['a'],                                            {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], function(val, key, obj) {return val === 'a'});
					command.run(['c', 'd', 'e', 'f'],                             {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], ['a', 'b'], null, true);
					command.run(['c', 'd', 'e', 'f'],                             {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], function(val, key, obj) {return val === 'a' || val === 'b'}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.filterKeys, "Doodad.Tools.filterKeys");
					
					command.run(undefined,                                        {repetitions: 100}  /**/);
					command.run([],                                               {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"]);
					command.run(['a'],                                            {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], [0]);
					command.run(['a', 'b']          ,                             {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], [0, 1]);
					command.run(['a'],                                            {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], function(val, key, obj) {return key === 0});
					command.run(['c', 'd', 'e', 'f'],                             {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], [0, 1], null, true);
					command.run(['c', 'd', 'e', 'f'],                             {repetitions: 100}, /**/ ["a", "b", "c", "d", "e", "f"], function(val, key, obj) {return key === 0 || key === 1}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.every, "Doodad.Tools.every");
					
					command.run(false,                                            {repetitions: 100}  /**/);
					command.run(true,                                             {repetitions: 100}, /**/ []);
					command.run(true,                                             {repetitions: 100}, /**/ [], "a");
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], "a");
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], ["a"]);
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], "b");
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], "ab");
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], ["ab"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], ["a", "b"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], ["a", "b", "c"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], {val1: "a", val2: "b"});
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "b", "a", "b", "a"], {val1: "a", val2: "b", val3: "c"});
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], "a", null, true);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], "b", null, true);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], function(val, key, obj) {return val === "a"});
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], function(val, key, obj) {return val === "a"}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.some, "Doodad.Tools.some");
					
					command.run(false,                                            {repetitions: 100}  /**/);
					command.run(false,                                            {repetitions: 100}, /**/ []);
					command.run(false,                                            {repetitions: 100}, /**/ [], "b");
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], "b");
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], ["b"]);
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "a", "a"], "b");
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], "bc");
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], ["b", "c"]);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], {val1: "b", val2: "c"});
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], "b", null, true);
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], ["a", "b"], null, true);
					command.run(true,                                             {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], function(val, key, obj) {return val === "b"});
					command.run(false,                                            {repetitions: 100}, /**/ ["a", "a", "a", "b", "a"], function(val, key, obj) {return val === "a" || val === "b"}, null, true);

					command.end();
					
					
					var command = test.prepareCommand(newTools.reduce, "Doodad.Tools.reduce");
					
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'}   /**/);
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ []);
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ [], 1);
					command.run(newTypes.TypeError,                               {mode: 'isinstance'},  /**/ [], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48});
					command.run(0,                                                {repetitions: 100}, /**/ [], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
					command.run(6,                                                {repetitions: 100}, /**/ ["1", "2", "3"], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
					command.run("123",                                            {repetitions: 100}, /**/ ["1", "2", "3"], function(result, val, key, obj) {return result + val}, "");

					command.end();
					
					
					var command = test.prepareCommand(newTools.reduceRight, "Doodad.Tools.reduceRight");
					
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'}   /**/);
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ []);
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ [], 1);
					command.run(newTypes.TypeError,                               {mode: 'isinstance'},  /**/ [], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48});
					command.run(0,                                                {repetitions: 100}, /**/ [], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
					command.run(6,                                                {repetitions: 100}, /**/ ["1", "2", "3"], function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
					command.run("321",                                            {repetitions: 100}, /**/ ["1", "2", "3"], function(result, val, key, obj) {return result + val}, "");

					command.end();

					
					var command = test.prepareCommand(newTools.unique, "Doodad.Tools.unique");
					
					command.run([],                                               {repetitions: 100}  /**/);
					command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ 1);
					command.run(['a', 'b', 'c'],                                  {repetitions: 100}, /**/ ["a", "b", "c", "a", "b", "c"]);
					command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ ["a", "b", "c", "a", "b", "c"], ["d", "e", "f", "d", "e", "f"]);

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