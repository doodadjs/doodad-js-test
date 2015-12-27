//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework with some extras
// File: Unit_Types_Type.js - Unit testing module file
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

	var exports = {};
	if (global.process) {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Test.Types.Type'] = {
			type: 'TestUnit',
			version: '0d',
			namespaces: null,
			dependencies: ['Doodad.Test.Types'],

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
						newTypes = newRoot.Doodad.Types;

						
					if (!options) {
						options = {};
					};
					
					
					global.Type = newTypes.Type;

					global.Test1 = newTypes.Type.$inherit(
						/*typeProto*/
						{
							$TYPE_NAME: 'Test1',
							
							typeAttribute: 1,
							typeMethod: function() {
								return 1;
							},
							typeMethodNoSuper: function() {
								return 2;
							},
							typeMethodNoOverride: function() {
								return 3;
							},
						},
						/*instanceProto*/
						{
							instanceAttribute: 2,
							instanceMethod: function() {
								return 2;
							},
							instanceMethodNoSuper: function() {
								return 3;
							},
							instanceMethodNoOverride: function() {
								return 4;
							},
						}
					);
					
					global.objTest1 = new global.Test1();
					
					global.Test2 = newTypes.SINGLETON(newTypes.Type.$inherit(
						/*typeProto*/
						{
							$TYPE_NAME: 'Test2',
							
							typeAttribute: 1,
							typeMethod: function() {
								return 1;
							},
						},
						/*instanceProto*/
						{
							instanceAttribute: 2,
							instanceMethod: function() {
								return 2;
							},
						}
					));
					
					global.Test3 = global.Test1.$inherit(
						/*typeProto*/
						{
							$TYPE_NAME: 'Test3',
							
							typeAttribute: 3,
							typeMethod: newTypes.SUPER(function() {
								return this._super();
							}),
							typeMethodNoSuper: function() {
								return 4;
							},
						},
						/*instanceProto*/
						{
							instanceAttribute: 4,
							instanceMethod: newTypes.SUPER(function() {
								return this._super();
							}),
							instanceMethodNoSuper: function() {
								return 5;
							},
						}
					);
					
					global.objTest3 = new global.Test3();

					var command = test.prepareCommand(newTypes.isType, "Doodad.Types.isType");
					command.run(false, {eval: true, repetitions: 100},        /**/ "undefined");
					command.run(false, {eval: true, repetitions: 100},        /**/ "null");
					command.run(false, {eval: true, repetitions: 100},        /**/ "''");
					command.run(false, {eval: true, repetitions: 100},        /**/ "1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "0.1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "NaN");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Infinity");
					command.run(false, {eval: true, repetitions: 100},        /**/ "true");
					command.run(false, {eval: true, repetitions: 100},        /**/ "{}");
					command.run(false, {eval: true, repetitions: 100},        /**/ "[]");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new String('')");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(0.1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(NaN)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(Infinity)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Boolean(false)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Date");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Error");
					command.run(false, {eval: true, repetitions: 100},        /**/ "(function(){})");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Object.prototype.toString");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Object");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3");
					command.end();

					var command = test.prepareCommand(newTypes.isJsFunction, "Doodad.Types.isJsFunction");
					command.run(false, {eval: true, repetitions: 100},        /**/ "undefined");
					command.run(false, {eval: true, repetitions: 100},        /**/ "null");
					command.run(false, {eval: true, repetitions: 100},        /**/ "''");
					command.run(false, {eval: true, repetitions: 100},        /**/ "1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "0.1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "NaN");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Infinity");
					command.run(false, {eval: true, repetitions: 100},        /**/ "true");
					command.run(false, {eval: true, repetitions: 100},        /**/ "{}");
					command.run(false, {eval: true, repetitions: 100},        /**/ "[]");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new String('')");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(0.1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(NaN)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(Infinity)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Boolean(false)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Date");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Error");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "(function(){})");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "Object.prototype.toString");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "Object");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3");
					command.end();

					var command = test.prepareCommand(newTypes.isJsObject, "Doodad.Types.isJsObject");
					command.run(false, {eval: true, repetitions: 100},        /**/ "undefined");
					command.run(false, {eval: true, repetitions: 100},        /**/ "null");
					command.run(false, {eval: true, repetitions: 100},        /**/ "''");
					command.run(false, {eval: true, repetitions: 100},        /**/ "1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "0.1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "NaN");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Infinity");
					command.run(false, {eval: true, repetitions: 100},        /**/ "true");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "{}");
					command.run(false, {eval: true, repetitions: 100},        /**/ "[]");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new String('')");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(0.1)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(NaN)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Number(Infinity)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Boolean(false)");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Date");
					command.run(false, {eval: true, repetitions: 100},        /**/ "new Error");
					command.run(false, {eval: true, repetitions: 100},        /**/ "(function(){})");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Object.prototype.toString");
					command.run(false, {eval: true, repetitions: 100},        /**/ "Object");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3");
					command.end();

					
					
					var command = test.prepareCommand(function(obj, type) {
						return obj instanceof type;
					}, "obj instanceof type");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Type");

					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test1");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test3");
					
					command.end();

					
					var command = test.prepareCommand(newTypes._instanceof, "Doodad.Types._instanceof");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Type");
					command.run(true, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Type");

					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test1");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test2");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test3");
					
					command.end();

					
					var command = test.prepareCommand(newTypes.baseof, "Doodad.Types.baseof");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Type");

					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test1");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test2");
					
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test3");
					
					command.end();

					
					var command = test.prepareCommand(newTypes.is, "Doodad.Types.is");
					
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Type", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Type");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Type");

					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test1");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test2");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test2");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test3");
					
					command.end();

					
					var command = test.prepareCommand(newTypes.isLike, "Doodad.Types.isLike");
					
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Type", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Type");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Type");

					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test1");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test1");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test1");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test2");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test2");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test2");
					
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Type", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.objTest1", "window.Test3");
					command.run(false, {eval: true, repetitions: 100},        /**/ "window.Test2", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.Test3", "window.Test3");
					command.run(true,  {eval: true, repetitions: 100},        /**/ "window.objTest3", "window.Test3");
					
					command.end();

					
					var command = test.prepareCommand(function(obj, attr) {
						return obj[attr];
					}, "obj[attr]");
					
					command.run(1,         {eval: true},    /**/ "window.Test1", "'typeAttribute'");
					command.run(undefined, {eval: true},    /**/ "window.Test1", "'instanceAttribute'");

					command.run(undefined, {eval: true},    /**/ "window.objTest1", "'typeAttribute'");
					command.run(2,         {eval: true},    /**/ "window.objTest1", "'instanceAttribute'");

					command.run(undefined, {eval: true},    /**/ "window.Test2", "'typeAttribute'");
					command.run(2,         {eval: true},    /**/ "window.Test2", "'instanceAttribute'");

					command.run(3,         {eval: true},    /**/ "window.Test3", "'typeAttribute'");
					command.run(undefined, {eval: true},    /**/ "window.Test3", "'instanceAttribute'");

					command.run(undefined, {eval: true},    /**/ "window.objTest3", "'typeAttribute'");
					command.run(4,         {eval: true},    /**/ "window.objTest3", "'instanceAttribute'");
					
					command.end();

					var command = test.prepareCommand(function(obj, attr) {
						var fn = obj[attr];
						return fn && fn.apply(obj);
					}, "obj[attr]()");
					
					command.run(1,         {eval: true},    /**/ "window.Test1", "'typeMethod'");
					command.run(2,         {eval: true},    /**/ "window.Test1", "'typeMethodNoSuper'");
					command.run(3,         {eval: true},    /**/ "window.Test1", "'typeMethodNoOverride'");
					command.run(undefined, {eval: true},    /**/ "window.Test1", "'instanceMethod'");
					command.run(undefined, {eval: true},    /**/ "window.Test1", "'instanceMethodNoSuper'");
					command.run(undefined, {eval: true},    /**/ "window.Test1", "'instanceMethodNoOverride'");

					command.run(undefined, {eval: true},    /**/ "window.objTest1", "'typeMethod'");
					command.run(undefined, {eval: true},    /**/ "window.objTest1", "'typeMethodNoSuper'");
					command.run(undefined, {eval: true},    /**/ "window.objTest1", "'typeMethodNoOverride'");
					command.run(2,         {eval: true},    /**/ "window.objTest1", "'instanceMethod'");
					command.run(3,         {eval: true},    /**/ "window.objTest1", "'instanceMethodNoSuper'");
					command.run(4,         {eval: true},    /**/ "window.objTest1", "'instanceMethodNoOverride'");

					command.run(undefined, {eval: true},    /**/ "window.Test2", "'typeMethod'");
					command.run(2,         {eval: true},    /**/ "window.Test2", "'instanceMethod'");

					command.run(1,         {eval: true},    /**/ "window.Test3", "'typeMethod'");
					command.run(4,         {eval: true},    /**/ "window.Test3", "'typeMethodNoSuper'");
					command.run(3,         {eval: true},    /**/ "window.Test3", "'typeMethodNoOverride'");
					command.run(undefined, {eval: true},    /**/ "window.Test3", "'instanceMethod'");
					command.run(undefined, {eval: true},    /**/ "window.Test3", "'instanceMethodNoSuper'");
					command.run(undefined, {eval: true},    /**/ "window.Test3", "'instanceMethodNoOverride'");

					command.run(undefined, {eval: true},    /**/ "window.objTest3", "'typeMethod'");
					command.run(undefined, {eval: true},    /**/ "window.objTest3", "'typeMethodNoSuper'");
					command.run(undefined, {eval: true},    /**/ "window.objTest3", "'typeMethodNoOverride'");
					command.run(2,         {eval: true},    /**/ "window.objTest3", "'instanceMethod'");
					command.run(5,         {eval: true},    /**/ "window.objTest3", "'instanceMethodNoSuper'");
					command.run(4,         {eval: true},    /**/ "window.objTest3", "'instanceMethodNoOverride'");
					
					command.end();

					
					var command = test.prepareCommand(newTypes.getType, "Doodad.Types.getType");
					
					command.run("window.Type",   {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run("window.Test1",  {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run("window.Test1",  {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run("window.Test2.constructor",  {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run("window.Test3",  {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run("window.Test3",  {eval: true, repetitions: 100},        /**/ "window.objTest3");

					command.end();

					
					var command = test.prepareCommand(newTypes.getTypeName, "Doodad.Types.getTypeName");
					
					command.run("'Type'",   {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run("'Test1'",  {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run("'Test1'",  {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run("'Test2'",  {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run("'Test3'",  {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run("'Test3'",  {eval: true, repetitions: 100},        /**/ "window.objTest3");

					command.end();

					
					var command = test.prepareCommand(newTypes.getBase, "Doodad.Types.getBase");
					
	////			command.run("???",        {eval: true, repetitions: 100},        /**/ "window.Type");
					command.run("window.Type",     {eval: true, repetitions: 100},        /**/ "window.Test1");
					command.run("window.Type",     {eval: true, repetitions: 100},        /**/ "window.objTest1");
					command.run("window.Type",     {eval: true, repetitions: 100},        /**/ "window.Test2");
					command.run("window.Test1",    {eval: true, repetitions: 100},        /**/ "window.Test3");
					command.run("window.Test1",    {eval: true, repetitions: 100},        /**/ "window.objTest3");

					command.end();

					
					var command = test.prepareCommand(function (obj) {
						return obj.toString();
					}, "obj.toString()");

					command.run("'[type Type]'",     {eval: true},        /**/ "window.Type");
					command.run("'[type Test1]'",    {eval: true},        /**/ "window.Test1");
					command.run("'[object Test1]'",  {eval: true},        /**/ "window.objTest1");
					command.run("'[object Test2]'",  {eval: true},        /**/ "window.Test2");
					command.run("'[type Test3]'",    {eval: true},        /**/ "window.Test3");
					command.run("'[object Test3]'",  {eval: true},        /**/ "window.objTest3");

					command.end();

					
					var command = test.prepareCommand(function (obj) {
						return obj.toLocaleString();
					}, "obj.toLocaleString()");

					command.run("'[type Type]'",     {eval: true},        /**/ "window.Type");
					command.run("'[type Test1]'",    {eval: true},        /**/ "window.Test1");
					command.run("'[object Test1]'",  {eval: true},        /**/ "window.objTest1");
					command.run("'[object Test2]'",  {eval: true},        /**/ "window.Test2");
					command.run("'[type Test3]'",    {eval: true},        /**/ "window.Test3");
					command.run("'[object Test3]'",  {eval: true},        /**/ "window.objTest3");

					command.end();

					
					var command = test.prepareCommand(function (obj) {
						return (newTypes instanceof newTypes.Namespace) && (newTypes instanceof newTypes.Type);
					}, "(Doodad.Types instanceof Doodad.Types.Namespace) && (Doodad.Types instanceof Doodad.Types.Type)");
					command.run(true);
					command.end();
					
					
				},
			},
		};
		
		return DD_MODULES;
	};
	
	if (!global.process) {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};
})();