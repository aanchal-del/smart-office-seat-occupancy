const officeInfo = {
  totalStaff: 72,
  deskDemand: 57,
  employeesNeedingDesk: 57,
  internsNeedingDesk: 3,
  adminsNoDesk: 2,
  totalSeats: 57,
};

const state = {
  seats: [],
  showActualLayout: true,
  showLayoutImage: false,
  tableVisualMode: false,
  departmentFilter: '',
  adminTeamFilter: '',
  activeAdminTab: 'seats',
  employees: [],
  adminLoggedIn: false,
  adminSearchQuery: '',
  meetingRooms: [],
  refreshIntervalId: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  isDraggingMap: false,
  dragStart: { x: 0, y: 0 },
  searchQuery: ''
};

const seatStatuses = ['free', 'occupied', 'reserved'];

const SUPABASE_URL = 'https://ccqehlsdzzcnlkkwlhba.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWVobHNkenpjbmxra3dsaGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjg2MjcsImV4cCI6MjA5NDg0NDYyN30.e91s3wvVZw-fVVGRRMYO8sb1MKCDuLbvjzQmYIFv33w'; // ← paste your full key here
let _supabase = null;
try {
  if (typeof window !== 'undefined' && window.supabase) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase CDN not loaded — running on local mock data.');
  }
} catch (e) {
  console.warn('Supabase init failed:', e.message, '— running on local mock data.');
}

const mockEmployees = [
  { id: 1, name: 'Sujay Bhonsle', department: 'CS', seat: 'Desk 1', table: 'Table 1', checkIn: '09:11 AM', wfh: false },
  { id: 2, name: 'Smriti Tewari', department: 'CS', seat: 'Desk 2', table: 'Table 1', checkIn: '09:12 AM', wfh: false },
  { id: 3, name: 'Blaise Vaz', department: 'CS', seat: 'Desk 3', table: 'Table 1', checkIn: '09:13 AM', wfh: false },
  { id: 31, name: 'Jyoti Nair', department: 'CS', seat: 'Desk 4', table: 'Table 1', checkIn: '09:41 AM', wfh: false },
  { id: 32, name: 'Bhagyashree Shah', department: 'CS', seat: 'Desk 5', table: 'Table 1', checkIn: '09:42 AM', wfh: false },
  { id: 33, name: 'Nilesh Singh Bashera', department: 'CS', seat: 'Desk 6', table: 'Table 1', checkIn: '09:43 AM', wfh: false },
  { id: 34, name: 'Chandni Upadhyay', department: 'CS', seat: 'Desk 7', table: 'Table 1', checkIn: '09:44 AM', wfh: false },
  { id: 35, name: 'Pranjal Agarwal', department: 'CS', seat: 'Desk 8', table: 'Table 1', checkIn: '09:45 AM', wfh: false },
  { id: 36, name: 'Srushti Chawhan', department: 'CS', seat: 'Desk 9', table: 'Table 1', checkIn: '09:46 AM', wfh: false },
  { id: 37, name: 'Nathanial Siqueira Vaz', department: 'CS', seat: 'Desk 10', table: 'Table 1', checkIn: '09:47 AM', wfh: false },
  { id: 38, name: 'Dhruti Maru', department: 'CS', seat: 'Desk 11', table: 'Table 1', checkIn: '09:48 AM', wfh: false },
  { id: 39, name: 'Dhyan Ramnani', department: 'CS', seat: 'Desk 12', table: 'Table 1', checkIn: '09:49 AM', wfh: false },
  { id: 11, name: 'Rupesh Doiphode', department: 'Art', seat: 'Desk 13', table: 'Table 2', checkIn: '09:21 AM', wfh: false },
  { id: 12, name: 'Yogesh More', department: 'Art', seat: 'Desk 14', table: 'Table 2', checkIn: '09:22 AM', wfh: false },
  { id: 13, name: 'Rahul Kumawat', department: 'Art', seat: 'Desk 15', table: 'Table 2', checkIn: '09:23 AM', wfh: false },
  { id: 14, name: 'Masumi Shrimankar', department: 'Art', seat: 'Desk 16', table: 'Table 2', checkIn: '09:24 AM', wfh: false },
  { id: 15, name: 'Dhruvi Shah', department: 'Art', seat: 'Desk 17', table: 'Table 2', checkIn: '09:25 AM', wfh: false },
  { id: 16, name: 'Sonali Sawant', department: 'Art', seat: 'Desk 18', table: 'Table 2', checkIn: '09:26 AM', wfh: false },
  { id: 17, name: 'Sushant Agare', department: 'Art', seat: 'Desk 19', table: 'Table 2', checkIn: '09:27 AM', wfh: false },
  { id: 18, name: 'Amey Lad', department: 'Art', seat: 'Desk 20', table: 'Table 2', checkIn: '09:28 AM', wfh: false },
  { id: 19, name: 'Kiran Salkar', department: 'Art', seat: 'Desk 21', table: 'Table 2', checkIn: '09:29 AM', wfh: false },
  { id: 20, name: 'Atharva Salvi', department: 'Art', seat: 'Desk 22', table: 'Table 2', checkIn: '09:30 AM', wfh: false },
  { id: 23, name: 'Subodh Chaubey', department: 'Copy', seat: 'Desk 23', table: 'Table 3', checkIn: '09:33 AM', wfh: false },
  { id: 24, name: 'Ryan Parkar', department: 'Copy', seat: 'Desk 24', table: 'Table 3', checkIn: '09:34 AM', wfh: false },
  { id: 25, name: 'Ritwik Mishra', department: 'Copy', seat: 'Desk 25', table: 'Table 3', checkIn: '09:35 AM', wfh: false },
  { id: 26, name: 'Sanjit Samant', department: 'Copy', seat: 'Desk 26', table: 'Table 3', checkIn: '09:36 AM', wfh: false },
  { id: 27, name: 'Anarghya Poojary', department: 'Copy', seat: 'Desk 27', table: 'Table 3', checkIn: '09:37 AM', wfh: false },
  { id: 28, name: 'Juhi Pravin Shah', department: 'Copy', seat: 'Desk 28', table: 'Table 3', checkIn: '09:38 AM', wfh: false },
  { id: 29, name: 'Gaurav Pant', department: 'Copy', seat: 'Desk 29', table: 'Table 3', checkIn: '09:39 AM', wfh: false },
  { id: 30, name: 'Aditya Salve', department: 'Copy', seat: 'Desk 30', table: 'Table 3', checkIn: '09:40 AM', wfh: false },
  { id: 4, name: 'Viraj Chorghe', department: 'Flims', seat: 'Desk 31', table: 'Table 4', checkIn: '09:14 AM', wfh: false },
  { id: 5, name: 'Varun Lalka', department: 'Flims', seat: 'Desk 32', table: 'Table 4', checkIn: '09:15 AM', wfh: false },
  { id: 6, name: 'Darryl Gomes', department: 'Flims', seat: 'Desk 33', table: 'Table 4', checkIn: '09:16 AM', wfh: false },
  { id: 7, name: 'Ashok Chatla', department: 'Flims', seat: 'Desk 34', table: 'Table 4', checkIn: '09:17 AM', wfh: false },
  { id: 8, name: 'Raj Kolambkar', department: 'Flims', seat: 'Desk 35', table: 'Table 4', checkIn: '09:18 AM', wfh: false },
  { id: 9, name: 'Avishkar Mandavkar', department: 'Flims', seat: 'Desk 36', table: 'Table 4', checkIn: '09:19 AM', wfh: false },
  { id: 10, name: 'Bhaskar Wooragonda', department: 'Flims', seat: 'Desk 37', table: 'Table 4', checkIn: '09:20 AM', wfh: false },
  { id: 46, name: 'Dattaram Kambli', department: 'Studio', seat: 'Desk 38', table: 'Table 5', checkIn: '09:16 AM', wfh: false },
  { id: 47, name: 'Biju Dasan', department: 'Studio', seat: 'Desk 39', table: 'Table 5', checkIn: '09:17 AM', wfh: false },
  { id: 48, name: 'Uday Panchal', department: 'Studio', seat: 'Desk 40', table: 'Table 5', checkIn: '09:18 AM', wfh: false },
  { id: 49, name: 'Ashish Kumbhar', department: 'Studio', seat: 'Desk 41', table: 'Table 5', checkIn: '09:19 AM', wfh: false },
  { id: 50, name: 'Navnath Bhere', department: 'Studio', seat: 'Desk 42', table: 'Table 5', checkIn: '09:20 AM', wfh: false },
  { id: 51, name: 'Rajesh K Bhardwaj', department: 'Studio', seat: 'Desk 43', table: 'Table 5', checkIn: '09:21 AM', wfh: false },
  { id: 52, name: 'Abhishek Shelar', department: 'Studio', seat: 'Desk 44', table: 'Table 5', checkIn: '09:22 AM', wfh: false },
  { id: 54, name: 'Meghna Gambhir', department: 'Digital', seat: 'Desk 45', table: 'Table 6', checkIn: '09:24 AM', wfh: false },
  { id: 55, name: 'Amaan Khan', department: 'Digital', seat: 'Desk 46', table: 'Table 6', checkIn: '09:25 AM', wfh: false },
  { id: 56, name: 'Mohit Devganiya', department: 'Digital', seat: 'Desk 47', table: 'Table 6', checkIn: '09:26 AM', wfh: false },
  { id: 57, name: 'Prem Gohil', department: 'Digital', seat: 'Desk 48', table: 'Table 6', checkIn: '09:27 AM', wfh: false },
  { id: 58, name: 'Gaurav Gohil', department: 'Digital', seat: 'Desk 49', table: 'Table 6', checkIn: '09:28 AM', wfh: false },
  { id: 59, name: 'Nitesh Kumar', department: 'Digital', seat: 'Desk 50', table: 'Table 6', checkIn: '09:29 AM', wfh: false },
  { id: 60, name: 'Aanchal Choudhary', department: 'Digital', seat: 'Desk 51', table: 'Table 6', checkIn: '09:30 AM', wfh: false },
  { id: 61, name: 'Jennifer Sequeira', department: 'Digital', seat: 'Desk 52', table: 'Table 6', checkIn: '09:31 AM', wfh: false },
  { id: 62, name: 'Vidya Sridhar', department: 'Digital', seat: 'Desk 53', table: 'Table 6', checkIn: '09:32 AM', wfh: false },
  { id: 63, name: 'Mahesh Tanawde', department: 'Digital', seat: 'Desk 54', table: 'Table 6', checkIn: '09:33 AM', wfh: false },
  { id: 64, name: 'Yatin Ashok Mhatre', department: 'Digital', seat: 'Desk 55', table: 'Table 6', checkIn: '09:34 AM', wfh: false },
  { id: 65, name: 'Akshita Datir', department: 'Digital', seat: 'Desk 56', table: 'Table 6', checkIn: '09:35 AM', wfh: false },
  { id: 21, name: 'Siya Pandit', department: 'Art', seat: null, table: 'No desk', checkIn: '09:31 AM', wfh: true },
  { id: 22, name: 'Sumedh Sawant', department: 'Art', seat: null, table: 'No desk', checkIn: '09:32 AM', wfh: true },
  { id: 40, name: 'Jayalaxmi Ravi', department: 'CS', seat: null, table: 'No desk', checkIn: '09:10 AM', wfh: true },
  { id: 41, name: 'Abhay Khabale', department: 'CS', seat: null, table: 'No desk', checkIn: '09:11 AM', wfh: true },
  { id: 42, name: 'Steffi Barboza', department: 'CS', seat: null, table: 'No desk', checkIn: '09:12 AM', wfh: true },
  { id: 43, name: 'Tarun Kamath', department: 'CS', seat: null, table: 'No desk', checkIn: '09:13 AM', wfh: true },
  { id: 44, name: 'Kshitij Bidvai', department: 'CS', seat: null, table: 'No desk', checkIn: '09:14 AM', wfh: true },
  { id: 45, name: 'Anoushka Kabre', department: 'CS', seat: null, table: 'No desk', checkIn: '09:15 AM', wfh: true },
  { id: 53, name: 'Sunil Saundalkar', department: 'Studio', seat: null, table: 'No desk', checkIn: '09:23 AM', wfh: true },
  { id: 66, name: 'Intern 1', department: 'Digital', seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true },
  { id: 67, name: 'Intern 2', department: 'Digital', seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true },
  { id: 68, name: 'Intern 3', department: 'Digital', seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true }
];

// departmentOptions / directoryGroups / seatTableGroups / deptToTable are all
// derived from tableConfig below (single source of truth).

const defaultMeetingRooms = [
  { id: 1, name: 'Board Room',       capacity: 12, status: 'available', booked_by: null, booked_until: null },
  { id: 2, name: 'Conference Room A',capacity: 8,  status: 'available', booked_by: null, booked_until: null },
  { id: 3, name: 'Conference Room B',capacity: 6,  status: 'available', booked_by: null, booked_until: null },
  { id: 4, name: 'Huddle Room 1',    capacity: 4,  status: 'available', booked_by: null, booked_until: null },
  { id: 5, name: 'Huddle Room 2',    capacity: 4,  status: 'available', booked_by: null, booked_until: null },
];

// ── Seat layout: single source of truth ─────────────────────────────────────
// Each table has two rows ("sides"); each side belongs to a team. Seats are
// numbered sequentially (Desk 1, Desk 2, …) following this order.
const tableConfig = [
  { table: 'Table 1', sides: [{ team: 'BKT', count: 4 },         { team: 'AMEX', count: 4 }] },
  { table: 'Table 2', sides: [{ team: 'Art', count: 4 },         { team: 'Art', count: 4 }] },
  { table: 'Table 3', sides: [{ team: 'Studio', count: 5 },      { team: 'Studio', count: 4 }] },
  { table: 'Table 4', sides: [{ team: 'UnderArmour', count: 5 }, { team: 'Nat GEO', count: 5 }] },
  { table: 'Table 5', sides: [{ team: 'AMEX 2', count: 4 },      { team: 'EBCO', count: 4 }] },
  { table: 'Table 6', sides: [{ team: 'VYOMA', count: 4 },       { team: 'Finance/HR', count: 4 }] },
  { table: 'Table 7', sides: [{ team: 'Table 7', count: 6 }] },
];

// Derived: 'Desk N' -> { table, department, side: 'top'|'bottom', sideIndex }
const seatMeta = {};
(function buildSeatMeta() {
  let n = 1;
  tableConfig.forEach((t) => {
    t.sides.forEach((side, si) => {
      for (let k = 0; k < side.count; k++) {
        seatMeta[`Desk ${n}`] = {
          table: t.table,
          department: side.team,
          side: si === 0 ? 'top' : 'bottom',
          sideIndex: k,
        };
        n++;
      }
    });
  });
})();

const SEATS_PER_ROW = 5; // each table has 2 rows; a row holds at most this many desks

// Re-derive seatMeta (which row/side each desk sits on) from the ACTUAL seats in
// state, so dynamically-added desks get placed correctly. Rule: a desk prefers
// its team's side; each row caps at SEATS_PER_ROW; extras overflow to the other row.
function rebuildSeatMeta() {
  for (const k in seatMeta) delete seatMeta[k];
  const deskNum = (id) => { const n = parseInt(String(id).replace(/\D/g, ''), 10); return Number.isNaN(n) ? 0 : n; };

  // Preferred team for each side, from the table layout config.
  const sideTeams = {};
  tableConfig.forEach((t) => {
    sideTeams[t.table] = { top: t.sides[0]?.team, bottom: t.sides[1]?.team || t.sides[0]?.team };
  });

  const byTable = {};
  state.seats.forEach((s) => {
    if (!s.id || String(s.id).startsWith('Cabin')) return;
    (byTable[s.table] = byTable[s.table] || []).push(s);
  });

  Object.entries(byTable).forEach(([table, seats]) => {
    seats.sort((a, b) => deskNum(a.id) - deskNum(b.id));
    const teams = sideTeams[table] || { top: seats[0]?.department, bottom: seats[0]?.department };
    let top = 0, bottom = 0;
    seats.forEach((s) => {
      let side;
      if (s.department === teams.top && top < SEATS_PER_ROW) side = 'top';
      else if (s.department === teams.bottom && bottom < SEATS_PER_ROW) side = 'bottom';
      else if (top < SEATS_PER_ROW) side = 'top';
      else if (bottom < SEATS_PER_ROW) side = 'bottom';
      else side = 'top'; // beyond 2 full rows — shouldn't happen (add-seat caps at 10)
      const sideIndex = side === 'top' ? top++ : bottom++;
      seatMeta[s.id] = { table, department: s.department, side, sideIndex };
    });
  });
}

const seatTableGroups = tableConfig.map((t) => t.table);

// Ordered, de-duplicated team list
const TEAMS = [];
tableConfig.forEach((t) => t.sides.forEach((s) => { if (!TEAMS.includes(s.team)) TEAMS.push(s.team); }));

const directoryGroups = TEAMS;
const departmentOptions = TEAMS;

// team -> first table that contains it
const deptToTable = {};
tableConfig.forEach((t) => t.sides.forEach((s) => { if (!deptToTable[s.team]) deptToTable[s.team] = t.table; }));

function getSeatDepartment(seatId) {
  if (!seatId) return '';
  if (seatMeta[seatId]) return seatMeta[seatId].department;
  const s = state.seats.find((x) => x.id === seatId);
  return s ? (s.department || '') : '';
}

function getSeatTable(seatId) {
  if (!seatId) return 'No desk';
  if (seatMeta[seatId]) return seatMeta[seatId].table;
  const s = state.seats.find((x) => x.id === seatId);
  return s ? (s.table || 'No desk') : 'No desk';
}

// 'top' / 'bottom' for a seat (falls back to splitting a table's seats in half)
function getSeatSide(seat) {
  if (seatMeta[seat.id]) return seatMeta[seat.id].side;
  return 'top';
}
function getSeatSideIndex(seat) {
  if (seatMeta[seat.id]) return seatMeta[seat.id].sideIndex;
  const n = parseInt((seat.id || '').replace('Desk ', ''), 10);
  return isNaN(n) ? 0 : n;
}

function initSeats() {
  const seats = Object.keys(seatMeta).map((seatId) => ({
    id: seatId, label: seatId, floor: 'main-floor',
    status: 'free', occupant: null,
    department: seatMeta[seatId].department,
    table: seatMeta[seatId].table, color: null,
  }));
  mockEmployees.forEach((employee) => {
    const seat = seats.find((item) => item.id === employee.seat);
    if (seat) {
      seat.status = 'occupied';
      // occupant adopts the seat's (new) team so labels stay consistent
      seat.occupant = { name: employee.name, department: seat.department };
      if (employee.role) seat.occupant.role = employee.role;
    }
  });
  state.seats = seats;
  rebuildSeatMeta();
  state.employees = mockEmployees.map((emp) => ({
    wfh: false,
    ...emp,
    department: emp.seat ? getSeatDepartment(emp.seat) : emp.department,
    table: emp.seat ? getSeatTable(emp.seat) : 'No desk',
  }));
}

// Sort seats by their desk number so rows/lists are in a predictable order.
function sortSeats(seats) {
  const num = (s) => parseInt((s.id || '').replace('Desk ', ''), 10) || 0;
  return [...seats].sort((a, b) => num(a) - num(b));
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function loadFromServer() {
  if (!_supabase) { initSeats(); if (!state.meetingRooms.length) state.meetingRooms = defaultMeetingRooms.map(r => ({ ...r })); return false; }
  try {
    const dbTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out after 5 s')), 5000)
    );
    const [{ data: seats, error: seatsErr }, { data: emps, error: empsErr }, { data: rooms }] = await Promise.race([
      Promise.all([
        _supabase.from('seats').select('*'),
        _supabase.from('employees').select('*'),
        _supabase.from('meeting_rooms').select('*'),
      ]),
      dbTimeout,
    ]);
    if (seatsErr || empsErr) throw new Error(seatsErr?.message || empsErr?.message);
    if (!seats?.length || !emps?.length) throw new Error('DB tables empty — run supabase-schema.sql');
    state.seats = sortSeats(seats);
    rebuildSeatMeta();
    state.employees = emps.map((emp) => ({ wfh: emp.wfh || false, ...emp }));
    if (rooms?.length) state.meetingRooms = rooms;
    else if (!state.meetingRooms.length) state.meetingRooms = defaultMeetingRooms.map(r => ({ ...r }));
    return true;
  } catch (err) {
    console.warn('Supabase unavailable — using local fallback data:', err.message);
    initSeats();
    if (!state.meetingRooms.length) state.meetingRooms = defaultMeetingRooms.map(r => ({ ...r }));
    return false;
  }
}

async function saveSeat(seat) {
  if (!_supabase) return;
  const { error } = await _supabase.from('seats').update(seat).eq('id', seat.id);
  if (error) console.error('saveSeat failed:', error);
}

async function createSeat(seat) {
  if (!_supabase) return seat;
  const { data, error } = await _supabase.from('seats').insert(seat).select().single();
  if (error) { console.error('createSeat failed:', error); return seat; }
  return data;
}

async function addEmployee(employee) {
  if (!_supabase) return { ...employee, id: Date.now() };
  const { data, error } = await _supabase.from('employees').insert(employee).select().single();
  if (error) { console.error('addEmployee failed:', error); return employee; }
  return data;
}

async function updateEmployee(id, patch) {
  if (!_supabase) return;
  const { error } = await _supabase.from('employees').update(patch).eq('id', id);
  if (error) console.warn('updateEmployee failed:', error);
}

async function deleteEmployee(id) {
  if (!_supabase) return { ok: true };
  const { error } = await _supabase.from('employees').delete().eq('id', id);
  if (error) { console.error('deleteEmployee failed:', error); return { ok: false, error }; }
  return { ok: true };
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function initApp() {
  await loadFromServer();
  await checkExpiredVisitors();
  await checkExpiredRooms();
  renderFloorMap();
  renderMapDepartmentButtons();
  renderDirectoryDeptOptions();
  renderDirectoryTableFilterOptions();
  renderDirectory();
  renderAdminLoginState();
  renderAdminSeats();
  renderAdminEmployees();
  renderDirectorySeatOptions();
  renderRooms();
  startAutoRefresh();
  bindUIActions();
  setupVisualEffects();
}

// ── Parallax, scroll progress, reveal-on-scroll, topbar state ────────────────
function setupVisualEffects() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const orbs = Array.from(document.querySelectorAll('.parallax-bg .orb'));
  const progressBar = document.querySelector('.scroll-progress span');
  const topbar = document.querySelector('.topbar');

  // Scroll progress bar + parallax-on-scroll + sticky topbar shadow
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (topbar) topbar.classList.toggle('scrolled', scrollTop > 8);
      if (!reduce) {
        orbs.forEach((orb) => {
          const depth = parseFloat(orb.dataset.depth) || 0.1;
          orb.style.transform = `translateY(${scrollTop * depth}px)`;
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Parallax-on-mouse-move (desktop only, respects reduced motion)
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    let mouseRAF = false;
    window.addEventListener('mousemove', (e) => {
      if (mouseRAF) return;
      mouseRAF = true;
      requestAnimationFrame(() => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        const scrollTop = window.scrollY || 0;
        orbs.forEach((orb) => {
          const depth = parseFloat(orb.dataset.depth) || 0.1;
          const mx = cx * depth * 90;
          const my = cy * depth * 90;
          orb.style.transform = `translate(${mx}px, ${scrollTop * depth + my}px)`;
        });
        mouseRAF = false;
      });
    }, { passive: true });
  }

  // Reveal-on-scroll for major cards/sections
  const stagger = document.querySelector('.summary-row');
  if (stagger) stagger.classList.add('reveal-stagger');

  // Scoped to the map panel (visible by default). Other panels animate via
  // the .panel.active "panelIn" transition when switched to, so they don't
  // need (and shouldn't get) reveal — IntersectionObserver can't see
  // display:none content and would leave it stuck invisible.
  const revealTargets = document.querySelectorAll('#panel-map .map-controls, #panel-map .floor-map');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }
}

function bindUIActions() {
  document.getElementById('view-map').addEventListener('click', () => switchView('map'));
  document.getElementById('view-directory').addEventListener('click', () => switchView('directory'));
  document.getElementById('view-admin').addEventListener('click', () => switchView('admin'));
  document.getElementById('view-requirements').addEventListener('click', () => switchView('requirements'));
  document.getElementById('view-rooms').addEventListener('click', () => { switchView('rooms'); renderRooms(); });
  document.getElementById('directory-search').addEventListener('input', renderDirectory);
  document.getElementById('map-search').addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    renderFloorMap();
  });
  document.getElementById('zoom-in').addEventListener('click', () => handleZoom(1.2));
  document.getElementById('zoom-out').addEventListener('click', () => handleZoom(0.85));
  document.getElementById('zoom-reset').addEventListener('click', () => resetZoom());
  document.getElementById('layout-toggle').addEventListener('change', (event) => {
    state.showActualLayout = event.target.checked;
    renderFloorMap();
  });
  document.getElementById('toggle-table-view').addEventListener('click', () => {
    state.tableVisualMode = !state.tableVisualMode;
    const btn = document.getElementById('toggle-table-view');
    btn.textContent = state.tableVisualMode ? 'Card View' : 'Table View';
    btn.classList.toggle('active', state.tableVisualMode);
    renderFloorMap();
  });
  document.getElementById('map-department-filters').addEventListener('click', (event) => {
    if (!event.target.matches('.dept-btn')) return;
    document.querySelectorAll('.dept-btn').forEach((b) => b.classList.remove('active'));
    event.target.classList.add('active');
    state.departmentFilter = event.target.dataset.dept || '';
    renderFloorMap();
  });
  document.getElementById('directory-table-filter').addEventListener('change', renderDirectory);
  document.getElementById('directory-add-seat').addEventListener('change', updateDepartmentFromSeat);
  document.getElementById('directory-add-form').addEventListener('submit', handleDirectoryAdd);
  document.getElementById('admin-search').addEventListener('input', (e) => {
    state.adminSearchQuery = e.target.value;
    renderAdminSeats();
    renderAdminEmployees();
  });
  document.getElementById('admin-daily-reset-btn').addEventListener('click', dailyReset);
  document.getElementById('admin-login-btn').addEventListener('click', handleAdminLogin);
  document.getElementById('admin-logout-btn').addEventListener('click', handleAdminLogout);
  document.getElementById('employee-form').addEventListener('submit', handleEmployeeAdd);
  document.getElementById('employee-name').addEventListener('input', () => autofillDeptFromName('employee-name', 'employee-dept'));
  const seatForm = document.getElementById('seat-form');
  if (seatForm) seatForm.addEventListener('submit', handleSeatAdd);
  document.getElementById('floor-map').addEventListener('click', handleChairClick);

  // Admin seat view toggle: Visual layout ⇄ List
  const seatVisualBtn = document.getElementById('admin-seat-view-visual');
  const seatListBtn = document.getElementById('admin-seat-view-list');
  if (seatVisualBtn && seatListBtn) {
    seatVisualBtn.addEventListener('click', () => setAdminSeatView('visual'));
    seatListBtn.addEventListener('click', () => setAdminSeatView('list'));
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.seat-node') && !event.target.closest('.cabin-box') && !event.target.closest('.map-seat-popup')) {
      document.querySelectorAll('.map-seat-popup').forEach((p) => p.remove());
    }
    if (!event.target.closest('.floor-map')) {
      document.querySelectorAll('.chair-popup').forEach((p) => p.remove());
    }
    if (!event.target.closest('.admin-seat-popover') && !event.target.closest('.admin-chair')) {
      closeAdminSeatPopover();
    }
  });
}

function setAdminSeatView(view) {
  const visual = document.getElementById('admin-seat-visual');
  const list = document.getElementById('admin-seat-list');
  const vBtn = document.getElementById('admin-seat-view-visual');
  const lBtn = document.getElementById('admin-seat-view-list');
  if (!visual || !list) return;
  closeAdminSeatPopover();
  const showVisual = view === 'visual';
  visual.classList.toggle('hidden', !showVisual);
  list.classList.toggle('hidden', showVisual);
  vBtn?.classList.toggle('active', showVisual);
  lBtn?.classList.toggle('active', !showVisual);
}

function renderMapDepartmentButtons() {
  const container = document.getElementById('map-department-filters');
  if (!container) return;
  const activeDepts = new Set(state.employees.map(e => e.department));
  const filteredGroups = directoryGroups.filter(d => activeDepts.has(d));
  container.innerHTML = [
    '<button class="dept-btn active" data-dept="">All</button>',
    ...filteredGroups.map((d) => `<button class="dept-btn" data-dept="${d}">${d}</button>`),
  ].join('');
}

function switchView(view) {
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  const map = { map: ['view-map', 'panel-map'], directory: ['view-directory', 'panel-directory'], requirements: ['view-requirements', 'panel-requirements'], rooms: ['view-rooms', 'panel-rooms'], admin: ['view-admin', 'panel-admin'] };
  if (map[view]) {
    document.getElementById(map[view][0]).classList.add('active');
    document.getElementById(map[view][1]).classList.add('active');
  }
}

// ── Floor map rendering ───────────────────────────────────────────────────────
// 3 tables per band, 2 bands. Each table: 5 seats top row, 5 seats bottom row.
const TABLE_LAYOUT = {
  'Table 1': { cx: 250,  topY: 240, bottomY: 340 },
  'Table 2': { cx: 650,  topY: 240, bottomY: 340 },
  'Table 3': { cx: 1050, topY: 240, bottomY: 340 },
  'Table 4': { cx: 250,  topY: 560, bottomY: 660 },
  'Table 5': { cx: 650,  topY: 560, bottomY: 660 },
  'Table 6': { cx: 1050, topY: 560, bottomY: 660 },
  'Table 7': { cx: 650,  topY: 740, bottomY: 800 },
};
const SEAT_GAP = 54;

function getSeatCoordinates(seatId) {
  const m = seatMeta[seatId];
  if (!m) return null;
  const L = TABLE_LAYOUT[m.table];
  if (!L) return null;
  const span = 4 * SEAT_GAP; // 5 seats → centre the row on the table
  const x = L.cx - span / 2 + m.sideIndex * SEAT_GAP;
  const y = m.side === 'top' ? L.topY : L.bottomY;
  return { x, y, dir: m.side };
}

function shadeColor(color, percent) {
  if (!color) return '#cccccc';
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function updateViewportTransform() {
  const viewport = document.getElementById('svg-viewport');
  if (viewport) {
    viewport.setAttribute('transform', `translate(${state.panX}, ${state.panY}) scale(${state.zoom})`);
  }
}

function handleZoom(factor) {
  state.zoom = Math.max(0.5, Math.min(3, state.zoom * factor));
  updateViewportTransform();
}

function resetZoom() {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  updateViewportTransform();
}

window.handleZoom = handleZoom;
window.resetZoom = resetZoom;

function renderFloorMap() {
  if (state.tableVisualMode) { renderTableVisual(); return; }
  const mapContainer = document.getElementById('floor-map');
  mapContainer.innerHTML = '';
  mapContainer.className = 'floor-map svg-mode';
  mapContainer.style.overflow = 'hidden';
  mapContainer.style.position = 'relative';

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('viewBox', '0 0 1300 850');
  svg.style.cursor = state.isDraggingMap ? 'grabbing' : 'grab';
  svg.style.userSelect = 'none';

  // Definitions for patterns, gradients, and filters
  svg.innerHTML = `
    <defs>
      <!-- Premium Wood Plank Texture for Tables -->
      <linearGradient id="woodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8B5A2B" />
        <stop offset="50%" stop-color="#CD853F" />
        <stop offset="100%" stop-color="#8B5A2B" />
      </linearGradient>
      <!-- Cabin Glass Walls Gradient -->
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(224, 242, 254, 0.4)" />
        <stop offset="100%" stop-color="rgba(186, 230, 253, 0.1)" />
      </linearGradient>
      <!-- Drop Shadows -->
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.15" />
      </filter>
      <filter id="seatShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.2" />
      </filter>
    </defs>
  `;

  // Create Viewport Group (which handles pan/zoom)
  const viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  viewport.id = 'svg-viewport';
  viewport.setAttribute('transform', `translate(${state.panX}, ${state.panY}) scale(${state.zoom})`);
  svg.appendChild(viewport);

  // 1. Draw Background & Spacing Tiles (5 rows, 6 columns)
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'room-grid');
  
  // Draw Walkways (Row 3 Y=370 to 530, and Row 5 Y=690 to 850)
  const walkwayRow3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  walkwayRow3.setAttribute('x', '50');
  walkwayRow3.setAttribute('y', '370');
  walkwayRow3.setAttribute('width', '1200');
  walkwayRow3.setAttribute('height', '160');
  walkwayRow3.setAttribute('fill', '#f8fafc');
  walkwayRow3.setAttribute('opacity', '0.7');
  gridGroup.appendChild(walkwayRow3);

  const walkwayRow5 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  walkwayRow5.setAttribute('x', '50');
  walkwayRow5.setAttribute('y', '690');
  walkwayRow5.setAttribute('width', '1200');
  walkwayRow5.setAttribute('height', '160');
  walkwayRow5.setAttribute('fill', '#f8fafc');
  walkwayRow5.setAttribute('opacity', '0.7');
  gridGroup.appendChild(walkwayRow5);
  
  // Draw Tile Borders if state.showActualLayout is true
  if (state.showActualLayout) {
    for (let r = 0; r <= 5; r++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '50');
      line.setAttribute('y1', (50 + r * 160).toString());
      line.setAttribute('x2', '1250');
      line.setAttribute('y2', (50 + r * 160).toString());
      line.setAttribute('stroke', '#cbd5e1');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,4');
      gridGroup.appendChild(line);
    }
    for (let c = 0; c <= 6; c++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (50 + c * 200).toString());
      line.setAttribute('y1', '50');
      line.setAttribute('x2', (50 + c * 200).toString());
      line.setAttribute('y2', '850');
      line.setAttribute('stroke', '#cbd5e1');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,4');
      gridGroup.appendChild(line);
    }
  }
  viewport.appendChild(gridGroup);

  // Draw Outer Office Wall
  const outerWall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  outerWall.setAttribute('x', '50');
  outerWall.setAttribute('y', '50');
  outerWall.setAttribute('width', '1200');
  outerWall.setAttribute('height', '800');
  outerWall.setAttribute('fill', 'none');
  outerWall.setAttribute('stroke', '#475569');
  outerWall.setAttribute('stroke-width', '4');
  outerWall.setAttribute('rx', '8');
  viewport.appendChild(outerWall);

  // 2. Draw 6 Main Tables
  const tablesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  tablesGroup.setAttribute('class', 'tables-group');
  
  const tablesConfig = tableConfig.filter((t) => TABLE_LAYOUT[t.table]).map((t) => {
    const L = TABLE_LAYOUT[t.table];
    const teams = [...new Set(t.sides.map((s) => s.team))];
    return {
      id: t.table,
      dept: teams.join(' / '),
      xCenter: L.cx,
      yCenter: (L.topY + L.bottomY) / 2,
      width: 270,
    };
  });

  tablesConfig.forEach((table) => {
    const tableRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tableRect.setAttribute('x', (table.xCenter - table.width / 2).toString());
    tableRect.setAttribute('y', (table.yCenter - 15).toString());
    tableRect.setAttribute('width', table.width.toString());
    tableRect.setAttribute('height', '30');
    tableRect.setAttribute('fill', 'url(#woodGradient)');
    tableRect.setAttribute('stroke', '#5c3a21');
    tableRect.setAttribute('stroke-width', '1.5');
    tableRect.setAttribute('rx', '4');
    tableRect.setAttribute('filter', 'url(#shadow)');
    tablesGroup.appendChild(tableRect);

    const tableText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tableText.setAttribute('x', table.xCenter.toString());
    tableText.setAttribute('y', (table.yCenter + 4).toString());
    tableText.setAttribute('text-anchor', 'middle');
    tableText.setAttribute('fill', '#ffffff');
    tableText.setAttribute('font-size', '10');
    tableText.setAttribute('font-weight', 'bold');
    tableText.setAttribute('filter', 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))');
    tableText.textContent = `${table.id} (${table.dept})`;
    tablesGroup.appendChild(tableText);
  });
  viewport.appendChild(tablesGroup);

  // 4. Draw Desks & Chairs
  const desksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  desksGroup.setAttribute('class', 'desks-group');

  state.seats.forEach((seat) => {
    if (seat.id.startsWith('Cabin')) return;

    const coords = getSeatCoordinates(seat.id);
    if (!coords) return;
    const { x, y, dir } = coords;

    const filteredOut = state.departmentFilter && seat.department !== state.departmentFilter;
    const matchesSearch = state.searchQuery && seat.occupant && seat.occupant.name.toLowerCase().includes(state.searchQuery.toLowerCase());

    let seatColor = '#22c55e'; // free
    let strokeColor = '#16a34a';
    if (seat.status === 'occupied') {
      seatColor = seat.color || '#ef4444'; // occupied
      strokeColor = seat.color ? shadeColor(seat.color, -20) : '#dc2626';
    } else if (seat.status === 'reserved') {
      seatColor = '#eab308'; // reserved
      strokeColor = '#ca8a04';
    }

    if (filteredOut) {
      seatColor = '#e2e8f0';
      strokeColor = '#cbd5e1';
    }

    const seatNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    seatNode.setAttribute('class', `seat-node ${seat.status}${filteredOut ? ' filtered-out' : ''}${matchesSearch ? ' search-match' : ''}`);
    seatNode.setAttribute('data-seat-id', seat.id);
    seatNode.setAttribute('filter', 'url(#seatShadow)');
    seatNode.style.cursor = seat.status === 'occupied' ? 'grab' : 'pointer';

    seatNode.addEventListener('click', (e) => {
      e.stopPropagation();
      handleSeatClick(seat.id);
    });

    if (seat.status === 'occupied') {
      seatNode.setAttribute('draggable', 'true');
      seatNode.addEventListener('dragstart', (e) => handleSeatDragStart(e, seat.id));
    }

    seatNode.addEventListener('dragover', (e) => handleSeatDragOver(e, seat.id));
    seatNode.addEventListener('dragleave', (e) => handleSeatDragLeave(e, seat.id));
    seatNode.addEventListener('drop', (e) => handleSeatDrop(e, seat.id));

    // Desk Rect
    const deskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    deskRect.setAttribute('width', '40');
    deskRect.setAttribute('height', '20');
    deskRect.setAttribute('rx', '3');
    deskRect.setAttribute('fill', filteredOut ? '#f1f5f9' : '#ffffff');
    deskRect.setAttribute('stroke', filteredOut ? '#cbd5e1' : '#94a3b8');
    deskRect.setAttribute('stroke-width', '1.5');
    
    if (dir === 'top') {
      deskRect.setAttribute('x', (x - 20).toString());
      deskRect.setAttribute('y', (y + 15).toString());
    } else {
      deskRect.setAttribute('x', (x - 20).toString());
      deskRect.setAttribute('y', (y - 35).toString());
    }
    seatNode.appendChild(deskRect);

    // Chair Backrest
    const chairBack = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (dir === 'top') {
      chairBack.setAttribute('d', `M ${x - 13} ${y - 7} A 13 13 0 0 1 ${x + 13} ${y - 7}`);
    } else {
      chairBack.setAttribute('d', `M ${x - 13} ${y + 7} A 13 13 0 0 0 ${x + 13} ${y + 7}`);
    }
    chairBack.setAttribute('fill', 'none');
    chairBack.setAttribute('stroke', strokeColor);
    chairBack.setAttribute('stroke-width', '4');
    chairBack.setAttribute('stroke-linecap', 'round');
    seatNode.appendChild(chairBack);

    // Chair Seat Circle
    const chairCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    chairCircle.setAttribute('cx', x.toString());
    chairCircle.setAttribute('cy', y.toString());
    chairCircle.setAttribute('r', '11');
    chairCircle.setAttribute('fill', seatColor);
    chairCircle.setAttribute('stroke', strokeColor);
    chairCircle.setAttribute('stroke-width', '1');
    seatNode.appendChild(chairCircle);

    // Initial / Seat ID Label
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', x.toString());
    labelText.setAttribute('y', (y + 3.5).toString());
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('fill', seat.status === 'occupied' && !filteredOut ? '#ffffff' : '#475569');
    labelText.setAttribute('font-size', '8');
    labelText.setAttribute('font-weight', 'bold');
    
    if (seat.status === 'occupied' && seat.occupant) {
      labelText.textContent = seat.occupant.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    } else {
      labelText.textContent = seat.label.replace('Desk ', '');
    }
    seatNode.appendChild(labelText);

    desksGroup.appendChild(seatNode);
  });
  viewport.appendChild(desksGroup);

  mapContainer.appendChild(svg);

  // Dragging event listeners on SVG container to Pan the map
  svg.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.seat-node') || e.target.closest('.cabin-box')) return;
    
    state.isDraggingMap = true;
    svg.style.cursor = 'grabbing';
    state.dragStart = { x: e.clientX - state.panX, y: e.clientY - state.panY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isDraggingMap) return;
    state.panX = e.clientX - state.dragStart.x;
    state.panY = e.clientY - state.dragStart.y;
    updateViewportTransform();
  });

  window.addEventListener('mouseup', () => {
    if (state.isDraggingMap) {
      state.isDraggingMap = false;
      svg.style.cursor = 'grab';
    }
  });

  renderSummary();
}

// ── Interactive SVG Map Tooltips and Click Handlers ─────────────────────────
function handleSeatClick(seatId) {
  // Remove existing popups
  document.querySelectorAll('.map-seat-popup').forEach((p) => p.remove());

  const seat = state.seats.find(s => s.id === seatId);
  if (!seat) return;

  const coords = getSeatCoordinates(seatId);
  if (!coords) return;
  const { x, y } = coords;

  const popupGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  popupGroup.setAttribute('class', 'map-seat-popup');

  const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  const width = 240;
  const height = (seat.status === 'free' && state.adminLoggedIn) ? 260 : 180;
  foreign.setAttribute('x', (x - width / 2).toString());
  foreign.setAttribute('y', (y - height - 15).toString());
  foreign.setAttribute('width', width.toString());
  foreign.setAttribute('height', height.toString());

  let contentHtml = '';
  if (seat.status === 'occupied' && seat.occupant) {
    const isVisitor = seat.occupant?.type === 'visitor';
    const emp = isVisitor ? null : state.employees.find(e => e.name === seat.occupant.name);
    const timeStr = emp ? `Checked-in: ${emp.checkIn}` : (isVisitor && seat.occupant.expiresAt ? `Until: ${new Date(seat.occupant.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '');
    const wfhButton = (state.adminLoggedIn && emp)
      ? `<button class="btn secondary" onclick="toggleWfh(${emp.id})">Make WFH</button>`
      : '';
    const releaseButton = state.adminLoggedIn
      ? `<button class="btn danger" onclick="toggleSeatStatus('${seat.id}')">Release</button>`
      : '';
    contentHtml = `
      <div class="popup-card">
        <h4>${seat.occupant.name}</h4>
        <span class="popup-role">${seat.occupant.department}</span>
        <div class="popup-time">${timeStr}</div>
        <div class="popup-actions">
          ${releaseButton}
          ${wfhButton}
        </div>
      </div>`;
  } else if (seat.status === 'reserved') {
    const releaseButton = state.adminLoggedIn
      ? `<button class="btn secondary" onclick="toggleSeatStatus('${seat.id}')">Release</button>`
      : '';
    contentHtml = `
      <div class="popup-card">
        <h4>Reserved Seat</h4>
        <div class="popup-dept">Zone: ${seat.department}</div>
        <div class="popup-actions">
          ${releaseButton}
        </div>
      </div>`;
  } else {
    let actions = '';
    if (state.adminLoggedIn) {
      const unassigned = state.employees.filter(e => !e.seat && !e.wfh);
      const options = unassigned.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
      actions = `
        <div style="margin-bottom: 6px;">
          <select id="popup-assign-select" style="width: 100%; padding: 4px; font-size: 0.75rem; margin-bottom: 6px; background: #334155; color: white; border: 1px solid #475569; border-radius: 4px;">
            <option value="">-- Assign Employee --</option>
            ${options}
          </select>
          <button class="btn primary small" onclick="assignSeatFromPopup('${seat.id}')" style="width: 100%;">Assign</button>
        </div>
        <button class="btn secondary small" onclick="reserveSeatFromPopup('${seat.id}')" style="width: 100%; margin-bottom: 6px;">Reserve</button>
        <div style="display:flex;gap:4px;align-items:center;">
          <input id="popup-visitor-name" placeholder="Visitor name" style="flex:1;min-width:0;padding:4px 6px;font-size:0.72rem;background:#334155;color:white;border:1px solid #475569;border-radius:4px;" />
          <select id="popup-visitor-dur" style="padding:4px;font-size:0.72rem;background:#334155;color:white;border:1px solid #475569;border-radius:4px;">
            <option value="60">1h</option><option value="120">2h</option><option value="240">4h</option>
          </select>
          <button class="btn small" style="background:#d97706;color:white;padding:4px 7px;font-size:0.72rem;border-radius:4px;border:none;cursor:pointer;" onclick="bookVisitorSeat('${seat.id}')">Guest</button>
        </div>
      `;
    } else {
      actions = `<div style="font-size: 0.8rem; color: #10b981; font-weight: bold;">Available for check-in</div>`;
    }
    contentHtml = `
      <div class="popup-card">
        <h4>${seat.label}</h4>
        <div class="popup-dept" style="margin-bottom: 8px;">Zone: ${seat.department}</div>
        ${actions}
      </div>`;
  }

  foreign.innerHTML = contentHtml;
  popupGroup.appendChild(foreign);
  document.getElementById('svg-viewport').appendChild(popupGroup);
}
window.handleSeatClick = handleSeatClick;

async function assignSeatFromPopup(seatId) {
  const select = document.getElementById('popup-assign-select');
  if (!select || !select.value) return;
  const empId = Number(select.value);
  const emp = state.employees.find(e => e.id === empId);
  const seat = state.seats.find(s => s.id === seatId);
  if (emp && seat && seat.status === 'free') {
    seat.status = 'occupied';
    seat.occupant = { name: emp.name, department: emp.department };
    emp.seat = seatId;
    emp.table = seat.table;
    emp.wfh = false;

    await updateEmployee(emp.id, { seat: emp.seat, table: emp.table, wfh: emp.wfh });
    await saveSeat(seat);

    renderFloorMap();
    renderDirectory();
    if (state.adminLoggedIn) {
      renderAdminSeats();
      renderAdminEmployees();
    }
  }
}
window.assignSeatFromPopup = assignSeatFromPopup;

async function reserveSeatFromPopup(seatId) {
  const seat = state.seats.find(s => s.id === seatId);
  if (seat && seat.status === 'free') {
    seat.status = 'reserved';
    await saveSeat(seat);
    renderFloorMap();
    renderDirectory();
    if (state.adminLoggedIn) {
      renderAdminSeats();
      renderAdminEmployees();
    }
  }
}
window.reserveSeatFromPopup = reserveSeatFromPopup;

async function toggleWfh(employeeId) {
  const emp = state.employees.find(e => e.id === employeeId);
  if (!emp) return;
  emp.wfh = !emp.wfh;
  
  if (emp.wfh) {
    if (emp.seat) {
      const seat = state.seats.find(s => s.id === emp.seat);
      if (seat) {
        seat.status = 'free';
        seat.occupant = null;
        await saveSeat(seat);
      }
      emp.seat = null;
      emp.table = 'No desk';
    }
  }

  await updateEmployee(emp.id, { wfh: emp.wfh, seat: emp.seat, table: emp.table });

  // Remove popups
  document.querySelectorAll('.map-seat-popup').forEach((p) => p.remove());

  renderFloorMap();
  renderDirectory();
  if (state.adminLoggedIn) {
    renderAdminSeats();
    renderAdminEmployees();
  }
}
window.toggleWfh = toggleWfh;

// ── Drag and Drop Event Handlers ─────────────────────────────────────────────
function handleEmployeeDragStart(event, employeeId) {
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'employee', id: employeeId }));
}
window.handleEmployeeDragStart = handleEmployeeDragStart;

function handleSeatDragStart(event, seatId) {
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'seat', id: seatId }));
}
window.handleSeatDragStart = handleSeatDragStart;

function handleSeatDragOver(event, seatId) {
  const seat = state.seats.find(s => s.id === seatId);
  if (seat && (seat.status === 'free' || seat.status === 'occupied')) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  }
}
window.handleSeatDragOver = handleSeatDragOver;

function handleSeatDragLeave(event, seatId) {
  event.currentTarget.classList.remove('drag-over');
}
window.handleSeatDragLeave = handleSeatDragLeave;

async function handleSeatDrop(event, targetSeatId) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const targetSeat = state.seats.find(s => s.id === targetSeatId);
    if (!targetSeat) return;

    if (data.type === 'employee') {
      if (targetSeat.status !== 'free') return;
      const emp = state.employees.find(e => e.id === data.id);
      if (emp) {
        if (emp.seat) {
          const oldSeat = state.seats.find(s => s.id === emp.seat);
          if (oldSeat) { oldSeat.status = 'free'; oldSeat.occupant = null; await saveSeat(oldSeat); }
        }
        emp.seat = targetSeatId;
        emp.table = targetSeat.table;
        emp.wfh = false;
        targetSeat.status = 'occupied';
        targetSeat.occupant = { name: emp.name, department: emp.department };
        await updateEmployee(emp.id, { seat: emp.seat, table: emp.table, wfh: emp.wfh });
        await saveSeat(targetSeat);
      }
    } else if (data.type === 'seat') {
      const sourceSeatId = data.id;
      if (sourceSeatId === targetSeatId) return;
      const sourceSeat = state.seats.find(s => s.id === sourceSeatId);
      if (!sourceSeat || sourceSeat.status !== 'occupied') return;

      if (targetSeat.status === 'free') {
        // Move to empty seat
        const emp = state.employees.find(e => e.seat === sourceSeatId);
        targetSeat.status = 'occupied';
        targetSeat.occupant = { ...sourceSeat.occupant };
        sourceSeat.status = 'free';
        sourceSeat.occupant = null;
        if (emp) { emp.seat = targetSeatId; emp.table = targetSeat.table; await updateEmployee(emp.id, { seat: emp.seat, table: emp.table }); }
        await saveSeat(sourceSeat);
        await saveSeat(targetSeat);
      } else if (targetSeat.status === 'occupied') {
        // Swap two occupied seats
        const sourceEmp = state.employees.find(e => e.seat === sourceSeatId);
        const targetEmp = state.employees.find(e => e.seat === targetSeatId);
        const sourceSeatTable = sourceSeat.table;
        const targetSeatTable = targetSeat.table;
        const tempOccupant = { ...targetSeat.occupant };
        targetSeat.occupant = { ...sourceSeat.occupant };
        sourceSeat.occupant = tempOccupant;
        if (sourceEmp) { sourceEmp.seat = targetSeatId; sourceEmp.table = targetSeatTable; }
        if (targetEmp) { targetEmp.seat = sourceSeatId; targetEmp.table = sourceSeatTable; }
        await Promise.all([
          saveSeat(sourceSeat),
          saveSeat(targetSeat),
          sourceEmp ? updateEmployee(sourceEmp.id, { seat: targetSeatId, table: targetSeatTable }) : Promise.resolve(),
          targetEmp ? updateEmployee(targetEmp.id, { seat: sourceSeatId, table: sourceSeatTable }) : Promise.resolve(),
        ]);
      }
    }
    renderFloorMap();
    renderDirectory();
    if (state.adminLoggedIn) {
      renderAdminSeats();
      renderAdminEmployees();
    }
  } catch (err) {
    console.error('Drop handling error:', err);
  }
}
window.handleSeatDrop = handleSeatDrop;

function renderTableVisual() {
  const mapContainer = document.getElementById('floor-map');
  mapContainer.innerHTML = '';
  mapContainer.className = 'floor-map table-visual-mode';

  seatTableGroups.forEach((tableName) => {
    const seats = state.seats.filter((seat) => seat.table === tableName);
    if (!seats.length) return;
    const { topSeats, bottomSeats, topTeam, bottomTeam } = splitTableSides(seats);
    const depts = [...new Set(seats.map((s) => s.department))];
    const card = document.createElement('div');
    card.className = 'table-visual-card';
    const sameTeam = topTeam === bottomTeam;
    card.innerHTML = `
      <div class="table-visual-header">
        <span class="table-visual-name">${tableName}</span>
        <span class="table-visual-dept">${depts.join(' · ')}</span>
      </div>
      ${topTeam ? `<div class="row-team-label">${topTeam}</div>` : ''}
      <div class="chairs-row chairs-top">${topSeats.map((s) => buildChairEl(s, 'top')).join('')}</div>
      <div class="table-plank"><span class="table-plank-text">${tableName}</span></div>
      <div class="chairs-row chairs-bottom">${bottomSeats.map((s) => buildChairEl(s, 'bottom')).join('')}</div>
      ${bottomTeam && !sameTeam ? `<div class="row-team-label">${bottomTeam}</div>` : ''}`;
    mapContainer.appendChild(card);
  });
  renderSummary();
}

// Split a table's seats into top/bottom rows (by seatMeta) with each row's team.
function splitTableSides(seats) {
  const byIdx = (a, b) => getSeatSideIndex(a) - getSeatSideIndex(b);
  const topSeats = seats.filter((s) => getSeatSide(s) === 'top').sort(byIdx);
  let bottomSeats = seats.filter((s) => getSeatSide(s) === 'bottom').sort(byIdx);
  // Fallback for any seats without metadata: split the list in half.
  if (!topSeats.length && !bottomSeats.length && seats.length) {
    const half = Math.ceil(seats.length / 2);
    return { topSeats: seats.slice(0, half), bottomSeats: seats.slice(half),
             topTeam: seats[0]?.department || '', bottomTeam: seats[half]?.department || '' };
  }
  return {
    topSeats, bottomSeats,
    topTeam: topSeats[0]?.department || seatMeta[topSeats[0]?.id]?.department || '',
    bottomTeam: bottomSeats[0]?.department || seatMeta[bottomSeats[0]?.id]?.department || '',
  };
}

function buildChairEl(seat, position) {
  const filteredOut = state.departmentFilter && seat.department !== state.departmentFilter;
  const initials = seat.status === 'occupied' && seat.occupant
    ? seat.occupant.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : seat.label.replace('Desk ', '');
  return `<div class="chair-seat ${seat.status}${filteredOut ? ' filtered-out' : ''} pos-${position}" data-seat-id="${seat.id}" title="${seat.label}"><span class="chair-inner">${initials}</span></div>`;
}

function handleChairClick(event) {
  if (!state.tableVisualMode) return;
  const chair = event.target.closest('.chair-seat');
  if (!chair) { document.querySelectorAll('.chair-popup').forEach((p) => p.remove()); return; }
  const seat = state.seats.find((s) => s.id === chair.dataset.seatId);
  if (!seat) return;
  const hadPopup = !!chair.querySelector('.chair-popup');
  document.querySelectorAll('.chair-popup').forEach((p) => p.remove());
  if (hadPopup) return;
  const popup = document.createElement('div');
  popup.className = 'chair-popup';
  if (seat.status === 'occupied' && seat.occupant) {
    popup.innerHTML = `<strong>${seat.occupant.name}</strong><br>${seat.occupant.department}<br><em>${seat.label}</em>`;
  } else if (seat.status === 'reserved') {
    popup.innerHTML = `<strong>Reserved</strong><br>${seat.department}<br><em>${seat.label}</em>`;
  } else {
    popup.innerHTML = `<strong>${seat.label}</strong><br>Free desk<br><em>${seat.department}</em>`;
  }
  chair.appendChild(popup);
}

// ── Directory ─────────────────────────────────────────────────────────────────
function renderDirectory() {
  const search = document.getElementById('directory-search')?.value.toLowerCase().trim() || '';
  const tableFilter = document.getElementById('directory-table-filter')?.value || '';
  const filtered = state.employees.filter((emp) => {
    const match = [emp.name, emp.department].join(' ').toLowerCase();
    return match.includes(search) && (!tableFilter || emp.table === tableFilter);
  });
  // Show the configured teams that have people, plus any other departments
  // present in the data (e.g. legacy WFH staff) so nobody disappears.
  const present = directoryGroups.filter((d) => filtered.some((e) => e.department === d));
  const extra = [...new Set(filtered.map((e) => e.department))]
    .filter((d) => d && !directoryGroups.includes(d));
  const groupList = [...present, ...extra];
  const groups = groupList.map((dept) => {
    const rows = filtered.filter((e) => e.department === dept).map((e) => {
      const wfhBadge = e.wfh ? '<span class="wfh-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 2px 6px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; margin-left: 6px;">WFH</span>' : '';
      const seatText = e.wfh ? 'WFH (Remote)' : (e.seat || 'No desk');
      const tableText = e.wfh ? 'WFH (Remote)' : e.table;
      return `
        <tr draggable="true" ondragstart="handleEmployeeDragStart(event, ${e.id})" style="cursor: grab;">
          <td>${e.name}${wfhBadge}</td><td>${e.department}</td><td>${tableText}</td>
          <td>${seatText}</td><td>${e.checkIn}</td>
        </tr>`;
    }).join('');
    return `
      <div class="directory-group-card">
        <h3>${dept}</h3>
        <div class="directory-table-wrapper">
          <table class="directory-table">
            <thead><tr><th>Name</th><th>Department</th><th>Table</th><th>Seat</th><th>Check-in Time</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="5">No employees assigned</td></tr>'}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');
  document.getElementById('directory-groups').innerHTML = groups;
  document.getElementById('directory-count').textContent = filtered.length;
  renderDirectorySeatOptions();
}

function renderDirectoryTableFilterOptions() {
  document.getElementById('directory-table-filter').innerHTML =
    `<option value="">All tables</option>${seatTableGroups.map((t) => `<option value="${t}">${t}</option>`).join('')}`;
}

function renderSummary() {
  const total = state.seats.length;
  const occupied = state.seats.filter((s) => s.status === 'occupied').length;
  const free = state.seats.filter((s) => s.status === 'free').length;
  const totalStaff = state.employees.length;
  const wfhStaff = state.employees.filter((e) => e.wfh).length;
  const inOfficeStaff = totalStaff - wfhStaff;
  const occupancy = total ? Math.round((occupied / total) * 100) : 0;
  
  animateCount(document.getElementById('total-seats'), total);
  animateCount(document.getElementById('total-staff-count'), totalStaff);
  animateCount(document.getElementById('office-staff-count'), inOfficeStaff);
  animateCount(document.getElementById('wfh-staff-count'), wfhStaff);
  animateCount(document.getElementById('occupied-count'), occupied);
  animateCount(document.getElementById('free-count'), free);
  animateCount(document.getElementById('occupancy-rate'), occupancy, '%');
}

// Smoothly counts a number up/down to its new target.
function animateCount(el, target, suffix = '') {
  if (!el) return;
  const from = parseInt(el.textContent, 10) || 0;
  if (from === target) { el.textContent = `${target}${suffix}`; return; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const duration = 650;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = `${Math.round(from + (target - from) * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
    else {
      el.textContent = `${target}${suffix}`;
      el.classList.remove('count-pop');
      void el.offsetWidth;
      el.classList.add('count-pop');
    }
  }
  requestAnimationFrame(step);
}

function renderDirectoryDeptOptions() {
  document.getElementById('directory-add-dept').innerHTML =
    departmentOptions.map((d) => `<option value="${d}">${d}</option>`).join('');
}

function renderDirectorySeatOptions() {
  const seatSelect = document.getElementById('directory-add-seat');
  const freeSeats = state.seats.filter((s) => s.status === 'free');
  seatSelect.innerHTML = freeSeats.length
    ? freeSeats.map((s) => `<option value="${s.id}" data-dept="${getSeatDepartment(s.id)}">${s.label} — ${getSeatDepartment(s.id)}</option>`).join('')
    : '<option value="" disabled>No free desks available</option>';
  updateDepartmentFromSeat();
}

function updateDepartmentFromSeat() {
  const seatSelect = document.getElementById('directory-add-seat');
  const deptSelect = document.getElementById('directory-add-dept');
  const suggested = getSeatDepartment(seatSelect.value);
  if (suggested && departmentOptions.includes(suggested)) deptSelect.value = suggested;
}

// ── Write actions (all async — save to API) ───────────────────────────────────
async function handleDirectoryAdd(event) {
  event.preventDefault();
  const nameInput = document.getElementById('directory-add-name');
  const deptInput = document.getElementById('directory-add-dept');
  const seatSelect = document.getElementById('directory-add-seat');
  const name = nameInput.value.trim();
  const department = deptInput.value.trim();
  const seatId = seatSelect.value;
  const seatRecord = state.seats.find((item) => item.id === seatId);
  if (!name || !department || !seatRecord || seatRecord.status !== 'free') {
    alert('Please choose a valid free desk and enter name plus department.');
    return;
  }
  seatRecord.status = 'occupied';
  seatRecord.occupant = { name, department };
  const saved = await addEmployee({ name, department, seat: seatId, table: seatRecord.table, checkIn: getCurrentTime() });
  state.employees.push({ ...saved });
  await saveSeat(seatRecord);
  nameInput.value = '';
  deptInput.value = departmentOptions[0];
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
}

async function toggleSeatStatus(seatId) {
  const seat = state.seats.find((item) => item.id === seatId);
  if (!seat) return;
  if (seat.status === 'occupied') {
    const emp = state.employees.find((e) => e.seat === seatId);
    seat.status = 'free';
    seat.occupant = null;
    if (emp) {
      emp.seat = null;
      emp.table = 'No desk';
      emp.wfh = true;
      await updateEmployee(emp.id, { seat: null, table: 'No desk', wfh: true });
    }
  } else {
    seat.status = 'occupied';
    seat.occupant = { name: 'Guest User', department: 'CS' };
    const saved = await addEmployee({ name: 'Guest User', department: 'CS', seat: seatId, table: seat.table, checkIn: getCurrentTime(), wfh: false });
    state.employees.push({ ...saved });
  }
  await saveSeat(seat);
  
  // Remove popups
  document.querySelectorAll('.map-seat-popup').forEach((p) => p.remove());
  
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
}

async function handleEmployeeAdd(event) {
  event.preventDefault();
  const nameInput = document.getElementById('employee-name');
  const deptInput = document.getElementById('employee-dept');
  const seatSelect = document.getElementById('employee-seat');
  const name = nameInput.value.trim();
  const department = deptInput.value;
  const seatId = seatSelect.value; // Empty string if WFH
  
  if (!name || !department) {
    alert('Please enter name and department.');
    return;
  }
  
  let seatRecord = null;
  if (seatId) {
    seatRecord = state.seats.find((item) => item.id === seatId);
    if (!seatRecord) {
      alert('Selected desk not found.');
      return;
    }
    if (seatRecord.status !== 'free') {
      alert('That desk is no longer available. Please select another.');
      return;
    }
  }

  // Create new employee object
  const newEmp = {
    name,
    department,
    seat: seatId ? seatId : null,
    table: seatRecord ? seatRecord.table : 'No desk',
    checkIn: getCurrentTime(),
    wfh: seatId ? false : true
  };

  if (seatRecord) {
    seatRecord.status = 'occupied';
    seatRecord.occupant = { name, department };
    await saveSeat(seatRecord);
  }

  const saved = await addEmployee(newEmp);
  state.employees.push({ ...saved });
  
  // Clear input
  nameInput.value = '';
  
  // Reset tab selection to Employee List
  const navEmployeesBtn = document.getElementById('admin-nav-employees');
  if (navEmployeesBtn) {
    navEmployeesBtn.click();
  }
  
  renderFloorMap(); 
  renderDirectory(); 
  renderAdminSeats(); 
  renderAdminEmployees();
}

async function removeEmployee(employeeId) {
  const employee = state.employees.find((item) => item.id === employeeId);
  if (!employee) return;
  if (!confirm(`Remove ${employee.name} from the workspace?\nTheir desk will be freed.`)) return;
  const seat = state.seats.find((item) => item.id === employee.seat);
  if (seat) { seat.status = 'free'; seat.occupant = null; await saveSeat(seat); }
  const result = await deleteEmployee(employeeId);
  if (result && result.ok === false) {
    showToast('Could not remove — database rejected the delete (check permissions).', 'error');
    return;
  }
  state.employees = state.employees.filter((item) => item.id !== employeeId);
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
  showToast(`${employee.name} removed`, 'success');
}

// Lightweight toast notification.
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

async function updateSeatColor(seatId, color) {
  const seat = state.seats.find((item) => item.id === seatId);
  if (!seat) return;
  seat.color = color;
  await saveSeat(seat);
  renderFloorMap();
}

// ── Admin panel ───────────────────────────────────────────────────────────────
function renderAdminTeamFilters() {
  const container = document.getElementById('admin-team-filters');
  if (!container) return;
  
  const activeDepts = new Set(state.employees.map(e => e.department));
  const filteredOptions = departmentOptions.filter(d => activeDepts.has(d));
  
  const activeClassAll = state.adminTeamFilter === '' ? 'active' : '';
  let html = `<button class="dept-btn ${activeClassAll}" data-dept="">All Teams</button>`;
  
  html += filteredOptions.map((dept) => {
    const activeClass = state.adminTeamFilter === dept ? 'active' : '';
    const tableLabel = deptToTable[dept] ? ` (${deptToTable[dept]})` : '';
    return `<button class="dept-btn ${activeClass}" data-dept="${dept}">${dept}${tableLabel}</button>`;
  }).join('');
  
  container.innerHTML = html;
  
  container.querySelectorAll('.dept-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.adminTeamFilter = btn.dataset.dept;
      renderAdminTeamFilters();
      renderAdminSeats();
      renderAdminEmployees();
    });
  });
}

function initAdminTabs() {
  const buttons = document.querySelectorAll('.admin-nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all nav buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Activate clicked nav button
      btn.classList.add('active');
      
      // Determine tab target ID
      const tabId = btn.id.replace('admin-nav-', 'admin-tab-');
      
      // Deactivate all tab content blocks
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Activate target tab content block
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Re-populate free seats and department dropdowns when switching tabs
      if (btn.id === 'admin-nav-add') {
        populateAdminAddEmployeeFormOptions();
      }
    });
  });
}

function populateAdminAddEmployeeFormOptions() {
  // Populate Department Select
  const deptSelect = document.getElementById('employee-dept');
  if (deptSelect) {
    deptSelect.innerHTML = departmentOptions.map(dept => `<option value="${dept}">${dept}</option>`).join('');
  }
  
  // Populate Seat Select
  const seatSelect = document.getElementById('employee-seat');
  if (seatSelect) {
    const freeSeats = state.seats.filter(s => s.status === 'free');
    seatSelect.innerHTML = `
      <option value="">-- Working from Home (No Seat) --</option>
      ${freeSeats.map(s => `<option value="${s.id}">${s.label} (${s.department})</option>`).join('')}
    `;
  }

  renderEmployeeNameOptions();
  populateAddSeatFormOptions();
}

// ── Name autocomplete ───────────────────────────────────────────────────────────
// Known roster = everyone currently loaded (Supabase) merged with the offline
// seed list, deduped by name. Powers the "type Sanjit → Sanjit Samant" suggestions.
function buildNameRoster() {
  const byName = new Map();
  [...state.employees, ...mockEmployees].forEach((emp) => {
    if (!emp || !emp.name) return;
    const key = emp.name.trim().toLowerCase();
    if (!byName.has(key)) byName.set(key, { name: emp.name.trim(), department: emp.department || '' });
  });
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function renderEmployeeNameOptions() {
  const datalist = document.getElementById('employee-name-options');
  if (!datalist) return;
  datalist.innerHTML = buildNameRoster()
    .map((p) => `<option value="${p.name}">${p.department}</option>`)
    .join('');
}

// When the typed name matches a known person, fill their department automatically.
function autofillDeptFromName(nameInputId, deptInputId) {
  const nameInput = document.getElementById(nameInputId);
  const deptInput = document.getElementById(deptInputId);
  if (!nameInput || !deptInput) return;
  const typed = nameInput.value.trim().toLowerCase();
  if (!typed) return;
  const match = buildNameRoster().find((p) => p.name.toLowerCase() === typed);
  if (!match || !match.department) return;
  if (deptInput.tagName === 'SELECT') {
    if (departmentOptions.includes(match.department)) deptInput.value = match.department;
  } else {
    deptInput.value = match.department;
  }
}

// ── Add a new seat to the layout ─────────────────────────────────────────────────
function getNextDeskLabel() {
  const numbers = state.seats
    .map((s) => parseInt(String(s.id).replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `Desk ${next}`;
}

function populateAddSeatFormOptions() {
  const tableSelect = document.getElementById('seat-table');
  const teamSelect = document.getElementById('seat-team');
  const labelInput = document.getElementById('seat-label');
  if (tableSelect) tableSelect.innerHTML = seatTableGroups.map((t) => `<option value="${t}">${t}</option>`).join('');
  if (teamSelect) teamSelect.innerHTML = departmentOptions.map((d) => `<option value="${d}">${d}</option>`).join('');
  if (labelInput && !labelInput.value.trim()) labelInput.value = getNextDeskLabel();
}

async function handleSeatAdd(event) {
  event.preventDefault();
  const labelInput = document.getElementById('seat-label');
  const tableInput = document.getElementById('seat-table');
  const teamInput = document.getElementById('seat-team');
  let label = labelInput.value.trim();
  if (/^\d+$/.test(label)) label = `Desk ${label}`;
  const table = tableInput.value;
  const department = teamInput.value;
  if (!label || !table || !department) {
    alert('Enter a seat label and pick a table and team.');
    return;
  }
  if (state.seats.find((s) => s.id.toLowerCase() === label.toLowerCase())) {
    alert(`A seat called "${label}" already exists.`);
    return;
  }
  const tableCount = state.seats.filter((s) => s.table === table).length;
  if (tableCount >= SEATS_PER_ROW * 2) {
    alert(`${table} is full — max ${SEATS_PER_ROW * 2} desks (${SEATS_PER_ROW} per row).`);
    return;
  }
  const seat = { id: label, label, floor: 'main-floor', status: 'free', occupant: null, department, table, color: null };
  const saved = await createSeat(seat);
  state.seats.push({ ...seat, ...saved });
  state.seats = sortSeats(state.seats);
  rebuildSeatMeta();
  labelInput.value = '';
  populateAddSeatFormOptions();
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
  showToast(`${label} added to ${table}`, 'success');
}

function renderAdminLoginState() {
  document.getElementById('admin-login-panel').classList.toggle('hidden', state.adminLoggedIn);
  document.getElementById('admin-dashboard').classList.toggle('hidden', !state.adminLoggedIn);
  if (state.adminLoggedIn) {
    state.adminTeamFilter = ''; // Reset team filter
    renderAdminTeamFilters();
    initAdminTabs();
    // Default to seat control tab
    const navSeatsBtn = document.getElementById('admin-nav-seats');
    if (navSeatsBtn) {
      navSeatsBtn.click();
    }
  }
}

function handleAdminLogin() {
  const username = document.getElementById('admin-user').value.trim();
  const password = document.getElementById('admin-pass').value;
  const errorText = document.getElementById('login-error');
  if (username === 'admin' && password === 'admin123') {
    state.adminLoggedIn = true;
    errorText.classList.add('hidden');
    renderAdminLoginState(); renderAdminSeats(); renderAdminEmployees();
  } else {
    errorText.classList.remove('hidden');
  }
}

function handleAdminLogout() {
  state.adminLoggedIn = false;
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
  renderAdminLoginState();
}

function renderAdminSeats() {
  const tableBody = document.getElementById('admin-seat-body');
  if (!tableBody) return;
  const q = state.adminSearchQuery.toLowerCase();
  const filteredSeats = state.seats.filter(seat => {
    const teamMatch = !state.adminTeamFilter || seat.department === state.adminTeamFilter;
    const searchMatch = !q || seat.id.toLowerCase().includes(q) ||
      seat.department?.toLowerCase().includes(q) ||
      seat.table?.toLowerCase().includes(q) ||
      seat.occupant?.name.toLowerCase().includes(q);
    return teamMatch && searchMatch;
  });
  tableBody.innerHTML = filteredSeats.map((seat) => {
    const occupant = seat.occupant ? `${seat.occupant.name} (${seat.occupant.department})` : '-';
    const actionLabel = seat.status === 'occupied' ? 'Release' : 'Reserve';
    const actionClass = seat.status === 'occupied' ? 'danger' : 'secondary';
    const colorValue = seat.color || getStatusColor(seat.status);
    return `
      <tr>
        <td>Main Floor</td><td>${seat.label}</td>
        <td>${seat.table || '-'}</td>
        <td><span class="status-badge ${seat.status}">${seat.status.toUpperCase()}</span></td>
        <td>${occupant}</td>
        <td><input type="color" value="${colorValue}" data-seat="${seat.id}" class="seat-color-picker" style="border: none; background: transparent; cursor: pointer; width: 40px; height: 26px;" /></td>
        <td><button data-seat="${seat.id}" class="btn ${actionClass} admin-seat-action">${actionLabel}</button></td>
      </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align: center; padding: 20px;">No seats found.</td></tr>';

  document.querySelectorAll('.admin-seat-action').forEach((btn) => {
    btn.addEventListener('click', () => toggleSeatStatus(btn.dataset.seat));
  });
  document.querySelectorAll('.seat-color-picker').forEach((input) => {
    input.addEventListener('input', () => updateSeatColor(input.dataset.seat, input.value));
  });

  populateAddSeatFormOptions();
  renderEmployeeNameOptions();
  renderAdminSeatVisual();
}

// Filters seats by the active team filter + admin search (shared by list & visual).
function getFilteredAdminSeats() {
  const q = state.adminSearchQuery.toLowerCase();
  return state.seats.filter(seat => {
    const teamMatch = !state.adminTeamFilter || seat.department === state.adminTeamFilter;
    const searchMatch = !q || seat.id.toLowerCase().includes(q) ||
      seat.department?.toLowerCase().includes(q) ||
      seat.table?.toLowerCase().includes(q) ||
      seat.occupant?.name.toLowerCase().includes(q);
    return teamMatch && searchMatch;
  });
}

// Visual seat arrangement: each table rendered as a card with clickable chairs.
function renderAdminSeatVisual() {
  const container = document.getElementById('admin-seat-visual');
  if (!container) return;
  const visible = new Set(getFilteredAdminSeats().map(s => s.id));

  container.innerHTML = seatTableGroups.map((tableName) => {
    const seats = state.seats.filter((seat) => seat.table === tableName);
    if (!seats.length) return '';
    const occupied = seats.filter(s => s.status === 'occupied').length;
    const { topSeats, bottomSeats, topTeam, bottomTeam } = splitTableSides(seats);
    const sameTeam = topTeam === bottomTeam;
    const chair = (s) => {
      const out = visible.has(s.id) ? '' : ' filtered-out';
      const inner = s.status === 'occupied' && s.occupant
        ? s.occupant.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : s.label.replace('Desk ', '');
      return `<div class="admin-chair ${s.status}${out}" data-seat="${s.id}" title="${s.label}"><span class="chair-label">${inner}</span></div>`;
    };
    const rowLabel = (team) => team ? `<div class="row-team-label">${team}</div>` : '';
    return `
      <div class="admin-table-card">
        <div class="table-visual-header">
          <span class="table-visual-name">${tableName}</span>
          <span class="table-count">${occupied}/${seats.length} occupied</span>
        </div>
        ${rowLabel(topTeam)}
        <div class="chairs-row">${topSeats.map(chair).join('')}</div>
        <div class="table-plank"><span class="table-plank-text">${tableName}</span></div>
        <div class="chairs-row">${bottomSeats.map(chair).join('')}</div>
        ${sameTeam ? '' : rowLabel(bottomTeam)}
      </div>`;
  }).join('') || '<p style="color:var(--muted);padding:20px;text-align:center;">No seats match the current filter.</p>';

  container.querySelectorAll('.admin-chair').forEach((el) => {
    el.addEventListener('click', (e) => { e.stopPropagation(); openAdminSeatPopover(el.dataset.seat, el); });
  });
}

// Floating popover to assign / release / recolor a seat from the visual layout.
function openAdminSeatPopover(seatId, anchorEl) {
  closeAdminSeatPopover();
  const seat = state.seats.find((s) => s.id === seatId);
  if (!seat) return;

  document.querySelectorAll('.admin-chair.selected').forEach(c => c.classList.remove('selected'));
  anchorEl.classList.add('selected');

  const pop = document.createElement('div');
  pop.className = 'admin-seat-popover';
  const colorValue = seat.color || getStatusColor(seat.status);

  let body = `
    <h4>${seat.label}</h4>
    <span class="pop-status ${seat.status}">${seat.status}</span>
    <div class="pop-row"><strong>Table:</strong> ${seat.table || '-'} · ${seat.department}</div>`;

  if (seat.status === 'occupied' && seat.occupant) {
    body += `<div class="pop-row"><strong>${seat.occupant.name}</strong> — ${seat.occupant.department}</div>
      <div class="pop-actions">
        <button class="btn danger" data-act="release">Release seat</button>
      </div>`;
  } else if (seat.status === 'reserved') {
    body += `<div class="pop-row">Reserved seat</div>
      <div class="pop-actions">
        <button class="btn danger" data-act="release">Free seat</button>
      </div>`;
  } else {
    body += `<div class="pop-assign">
        <input type="text" id="pop-assign-name" placeholder="Name (optional)" list="employee-name-options" autocomplete="off" />
      </div>
      <div class="pop-actions">
        <button class="btn primary" data-act="assign">Assign here</button>
      </div>`;
  }

  body += `<div class="pop-color">Seat color
      <input type="color" value="${colorValue}" data-act="color" />
    </div>
    <button class="btn pop-delete" data-act="delete">🗑 Delete this seat</button>`;

  pop.innerHTML = body;
  document.body.appendChild(pop);

  // Position above the chair (flip below if not enough room)
  const r = anchorEl.getBoundingClientRect();
  const pr = pop.getBoundingClientRect();
  let top = r.top - pr.height - 12;
  let flip = false;
  if (top < 8) { top = r.bottom + 12; flip = true; }
  pop.classList.toggle('flip', flip);
  let left = r.left + r.width / 2 - pr.width / 2;
  left = Math.max(10, Math.min(left, window.innerWidth - pr.width - 10));
  pop.style.top = `${top}px`;
  pop.style.left = `${left}px`;

  pop.querySelector('[data-act="assign"]')?.addEventListener('click', async () => {
    const name = document.getElementById('pop-assign-name')?.value.trim() || 'Guest User';
    await adminAssignSeat(seatId, name);
    closeAdminSeatPopover();
  });
  pop.querySelector('[data-act="release"]')?.addEventListener('click', async () => {
    await toggleSeatStatus(seatId);
    closeAdminSeatPopover();
  });
  pop.querySelector('[data-act="color"]')?.addEventListener('input', (e) => {
    updateSeatColor(seatId, e.target.value);
  });
  pop.querySelector('[data-act="delete"]')?.addEventListener('click', async () => {
    closeAdminSeatPopover();
    await deleteSeat(seatId);
  });
}

// Delete a seat from the layout entirely (frees any occupant first).
async function deleteSeat(seatId) {
  const seat = state.seats.find((s) => s.id === seatId);
  if (!seat) return;
  if (!confirm(`Delete ${seat.label} from the layout?\nThis removes the seat entirely.`)) return;
  const emp = state.employees.find((e) => e.seat === seatId);
  if (emp) {
    emp.seat = null; emp.table = 'No desk'; emp.wfh = true;
    await updateEmployee(emp.id, { seat: null, table: 'No desk', wfh: true });
  }
  const result = await deleteSeatRecord(seatId);
  if (result && result.ok === false) {
    showToast('Could not delete — database rejected it (check permissions).', 'error');
    return;
  }
  state.seats = state.seats.filter((s) => s.id !== seatId);
  rebuildSeatMeta();
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
  showToast(`${seatId} deleted`, 'success');
}

async function deleteSeatRecord(id) {
  if (!_supabase) return { ok: true };
  const { error } = await _supabase.from('seats').delete().eq('id', id);
  if (error) { console.error('deleteSeat failed:', error); return { ok: false, error }; }
  return { ok: true };
}

function closeAdminSeatPopover() {
  document.querySelectorAll('.admin-seat-popover').forEach(p => p.remove());
  document.querySelectorAll('.admin-chair.selected').forEach(c => c.classList.remove('selected'));
}

// Occupy a free seat with a named (or guest) employee.
async function adminAssignSeat(seatId, name) {
  const seat = state.seats.find((s) => s.id === seatId);
  if (!seat || seat.status === 'occupied') return;
  seat.status = 'occupied';
  seat.occupant = { name, department: seat.department };
  const saved = await addEmployee({ name, department: seat.department, seat: seatId, table: seat.table, checkIn: getCurrentTime(), wfh: false });
  state.employees.push({ ...saved });
  await saveSeat(seat);
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
  showToast(`${name} assigned to ${seat.label}`, 'success');
}

function getStatusColor(status) {
  if (status === 'occupied') return '#fef2f2';
  if (status === 'reserved') return '#fffbeb';
  return '#f0fdf4';
}

async function updateEmployeeDepartment(employeeId, newDept) {
  const emp = state.employees.find(e => e.id === employeeId);
  if (!emp) return;
  
  const oldDept = emp.department;
  emp.department = newDept;
  
  // If the employee occupies a seat, we must update the occupant's department on that seat too!
  if (emp.seat) {
    const seat = state.seats.find(s => s.id === emp.seat);
    if (seat && seat.occupant) {
      seat.occupant.department = newDept;
      await saveSeat(seat);
    }
  }

  await updateEmployee(emp.id, { department: newDept });

  // If the active filter was the old department, reset it since they changed it
  if (state.adminTeamFilter === oldDept) {
    const stillHasMembers = state.employees.some(e => e.department === oldDept);
    if (!stillHasMembers) {
      state.adminTeamFilter = '';
    }
  }

  renderFloorMap();
  renderDirectory();
  renderAdminSeats();
  renderAdminEmployees();
  renderAdminTeamFilters();
  renderMapDepartmentButtons();
}

function renderAdminEmployees() {
  const tableBody = document.getElementById('admin-employee-body');
  if (!tableBody) return;
  const q = state.adminSearchQuery.toLowerCase();
  const filteredEmployees = state.employees.filter(emp => {
    const teamMatch = !state.adminTeamFilter || emp.department === state.adminTeamFilter;
    const searchMatch = !q || emp.name.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.seat?.toLowerCase().includes(q) ||
      emp.table?.toLowerCase().includes(q);
    return teamMatch && searchMatch;
  });
  
  tableBody.innerHTML = filteredEmployees.map((emp) => {
    const wfhLabel = emp.wfh ? 'WFH' : 'Office';
    const btnClass = emp.wfh ? 'success' : 'secondary';
    
    // Create department dropdown select
    const deptSelectOptions = departmentOptions.map(d => {
      const selected = d === emp.department ? 'selected' : '';
      return `<option value="${d}" ${selected}>${d}</option>`;
    }).join('');
    
    const deptDropdown = `
      <select data-id="${emp.id}" class="admin-dept-select" style="padding: 4px 8px; background: #1e293b; color: white; border: 1px solid #334155; border-radius: 6px; font-size: 0.85rem; cursor: pointer;">
        ${deptSelectOptions}
      </select>
    `;
    
    return `
      <tr>
        <td>${emp.name}</td>
        <td>${deptDropdown}</td>
        <td>${emp.wfh ? '<span style="color:#94a3b8;">—</span>' : (emp.table || 'No desk')}</td>
        <td>${emp.seat || 'No desk'}</td>
        <td><button data-id="${emp.id}" class="btn ${btnClass} admin-wfh-toggle">${wfhLabel}</button></td>
        <td><button data-id="${emp.id}" class="btn danger admin-remove-employee">Remove</button></td>
      </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align: center; padding: 20px;">No employees checked in.</td></tr>';

  document.querySelectorAll('.admin-wfh-toggle').forEach((btn) => {
    btn.addEventListener('click', () => toggleWfh(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.admin-remove-employee').forEach((btn) => {
    btn.addEventListener('click', () => removeEmployee(Number(btn.dataset.id)));
  });
  
  document.querySelectorAll('.admin-dept-select').forEach((select) => {
    select.addEventListener('change', (e) => {
      const empId = Number(select.dataset.id);
      const newDept = select.value;
      updateEmployeeDepartment(empId, newDept);
    });
  });
}

// ── Auto-refresh: re-fetches live data from API every 10 s ───────────────────
function startAutoRefresh() {
  if (state.refreshIntervalId) clearInterval(state.refreshIntervalId);
  state.refreshIntervalId = setInterval(async () => {
    await loadFromServer();
    await checkExpiredVisitors();
    await checkExpiredRooms();
    renderFloorMap();
    renderDirectory();
    renderRooms();
    if (state.adminLoggedIn) { renderAdminSeats(); renderAdminEmployees(); }
  }, 10000);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Visitor booking ───────────────────────────────────────────────────────────
async function bookVisitorSeat(seatId) {
  const name = document.getElementById('popup-visitor-name')?.value.trim();
  const duration = parseInt(document.getElementById('popup-visitor-dur')?.value || '60');
  if (!name) { alert('Please enter visitor name.'); return; }
  const seat = state.seats.find(s => s.id === seatId);
  if (!seat || seat.status !== 'free') return;
  const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();
  seat.status = 'reserved';
  seat.occupant = { name, type: 'visitor', expiresAt };
  await saveSeat(seat);
  document.querySelectorAll('.map-seat-popup').forEach(p => p.remove());
  renderFloorMap();
  if (state.adminLoggedIn) renderAdminSeats();
}
window.bookVisitorSeat = bookVisitorSeat;

async function checkExpiredVisitors() {
  const now = new Date();
  const expired = state.seats.filter(s =>
    s.status === 'reserved' && s.occupant?.type === 'visitor' &&
    s.occupant?.expiresAt && new Date(s.occupant.expiresAt) < now
  );
  if (!expired.length) return;
  await Promise.all(expired.map(seat => {
    seat.status = 'free'; seat.occupant = null; return saveSeat(seat);
  }));
}

// ── Daily reset ───────────────────────────────────────────────────────────────
async function dailyReset() {
  if (!confirm('Reset all check-in times for tomorrow? Seat assignments and WFH status are kept.')) return;
  state.employees.forEach(emp => { emp.checkIn = '—'; });
  await Promise.all(state.employees.map(emp => updateEmployee(emp.id, { checkIn: '—' })));
  renderDirectory();
  renderAdminEmployees();
  alert('Done — all check-in times cleared.');
}
window.dailyReset = dailyReset;

// ── Meeting rooms ─────────────────────────────────────────────────────────────
function renderRooms() {
  const container = document.getElementById('rooms-grid');
  if (!container) return;
  container.innerHTML = state.meetingRooms.map(room => {
    const booked = room.status === 'booked';
    const untilStr = room.booked_until
      ? `Until ${new Date(room.booked_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : '';
    const bookForm = `
      <div class="room-book-form">
        <input id="rb-name-${room.id}" type="text" placeholder="Booked by…" />
        <select id="rb-dur-${room.id}">
          <option value="30">30 min</option><option value="60">1 hour</option>
          <option value="120">2 hours</option><option value="240">Half day</option>
          <option value="480">Full day</option>
        </select>
        <button class="btn primary" onclick="bookRoom(${room.id})">Book</button>
      </div>`;
    const releaseBtn = `<button class="btn danger" onclick="releaseRoom(${room.id})">Release</button>`;
    return `
      <div class="room-card ${booked ? 'booked' : ''}">
        <div class="room-card-header">
          <h3>${room.name}</h3>
          <span class="room-capacity">👥 ${room.capacity}</span>
        </div>
        <span class="room-status-pill ${booked ? 'booked' : 'available'}">${booked ? 'BOOKED' : 'AVAILABLE'}</span>
        ${booked ? `<div class="room-booked-info">${room.booked_by || ''}${untilStr ? ' · ' + untilStr : ''}</div>` : ''}
        ${state.adminLoggedIn ? (booked ? releaseBtn : bookForm) : ''}
      </div>`;
  }).join('') || '<p style="color:var(--muted)">No meeting rooms configured. Run supabase-meeting-rooms.sql first.</p>';
}

async function bookRoom(roomId) {
  const nameInput = document.getElementById(`rb-name-${roomId}`);
  const durSelect = document.getElementById(`rb-dur-${roomId}`);
  const name = nameInput?.value.trim();
  const duration = parseInt(durSelect?.value || '60');
  if (!name) { alert('Please enter who is booking.'); return; }
  const room = state.meetingRooms.find(r => r.id === roomId);
  if (!room) return;
  room.status = 'booked';
  room.booked_by = name;
  room.booked_until = new Date(Date.now() + duration * 60 * 1000).toISOString();
  if (_supabase) {
    const { error } = await _supabase.from('meeting_rooms').update({
      status: 'booked', booked_by: room.booked_by, booked_until: room.booked_until
    }).eq('id', roomId);
    if (error) console.error('bookRoom failed:', error);
  }
  renderRooms();
}
window.bookRoom = bookRoom;

async function releaseRoom(roomId) {
  const room = state.meetingRooms.find(r => r.id === roomId);
  if (!room) return;
  room.status = 'available';
  room.booked_by = null;
  room.booked_until = null;
  if (_supabase) {
    const { error } = await _supabase.from('meeting_rooms').update({
      status: 'available', booked_by: null, booked_until: null
    }).eq('id', roomId);
    if (error) console.error('releaseRoom failed:', error);
  }
  renderRooms();
}
window.releaseRoom = releaseRoom;

async function checkExpiredRooms() {
  const now = new Date();
  const expired = state.meetingRooms.filter(r =>
    r.status === 'booked' && r.booked_until && new Date(r.booked_until) < now
  );
  if (!expired.length) return;
  await Promise.all(expired.map(room => {
    room.status = 'available'; room.booked_by = null; room.booked_until = null;
    return _supabase ? _supabase.from('meeting_rooms').update({
      status: 'available', booked_by: null, booked_until: null
    }).eq('id', room.id) : Promise.resolve();
  }));
}

initApp();
