export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.y6TPpKM_.js",app:"_app/immutable/entry/app.DZk38Y1d.js",imports:["_app/immutable/entry/start.y6TPpKM_.js","_app/immutable/chunks/C3pkwVm5.js","_app/immutable/chunks/-TS2BfOP.js","_app/immutable/chunks/Cy1Q1AeQ.js","_app/immutable/chunks/hGgqwOqa.js","_app/immutable/chunks/CAxOmkGy.js","_app/immutable/chunks/BJrkgHVf.js","_app/immutable/entry/app.DZk38Y1d.js","_app/immutable/chunks/Cy1Q1AeQ.js","_app/immutable/chunks/CT7QVDLL.js","_app/immutable/chunks/4bUo1EiA.js","_app/immutable/chunks/Iodbp_-i.js","_app/immutable/chunks/D8bjOph7.js","_app/immutable/chunks/CAxOmkGy.js","_app/immutable/chunks/BgSNG9tS.js","_app/immutable/chunks/C1ZqI0YK.js","_app/immutable/chunks/CKjOea12.js","_app/immutable/chunks/BJrkgHVf.js","_app/immutable/chunks/-TS2BfOP.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/blackouts",
				pattern: /^\/admin\/blackouts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/calendar",
				pattern: /^\/admin\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/reservations",
				pattern: /^\/admin\/reservations\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/announcements",
				pattern: /^\/announcements\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
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
