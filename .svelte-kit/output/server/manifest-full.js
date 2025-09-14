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
		client: {start:"_app/immutable/entry/start.DYPVzQ-F.js",app:"_app/immutable/entry/app.BixVUV9O.js",imports:["_app/immutable/entry/start.DYPVzQ-F.js","_app/immutable/chunks/C9p9KVmg.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/DVtHp5yr.js","_app/immutable/entry/app.BixVUV9O.js","_app/immutable/chunks/ys46v9TR.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DpIJLBU4.js","_app/immutable/chunks/BP8N04A3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
