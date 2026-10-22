-- ============================================================
-- Final clean-up. Run in Supabase SQL Editor. Safe to re-run.
-- Does NOT undo team corrections you already made in the admin page.
-- ============================================================

-- 1. Digital team
update employees set department = 'Digital'
 where lower(trim(name)) in ('prem gohil', 'gaurav gohil', 'dharmesh gohil',
                             'aanchal choudhary', 'yatin ashok mhatre');
update seats
   set occupant = jsonb_set(occupant, '{department}', '"Digital"')
 where occupant is not null
   and lower(trim(occupant->>'name')) in ('prem gohil', 'gaurav gohil', 'dharmesh gohil',
                                          'aanchal choudhary', 'yatin ashok mhatre');

-- 2. A person has a seat only if a desk carries their name
update employees e
   set seat = s.id, "table" = s."table"
  from seats s
 where s.status = 'occupied'
   and lower(trim(s.occupant->>'name')) = lower(trim(e.name))
   and e.name <> 'Guest User'
   and e.seat is distinct from s.id;

update employees e
   set seat = null, "table" = 'No desk'
 where e.name <> 'Guest User'
   and e.seat is not null
   and not exists (
     select 1 from seats s
      where s.status = 'occupied'
        and lower(trim(s.occupant->>'name')) = lower(trim(e.name)));

-- 3. Remove repeated names (Abhay Khabale, Mehak Dhand, Nathanial Siqueira Vaz …).
--    Keeps the row that has a desk, else the oldest. Guest User is skipped.
delete from employees e
 using (
   select id, row_number() over (
            partition by lower(trim(name))
            order by (seat is null), id) as rn
     from employees
    where lower(trim(name)) <> 'guest user'
 ) r
 where e.id = r.id and r.rn > 1;

-- 4. Check: any repeated names left? (should be empty)
select lower(trim(name)) as name, count(*) from employees
 where lower(trim(name)) <> 'guest user'
 group by 1 having count(*) > 1;
