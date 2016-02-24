//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: MyWidget.js - Test file
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
		DD_MODULES['MyWidget'] = {
			type: 'Application',
			version: '0d',
			namespaces: null,
			dependencies: [
				'Doodad.Widgets',
				{
					name: 'Doodad.Client.Widgets',
					optional: true,
				},
				{
					name: 'Doodad.NodeJs.IO',
					version: '0.2',
					optional: true,
				},
			],
			
			create: function create(root, /*optional*/_options) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
				var me = root.MyWidget,
					doodad = root.Doodad,
					mixIns = doodad.MixIns,
					namespaces = doodad.Namespaces,
					widgets = doodad.Widgets,
					client = doodad.Client,
					clientWidgets = client && client.Widgets,
					tools = doodad.Tools,
					types = doodad.Types,
					exceptions = doodad.Exceptions,
					io = doodad.IO,
					nodejs = doodad.NodeJs;

				//===================================
				// MyWidget
				//===================================
				var MyWidgetStep1 = doodad.REGISTER((nodejs ? widgets : clientWidgets).HtmlWidget.$extend(
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
					message: doodad.PROPERTY({
						value: null,
						writable: true,
					}),
					
					// Test property with "get" and "set"
					__value: 1,
					value: doodad.PROPERTY({
						get: function() {
							return this.__value;
						},
						set: function(value) {
							this.__value = value;
						},
					}),
					
					// Test private
					myPrivateAttr: doodad.PRIVATE("private"),
					myPrivateFn: doodad.PRIVATE(function() {
						return "private";
					}),
					
					// Test RENAME
					functionToRename: doodad.PUBLIC(function() {
						return "Rename me !";
					}),
					
					// Test _superFrom
					getVersion: doodad.PUBLIC(function() {
						return 1;
					}),
					
					render: doodad.OVERRIDE(function render(stream) {
						stream.write('<span' + this.renderHtmlAttributes(['main', 'mergeTest']) + '>' + tools.escapeHtml(this.message || '', this.document) + '</span>');
					}),
				}));

				var finalStep;
				if (nodejs) {
					finalStep = MyWidgetStep1;
				} else {
					var MyWidgetStep2 = doodad.REGISTER(doodad.BASE(MyWidgetStep1.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep2__',
						
						onJsClick: doodad.JS_EVENT('dblclick', function onJsClick(ev, context) {
							alert('click');
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
							return this._super() + " Done";
						}),
						
						acquire: doodad.OVERRIDE(function acquire() {
							this._super();
							var span = client.getFirstElement(this.stream.element);
							this.onJsClick.attach(span);
						}),
						
						release: doodad.OVERRIDE(function release() {
							this._super();
							this.onJsClick.clear();
						}),
						
						// Test _superFrom
						getVersion: doodad.REPLACE(function() {
							return 2;
						}),
					
					})));
					
					// Test adding js event type
					var MyWidgetStep3 = doodad.REGISTER(doodad.BASE(MyWidgetStep2.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep3__',
						
						onJsClick: doodad.OVERRIDE(doodad.JS_EVENT('click')),

						// Test _superFrom
						getVersion: doodad.REPLACE(function() {
							return 3;
						}),
					
					})));
					
					var MyWidgetStep4 = doodad.REGISTER(doodad.BASE(MyWidgetStep3.$extend(
					{
						$TYPE_NAME: '__MyWidgetStep4__',

						onJsClick: doodad.OVERRIDE(doodad.JS_EVENT(null, function onJsClick(ev, context) {
							this._super(ev, context);
							
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
							
							//throw new exceptions.Error("test");
							
						})),
						
						// Test _superFrom
						getVersion: doodad.REPLACE(function() {
							return 4;
						}),
					
					})));
					
					finalStep = MyWidgetStep4;
				};
				
				// Test overriding js event handler
				var MyWidget = me.REGISTER(finalStep.$extend(
				{
					$TYPE_NAME: 'MyWidget',
					
					// Test property overriding
					_value: 1,
					value: doodad.PROPERTY({
						get: doodad.OVERRIDE(function() {
							return this._super() + 1;
						}),
					}),

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
					
					
				//===================================
				// Init
				//===================================
				return function init(/*options*/) {
					var colors = ['white', 'red', 'magenta', 'green', 'black', 'yellow', 'blue', 'pink', 'gray', 'acqua', 'brown', 'gold', 'silver'];
					
					var createMyWidget = function createMyWidget(name, message) {
						var color;

						var myWidget = new me.MyWidget();
						
						var id = myWidget.getIdentity();
						id.id = id.name = id.class = name;
						myWidget.setIdentity(id);
						
						color = Math.floor(Math.random() * colors.length);
						var styles = myWidget.getStyles();
						styles.color = colors[color];
						colors.splice(color, 1);
						myWidget.setStyles(styles);
						
						var attributes = myWidget.getHtmlAttributes('mergeTest');
						attributes.class = 'mergeTest';
						myWidget.setHtmlAttributes(attributes, 'mergeTest');
						
						color = Math.floor(Math.random() * colors.length);
						var styles = myWidget.getStyles('mergeTest');
						styles.backgroundColor = colors[color];
						colors.splice(color, 1);
						myWidget.setStyles(styles, 'mergeTest');
						
						myWidget.message = message;
						
						return myWidget;
					};
					
					if (nodejs) {
						var myWidget = createMyWidget('myWidget1', 'Console !');
						var stream = new io.HtmlOutputStream();
						stream.pipe(io.stdout);
						myWidget.render(stream);
						stream.flush();
					} else {
						var myWidget = createMyWidget('myWidget1', 'Hello !');
						myWidget.onRender.attach(null, function onRender(ev) {alert('render 1')});
						myWidget.render('test1');

						var myWidget = createMyWidget('myWidget2', 'Salut !');
						myWidget.onRender.attach(null, function onRender(ev) {alert('render 2')});
						myWidget.render('test2');
						
						// Test "destroy"
						var myWidget = createMyWidget('myWidget3', 'Ciao !');
						myWidget.onRender.attach(null, function onRender(ev) {alert('render 3')});
						//myWidget.render('test3');
						myWidget.destroy();
						
						var myWidget = createMyWidget('myWidget3', 'Ciao !');
						myWidget.onRender.attach(null, function onRender(ev) {alert('render 3')});
						myWidget.render('test3');
						
						// Test "RENAMED"
						alert(myWidget.renamedFunction()); // Must be "Rename me ! Done"
						
						// Test "_superFrom"
						alert(myWidget.getVersion()); // Must be "2"
						
					};
				};
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));