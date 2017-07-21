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
                return root.Doodad.Modules.load([
					{
						module: 'doodad-js',
						path: 'common/Types_UUIDS.js',
					},
				], options);
			})
            .then(function(root) {
                window.DD_ROOT = root;

                const doodad = root.Doodad,
                    types = doodad.Types,
					modules = doodad.Modules,
                    mixIns = doodad.MixIns;

                doodad.Tools.trapUnhandledErrors();

                const crossRealm = document.getElementById('crossRealm').contentWindow;

                let msg = '';
                msg += types.isType(crossRealm.DD_ROOT.Doodad.Types.Namespace) + ',';
                msg += types._instanceof(types, crossRealm.DD_ROOT.Doodad.Types.Namespace) + ',';
                msg += types._instanceof(crossRealm.DD_ROOT.Doodad.Types, types.Namespace) + ',';
                msg += types._instanceof(crossRealm.DD_ROOT.Doodad.Types, types.Type) + ',';
                msg += types._instanceof(new crossRealm.DD_ROOT.Doodad.Object(), doodad.Object) + ',';
                //msg += types._implements(crossRealm.DD_ROOT.Doodad.Object, mixIns.Creatable) + ',';
                msg += crossRealm.DD_ROOT.Doodad.Object._implements(mixIns.Creatable) + ',';
                msg += types.isType(crossRealm.DD_ROOT.Doodad.Types.Type) + ',';
                msg += types._instanceof(new crossRealm.Object(), Object) + ',';
                msg += ((typeof Symbol === 'undefined') ? 'true' : types._instanceof(crossRealm.Object(crossRealm.Symbol()), Symbol)) + ',';
                msg += types.isPromise(crossRealm.DD_ROOT.Doodad.Types.getPromise().resolve()) + ',';
                msg += types.isErrorType(crossRealm.DD_ROOT.Doodad.Types.Error) + ',';
                msg += types.isError(new (crossRealm.DD_ROOT.Doodad.Types.Error)("test"));
                msg += "  <=== Must be all 'true'";
                alert(msg);

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
			['catch'](function (err) {
				alert(err);
			});
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));