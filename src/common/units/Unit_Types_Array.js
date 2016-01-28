//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Unit_Types_Array.js - Unit testing module file
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
		DD_MODULES['Doodad.Test.Types.Array'] = {
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

					
					var createArrays = function createArrays() {
						global.ar1 = [1, 2, 9, 10];
						global.ar1.a = 3;
						delete global.ar1[2];
						delete global.ar1[3];
						
						global.ar2 = [1, 2, 3];
						delete global.ar2[0];
					};
					
					createArrays();
					
					
					var command = test.prepareCommand(newTypes.hasKey, "Doodad.Types.hasKey");
					
					command.run(false,       {eval: true}     /**/ );
					command.run(false,       {eval: true},    /**/ "global.ar1");
					command.run(true,        {eval: true},    /**/ "global.ar1", "0");
					command.run(true,        {eval: true},    /**/ "global.ar1", "1");
					command.run(false,       {eval: true},    /**/ "global.ar1", "2");
					command.run(true,        {eval: true},    /**/ "global.ar1", "'a'");
					command.run(false,       {eval: true},    /**/ "global.ar1", "'b'");
					command.run(false,       {eval: true},    /**/ "global.ar1", "'toString'");

					command.end();

					
					var command = test.prepareCommand(newTypes.hasKeyInherited, "Doodad.Types.hasKeyInherited");
					
					command.run(false,       {eval: true}     /**/ );
					command.run(false,       {eval: true},    /**/ "global.ar1");
					command.run(true,        {eval: true},    /**/ "global.ar1", "0");
					command.run(true,        {eval: true},    /**/ "global.ar1", "1");
					command.run(false,       {eval: true},    /**/ "global.ar1", "2");
					command.run(true,        {eval: true},    /**/ "global.ar1", "'a'");
					command.run(false,       {eval: true},    /**/ "global.ar1", "'b'");
					command.run(false,       {eval: true},    /**/ "global.ar1", "'toString'");
					
					command.end();

					
					var command = test.prepareCommand(newTypes.get, "Doodad.Types.get");
					
					command.run("undefined", {eval: true}     /**/ );
					command.run("undefined", {eval: true},    /**/ "global.ar1");

					command.run(1,           {eval: true},    /**/ "global.ar1", "0");
					command.run(2,           {eval: true},    /**/ "global.ar1", "1");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "2");
					command.run(3,           {eval: true},    /**/ "global.ar1", "'a'");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "'b'");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "'toString'");

					command.run(1,           {eval: true},    /**/ "global.ar1", "0", "4");
					command.run(2,           {eval: true},    /**/ "global.ar1", "1", "4");
					command.run(4,           {eval: true},    /**/ "global.ar1", "2", "4");
					command.run(3,           {eval: true},    /**/ "global.ar1", "'a'", "4");
					command.run(4,           {eval: true},    /**/ "global.ar1", "'b'", "4");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "'toString'");

					command.end();

					
					var command = test.prepareCommand(newTypes.gets, "Doodad.Types.gets");
					
					command.run("{}",        {eval: true}     /**/ );
					command.run("{}",        {eval: true},    /**/ "global.ar1");
					command.run("{}",        {eval: true},    /**/ "global.ar1");

					command.run("{'0': 1}",  {eval: true},    /**/ "global.ar1", "0");
					command.run("{'1': 2}",  {eval: true},    /**/ "global.ar1", "1");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "2");
					command.run("{'a': 3}",  {eval: true},    /**/ "global.ar1", "'a'");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "'b'");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "'toString'");

					command.run("{'0': 1}",  {eval: true},    /**/ "global.ar1", "0", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'1': 2}",  {eval: true},    /**/ "global.ar1", "1", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'2': 6}",  {eval: true},    /**/ "global.ar1", "2", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'a': 3}",  {eval: true},    /**/ "global.ar1", "'a'", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'b': 8}",  {eval: true},    /**/ "global.ar1", "'b'", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'toString': 9}", {eval: true},  /**/ "global.ar1", "'toString'", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");

					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0]");
					command.run("{'0': 1, 'a': 3}",  {eval: true},    /**/ "global.ar1", "[0, 'a']");
					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0, 'b']");

					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0]", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'0': 1, 'a': 3}",  {eval: true},    /**/ "global.ar1", "[0, 'a']", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'0': 1, 'b': 8}",  {eval: true},    /**/ "global.ar1", "[0, 'b']", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");

					command.end();

					
					var command = test.prepareCommand(newTypes.set, "Doodad.Types.set");
					
					command.run(4,           {eval: true},    /**/ "global.ar1", "0", "4");
					command.run(5,           {eval: true},    /**/ "global.ar1", "1", "5");
					command.run(undefined,   {eval: true},    /**/ "global.ar1", "2", "6");
					command.run(7,           {eval: true},    /**/ "global.ar1", "'a'", "7");
					command.run(undefined,   {eval: true},    /**/ "global.ar1", "'b'", "8");

					command.end();
					createArrays();
					
					
					var command = test.prepareCommand(newTypes.sets, "Doodad.Types.sets");
					
					command.run("{'0': 4}",  {eval: true},    /**/ "global.ar1", "{'0': 4}");
					command.run("{'1': 5}",  {eval: true},    /**/ "global.ar1", "{'1': 5}");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "{'2': 6}");
					command.run("{'a': 7}",  {eval: true},    /**/ "global.ar1", "{'a': 7}");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "{'b': 8}");
					createArrays();

					command.run("{'0': 4, 'a': 7}",  {eval: true},    /**/ "global.ar1", "{'0': 4, 'a': 7}");
					createArrays();

					command.run("{'0': 4, 'a': 7}",  {eval: true},    /**/ "global.ar1", "{'0': 4, 'a': 7, 'b': 8}");

					command.end();
					createArrays();


					var command = test.prepareCommand(newTypes.getDefault, "Doodad.Types.getDefault");
					
					command.run("undefined", {eval: true}     /**/ );
					command.run("undefined", {eval: true},    /**/ "global.ar1");

					command.run(1,           {eval: true},    /**/ "global.ar1", "0");
					command.run(2,           {eval: true},    /**/ "global.ar1", "1");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "2");
					command.run(3,           {eval: true},    /**/ "global.ar1", "'a'");
					command.run("undefined", {eval: true},    /**/ "global.ar1", "'b'");
					createArrays();

					command.run(1,           {eval: true},    /**/ "global.ar1", "0", "4");
					command.run(2,           {eval: true},    /**/ "global.ar1", "1", "4");
					command.run(4,           {eval: true},    /**/ "global.ar1", "2", "4");
					command.run(3,           {eval: true},    /**/ "global.ar1", "'a'", "4");
					command.run(4,           {eval: true},    /**/ "global.ar1", "'b'", "4");

					command.end();
					createArrays();

					
					var command = test.prepareCommand(newTypes.getsDefault, "Doodad.Types.getsDefault");
					
					command.run("{}",        {eval: true}     /**/ );
					command.run("{}",        {eval: true},    /**/ "global.ar1");
					command.run("{}",        {eval: true},    /**/ "global.ar1");

					command.run("{'0': 1}",  {eval: true},    /**/ "global.ar1", "0");
					command.run("{'1': 2}",  {eval: true},    /**/ "global.ar1", "1");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "2");
					command.run("{'a': 3}",  {eval: true},    /**/ "global.ar1", "'a'");
					command.run("{}",        {eval: true},    /**/ "global.ar1", "'b'");
					createArrays();

					command.run("{'0': 1}",  {eval: true},    /**/ "global.ar1", "0", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'1': 2}",  {eval: true},    /**/ "global.ar1", "1", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'2': 6}",  {eval: true},    /**/ "global.ar1", "2", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'a': 3}",  {eval: true},    /**/ "global.ar1", "'a'", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'b': 8}",  {eval: true},    /**/ "global.ar1", "'b'", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					createArrays();

					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0]");
					command.run("{'0': 1, 'a': 3}",  {eval: true},    /**/ "global.ar1", "[0, 'a']");
					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0, 'b']");
					createArrays();

					command.run("{'0': 1}",          {eval: true},    /**/ "global.ar1", "[0]", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'0': 1, 'a': 3}",  {eval: true},    /**/ "global.ar1", "[0, 'a']", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					command.run("{'0': 1, 'b': 8}",  {eval: true},    /**/ "global.ar1", "[0, 'b']", "{'0': 4, '1': 5, '2': 6, 'a': 7, 'b': 8, toString: 9}");
					createArrays();

					command.end();
					
					
					var command = test.prepareCommand(newTypes.keys, "Doodad.Types.keys");
					command.run("[]",                    {eval: true}     /**/ );
					command.run("['a']",                 {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.keysInherited, "Doodad.Types.keysInherited");
					command.run("[]",                    {eval: true}     /**/ );
					command.run("['a']",                 {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.values, "Doodad.Types.values");
					command.run("[]",                    {eval: true}     /**/ );
					command.run("[1, 2]",                {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.items, "Doodad.Types.items");
					command.run("[]",                    {eval: true, depth: 1}     /**/ );
					command.run("[[0, 1], [1, 2]]",      {eval: true, depth: 1},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.hasIndex, "Doodad.Types.hasIndex");
					command.run(false, {eval: true}     /**/ );
					command.run(false, {eval: true},    /**/ "global.ar1");
					command.run(true,  {eval: true},    /**/ "global.ar1", "0");
					command.run(true,  {eval: true},    /**/ "global.ar1", "1");
					command.run(false, {eval: true},    /**/ "global.ar1", "2");
					command.run(false, {eval: true},    /**/ "global.ar1", "'a'");
					command.run(false, {eval: true},    /**/ "global.ar1", "'b'");
					command.run(false, {eval: true},    /**/ "global.ar1", "'toString'");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.indexes, "Doodad.Types.indexes");
					command.run("[]",                    {eval: true}     /**/ );
					command.run("[0, 1]",                {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.available, "Doodad.Types.available");
					command.run(-1,    {eval: true}     /**/ );
					command.run(-1,     {eval: true},   /**/ "[]");
					command.run(-1,     {eval: true},   /**/ "[0, 1]");
					command.run(2,     {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.availables, "Doodad.Types.availables");
					command.run("[]",                    {eval: true}     /**/ );
					command.run("[2, 3]",                {eval: true},    /**/ "global.ar1");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.getFirstIndex, "Doodad.Types.getFirstIndex");
					command.run(undefined,  {eval: true}     /**/ );
					command.run(0,          {eval: true},    /**/ "global.ar1");
					command.run(1,          {eval: true},    /**/ "global.ar2");
					command.end();
					
					
					var command = test.prepareCommand(newTypes.getFirstValue, "Doodad.Types.getFirstValue");
					command.run(undefined,  {eval: true}     /**/ );
					command.run(1,          {eval: true},    /**/ "global.ar1");
					command.run(2,          {eval: true},    /**/ "global.ar2");
					command.end();
					
					var command = test.prepareCommand(newTypes.popAt, "Doodad.Types.popAt");
					command.run(undefined,  {eval: true}     /**/ );
					command.run(undefined,  {eval: true},    /**/  "global.ar1");
					createArrays();
					command.run(1,          {eval: true},    /**/  "global.ar1", 0);
					createArrays();
					command.run(2,          {eval: true},    /**/  "global.ar1", 1);
					createArrays();
					command.run(undefined,  {eval: true},    /**/  "global.ar1", 2);
					createArrays();
					command.run(undefined,  {eval: true},    /**/  "global.ar1", 3);
					createArrays();
					command.run(undefined,  {eval: true},    /**/  "global.ar1", 4);
					createArrays();
					command.run(3,          {eval: true},    /**/  "global.ar1", "'a'");
					createArrays();
					command.run(undefined,  {eval: true},    /**/  "global.ar1", "'b'");
					command.end();
					createArrays();

					var command = test.prepareCommand(newTypes.popItem, "Doodad.Types.popItem");
					command.run(undefined,  {eval: true}     /**/ );
					command.run(undefined,  {eval: true},    /**/  "global.ar1");
					command.run(undefined,  {eval: true},    /**/  "global.ar1", 0);
					createArrays();
					command.run(1,          {eval: true},    /**/  "global.ar1", 1);
					createArrays();
					command.run(2,          {eval: true},    /**/  "global.ar1", 2);
					createArrays();
					command.run(3,          {eval: true},    /**/  "global.ar1", 3);
					createArrays();
					command.run(1,          {eval: true, contains: true}, /**/  "global.ar1", "function(val, key, obj){return val === 1}");
					command.end();
					createArrays();

					var command = test.prepareCommand(newTypes.popItems, "Doodad.Types.popItems");
					command.run("[]",       {eval: true, contains: true}  /**/ );
					command.run("[]",       {eval: true, contains: true}, /**/  "global.ar1");
					command.run("[]",       {eval: true, contains: true}, /**/  "global.ar1", "[0]");
					createArrays();
					command.run("[1]",      {eval: true, contains: true}, /**/  "global.ar1", "[0, 1]");
					createArrays();
					command.run("[1, 2]",   {eval: true, contains: true}, /**/  "global.ar1", "[0, 1, 2]");
					createArrays();
					command.run("[1, 2]",   {eval: true, contains: true}, /**/  "global.ar1", "{a: 0, b: 1, c: 2}");
					createArrays();
					command.run("[1]",      {eval: true, contains: true}, /**/  "global.ar1", "function(val, key, obj){return val === 1}");
					command.end();
					createArrays();
					
					var command = test.prepareCommand(newTypes.append, "Doodad.Types.append");
					command.run(null,                                           {eval: true}     /**/ );
					command.run("[1, 2, test.EmptySlot, test.EmptySlot]",       {eval: true},    /**/ "global.ar1");
					command.run("[1, 2, test.EmptySlot, test.EmptySlot, 3, 4]", {eval: true},    /**/ "global.ar1", "[3, 4]");
					createArrays();
					command.run("[test.EmptySlot, 2, 3, 4, 5]",                 {eval: true},    /**/ "global.ar2", "[4, 5]");
					createArrays();
					command.run("[test.EmptySlot, 2, 3, 4, 5, 6, 7]",           {eval: true},    /**/ "global.ar2", "[4, 5]", "[6, 7]");
					command.end();
					createArrays();
					
					
					var command = test.prepareCommand(newTypes.prepend, "Doodad.Types.prepend");
					command.run(null,                                           {eval: true}     /**/ );
					command.run("[1, 2, test.EmptySlot, test.EmptySlot]",       {eval: true},    /**/ "global.ar1");
					command.run("[3, 4, 1, 2, test.EmptySlot, test.EmptySlot]", {eval: true},    /**/ "global.ar1", "[3, 4]");
					createArrays();
					command.run("[4, 5, test.EmptySlot, 2, 3]",                 {eval: true},    /**/ "global.ar2", "[4, 5]");
					createArrays();
					command.run("[6, 7, 4, 5, test.EmptySlot, 2, 3]",           {eval: true},    /**/ "global.ar2", "[4, 5]", "[6, 7]");
					command.end();
					createArrays();
					
					var command = test.prepareCommand(newTypes.isClonable, "Doodad.Types.isClonable");
					command.run(false,      {eval: true}     /**/ );
					command.run(true,       {eval: true},    /**/  "global.ar1");
					command.end();
					
					var command = test.prepareCommand(newTypes.clone, "Doodad.Types.clone");
					command.run("undefined",  {eval: true}                               /**/ );
					command.run("global.ar1", {eval: true, not: true, mode: 'compare'},    /**/  "global.ar1");
					command.run("[1, 2, test.EmptySlot, test.EmptySlot]", {eval: true},  /**/  "global.ar1");
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