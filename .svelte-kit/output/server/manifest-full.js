export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "VB19Reps/_app",
	assets: new Set(["banner.png","bbq-area.jpg","club-room.jpg","games-room.jpg"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.DrusRRlS.js",app:"_app/immutable/entry/app.Cvv9y9dP.js",imports:["_app/immutable/entry/start.DrusRRlS.js","_app/immutable/chunks/BtQE7oG8.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/J-sB4_aY.js","_app/immutable/entry/app.Cvv9y9dP.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DpIJLBU4.js","_app/immutable/chunks/BP8N04A3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
