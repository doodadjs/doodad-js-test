//! REPLACE_BY("// Copyright 2015 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Class library for Javascript (BETA) with some extras (ALPHA)
// File: MyWidget_loader.js - Test file
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

	global.DD_SCRIPTS = (global.DD_SCRIPTS || []);

	global.DD_SCRIPTS.push(
		{
			description: "Load IO.js",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.IO')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: '../../common/IO.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
							optional: false,
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load Widgets.js",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.IO')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Widgets')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: '../../common/Widgets.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
							optional: false,
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load Client_IO.js",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Client')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs')",
							"root.Doodad.Namespaces.getNamespace('Doodad.Client.IO')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: '../../client/Client_IO.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
							optional: false,
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load Client_Widgets.js",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Client.IO')",
							"root.Doodad.Namespaces.getNamespace('Doodad.Widgets')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs')",
							"root.Doodad.Namespaces.getNamespace('Doodad.Client.Widgets')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: '../../client/Client_Widgets.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
							optional: false,
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load NodeJs_IO.js",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Client')",
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs.IO')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: '../../server/nodejs/NodeJs_IO.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load MyWidget.js (browser)",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Client.Widgets')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: './MyWidget.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
						}, 
						{
							fileType: 'css',
							fileName: './MyWidget.css',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
							media: 'screen',
						}, 
					],
					initializers: [
					],
				}
			]
		},
		{
			description: "Load MyWidget.js (nodejs)",
			dependencies : [
				{
					optional: false,
					conditions: {
						include: [ // "and" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.NodeJs.IO')",
							"root.Doodad.Namespaces.getNamespace('Doodad.Widgets')",
						],
						exclude: [ // "or" conditions
							"root.Doodad.Namespaces.getNamespace('Doodad.Client')",
						],
						before: false,
					},
					scripts: [
						{
							fileType: 'js',
							fileName: './MyWidget.js',
							baseUrl: function(root){return root.Doodad.Tools.getCurrentScript((global.document?document.currentScript:module.filename)||(function(){try{throw new Error("");}catch(ex){return ex;}})())},
						}, 
					],
					initializers: [
					],
				}
			]
		}
	);
})();