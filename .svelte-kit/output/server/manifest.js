export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "VB19Reps/_app",
	assets: new Set(["banner.png","bbq-area.jpg","club-room.jpg","favicon.png","games-room.jpg"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.BQqrXWKV.js",app:"_app/immutable/entry/app.BIyQ7m5K.js",imports:["_app/immutable/entry/start.BQqrXWKV.js","_app/immutable/chunks/BC_jkXGw.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/CJQO3vYM.js","_app/immutable/entry/app.BIyQ7m5K.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DpIJLBU4.js","_app/immutable/chunks/BP8N04A3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
