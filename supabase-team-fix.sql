-- ============================================================
-- Team fixes. Run in Supabase SQL Editor AFTER supabase-team-cleanup.sql.
-- Safe to re-run.
-- ============================================================

-- 1. "Finance / Studio" (and its typo "Fianace/Studio") -> Studio
update employees set department = 'Studio'
 where lower(replace(trim(department), ' ', '')) in ('finance/studio', 'fianace/studio');
update seats set department = 'Studio'
 where lower(replace(trim(department), ' ', '')) in ('finance/studio', 'fianace/studio');
update seats
   set occupant = jsonb_set(occupant, '{department}', '"Studio"')
 where occupant is not null
   and lower(replace(trim(occupant->>'department'), ' ', '')) in ('finance/studio', 'fianace/studio');

-- 2. Finance people (earlier "Amex & BKT" -> BKT merge put them in BKT)
update employees set department = 'Finance'
 where lower(trim(name)) in ('vidya sridhar', 'jennifer sequeira', 'yatin ashok mhatre', 'mahesh tanawde');

-- The Table 3 desks labelled BKT by that merge belong to Finance
update seats
   set department = 'Finance',
       occupant   = case when occupant is null then null
                         else jsonb_set(occupant, '{department}', '"Finance"') end
 where "table" = 'Table 3' and department = 'BKT';

-- 3. Chandni Upadhyay is Client Service (CS)
update employees set department = 'CS' where lower(trim(name)) = 'chandni upadhyay';

-- 4. Studio team: these six people
update employees set department = 'Studio'
 where lower(trim(name)) in ('biju dasan', 'dattaram kambli', 'ashok chatla',
                             'avishkar mandavkar', 'darryl gomes', 'varun lalka');

-- 5. Video team: add Mohit
update employees set department = 'Video Team' where lower(trim(name)) = 'mohit devganiya';

-- 6. Employees' own seat column had gone stale (several people pointing at the
--    same desk). Make it match the desks: a person has a seat only if a desk
--    carries their name; otherwise no seat.
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

-- 7. Remove duplicate people again (Chandni Upadhyay and Srushti Chawhan each
--    have two rows). Keep the row with a desk, else the oldest. Guest User skipped.
delete from employees e
 using (
   select id, row_number() over (
            partition by lower(trim(name))
            order by (seat is null), id) as rn
     from employees
    where lower(trim(name)) <> 'guest user'
 ) r
 where e.id = r.id and r.rn > 1;

-- 8. Check: people per team
select department, count(*) from employees group by 1 order by 1;
