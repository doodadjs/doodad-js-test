// doodad-js - Object-oriented programming framework
// File: main.js - Module startup file for 'webpack'.
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

window.onload = function() {
	const options = {};
	options['Doodad.Modules'] = {
		modulesUri: '../..',
	};
	
	const modules = {};
	require('doodad-js-unicode').add(modules);
	require('doodad-js-locale').add(modules);
	require('doodad-js-dates').add(modules);
	
	require('doodad-js').createRoot(modules, options)
		.then(function(root) {
			const tools = root.Doodad.Tools;
			tools.alert(tools.Dates.strftime("%c", new Date()));
		})
		.catch(function(err) {
			alert(err);
		});
};