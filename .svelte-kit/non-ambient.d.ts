
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
		RouteId(): "/" | "/about" | "/admin" | "/admin/blackouts" | "/admin/calendar" | "/admin/reservations" | "/announcements";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/blackouts": Record<string, never>;
			"/admin/calendar": Record<string, never>;
			"/admin/reservations": Record<string, never>;
			"/announcements": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/blackouts" | "/admin/blackouts/" | "/admin/calendar" | "/admin/calendar/" | "/admin/reservations" | "/admin/reservations/" | "/announcements" | "/announcements/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/banner.png" | "/bbq-area.jpg" | "/club-room.jpg" | "/games-room.jpg" | string & {};
	}
}