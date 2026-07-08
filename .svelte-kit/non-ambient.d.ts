
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/events";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/events": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/events" | "/events/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/banner.png" | "/bbq-area.jpg" | "/club-room.jpg" | "/games-room.jpg" | "/gamesroom/1.jpeg" | "/gamesroom/2.jpeg" | "/gamesroom/3.jpeg" | "/gamesroom/4.jpeg" | "/gamesroom/5.jpeg" | "/posters/1.jpeg" | "/posters/1.jpg" | "/posters/10.jpeg" | "/posters/10.jpg" | "/posters/11.jpeg" | "/posters/11.jpg" | "/posters/2.jpeg" | "/posters/2.jpg" | "/posters/3.jpeg" | "/posters/3.jpg" | "/posters/4.jpeg" | "/posters/4.jpg" | "/posters/5.jpeg" | "/posters/5.jpg" | "/posters/6.jpeg" | "/posters/6.jpg" | "/posters/7.jpeg" | "/posters/7.jpg" | "/posters/8.jpeg" | "/posters/8.jpg" | "/posters/9.jpeg" | "/posters/9.jpg" | string & {};
	}
}