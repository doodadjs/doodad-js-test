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

		const REALM_WINDOW = document.getElementById('crossRealm').contentWindow;

		let realmRootPromise = new (global.Promise || global.ES6Promise)(function(resolve, reject) {
			REALM_WINDOW.setRealmRoot = function(err, root) {
				if (err) {
					reject(err);
				} else {
					resolve(root);
				};
			};
		});

		options['Doodad.Modules'] = {
			modulesUri: '../..',
		};

		global.createRoot(null, options)
			.then(function(root) {
                window.DD_ROOT = root; // debug

				const doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					modules = doodad.Modules,
					mixIns = doodad.MixIns;

				tools.trapUnhandledErrors();

				const Promise = types.getPromise();

				return Promise.try(function() {
					return modules.load([
						{
							module: 'doodad-js',
							path: 'common/Types_UUIDS.js',
						},
					], options)
					.then(function(root) {
						const promise = realmRootPromise;
						realmRootPromise = null; // free memory
						return promise;
					})
					.then(function(realmRoot) {
						const loadingImg = document.getElementById('loading');
						const oldLoadingDisplayStyle = loadingImg.style.display;
						loadingImg.style.display = 'none';

						let msg = '';
						msg += types.isType(realmRoot.Doodad.Types.Namespace) + ',';
						msg += types._instanceof(types, realmRoot.Doodad.Types.Namespace) + ',';
						msg += types._instanceof(realmRoot.Doodad.Types, types.Namespace) + ',';
						msg += types._instanceof(realmRoot.Doodad.Types, types.Type) + ',';
						msg += types._instanceof(new realmRoot.Doodad.Object(), doodad.Object) + ',';
						//msg += types._implements(realmRoot.Doodad.Object, mixIns.Creatable) + ',';
						msg += realmRoot.Doodad.Object._implements(mixIns.Creatable) + ',';
						msg += types.isType(realmRoot.Doodad.Types.Type) + ',';
						msg += types._instanceof(new REALM_WINDOW.Object(), Object) + ',';
						msg += ((typeof Symbol === 'undefined') ? 'true' : types._instanceof(REALM_WINDOW.Object(REALM_WINDOW.Symbol()), Symbol)) + ',';
						msg += types.isPromise(realmRoot.Doodad.Types.getPromise().resolve()) + ',';
						msg += types.isErrorType(realmRoot.Doodad.Types.Error) + ',';
						msg += types.isError(new (realmRoot.Doodad.Types.Error)("test"));
						msg += "  <=== Must be all 'true'";
						alert(msg);

						loadingImg.style.display = oldLoadingDisplayStyle;

						return modules.load([
							/*{
								module: 'doodad-js-unicode',
							},
							{
								module: 'doodad-js-locale',
							},
							{
								module: 'doodad-js-safeeval',
							},
							{
								module: 'doodad-js-loader',  NOTE: Loaded by "MyWidget_loader.js"
							},*/
							{
								module: 'doodad-js-test',
								path: 'widgets/MyWidget_loader.js',
							},
						], options);
					})
				});
			})
			.nodeify(function(err, dummy) {
				document.getElementById('loading').style.display = 'none';

				if (err) {
					alert(err);
				};
			});
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));