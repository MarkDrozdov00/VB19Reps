export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","banner.png","bbq-area.jpg","club-room.jpg","games-room.jpg","gamesroom/1.jpeg","gamesroom/2.jpeg","gamesroom/3.jpeg","gamesroom/4.jpeg","gamesroom/5.jpeg","posters/1.jpeg","posters/1.jpg","posters/10.jpeg","posters/10.jpg","posters/11.jpeg","posters/11.jpg","posters/2.jpeg","posters/2.jpg","posters/3.jpeg","posters/3.jpg","posters/4.jpeg","posters/4.jpg","posters/5.jpeg","posters/5.jpg","posters/6.jpeg","posters/6.jpg","posters/7.jpeg","posters/7.jpg","posters/8.jpeg","posters/8.jpg","posters/9.jpeg","posters/9.jpg"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.BuCdqVoE.js",app:"_app/immutable/entry/app.kLOETvn2.js",imports:["_app/immutable/entry/start.BuCdqVoE.js","_app/immutable/chunks/CMn0wX8Z.js","_app/immutable/chunks/BZidcu-T.js","_app/immutable/chunks/bxAr0Eld.js","_app/immutable/chunks/UM4V9b7d.js","_app/immutable/entry/app.kLOETvn2.js","_app/immutable/chunks/BZidcu-T.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/xs5rWoyO.js","_app/immutable/chunks/C1rqC3vP.js","_app/immutable/chunks/C6Sio3Me.js","_app/immutable/chunks/bxAr0Eld.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
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
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/events",
				pattern: /^\/events\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
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
