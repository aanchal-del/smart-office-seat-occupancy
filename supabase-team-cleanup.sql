-- ============================================================
-- Team clean-up. Run in: Supabase Dashboard → SQL Editor.
-- Safe to re-run.
--   * AMEX 1            -> AMEX
--   * Servicing         -> CS
--   * CD Art / CD Copy / Planner -> one team "CD Art/Copy/Planner"
--   * Driver and Unassigned people removed
-- ============================================================

-- 1. AMEX 1 -> AMEX
update employees set department = 'AMEX' where lower(trim(department)) in ('amex 1', 'amex1');
update seats     set department = 'AMEX' where lower(trim(department)) in ('amex 1', 'amex1');
update seats
   set occupant = jsonb_set(occupant, '{department}', '"AMEX"')
 where occupant is not null and lower(trim(occupant->>'department')) in ('amex 1', 'amex1');

-- 2. (removed) "Amex & BKT" covered people from different teams — see
--    supabase-team-fix.sql, which sets each person's team individually.

-- 3. Servicing -> CS
update employees set department = 'CS' where lower(trim(department)) = 'servicing';

-- 4. CD Art / CD Copy / Planner -> one team
update employees
   set department = 'CD Art/Copy/Planner'
 where lower(trim(department)) in ('cd art', 'cd copy', 'planner')
    or name in ('Sumit Bansode', 'Harish Nair', 'Prabhanjan Kasar');

-- 5. Remove the Driver and Unassigned people (free any desk first)
update seats
   set status = 'free', occupant = null
 where id in (select seat from employees
               where seat is not null
                 and (name in ('JHA DRIVER', 'Sandesh Kadu')
                      or lower(trim(department)) in ('driver', 'unassigned')));

delete from employees
 where name in ('JHA DRIVER', 'Sandesh Kadu')
    or lower(trim(department)) in ('driver', 'unassigned');

-- 6. Check: teams now in use
select department, count(*) from employees group by 1 order by 1;
