(function() {
	"use strict";

	var	__prevOnLoad__ = window.onload;
	window.onload = function testWindowOnLoad(ev) {
		if (__prevOnLoad__) {
			__prevOnLoad__.call(this, ev);
		};

		const global = window;

		const options = {};

		options['Doodad.Modules'] = {
			modulesUri: '../..',
		};

		options['Doodad.Tools.Dates.Moment'] = {
			dataUri: '/app/lib/moment-timezone/data/',
		};

		global.createRoot(null, options)
			.then(function(root) {
				global.DD_ROOT = root; // For testing
				return root;
			})
			.then(function(root) {
				const doodad = root.Doodad,
					modules = doodad.Modules;

				return modules.load([
					/*{ NOTE: Gets automaticaly loaded by safeeval tests
						module: 'doodad-js',
						path: 'test/doodad-js_tests.js',
					},*/
					{
						module: 'doodad-js-safeeval',
					},
					{
						module: 'doodad-js-safeeval',
						path: 'test/doodad-js-safeeval_tests.js',
					},
					{
						module: 'doodad-js-dates', // For testing
					},
				], options);
			})
			.then(function(root) {
				const doodad = root.Doodad,
					tools = doodad.Tools,
					test = doodad.Test,
					clientIO = doodad.Client.IO;

				const args = tools.getCurrentLocation().args,
					unitName = args.get('unit');

				test.setOutput(new clientIO.DomOutputStream({ flushMode: 'manual' }));

				return test.run({name: unitName});
			})
			.catch(function (err) {
				alert(err);
			});
	};
})();