update public.events
set poster_url = regexp_replace(poster_url, '\.(jpe?g)$', '.webp', 'i')
where poster_url ~* '^/posters/[0-9]+\.(jpe?g)$';
