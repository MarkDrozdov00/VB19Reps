export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","banner.png","banner.webp","bbq-area.jpg","bbq-area.webp","club-room.jpg","club-room.webp","games-room.jpg","games-room.webp","gamesroom/1.jpeg","gamesroom/1.webp","gamesroom/2.jpeg","gamesroom/2.webp","gamesroom/3.jpeg","gamesroom/3.webp","gamesroom/4.jpeg","gamesroom/4.webp","gamesroom/5.jpeg","gamesroom/5.webp","posters/1.jpeg","posters/1.jpg","posters/1.webp","posters/10.jpeg","posters/10.jpg","posters/10.webp","posters/11.jpeg","posters/11.jpg","posters/11.webp","posters/2.jpeg","posters/2.jpg","posters/2.webp","posters/3.jpeg","posters/3.jpg","posters/3.webp","posters/4.jpeg","posters/4.jpg","posters/4.webp","posters/5.jpeg","posters/5.jpg","posters/5.webp","posters/6.jpeg","posters/6.jpg","posters/6.webp","posters/7.jpeg","posters/7.jpg","posters/7.webp","posters/8.jpeg","posters/8.jpg","posters/8.webp","posters/9.jpeg","posters/9.jpg","posters/9.webp"]),
	mimeTypes: {".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".jpeg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.DkXc6j4K.js",app:"_app/immutable/entry/app.DxUdDFFx.js",imports:["_app/immutable/entry/start.DkXc6j4K.js","_app/immutable/chunks/DXXn8V6U.js","_app/immutable/chunks/BZidcu-T.js","_app/immutable/chunks/bxAr0Eld.js","_app/immutable/chunks/CLVTMnja.js","_app/immutable/entry/app.DxUdDFFx.js","_app/immutable/chunks/BZidcu-T.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/xs5rWoyO.js","_app/immutable/chunks/C1rqC3vP.js","_app/immutable/chunks/C6Sio3Me.js","_app/immutable/chunks/bxAr0Eld.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
