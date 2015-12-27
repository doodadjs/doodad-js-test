//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Class library for Javascript (BETA) with some extras (ALPHA)
// File: Unit_Types_Dictionary.js - Unit testing module file
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
	global.DD_MODULES['Doodad.Test.Types.Dictionary'] = {
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
					newTypes = test.NewRoot.Doodad.Types;

					
				if (!options) {
					options = {};
				};

				
				var createDicts = function createDicts() {
					global.dict1 = {
						a: 1,
						b: 2,
					};

					var typeDict2 = function() {};
					typeDict2.prototype = types.setPrototypeOf(typeDict2.prototype, global.dict1);
					typeDict2.prototype.c = 3;
					typeDict2.prototype.d = 4;
					global.dict2 = new typeDict2();
					
					var typeDict3 = function() {};
					typeDict3.prototype = types.setPrototypeOf(typeDict3.prototype, global.dict2);
					global.dict3 = new typeDict3();
					global.dict3.e = 5;
					global.dict3.f = 6;
				};
				
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.hasKey, "Doodad.Types.hasKey");
				
				command.run(false,       {eval: true}     /**/ );
				command.run(false,       {eval: true},    /**/ "undefined", "'a'");
				command.run(false,       {eval: true},    /**/ "global.dict1");
				
				command.run(true,        {eval: true},    /**/ "global.dict1", "'a'");
				command.run(true,        {eval: true},    /**/ "global.dict1", "'b'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'c'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'d'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'e'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'toString'");
				command.run(true,        {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']");
				
				command.run(false,       {eval: true},    /**/ "global.dict2", "'a'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'b'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'c'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'d'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'e'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'toString'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				
				command.run(false,       {eval: true},    /**/ "global.dict3", "'a'");
				command.run(false,       {eval: true},    /**/ "global.dict3", "'b'");
				command.run(false,       {eval: true},    /**/ "global.dict3", "'c'");
				command.run(false,       {eval: true},    /**/ "global.dict3", "'d'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'e'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict3", "'toString'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']");
				
				command.end();

				
				var command = test.prepareCommand(newTypes.hasKeyInherited, "Doodad.Types.hasKeyInherited");
				
				command.run(false,       {eval: true}     /**/ );
				command.run(false,       {eval: true},    /**/ "undefined", "'a'");
				command.run(false,       {eval: true},    /**/ "global.dict1");
				
				command.run(true,        {eval: true},    /**/ "global.dict1", "'a'");
				command.run(true,        {eval: true},    /**/ "global.dict1", "'b'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'c'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'d'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'e'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict1", "'toString'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				
				command.run(true,        {eval: true},    /**/ "global.dict2", "'a'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "'b'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "'c'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "'d'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'e'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict2", "'toString'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				
				command.run(true,        {eval: true},    /**/ "global.dict3", "'a'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'b'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'c'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'d'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'e'");
				command.run(true,        {eval: true},    /**/ "global.dict3", "'f'");
				command.run(false,       {eval: true},    /**/ "global.dict3", "'toString'");
				command.run(true,        {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				
				command.end();

				
				var command = test.prepareCommand(newTypes.get, "Doodad.Types.get");
				
				command.run(undefined,   {eval: true}     /**/ );
				command.run(undefined,   {eval: true},    /**/ "undefined", "'a'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'", "undefined", "true");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3", "true");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4", "true");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8", "true");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "undefined", "false");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'", "undefined", "false");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2", "false");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5", "false");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6", "false");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8", "false");
				
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'a'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'b'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'c'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'d'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'");
				
				command.run(2,           {eval: true},    /**/ "global.dict2", "'a'", "2");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'b'", "3");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'c'", "4");
				command.run(5,           {eval: true},    /**/ "global.dict2", "'d'", "5");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8");
				
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'", "undefined", "true");
				
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8", "true");
				
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'a'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'d'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'", "undefined", "false");
				
				command.run(2,           {eval: true},    /**/ "global.dict2", "'a'", "2", "false");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict2", "'d'", "5", "false");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6", "false");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8", "false");
				
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'a'");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'b'");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'c'");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'d'");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'");
				
				command.run(2,           {eval: true},    /**/ "global.dict3", "'a'", "2");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'b'", "3");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'c'", "4");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'d'", "5");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8");
				
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "undefined", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "undefined", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'", "undefined", "true");
				
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "5", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8", "true");
				
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'a'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'d'", "undefined", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "undefined", "false");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'", "undefined", "false");
				
				command.run(2,           {eval: true},    /**/ "global.dict3", "'a'", "2", "false");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'d'", "5", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6", "false");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8", "false");
				
				command.run("undefined", {eval: true}     /**/ );
				command.run("undefined", {eval: true},    /**/ "undefined", "'a'");
				command.run(1,           {eval: true},    /**/ "undefined", "'a'", "1");
				command.run(1,           {eval: true},    /**/ "undefined", "'a'", "1", "true");
				command.run(1,           {eval: true},    /**/ "undefined", "'a'", "1", "false");

				command.end();

				
				var command = test.prepareCommand(newTypes.gets, "Doodad.Types.gets");
				
				command.run("{}",                     {eval: true}     /**/ );
				command.run("{}",                     {eval: true},    /**/ "undefined", "'a'");
				command.run("{}",                     {eval: true},    /**/ "global.dict1");
				
				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']");
				command.run("{}",                     {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				command.run("{e: 5}",                 {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']");

				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "undefined", "true");
				command.run("{a: 1, c: 3}",           {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "undefined", "true");
				command.run("{a: 1, c: 3, e: 5}",     {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "undefined", "true");

				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "undefined", "false");
				command.run("{}",                     {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "undefined", "false");
				command.run("{e: 5}",                 {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "undefined", "false");
				
				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");
				command.run("{a: 7, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");
				command.run("{a: 7, c: 9, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");

				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");
				command.run("{a: 1, c: 3, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");
				command.run("{a: 1, c: 3, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");

				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				command.run("{a: 7, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				command.run("{a: 7, c: 9, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				
				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "'a'");

				command.run("{}",                                  {eval: true}     /**/ );
				command.run("{}"       ,                           {eval: true},    /**/ "undefined", "['a']");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}", "true");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}", "false");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}", "true");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}", "false");

				command.end();

				
				var command = test.prepareCommand(newTypes.set, "Doodad.Types.set");
				
				command.run(undefined,   {eval: true}     /**/ );
				command.run(undefined,   {eval: true},    /**/ "undefined", "'a'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict1", "'a'", "2");
				command.run(3,           {eval: true},    /**/ "global.dict1", "'b'", "3");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "4");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "5");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "6");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "7");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'a'", "2");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'b'", "3");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'c'", "4");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'d'", "5");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "6");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "7");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'a'", "2");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'b'", "3");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'c'", "4");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'d'", "5");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'e'", "6");
				command.run(7,           {eval: true},    /**/ "global.dict3", "'f'", "7");

				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict1", "'a'", "2", "true");
				command.run(3,           {eval: true},    /**/ "global.dict1", "'b'", "3", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "4", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "5", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "6", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "7", "true");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict2", "'a'", "2", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'b'", "3", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'c'", "4", "true");
				command.run(5,           {eval: true},    /**/ "global.dict2", "'d'", "5", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "6", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "7", "true");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict3", "'a'", "2", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'b'", "3", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'c'", "4", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict3", "'f'", "7", "true");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict1", "'a'", "2", "false");
				command.run(3,           {eval: true},    /**/ "global.dict1", "'b'", "3", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "4", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "5", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "6", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "7", "false");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'a'", "2", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'b'", "3", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'c'", "4", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'d'", "5", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "6", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "7", "false");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'a'", "2", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'b'", "3", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'c'", "4", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'d'", "5", "false");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'e'", "6", "false");
				command.run(7,           {eval: true},    /**/ "global.dict3", "'f'", "7", "false");
				
				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.sets, "Doodad.Types.sets");
				
				command.run("{}",                                   {eval: true}     /**/ );
				command.run("{}",                                   {eval: true},    /**/ "undefined", "'a'");
				command.run("{}",                                   {eval: true},    /**/ "global.dict1");
				
				command.run("{a: 2, b: 3}",                         {eval: true},    /**/ "global.dict1", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}");
				
				createDicts();
				command.run("{}",                                   {eval: true},    /**/ "global.dict2", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}");
				
				createDicts();
				command.run("{e: 6, f: 7}",                         {eval: true},    /**/ "global.dict3", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}");

				createDicts();
				command.run("{a: 2, b: 3}",                         {eval: true},    /**/ "global.dict1", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "true");
				
				createDicts();
				command.run("{a: 2, b: 3, c: 4, d: 5}",             {eval: true},    /**/ "global.dict2", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "true");
				
				createDicts();
				command.run("{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", {eval: true},    /**/ "global.dict3", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "true");
				
				createDicts();
				command.run("{a: 2, b: 3}",                         {eval: true},    /**/ "global.dict1", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "false");
				
				createDicts();
				command.run("{}",                                   {eval: true},    /**/ "global.dict2", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "false");
				
				createDicts();
				command.run("{e: 6, f: 7}",                         {eval: true},    /**/ "global.dict3", "{a: 2, b: 3, c: 4, d: 5, e: 6, f: 7}", "false");
				
				command.end();
				createDicts();


				var command = test.prepareCommand(newTypes.getDefault, "Doodad.Types.getDefault");
				
				command.run(undefined,   {eval: true}     /**/ );
				command.run(undefined,   {eval: true},    /**/ "undefined", "'a'");
				command.run(undefined,   {eval: true},    /**/ "global.dict1");
				
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3", "true");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4", "true");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3", "true");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4", "true");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "undefined", "false");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'d'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'e'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict1", "'toString'", "undefined", "false");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict1", "'a'", "2", "false");
				command.run(2,           {eval: true},    /**/ "global.dict1", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict1", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict1", "'d'", "5", "false");
				command.run(6,           {eval: true},    /**/ "global.dict1", "'e'", "6", "false");
				command.run(7,           {eval: true},    /**/ "global.dict1", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict1", "'toString'", "8", "false");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict2", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict2", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'d'", "5", "true");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6", "true");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8", "true");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'a'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'d'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'e'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict2", "'toString'", "undefined", "false");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict2", "'a'", "2", "false");
				command.run(3,           {eval: true},    /**/ "global.dict2", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict2", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict2", "'d'", "5", "false");
				command.run(6,           {eval: true},    /**/ "global.dict2", "'e'", "6", "false");
				command.run(7,           {eval: true},    /**/ "global.dict2", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict2", "'toString'", "8", "false");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "undefined", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "undefined", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "5", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "undefined", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "undefined", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "undefined", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "undefined", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "undefined", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "undefined", "true");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'", "undefined", "true");
				
				createDicts();
				command.run(1,           {eval: true},    /**/ "global.dict3", "'a'", "2", "true");
				command.run(2,           {eval: true},    /**/ "global.dict3", "'b'", "3", "true");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'c'", "4", "true");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'d'", "5", "true");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6", "true");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7", "true");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8", "true");
				
				createDicts();
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'a'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'b'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'c'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'d'", "undefined", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "undefined", "false");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "undefined", "false");
				command.run(undefined,   {eval: true},    /**/ "global.dict3", "'toString'", "undefined", "false");
				
				createDicts();
				command.run(2,           {eval: true},    /**/ "global.dict3", "'a'", "2", "false");
				command.run(3,           {eval: true},    /**/ "global.dict3", "'b'", "3", "false");
				command.run(4,           {eval: true},    /**/ "global.dict3", "'c'", "4", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'d'", "5", "false");
				command.run(5,           {eval: true},    /**/ "global.dict3", "'e'", "6", "false");
				command.run(6,           {eval: true},    /**/ "global.dict3", "'f'", "7", "false");
				command.run(8,           {eval: true},    /**/ "global.dict3", "'toString'", "8", "false");
				
				command.run("undefined",                    {eval: true}     /**/ );
				command.run("undefined",                    {eval: true},    /**/ "undefined", "'a'");
				command.run(1,                              {eval: true},    /**/ "undefined", "'a'", "1");
				command.run(1,                              {eval: true},    /**/ "undefined", "'a'", "1", "true");
				command.run(1,                              {eval: true},    /**/ "undefined", "'a'", "1", "false");

				command.end();
				createDicts();

				
				var command = test.prepareCommand(newTypes.getsDefault, "Doodad.Types.getsDefault");
				
				command.run("{}",                     {eval: true}     /**/ );
				command.run("{}",                     {eval: true},    /**/ "undefined", "'a'");
				command.run("{}",                     {eval: true},    /**/ "global.dict1");
				
				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']");
				command.run("{}",                     {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']");
				command.run("{e: 5}",                 {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']");

				createDicts();
				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "undefined", "true");
				command.run("{a: 1, c: 3}",           {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "undefined", "true");
				command.run("{a: 1, c: 3, e: 5}",     {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "undefined", "true");

				createDicts();
				command.run("{a: 1}",                 {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "undefined", "false");
				command.run("{}",                     {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "undefined", "false");
				command.run("{e: 5}",                 {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "undefined", "false");
				
				createDicts();
				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");
				command.run("{a: 7, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");
				command.run("{a: 7, c: 9, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}");

				createDicts();
				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");
				command.run("{a: 1, c: 3, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");
				command.run("{a: 1, c: 3, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "true");

				createDicts();
				command.run("{a: 1, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict1", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				command.run("{a: 7, c: 9, e: 11, toString: 13}",   {eval: true},    /**/ "global.dict2", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				command.run("{a: 7, c: 9, e: 5, toString: 13}",    {eval: true},    /**/ "global.dict3", "['a', 'c', 'e', 'toString']", "{a: 7, c: 9, e: 11, toString: 13}", "false");
				
				createDicts();
				command.run("{a: 1}",                              {eval: true},    /**/ "global.dict1", "'a'");

				command.run("{}",                                  {eval: true}     /**/ );
				command.run("{}"       ,                           {eval: true},    /**/ "undefined", "['a']");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}", "true");
				command.run("{a: 1}",                              {eval: true},    /**/ "undefined", "['a']", "{a: 1, b: 2, c: 3}", "false");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}", "true");
				command.run("{a: 1, c: 3}",                        {eval: true},    /**/ "undefined", "['a', 'c']", "{a: 1, b: 2, c: 3}", "false");

				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.keys, "Doodad.Types.keys");
				command.run("[]",                    {eval: true, contains: true}     /**/ );
				command.run("['a', 'b']",            {eval: true, contains: true},    /**/ "global.dict1");
				command.run("[]",                    {eval: true, contains: true},    /**/ "global.dict2");
				command.run("['e', 'f']",            {eval: true, contains: true},    /**/ "global.dict3");
				command.end();
				
				
				var command = test.prepareCommand(newTypes.keysInherited, "Doodad.Types.keysInherited");
				command.run("[]",                             {eval: true, contains: true}     /**/ );
				command.run("['a', 'b']",                     {eval: true, contains: true},    /**/ "global.dict1");
				command.run("['a', 'b', 'c', 'd']",           {eval: true, contains: true},    /**/ "global.dict2");
				command.run("['a', 'b', 'c', 'd', 'e', 'f']", {eval: true, contains: true},    /**/ "global.dict3");
				command.end();
				
				
				var command = test.prepareCommand(newTypes.complete, "Doodad.Types.complete");
				command.run("undefined",                      {eval: true}     /**/ );
				command.run("{a: 1, b: 2, c: 4, d: 5}",       {eval: true},    /**/ "global.dict1", "{a: 2, b: 3, c: 4, d: 5}");
				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.depthComplete, "Doodad.Types.depthComplete");
				command.run("undefined",                               {eval: true}     /**/ );
				command.run("{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4}}}",         {eval: true, depth: 2},    /**/ "0", "{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4}}}", "{b: {cc: 4, ee: 5}}");
				command.run("{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4}, ee: 5}}",  {eval: true, depth: 2},    /**/ "1", "{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4}}}", "{b: {cc: 4, ee: 5}}");
				command.end();
				
				
				var command = test.prepareCommand(newTypes.extend, "Doodad.Types.extend");
				command.run("{a: 2, b: 3, c: 4, d: 5}",       {eval: true},    /**/ "global.dict1", "{a: 2, b: 3, c: 4, d: 5}");
				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.depthExtend, "Doodad.Types.depthExtend");
				command.run("undefined",                                              {eval: true}            /**/ );
				command.run("{a: {aa: 1, bb: 2}, b: {cc: 4, dd: {aaa: 5}}}",          {eval: true, depth: 2}, /**/ "0", "{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4, bbb: 5}}}", "{b: {cc: 4, dd: {aaa: 5}}}");
				command.run("{a: {aa: 1, bb: 2}, b: {cc: 4, dd: {aaa: 5}}}",          {eval: true, depth: 2}, /**/ "1", "{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4, bbb: 5}}}", "{b: {cc: 4, dd: {aaa: 5}}}");
				command.run("{a: {aa: 1, bb: 2}, b: {cc: 4, dd: {aaa: 5, bbb: 5}}}",  {eval: true, depth: 2}, /**/ "2", "{a: {aa: 1, bb: 2}, b: {cc: 3, dd: {aaa: 4, bbb: 5}}}", "{b: {cc: 4, dd: {aaa: 5}}}");
				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.fill, "Doodad.Types.fill");
				command.run("undefined",                        {eval: true}     /**/ );
				command.run("{a: 1, b: 2}",                     {eval: true},    /**/ "undefined", "global.dict1", "{a: 2, b: 3, c: 4, d: 5}");

				createDicts();
				command.run("{a: 2, b: 2}",                     {eval: true},    /**/ "'a'", "global.dict1", "{a: 2, b: 3, c: 4, d: 5}");

				createDicts();
				command.run("{a: 2, b: 2, c: 4}",               {eval: true},    /**/ "['a', 'c']", "global.dict1", "{a: 2, b: 3, c: 4, d: 5}");

				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.values, "Doodad.Types.values");
				command.run("[]",                    {eval: true, contains: true}     /**/ );
				command.run("[1, 2]",                {eval: true, contains: true},    /**/ "global.dict1");
				command.run("[]",                    {eval: true, contains: true},    /**/ "global.dict2");
				command.run("[5, 6]",                {eval: true, contains: true},    /**/ "global.dict3");
				command.end();
				
				
				var command = test.prepareCommand(newTypes.items, "Doodad.Types.items");
				command.run("[]",                    {eval: true, contains: true, depth: 1}     /**/ );
				command.run("[['a', 1], ['b', 2]]",  {eval: true, contains: true, depth: 1},    /**/ "global.dict1");
				command.run("[]",                    {eval: true, contains: true, depth: 1},    /**/ "global.dict2");
				command.run("[['e', 5], ['f', 6]]",  {eval: true, contains: true, depth: 1},    /**/ "global.dict3");
				command.end();
				
				
				var command = test.prepareCommand(newTypes.popAt, "Doodad.Types.popAt");
				command.run(undefined,  {eval: true}     /**/ );
				command.run(undefined,  {eval: true},    /**/  "global.dict1");
				createDicts();
				command.run(1,          {eval: true},    /**/  "global.dict1", "'a'");
				createDicts();
				command.run(2,          {eval: true},    /**/  "global.dict1", "'b'");
				createDicts();
				command.run(undefined,  {eval: true},    /**/  "global.dict1", "'c'");
				command.end();
				createDicts();

				var command = test.prepareCommand(newTypes.popItem, "Doodad.Types.popItem");
				command.run(undefined,  {eval: true}     /**/ );
				command.run(undefined,  {eval: true},    /**/  "global.dict1");
				command.run(undefined,  {eval: true},    /**/  "global.dict1", 0);
				createDicts();
				command.run(1,          {eval: true},    /**/  "global.dict1", 1);
				createDicts();
				command.run(2,          {eval: true},    /**/  "global.dict1", 2);
				createDicts();
				command.run(undefined,  {eval: true},    /**/  "global.dict1", 3);
				createDicts();
				command.run(1,          {eval: true, contains: true}, /**/  "global.dict1", "function(val, key, obj){return val === 1}");
				command.end();
				createDicts();

				var command = test.prepareCommand(newTypes.popItems, "Doodad.Types.popItems");
				command.run("[]",       {eval: true, contains: true}  /**/ );
				command.run("[]",       {eval: true, contains: true}, /**/  "global.dict1");
				command.run("[]",       {eval: true, contains: true}, /**/  "global.dict1", "[0]");
				createDicts();
				command.run("[1]",      {eval: true, contains: true}, /**/  "global.dict1", "[0, 1]");
				createDicts();
				command.run("[1, 2]",   {eval: true, contains: true}, /**/  "global.dict1", "[0, 1, 2]");
				createDicts();
				command.run("[1, 2]",   {eval: true, contains: true}, /**/  "global.dict1", "{a: 0, b: 1, c: 2}");
				createDicts();
				command.run("[1]",      {eval: true, contains: true}, /**/  "global.dict1", "function(val, key, obj){return val === 1}");
				command.end();
				createDicts();
				
				
				var command = test.prepareCommand(newTypes.isClonable, "Doodad.Types.isClonable");
				command.run(false,      {eval: true}     /**/ );
				command.run(true,       {eval: true},    /**/  "global.dict1");
				command.end();
				
				var command = test.prepareCommand(newTypes.clone, "Doodad.Types.clone");
				command.run("undefined",    {eval: true}     /**/ );
				command.run("global.dict1", {eval: true, not: true, mode: 'compare'},  /**/  "global.dict1");
				command.run("{a: 1, b: 2}", {eval: true},    /**/  "global.dict1");
				command.end();
			},
		},
	};
})();