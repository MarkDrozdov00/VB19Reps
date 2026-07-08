update public.facilities
set name = case display_name
  when 'Club Room' then 'CLUB_ROOM'
  when 'Games Room' then 'GAMES_ROOM'
  when 'BBQ Area' then 'BBQ_AREA'
  else name
end
where display_name in ('Club Room', 'Games Room', 'BBQ Area');
