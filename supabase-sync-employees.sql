-- ============================================================
-- Sync employees + seats with the current roster.
-- Run in: Supabase Dashboard → SQL Editor (after supabase-schema.sql).
-- Safe to re-run: names are matched case-insensitively, so nothing is
-- inserted twice and removed people stay removed.
-- ============================================================

-- 0. Identity sequence: the seed inserted explicit ids, which does not advance
--    the sequence, so new inserts would collide. Move it past the current max.
select setval(
  pg_get_serial_sequence('employees', 'id'),
  greatest((select coalesce(max(id), 0) from employees), 1)
);

-- 1. Table 7 (6 desks) and Table 8 (5 desks) — new desks, left free
insert into seats (id, label, floor, status, occupant, department, "table", color) values
  ('Desk 57', 'Desk 57', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 58', 'Desk 58', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 59', 'Desk 59', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 60', 'Desk 60', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 61', 'Desk 61', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 62', 'Desk 62', 'main-floor', 'free', null, 'Table 7', 'Table 7', null),
  ('Desk 63', 'Desk 63', 'main-floor', 'free', null, 'Table 8', 'Table 8', null),
  ('Desk 64', 'Desk 64', 'main-floor', 'free', null, 'Table 8', 'Table 8', null),
  ('Desk 65', 'Desk 65', 'main-floor', 'free', null, 'Table 8', 'Table 8', null),
  ('Desk 66', 'Desk 66', 'main-floor', 'free', null, 'Table 8', 'Table 8', null),
  ('Desk 67', 'Desk 67', 'main-floor', 'free', null, 'Table 8', 'Table 8', null)
on conflict (id) do nothing;

-- 2. People who are no longer on the roster
create temp table _removed(name text) on commit drop;
insert into _removed(name) values
  ('Sujay Bhonsle'), ('Smriti Tewari'), ('Dhruti Maru'), ('Masumi Shrimankar'),
  ('Dhruvi Shah'), ('Aditya Salve'), ('Bhaskar Wooragonda'), ('Abhishek Shelar'),
  ('Nitesh Kumar'), ('Sumedh Sawant'), ('Anoushka Kabre'),
  ('Intern 1'), ('Intern 2'), ('Intern 3'), ('3 Interns');

-- 2a. Free the desks they were sitting at
update seats
   set status = 'free', occupant = null
 where id in (
         select e.seat from employees e
          where e.seat is not null
            and lower(trim(e.name)) in (select lower(name) from _removed))
    or lower(trim(occupant->>'name')) in (select lower(name) from _removed);

-- 2b. Delete them
delete from employees
 where lower(trim(name)) in (select lower(name) from _removed);

-- 2c. Remove duplicate rows for the same person. Keep the row that has a desk
--     (then the oldest id). 'Guest User' is skipped — each guest booking is its
--     own row. Any desk left behind by a deleted duplicate is freed.
with ranked as (
  select id, seat,
         row_number() over (
           partition by lower(trim(name))
           order by (seat is null), id
         ) as rn
    from employees
   where lower(trim(name)) <> 'guest user'
),
deleted as (
  delete from employees e
   using ranked r
   where e.id = r.id and r.rn > 1
  returning e.id, e.seat
)
update seats s
   set status = 'free', occupant = null
 where s.id in (select seat from deleted where seat is not null)
   and not exists (
     select 1 from employees e
      where e.seat = s.id and e.id not in (select id from deleted)
   );

-- 3. New people (no desk, WFH) — skipped if the name already exists
insert into employees (name, department, seat, "table", "checkIn", wfh)
select v.name, v.department, null, 'No desk', '09:00 AM', true
  from (values
    ('Sumit Bansode',            'CD Art'),
    ('Harish Nair',              'CD Copy'),
    ('Anusha Pillai',            'Art'),
    ('Sakshi Chavan',            'Art'),
    ('Nidhi Chotalia',           'Art'),
    ('Samina Jesawadawala',      'Copy'),
    ('Christos Lowrence Shetty', 'Video Team'),
    ('Rajat Fartyal',            'Video Team'),
    ('Ravindra Ambavkar',        'Studio'),
    ('Vedant Kotian',            'Servicing'),
    ('Dharmesh Gohil',           'Html'),
    ('Mehak Dhand',              'Digital'),
    ('Prabhanjan Kasar',         'Planner'),
    ('Sandesh Kadu',             'Unassigned'),
    ('JHA DRIVER',               'Driver')
  ) as v(name, department)
 where not exists (
   select 1 from employees e where lower(trim(e.name)) = lower(trim(v.name))
 );

-- 4. Check: any duplicate names left? (should return zero rows; 'guest user'
--    may still show if several guest bookings exist — that is expected)
select lower(trim(name)) as name, count(*) from employees
 group by 1 having count(*) > 1;
