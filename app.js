const officeInfo = {
  totalStaff: 72,
  deskDemand: 56,
  employeesNeedingDesk: 56,
  internsNeedingDesk: 3,
  adminsNoDesk: 2,
  totalSeats: 56,
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
  searchQuery: '',
  editingEmployeeId: null,
  customSeatPositions: {},  // { 'Desk 57': { x, y, dir } }
  pendingNewDesk: null,     // { x, y } while modal is open
  tableNames: {
    'Table 1': 'Table 1',
    'Table 2': 'Table 2',
    'Table 3': 'Table 3',
    'Table 4': 'Table 4',
    'Table 5': 'Table 5',
    'Table 6': 'Table 6',
    'Table 7': 'Table 7',
  },
  deptNames: {
    'CS': 'CS',
    'Art': 'Art',
    'Copy': 'Copy',
    'Production': 'Production',
    'Studio': 'Studio',
    'Digital': 'Digital',
    'HR': 'HR',
    'Finance': 'Finance',
    'IT': 'IT',
  },
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
  // ── Table 1 — CS (Desks 4–12 occupied; Desks 1–3 moved to Table 7) ──────────
  { id: 31, name: 'Jyoti Nair',             department: 'CS',         seat: 'Desk 4',  table: 'Table 1', checkIn: '09:41 AM', wfh: false },
  { id: 32, name: 'Bhagyashree Shah',        department: 'CS',         seat: 'Desk 5',  table: 'Table 1', checkIn: '09:42 AM', wfh: false },
  { id: 33, name: 'Nilesh Singh Bashera',    department: 'CS',         seat: 'Desk 6',  table: 'Table 1', checkIn: '09:43 AM', wfh: false },
  { id: 34, name: 'Chandni Upadhyay',        department: 'CS',         seat: 'Desk 7',  table: 'Table 1', checkIn: '09:44 AM', wfh: false },
  { id: 35, name: 'Pranjal Agarwal',         department: 'CS',         seat: 'Desk 8',  table: 'Table 1', checkIn: '09:45 AM', wfh: false },
  { id: 36, name: 'Srushti Chawhan',         department: 'CS',         seat: 'Desk 9',  table: 'Table 1', checkIn: '09:46 AM', wfh: false },
  { id: 37, name: 'Nathanial Siqueira Vaz',  department: 'CS',         seat: 'Desk 10', table: 'Table 1', checkIn: '09:47 AM', wfh: false },
  { id: 38, name: 'Dhruti Maru',             department: 'CS',         seat: 'Desk 11', table: 'Table 1', checkIn: '09:48 AM', wfh: false },
  { id: 39, name: 'Dhyan Ramnani',           department: 'CS',         seat: 'Desk 12', table: 'Table 1', checkIn: '09:49 AM', wfh: false },
  // ── Table 2 — Art (all 10 desks occupied) ────────────────────────────────────
  { id: 11, name: 'Rupesh Doiphode',         department: 'Art',        seat: 'Desk 13', table: 'Table 2', checkIn: '09:21 AM', wfh: false },
  { id: 12, name: 'Yogesh More',             department: 'Art',        seat: 'Desk 14', table: 'Table 2', checkIn: '09:22 AM', wfh: false },
  { id: 13, name: 'Rahul Kumawat',           department: 'Art',        seat: 'Desk 15', table: 'Table 2', checkIn: '09:23 AM', wfh: false },
  { id: 14, name: 'Masumi Shrimankar',       department: 'Art',        seat: 'Desk 16', table: 'Table 2', checkIn: '09:24 AM', wfh: false },
  { id: 15, name: 'Dhruvi Shah',             department: 'Art',        seat: 'Desk 17', table: 'Table 2', checkIn: '09:25 AM', wfh: false },
  { id: 16, name: 'Sonali Sawant',           department: 'Art',        seat: 'Desk 18', table: 'Table 2', checkIn: '09:26 AM', wfh: false },
  { id: 17, name: 'Sushant Agare',           department: 'Art',        seat: 'Desk 19', table: 'Table 2', checkIn: '09:27 AM', wfh: false },
  { id: 18, name: 'Amey Lad',               department: 'Art',        seat: 'Desk 20', table: 'Table 2', checkIn: '09:28 AM', wfh: false },
  { id: 19, name: 'Kiran Salkar',            department: 'Art',        seat: 'Desk 21', table: 'Table 2', checkIn: '09:29 AM', wfh: false },
  { id: 20, name: 'Atharva Salvi',           department: 'Art',        seat: 'Desk 22', table: 'Table 2', checkIn: '09:30 AM', wfh: false },
  // ── Table 3 — Copy (Desks 25–30 occupied; Desks 23–24 moved to Table 7) ─────
  { id: 25, name: 'Ritwik Mishra',           department: 'Copy',       seat: 'Desk 25', table: 'Table 3', checkIn: '09:35 AM', wfh: false },
  { id: 26, name: 'Sanjit Samant',           department: 'Copy',       seat: 'Desk 26', table: 'Table 3', checkIn: '09:36 AM', wfh: false },
  { id: 27, name: 'Anarghya Poojary',        department: 'Copy',       seat: 'Desk 27', table: 'Table 3', checkIn: '09:37 AM', wfh: false },
  { id: 28, name: 'Juhi Pravin Shah',        department: 'Copy',       seat: 'Desk 28', table: 'Table 3', checkIn: '09:38 AM', wfh: false },
  { id: 29, name: 'Gaurav Pant',             department: 'Copy',       seat: 'Desk 29', table: 'Table 3', checkIn: '09:39 AM', wfh: false },
  { id: 30, name: 'Aditya Salve',            department: 'Copy',       seat: 'Desk 30', table: 'Table 3', checkIn: '09:40 AM', wfh: false },
  // ── Table 5 — Studio (Desks 40–44 occupied; Desks 38–39 moved to Table 7) ───
  { id: 48, name: 'Uday Panchal',            department: 'Studio',     seat: 'Desk 40', table: 'Table 5', checkIn: '09:18 AM', wfh: false },
  { id: 49, name: 'Ashish Kumbhar',          department: 'Studio',     seat: 'Desk 41', table: 'Table 5', checkIn: '09:19 AM', wfh: false },
  { id: 50, name: 'Navnath Bhere',           department: 'Studio',     seat: 'Desk 42', table: 'Table 5', checkIn: '09:20 AM', wfh: false },
  { id: 51, name: 'Rajesh K Bhardwaj',       department: 'Studio',     seat: 'Desk 43', table: 'Table 5', checkIn: '09:21 AM', wfh: false },
  { id: 52, name: 'Abhishek Shelar',         department: 'Studio',     seat: 'Desk 44', table: 'Table 5', checkIn: '09:22 AM', wfh: false },
  // ── Table 6 — Digital & Support ──────────────────────────────────────────────
  { id: 54, name: 'Meghna Gambhir',          department: 'Digital',    seat: 'Desk 45', table: 'Table 6', checkIn: '09:24 AM', wfh: false },
  { id: 55, name: 'Amaan Khan',              department: 'Digital',    seat: 'Desk 46', table: 'Table 6', checkIn: '09:25 AM', wfh: false },
  { id: 56, name: 'Mohit Devganiya',         department: 'Digital',    seat: 'Desk 47', table: 'Table 6', checkIn: '09:26 AM', wfh: false },
  { id: 57, name: 'Prem Gohil',              department: 'Digital',    seat: 'Desk 48', table: 'Table 6', checkIn: '09:27 AM', wfh: false },
  { id: 58, name: 'Gaurav Gohil',            department: 'Digital',    seat: 'Desk 49', table: 'Table 6', checkIn: '09:28 AM', wfh: false },
  { id: 60, name: 'Aanchal Choudhary',       department: 'Digital',    seat: 'Desk 51', table: 'Table 6', checkIn: '09:30 AM', wfh: false },
  { id: 61, name: 'Jennifer Sequeira',       department: 'HR',         seat: 'Desk 52', table: 'Table 6', checkIn: '09:31 AM', wfh: false },
  { id: 62, name: 'Vidya Sridhar',           department: 'Finance',    seat: 'Desk 53', table: 'Table 6', checkIn: '09:32 AM', wfh: false },
  { id: 63, name: 'Mahesh Tanawde',          department: 'Finance',    seat: 'Desk 54', table: 'Table 6', checkIn: '09:33 AM', wfh: false },
  { id: 64, name: 'Yatin Ashok Mhatre',      department: 'IT',         seat: 'Desk 55', table: 'Table 6', checkIn: '09:34 AM', wfh: false },
  // ── Table 7 — No fixed desk (in office, hotdesking) ──────────────────────────
  { id: 1,  name: 'Sujay Bhonsle',           department: 'CS',         seat: null, table: 'Table 7', checkIn: '09:11 AM', wfh: false },
  { id: 2,  name: 'Smriti Tewari',           department: 'CS',         seat: null, table: 'Table 7', checkIn: '09:12 AM', wfh: false },
  { id: 3,  name: 'Blaise Vaz',              department: 'CS',         seat: null, table: 'Table 7', checkIn: '09:13 AM', wfh: false },
  { id: 4,  name: 'Viraj Chorghe',           department: 'Production', seat: null, table: 'Table 7', checkIn: '09:14 AM', wfh: false },
  { id: 5,  name: 'Varun Lalka',             department: 'Production', seat: null, table: 'Table 7', checkIn: '09:15 AM', wfh: false },
  { id: 6,  name: 'Darryl Gomes',            department: 'Production', seat: null, table: 'Table 7', checkIn: '09:16 AM', wfh: false },
  { id: 7,  name: 'Ashok Chatla',            department: 'Production', seat: null, table: 'Table 7', checkIn: '09:17 AM', wfh: false },
  { id: 8,  name: 'Raj Kolambkar',           department: 'Production', seat: null, table: 'Table 7', checkIn: '09:18 AM', wfh: false },
  { id: 9,  name: 'Avishkar Mandavkar',      department: 'Production', seat: null, table: 'Table 7', checkIn: '09:19 AM', wfh: false },
  { id: 10, name: 'Bhaskar Wooragonda',      department: 'Production', seat: null, table: 'Table 7', checkIn: '09:20 AM', wfh: false },
  { id: 23, name: 'Subodh Chaubey',          department: 'Copy',       seat: null, table: 'Table 7', checkIn: '09:33 AM', wfh: false },
  { id: 24, name: 'Ryan Parkar',             department: 'Copy',       seat: null, table: 'Table 7', checkIn: '09:34 AM', wfh: false },
  { id: 46, name: 'Dattaram Kambli',         department: 'Studio',     seat: null, table: 'Table 7', checkIn: '09:16 AM', wfh: false },
  { id: 47, name: 'Biju Dasan',              department: 'Studio',     seat: null, table: 'Table 7', checkIn: '09:17 AM', wfh: false },
  { id: 59, name: 'Nitesh Kumar',            department: 'Digital',    seat: null, table: 'Table 7', checkIn: '09:29 AM', wfh: false },
  { id: 65, name: 'Akshita Datir',           department: 'Digital',    seat: null, table: 'Table 7', checkIn: '09:35 AM', wfh: false },
  // ── WFH / Remote ──────────────────────────────────────────────────────────────
  { id: 21, name: 'Siya Pandit',             department: 'Art',        seat: null, table: 'No desk', checkIn: '09:31 AM', wfh: true },
  { id: 22, name: 'Sumedh Sawant',           department: 'Art',        seat: null, table: 'No desk', checkIn: '09:32 AM', wfh: true },
  { id: 40, name: 'Jayalaxmi Ravi',          department: 'CS',         seat: null, table: 'No desk', checkIn: '09:10 AM', wfh: true },
  { id: 41, name: 'Abhay Khabale',           department: 'CS',         seat: null, table: 'No desk', checkIn: '09:11 AM', wfh: true },
  { id: 42, name: 'Steffi Barboza',          department: 'CS',         seat: null, table: 'No desk', checkIn: '09:12 AM', wfh: true },
  { id: 43, name: 'Tarun Kamath',            department: 'CS',         seat: null, table: 'No desk', checkIn: '09:13 AM', wfh: true },
  { id: 44, name: 'Kshitij Bidvai',          department: 'Digital',    seat: null, table: 'No desk', checkIn: '09:14 AM', wfh: true },
  { id: 45, name: 'Anoushka Kabre',          department: 'CS',         seat: null, table: 'No desk', checkIn: '09:15 AM', wfh: true },
  { id: 53, name: 'Sunil Saundalkar',        department: 'Studio',     seat: null, table: 'No desk', checkIn: '09:23 AM', wfh: true },
  { id: 66, name: 'Krish Shetty',            department: 'CS',         seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true },
  { id: 67, name: 'Dhyani Shah',             department: 'CS',         seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true },
  { id: 68, name: 'Aayush Munshi',           department: 'CS',         seat: null, table: 'No desk', checkIn: '09:36 AM', wfh: true },
];

const departmentOptions = [
  'CS', 'Art', 'Copy', 'Production', 'Studio', 'Digital', 'HR', 'Finance', 'IT'
];

const defaultMeetingRooms = [
  { id: 1, name: 'Conference Room', capacity: 12, description: '12 person seating', status: 'available', booked_by: null, booked_until: null },
  { id: 2, name: 'Meet Room 1',     capacity: 4,  description: '4 chairs',          status: 'available', booked_by: null, booked_until: null },
  { id: 3, name: 'Meet Room 2',     capacity: 4,  description: '3 chairs · 1 sofa', status: 'available', booked_by: null, booked_until: null },
];

const deptToTable = {
  'CS': 'Table 1',
  'Art': 'Table 2',
  'Copy': 'Table 3',
  'Production': 'Table 7',
  'Studio': 'Table 5',
  'Digital': 'Table 6',
  'HR': 'Table 6',
  'Finance': 'Table 6',
  'IT': 'Table 6',
};

const directoryGroups = ['CS', 'Art', 'Copy', 'Production', 'Studio', 'Digital', 'HR', 'Finance', 'IT'];

const seatTableGroups = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7'];

function getSeatDepartment(seatId) {
  const seatNumber = parseInt(seatId.replace('Desk ', ''), 10);
  if (seatNumber <= 12) return 'CS';
  if (seatNumber <= 22) return 'Art';
  if (seatNumber <= 30) return 'Copy';
  if (seatNumber <= 37) return 'Production';
  if (seatNumber <= 44) return 'Studio';
  // Specific assignments for desks 45-56
  if (seatNumber === 52) return 'HR';
  if (seatNumber === 53 || seatNumber === 54) return 'Finance';
  if (seatNumber === 55) return 'IT';
  return 'Digital';
}

function getSeatTable(seatId) {
  if (!seatId) return 'No desk';
  const seatNumber = parseInt(seatId.replace('Desk ', ''), 10);
  if (seatNumber <= 12) return 'Table 1';
  if (seatNumber <= 22) return 'Table 2';
  if (seatNumber <= 30) return 'Table 3';
  if (seatNumber <= 37) return 'Table 4';
  if (seatNumber <= 44) return 'Table 5';
  return 'Table 6';
}

function initSeats() {
  const seats = [];
  // Desks
  for (let i = 1; i <= 56; i++) {
    const seatId = `Desk ${i}`;
    seats.push({
      id: seatId, label: seatId, floor: 'main-floor',
      status: 'free', occupant: null,
      department: getSeatDepartment(seatId),
      table: getSeatTable(seatId), color: null,
    });
  }
  mockEmployees.forEach((employee) => {
    const seat = seats.find((item) => item.id === employee.seat);
    if (seat) {
      seat.status = 'occupied';
      seat.occupant = { name: employee.name, department: employee.department };
      if (employee.role) seat.occupant.role = employee.role;
    }
  });
  state.seats = seats;
  state.employees = mockEmployees.map((emp) => ({
    wfh: false,
    ...emp,
    table: emp.seat ? getSeatTable(emp.seat) : 'No desk',
  }));
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
    state.seats = seats;
    state.employees = emps.map((emp) => ({ wfh: emp.wfh || false, ...emp }));
    // Always enforce exactly the 3 defined rooms; preserve live booking status
    state.meetingRooms = defaultMeetingRooms.map(def => {
      const live = rooms?.find(r => r.id === def.id);
      return { ...def, status: live?.status || 'available', booked_by: live?.booked_by || null, booked_until: live?.booked_until || null };
    });
    syncDefaultRoomsToDb(rooms);
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

async function insertSeat(seat) {
  state.seats.push(seat);
  if (!_supabase) return;
  const { error } = await _supabase.from('seats').insert(seat);
  if (error) console.error('insertSeat failed:', error);
}

async function deleteSeat(seatId) {
  state.seats = state.seats.filter(s => s.id !== seatId);
  delete state.customSeatPositions[seatId];
  await saveSettingToDb('customSeatPositions', state.customSeatPositions);
  if (!_supabase) return;
  const { error } = await _supabase.from('seats').delete().eq('id', seatId);
  if (error) console.error('deleteSeat failed:', error);
}

function clientToSVGCoords(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  const svgX = (clientX - rect.left) * (1300 / rect.width);
  const svgY = (clientY - rect.top)  * (850  / rect.height);
  return {
    x: Math.round((svgX - state.panX) / state.zoom),
    y: Math.round((svgY - state.panY) / state.zoom),
  };
}

async function saveSettingToDb(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  if (!_supabase) return;
  const { error } = await _supabase.from('settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) console.warn('saveSettingToDb failed:', error.message);
}

async function loadSettingsFromDb() {
  // Always load from localStorage first so custom data survives a refresh
  try { Object.assign(state.tableNames,           JSON.parse(localStorage.getItem('tableNames')           || '{}')); } catch {}
  try { Object.assign(state.deptNames,            JSON.parse(localStorage.getItem('deptNames')            || '{}')); } catch {}
  try { Object.assign(state.customSeatPositions,  JSON.parse(localStorage.getItem('customSeatPositions')  || '{}')); } catch {}
  // Overlay with Supabase data when available and non-empty (Supabase wins on conflict)
  if (_supabase) {
    try {
      const { data, error } = await _supabase.from('settings').select('key, value');
      if (!error && data?.length) {
        data.forEach(row => {
          if (row.key === 'tableNames' && row.value && typeof row.value === 'object') {
            Object.assign(state.tableNames, row.value);
          }
          if (row.key === 'deptNames' && row.value && typeof row.value === 'object') {
            Object.assign(state.deptNames, row.value);
          }
          if (row.key === 'customSeatPositions' && row.value && typeof row.value === 'object') {
            Object.assign(state.customSeatPositions, row.value);
          }
        });
      }
    } catch {}
  }
}

async function syncDefaultRoomsToDb(dbRooms) {
  if (!_supabase) return;
  const defaultIds = defaultMeetingRooms.map(r => r.id);
  // Remove any stale rooms not in our defaults
  const staleIds = (dbRooms || []).map(r => r.id).filter(id => !defaultIds.includes(id));
  if (staleIds.length) {
    await _supabase.from('meeting_rooms').delete().in('id', staleIds);
  }
  // Upsert all 3 defaults (name/capacity/description always overwritten)
  for (const def of defaultMeetingRooms) {
    const live = (dbRooms || []).find(r => r.id === def.id);
    await _supabase.from('meeting_rooms').upsert({
      id: def.id, name: def.name, capacity: def.capacity, description: def.description,
      status: live?.status || 'available',
      booked_by: live?.booked_by || null,
      booked_until: live?.booked_until || null,
    }, { onConflict: 'id' });
  }
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
  if (!_supabase) return;
  const { error } = await _supabase.from('employees').delete().eq('id', id);
  if (error) console.error('deleteEmployee failed:', error);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function initApp() {
  await loadFromServer();
  await loadSettingsFromDb();
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
  document.getElementById('drag-chair-source').addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('application/new-chair', '1');
    e.dataTransfer.effectAllowed = 'copy';
  });
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
  document.getElementById('floor-map').addEventListener('click', handleChairClick);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.seat-node') && !event.target.closest('.cabin-box') && !event.target.closest('.map-seat-popup')) {
      document.querySelectorAll('.map-seat-popup').forEach((p) => p.remove());
    }
    if (!event.target.closest('.floor-map')) {
      document.querySelectorAll('.chair-popup').forEach((p) => p.remove());
    }
  });
}

function renderMapDepartmentButtons() {
  const container = document.getElementById('map-department-filters');
  if (!container) return;
  const activeDepts = new Set(state.employees.map(e => e.department));
  const filteredGroups = directoryGroups.filter(d => activeDepts.has(d));
  container.innerHTML = [
    '<button class="dept-btn active" data-dept="">All</button>',
    ...filteredGroups.map((d) => `<button class="dept-btn" data-dept="${d}">${getDeptName(d)}</button>`),
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
function getSeatCoordinates(seatId) {
  if (state.customSeatPositions[seatId]) return state.customSeatPositions[seatId];
  const num = parseInt(seatId.replace('Desk ', ''), 10);
  if (num <= 12) { // Table 1 - CS (12 desks: 1-6 top, 7-12 bottom)
    const idx = num - 1;
    if (idx < 6) return { x: 115 + idx * 54, y: 240, dir: 'top' };
    return { x: 115 + (idx - 6) * 54, y: 340, dir: 'bottom' };
  }
  if (num <= 22) { // Table 2 - Art (10 desks: 13-17 top, 18-22 bottom)
    const idx = num - 13;
    if (idx < 5) return { x: 541 + idx * 54, y: 240, dir: 'top' };
    return { x: 541 + (idx - 5) * 54, y: 340, dir: 'bottom' };
  }
  if (num <= 30) { // Table 3 - Copy (8 desks: 23-26 top, 27-30 bottom)
    const idx = num - 23;
    if (idx < 4) return { x: 968 + idx * 54, y: 240, dir: 'top' };
    return { x: 968 + (idx - 4) * 54, y: 340, dir: 'bottom' };
  }
  if (num <= 37) { // Table 4 - Production (7 desks: 31-34 top, 35-37 bottom)
    const idx = num - 31;
    if (idx < 4) return { x: 169 + idx * 54, y: 560, dir: 'top' };
    return { x: 196 + (idx - 4) * 54, y: 660, dir: 'bottom' };
  }
  if (num <= 44) { // Table 5 - Studio (7 desks: 38-41 top, 42-44 bottom)
    const idx = num - 38;
    if (idx < 4) return { x: 569 + idx * 54, y: 560, dir: 'top' };
    return { x: 596 + (idx - 4) * 54, y: 660, dir: 'bottom' };
  }
  // Table 6 - Digital & Support (12 desks: 45-56)
  const idx = num - 45;
  if (idx < 6) return { x: 915 + idx * 54, y: 560, dir: 'top' };
  return { x: 915 + (idx - 6) * 54, y: 660, dir: 'bottom' };
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
  
  const tablesConfig = [
    { id: 'Table 1', dept: 'CS', xCenter: 250, yCenter: 290, width: 324 },
    { id: 'Table 2', dept: 'Art', xCenter: 650, yCenter: 290, width: 270 },
    { id: 'Table 3', dept: 'Copy', xCenter: 1050, yCenter: 290, width: 216 },
    { id: 'Table 4', dept: 'Production', xCenter: 250, yCenter: 610, width: 216 },
    { id: 'Table 5', dept: 'Studio', xCenter: 650, yCenter: 610, width: 216 },
    { id: 'Table 6', dept: 'Digital', xCenter: 1050, yCenter: 610, width: 324 },
  ];

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
    tableText.textContent = `${getDisplayName(table.id)} (${getDeptName(table.dept)})`;
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

  // Drag-and-drop: accept a new chair dragged from the palette (admin only)
  svg.addEventListener('dragover', (e) => {
    if (!state.adminLoggedIn) return;
    if (e.dataTransfer.types.includes('application/new-chair')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      svg.style.outline = '2px dashed #6366f1';
    }
  });

  svg.addEventListener('dragleave', () => {
    svg.style.outline = '';
  });

  svg.addEventListener('drop', (e) => {
    svg.style.outline = '';
    if (!state.adminLoggedIn) return;
    if (!e.dataTransfer.types.includes('application/new-chair')) return;
    e.preventDefault();
    const { x, y } = clientToSVGCoords(svg, e.clientX, e.clientY);
    showAddDeskModal(x, y);
  });

  // Show/hide the chair palette based on admin login
  const palette = document.getElementById('chair-palette');
  if (palette) palette.classList.toggle('hidden', !state.adminLoggedIn);

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

  // For custom-placed desks show a remove option (admin only)
  if (state.adminLoggedIn && state.customSeatPositions[seatId]) {
    contentHtml += `<div style="margin-top:6px;border-top:1px solid #475569;padding-top:6px;">
      <button class="btn danger small" style="width:100%;font-size:0.75rem;" onclick="removeCustomDesk('${seatId}')">Remove Desk</button>
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
    const topCount = Math.ceil(seats.length / 2);
    const topSeats = seats.slice(0, topCount);
    const bottomSeats = seats.slice(topCount);
    const depts = [...new Set(seats.map((s) => s.department))];
    const card = document.createElement('div');
    card.className = 'table-visual-card';
    card.innerHTML = `
      <div class="table-visual-header">
        <span class="table-visual-name">${getDisplayName(tableName)}</span>
        <span class="table-visual-dept">${depts.join(' · ')}</span>
      </div>
      <div class="chairs-row chairs-top">${topSeats.map((s) => buildChairEl(s, 'top')).join('')}</div>
      <div class="table-plank"><span class="table-plank-text">${getDisplayName(tableName)}</span></div>
      <div class="chairs-row chairs-bottom">${bottomSeats.map((s) => buildChairEl(s, 'bottom')).join('')}</div>`;
    mapContainer.appendChild(card);
  });
  renderSummary();
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
  const groups = directoryGroups.map((dept) => {
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
        <h3>${getDeptName(dept)}</h3>
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
  
  document.getElementById('total-seats').textContent = total;
  document.getElementById('total-staff-count').textContent = totalStaff;
  document.getElementById('office-staff-count').textContent = inOfficeStaff;
  document.getElementById('wfh-staff-count').textContent = wfhStaff;
  document.getElementById('occupied-count').textContent = occupied;
  document.getElementById('free-count').textContent = free;
  document.getElementById('occupancy-rate').textContent = `${occupancy}%`;
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
  const nameInput    = document.getElementById('employee-name');
  const deptInput    = document.getElementById('employee-dept');
  const tableSelect  = document.getElementById('employee-table');
  const seatSelect   = document.getElementById('employee-seat');
  const wfhCheck     = document.getElementById('employee-wfh');

  const name       = nameInput.value.trim();
  const department = deptInput.value;
  const tableId    = tableSelect ? tableSelect.value : '';
  const seatId     = seatSelect.value;
  const isWfh      = wfhCheck ? wfhCheck.checked : false;

  if (!name || !department) {
    alert('Please enter name and department.');
    return;
  }

  let seatRecord = null;
  if (seatId) {
    seatRecord = state.seats.find(item => item.id === seatId);
    if (!seatRecord) { alert('Selected desk not found.'); return; }
    if (seatRecord.status !== 'free') { alert('That desk is no longer available.'); return; }
  }

  const resolvedTable = seatRecord ? seatRecord.table : (tableId || (isWfh ? 'No desk' : 'Table 7'));

  const newEmp = {
    name,
    department,
    seat: seatId || null,
    table: resolvedTable,
    checkIn: getCurrentTime(),
    wfh: isWfh,
  };

  if (seatRecord) {
    seatRecord.status = 'occupied';
    seatRecord.occupant = { name, department };
    await saveSeat(seatRecord);
  }

  const saved = await addEmployee(newEmp);
  state.employees.push({ ...saved });

  nameInput.value = '';
  document.getElementById('admin-nav-employees')?.click();

  renderFloorMap();
  renderDirectory();
  renderAdminSeats();
  renderAdminEmployees();
}

async function removeEmployee(employeeId) {
  const employee = state.employees.find((item) => item.id === employeeId);
  if (!employee) return;
  const seat = state.seats.find((item) => item.id === employee.seat);
  if (seat) { seat.status = 'free'; seat.occupant = null; await saveSeat(seat); }
  await deleteEmployee(employeeId);
  state.employees = state.employees.filter((item) => item.id !== employeeId);
  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
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
    const tableLabel = deptToTable[dept] ? ` (${getDisplayName(deptToTable[dept])})` : '';
    return `<button class="dept-btn ${activeClass}" data-dept="${dept}">${getDeptName(dept)}${tableLabel}</button>`;
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
      if (btn.id === 'admin-nav-tables') {
        renderAdminTableSettings();
      }
    });
  });
}

function populateAdminAddEmployeeFormOptions() {
  const deptSelect = document.getElementById('employee-dept');
  if (deptSelect) {
    deptSelect.innerHTML = departmentOptions.map(d =>
      `<option value="${d}">${getDeptName(d)}</option>`
    ).join('');
  }

  const tableSelect = document.getElementById('employee-table');
  if (tableSelect) {
    tableSelect.innerHTML = `<option value="">-- No Table (WFH) --</option>` +
      seatTableGroups.map(t =>
        `<option value="${t}">${getDisplayName(t)}</option>`
      ).join('');
  }

  const seatSelect = document.getElementById('employee-seat');
  if (seatSelect) {
    const freeSeats = state.seats.filter(s => s.status === 'free');
    seatSelect.innerHTML = `<option value="">-- No Fixed Desk --</option>` +
      freeSeats.map(s => `<option value="${s.id}">${s.label} (${getDisplayName(s.table)})</option>`).join('');
  }

  const wfhCheck = document.getElementById('employee-wfh');
  if (wfhCheck) wfhCheck.checked = false;
}

function renderAdminLoginState() {
  document.getElementById('admin-login-panel').classList.toggle('hidden', state.adminLoggedIn);
  document.getElementById('admin-dashboard').classList.toggle('hidden', !state.adminLoggedIn);
  const palette = document.getElementById('chair-palette');
  if (palette) palette.classList.toggle('hidden', !state.adminLoggedIn);
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
        <td>${getTableBadge(seat.table)}</td>
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
}

function getStatusColor(status) {
  if (status === 'occupied') return '#fef2f2';
  if (status === 'reserved') return '#fffbeb';
  return '#f0fdf4';
}

function getDisplayName(tableKey) {
  return state.tableNames[tableKey] || tableKey;
}

function getDeptName(dept) {
  return state.deptNames[dept] || dept;
}

function getTableBadge(table) {
  const map = {
    'Table 1': { bg: '#dbeafe', color: '#1e40af' },
    'Table 2': { bg: '#dcfce7', color: '#166534' },
    'Table 3': { bg: '#fef9c3', color: '#854d0e' },
    'Table 4': { bg: '#fce7f3', color: '#9d174d' },
    'Table 5': { bg: '#ede9fe', color: '#6b21a8' },
    'Table 6': { bg: '#ffedd5', color: '#c2410c' },
    'Table 7': { bg: '#e0f2fe', color: '#0369a1' },
  };
  const style = map[table];
  if (!style) return `<span style="color:#94a3b8;">${table || '-'}</span>`;
  return `<span style="display:inline-block;padding:2px 10px;background:${style.bg};color:${style.color};border-radius:20px;font-size:0.78rem;font-weight:700;">${getDisplayName(table)}</span>`;
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
  
  const inlineSelectStyle = 'padding:4px 8px;background:#1e293b;color:white;border:1px solid #334155;border-radius:6px;font-size:0.82rem;cursor:pointer;';

  tableBody.innerHTML = filteredEmployees.map((emp) => {
    const wfhLabel = emp.wfh ? 'WFH' : 'Office';
    const btnClass = emp.wfh ? 'success' : 'secondary';

    const deptOpts = departmentOptions.map(d =>
      `<option value="${d}" ${d === emp.department ? 'selected' : ''}>${getDeptName(d)}</option>`
    ).join('');
    const deptDropdown = `<select data-id="${emp.id}" class="admin-dept-select" style="${inlineSelectStyle}">${deptOpts}</select>`;

    const tableOpts = [`<option value="">—</option>`, ...seatTableGroups.map(t =>
      `<option value="${t}" ${t === emp.table ? 'selected' : ''}>${getDisplayName(t)}</option>`
    )].join('');
    const tableDropdown = `<select data-id="${emp.id}" class="admin-table-select" style="${inlineSelectStyle}">${tableOpts}</select>`;

    return `
      <tr>
        <td>${emp.name}</td>
        <td>${deptDropdown}</td>
        <td>${tableDropdown}</td>
        <td>${emp.seat || '<span style="color:#94a3b8;">No desk</span>'}</td>
        <td><button data-id="${emp.id}" class="btn ${btnClass} admin-wfh-toggle">${wfhLabel}</button></td>
        <td><button data-id="${emp.id}" class="btn secondary admin-edit-employee">Edit</button></td>
        <td><button data-id="${emp.id}" class="btn danger admin-remove-employee">Remove</button></td>
      </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align:center;padding:20px;">No employees found.</td></tr>';

  document.querySelectorAll('.admin-wfh-toggle').forEach((btn) => {
    btn.addEventListener('click', () => toggleWfh(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.admin-remove-employee').forEach((btn) => {
    btn.addEventListener('click', () => removeEmployee(Number(btn.dataset.id)));
  });
  
  document.querySelectorAll('.admin-dept-select').forEach((select) => {
    select.addEventListener('change', () => {
      updateEmployeeDepartment(Number(select.dataset.id), select.value);
    });
  });

  document.querySelectorAll('.admin-table-select').forEach((select) => {
    select.addEventListener('change', () => {
      const empId = Number(select.dataset.id);
      const emp = state.employees.find(e => e.id === empId);
      if (!emp) return;
      emp.table = select.value;
      emp.wfh = !select.value;
      updateEmployee(empId, { table: emp.table, wfh: emp.wfh });
      renderDirectory();
    });
  });

  document.querySelectorAll('.admin-edit-employee').forEach((btn) => {
    btn.addEventListener('click', () => openEditEmployee(Number(btn.dataset.id)));
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
        ${room.description ? `<div class="room-description">${room.description}</div>` : ''}
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

// ── Table Settings: Rename + Swap ────────────────────────────────────────────
const TABLE_PRIMARY_DEPT = {
  'Table 1': 'CS', 'Table 2': 'Art', 'Table 3': 'Copy',
  'Table 4': '', 'Table 5': 'Studio', 'Table 6': 'Digital',
  'Table 7': 'Production',
};

function renderAllAfterRename() {
  renderFloorMap();
  renderDirectory();
  renderAdminSeats();
  renderAdminEmployees();
  renderMapDepartmentButtons();
  renderAdminTeamFilters();
  renderAdminTableSettings();
}

// Called via onclick — reads ALL values before any render so nothing is lost
window.saveRowNames = function(tableKey, deptKey) {
  const c = document.getElementById('admin-tab-tables');
  if (!c) return;
  const tableVal = c.querySelector(`[data-table="${tableKey}"]`)?.value.trim();
  const deptVal  = deptKey ? c.querySelector(`[data-dept="${deptKey}"]`)?.value.trim() : '';
  if (tableVal) state.tableNames[tableKey] = tableVal;
  if (deptKey && deptVal) state.deptNames[deptKey] = deptVal;
  saveSettingToDb('tableNames', state.tableNames);
  saveSettingToDb('deptNames',  state.deptNames);
  renderAllAfterRename();
};

window.saveDeptRowName = function(deptKey) {
  const c = document.getElementById('admin-tab-tables');
  const val = c?.querySelector(`[data-dept="${deptKey}"]`)?.value.trim();
  if (!val) return;
  state.deptNames[deptKey] = val;
  saveSettingToDb('deptNames', state.deptNames);
  renderAllAfterRename();
};

// ── Add Desk via Drag-and-Drop ────────────────────────────────────────────────

function showAddDeskModal(x, y) {
  state.pendingNewDesk = { x, y };

  const existingNums = state.seats
    .map(s => parseInt(s.id.replace('Desk ', ''), 10))
    .filter(n => !isNaN(n));
  const nextNum = existingNums.length ? Math.max(...existingNums) + 1 : 57;

  document.getElementById('new-desk-label').value  = `Desk ${nextNum}`;
  document.getElementById('new-desk-id-val').value = `Desk ${nextNum}`;

  const tableSelect = document.getElementById('new-desk-table');
  tableSelect.innerHTML = seatTableGroups.map(t =>
    `<option value="${t}">${getDisplayName(t)}</option>`).join('');

  const deptSelect = document.getElementById('new-desk-dept');
  deptSelect.innerHTML = [...new Set(Object.keys(state.deptNames))].map(d =>
    `<option value="${d}">${getDeptName(d)}</option>`).join('');

  document.getElementById('add-desk-modal').classList.remove('hidden');
}

window.confirmAddDesk = async function() {
  if (!state.pendingNewDesk) return;
  const { x, y } = state.pendingNewDesk;
  const label  = document.getElementById('new-desk-label').value.trim();
  const id     = document.getElementById('new-desk-id-val').value.trim();
  const table  = document.getElementById('new-desk-table').value;
  const dept   = document.getElementById('new-desk-dept').value;
  const dir    = y < 530 ? 'top' : 'bottom';

  if (!label || !id) { alert('Desk label is required.'); return; }
  if (state.seats.find(s => s.id === id)) { alert(`ID "${id}" already exists.`); return; }

  state.customSeatPositions[id] = { x, y, dir };
  await saveSettingToDb('customSeatPositions', state.customSeatPositions);

  await insertSeat({
    id, label, floor: 'main-floor', status: 'free',
    occupant: null, department: dept, table, color: null,
  });

  document.getElementById('add-desk-modal').classList.add('hidden');
  state.pendingNewDesk = null;
  renderFloorMap();
  renderAdminSeats();
};

window.cancelAddDesk = function() {
  document.getElementById('add-desk-modal').classList.add('hidden');
  state.pendingNewDesk = null;
};

window.removeCustomDesk = async function(seatId) {
  if (!confirm(`Remove desk "${seatId}" permanently?`)) return;
  const emp = state.employees.find(e => e.seat === seatId);
  if (emp) {
    emp.seat = null; emp.table = 'No desk'; emp.wfh = true;
    await updateEmployee(emp.id, { seat: null, table: 'No desk', wfh: true });
  }
  await deleteSeat(seatId);
  document.querySelectorAll('.map-seat-popup').forEach(p => p.remove());
  renderFloorMap(); renderAdminSeats(); renderDirectory();
};

window.resetTableNames = async function() {
  if (!confirm('Reset all table names back to their defaults (Table 1, Table 2…)?')) return;
  Object.keys(state.tableNames).forEach(k => { state.tableNames[k] = k; });
  await saveSettingToDb('tableNames', state.tableNames);
  renderAllAfterRename();
};

window.resetDeptNames = async function() {
  if (!confirm('Reset all team/department names back to their defaults (CS, Art, Copy…)?')) return;
  Object.keys(state.deptNames).forEach(k => { state.deptNames[k] = k; });
  await saveSettingToDb('deptNames', state.deptNames);
  renderAllAfterRename();
};

window.resetAllNames = async function() {
  if (!confirm('Reset ALL table and team names back to their defaults?')) return;
  Object.keys(state.tableNames).forEach(k => { state.tableNames[k] = k; });
  Object.keys(state.deptNames).forEach(k => { state.deptNames[k] = k; });
  await saveSettingToDb('tableNames', state.tableNames);
  await saveSettingToDb('deptNames',  state.deptNames);
  renderAllAfterRename();
};

window.doSwapDesks = function() {
  const aId = Number(document.getElementById('swap-emp-a').value);
  const bId = Number(document.getElementById('swap-emp-b').value);
  if (!aId || !bId) { alert('Please select two employees.'); return; }
  if (aId === bId) { alert('Please select two different employees.'); return; }
  swapEmployeeDesks(aId, bId);
};

function renderAdminTableSettings() {
  const container = document.getElementById('admin-tab-tables');
  if (!container) return;

  const seatedEmps = state.employees.filter(e => e.seat && !e.wfh);
  const empOptions = seatedEmps.length
    ? seatedEmps.map(e => `<option value="${e.id}">${e.name} — ${e.seat} (${getDisplayName(e.table)})</option>`).join('')
    : '<option disabled>No employees with assigned desks</option>';

  const tableRows = seatTableGroups.map(key => {
    const deptKey = TABLE_PRIMARY_DEPT[key] || '';
    return `
    <div class="table-rename-row">
      <span class="table-rename-label">${key}</span>
      <input class="table-rename-input" data-table="${key}" type="text" value="${getDisplayName(key)}" placeholder="Table name…" />
      <input class="table-rename-input" data-dept="${deptKey}" type="text" value="${getDeptName(deptKey)}" placeholder="Team name…" />
      <button class="btn primary small" onclick="saveRowNames('${key}','${deptKey}')">Save</button>
    </div>`;
  }).join('');

  const extraDepts = ['HR', 'Finance', 'IT'];
  const extraRows = extraDepts.map(d => `
    <div class="table-rename-row">
      <span class="table-rename-label">${d}</span>
      <input class="table-rename-input" data-dept="${d}" type="text" value="${getDeptName(d)}" placeholder="${d}" />
      <button class="btn primary small" onclick="saveDeptRowName('${d}')">Save</button>
    </div>`).join('');

  container.innerHTML = `
    <div class="admin-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <h3 style="margin:0;">Rename Tables &amp; Teams</h3>
        <div style="display:flex;gap:6px;">
          <button class="btn" style="background:#e67e22;color:#fff;font-size:0.8rem;padding:4px 12px;" onclick="resetTableNames()">Reset Table</button>
          <button class="btn" style="background:#8e44ad;color:#fff;font-size:0.8rem;padding:4px 12px;" onclick="resetDeptNames()">Reset Dept</button>
          <button class="btn" style="background:#e74c3c;color:#fff;font-size:0.8rem;padding:4px 12px;" onclick="resetAllNames()">Reset All</button>
        </div>
      </div>
      <p style="color:var(--muted);font-size:0.87rem;margin:0 0 4px;">Edit the table label and its team name. Changes update the floor map, filters, and directory.</p>
      <div class="table-rename-header-row">
        <span class="table-rename-label"></span>
        <span style="flex:1;font-size:0.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;">Table Name</span>
        <span style="flex:1;font-size:0.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;">Team Name</span>
        <span style="width:60px;"></span>
      </div>
      <div class="table-rename-list">${tableRows}</div>
    </div>
    <div class="admin-card" style="margin-top:20px;">
      <h3>Support Department Names</h3>
      <p style="color:var(--muted);font-size:0.87rem;margin:0 0 12px;">Rename HR, Finance and IT team labels.</p>
      <div class="table-rename-list">${extraRows}</div>
    </div>
    <div class="admin-card" style="margin-top:20px;">
      <h3>Swap Employee Desks</h3>
      <p style="color:var(--muted);font-size:0.87rem;margin:0 0 16px;">Select two employees to instantly swap their desk and table assignments.</p>
      <div class="swap-controls">
        <select id="swap-emp-a">${empOptions}</select>
        <span class="swap-icon">⇄</span>
        <select id="swap-emp-b">${empOptions}</select>
        <button class="btn primary" onclick="doSwapDesks()">Swap Desks</button>
      </div>
    </div>`;
}

async function swapEmployeeDesks(empAId, empBId) {
  const empA = state.employees.find(e => e.id === empAId);
  const empB = state.employees.find(e => e.id === empBId);
  if (!empA?.seat || !empB?.seat) { alert('Both employees must have an assigned desk.'); return; }
  const seatA = state.seats.find(s => s.id === empA.seat);
  const seatB = state.seats.find(s => s.id === empB.seat);
  if (!seatA || !seatB) return;

  [seatA.occupant, seatB.occupant] = [{ ...seatB.occupant }, { ...seatA.occupant }];
  [empA.seat, empB.seat] = [empB.seat, empA.seat];
  [empA.table, empB.table] = [empB.table, empA.table];

  await Promise.all([
    saveSeat(seatA), saveSeat(seatB),
    updateEmployee(empAId, { seat: empA.seat, table: empA.table }),
    updateEmployee(empBId, { seat: empB.seat, table: empB.table }),
  ]);

  renderFloorMap(); renderDirectory(); renderAdminSeats(); renderAdminEmployees();
  renderAdminTableSettings();
  alert(`Swapped: ${empA.name}  ↔  ${empB.name}`);
}
window.swapEmployeeDesks = swapEmployeeDesks;

// ── Edit Employee Modal ───────────────────────────────────────────────────────
function openEditEmployee(empId) {
  const emp = state.employees.find(e => e.id === empId);
  if (!emp) return;
  state.editingEmployeeId = empId;

  document.getElementById('edit-emp-name').value = emp.name;

  const deptSelect = document.getElementById('edit-emp-dept');
  deptSelect.innerHTML = departmentOptions.map(d =>
    `<option value="${d}" ${d === emp.department ? 'selected' : ''}>${getDeptName(d)}</option>`
  ).join('');

  const tableSelect = document.getElementById('edit-emp-table');
  if (tableSelect) {
    tableSelect.innerHTML = `<option value="">-- No Table --</option>` +
      seatTableGroups.map(t =>
        `<option value="${t}" ${t === emp.table ? 'selected' : ''}>${getDisplayName(t)}</option>`
      ).join('');
  }

  const seatSelect = document.getElementById('edit-emp-seat');
  const availableSeats = state.seats.filter(s => s.status === 'free' || s.id === emp.seat);
  seatSelect.innerHTML = `<option value="">-- No Fixed Desk --</option>` +
    availableSeats.map(s =>
      `<option value="${s.id}" ${s.id === emp.seat ? 'selected' : ''}>${s.label} — ${getDisplayName(s.table)}</option>`
    ).join('');

  const wfhCheck = document.getElementById('edit-emp-wfh');
  if (wfhCheck) wfhCheck.checked = !!emp.wfh;

  document.getElementById('edit-employee-modal').classList.remove('hidden');
}
window.openEditEmployee = openEditEmployee;

async function saveEditEmployee() {
  const empId = state.editingEmployeeId;
  if (!empId) return;
  const emp = state.employees.find(e => e.id === empId);
  if (!emp) return;

  const newName   = document.getElementById('edit-emp-name').value.trim();
  const newDept   = document.getElementById('edit-emp-dept').value;
  const newTable  = document.getElementById('edit-emp-table')?.value || '';
  const newSeatId = document.getElementById('edit-emp-seat').value;
  const newWfh    = document.getElementById('edit-emp-wfh')?.checked || false;

  if (!newName) { alert('Please enter a name.'); return; }

  // Handle seat change
  if (newSeatId !== (emp.seat || '')) {
    if (emp.seat) {
      const oldSeat = state.seats.find(s => s.id === emp.seat);
      if (oldSeat) { oldSeat.status = 'free'; oldSeat.occupant = null; await saveSeat(oldSeat); }
    }
    if (newSeatId) {
      const newSeat = state.seats.find(s => s.id === newSeatId);
      if (newSeat && (newSeat.status === 'free' || newSeat.id === emp.seat)) {
        newSeat.status = 'occupied';
        newSeat.occupant = { name: newName, department: newDept };
        await saveSeat(newSeat);
        emp.seat  = newSeatId;
        emp.table = newSeat.table;
      }
    } else {
      emp.seat = null;
      // Table comes from the table dropdown if seat is cleared
      emp.table = newTable || (newWfh ? 'No desk' : 'Table 7');
    }
  } else if (emp.seat) {
    const seat = state.seats.find(s => s.id === emp.seat);
    if (seat && seat.occupant) {
      seat.occupant.name = newName;
      seat.occupant.department = newDept;
      await saveSeat(seat);
    }
  } else {
    // No seat was set before and no seat selected now — use table dropdown
    emp.table = newTable || (newWfh ? 'No desk' : emp.table || 'Table 7');
  }

  emp.name       = newName;
  emp.department = newDept;
  emp.wfh        = newWfh;

  await updateEmployee(empId, { name: emp.name, department: emp.department, seat: emp.seat, table: emp.table, wfh: emp.wfh });

  closeEditModal();
  renderFloorMap();
  renderDirectory();
  renderAdminSeats();
  renderAdminEmployees();
  renderAdminTeamFilters();
  renderMapDepartmentButtons();
}
window.saveEditEmployee = saveEditEmployee;

function closeEditModal() {
  state.editingEmployeeId = null;
  document.getElementById('edit-employee-modal').classList.add('hidden');
}
window.closeEditModal = closeEditModal;

initApp();
