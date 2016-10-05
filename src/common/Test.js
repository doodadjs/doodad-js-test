//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Test.js - Testing
// Project home: https://github.com/doodadjs/
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

module.exports = {
	add: function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Test'] = {
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
			proto: function(root) {
				const types = root.Doodad.Types;
				return {
					TESTS_COUNT: types.WRITABLE(0),
					FAILED_TESTS: types.WRITABLE(0),
					CHILDREN: types.WRITABLE(null),
					CURRENT_UNIT: types.WRITABLE(null),
				};
			},

			create: function create(root, /*optional*/_options, _shared) {
				"use strict";
				
				root.enableAsserts();
				
				// Unit test module entry
				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					namespaces = doodad.Namespaces,
					entries = namespaces.Entries,
					io = doodad.IO,
					ioMixIns = io.MixIns,
					client = doodad.Client,
					clientIO = client && client.IO,
					nodejs = doodad.NodeJs,
					test = doodad.Test;
					
				types.complete(_shared.Natives, {
					windowParseInt: global.parseInt,
					windowIsNaN: global.isNaN,
				});
					
				var __Internal__ = {
					stdout: null,
				};
				
				entries.TestModule = types.INIT(entries.Module.$inherit(
					/*typeProto*/
					{
						$TYPE_NAME: 'TestModuleEntry'
					}
				));
				
				entries.TestPackage = types.INIT(entries.Package.$inherit(
					/*typeProto*/
					{
						$TYPE_NAME: 'TestPackageEntry'
					}
				));
				
				test.setOutput = function setOutput(stream) {
					__Internal__.stdout = stream;
				};

				test.getOutput = function getOutput(stream) {
					return __Internal__.stdout || io.stdout;
				};

				test.getUnits = function getUnits(namespace) {
					var units = namespace.CHILDREN;
					if (!units) {
						units = namespace.CHILDREN = [];
						for (var name in namespace) {
							if (types.has(namespace, name)) {
								var nso = namespace[name];
								if ((nso instanceof root.Namespace) && (nso.DD_PARENT === namespace)) {
									var unit = namespaces.get(nso.DD_FULL_NAME, entries.TestModule);
									if (unit) {
										var pos,
											len = units.length,
											priority = (types.isNothing(nso.priority) ? 20 : nso.priority);
										for (pos = 0; pos < len; pos++) {
											var item = units[pos];
											if (item.priority > priority) {
												priority = null;
												units.splice(pos, 0, uniy);
												break;
											};
										};
										if (priority !== null) {
											units.push(unit);
										};
									};
								};
							};
						};
					};
					return units;
				};
				
				test.getUnit = function getUnit(name) {
					return namespaces.get(name, entries.TestModule);
				};
				
				test.EmptySlot = function EmptySlot() {};
				test.EmptySlot.prototype.toString = function() {return "<empty>";};
				test.EmptySlot.prototype.toSource = function() {return "undefined";};
				test.EmptySlot = new test.EmptySlot();
				
				test.compare = function compare(expected, result, /*optional*/options) {
					expected = types.toObject(expected);
					result = types.toObject(result);
					var expectedValue = expected.valueOf(),
						resultValue = result.valueOf(),
						depth = types.get(options, 'depth', 0),
						mode = types.get(options, 'mode', null),
						inherited = types.get(options, 'inherited', false),
						success = true;
					if (mode === 'is') {
						success = types.is(result, [expected]);
					} else if (mode === 'isinstance') {
						success = types._instanceof(result, [expected]);
					} else if (!mode) {
						if (types.isArray(expectedValue)) {
							success = types.is(result, [expected]);
							mode = 'array';
						} else if (types.isError(expectedValue)) {
							success = types.is(result, [expected]);
							mode = 'error';
						} else if (types.isObject(expectedValue)) {
							mode = 'object';
						} else {
							mode = 'compare';
						};
					};
					if (!options) {
						options = {};
					};
					if (mode === 'error') {
						success = success && (resultValue ? (resultValue.message === expectedValue.message) : false);
					} else if ((depth >= 0) && (mode === 'object')) {
						depth--;
						var expectedCount = 0;
						var resultCount = 0;
						success = success && !!resultValue;
						if (success) {
							var keys;
							if (global.Object.keys) {
								keys = global.Object.keys(expectedValue);
							} else {
								keys = [];
								for (var key in expectedValue) {
									if (global.Object.prototype.hasOwnProperty.call(expectedValue, key)) {
										keys.push(key);
									};
								};
							};
							if (global.Object.getOwnPropertySymbols) {
								keys.push.apply(keys, global.Object.getOwnPropertySymbols(expectedValue));
							};
							for (var i = 0; i < keys.length; i++) {
								var key = keys[i];
								if (inherited) {
									if (!(key in resultValue)) {
										success = false;
										break;
									};
								} else {
									if (!global.Object.prototype.hasOwnProperty.call(resultValue, key)) {
										success = false;
										break;
									};
								};
								if (!test.compare(expectedValue[key], resultValue[key], {depth: depth})) {
									success = false;
									break;
								};
								expectedCount++;
							};
						};
					} else if ((depth >= 0) && (mode === 'array') && types.get(options, 'contains', false)) {
						depth--;
						var expectedCount = expectedValue.length,
							resultCount = (resultValue ? resultValue.length : 0);
						success = (expectedCount === resultCount);
						if (success) {
							for (var i = 0; i < expectedCount; i++) {
								var val = expectedValue[i],
									found = false;
								for (var j = 0; j < resultCount; j++) {
									if (test.compare(val, resultValue[j], {depth: depth})) {
										found = true;
										break;
									};
								};
								if (!found) {
									success = false;
									break;
								};
							};
						};
					} else if ((depth >= 0) && (mode === 'array')) {
						depth--;
						success = success && !!resultValue;
						if (success) {
							var len = Math.max(expectedValue.length, resultValue.length),
								expectedCount = 0,
								resultCount = 0;
							for (var i = 0; i < len; i++) {
								if (i in expectedValue) {
									var val = expectedValue[i];
									if (val !== test.EmptySlot) {
										expectedCount++;
									};
									if (i in resultValue) {
										resultCount++;
										if (val === test.EmptySlot) {
											success = false;
											break;
										} else if (!test.compare(val, resultValue[i], {depth: depth})) {
											success = false;
											break;
										};
									} else if (val !== test.EmptySlot) {
										success = false;
										break;
									};
								} else if (i in resultValue) {
									success = false;
									break;
								};
							};
							success = success && (resultCount === expectedCount);
						};
					} else if (mode === 'compare') {
						success =
							(
								success 
								&&
								(
									(resultValue === expectedValue)
									|| 
									// Patch for NaN. See "types.isNaN".
									((resultValue !== resultValue) && (expectedValue !== expectedValue))
								)
							);
					};
					return (!types.get(options, 'not', false) === success);
				};

				__Internal__.performanceEnabled = !!(global.performance && global.performance.now);
				__Internal__.processHrTimeEnabled = !__Internal__.performanceEnabled && !!(nodejs && global.process.hrtime);
				__Internal__.consoleTimingEnabled = !__Internal__.processHrTimeEnabled && !!(global.console && global.console.time && global.console.timeEnd);
					
				test.prepareCommand = function prepareCommand(fn, fnName) {
					var stream = test.getOutput(),
						html = types._implements(stream, io.HtmlOutputStream),
						dom = (clientIO ? (stream instanceof clientIO.DomOutputStream) : false);
					
					if (html) {
						stream.openElement({tag: 'div', attrs: 'class="command"'});
						stream.print(fnName, {attrs: 'class="name"'});
					} else {
						stream.print("Name: " + fnName);
					};
					
					var ended = false;
						
					return {
						run: function (expected, /*optional*/options 	/**/ /*paramarray*/) {
							root.DD_ASSERT && root.DD_ASSERT(!ended, "Command has been ended.");
							if (!options) {
								options = {};
							};
							var sourceOpts = {};
							var mode = types.get(options, 'mode', null),
								isEval = types.get(options, 'eval', false),
								expectedStr = "Expected: " + 
									(types.get(options, 'not', false) ? 'Not ' : '') + 
									(types.get(options, 'contains', false) ? 'Contains ' : '') +
									(
										(mode === 'isinstance')
										? 
											('Instance Of ' + (isEval && types.isString(expected) ? expected : (types.isFunction(expected) ? types.getFunctionName(expected) : types.getFunctionName(expected.constructor))))
										: 
										(mode === 'is')
										? 
											('Is ' + (isEval && types.isString(expected) ? expected : (types.isFunction(expected) ? types.getFunctionName(expected) : types.getFunctionName(expected.constructor))))
										: 
											((mode === 'compare') ? 'Equals ' : '') + 
											(isEval && types.isString(expected) ? expected : types.toSource(expected, types.get(options, 'depth', 0), sourceOpts))
									),
								expectedCls = 'expected',
								params = Array.prototype.slice.call(arguments, 2);
								
							var evalError = null;
							if (isEval && types.isString(expected)) {
								try {
									expected = types.eval(expected, {window: global, global: global, EmptySlot: test.EmptySlot});
								} catch(ex) {
									evalError = ex;
								};
							};

							test.TESTS_COUNT++;
							
							var	result,
								resultStr,
								resultCls,
								printOpts;
							
							if (html) {
								if (dom) {
									stream.openElement({tag: 'div', attrs: 'class="run bindMe"'});
								} else {
									stream.openElement({tag: 'div', attrs: 'class="run"'});
								};
							};
							
							if (!evalError) {
								expected = types.toObject(expected);
								
								var command = "Command: " + (types.get(options, 'command', null) ||
										fnName + 
										"(" + 
										tools.map(params, function(val, key) {
												if (isEval && types.isString(val)) {
													return val;
												} else {
													var sourceOpts = {};
													return types.toSource(val, types.get(options, 'depth', 0), sourceOpts);
												};
											}).join(', ') + 
										");");
										
								printOpts = {};
								if (html) {
									printOpts.attrs = 'class="name"';
								};
								stream.print(command.replace(/[~]/g, '~~'), printOpts);
								
								printOpts = {};
								if (html) {
									printOpts.attrs = ('class="' + expectedCls + '"');
								};
								stream.print(expectedStr.replace(/[~]/g, '~~'), printOpts);
								
								if (isEval) {
									try {
										params = tools.map(params, function(expr) {
											if (types.isString(expr)) {
												return types.eval(expr, {window: global, global: global, EmptySlot: test.EmptySlot});
											} else {
												return expr;
											};
										});
									} catch(ex) {
										evalError = ex;
									};
								};
							};

							if (!evalError) {
								resultStr = "Got: ";
								resultCls = 'got';
								var time = null,
									repetitions = types.get(options, 'repetitions', 1);
									
								if (__Internal__.performanceEnabled) {
									time = 0;
									for (var i = 0; i < repetitions; i++) {
										var now = performance.now();
										try {
											result = fn.apply(this, params);
										} catch(ex) {
											result = ex;
										};
										time += (performance.now() - now);
									};
								} else if (__Internal__.processHrTimeEnabled) {
									time = 0;
									for (var i = 0; i < repetitions; i++) {
										var now = process.hrtime();
										try {
											result = fn.apply(this, params);
										} catch(ex) {
											result = ex;
										};
										now = process.hrtime(now);
										time += (now[0] + (now[1] / 1e9)) * 1e3;
									};
								} else if (__Internal__.consoleTimingEnabled) {
									time = 0;
									for (var i = 0; i < repetitions; i++) {
										console.time("Time");
										try {
											result = fn.apply(this, params);
										} catch(ex) {
											result = ex;
										};
										time += console.timeEnd("Time");
									};
									if (_shared.Natives.windowIsNaN(time)) {
										time = null;
									};
								} else {
									try {
										result = fn.apply(this, params);
									} catch(ex) {
										result = ex;
									};
								};
								if (types.isError(result)) {
									resultStr += result.toString();
									resultCls += ' error';
								} else {
									var sourceOpts = {};
									if (types.get(options, 'inherited', false)) {
										sourceOpts.inherited = true;
									};
									if (!types.get(options, 'showFunctions', false)) {
										sourceOpts.includeFunctions = false;
									};
									resultStr += 
											((mode === 'isinstance') ? 
												'Instance Of ' + (types.isFunction(result) ? result.name : (types.isObjectLike(result) ? result.constructor.name : '????')) + 
												' (' + types.toSource(result, types.get(options, 'depth', 0), sourceOpts) + ')'
											: 
												types.toSource(result, types.get(options, 'depth', 0), sourceOpts)
											); 
									result = types.toObject(result);
								};
								
								printOpts = {};
								if (html) {
									printOpts.attrs = ('class="' + resultCls + '"');
								};
								stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
								
								result = (types.get(options, 'compareFn', null) || test.compare)(expected, result, options);
							};
							
							if (evalError) {
								resultStr = "Expression error :" + evalError.toString();
								resultCls = 'result error';
								printOpts = {};
								if (html) {
									printOpts.attrs = ('class="' + resultCls + '"');
								};
								stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
								
								result = false;
							};
							
							resultStr = "Result: " + (result ? "OK !" : ">>> FAILED <<<");
							resultCls = 'result';
							if (result) {
								resultCls += ' success';
							} else {
								resultCls += ' error';
								test.FAILED_TESTS++;
							};
							printOpts = {};
							if (html) {
								printOpts.attrs = ('class="' + resultCls + '"');
							};
							stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
							
							resultStr = "Time: " + ((time === null) ? 'Not available' : (types.toString(time) + ' ms' + ((repetitions > 1) ? (' / ' + repetitions + ' = ' + types.toString(time / repetitions) + ' ms') : ''))),
							resultCls = 'time',
							printOpts = {};
							if (html) {
								printOpts.attrs = ('class="' + resultCls + '"');
							};
							stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
							
							var note = types.get(options, 'note', null);
							if (note) {
								printOpts = {};
								if (html) {
									printOpts.attrs = 'class="note"';
								};
								stream.print("Note: " + note.replace(/[~]/g, '~~'), printOpts);
							};
							
							if (html) {
								stream.flush({flushElement: true});
								stream.closeElement();
							} else {
								stream.flush();
							};
						},
					
						end: function() {
							root.DD_ASSERT && root.DD_ASSERT(!ended, "Command has been ended.");
							ended = true;
							if (html) {
								stream.flush({flushElement: true});
								stream.closeElement();
							} else {
								stream.flush();
							};
						},
					};
				};
				
				test.runUnit = function runUnit(unit, /*optional*/options) {
					var stream = test.getOutput(),
						html = types._implements(stream, io.HtmlOutputStream);
					if (html) {
						stream.openElement({tag: 'div', attrs: 'class="unit" title="' + unit.DD_FULL_NAME + '"'});
						stream.print(unit.DD_FULL_NAME, {attrs: 'class="name"'});
					} else {
						stream.print(unit.DD_FULL_NAME);
					};
					if ((unit !== test) && unit.run) {
						unit.run(root, options);
					};
					test.runChildren(unit, options);
					if (html) {
						stream.flush({flushElement: true});
						stream.closeElement();
					} else {
						stream.flush();
					};
				};
				
				test.runChildren = function runChildren(unit) {
					var units = test.getUnits(unit);
					for (var i = 0; i < units.length; i++) {
						test.runUnit(units[i]);
					};
				};
				
				var __showFailsOnReady__ = function onReady(ev) {
					var prevent = false;
					try {
						var key = ev.data;
						if (!key.functionKeys) {
							var scanCode = key.scanCode;
							if (scanCode === io.KeyboardScanCodes.UpArrow) {
								prevent = true;
								this.prev(ev);
							} else if (scanCode === io.KeyboardScanCodes.DownArrow) {
								prevent = true;
								this.next(ev);
							} else if (scanCode === io.KeyboardScanCodes.Home) {
								prevent = true;
								this.first(ev);
							} else if (scanCode === io.KeyboardScanCodes.End) {
								prevent = true;
								this.last(ev);
							};
						};
					} catch(ex) {
						if (!(ex instanceof types.ScriptInterruptedError)) {
							io.stderr.write(ex);
							io.stderr.flush();
						};
					} finally {
						if (prevent) {
							ev.preventDefault();
							return false;
						};
					};
				};
				
				test.showFails = function showFails() {
					var stream = test.getOutput(),
						root = stream.element,
						runElements = Array.prototype.slice.call(root.getElementsByClassName("run bindMe"), 0), // <PRB> Returned objects collection is dynamic
						failedRuns = [],
						state = {};
					
					if (test.FAILED_TESTS) {
						stream.openElement({tag: 'div', attrs: 'class="failedPopup bindMe"'});
						stream.write('<a id="failedBookmark" class="failedToolbar bindMe"></a><button class="prevFailed bindMe">Previous</button><button class="nextFailed bindMe">Next</button><span class="failedOf bindMe"></span>');
						stream.flush({flushElement: true});
						var popup = stream.element;
						stream.closeElement();
						
						var	failedToolbar = popup.getElementsByClassName('failedToolbar bindMe')[0],
							prevButton = popup.getElementsByClassName('prevFailed bindMe')[0],
							nextButton = popup.getElementsByClassName('nextFailed bindMe')[0];
							
						types.extend(state, {
							popup: popup,
							failedOf: popup.getElementsByClassName('failedOf bindMe')[0],
							runElements: runElements,
							failedRuns: failedRuns,
							currentRun: null,
							currentFailed: 0,
							move: function(scroll) {
								if (this.popup.parentNode) {
									this.popup.parentNode.removeChild(this.popup);
								};
								if (this.currentRun) {
									this.currentRun.setAttribute('selected', 'false');
								};
								if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
									var runElement = this.failedRuns[this.currentFailed];
									if (runElement) {
										this.currentRun = runElement;
										runElement.setAttribute('selected', 'true');
										runElement.parentNode.insertBefore(this.popup, runElement);
										this.failedOf.textContent = 'Failure ' + (this.currentFailed + 1) + ' of ' + this.failedRuns.length + '. Total is ' + this.runElements.length + '.';
									};
								};
								var url = tools.getCurrentLocation();
								url = url.toString({
									anchor: 'failedBookmark',
								});
								tools.setCurrentLocation(url, true, true);
								if (scroll && failedToolbar) {
									if (failedToolbar.scrollIntoView) {
										failedToolbar.scrollIntoView(true);
									};
								};
							},
							click: types.bind(state, function(ev) { // JS click
								try {
									if (ev instanceof global.Event) {
										this.currentFailed = _shared.Natives.windowParseInt(ev.currentTarget.getAttribute('failedIndex'));
										this.move();
									};
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
							prev: types.bind(state, function(ev) { // JS click
								try {
									if (_shared.Natives.windowIsNaN(this.currentFailed)) {
										var index;
										if (this.currentRun) {
											index = _shared.Natives.windowParseInt(this.currentRun.getAttribute('index'));
										} else {
											index = 0;
										};
										var run = this.runElements[index];
										while (run) {
											this.currentFailed = _shared.Natives.windowParseInt(this.currentRun.getAttribute('failedIndex'));
											if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
												break;
											};
											index++;
											run = this.runElements[index];
										};
									};
									if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
										this.currentFailed--;
										if (this.currentFailed < 0) {
											this.currentFailed = this.failedRuns.length - 1;
										};
									};
									this.move(true);
									ev.preventDefault();
									return false;
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
							next: types.bind(state, function(ev) { // JS click
								try {
									if (_shared.Natives.windowIsNaN(this.currentFailed)) {
										var index;
										if (this.currentRun) {
											index = _shared.Natives.windowParseInt(this.currentRun.getAttribute('index'));
										} else {
											index = this.runElements.length - 1;
										};
										var run = this.runElements[index];
										while (this.currentRun) {
											this.currentFailed = _shared.Natives.windowParseInt(this.currentRun.getAttribute('failedIndex'));
											if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
												break;
											};
											index--;
											run = this.runElements[index];
										};
									};
									if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
										this.currentFailed++;
										if (this.currentFailed >= this.failedRuns.length) {
											this.currentFailed = 0;
										};
									};
									this.move(true);
									ev.preventDefault();
									return false;
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
							first: function(ev) {
								try {
									this.currentFailed = 0;
									this.move(true);
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							},
							last: function(ev) {
								try {
									this.currentFailed = this.failedRuns.length - 1;;
									this.move(true);
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							},
						});

						state.popup.className = state.popup.className.replace('bindMe', '');
						state.failedOf.className = state.failedOf.className.replace('bindMe', '');
						prevButton.onclick = state.prev;
						prevButton.className = prevButton.className.replace('bindMe', '');
						nextButton.onclick = state.next;
						nextButton.className = nextButton.className.replace('bindMe', '');
					};
					
					for (var i = 0; i < runElements.length; i++) {
						var runElement = runElements[i],
							resultElement = runElement.getElementsByClassName('result')[0];
						runElement.setAttribute('index', i);
						if (resultElement.className.indexOf('error') >= 0) {
							runElement.setAttribute('failedIndex', failedRuns.length);
							failedRuns.push(runElement);
						} else {
							runElement.removeAttribute('failedIndex');
						};
						if (state) {
							runElement.onclick = state.click;
						};
						runElement.className = runElement.className.replace('bindMe', '');
					};
					
					if (test.FAILED_TESTS) {
						state.move(true);
						
						io.stdin.onReady.attach(state, __showFailsOnReady__);
						io.stdin.listen();
					};
				};
				
				test.showUnitName = function showUnitName() {
					var name = (test.CURRENT_UNIT ? test.CURRENT_UNIT.DD_FULL_NAME : ''),
						stream = test.getOutput(),
						root = stream.element,
						elements = Array.prototype.slice.call(root.getElementsByClassName("unitName"), 0); // <PRB> Returned objects collection is dynamic
					for (var i = 0; i < elements.length; i++) {
						elements[i].textContent = name;
					};
				};

				test.moveToUnit = function moveToUnit(unit) {
					var url = tools.getCurrentLocation();
					if (unit) {
						url = url.set({
							args: url.args.set('unit', unit.DD_FULL_NAME, true),
						});
					} else {
						url = url.set({
							args: url.args.remove('unit'),
							anchor: null,
						});
					};
					tools.setCurrentLocation(url);
				};

				var __showNavigatorOnReady__ = function onReady(ev) {
					var prevent = false;
					try {
						var key = ev.data;
						if (!key.functionKeys) {
							var scanCode = key.scanCode;
							if (scanCode === io.KeyboardScanCodes.LeftArrow) {
								prevent = true;
								this.prev(ev);
							} else if (scanCode === io.KeyboardScanCodes.RightArrow) {
								prevent = true;
								this.next(ev);
							};
						};
					} catch(ex) {
						if (!(ex instanceof types.ScriptInterruptedError)) {
							io.stderr.write(ex);
							io.stderr.flush();
						};
					} finally {
						if (prevent) {
							ev.preventDefault();
							return false;
						};
					};
				};
				
				test.showNavigator = function showNavigator() {
					var stream = test.getOutput();
					stream.openElement({tag: 'div', attrs: 'class="navigator"'});
					stream.write('<button class="index bindMe">Index</button><button class="prevUnit bindMe">&lt;&lt;&lt;</button><span class="unitName"></span><button class="nextUnit bindMe">&gt;&gt;&gt;</button>');
					stream.flush({flushElement: true});
					var root = stream.element;
					stream.closeElement();
					
					var indexButton = root.getElementsByClassName('index bindMe')[0],
						prevButton = root.getElementsByClassName('prevUnit bindMe')[0],
						nextButton = root.getElementsByClassName('nextUnit bindMe')[0],
						state = {
							index: types.bind(state, function(ev) { // JS click
								try {
									test.moveToUnit(null);
									ev.preventDefault();
									return false;
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
							prev: types.bind(state, function(ev) { // JS click
								try {
									if (test.CURRENT_UNIT) {
										var units = test.getUnits(test.CURRENT_UNIT.DD_PARENT),
											unit = test.CURRENT_UNIT,
											pos = tools.findItem(units, unit);
										if (pos <= 0) {
											pos = units.length;
										};
										unit = units[pos - 1];
										test.moveToUnit(unit);
										return;
									};
									ev.preventDefault();
									return false;
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
							next: types.bind(state, function(ev) { // JS click
								try {
									if (test.CURRENT_UNIT) {
										var units = test.getUnits(test.CURRENT_UNIT.DD_PARENT),
											unit = test.CURRENT_UNIT,
											pos = tools.findItem(units, unit);
										if ((pos < 0) || (pos >= units.length - 1)) {
											pos = -1;
										};
										unit = units[pos + 1];
										test.moveToUnit(unit);
										return;
									};
									ev.preventDefault();
									return false;
								} catch(ex) {
									if (!(ex instanceof types.ScriptInterruptedError)) {
										io.stderr.write(ex);
										io.stderr.flush();
									};
								};
							}),
						};
						
						
					indexButton.onclick = state.index;
					indexButton.className = indexButton.className.replace('bindMe', '');
					prevButton.onclick = state.prev;
					prevButton.className = prevButton.className.replace('bindMe', '');
					nextButton.onclick = state.next;
					nextButton.className = nextButton.className.replace('bindMe', '');

					io.stdin.onReady.attach(state, __showNavigatorOnReady__);
					io.stdin.listen();
				};
				
				var __buildIndexItems__ = function(namespace) {
					var html = '<ul>';

					var units = test.getUnits(namespace),
						len = units.length;
					for (var i = 0; i < len; i++) {
						// Sorry for using the same variable
						var unit = units[i];
						html += '<li><a href="#" unitname="' + unit.DD_FULL_NAME + '" class="indexMenuItem bindMe">' + tools.escapeHtml(unit.DD_FULL_NAME) + '</a></li>';
						html += __buildIndexItems__(unit);
					};
					
					return html + '</ul>';
				};
				
				test.showIndex = function showIndex(unit) {
					var stream = test.getOutput();
					stream.openElement({tag: 'div', attrs: 'class="indexMenu"'});
					stream.write(__buildIndexItems__(test));
					stream.flush({flushElement: true});
					var root = stream.element;
					stream.closeElement();
					
					var elements = Array.prototype.slice.call(root.getElementsByClassName("indexMenuItem bindMe"), 0); // <PRB> Returned objects collection is dynamic
						
					var click = function(ev) {
						try {
							var name = ev.currentTarget.getAttribute('unitname'),
								unit = test.getUnit(name);
							test.moveToUnit(unit);
						} catch(ex) {
							if (!(ex instanceof types.ScriptInterruptedError)) {
								io.stderr.write(ex);
								io.stderr.flush();
							};
						};
						ev.preventDefault();
						return false;
					};
						
					for (var i = 0; i < elements.length; i++) {
						var element = elements[i];
						element.className = '';
						element.onclick = click;
					};
				};
				
				test.run = function run(/*optional*/options) {
					var success = true;

					test.FAILED_TESTS = 0;
					
					var stream = test.getOutput(),
						html = types._implements(stream, io.HtmlOutputStream),
						dom = (clientIO ? (stream instanceof clientIO.DomOutputStream) : false);
					
					var args = tools.getCurrentLocation().args,
						name = args.get('unit'),
						units = test.getUnits(test), // also initialize some attributes
						unit,
						isIndex = false,
						ok = false;
						
					if (html) {
						stream.openElement({tag: 'div', attrs: 'class="test"'});
					};

					if (name) {
						unit = test.getUnit(name);
						if (!unit) {
							test.moveToUnit(null);
							return;
						};
					} else {
						if (dom) {
							test.showIndex();
						};
						isIndex = true;
					};
					
					if (!isIndex) {
						if (dom) {
							test.showNavigator();
						};

						if (unit) {
							test.CURRENT_UNIT = unit;
							
							try {
								test.runUnit(unit);
								ok = true;
							} catch(ex) {
								if (!(ex instanceof types.ScriptInterruptedError)) {
									debugger;
									io.stderr.write(ex);
									io.stderr.flush();
								};
							};
						};
						
						if (dom) {
							test.showNavigator();
						};
					};
						
					if (html) {
						stream.closeElement();
					};
					
					stream.flush();
					stream.reset();
					
					io.stderr.flush();
					io.stderr.reset();
					
					if (dom) {
						test.showUnitName();
					};
					
					if (!isIndex) {
						if (dom) {
							if (!unit) {
								global.alert("There is nothing to test.");
							} else if (!ok) {
								global.alert("An error occurred while testing.");
								success = false;
							} else {
								test.showFails(test);
								if (!test.FAILED_TESTS) {
									global.alert("Every tests passed.    Total: " + test.TESTS_COUNT);
								};
								success = false;
							};
						} else {
							if (!unit) {
								stream.print("End: There is nothing to test.");
							} else if (!ok) {
								stream.print("End: An error occurred while testing.");
								success = false;
							} else if (test.FAILED_TESTS) {
								stream.print("End: Some tests failed.");
								success = false;
							} else {
								stream.print("End: Every tests passed.    Total: " + test.TESTS_COUNT);
							};
							stream.flush();
						};
					};
					
					return success;
				};
				
			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()