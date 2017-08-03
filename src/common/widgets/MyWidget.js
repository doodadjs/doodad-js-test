//! BEGIN_MODULE()

//! REPLACE_BY("// Copyright 2015-2017 Claude Petit, licensed under Apache License version 2.0\n", true)
// doodad-js - Object-oriented programming framework
// File: MyWidget.js - Test file
// Project home: https://github.com/doodadjs/
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2015-2017 Claude Petit
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
		DD_MODULES['MyWidget/root'] = {
			type: 'Application',
			version: /*! REPLACE_BY(TO_SOURCE(VERSION(MANIFEST("name")))) */ null /*! END_REPLACE()*/,
			dependencies: [
				{
					name: 'doodad-js',
					version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js'))) */ null /*! END_REPLACE() */,
				}, 
				{
					name: 'doodad-js-io',
					version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js-io'))) */ null /*! END_REPLACE() */,
				}, 
				{
					name: 'doodad-js-widgets',
					version: /*! REPLACE_BY(TO_SOURCE(VERSION('doodad-js-widgets'))) */ null /*! END_REPLACE() */,
				}, 
			],
			
			create: function create(root, /*optional*/_options, _shared) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
				const me = root.MyWidget,
					doodad = root.Doodad,
					mixIns = doodad.MixIns,
					namespaces = doodad.Namespaces,
					widgets = doodad.Widgets,
					client = doodad.Client,
					tools = doodad.Tools,
					types = doodad.Types,
					exceptions = doodad.Exceptions,
					io = doodad.IO,
					nodejs = doodad.NodeJs;

				//===================================
				// MyWidget
				//===================================
				const MyWidgetStep1 = doodad.REGISTER(widgets.HtmlWidget.$extend(
				{
					$TYPE_NAME: '__MyWidgetStep1__',
					
					__attributes: {
						main : {
							class: 'main',
						},
						mergeTest: null,
					},
					__styles: {
						main: {
							border: "solid 1px black",
						},
					},
					
					// Test property with "value"
					message: (types.hasDefinePropertyEnabled() ? 
						doodad.PROPERTY({
							value: null,
							writable: true,
						}) : 
						doodad.PUBLIC(null)
					),
					
					// Test property with "get" and "set"
					__value: 1,
					value: (types.hasDefinePropertyEnabled() ? 
						doodad.PROPERTY({
							get: function() {
								return this.__value;
							},
							set: function(value) {
								this.__value = value;
							},
						}) :
						doodad.PUBLIC(1)
					),
					
					// Test private
					myPrivateAttr: doodad.PRIVATE("private"),
					myPrivateFn: doodad.PRIVATE(function() {
						return "private";
					}),
					
					// Test RENAME
					functionToRename: doodad.PUBLIC(function() {
						return "1";
					}),
					
					// Test _superFrom
					getVersion: doodad.PUBLIC(function() {
						return 1;
					}),
					
					render: doodad.OVERRIDE(function render() {
						this.stream.write('<span' + this.renderAttributes(['main', 'mergeTest']) + '>' + tools.escapeHtml(this.message || '', this.document) + '</span>');
					}),
				}));

				if (root.serverSide) {
					me.REGISTER(MyWidgetStep1.$extend(
					{
						$TYPE_NAME: 'MyWidget',
					}));
				} else {
					const MyWidgetStep2 = doodad.REGISTER(doodad.BASE(MyWidgetStep1.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep2__',
						
						onJsClick: doodad.JS_EVENT('click', function onJsClick(context) {
							tools.alert('click');
							//console.log(tools.getStackTrace());
							//throw new Error("error");
							/*
							try {
								this.myPrivateFn();
								console.log('private method from inside ok :)');
							} catch(ex) {
								console.log('private method from inside failed :(');
							};
							try {
								this.myPrivateAttr;
								console.log('private attribute from inside ok :)');
							} catch(ex) {
								console.log('private attribute from inside failed :(');
							};
							*/
						}),
					
						// Test RENAME
						functionToRename: doodad.RENAME_OVERRIDE(function renamedFunction() {
							return this._super() + " ,2";
						}),
						
						acquire: doodad.OVERRIDE(function acquire() {
							this._super();
							const span = client.getFirstElement(this.stream.element);
							this.onJsClick.attach(span);
						}),
						
						release: doodad.OVERRIDE(function release() {
							this._super();
							this.onJsClick.clear();
						}),
						
						// Test _superFrom
						getVersion: doodad.OVERRIDE(function() {
							return this._super() + 2;
						}),
					
					})));
					
					// Test adding js event type
					const MyWidgetStep3 = doodad.REGISTER(doodad.BASE(MyWidgetStep2.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep3__',
						
						// Test _superFrom
						getVersion: doodad.REPLACE(function() {
							return 3;
						}),
					
					})));
					
					const MyWidgetStep4 = doodad.REGISTER(doodad.BASE(MyWidgetStep3.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep4__',

						onJsClick: doodad.OVERRIDE(function onJsClick(context) {
							this._super(context);
							
							// Test re-render
							this.message += ' Click !';
							this.render();

							/* Test "EXTERNAL"
							this.destroy();		
							*/
							/*
							try {
								this.myPrivateFn();
								console.log('private method from outside failed :(');
							} catch(ex) {
								console.log('private method from outside ok :)');
							};
							try {
								this.myPrivateAttr;
								console.log('private attribute from outside failed :(');
							} catch(ex) {
								console.log('private attribute from outside ok :)');
							};
							*/
							
							//throw new types.Error("test");
							
						}),
						
						// Test _superFrom
						getVersion: doodad.OVERRIDE(function() {
							return this._super() + 4;
						}),
					
					})));
					
					// Test overriding js event handler
					me.REGISTER(MyWidgetStep4.$extend(
					{
						$TYPE_NAME: 'MyWidget',
					
						// Test property overriding
						value: (types.hasDefinePropertyEnabled() ?
							doodad.PROPERTY({
								get: doodad.OVERRIDE(function() {
									return this._super() + 1;
								}),
							}) :
							doodad.PUBLIC(2)
						),

						// Test private override
						/*
						myPrivateAttr: "private overridden",
						myPrivateFn: doodad.OVERRIDE(function() {
							return "private overriden";
						}),
						*/
					
						// Test RENAME (must respect the contract)
						functionToRename: doodad.OVERRIDE(function functionToRename() {
							return this.renamedFunction();
						}),

						// Test _superFrom
						getVersion: doodad.REPLACE(function() {
							return this._superFrom(MyWidgetStep2)();
						}),
				
					}));
				};
					
					
				//===================================
				// Init
				//===================================
				return function init(/*options*/) {
					const Promise = types.getPromise();
					
					const colors = ['white', 'red', 'magenta', 'green', 'black', 'yellow', 'blue', 'pink', 'gray', 'acqua', 'brown', 'gold', 'silver'];
					
					const createMyWidget = function createMyWidget(name, message, stream) {
						let color;

						const myWidget = new me.MyWidget();
						
						myWidget.setStream(stream);
						
						const id = myWidget.getIdentity();
						id.id = id.name = id.class = name;
						myWidget.setIdentity(id);
						
						let styles;

						color = Math.floor(Math.random() * colors.length);
						styles = myWidget.getStyles();
						styles.color = colors[color];
						colors.splice(color, 1);
						myWidget.setStyles(styles);
						
						const attributes = myWidget.getAttributes('mergeTest');
						attributes.class = 'mergeTest';
						myWidget.setAttributes(attributes, 'mergeTest');
						
						color = Math.floor(Math.random() * colors.length);
						styles = myWidget.getStyles('mergeTest');
						styles.backgroundColor = colors[color];
						colors.splice(color, 1);
						myWidget.setStyles(styles, 'mergeTest');
						
						myWidget.message = message;
						
						return myWidget;
					};
					
					if (root.serverSide) {
						const stream = new io.HtmlOutputStream();
						stream.pipe(io.stdout);
						const myWidget = createMyWidget('myWidget1', 'Console !', stream);
						return myWidget.render();
					} else {
						const myWidget1 = createMyWidget('myWidget1', 'Hello !', 'test1');
						myWidget1.onRender.attach(null, function onRender(ev) {tools.alert('render 1')});

						const myWidget2 = createMyWidget('myWidget2', 'Salut !', 'test2');
						myWidget2.onRender.attach(null, function onRender(ev) {tools.alert('render 2')});
						
						//// Test "destroy"
						//const myWidget3 = createMyWidget('myWidget3', 'Ciao !', 'test3');
						//myWidget3.onRender.attach(null, function onRender(ev) {alert('render 3')});
						////myWidget3.render('test3');
						//myWidget3.destroy();
						
						const myWidget3 = createMyWidget('myWidget3', 'Ciao !', 'test3');
						myWidget3.onRender.attach(null, function onRender(ev) {tools.alert('render 3')});

						return Promise.all([ myWidget1.render(), myWidget2.render(), myWidget3.render() ])
							.then(function doSomeTestsPromise() {
								let msg = '';
								msg += myWidget1.renamedFunction() + ',';
								msg += myWidget1.getVersion() + ',';
								msg += myWidget1.value
								tools.alert(msg + '<----- Must be "1,2,3,2"');
							});
					};
				};
			},
		};
		return DD_MODULES;
	},
};
//! END_MODULE()