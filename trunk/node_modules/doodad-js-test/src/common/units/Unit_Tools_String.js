//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Class library for Javascript (BETA) with some extras (ALPHA)
// File: Unit_Tools_String.js - Unit testing module file
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
	global.DD_MODULES['Doodad.Test.Tools.String'] = {
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
				command.run(null,                                             {repetitions: 100}, /**/ "hi there !");
				command.run(null,                                             {repetitions: 100}, /**/ "hi there !", "z");
				command.run(5,                                                {repetitions: 100}, /**/ "hi there !", "e");
				command.run(5,                                                {repetitions: 100}, /**/ "hi there !", function(val, key, obj) {return val === "e"});

				command.end();
				
				
				var command = test.prepareCommand(newTools.findLastItem, "Doodad.Tools.findLastItem");
				
				command.run(null,                                             {repetitions: 100}  /**/);
				command.run(null,                                             {repetitions: 100}, /**/ "hi there !");
				command.run(null,                                             {repetitions: 100}, /**/ "hi there !", "z");
				command.run(7,                                                {repetitions: 100}, /**/ "hi there !", "e");
				command.run(7,                                                {repetitions: 100}, /**/ "hi there !", function(val, key, obj) {return val === "e"});

				command.end();
				
				
				var command = test.prepareCommand(newTools.findItems, "Doodad.Tools.findItems");
				
				command.run([],                                               {repetitions: 100}  /**/);
				command.run([],                                               {repetitions: 100}, /**/ "hi there !");
				command.run([],                                               {repetitions: 100}, /**/ "hi there !", "z");
				command.run([5, 7],                                           {contains: true, repetitions: 100}, /**/ "hi there !", "e");
				command.run([5, 7],                                           {contains: true, repetitions: 100}, /**/ "hi there !", function(val, key, obj) {return val === "e"});

				command.end();
				
				
				var command = test.prepareCommand(newTools.repeat, "Doodad.Tools.repeat");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "a");
				command.run("",                                               {repetitions: 100}, /**/ "a", 0);
				command.run("a",                                              {repetitions: 100}, /**/ "a", 1);
				command.run("aa",                                             {repetitions: 100}, /**/ "a", 2);
				command.run("aaaaa",                                          {repetitions: 100}, /**/ "a", 5);
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.trim, "Doodad.Tools.trim");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "a", 0);
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "  a  ", " ", "");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "  a  ", " ", 0, "");
				command.run("a",                                              {repetitions: 100}, /**/ "  a  ");
				command.run("a",                                              {repetitions: 100}, /**/ "  a  ", " ");
				command.run("a",                                              {repetitions: 100}, /**/ "  a  ", " ", 0);
				command.run("a  ",                                            {repetitions: 100}, /**/ "  a  ", " ", 1);
				command.run("  a",                                            {repetitions: 100}, /**/ "  a  ", " ", -1);
				command.run(" a ",                                            {repetitions: 100}, /**/ "  a  ", " ", 0, 1);
				command.run("  a  ",                                          {repetitions: 100}, /**/ "  a  ", "_");
				command.run(" a ",                                            {repetitions: 100}, /**/ "_ a _", "_");
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.replace, "Doodad.Tools.replace");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", 0);
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "a");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "a", 0);
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "a", " ", 0);
				command.run(" bcabcabc",                                      {repetitions: 100}, /**/ "abcabcabc", "a", " ");
				command.run(" bc bc bc",                                      {repetitions: 100}, /**/ "abcabcabc", "a", " ", "g");
				command.run(" bc bc bc",                                      {repetitions: 100}, /**/ "abcabcabc", new RegExp("a", "g"), " ");
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.search, "Doodad.Tools.search");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", 1);
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "b", "");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "b", 0, "");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcabcabc", "b", 0, 1, 0);
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", "b");
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", "b", 0);
				command.run(4,                                                {repetitions: 100}, /**/ "abcabcabc", "b", 2);
				command.run(-1,                                               {repetitions: 100}, /**/ "abcabcabc", "b", 0, 0);
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", "b", 0, 1);
				command.run(4,                                                {repetitions: 100}, /**/ "abcabcabc", "b", 2, 4);
				command.run(NaN,                                              {repetitions: 100}, /**/ "abcabcabc", "b", undefined, undefined, "a");
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b"));
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), 0);
				command.run(newTypes.TypeError,                               {mode: 'isinstance', repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), 2);
				command.run(4,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b", "g"), 2);
				command.run(-1,                                               {repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), 0, 0);
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), 0, 1);
				command.run(newTypes.TypeError,                               {mode: 'isinstance', repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), 2, 4);
				command.run(4,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b", "g"), 2, 4);
				command.run(NaN,                                              {repetitions: 100}, /**/ "abcabcabc", new RegExp("b"), undefined, undefined, "a");
				command.run(newTypes.TypeError,                               {mode: 'isinstance', repetitions: 100}, /**/ "abcabcabc", new RegExp("b", "g"), 1, undefined, new RegExp("a"));
				command.run(1,                                                {repetitions: 100}, /**/ "abcabcabc", new RegExp("b", "g"), 1, undefined, new RegExp("a", "g"));
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.join, "Doodad.Tools.join");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ ['a', 'b', 'c'], 0);
				command.run("abc",                                            {repetitions: 100}, /**/ ['a', 'b', 'c']);
				command.run("a,b,c",                                          {repetitions: 100}, /**/ ['a', 'b', 'c'], ",");
				command.run("1,2,3",                                          {repetitions: 100}, /**/ [1, 2, 3], ",");
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.title, "Doodad.Tools.title");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ 0);
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "cHarLie bRaVO", 0);
				command.run("",                                               {repetitions: 100}, /**/ "");
				command.run(" ",                                              {repetitions: 100}, /**/ " ");
				command.run("Charlie Bravo",                                  {repetitions: 100}, /**/ "cHarLie bRaVO");
				command.run("Charlie Bravo",                                  {repetitions: 100}, /**/ "cHarLie bRaVO", "");
				command.run("Charlie Bravo",                                  {repetitions: 100}, /**/ "cHarLie bRaVO", " ");
				command.run("Charlie-bravo",                                  {repetitions: 100}, /**/ "cHarLie-bRaVO");
				command.run("Charlie-Bravo",                                  {repetitions: 100}, /**/ "cHarLie-bRaVO", "-");
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.format, "Doodad.Tools.format");
				
				command.run("hi",                                             {repetitions: 100}, /**/ "~0~", ["hi", "there"]);
				command.run("there",                                          {repetitions: 100}, /**/ "~1~", ["hi", "there"]);
				command.run("hi hi",                                          {repetitions: 100}, /**/ "~0~ ~0~", ["hi", "there"]);
				command.run("hi there",                                       {repetitions: 100}, /**/ "~0~ ~1~", ["hi", "there"]);
				command.run(" hi there !",                                    {repetitions: 100}, /**/ " ~0~ ~1~ !", ["hi", "there"]);
				command.run(" hi there !",                                    {repetitions: 100}, /**/ " ~a~ ~b~ !", {a: "hi", b: "there"});
				
				command.end();
				
				
				var command = test.prepareCommand(newTools.indexOf, "Doodad.Tools.indexOf");
				
				command.run(-1,                                               {repetitions: 100}  /**/);
				command.run(-1,                                               {repetitions: 100}, /**/ "hi there !");
				command.run(-1,                                               {repetitions: 100}, /**/ "hi there !", "z");
				command.run(5,                                                {repetitions: 100}, /**/ "hi there !", "e");

				command.end();
				
				
				var command = test.prepareCommand(newTools.lastIndexOf, "Doodad.Tools.lastIndexOf");
				
				command.run(-1,                                               {repetitions: 100}  /**/);
				command.run(-1,                                               {repetitions: 100}, /**/ "hi there !");
				command.run(-1,                                               {repetitions: 100}, /**/ "hi there !", "z");
				command.run(7,                                                {repetitions: 100}, /**/ "hi there !", "e");

				command.end();
				
				
				var command = test.prepareCommand(newTools.map, "Doodad.Tools.map");
				
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}  /**/ );
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcdef");
				newRoot.DD_ASSERT && command.run(newTypes.AssertionFailed,    {mode: 'isinstance'}, /**/ "abcdef", "");
				command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ "abcdef", function(val, key, obj) {return val});

				command.end();
				
				
				var command = test.prepareCommand(function(obj) {
					var result = [];
					newTools.forEach(obj, function(val, key, obj) {
						result.push(val);
					});
					return result;
				}, "Doodad.Tools.forEach");
				
				command.run([],                                               {repetitions: 100}  /**/ );
				command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ "abcdef");

				command.end();
				
				
				var command = test.prepareCommand(newTools.filter, "Doodad.Tools.filter");
				
				command.run(undefined,                                        {repetitions: 100}  /**/);
				command.run([],                                               {repetitions: 100}, /**/ "abcdefabcdef");
				command.run(['a', 'a'],                                       {repetitions: 100}, /**/ "abcdefabcdef", "a");
				command.run(['a', 'a'],                                       {repetitions: 100}, /**/ "abcdefabcdef", ['a']);
				command.run(['a', 'b', 'a', 'b'],                             {repetitions: 100}, /**/ "abcdefabcdef", ['a', 'b']);
				command.run(['a', 'a'],                                       {repetitions: 100}, /**/ "abcdefabcdef", function(val, key, obj) {return val === 'a'});
				command.run(['c', 'd', 'e', 'f', 'c', 'd', 'e', 'f'],         {repetitions: 100}, /**/ "abcdefabcdef", ['a', 'b'], null, true);
				command.run(['c', 'd', 'e', 'f', 'c', 'd', 'e', 'f'],         {repetitions: 100}, /**/ "abcdefabcdef", function(val, key, obj) {return val === 'a' || val === 'b'}, null, true);

				command.end();
				
				
				var command = test.prepareCommand(newTools.filterKeys, "Doodad.Tools.filterKeys");
				
				command.run(undefined,                                        {repetitions: 100}  /**/);
				command.run([],                                               {repetitions: 100}, /**/ "abcdefabcdef");
				command.run(['a'],                                            {repetitions: 100}, /**/ "abcdefabcdef", [0]);
				command.run(['a', 'b']          ,                             {repetitions: 100}, /**/ "abcdefabcdef", [0, 1]);
				command.run(['a'],                                            {repetitions: 100}, /**/ "abcdefabcdef", function(val, key, obj) {return key === 0});
				command.run(['c', 'd', 'e', 'f', 'a', 'b', 'c', 'd', 'e', 'f'], {repetitions: 100}, /**/ "abcdefabcdef", [0, 1], null, true);
				command.run(['c', 'd', 'e', 'f', 'a', 'b', 'c', 'd', 'e', 'f'], {repetitions: 100}, /**/ "abcdefabcdef", function(val, key, obj) {return key === 0 || key === 1}, null, true);

				command.end();
				
				
				var command = test.prepareCommand(newTools.every, "Doodad.Tools.every");
				
				command.run(false,                                            {repetitions: 100}  /**/);
				command.run(true,                                             {repetitions: 100}, /**/ "");
				command.run(true,                                             {repetitions: 100}, /**/ "", "a");
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaaa", "a");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaaa", ["a"]);
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa", "b");
				command.run(true,                                             {repetitions: 100}, /**/ "ababa", "ab");
				command.run(false,                                            {repetitions: 100}, /**/ "ababa", ["ab"]);
				command.run(true,                                             {repetitions: 100}, /**/ "ababa", ["a", "b"]);
				command.run(true,                                             {repetitions: 100}, /**/ "ababa", ["a", "b", "c"]);
				command.run(true,                                             {repetitions: 100}, /**/ "ababa", {val1: "a", val2: "b"});
				command.run(true,                                             {repetitions: 100}, /**/ "ababa", {val1: "a", val2: "b", val3: "c"});
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa", "a", null, true);
				command.run(true,                                             {repetitions: 100}, /**/ "aaaaa", "b", null, true);
				command.run(true,                                             {repetitions: 100}, /**/ "aaaaa", function(val, key, obj) {return val === "a"});
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa", function(val, key, obj) {return val === "a"}, null, true);

				command.end();
				
				
				var command = test.prepareCommand(newTools.some, "Doodad.Tools.some");
				
				command.run(false,                                            {repetitions: 100}  /**/);
				command.run(false,                                            {repetitions: 100}, /**/ "");
				command.run(false,                                            {repetitions: 100}, /**/ "", "b");
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", "b");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", ["b"]);
				command.run(false,                                            {repetitions: 100}, /**/ "aaaaa", "b");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", "bc");
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", ["b", "c"]);
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", {val1: "b", val2: "c"});
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", "b", null, true);
				command.run(false,                                            {repetitions: 100}, /**/ "aaaba", ["a", "b"], null, true);
				command.run(true,                                             {repetitions: 100}, /**/ "aaaba", function(val, key, obj) {return val === "b"});
				command.run(false,                                            {repetitions: 100}, /**/ "aaaba", function(val, key, obj) {return val === "a" || val === "b"}, null, true);

				command.end();
				
				
				var command = test.prepareCommand(newTools.reduce, "Doodad.Tools.reduce");
				
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'}   /**/);
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ "");
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ "", 1);
				command.run(newTypes.TypeError,                               {mode: 'isinstance'},  /**/ "", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48});
				command.run(0,                                                {repetitions: 100}, /**/ "", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
				command.run(6,                                                {repetitions: 100}, /**/ "123", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
				command.run("123",                                            {repetitions: 100}, /**/ "123", function(result, val, key, obj) {return result + val}, "");

				command.end();
				
				
				var command = test.prepareCommand(newTools.reduceRight, "Doodad.Tools.reduceRight");
				
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'}   /**/);
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ "");
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ "", 1);
				command.run(newTypes.TypeError,                               {mode: 'isinstance'},  /**/ "", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48});
				command.run(0,                                                {repetitions: 100}, /**/ "", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
				command.run(6,                                                {repetitions: 100}, /**/ "123", function(result, val, key, obj) {return result + val.charCodeAt(0) - 48}, 0);
				command.run("321",                                            {repetitions: 100}, /**/ "123", function(result, val, key, obj) {return result + val}, "");

				command.end();

				
				var command = test.prepareCommand(newTools.unique, "Doodad.Tools.unique");
				
				command.run([],                                               {repetitions: 100}  /**/);
				command.run(newTypes.AssertionFailed,                         {mode: 'isinstance'},  /**/ 1);
				command.run(['a', 'b', 'c'],                                  {repetitions: 100}, /**/ "abcabc");
				command.run(['a', 'b', 'c', 'd', 'e', 'f'],                   {repetitions: 100}, /**/ "abcabc", "defdef");

				command.end();

				
			},
		},
	};
})();