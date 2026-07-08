alter table public.events
  add constraint events_poster_url_key unique (poster_url);
