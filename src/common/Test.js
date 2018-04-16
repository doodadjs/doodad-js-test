//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2018 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: Test.js - Testing
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

/* eslint no-console: "off" */

//! IF_SET("mjs")
//! ELSE()
	"use strict";
//! END_IF()

exports.add = function add(modules) {
	modules = (modules || {});
	modules['Doodad.Test'] = {
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
			root.enableAsserts();
				
			// Unit test module entry
			const doodad = root.Doodad,
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
					
			tools.complete(_shared.Natives, {
				windowParseInt: global.parseInt,

				/* eslint no-restricted-properties: "off" */
				windowIsNaN: global.isNaN,
			});
					
			const __Internal__ = {
				stdout: null,
			};
				
			entries.REGISTER(entries.Module.$inherit(
				/*typeProto*/
				{
					$TYPE_NAME: 'TestModule'
				}
			));
				
			entries.REGISTER(entries.Package.$inherit(
				/*typeProto*/
				{
					$TYPE_NAME: 'TestPackage'
				}
			));
				
			test.ADD('setOutput', function setOutput(stream) {
				__Internal__.stdout = stream;
			});

			test.ADD('getOutput', function getOutput(stream) {
				return __Internal__.stdout || io.stdout;
			});

			test.ADD('getUnits', function getUnits(namespace) {
				let units = namespace.CHILDREN;
				if (!units) {
					units = namespace.CHILDREN = [];
					const names = types.keys(namespace),
						namesLen = names.length;
					for (let i = 0; i < namesLen; i++) {
						const name = names[i];
						const nso = namespace[name];
						if (types._instanceof(nso, root.Namespace) && (nso.DD_PARENT === namespace)) {
							const unit = namespaces.get(nso.DD_FULL_NAME, entries.TestModule);
							if (unit) {
								const len = units.length;
								let priority = (types.isNothing(nso.priority) ? 20 : nso.priority);
								for (let pos = 0; pos < len; pos++) {
									const item = units[pos];
									if (item.priority > priority) {
										priority = null;
										units.splice(pos, 0, unit);
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
				return units;
			});
				
			test.ADD('getUnit', function getUnit(name) {
				return (name === test.DD_FULL_NAME ? test : namespaces.get(name, entries.TestModule));
			});
				
			test.EmptySlot = function EmptySlot() {};
			test.EmptySlot.prototype.toString = function() {
				return "<empty>";
			};
			test.EmptySlot.prototype.toSource = function() {
				return "undefined";
			};
			test.ADD('EmptySlot', new test.EmptySlot());
				
			test.ADD('compare', function compare(expected, result, /*optional*/options) {
				expected = types.toObject(expected);
				result = types.toObject(result);
				const expectedValue = expected.valueOf(),
					resultValue = result.valueOf(),
					inherited = types.get(options, 'inherited', false);
				let depth = types.get(options, 'depth', 0),
					mode = types.get(options, 'mode', null),
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
					//let expectedCount = 0;
					//let resultCount = 0;
					success = success && !!resultValue;
					if (success) {
						const keys = tools.append(types.keys(expectedValue), types.symbols(expectedValue));
						for (let i = 0; i < keys.length; i++) {
							const key = keys[i];
							if (inherited) {
								if (!(key in resultValue)) {
									success = false;
									break;
								};
							} else {
								if (!types.has(resultValue, key)) {
									success = false;
									break;
								};
							};
							if (!test.compare(expectedValue[key], resultValue[key], {depth: depth})) {
								success = false;
								break;
							};
							//expectedCount++;
						};
					};
				} else if ((depth >= 0) && (mode === 'array') && types.get(options, 'contains', false)) {
					depth--;
					const expectedCount = expectedValue.length,
						resultCount = (resultValue ? resultValue.length : 0);
					success = (expectedCount === resultCount);
					if (success) {
						for (let i = 0; i < expectedCount; i++) {
							const val = expectedValue[i];
							let found = false;
							for (let j = 0; j < resultCount; j++) {
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
						const len = Math.max(expectedValue.length, resultValue.length);
						let expectedCount = 0,
							resultCount = 0;
						for (let i = 0; i < len; i++) {
							if (i in expectedValue) {
								const val = expectedValue[i];
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
								/* eslint no-self-compare: "off" */
								((resultValue !== resultValue) && (expectedValue !== expectedValue))
							)
						);
				};
				return (!types.get(options, 'not', false) === success);
			});

			__Internal__.performanceEnabled = !!(global.performance && global.performance.now); // <FUTURE> Global to threads
			__Internal__.processHrTimeEnabled = !__Internal__.performanceEnabled && !!(nodejs && global.process.hrtime); // <FUTURE> Global to threads
			__Internal__.consoleTimingEnabled = !__Internal__.processHrTimeEnabled && !!(global.console && global.console.time && global.console.timeEnd); // <FUTURE> Global to threads
			__Internal__.runPromise = null; // <FUTURE> Local to thread


			test.ADD('runCommand', function prepareCommand(commandFn, commandFnName, stepsFn, /*optional*/options) {
				//const Promise = types.getPromise();

				// State
				let ended = false;
				let commandElementOpened = false;
				const skipCommand = types.get(options, 'skip', false);
					
				const stream = test.getOutput(),
					html = types._implements(stream, io.HtmlOutputStream),
					dom = (clientIO ? types._instanceof(stream, clientIO.DomOutputStream) : false),
					buffered = types._implements(stream, ioMixIns.BufferedStreamBase);
					
				__Internal__.runPromise = __Internal__.runPromise
					.then(function(dummy) {
						if (html) {
							stream.openElement({tag: 'div', attrs: {"class": "command"}});
							stream.print(commandFnName, {attrs: {"class": "name"}});
						} else {
							stream.print("Name: " + commandFnName);
						};
						commandElementOpened = true;
					});

				stepsFn({
					isEnded: function() {
						return ended;
					},

					chain: function(then) {
						if (ended) {
							throw new types.NotAvailable("Command has been ended.");
						};

						__Internal__.runPromise = __Internal__.runPromise
							.then(function(dummy) {
								const Promise = types.getPromise();
								const oldRunPromise = __Internal__.runPromise;
								return Promise.try(function() {
									__Internal__.runPromise = Promise.resolve();
									then();
									return __Internal__.runPromise;
								}).nodeify(function(err, dummy) {
									__Internal__.runPromise = oldRunPromise;
									if (err) {
										throw err;
									};
								});
							});

						return this;
					},

					runGroup: function runGroup(groupFnName, groupFn, /*optional*/options) {
						if (ended) {
							throw new types.NotAvailable("Command has been ended.");
						};

						test.runCommand(commandFn, groupFnName, function(group, options) {
							groupFn(group, options);
						}, options);
					},

					runStep: function runStep(expected, /*optional*/options, /*paramarray*/...params) {
						if (ended) {
							throw new types.NotAvailable("Command has been ended.");
						};

						// State
						let runElementOpened = false;
						const skipStep = skipCommand || types.get(options, 'skip', false);

						__Internal__.runPromise = __Internal__.runPromise
							.then(function(dummy) {
								let sourceOpts;

								sourceOpts = {};
								const mode = types.get(options, 'mode', null),
									isEval = types.get(options, 'eval', false);
								const expectedStr = "Expected: " + 
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
												(isEval && types.isString(expected) ? expected : tools.toSource(expected, types.get(options, 'depth', 0), sourceOpts))
										);
								const expectedCls = 'expected';
								
								let evalError = null;
								if (isEval && types.isString(expected)) {
									try {
										expected = tools.eval(expected, {window: global, global: global, EmptySlot: test.EmptySlot});
									} catch(ex) {
										evalError = ex;
									};
								};

								test.TESTS_COUNT++;
							
								let	result,
									resultStr,
									resultCls,
									printOpts;
							
								if (html) {
									if (dom) {
										stream.openElement({tag: 'div', attrs: {"class": "run bindMe"}});
									} else {
										stream.openElement({tag: 'div', attrs: {"class": "run"}});
									};
								};
								runElementOpened = true;
							
								if (!evalError) {
									expected = types.toObject(expected);
								
									const command = "Command: " + (types.get(options, 'command', null) ||
											commandFnName + 
											"(" + 
											tools.map(params, function(val, key) {
													if (isEval && types.isString(val)) {
														return val;
													} else {
														sourceOpts = {};
														return tools.toSource(val, types.get(options, 'depth', 0), sourceOpts);
													};
												}).join(', ') + 
											");");
										
									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": "name"};
									};
									stream.print(command.replace(/[~]/g, '~~'), printOpts);
								
									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": expectedCls};
									};
									stream.print(expectedStr.replace(/[~]/g, '~~'), printOpts);
								
									if (isEval) {
										try {
											params = tools.map(params, function(expr) {
												if (types.isString(expr)) {
													return tools.eval(expr, {window: global, global: global, EmptySlot: test.EmptySlot});
												} else {
													return expr;
												};
											});
										} catch(ex) {
											evalError = ex;
										};
									};
								};

								const repetitions = types.get(options, 'repetitions', 1);

								let time = null;

								if (skipStep) {
									resultStr = ">>> SKIPPED <<<";
									resultCls = 'got skipped';

									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": resultCls};
									};
									stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);

									result = true;

								} else if (evalError) {
									resultStr = "Expression error : " + evalError.toString();
									resultCls = 'result error';
									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": resultCls};
									};
									stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
								
									result = false;

								} else {
									resultStr = "Got: ";
									resultCls = 'got';

									if (__Internal__.performanceEnabled) {
										time = 0;
										for (let i = 0; i < repetitions; i++) {
											const now = performance.now();
											try {
												result = commandFn.apply(this, params);
											} catch(ex) {
												result = ex;
											};
											time += (performance.now() - now);
										};
									} else if (__Internal__.processHrTimeEnabled) {
										time = 0;
										for (let i = 0; i < repetitions; i++) {
											let now = process.hrtime();
											try {
												result = commandFn.apply(this, params);
											} catch(ex) {
												result = ex;
											};
											now = process.hrtime(now);
											time += (now[0] + (now[1] / 1e9)) * 1e3;
										};
									} else if (__Internal__.consoleTimingEnabled) {
										time = 0;
										for (let i = 0; i < repetitions; i++) {
											console.time("Time");
											try {
												result = commandFn.apply(this, params);
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
											result = commandFn.apply(this, params);
										} catch(ex) {
											result = ex;
										};
									};
									if (types.isError(result)) {
										resultStr += result.toString();
										resultCls += ' error';
									} else {
										sourceOpts = {};
										if (types.get(options, 'inherited', false)) {
											sourceOpts.inherited = true;
										};
										if (!types.get(options, 'showFunctions', false)) {
											sourceOpts.includeFunctions = false;
										};
										resultStr += 
												((mode === 'isinstance') ? 
													'Instance Of ' + (types.isFunction(result) ? result.name : (types.isObjectLike(result) ? result.constructor.name : '????')) + 
													' (' + tools.toSource(result, types.get(options, 'depth', 0), sourceOpts) + ')'
												: 
													tools.toSource(result, types.get(options, 'depth', 0), sourceOpts)
												); 
										result = types.toObject(result);
									};
								
									result = (types.get(options, 'compareFn', null) || test.compare)(expected, result, options);

									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": resultCls};
									};
									stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
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
									printOpts.attrs = {"class": resultCls};
								};
								stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
							
								resultStr = "Time: " + ((time === null) ? 'Not available' : (types.toString(time) + ' ms' + ((repetitions > 1) ? (' / ' + repetitions + ' = ' + types.toString(time / repetitions) + ' ms') : '')));
								resultCls = 'time';
								printOpts = {};
								if (html) {
									printOpts.attrs = {"class": resultCls};
								};
								stream.print(resultStr.replace(/[~]/g, '~~'), printOpts);
							
								const note = types.get(options, 'note', null);
								if (note) {
									printOpts = {};
									if (html) {
										printOpts.attrs = {"class": "note"};
									};
									stream.print("Note: " + note.replace(/[~]/g, '~~'), printOpts);
								};
							})
							.nodeify(function(err, dummy) {
								if (runElementOpened) {
									if (html) {
										stream.flush({flushElement: true});
										stream.closeElement();
									} else if (buffered) {
										stream.flush();
									};
								};
								if (err) {
									throw err;
								};
							});

						return this;
					},
				}, options);

				__Internal__.runPromise = __Internal__.runPromise
					.nodeify(function(err, dummy) {
						ended = true;
						if (commandElementOpened) {
							if (html) {
								stream.flush({flushElement: true});
								stream.closeElement();
							} else {
								buffered && stream.flush();
							};
						};
						if (err) {
							throw err;
						};
					});
			});
				
			__Internal__.runChildren = function runChildren(unit) {
				const Promise = types.getPromise();
				return Promise.try(function() {
					const units = test.getUnits(unit);
					const len = units.length;
					const loop = function _loop(index) {
						if (index < len) {
							return __Internal__.runUnit(units[index])
								.then(function(dummy) {
									return loop(index + 1);
								});
						};
						return undefined;
					};
					return loop(0);
				});
			};
				
			__Internal__.runUnit = function runUnit(unit, /*optional*/options) {
				const Promise = types.getPromise();
				return Promise.try(function() {
					const stream = test.getOutput(),
						html = types._implements(stream, io.HtmlOutputStream),
						buffered = types._implements(stream, ioMixIns.BufferedStreamBase);
					if (html) {
						stream.openElement({tag: 'div', attrs: {"class": "unit", "title": unit.DD_FULL_NAME}});
						stream.print(unit.DD_FULL_NAME, {attrs: {"class": "name"}});
					} else {
						stream.print(unit.DD_FULL_NAME);
					};
					__Internal__.runPromise = Promise.resolve();
					if ((unit !== test) && unit.run) {
						unit.run(root, options);
					};
					return __Internal__.runPromise
						.nodeify(function(err, dummy) {
							if (html) {
								stream.flush({flushElement: true});
								stream.closeElement();
							} else if (buffered) {
								stream.flush();
							};
							if (err) {
								throw err;
							} else {
								return __Internal__.runChildren(unit, options);
							};
						});
				});
			};
				
			__Internal__.showFailsOnReady = function showFailsOnReady(ev) {
				const key = ev.data.valueOf();
				if (!key.functionKeys) {
					const scanCode = key.scanCode;
					if (scanCode === io.KeyboardScanCodes.UpArrow) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.prev(ev);
					} else if (scanCode === io.KeyboardScanCodes.DownArrow) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.next(ev);
					} else if (scanCode === io.KeyboardScanCodes.Home) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.first(ev);
					} else if (scanCode === io.KeyboardScanCodes.End) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.last(ev);
					};
				};
			};
				
			__Internal__.showFails = function showFails() {
				const stream = test.getOutput(),
					root = stream.element,
					runElements = Array.prototype.slice.call(root.getElementsByClassName("run bindMe"), 0), // <PRB> Returned objects collection is dynamic
					failedRuns = [],
					state = {};
					
				if (test.FAILED_TESTS) {
					stream.openElement({tag: 'div', attrs: {"class": "failedPopup bindMe"}});
					stream.write('<a id="failedBookmark" class="failedToolbar bindMe"></a><button class="prevFailed bindMe">Previous</button><button class="nextFailed bindMe">Next</button><span class="failedOf bindMe"></span>');
					stream.flush({flushElement: true});
					const popup = stream.element;
					stream.closeElement();
						
					const failedToolbar = popup.getElementsByClassName('failedToolbar bindMe')[0],
						prevButton = popup.getElementsByClassName('prevFailed bindMe')[0],
						nextButton = popup.getElementsByClassName('nextFailed bindMe')[0];
							
					tools.extend(state, {
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
								const runElement = this.failedRuns[this.currentFailed];
								if (runElement) {
									this.currentRun = runElement;
									runElement.setAttribute('selected', 'true');
									runElement.parentNode.insertBefore(this.popup, runElement);
									this.failedOf.textContent = 'Failure ' + (this.currentFailed + 1) + ' of ' + this.failedRuns.length + '. Total is ' + this.runElements.length + '.';
								};
							};
							let url = tools.getCurrentLocation();
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
								if (types._instanceof(ev, global.Event)) {
									this.currentFailed = _shared.Natives.windowParseInt(ev.currentTarget.getAttribute('failedIndex'));
									this.move();
								};
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
						}),
						prev: types.bind(state, function(ev) { // JS click
							try {
								if (_shared.Natives.windowIsNaN(this.currentFailed)) {
									let index;
									if (this.currentRun) {
										index = _shared.Natives.windowParseInt(this.currentRun.getAttribute('index'));
									} else {
										index = 0;
									};
									let run = this.runElements[index];
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
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
							return undefined;
						}),
						next: types.bind(state, function(ev) { // JS click
							try {
								if (_shared.Natives.windowIsNaN(this.currentFailed)) {
									let index;
									if (this.currentRun) {
										index = _shared.Natives.windowParseInt(this.currentRun.getAttribute('index'));
									} else {
										index = this.runElements.length - 1;
									};
									this.runElements[index];
									while (this.currentRun) {
										this.currentFailed = _shared.Natives.windowParseInt(this.currentRun.getAttribute('failedIndex'));
										if (!_shared.Natives.windowIsNaN(this.currentFailed)) {
											break;
										};
										index--;
										this.runElements[index];
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
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
							return undefined;
						}),
						first: function(ev) {
							try {
								this.currentFailed = 0;
								this.move(true);
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
						},
						last: function(ev) {
							try {
								this.currentFailed = this.failedRuns.length - 1;
								this.move(true);
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
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
					
				for (let i = 0; i < runElements.length; i++) {
					const runElement = runElements[i],
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
						
					io.stdin.onReady.attach(state, __Internal__.showFailsOnReady);
					io.stdin.listen();
				};
			};
				
			__Internal__.showUnitName = function showUnitName() {
				const name = (test.CURRENT_UNIT ? test.CURRENT_UNIT.DD_FULL_NAME : ''),
					stream = test.getOutput(),
					root = stream.element,
					elements = Array.prototype.slice.call(root.getElementsByClassName("unitName"), 0); // <PRB> Returned objects collection is dynamic
				for (let i = 0; i < elements.length; i++) {
					elements[i].textContent = name;
				};
			};

			__Internal__.moveToUnit = function moveToUnit(unit) {
				let url = tools.getCurrentLocation();
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

			__Internal__.showNavigatorOnReady = function showNavigatorOnReady(ev) {
				const key = ev.data.valueOf();
				if (!key.functionKeys) {
					const scanCode = key.scanCode;
					if (scanCode === io.KeyboardScanCodes.LeftArrow) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.prev(ev);
					} else if (scanCode === io.KeyboardScanCodes.RightArrow) {
						ev.preventDefault(); // prevent key from being applied by the browser
						this.next(ev);
					};
				};
			};
				
			__Internal__.showNavigator = function showNavigator() {
				const stream = test.getOutput();
				stream.openElement({tag: 'div', attrs: {"class": "navigator"}});
				stream.write('<button class="index bindMe">Index</button><button class="prevUnit bindMe">&lt;&lt;&lt;</button><span class="unitName"></span><button class="nextUnit bindMe">&gt;&gt;&gt;</button>');
				stream.flush({flushElement: true});
				const root = stream.element;
				stream.closeElement();
					
				const indexButton = root.getElementsByClassName('index bindMe')[0],
					prevButton = root.getElementsByClassName('prevUnit bindMe')[0],
					nextButton = root.getElementsByClassName('nextUnit bindMe')[0];

				const state = {};

				tools.extend(state, {
						index: types.bind(state, function(ev) { // JS click
							try {
								__Internal__.moveToUnit(null);
								ev.preventDefault();
								return false;
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
							return undefined;
						}),
						prev: types.bind(state, function(ev) { // JS click
							try {
								if (test.CURRENT_UNIT) {
									const units = test.getUnits(test.CURRENT_UNIT.DD_PARENT);
									let unit = test.CURRENT_UNIT,
										pos = tools.findItem(units, unit);
									if (pos <= 0) {
										pos = units.length;
									};
									unit = units[pos - 1];
									__Internal__.moveToUnit(unit);
									return undefined;
								};
								ev.preventDefault();
								return false;
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
							return undefined;
						}),
						next: types.bind(state, function(ev) { // JS click
							try {
								if (test.CURRENT_UNIT) {
									const units = test.getUnits(test.CURRENT_UNIT.DD_PARENT);
									let unit = test.CURRENT_UNIT,
										pos = tools.findItem(units, unit);
									if ((pos < 0) || (pos >= units.length - 1)) {
										pos = -1;
									};
									unit = units[pos + 1];
									__Internal__.moveToUnit(unit);
									return undefined;
								};
								ev.preventDefault();
								return false;
							} catch(ex) {
								if (!ex.bubble) {
									io.stderr.write(ex);
									//io.stderr.flush();
								};
							};
							return undefined;
						}),
					});
						
						
				indexButton.onclick = state.index;
				indexButton.className = indexButton.className.replace('bindMe', '');
				prevButton.onclick = state.prev;
				prevButton.className = prevButton.className.replace('bindMe', '');
				nextButton.onclick = state.next;
				nextButton.className = nextButton.className.replace('bindMe', '');

				io.stdin.onReady.attach(state, __Internal__.showNavigatorOnReady);
				io.stdin.listen();
			};
				
			__Internal__.buildIndexItems = function(namespace) {
				let html = '<ul>';

				const units = test.getUnits(namespace),
					len = units.length;
				for (let i = 0; i < len; i++) {
					// Sorry for using the same variable
					const unit = units[i];
					html += '<li><a href="#" unitname="' + unit.DD_FULL_NAME + '" class="indexMenuItem bindMe">' + tools.escapeHtml(unit.DD_FULL_NAME, true) + '</a></li>';
					html += __Internal__.buildIndexItems(unit);
				};
					
				return html + '</ul>';
			};
				
			__Internal__.showIndex = function showIndex(unit) {
				const stream = test.getOutput();
				stream.openElement({tag: 'div', attrs: {"class": "indexMenu"}});
				stream.write(__Internal__.buildIndexItems(test));
				stream.flush({flushElement: true});
				const root = stream.element;
				stream.closeElement();
					
				const elements = Array.prototype.slice.call(root.getElementsByClassName("indexMenuItem bindMe"), 0); // <PRB> Returned objects collection is dynamic
						
				const click = function(ev) {
					try {
						const name = ev.currentTarget.getAttribute('unitname'),
							unit = test.getUnit(name);
						__Internal__.moveToUnit(unit);
					} catch(ex) {
						if (!ex.bubble) {
							io.stderr.write(ex);
							//io.stderr.flush();
						};
					};
					ev.preventDefault();
					return false;
				};
						
				for (let i = 0; i < elements.length; i++) {
					const element = elements[i];
					element.className = '';
					element.onclick = click;
				};
			};
				
			test.ADD('run', function run(/*optional*/options) {
				const Promise = types.getPromise();
				return Promise.try(function() {
					let success = true;

					test.FAILED_TESTS = 0;
					
					const stream = test.getOutput(),
						html = types._implements(stream, io.HtmlOutputStream),
						dom = (clientIO ? types._instanceof(stream, clientIO.DomOutputStream) : false),
						buffered = types._implements(stream, ioMixIns.BufferedStreamBase);
					
					const name = types.get(options, 'name');

					let unit = test.getUnits(test), // also initialize some attributes
						isIndex = false;
						
					if (html) {
						stream.openElement({tag: 'div', attrs: {"class": "test"}});
					};

					if (name) {
						unit = test.getUnit(name);
						if (!unit) {
							if (!root.serverSide) {
								__Internal__.moveToUnit(null);
							};
							return false;
						};
					} else {
						if (dom) {
							__Internal__.showIndex();
						};
						isIndex = true;
					};

					let promise = Promise.resolve();
					
					if (!isIndex) {
						if (dom) {
							__Internal__.showNavigator();
						};

						if (unit) {
							test.CURRENT_UNIT = unit;
							
							promise = promise
								.then(function(dummy) {
									return __Internal__.runUnit(unit);
								});
						};
						
						if (dom) {
							promise = promise
								.then(function(dummy) {
									__Internal__.showNavigator();
								});
						};
					};
						
					return promise
						.nodeify(function(err, dummy) {
							__Internal__.runPromise = null; // free memory

							if (html) {
								stream.closeElement();
							};
					
							buffered && stream.flush();
							stream.reset();
					
							//io.stderr.flush();
							io.stderr.reset();
					
							if (dom) {
								__Internal__.showUnitName();
							};
					
							if (!isIndex) {
								if (dom) {
									if (!unit) {
										tools.alert("There is nothing to test.");
									} else if (err) {
										if (!err.bubble) {
											types.DEBUGGER();
											io.stderr.write(err.message);
											io.stderr.write(err.stack);
											//io.stderr.flush();
											tools.alert("An error occurred while testing.");
											success = false;
										};
									} else {
										__Internal__.showFails();
										if (!test.FAILED_TESTS) {
											tools.alert("Every tests passed.    Total: ~0~.", [test.TESTS_COUNT]);
										};
										success = false;
									};
								} else {
									if (!unit) {
										stream.print("End: There is nothing to test.");
									} else if (err) {
										if (!err.bubble) {
											types.DEBUGGER();
											io.stderr.print(err.message);
											io.stderr.print(err.stack);
											//io.stderr.flush();
											io.stderr.print("End: An error occurred while testing.");
											success = false;
										};
									} else if (test.FAILED_TESTS) {
										io.stderr.print("End: " + test.FAILED_TESTS + " test(s) failed.");
										success = false;
									} else {
										stream.print("End: Every tests passed.    Total: " + test.TESTS_COUNT);
									};
								};
								buffered && stream.flush();
								//io.stderr.flush();
							};
					
							return success;
						});
				});
			});
		},
	};
	return modules;
};

//! END_MODULE()
