(function() {
	"use strict";

	const __prevOnLoad__ = window.onload;
	window.onload = function onload(ev) {
		if (__prevOnLoad__) {
			__prevOnLoad__.call(this, ev);
		};

		const global = window;

		const SECRET = ((typeof Symbol === 'function') ? Symbol() : []);

		const options = {startup: {secret: SECRET}};

		options['Doodad.Modules'] = {
			modulesUri: '../..',
		};

		global.createRoot(null, options)
			.then(function(root) {
				const doodad = root.Doodad,
					tools = doodad.Tools,
					modules = doodad.Modules;

				tools.trapUnhandledErrors();

                return modules.load([
					{
						module: 'doodad-js',
						path: 'common/Types_UUIDS.js',
					},
				], options);
			})
            .then(function(root) {
                window.setRealmRoot(null, root);
            })
			.catch(function(err) {
                window.setRealmRoot(err);
			})
			.catch(function(err) {
                alert(err);
			});
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));