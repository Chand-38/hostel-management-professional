const http = require('http');
const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DB_FILE = path.join(ROOT, 'db.json');
const EMAIL_OUTBOX_FILE = path.join(ROOT, 'email-outbox.json');
const CODE_TTL_MINUTES = 15;

const seedData = {
  hostels: [
    { id: 'h1', name: 'Main Boys Hostel', type: 'Boys', code: 'MBH', address: 'Main Campus', contact: '9876500000', wardenUserId: '3', status: 'Active' },
    { id: 'h2', name: 'Girls Hostel', type: 'Girls', code: 'GH', address: 'North Campus', contact: '9876500001', wardenUserId: '', status: 'Active' }
  ],
  students: [
    {
      id: '1',
      hostelId: 'h1',
      name: 'Raj Kumar',
      email: 'raj.kumar@example.com',
      phone: '9876543210',
      guardianName: 'Mr. Kumar',
      guardianPhone: '9876543211',
      hostelBlock: 'A',
      roomNumber: '101',
      bedNumber: '1',
      joiningDate: '2024-01-15',
      feeStatus: 'Paid',
      status: 'Active',
      photo: ''
    },
    {
      id: '2',
      hostelId: 'h2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9876543212',
      guardianName: 'Mrs. Sharma',
      guardianPhone: '9876543213',
      hostelBlock: 'B',
      roomNumber: '202',
      bedNumber: '2',
      joiningDate: '2024-02-20',
      feeStatus: 'Pending',
      status: 'Active',
      photo: ''
    },
    {
      id: '3',
      hostelId: 'h1',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '9876543214',
      guardianName: 'Mr. Patel',
      guardianPhone: '9876543215',
      hostelBlock: 'A',
      roomNumber: '103',
      bedNumber: '1',
      joiningDate: '2024-03-10',
      feeStatus: 'Paid',
      status: 'Active',
      photo: ''
    }
  ],
  rooms: [
    { id: '1', hostelId: 'h1', hostelBlock: 'A', floor: '1', roomNumber: '101', totalBeds: 4, occupiedBeds: 1, available: true },
    { id: '2', hostelId: 'h1', hostelBlock: 'A', floor: '1', roomNumber: '102', totalBeds: 4, occupiedBeds: 4, available: false },
    { id: '3', hostelId: 'h1', hostelBlock: 'A', floor: '1', roomNumber: '103', totalBeds: 4, occupiedBeds: 1, available: true },
    { id: '4', hostelId: 'h2', hostelBlock: 'B', floor: '2', roomNumber: '201', totalBeds: 3, occupiedBeds: 0, available: true },
    { id: '5', hostelId: 'h2', hostelBlock: 'B', floor: '2', roomNumber: '202', totalBeds: 3, occupiedBeds: 1, available: true },
    { id: '6', hostelId: 'h1', hostelBlock: 'C', floor: '3', roomNumber: '301', totalBeds: 2, occupiedBeds: 0, available: true }
  ],
  payments: [
    {
      id: '1',
      studentId: '1',
      studentName: 'Raj Kumar',
      amount: 15000,
      paymentDate: '2024-01-15',
      paymentMethod: 'UPI',
      status: 'Completed',
      receipt: 'RCP001'
    },
    {
      id: '2',
      studentId: '3',
      studentName: 'Amit Patel',
      amount: 15000,
      paymentDate: '2024-03-10',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      receipt: 'RCP002'
    }
  ],
  complaints: [
    {
      id: '1',
      studentId: '1',
      studentName: 'Raj Kumar',
      category: 'Maintenance',
      subject: 'AC not working',
      description: 'The air conditioner in room 101 is not cooling properly.',
      date: '2024-12-10',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Priya Sharma',
      category: 'Food',
      subject: 'Mess food quality',
      description: 'The quality of mess food needs improvement.',
      date: '2024-12-12',
      status: 'Pending',
      priority: 'Medium'
    }
  ],
  visitors: [
    {
      id: '1',
      studentId: '1',
      studentName: 'Raj Kumar',
      visitorName: 'Mr. Kumar',
      relationship: 'Father',
      phone: '9876543211',
      purpose: 'Personal Visit',
      checkIn: '2024-12-13 10:00',
      checkOut: '2024-12-13 15:00',
      date: '2024-12-13'
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Priya Sharma',
      visitorName: 'Mrs. Sharma',
      relationship: 'Mother',
      phone: '9876543213',
      purpose: 'Parent-Teacher Meeting',
      checkIn: '2024-12-12 14:00',
      checkOut: '2024-12-12 17:00',
      date: '2024-12-12'
    }
  ],
  attendance: [
    {
      id: '1',
      date: new Date().toISOString().slice(0, 10),
      studentId: '1',
      studentName: 'Raj Kumar',
      hostelBlock: 'A',
      roomNumber: '101',
      status: 'Present',
      remarks: '',
      markedBy: 'Warden Singh',
      markedAt: new Date().toISOString()
    },
    {
      id: '2',
      date: new Date().toISOString().slice(0, 10),
      studentId: '2',
      studentName: 'Priya Sharma',
      hostelBlock: 'B',
      roomNumber: '202',
      status: 'Absent',
      remarks: 'Not in hostel during roll call',
      markedBy: 'Warden Singh',
      markedAt: new Date().toISOString()
    }
  ],
  notices: [
    {
      id: '1',
      title: 'Mess timing update',
      message: 'Dinner timing is 7:30 PM to 9:30 PM from this week.',
      audience: 'All',
      priority: 'Normal',
      date: new Date().toISOString().slice(0, 10),
      createdBy: 'Admin User'
    }
  ],
  leaveRequests: [],
  roomRequests: [],
  users: [
    { id: '1', name: 'Admin User', email: 'admin@hostel.com', password: 'admin123', role: 'admin', status: 'Approved' },
    { id: '2', name: 'Raj Kumar', email: 'raj.kumar@example.com', password: 'student123', role: 'student', studentId: '1', status: 'Approved' },
    { id: '3', name: 'Warden Singh', email: 'warden@hostel.com', password: 'warden123', role: 'warden', hostelId: 'h1', status: 'Approved' }
  ]
};

function hashPassword(password) {
  return `sha256:${createHash('sha256').update(String(password)).digest('hex')}`;
}

function hashCode(code) {
  return createHash('sha256').update(String(code)).digest('hex');
}

function generateEmailCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function passwordMatches(user, password) {
  if (!user?.password) return false;
  if (String(user.password).startsWith('sha256:')) return user.password === hashPassword(password);
  return user.password === password;
}

function ensureDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2));
    return;
  }
  const db = ensureCollections(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function readDatabase() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function ensureCollections(db) {
  for (const key of ['hostels', 'attendance', 'notices', 'leaveRequests', 'roomRequests', 'authCodes']) {
    if (!Array.isArray(db[key])) db[key] = [];
  }
  if (!db.hostels.length) db.hostels = seedData.hostels;
  db.hostels = db.hostels.map(hostel => ({ type: '', ...hostel }));
  const defaultHostelId = db.hostels[0]?.id || 'h1';
  db.rooms = (db.rooms || []).map(room => ({ ...room, hostelId: room.hostelId || defaultHostelId, floor: room.floor || '' }));
  db.students = (db.students || []).map(student => ({
    ...student,
    hostelId: student.hostelId || db.rooms.find(room => room.hostelBlock === student.hostelBlock && room.roomNumber === student.roomNumber)?.hostelId || defaultHostelId,
  }));
  db.users = (db.users || []).map(user => ({ ...user, hostelId: user.hostelId || (user.role === 'warden' ? defaultHostelId : user.hostelId) }));
  return db;
}

async function sendAppEmail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || 'HostelPro <onboarding@resend.dev>';
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, text, html })
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Email provider error: ${detail}`);
    }
    return true;
  }

  const outbox = fs.existsSync(EMAIL_OUTBOX_FILE)
    ? JSON.parse(fs.readFileSync(EMAIL_OUTBOX_FILE, 'utf8'))
    : [];
  outbox.push({ to, from, subject, text, html, createdAt: new Date().toISOString() });
  fs.writeFileSync(EMAIL_OUTBOX_FILE, JSON.stringify(outbox, null, 2));
  console.log(`[email-outbox] ${subject} -> ${to}`);
  return true;
}

function saveAuthCode(db, email, purpose) {
  const code = generateEmailCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000).toISOString();
  db.authCodes = db.authCodes.filter(item => !(item.email === email && item.purpose === purpose));
  db.authCodes.push({
    id: randomUUID(),
    email,
    purpose,
    codeHash: hashCode(code),
    expiresAt,
    used: false,
    createdAt: now.toISOString()
  });
  return code;
}

function verifyAuthCode(db, email, purpose, code) {
  const record = db.authCodes
    .filter(item => item.email === email && item.purpose === purpose && !item.used)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))[0];
  if (!record) return { ok: false, message: 'Verification code not found. Please request a new code.' };
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, message: 'Verification code expired. Please request a new code.' };
  }
  if (record.codeHash !== hashCode(code)) {
    return { ok: false, message: 'Invalid verification code.' };
  }
  record.used = true;
  record.usedAt = new Date().toISOString();
  return { ok: true };
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body is too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function escapeHtml(value) {
  const text = String(value ?? '');
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDisplayDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return day && month && year ? `${day}-${month}-${year}` : value;
}

function rangeLabel(startDate, endDate) {
  if (startDate && endDate) return `${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`;
  if (startDate) return `From ${formatDisplayDate(startDate)}`;
  if (endDate) return `Until ${formatDisplayDate(endDate)}`;
  return 'All Records';
}

function filterAttendanceByRange(records, startDate, endDate) {
  return records.filter(record => {
    if (startDate && record.date < startDate) return false;
    if (endDate && record.date > endDate) return false;
    return true;
  });
}

function sendAttendanceExcel(res, records, range) {
  const headers = ['Date', 'Student Name', 'Block', 'Room', 'Status', 'Remarks', 'Marked By', 'Marked At'];
  const rows = records.map(record => [
    formatDisplayDate(record.date),
    record.studentName,
    record.hostelBlock,
    record.roomNumber,
    record.status,
    record.remarks || '',
    record.markedBy || '',
    record.markedAt || ''
  ]);
  const tableRows = [headers, ...rows]
    .map((row, index) => {
      const tag = index === 0 ? 'th' : 'td';
      return `<tr>${row.map(cell => `<${tag}>${escapeHtml(cell)}</${tag}>`).join('')}</tr>`;
    })
    .join('');
  const workbook = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    table { border-collapse: collapse; font-family: Arial, sans-serif; }
    th { background: #1e40af; color: #ffffff; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
  </style>
</head>
<body>
  <h2>Hostel Attendance - ${escapeHtml(rangeLabel(range.startDate, range.endDate))}</h2>
  <table>${tableRows}</table>
</body>
</html>`;

  res.writeHead(200, {
    'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
    'Content-Disposition': `attachment; filename="attendance-${range.startDate || 'all'}-${range.endDate || 'records'}.xls"`,
    'Cache-Control': 'no-store'
  });
  res.end(workbook);
}

function sendExcel(res, filename, title, headers, rows) {
  const tableRows = [headers, ...rows]
    .map((row, index) => {
      const tag = index === 0 ? 'th' : 'td';
      return `<tr>${row.map(cell => `<${tag}>${escapeHtml(cell)}</${tag}>`).join('')}</tr>`;
    })
    .join('');
  const workbook = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif}th{background:#1e40af;color:white}th,td{border:1px solid #cbd5e1;padding:8px 10px}</style></head><body><h2>${escapeHtml(title)}</h2><table>${tableRows}</table></body></html>`;
  res.writeHead(200, {
    'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}.xls"`,
    'Cache-Control': 'no-store'
  });
  res.end(workbook);
}

function eachDate(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate || startDate);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function syncApprovedLeaveAttendance(db, request) {
  const student = db.students.find(item => item.id === request.studentId);
  if (!student) return;
  for (const date of eachDate(request.fromDate, request.toDate)) {
    const index = db.attendance.findIndex(item => item.date === date && item.studentId === student.id);
    const record = {
      id: index >= 0 ? db.attendance[index].id : randomUUID(),
      date,
      studentId: student.id,
      studentName: student.name,
      hostelBlock: student.hostelBlock,
      roomNumber: student.roomNumber,
      status: 'Leave',
      remarks: `Approved leave: ${request.reason}`,
      markedBy: request.reviewedBy || 'Admin/Warden',
      markedAt: new Date().toISOString()
    };
    if (index >= 0) db.attendance[index] = record;
    else db.attendance.push(record);
  }
}

function attendanceForDate(db, date) {
  return db.students.filter(student => student.status !== 'Suspended').map(student => {
    const record = db.attendance.find(item => item.date === date && item.studentId === student.id);
    return record || {
      id: '',
      date,
      studentId: student.id,
      studentName: student.name,
      hostelBlock: student.hostelBlock,
      roomNumber: student.roomNumber,
      status: 'Present',
      remarks: '',
      markedBy: '',
      markedAt: ''
    };
  });
}

function routeCollection(req, res, key, pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const id = parts[2];
  const db = readDatabase();

  if (req.method === 'GET' && !id) {
    return sendJson(res, 200, db[key]);
  }

  if (req.method === 'POST' && !id) {
    return readBody(req).then(payload => {
      const item = { ...payload, id: randomUUID() };
      if (key === 'complaints') {
        item.date = new Date().toISOString().slice(0, 10);
        item.status = 'Pending';
      }
      if (key === 'visitors') {
        item.date = new Date().toISOString().slice(0, 10);
      }
      db[key].push(item);
      writeDatabase(db);
      sendJson(res, 201, item);
    });
  }

  if (req.method === 'PUT' && id) {
    return readBody(req).then(payload => {
      const index = db[key].findIndex(item => item.id === id);
      if (index === -1) return sendJson(res, 404, { message: 'Record not found' });
      db[key][index] = { ...db[key][index], ...payload, id };
      writeDatabase(db);
      sendJson(res, 200, db[key][index]);
    });
  }

  if (req.method === 'DELETE' && id) {
    db[key] = db[key].filter(item => item.id !== id);
    writeDatabase(db);
    return sendJson(res, 200, { success: true });
  }

  return sendJson(res, 405, { message: 'Method not allowed' });
}

async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});

  if (pathname === '/api/bootstrap' && req.method === 'GET') {
    const db = ensureCollections(readDatabase());
    return sendJson(res, 200, {
      ...db,
      users: db.users.map(publicUser)
    });
  }

  if (pathname === '/api/attendance' && req.method === 'GET') {
    const db = ensureCollections(readDatabase());
    const url = new URL(req.url, `http://${req.headers.host}`);
    const date = url.searchParams.get('date');
    if (date) return sendJson(res, 200, attendanceForDate(db, date));
    return sendJson(res, 200, db.attendance);
  }

  if (pathname === '/api/attendance/mark' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const date = payload.date || new Date().toISOString().slice(0, 10);
    const records = Array.isArray(payload.records) ? payload.records : [];

    const saved = records.map(record => {
      const student = db.students.find(item => item.id === record.studentId);
      const index = db.attendance.findIndex(item => item.date === date && item.studentId === record.studentId);
      const item = {
        ...(index >= 0 ? db.attendance[index] : {}),
        id: index >= 0 ? db.attendance[index].id : randomUUID(),
        date,
        studentId: record.studentId,
        studentName: student?.name || record.studentName || '',
        hostelBlock: student?.hostelBlock || record.hostelBlock || '',
        roomNumber: student?.roomNumber || record.roomNumber || '',
        status: record.status || 'Present',
        remarks: record.remarks || '',
        markedBy: payload.markedBy || 'Staff',
        markedAt: new Date().toISOString()
      };

      if (index >= 0) db.attendance[index] = item;
      else db.attendance.push(item);
      return item;
    });

    writeDatabase(db);
    return sendJson(res, 200, { success: true, records: saved });
  }

  if (pathname === '/api/attendance/export' && req.method === 'GET') {
    const db = ensureCollections(readDatabase());
    const url = new URL(req.url, `http://${req.headers.host}`);
    const date = url.searchParams.get('date');
    const startDate = url.searchParams.get('startDate') || date || '';
    const endDate = url.searchParams.get('endDate') || date || '';
    const records = date ? attendanceForDate(db, date) : filterAttendanceByRange(db.attendance, startDate, endDate);
    return sendAttendanceExcel(res, records, { startDate, endDate });
  }

  if (pathname === '/api/reports/export' && req.method === 'GET') {
    const db = ensureCollections(readDatabase());
    const url = new URL(req.url, `http://${req.headers.host}`);
    const type = url.searchParams.get('type') || 'students';
    const reports = {
      students: {
        title: 'Student List',
        headers: ['Name', 'Email', 'Phone', 'Guardian', 'Block', 'Room', 'Bed', 'Fee', 'Status'],
        rows: db.students.map(s => [s.name, s.email, s.phone, s.guardianName, s.hostelBlock, s.roomNumber, s.bedNumber, s.feeStatus, s.status || 'Active'])
      },
      payments: {
        title: 'Fee Report',
        headers: ['Date', 'Student', 'Amount', 'Method', 'Status', 'Receipt'],
        rows: db.payments.map(p => [formatDisplayDate(p.paymentDate), p.studentName, p.amount, p.paymentMethod, p.status, p.receipt])
      },
      complaints: {
        title: 'Complaint Report',
        headers: ['Date', 'Student', 'Category', 'Subject', 'Priority', 'Status', 'Staff Remark'],
        rows: db.complaints.map(c => [formatDisplayDate(c.date), c.studentName, c.category, c.subject, c.priority, c.status, c.staffRemark || ''])
      },
      visitors: {
        title: 'Visitor Log',
        headers: ['Date', 'Student', 'Visitor', 'Relationship', 'Phone', 'Purpose', 'Check In', 'Check Out'],
        rows: db.visitors.map(v => [formatDisplayDate(v.date), v.studentName, v.visitorName, v.relationship, v.phone, v.purpose, v.checkIn, v.checkOut || ''])
      }
    };
    const report = reports[type] || reports.students;
    return sendExcel(res, `${type}-report`, report.title, report.headers, report.rows);
  }

  if (pathname === '/api/payments/receipt' && req.method === 'GET') {
    const db = readDatabase();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get('id');
    const payment = db.payments.find(item => item.id === id);
    if (!payment) return sendJson(res, 404, { message: 'Receipt not found' });
    const receipt = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(payment.receipt)}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111827}.receipt{max-width:720px;margin:auto;border:1px solid #cbd5e1;padding:28px;border-radius:12px}h1{color:#1e40af}.row{display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding:10px 0}</style></head><body><div class="receipt"><h1>Hostel Fee Receipt</h1><div class="row"><strong>Receipt</strong><span>${escapeHtml(payment.receipt)}</span></div><div class="row"><strong>Student</strong><span>${escapeHtml(payment.studentName)}</span></div><div class="row"><strong>Amount</strong><span>Rs. ${escapeHtml(payment.amount)}</span></div><div class="row"><strong>Date</strong><span>${escapeHtml(formatDisplayDate(payment.paymentDate))}</span></div><div class="row"><strong>Method</strong><span>${escapeHtml(payment.paymentMethod)}</span></div><div class="row"><strong>Status</strong><span>${escapeHtml(payment.status)}</span></div></div><script>window.print()</script></body></html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(receipt);
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const user = db.users.find(entry => entry.email === payload.email);
    if (!user || !passwordMatches(user, payload.password)) {
      return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
    }
    if (user.status === 'Suspended') {
      return sendJson(res, 403, { success: false, message: 'Your account is suspended. Please contact admin.' });
    }
    if (user.status && user.status !== 'Approved') {
      return sendJson(res, 403, {
        success: false,
        message: user.status === 'Rejected'
          ? 'Your registration request was rejected by admin.'
          : 'Your account is pending admin approval.'
      });
    }
    if (user.role === 'student') {
      const student = db.students.find(entry => entry.id === user.studentId || entry.email === user.email);
      if (student?.status === 'Suspended') {
        return sendJson(res, 403, { success: false, message: 'Your student account is suspended. Please contact admin.' });
      }
    }
    return sendJson(res, 200, { success: true, user: publicUser(user) });
  }

  if (pathname === '/api/auth/send-register-code' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const email = String(payload.email || '').trim().toLowerCase();
    const name = String(payload.name || 'Student').trim();
    if (!email) return sendJson(res, 400, { success: false, message: 'Email is required' });
    if (db.users.some(user => user.email === email)) {
      return sendJson(res, 409, { success: false, message: 'Email already registered' });
    }
    const code = saveAuthCode(db, email, 'register');
    writeDatabase(db);
    await sendAppEmail({
      to: email,
      subject: 'HostelPro email verification code',
      text: `Hello ${name}, your HostelPro verification code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
      html: `<p>Hello ${escapeHtml(name)},</p><p>Your HostelPro verification code is <strong>${code}</strong>.</p><p>This code expires in ${CODE_TTL_MINUTES} minutes.</p>`
    });
    return sendJson(res, 200, { success: true, message: 'Verification code sent to your email.' });
  }

  if (pathname === '/api/auth/register' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const email = String(payload.email || '').trim().toLowerCase();
    if (db.users.some(user => user.email === email)) {
      return sendJson(res, 409, { success: false, message: 'Email already registered' });
    }
    const verified = verifyAuthCode(db, email, 'register', payload.emailCode);
    if (!verified.ok) return sendJson(res, 400, { success: false, message: verified.message });
    const user = {
      ...payload,
      id: randomUUID(),
      email,
      role: 'student',
      password: hashPassword(payload.password),
      status: 'Pending',
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      requestedAt: new Date().toISOString()
    };
    delete user.emailCode;
    db.users.push(user);
    writeDatabase(db);
    return sendJson(res, 201, {
      success: true,
      user: publicUser(user),
      message: 'Registration request submitted. Admin approval is required before login.'
    });
  }

  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const email = String(payload.email || '').trim().toLowerCase();
    const user = db.users.find(entry => entry.email === email);
    if (user) {
      const code = saveAuthCode(db, email, 'reset-password');
      writeDatabase(db);
      await sendAppEmail({
        to: email,
        subject: 'HostelPro password reset code',
        text: `Your HostelPro password reset code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
        html: `<p>Your HostelPro password reset code is <strong>${code}</strong>.</p><p>This code expires in ${CODE_TTL_MINUTES} minutes.</p>`
      });
    }
    return sendJson(res, 200, {
      success: true,
      message: 'If this email is registered, a password reset code has been sent.'
    });
  }

  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    const payload = await readBody(req);
    const db = ensureCollections(readDatabase());
    const email = String(payload.email || '').trim().toLowerCase();
    const userIndex = db.users.findIndex(entry => entry.email === email);
    if (userIndex === -1) return sendJson(res, 404, { success: false, message: 'Account not found' });
    if (!payload.password || String(payload.password).length < 6) {
      return sendJson(res, 400, { success: false, message: 'Password must be at least 6 characters.' });
    }
    const verified = verifyAuthCode(db, email, 'reset-password', payload.code);
    if (!verified.ok) return sendJson(res, 400, { success: false, message: verified.message });
    db.users[userIndex].password = hashPassword(payload.password);
    db.users[userIndex].passwordResetAt = new Date().toISOString();
    writeDatabase(db);
    await sendAppEmail({
      to: email,
      subject: 'HostelPro password changed',
      text: 'Your HostelPro password was changed successfully. If this was not you, contact the hostel administrator.',
      html: '<p>Your HostelPro password was changed successfully.</p><p>If this was not you, contact the hostel administrator.</p>'
    });
    return sendJson(res, 200, { success: true, message: 'Password reset successful. You can login now.' });
  }

  if (pathname === '/api/users' || pathname.startsWith('/api/users/')) {
    const parts = pathname.split('/').filter(Boolean);
    const id = parts[2];
    const db = ensureCollections(readDatabase());

    if (req.method === 'GET' && !id) {
      return sendJson(res, 200, db.users.map(publicUser));
    }

    if (req.method === 'POST' && !id) {
      const payload = await readBody(req);
      if (db.users.some(user => user.email === payload.email)) {
        return sendJson(res, 409, { success: false, message: 'Email already registered' });
      }
      const user = {
        id: randomUUID(),
        name: payload.name,
        email: payload.email,
        password: hashPassword(payload.password),
        role: payload.role === 'warden' ? 'warden' : 'admin',
        status: 'Approved',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      writeDatabase(db);
      return sendJson(res, 201, publicUser(user));
    }

    if (req.method === 'PUT' && id) {
      const payload = await readBody(req);
      const index = db.users.findIndex(user => user.id === id);
      if (index === -1) return sendJson(res, 404, { message: 'User not found' });
      const previousStatus = db.users[index].status;
      db.users[index] = { ...db.users[index], ...payload, id };
      writeDatabase(db);
      if (previousStatus !== 'Approved' && db.users[index].status === 'Approved') {
        try {
          await sendAppEmail({
            to: db.users[index].email,
            subject: 'HostelPro account approved',
            text: `Hello ${db.users[index].name}, your HostelPro account has been approved. You can now login.`,
            html: `<p>Hello ${escapeHtml(db.users[index].name)},</p><p>Your HostelPro account has been approved. You can now login.</p>`
          });
        } catch (error) {
          console.warn('Could not send approval email.', error.message);
        }
      }
      return sendJson(res, 200, publicUser(db.users[index]));
    }

    if (req.method === 'DELETE' && id) {
      db.users = db.users.filter(user => user.id !== id);
      writeDatabase(db);
      return sendJson(res, 200, { success: true });
    }

    return sendJson(res, 405, { message: 'Method not allowed' });
  }

  if (pathname === '/api/leaveRequests' || pathname.startsWith('/api/leaveRequests/')) {
    const parts = pathname.split('/').filter(Boolean);
    const id = parts[2];
    const db = ensureCollections(readDatabase());

    if (req.method === 'GET' && !id) return sendJson(res, 200, db.leaveRequests);
    if (req.method === 'POST' && !id) {
      const payload = await readBody(req);
      const student = db.students.find(item => item.id === payload.studentId);
      const item = {
        ...payload,
        id: randomUUID(),
        studentName: student?.name || payload.studentName || '',
        hostelBlock: student?.hostelBlock || '',
        roomNumber: student?.roomNumber || '',
        status: 'Pending',
        requestedAt: new Date().toISOString()
      };
      db.leaveRequests.push(item);
      writeDatabase(db);
      return sendJson(res, 201, item);
    }
    if (req.method === 'PUT' && id) {
      const payload = await readBody(req);
      const index = db.leaveRequests.findIndex(item => item.id === id);
      if (index === -1) return sendJson(res, 404, { message: 'Leave request not found' });
      db.leaveRequests[index] = { ...db.leaveRequests[index], ...payload, id, reviewedAt: new Date().toISOString() };
      if (db.leaveRequests[index].status === 'Approved') syncApprovedLeaveAttendance(db, db.leaveRequests[index]);
      writeDatabase(db);
      return sendJson(res, 200, db.leaveRequests[index]);
    }
    return sendJson(res, 405, { message: 'Method not allowed' });
  }

  if (pathname === '/api/roomRequests' || pathname.startsWith('/api/roomRequests/')) {
    const parts = pathname.split('/').filter(Boolean);
    const id = parts[2];
    const db = ensureCollections(readDatabase());

    if (req.method === 'GET' && !id) return sendJson(res, 200, db.roomRequests);
    if (req.method === 'POST' && !id) {
      const payload = await readBody(req);
      const student = db.students.find(item => item.id === payload.studentId);
      const item = {
        ...payload,
        id: randomUUID(),
        studentName: student?.name || payload.studentName || '',
        currentRoom: student ? `Block ${student.hostelBlock}, Room ${student.roomNumber}, Bed ${student.bedNumber}` : '',
        status: 'Pending',
        requestedAt: new Date().toISOString()
      };
      db.roomRequests.push(item);
      writeDatabase(db);
      return sendJson(res, 201, item);
    }
    if (req.method === 'PUT' && id) {
      const payload = await readBody(req);
      const index = db.roomRequests.findIndex(item => item.id === id);
      if (index === -1) return sendJson(res, 404, { message: 'Room request not found' });
      db.roomRequests[index] = { ...db.roomRequests[index], ...payload, id, reviewedAt: new Date().toISOString() };
      if (db.roomRequests[index].status === 'Approved') {
        const studentIndex = db.students.findIndex(item => item.id === db.roomRequests[index].studentId);
        if (studentIndex >= 0) {
          db.students[studentIndex] = {
            ...db.students[studentIndex],
            hostelBlock: db.roomRequests[index].preferredBlock || db.students[studentIndex].hostelBlock,
            roomNumber: db.roomRequests[index].preferredRoom || db.students[studentIndex].roomNumber,
            bedNumber: db.roomRequests[index].preferredBed || db.students[studentIndex].bedNumber
          };
        }
      }
      writeDatabase(db);
      return sendJson(res, 200, db.roomRequests[index]);
    }
    return sendJson(res, 405, { message: 'Method not allowed' });
  }

  for (const key of ['hostels', 'students', 'rooms', 'payments', 'complaints', 'visitors', 'attendance', 'notices']) {
    if (pathname === `/api/${key}` || pathname.startsWith(`/api/${key}/`)) {
      return routeCollection(req, res, key, pathname);
    }
  }

  return sendJson(res, 404, { message: 'API route not found' });
}

function serveStatic(req, res, pathname) {
  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT, safePath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    };

    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url.pathname).catch(error => {
      sendJson(res, 500, { message: error.message || 'Server error' });
    });
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
  ensureDatabase();
  console.log(`Hostel Management System running at http://localhost:${PORT}`);
});
