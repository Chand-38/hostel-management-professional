// ========================================
// Hostel Management System - Main App
// ========================================

class App {
    constructor() {
        this.currentPage = '';
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.router());
        this.router();
    }

    roleConfig(role) {
        const configs = {
            admin: {
                label: 'Administrator',
                home: '/dashboard',
                routes: ['dashboard', 'hostels', 'notices', 'students', 'rooms', 'attendance', 'fees', 'complaints', 'leave', 'room-requests', 'visitors', 'reports', 'users', 'about'],
                description: 'Full control over hostel records, finance, rooms, attendance, complaints, visitors, and users.'
            },
            warden: {
                label: 'Warden',
                home: '/dashboard',
                routes: ['dashboard', 'hostels', 'notices', 'students', 'rooms', 'attendance', 'complaints', 'leave', 'room-requests', 'visitors', 'reports', 'about'],
                description: 'Manage day-to-day hostel operations, students, rooms, attendance, complaints, and visitor movement.'
            },
            student: {
                label: 'Student',
                home: '/dashboard',
                routes: ['dashboard', 'notices', 'profile', 'attendance', 'fees', 'complaints', 'leave', 'room-requests', 'visitors', 'about'],
                description: 'View personal hostel details, attendance, fee status, complaints, and visitor records.'
            }
        };

        return configs[role] || configs.student;
    }

    navItems(user) {
        const allItems = [
            { route: 'dashboard', label: 'Dashboard', icon: 'DB' },
            { route: 'hostels', label: 'Hostels', icon: 'HS' },
            { route: 'notices', label: 'Notices', icon: 'NT' },
            { route: 'profile', label: 'My Profile', icon: 'ME' },
            { route: 'students', label: 'Students', icon: 'ST' },
            { route: 'rooms', label: 'Rooms', icon: 'RM' },
            { route: 'attendance', label: 'Attendance', icon: 'AT' },
            { route: 'fees', label: user.role === 'student' ? 'My Fees' : 'Fees', icon: 'FE' },
            { route: 'complaints', label: 'Complaints', icon: 'CP' },
            { route: 'leave', label: 'Leave Requests', icon: 'LV' },
            { route: 'room-requests', label: 'Room Requests', icon: 'RR' },
            { route: 'visitors', label: 'Visitors', icon: 'VS' },
            { route: 'reports', label: 'Reports', icon: 'RP' },
            { route: 'users', label: 'Users', icon: 'US' },
            { route: 'about', label: 'About', icon: 'AB' }
        ];

        const allowed = this.roleConfig(user.role).routes;
        return allItems.filter(item => allowed.includes(item.route));
    }

    requestAlertBadge(route, user) {
        if (!['admin', 'warden'].includes(user.role)) return '';

        const requestMap = {
            leave: dataStore.getLeaveRequests(),
            'room-requests': dataStore.getRoomRequests(),
            fees: dataStore.getPayments()
        };
        const requests = requestMap[route];
        if (!requests) return '';

        const pendingCount = requests.filter(request => (request.status || 'Pending') === 'Pending' && this.isInHostelScope(request)).length;
        if (!pendingCount) return '';

        return `<span class="nav-alert-badge" aria-label="${pendingCount} pending requests">${pendingCount}</span>`;
    }

    canAccess(route) {
        if (route === 'login' || route === 'register' || route === 'forgot-password') return true;
        const user = authManager.getCurrentUser();
        return user && this.roleConfig(user.role).routes.includes(route);
    }

    router() {
        const hash = window.location.hash.slice(1) || '/login';
        const route = hash.split('/')[1] || 'login';
        const user = authManager.getCurrentUser();

        if (route !== 'login' && route !== 'register' && route !== 'forgot-password' && !user) {
            window.location.hash = '#/login';
            return;
        }

        if ((route === 'login' || route === 'register' || route === 'forgot-password') && user) {
            window.location.hash = '#/dashboard';
            return;
        }

        if (user && !this.canAccess(route)) {
            window.location.hash = '#/dashboard';
            return;
        }

        this.currentPage = route;
        this.render();
    }

    render() {
        const appContainer = document.getElementById('app');

        if (this.currentPage === 'login') {
            appContainer.innerHTML = this.getLoginPage();
            this.attachLoginHandlers();
            return;
        }

        if (this.currentPage === 'register') {
            appContainer.innerHTML = this.getRegisterPage();
            this.attachRegisterHandlers();
            return;
        }

        if (this.currentPage === 'forgot-password') {
            appContainer.innerHTML = this.getForgotPasswordPage();
            this.attachForgotPasswordHandlers();
            return;
        }

        appContainer.innerHTML = this.getAppLayout();
        this.attachNavHandlers();

        const loaders = {
            dashboard: () => this.loadDashboard(),
            hostels: () => this.loadHostels(),
            notices: () => this.loadNotices(),
            profile: () => this.loadProfile(),
            students: () => this.loadStudents(),
            rooms: () => this.loadRooms(),
            attendance: () => this.loadAttendance(),
            fees: () => this.loadFees(),
            complaints: () => this.loadComplaints(),
            leave: () => this.loadLeaveRequests(),
            'room-requests': () => this.loadRoomRequests(),
            visitors: () => this.loadVisitors(),
            reports: () => this.loadReports(),
            users: () => this.loadUsers(),
            about: () => this.loadAbout()
        };

        (loaders[this.currentPage] || loaders.dashboard)();
    }

    getLoginPage() {
        return `
      <div class="auth-shell">
        <section class="auth-panel">
          <div class="auth-brand">
            <div class="brand-mark">HMS</div>
            <div>
              <h1>Hostel Management System</h1>
              <p>Run daily hostel operations with separate workspaces for administrators, wardens, and students.</p>
            </div>
          </div>

          <div class="auth-highlights">
            <div><strong>Admin</strong><span>Students, fees, rooms, users</span></div>
            <div><strong>Warden</strong><span>Rooms, visitors, complaints</span></div>
            <div><strong>Student</strong><span>Profile, fees, personal records</span></div>
          </div>
        </section>

        <section class="auth-card professional-auth-card">
          <div class="auth-card-brand">
            <div class="auth-card-mark">HP</div>
            <div>
              <strong>HostelPro</strong>
              <span>Secure Management Console</span>
            </div>
          </div>

          <div class="auth-header">
            <h2 class="auth-title login-title">Login</h2>
            <p class="auth-subtitle">Use credentials issued by the hostel office to continue.</p>
          </div>

          <form id="loginForm">
            <div class="form-group auth-field">
              <label class="form-label">Email address</label>
              <div class="line-input">
                <input type="email" id="loginEmail" placeholder="name@example.com" required>
                <span>@</span>
              </div>
            </div>

            <div class="form-group auth-field">
              <label class="form-label">Password</label>
              <div class="line-input">
                <input type="password" id="loginPassword" placeholder="Enter password" required>
                <button type="button" id="togglePassword" aria-label="Show password">Show</button>
              </div>
            </div>

            <div class="login-options">
              <label class="remember-me">
                <input type="checkbox" id="rememberMe">
                <span>Remember me</span>
              </label>
              <a href="#/forgot-password">Forgot Password?</a>
            </div>

            <div id="loginError" class="alert-danger hidden"></div>

            <button type="submit" class="btn btn-primary btn-block">Sign in</button>

            <p class="register-row">
              Don't have an account?
              <a href="#/register">Register</a>
            </p>
          </form>
        </section>
      </div>
    `;
    }

    getRegisterPage() {
        return `
      <div class="auth-shell">
        <section class="auth-card professional-auth-card">
          <div class="auth-header">
            <div class="auth-kicker">New account</div>
            <h2 class="auth-title">Create Account</h2>
            <p class="auth-subtitle">Submit a student access request. Admin approval is required before login.</p>
          </div>

          <form id="registerForm">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="regName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" id="regEmail" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="regPassword" required>
            </div>
            <div class="form-row auth-code-row">
              <div class="form-group">
                <label class="form-label">Email Verification Code</label>
                <input type="text" class="form-control" id="regEmailCode" inputmode="numeric" maxlength="6" placeholder="6-digit code" required>
              </div>
              <div class="form-group code-action-group">
                <label class="form-label">Verification</label>
                <button type="button" class="btn btn-outline btn-block" id="sendRegisterCode">Send Code</button>
              </div>
            </div>
            <div class="approval-note">
              First verify your email. After submitting, your student request goes to the admin dashboard for approval.
            </div>
            <div id="registerError" class="alert-danger hidden"></div>
            <button type="submit" class="btn btn-primary btn-block">Send Request</button>
          </form>
          <p class="text-center mt-3"><a href="#/login" class="text-primary">Back to login</a></p>
        </section>
      </div>
    `;
    }

    getForgotPasswordPage() {
        return `
      <div class="auth-shell">
        <section class="auth-card professional-auth-card">
          <div class="auth-header">
            <div class="auth-kicker">Account recovery</div>
            <h2 class="auth-title">Reset Password</h2>
            <p class="auth-subtitle">Enter your email, get a verification code, then set a new password.</p>
          </div>

          <form id="forgotPasswordForm">
            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" id="resetEmail" placeholder="name@example.com" required>
            </div>
            <button type="button" class="btn btn-outline btn-block" id="sendResetCode">Send Reset Code</button>
            <div class="form-row auth-code-row">
              <div class="form-group">
                <label class="form-label">Reset Code</label>
                <input type="text" class="form-control" id="resetCode" inputmode="numeric" maxlength="6" placeholder="6-digit code" required>
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-control" id="newPassword" minlength="6" required>
              </div>
            </div>
            <div id="forgotMessage" class="success-note hidden"></div>
            <div id="forgotError" class="alert-danger hidden"></div>
            <button type="submit" class="btn btn-primary btn-block">Reset Password</button>
          </form>
          <p class="text-center mt-3"><a href="#/login" class="text-primary">Back to login</a></p>
        </section>
      </div>
    `;
    }

    getAppLayout() {
        const user = authManager.getCurrentUser();
        const config = this.roleConfig(user.role);
        const nav = this.navItems(user);

        return `
      <div class="app-container pro-app">
        <div class="mobile-backdrop" id="mobileBackdrop"></div>
        <aside class="sidebar pro-sidebar">
          <div class="sidebar-header pro-sidebar-header">
            <div class="logo pro-logo">
              <span class="logo-icon text-logo">HM</span>
              <span>HostelPro</span>
            </div>
            <button class="icon-btn sidebar-close" id="sidebarClose" aria-label="Close navigation">Close</button>
            <p>${config.label} workspace</p>
          </div>

          <nav aria-label="Main navigation">
            <ul class="nav-menu">
              ${nav.map(item => `
                <li class="nav-item">
                  <a href="#/${item.route}" class="nav-link ${this.currentPage === item.route ? 'active' : ''}">
                    <span class="nav-icon text-nav-icon">${item.icon}</span>
                    <span>${item.label}</span>
                    ${this.requestAlertBadge(item.route, user)}
                  </a>
                </li>
              `).join('')}
            </ul>
          </nav>

          <div class="access-card">
            <strong>${config.label} access</strong>
            <p>${config.description}</p>
          </div>

          <div class="sidebar-footer">
            <div class="user-profile">
              <div class="user-avatar">${this.initials(user.name)}</div>
              <div class="user-info">
                <h4>${user.name}</h4>
                <p>${config.label}</p>
              </div>
            </div>
            <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>
          </div>
        </aside>

        <main class="main-content">
          <header class="mobile-topbar">
            <button class="icon-btn menu-toggle" id="menuToggle" aria-label="Open navigation">Menu</button>
            <div>
              <strong>HostelPro</strong>
              <span>${this.currentPage.replace('-', ' ')} | ${config.label}</span>
            </div>
          </header>
          <div id="mainContent"></div>
        </main>
      </div>
    `;
    }

    initials(name = '') {
        return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
    }

    formatCurrency(amount) {
        return `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`;
    }

    formatDate(value) {
        if (!value) return '';
        const [year, month, day] = String(value).slice(0, 10).split('-');
        return day && month && year ? `${day}-${month}-${year}` : value;
    }

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            if (!file) return resolve('');
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Unable to read receipt file'));
            reader.readAsDataURL(file);
        });
    }

    addMonths(date, months) {
        const copy = new Date(date);
        copy.setMonth(copy.getMonth() + months);
        return copy;
    }

    isoDate(date) {
        return date.toISOString().slice(0, 10);
    }

    attendanceExportUrl() {
        const mode = document.getElementById('exportRange')?.value || 'today';
        const selectedDate = document.getElementById('attendanceDate')?.value || this.isoDate(new Date());
        const today = new Date();
        let startDate = selectedDate;
        let endDate = selectedDate;

        if (mode === 'month') {
            endDate = this.isoDate(today);
            startDate = this.isoDate(this.addMonths(today, -1));
        } else if (mode === 'six-months') {
            endDate = this.isoDate(today);
            startDate = this.isoDate(this.addMonths(today, -6));
        } else if (mode === 'custom') {
            startDate = document.getElementById('exportStartDate')?.value || selectedDate;
            endDate = document.getElementById('exportEndDate')?.value || selectedDate;
        }

        return `/api/attendance/export?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    }

    getCurrentStudent() {
        const user = authManager.getCurrentUser();
        return dataStore.getStudents().find(student => student.id === user.studentId || student.email === user.email);
    }

    currentHostelId() {
        const user = authManager.getCurrentUser();
        if (!user) return '';
        if (user.role === 'student') return this.getCurrentStudent()?.hostelId || user.hostelId || '';
        if (user.role === 'warden') {
            const latestUser = dataStore.getUsers().find(item => item.id === user.id || item.email === user.email);
            return user.hostelId || latestUser?.hostelId || '';
        }
        return '';
    }

    getHostelName(hostelId) {
        return dataStore.getHostelById(hostelId)?.name || 'Unassigned hostel';
    }

    visibleHostels() {
        const user = authManager.getCurrentUser();
        const hostels = dataStore.getHostels();
        if (user.role === 'admin') return hostels;
        const hostelId = this.currentHostelId();
        return hostelId ? hostels.filter(hostel => hostel.id === hostelId) : hostels;
    }

    visibleStudents() {
        const students = dataStore.getStudents();
        const hostelId = this.currentHostelId();
        return hostelId ? students.filter(student => student.hostelId === hostelId) : students;
    }

    visibleRooms() {
        const rooms = dataStore.getRooms();
        const hostelId = this.currentHostelId();
        return hostelId ? rooms.filter(room => room.hostelId === hostelId) : rooms;
    }

    isInHostelScope(item) {
        const hostelId = this.currentHostelId();
        if (!hostelId) return true;
        if (item.hostelId) return item.hostelId === hostelId;
        const student = dataStore.getStudentById(item.studentId);
        return student?.hostelId === hostelId;
    }

    profilePhoto(student) {
        return student?.photo
            ? `<img src="${student.photo}" alt="${student.name} profile photo">`
            : `<span>${this.initials(student?.name || authManager.getCurrentUser()?.name)}</span>`;
    }

    visibleComplaints() {
        const user = authManager.getCurrentUser();
        const complaints = dataStore.getComplaints();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return complaints.filter(complaint => complaint.studentId === student?.id || complaint.studentName === user.name);
        }
        return complaints.filter(complaint => this.isInHostelScope(complaint));
    }

    visibleVisitors() {
        const user = authManager.getCurrentUser();
        const visitors = dataStore.getVisitors();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return visitors.filter(visitor => visitor.studentId === student?.id || visitor.studentName === user.name);
        }
        return visitors.filter(visitor => this.isInHostelScope(visitor));
    }

    visiblePayments() {
        const user = authManager.getCurrentUser();
        const payments = dataStore.getPayments();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return payments.filter(payment => payment.studentId === student?.id || payment.studentName === user.name);
        }
        return payments.filter(payment => this.isInHostelScope(payment));
    }

    visibleAttendance() {
        const user = authManager.getCurrentUser();
        const attendance = dataStore.getAttendance();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return attendance.filter(record => record.studentId === student?.id || record.studentName === user.name);
        }
        return attendance.filter(record => this.isInHostelScope(record));
    }

    visibleLeaveRequests() {
        const user = authManager.getCurrentUser();
        const requests = dataStore.getLeaveRequests();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return requests.filter(request => request.studentId === student?.id || request.studentName === user.name);
        }
        return requests.filter(request => this.isInHostelScope(request));
    }

    visibleRoomRequests() {
        const user = authManager.getCurrentUser();
        const requests = dataStore.getRoomRequests();
        if (user.role === 'student') {
            const student = this.getCurrentStudent();
            return requests.filter(request => request.studentId === student?.id || request.studentName === user.name);
        }
        return requests.filter(request => this.isInHostelScope(request));
    }

    visibleNotices() {
        const user = authManager.getCurrentUser();
        return dataStore.getNotices()
            .filter(notice => notice.audience === 'All' || notice.audience?.toLowerCase() === user.role)
            .sort((a, b) => b.date.localeCompare(a.date));
    }

    pageHeader(title, subtitle, actionHtml = '') {
        return `
      <div class="page-header">
        <div>
          <p class="page-eyebrow">HostelPro workspace</p>
          <h1 class="page-title">${title}</h1>
          <p>${subtitle}</p>
        </div>
        ${actionHtml ? `<div class="page-actions">${actionHtml}</div>` : ''}
      </div>
    `;
    }

    emptyState(title, message) {
        return `
      <div class="empty-state">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
    `;
    }

    loadDashboard() {
        const user = authManager.getCurrentUser();
        if (user.role === 'student') {
            this.loadStudentDashboard();
            return;
        }

        const rooms = this.visibleRooms();
        const students = this.visibleStudents();
        const complaints = this.visibleComplaints();
        const payments = this.visiblePayments();
        const visitors = this.visibleVisitors();
        const totalBeds = rooms.reduce((sum, room) => sum + Number(room.totalBeds || 0), 0);
        const occupiedBeds = rooms.reduce((sum, room) => sum + Number(room.occupiedBeds || 0), 0);
        const stats = {
            totalStudents: students.length,
            totalBeds,
            occupiedBeds,
            availableBeds: totalBeds - occupiedBeds,
            pendingComplaints: complaints.filter(complaint => complaint.status === 'Pending').length,
            monthlyRevenue: payments
                .filter(payment => {
                    const paymentDate = new Date(payment.paymentDate);
                    const now = new Date();
                    return ['Approved', 'Completed'].includes(payment.status) && paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
                })
                .reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
        };
        const fullRooms = rooms.filter(room => !room.available).length;
        const pendingComplaints = complaints.filter(complaint => complaint.status === 'Pending');
        const recentPayments = payments.slice(-3).reverse();

        const financeCard = user.role === 'admin'
            ? `<div class="stat-card">
                <div class="stat-meta">Monthly Collection</div>
                <div class="stat-value">${this.formatCurrency(stats.monthlyRevenue)}</div>
                <div class="stat-change positive">Finance module enabled</div>
              </div>`
            : `<div class="stat-card">
                <div class="stat-meta">Visitor Records</div>
                <div class="stat-value">${visitors.length}</div>
                <div class="stat-change">Operations view</div>
              </div>`;

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            `${this.roleConfig(user.role).label} Dashboard`,
            'Monitor occupancy, student records, complaints, and operational activity from one place.'
        )}

        <section class="hero-panel">
          <div>
            <span class="status-pill">Live project mode</span>
            <h2>Welcome back, ${user.name}</h2>
            <p>${this.roleConfig(user.role).description}</p>
          </div>
          <div class="hero-metrics">
            <div><strong>${stats.totalStudents}</strong><span>Students</span></div>
            <div><strong>${stats.availableBeds}</strong><span>Beds free</span></div>
            <div><strong>${stats.pendingComplaints}</strong><span>Pending issues</span></div>
          </div>
        </section>

        <div class="stat-cards pro-stats">
          <div class="stat-card">
            <div class="stat-meta">Total Students</div>
            <div class="stat-value">${stats.totalStudents}</div>
            <div class="stat-change positive">Active records</div>
          </div>
          <div class="stat-card">
            <div class="stat-meta">Available Beds</div>
            <div class="stat-value">${stats.availableBeds}</div>
            <div class="stat-change">${stats.occupiedBeds} occupied of ${stats.totalBeds}</div>
          </div>
          <div class="stat-card">
            <div class="stat-meta">Full Rooms</div>
            <div class="stat-value">${fullRooms}</div>
            <div class="stat-change">Capacity watch</div>
          </div>
          ${financeCard}
        </div>

        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Pending Complaints</h3>
              <a href="#/complaints" class="btn btn-outline btn-sm">View all</a>
            </div>
            ${pendingComplaints.length ? `
              <div class="activity-list">
                ${pendingComplaints.slice(0, 5).map(complaint => `
                  <div class="activity-item">
                    <div>
                      <strong>${complaint.subject}</strong>
                      <span>${complaint.studentName} - ${complaint.category}</span>
                    </div>
                    <span class="badge ${this.priorityBadge(complaint.priority)}">${complaint.priority}</span>
                  </div>
                `).join('')}
              </div>
            ` : this.emptyState('No pending complaints', 'All student issues are currently handled.')}
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${user.role === 'admin' ? 'Recent Payments' : 'Room Capacity'}</h3>
            </div>
            ${user.role === 'admin' ? this.recentPaymentList(recentPayments) : this.roomCapacityList(rooms)}
          </div>
        </div>
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
    }

    loadStudentDashboard() {
        const user = authManager.getCurrentUser();
        const student = this.getCurrentStudent();
        const complaints = this.visibleComplaints();
        const payments = this.visiblePayments();
        const visitors = this.visibleVisitors();
        const latestPayment = payments[payments.length - 1];

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Student Dashboard', 'Your personal hostel profile, payments, complaints, and visitor updates.')}

        <section class="hero-panel student-hero">
          <div>
            <span class="status-pill">Student portal</span>
            <h2>Hello, ${user.name}</h2>
            <p>Room ${student?.roomNumber || 'Not assigned'}, Block ${student?.hostelBlock || '-'} - Bed ${student?.bedNumber || '-'}</p>
          </div>
          <div class="hero-metrics">
            <div><strong>${student?.feeStatus || 'NA'}</strong><span>Fee status</span></div>
            <div><strong>${complaints.length}</strong><span>Complaints</span></div>
            <div><strong>${visitors.length}</strong><span>Visitors</span></div>
          </div>
        </section>

        <div class="dashboard-grid">
          <div class="card profile-card">
            <div class="card-header">
              <h3 class="card-title">My Hostel Details</h3>
              <a href="#/profile" class="btn btn-outline btn-sm">Open profile</a>
            </div>
            ${this.studentProfileSummary(student)}
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Latest Payment</h3>
              <a href="#/fees" class="btn btn-outline btn-sm">View fees</a>
            </div>
            ${latestPayment ? `
              <div class="record-card">
                <strong>${this.formatCurrency(latestPayment.amount)}</strong>
                <span>${latestPayment.receipt} - ${latestPayment.paymentMethod}</span>
                <span>${new Date(latestPayment.paymentDate).toLocaleDateString()}</span>
              </div>
            ` : this.emptyState('No payment found', 'Payment records will appear here after the office records them.')}
          </div>
        </div>
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
    }

    loadHostels() {
        const user = authManager.getCurrentUser();
        const hostels = this.visibleHostels();
        const rooms = this.visibleRooms();
        const students = this.visibleStudents();
        const wardens = dataStore.getUsers().filter(item => item.role === 'warden');
        const canManage = user.role === 'admin';

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            'Hostels',
            canManage ? 'Create hostels, assign wardens, and map rooms to each property.' : 'View the hostel assigned to your workspace.',
            canManage ? '<button class="btn btn-primary" id="addHostelBtn">Add Hostel</button>' : ''
        )}
        <div class="dashboard-grid">
          ${hostels.map(hostel => {
              const hostelRooms = rooms.filter(room => room.hostelId === hostel.id);
              const hostelStudents = students.filter(student => student.hostelId === hostel.id);
              const totalBeds = hostelRooms.reduce((sum, room) => sum + Number(room.totalBeds || 0), 0);
              const occupiedBeds = hostelRooms.reduce((sum, room) => sum + Number(room.occupiedBeds || 0), 0);
              const warden = wardens.find(item => item.id === hostel.wardenUserId || item.hostelId === hostel.id);
              return `
                <div class="card hostel-card">
                  <div class="card-header">
                    <div>
                      <h3 class="card-title">${hostel.name}</h3>
                      <span class="muted-cell">${hostel.type || 'General'} | ${hostel.code || 'No code'} | ${hostel.address || 'No address'}</span>
                    </div>
                    <span class="badge ${hostel.status === 'Active' ? 'badge-success' : 'badge-warning'}">${hostel.status || 'Active'}</span>
                  </div>
                  <div class="hero-metrics">
                    <div><strong>${hostelStudents.length}</strong><span>Students</span></div>
                    <div><strong>${hostelRooms.length}</strong><span>Rooms</span></div>
                    <div><strong>${Math.max(totalBeds - occupiedBeds, 0)}</strong><span>Free beds</span></div>
                  </div>
                  <p class="mt-2">Warden: <strong>${warden?.name || 'Not assigned'}</strong></p>
                  <p>Contact: ${hostel.contact || '-'}</p>
                  ${canManage ? `<div class="table-actions"><button class="btn btn-sm btn-secondary" onclick="app.editHostel('${hostel.id}')">Edit</button><button class="btn btn-sm btn-danger" onclick="app.deleteHostel('${hostel.id}')">Delete</button></div>` : ''}
                </div>
              `;
          }).join('')}
        </div>
        ${hostels.length ? '' : this.emptyState('No hostels found', 'Add the first hostel to start mapping rooms.')}
        ${this.hostelModal()}
      </div>`;

        document.getElementById('mainContent').innerHTML = content;
        this.attachHostelHandlers();
    }

    hostelModal() {
        const wardens = dataStore.getUsers().filter(user => user.role === 'warden');
        return `
      <div class="modal" id="hostelModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="hostelModalTitle">Add Hostel</h3>
            <button class="modal-close" id="closeHostelModal">x</button>
          </div>
          <div class="modal-body">
            <form id="hostelForm">
              <input type="hidden" id="hostelId">
              <div class="form-row">
                <div class="form-group"><label class="form-label">Hostel Name *</label><input type="text" class="form-control" id="hostelName" required></div>
                <div class="form-group"><label class="form-label">Code</label><input type="text" class="form-control" id="hostelCode"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Hostel Type</label><input type="text" class="form-control" id="hostelType" placeholder="Boys, Girls, Couple, Staff"></div>
                <div class="form-group"><label class="form-label">Address / Location</label><input type="text" class="form-control" id="hostelAddress" placeholder="Optional"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Contact</label><input type="tel" class="form-control" id="hostelContact"></div>
                <div class="form-group"><label class="form-label">Assigned Warden</label><select class="form-control" id="hostelWarden"><option value="">Not assigned</option>${wardens.map(warden => `<option value="${warden.id}">${warden.name}</option>`).join('')}</select></div>
              </div>
              <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="hostelStatus"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelHostelForm">Cancel</button>
            <button class="btn btn-primary" id="saveHostel">Save Hostel</button>
          </div>
        </div>
      </div>`;
    }

    recentPaymentList(payments) {
        if (!payments.length) return this.emptyState('No payments recorded', 'New fee payments will appear here.');
        return `
      <div class="activity-list">
        ${payments.map(payment => `
          <div class="activity-item">
            <div>
              <strong>${payment.studentName}</strong>
              <span>${payment.receipt} - ${new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
            <strong>${this.formatCurrency(payment.amount)}</strong>
          </div>
        `).join('')}
      </div>
    `;
    }

    roomCapacityList(rooms) {
        return `
      <div class="activity-list">
        ${rooms.slice(0, 5).map(room => `
          <div class="activity-item">
            <div>
              <strong>Block ${room.hostelBlock} - Room ${room.roomNumber}</strong>
              <span>${room.occupiedBeds}/${room.totalBeds} beds occupied</span>
            </div>
            <span class="badge ${room.available ? 'badge-success' : 'badge-danger'}">${room.available ? 'Available' : 'Full'}</span>
          </div>
        `).join('')}
      </div>
    `;
    }

    loadProfile() {
        const user = authManager.getCurrentUser();
        const student = this.getCurrentStudent();
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('My Profile', 'Complete your personal hostel record and profile photo.')}
        <div class="card profile-card">
          ${student ? this.studentProfileSummary(student, true) : this.emptyState('Profile not completed', 'Fill the form below to create your hostel profile.')}
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profile Details</h3>
          </div>
          <form id="profileForm">
            <div class="profile-edit-grid">
              <div class="profile-photo-uploader">
                <div class="profile-avatar large" id="profilePreview">${this.profilePhoto(student || { name: user.name })}</div>
                <label class="btn btn-outline btn-sm">
                  Upload Photo
                  <input type="file" id="profilePhoto" accept="image/*" hidden>
                </label>
                <input type="hidden" id="profilePhotoData" value="${student?.photo || ''}">
              </div>
              <div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-control" id="profileName" value="${student?.name || user.name || ''}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" id="profileEmail" value="${student?.email || user.email || ''}" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Phone *</label>
                    <input type="tel" class="form-control" id="profilePhone" value="${student?.phone || ''}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Guardian Name *</label>
                    <input type="text" class="form-control" id="profileGuardianName" value="${student?.guardianName || ''}" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Guardian Phone *</label>
                    <input type="tel" class="form-control" id="profileGuardianPhone" value="${student?.guardianPhone || ''}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Joining Date *</label>
                    <input type="date" class="form-control" id="profileJoiningDate" value="${student?.joiningDate || new Date().toISOString().slice(0, 10)}" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Hostel Block</label>
                    <input type="text" class="form-control" value="${student?.hostelBlock || 'Office will assign'}" disabled>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Room / Bed</label>
                    <input type="text" class="form-control" value="${student ? `Room ${student.roomNumber}, Bed ${student.bedNumber}` : 'Office will assign'}" disabled>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">Save Profile</button>
                <div id="profileMessage" class="success-note hidden">Profile saved successfully.</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
        document.getElementById('mainContent').innerHTML = content;
        this.attachProfileHandlers();
    }

    studentProfileSummary(student, expanded = false) {
        if (!student) return this.emptyState('Student record unavailable', 'No matching student profile was found.');
        const rows = [
            ['Full Name', student.name],
            ['Email', student.email],
            ['Phone', student.phone],
            ['Guardian', student.guardianName],
            ['Guardian Phone', student.guardianPhone],
            ['Block / Room / Bed', `Block ${student.hostelBlock}, Room ${student.roomNumber}, Bed ${student.bedNumber}`],
            ['Joining Date', new Date(student.joiningDate).toLocaleDateString()],
            ['Fee Status', student.feeStatus]
        ];

        return `
      <div class="student-profile">
        <div class="profile-avatar">${this.profilePhoto(student)}</div>
        <div class="profile-details ${expanded ? 'expanded' : ''}">
          ${rows.map(([label, value]) => `
            <div>
              <span>${label}</span>
              <strong>${value || '-'}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }

    loadStudents() {
        const students = this.visibleStudents();
        const user = authManager.getCurrentUser();
        const canManage = user.role === 'admin' || user.role === 'warden';

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            'Student Management',
            'Maintain student profiles, guardians, room assignments, and fee status.',
            `${canManage ? '<button class="btn btn-primary" id="addStudentBtn">Add Student</button>' : ''}<input class="form-control table-search" placeholder="Search students..." oninput="app.filterTable(this.value)">`
        )}

        <div class="card filterable-table">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Guardian</th>
                  <th>Room</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(student => `
                  <tr>
                    <td><strong>${student.name}</strong><br><span class="muted-cell">${student.email}</span></td>
                    <td>${student.phone}</td>
                    <td>${student.guardianName}<br><span class="muted-cell">${student.guardianPhone}</span></td>
                    <td>${this.getHostelName(student.hostelId)}<br><span class="muted-cell">Block ${student.hostelBlock} - Room ${student.roomNumber}, Bed ${student.bedNumber}</span></td>
                    <td><span class="badge ${student.feeStatus === 'Paid' ? 'badge-success' : 'badge-warning'}">${student.feeStatus}</span></td>
                    <td><span class="badge ${student.status === 'Suspended' ? 'badge-danger' : 'badge-success'}">${student.status || 'Active'}</span></td>
                    <td class="table-actions">
                      <button class="btn btn-sm btn-secondary" onclick="app.editStudent('${student.id}')">Edit</button>
                      ${user.role === 'admin' ? `<button class="btn btn-sm ${student.status === 'Suspended' ? 'btn-success' : 'btn-warning'}" onclick="app.toggleStudentStatus('${student.id}', '${student.status === 'Suspended' ? 'Active' : 'Suspended'}')">${student.status === 'Suspended' ? 'Activate' : 'Suspend'}</button>` : ''}
                      ${user.role === 'admin' ? `<button class="btn btn-sm btn-danger" onclick="app.deleteStudent('${student.id}')">Delete</button>` : ''}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${this.studentModal()}
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachStudentHandlers();
    }

    loadNotices() {
        const user = authManager.getCurrentUser();
        const notices = this.visibleNotices();
        const canManage = user.role === 'admin' || user.role === 'warden';
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Notice Board', 'Hostel announcements and updates for students and staff.')}
        ${canManage ? `
          <div class="card">
            <div class="card-header"><h3 class="card-title">Post Notice</h3></div>
            <form id="noticeForm" class="notice-form">
              <div class="form-group"><label class="form-label">Title</label><input type="text" class="form-control" id="noticeTitle" required></div>
              <div class="form-group"><label class="form-label">Audience</label><select class="form-control" id="noticeAudience"><option value="All">All</option><option value="student">Students</option><option value="warden">Wardens</option><option value="admin">Admins</option></select></div>
              <div class="form-group"><label class="form-label">Priority</label><select class="form-control" id="noticePriority"><option value="Normal">Normal</option><option value="High">High</option><option value="Urgent">Urgent</option></select></div>
              <div class="form-group notice-message"><label class="form-label">Message</label><textarea class="form-control" id="noticeMessage" required></textarea></div>
              <button type="submit" class="btn btn-primary">Publish</button>
            </form>
          </div>
        ` : ''}
        <div class="notice-grid">
          ${notices.map(notice => `
            <div class="card notice-card">
              <div class="notice-meta"><span class="badge ${notice.priority === 'Urgent' ? 'badge-danger' : notice.priority === 'High' ? 'badge-warning' : 'badge-info'}">${notice.priority}</span><span>${this.formatDate(notice.date)}</span></div>
              <h3>${notice.title}</h3>
              <p>${notice.message}</p>
              <div class="muted-cell">Audience: ${notice.audience} | By ${notice.createdBy || 'Staff'}</div>
              ${canManage ? `<button class="btn btn-sm btn-danger mt-2" onclick="app.deleteNotice('${notice.id}')">Delete</button>` : ''}
            </div>
          `).join('')}
        </div>
        ${notices.length ? '' : this.emptyState('No notices yet', 'New announcements will appear here.')}
      </div>`;
        document.getElementById('mainContent').innerHTML = content;
        this.attachNoticeHandlers();
    }

    loadLeaveRequests() {
        const user = authManager.getCurrentUser();
        const student = this.getCurrentStudent();
        const requests = this.visibleLeaveRequests().sort((a, b) => (b.requestedAt || '').localeCompare(a.requestedAt || ''));
        const isStaff = user.role === 'admin' || user.role === 'warden';
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Leave Requests', isStaff ? 'Approve or reject student leave applications.' : 'Apply for hostel leave and track approval status.')}
        ${!isStaff ? `
          <div class="card">
            <div class="card-header"><h3 class="card-title">Apply Leave</h3></div>
            <form id="leaveForm" class="request-form">
              <div class="form-group"><label class="form-label">From</label><input type="date" class="form-control" id="leaveFrom" required></div>
              <div class="form-group"><label class="form-label">To</label><input type="date" class="form-control" id="leaveTo" required></div>
              <div class="form-group request-reason"><label class="form-label">Reason</label><textarea class="form-control" id="leaveReason" required></textarea></div>
              <button type="submit" class="btn btn-primary" ${student ? '' : 'disabled'}>Submit Request</button>
            </form>
          </div>
        ` : ''}
        ${this.requestTable(requests, 'leave')}
      </div>`;
        document.getElementById('mainContent').innerHTML = content;
        this.attachLeaveHandlers();
    }

    loadRoomRequests() {
        const user = authManager.getCurrentUser();
        const student = this.getCurrentStudent();
        const requests = this.visibleRoomRequests().sort((a, b) => (b.requestedAt || '').localeCompare(a.requestedAt || ''));
        const isStaff = user.role === 'admin' || user.role === 'warden';
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Room Change Requests', isStaff ? 'Review and approve room change requests.' : 'Request a room change from the hostel office.')}
        ${!isStaff ? `
          <div class="card">
            <div class="card-header"><h3 class="card-title">Request Room Change</h3></div>
            <form id="roomRequestForm" class="request-form">
              <div class="form-group"><label class="form-label">Preferred Block</label><input type="text" class="form-control" id="preferredBlock" required></div>
              <div class="form-group"><label class="form-label">Preferred Room</label><input type="text" class="form-control" id="preferredRoom" required></div>
              <div class="form-group"><label class="form-label">Preferred Bed</label><input type="text" class="form-control" id="preferredBed" required></div>
              <div class="form-group request-reason"><label class="form-label">Reason</label><textarea class="form-control" id="roomReason" required></textarea></div>
              <button type="submit" class="btn btn-primary" ${student ? '' : 'disabled'}>Submit Request</button>
            </form>
          </div>
        ` : ''}
        ${this.requestTable(requests, 'room')}
      </div>`;
        document.getElementById('mainContent').innerHTML = content;
        this.attachRoomRequestHandlers();
    }

    requestTable(requests, type) {
        const isLeave = type === 'leave';
        const isStaff = ['admin', 'warden'].includes(authManager.getCurrentUser().role);
        return `
        <div class="card">
          <div class="table-container">
            <table>
              <thead><tr><th>Student</th><th>${isLeave ? 'Dates' : 'Requested Room'}</th><th>Reason</th><th>Status</th><th>Remark</th>${isStaff ? '<th>Action</th>' : ''}</tr></thead>
              <tbody>
                ${requests.map(request => `
                  <tr>
                    <td><strong>${request.studentName}</strong><br><span class="muted-cell">${request.currentRoom || `${request.hostelBlock || ''} ${request.roomNumber || ''}`}</span></td>
                    <td>${isLeave ? `${this.formatDate(request.fromDate)} to ${this.formatDate(request.toDate)}` : `Block ${request.preferredBlock}, Room ${request.preferredRoom}, Bed ${request.preferredBed}`}</td>
                    <td>${request.reason}</td>
                    <td><span class="badge ${request.status === 'Approved' ? 'badge-success' : request.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}">${request.status}</span></td>
                    <td>${request.staffRemark || '<span class="text-muted">No remark</span>'}</td>
                    ${isStaff ? `<td class="table-actions"><button class="btn btn-sm btn-success" onclick="app.reviewRequest('${type}', '${request.id}', 'Approved')">Approve</button><button class="btn btn-sm btn-danger" onclick="app.reviewRequest('${type}', '${request.id}', 'Rejected')">Reject</button></td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${requests.length ? '' : this.emptyState('No requests found', 'Requests will appear here after submission.')}
        </div>`;
    }

    loadReports() {
        const reports = [
            ['students', 'Student List'],
            ['payments', 'Fee Report'],
            ['complaints', 'Complaint Report'],
            ['visitors', 'Visitor Log']
        ];
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Reports', 'Download Excel reports for office sharing and record keeping.')}
        <div class="report-grid">
          ${reports.map(([type, title]) => `
            <div class="card report-card">
              <h3>${title}</h3>
              <p>Export latest ${title.toLowerCase()} data as Excel.</p>
              <a class="btn btn-primary" href="/api/reports/export?type=${type}" download>Download Excel</a>
            </div>
          `).join('')}
        </div>
      </div>`;
        document.getElementById('mainContent').innerHTML = content;
    }

    loadAbout() {
        const featureItems = [
            'Manage multiple hostels',
            'Assign rooms and beds',
            'Track students',
            'Handle leave and room requests',
            'Manage wardens',
            'Attendance, complaints, visitors, fees'
        ];

        const content = `
      <div class="content-wrapper about-page">
        ${this.pageHeader('About HostelPro', 'A professional hostel management system for institutions managing multiple hostels.')}

        <section class="about-hero">
          <div>
            <span class="status-pill">Multi-hostel platform</span>
            <h2>Built for real hostel operations across different locations.</h2>
            <p>HostelPro helps institutions manage students, rooms, wardens, requests, attendance, visitors, and fees from one organized workspace.</p>
          </div>
          <div class="about-summary-card">
            <strong>Project Focus</strong>
            <span>Centralized hostel administration</span>
            <span>Role-based access for admin, warden, and student</span>
          </div>
        </section>

        <section class="about-section">
          <div class="section-heading">
            <p class="page-eyebrow">What it does</p>
            <h2>Core Capabilities</h2>
          </div>
          <div class="about-feature-grid">
            ${featureItems.map(item => `
              <div class="about-feature">
                <span></span>
                <strong>${item}</strong>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="about-section about-reason">
          <div>
            <p class="page-eyebrow">Why this project</p>
            <h2>Manual hostel records become difficult when hostels are in different locations.</h2>
          </div>
          <p>Many universities and institutions keep hostels in separate buildings or areas because of space limitations. This system is designed so each hostel can have its own rooms, address, type, warden, and student records while still staying connected under one platform.</p>
        </section>

        <section class="about-section">
          <div class="section-heading">
            <p class="page-eyebrow">Project Team</p>
            <h2>Leadership & Contribution</h2>
          </div>
          <div class="team-grid">
            <article class="team-card lead-card">
              <img src="assets/project-head.jpg" alt="Project Head">
              <div>
                <span class="team-role">Project Head</span>
                <h3>Chand Alam</h3>
                <p>Responsible for project planning, feature direction, and final system presentation.</p>
              </div>
            </article>
            <article class="team-card">
              <img src="assets/team-member.jpg" alt="Team Member">
              <div>
                <span class="team-role">Team Member / Co-Developer</span>
                <h3>Prabhat Kumar</h3>
                <p>Supports implementation, testing, documentation, and workflow improvements.</p>
              </div>
            </article>
          </div>
        </section>
      </div>`;

        document.getElementById('mainContent').innerHTML = content;
    }

    studentModal() {
        const hostels = this.visibleHostels();
        return `
      <div class="modal" id="studentModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="studentModalTitle">Add Student</h3>
            <button class="modal-close" id="closeStudentModal">x</button>
          </div>
          <div class="modal-body">
            <form id="studentForm">
              <input type="hidden" id="studentId">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-control" id="studentName" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" id="studentEmail" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone *</label>
                  <input type="tel" class="form-control" id="studentPhone" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Guardian Name *</label>
                  <input type="text" class="form-control" id="guardianName" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Guardian Phone *</label>
                  <input type="tel" class="form-control" id="guardianPhone" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Joining Date *</label>
                  <input type="date" class="form-control" id="joiningDate" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Hostel *</label>
                  <select class="form-control" id="studentHostelId" required>
                    <option value="">Select Hostel</option>
                    ${hostels.map(hostel => `<option value="${hostel.id}">${hostel.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Hostel Block *</label>
                  <input type="text" class="form-control" id="hostelBlock" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Room Number *</label>
                  <input type="text" class="form-control" id="roomNumber" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Bed Number *</label>
                  <input type="text" class="form-control" id="bedNumber" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Fee Status *</label>
                  <select class="form-control" id="feeStatus" required>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
                <div class="form-group">
                <label class="form-label">Student Status *</label>
                <select class="form-control" id="studentStatus" required>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelStudentForm">Cancel</button>
            <button class="btn btn-primary" id="saveStudent">Save Student</button>
          </div>
        </div>
      </div>
    `;
    }

    loadRooms() {
        const user = authManager.getCurrentUser();
        const rooms = this.visibleRooms();
        const canManage = user.role === 'admin' || user.role === 'warden';
        const groupedRooms = rooms.reduce((acc, room) => {
            const hostelName = this.getHostelName(room.hostelId);
            const key = `${hostelName} - Block ${room.hostelBlock || '-'}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(room);
            return acc;
        }, {});

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('Room Management', 'Track bed capacity, occupancy, and availability across hostels, blocks, and floors.', canManage ? '<button class="btn btn-primary" id="addRoomBtn">Add Room</button>' : '')}
        <div class="room-grid">
          ${Object.keys(groupedRooms).map(group => `
            <div class="card room-block-card">
              <div class="card-header">
                <h3 class="card-title">${group}</h3>
                <span class="badge badge-primary">${groupedRooms[group].length} rooms</span>
              </div>
              <div class="room-list">
                ${groupedRooms[group].map(room => {
                    const percent = Math.round((room.occupiedBeds / room.totalBeds) * 100);
                    return `
                      <div class="room-card">
                        <div>
                          <strong>Room ${room.roomNumber}</strong>
                          <span>Floor ${room.floor || '-'} | ${room.occupiedBeds}/${room.totalBeds} beds occupied</span>
                        </div>
                        <div class="capacity-bar"><span style="width:${percent}%"></span></div>
                        <span class="badge ${room.available ? 'badge-success' : 'badge-danger'}">${room.available ? 'Available' : 'Full'}</span>
                        ${canManage ? `<div class="table-actions"><button class="btn btn-sm btn-secondary" onclick="app.editRoom('${room.id}')">Edit</button><button class="btn btn-sm btn-danger" onclick="app.deleteRoom('${room.id}')">Delete</button></div>` : ''}
                      </div>
                    `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        ${rooms.length ? '' : this.emptyState('No rooms found', 'Add rooms for this hostel to begin allocation.')}
        ${this.roomModal()}
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachRoomHandlers();
    }

    roomModal() {
        const hostels = dataStore.getHostels();
        return `
      <div class="modal" id="roomModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="roomModalTitle">Add Room</h3>
            <button class="modal-close" id="closeRoomModal">x</button>
          </div>
          <div class="modal-body">
            <form id="roomForm">
              <input type="hidden" id="roomId">
              <div class="form-row">
                <div class="form-group"><label class="form-label">Existing Hostel</label><select class="form-control" id="roomHostelId"><option value="">Select Hostel</option>${hostels.map(hostel => `<option value="${hostel.id}">${hostel.name}${hostel.type ? ` (${hostel.type})` : ''}</option>`).join('')}</select></div>
                <div class="form-group"><label class="form-label">Block *</label><input type="text" class="form-control" id="roomBlock" required></div>
              </div>
              <div class="card inline-form-card">
                <div class="card-header"><h3 class="card-title">New hostel for this room</h3></div>
                <div class="form-row">
                  <div class="form-group"><label class="form-label">Hostel Name</label><input type="text" class="form-control" id="roomNewHostelName" placeholder="Type if hostel is not in list"></div>
                  <div class="form-group"><label class="form-label">Hostel Type</label><input type="text" class="form-control" id="roomNewHostelType" placeholder="Boys, Girls, Couple, Staff"></div>
                </div>
                <div class="form-group"><label class="form-label">Address / Location</label><input type="text" class="form-control" id="roomNewHostelAddress" placeholder="Optional"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Floor</label><input type="text" class="form-control" id="roomFloor"></div>
                <div class="form-group"><label class="form-label">Room Number *</label><input type="text" class="form-control" id="roomNo" required></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label class="form-label">Total Beds *</label><input type="number" class="form-control" id="roomTotalBeds" min="1" required></div>
                <div class="form-group"><label class="form-label">Occupied Beds *</label><input type="number" class="form-control" id="roomOccupiedBeds" min="0" required></div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelRoomForm">Cancel</button>
            <button class="btn btn-primary" id="saveRoom">Save Room</button>
          </div>
        </div>
      </div>`;
    }

    loadFees() {
        const user = authManager.getCurrentUser();
        const payments = this.visiblePayments();
        const students = this.visibleStudents();
        const isStudent = user.role === 'student';
        const canRecord = user.role === 'admin' || isStudent;
        const canReview = user.role === 'admin';
        const studentOptions = isStudent
            ? students.filter(student => student.id === this.getCurrentStudent()?.id)
            : students;

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            user.role === 'student' ? 'My Fee Records' : 'Fees & Payments',
            user.role === 'student' ? 'Submit payment proof and track approval status.' : 'Review student payment proofs and approve verified fees.',
            `${canRecord ? `<button class="btn btn-primary" id="addPaymentBtn">${isStudent ? 'Submit Payment Proof' : 'Record Payment'}</button>` : ''}<input class="form-control table-search" placeholder="Search fees..." oninput="app.filterTable(this.value)">`
        )}

        <div class="card filterable-table">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Proof</th>
                  <th>Receipt</th>
                  ${canReview ? '<th>Action</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${payments.map(payment => `
                  <tr>
                    <td><strong>${payment.receipt}</strong></td>
                    <td>${payment.studentName}</td>
                    <td>${this.formatCurrency(payment.amount)}</td>
                    <td>${new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>${payment.paymentMethod}</td>
                    <td><span class="badge ${this.paymentStatusBadge(payment.status)}">${payment.status || 'Pending'}</span></td>
                    <td>${payment.receiptProof ? `<a class="btn btn-sm btn-outline" href="${payment.receiptProof}" target="_blank">View Proof</a>` : '<span class="text-muted">No proof</span>'}</td>
                    <td><a class="btn btn-sm btn-outline" href="/api/payments/receipt?id=${payment.id}" target="_blank">Download</a></td>
                    ${canReview ? `
                      <td class="table-actions">
                        ${(payment.status || 'Pending') === 'Pending' ? `
                          <button class="btn btn-sm btn-success" onclick="app.reviewPayment('${payment.id}', 'Approved')">Approve</button>
                          <button class="btn btn-sm btn-danger" onclick="app.reviewPayment('${payment.id}', 'Rejected')">Reject</button>
                        ` : '<span class="text-muted">Reviewed</span>'}
                      </td>
                    ` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${payments.length ? '' : this.emptyState('No fee records', 'No payment records are available for this view.')}
        </div>

        <div class="modal" id="paymentModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">${isStudent ? 'Submit Payment Proof' : 'Record Payment'}</h3>
              <button class="modal-close" id="closePaymentModal">x</button>
            </div>
            <div class="modal-body">
              <form id="paymentForm">
                <div class="form-group">
                  <label class="form-label">Student *</label>
                  <select class="form-control" id="paymentStudentId" required>
                    ${studentOptions.map(student => `<option value="${student.id}">${student.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Amount *</label>
                    <input type="number" class="form-control" id="paymentAmount" min="1" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Payment Date *</label>
                    <input type="date" class="form-control" id="paymentDate" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Method *</label>
                    <select class="form-control" id="paymentMethod" required>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Receipt / Transaction ID *</label>
                    <input type="text" class="form-control" id="paymentReceipt" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Upload Receipt Proof *</label>
                  <input type="file" class="form-control" id="paymentReceiptProof" accept="image/*,application/pdf" required>
                  <span class="muted-cell">Upload payment screenshot, receipt photo, or PDF. Max 3 MB.</span>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="cancelPaymentForm">Cancel</button>
              <button class="btn btn-primary" id="savePayment">${isStudent ? 'Submit for Approval' : 'Save for Review'}</button>
            </div>
          </div>
        </div>
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachPaymentHandlers();
    }

    loadComplaints() {
        const user = authManager.getCurrentUser();
        const complaints = this.visibleComplaints();
        const isStaff = user.role === 'admin' || user.role === 'warden';

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            'Complaints',
            isStaff ? 'Review, prioritize, and update student complaints.' : 'Submit complaints and track their resolution status.',
            '<button class="btn btn-primary" id="addComplaintBtn">New Complaint</button><input class="form-control table-search" placeholder="Search complaints..." oninput="app.filterTable(this.value)">'
        )}

        <div class="card filterable-table">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Timeline</th>
                  ${isStaff ? '<th>Action</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${complaints.map(complaint => `
                  <tr>
                    <td>${new Date(complaint.date).toLocaleDateString()}</td>
                    <td>${complaint.studentName}</td>
                    <td>${complaint.category}</td>
                    <td><strong>${complaint.subject}</strong><br><span class="muted-cell">${complaint.description || ''}</span></td>
                    <td><span class="badge ${this.priorityBadge(complaint.priority)}">${complaint.priority}</span></td>
                    <td><span class="badge ${this.statusBadge(complaint.status)}">${complaint.status}</span></td>
                    <td>
                      <div class="timeline-mini">
                        <span class="done">Submitted</span>
                        <span class="${['In Progress', 'Resolved'].includes(complaint.status) ? 'done' : ''}">In Progress</span>
                        <span class="${complaint.status === 'Resolved' ? 'done' : ''}">Resolved</span>
                      </div>
                      ${complaint.staffRemark ? `<span class="muted-cell">${complaint.staffRemark}</span>` : ''}
                    </td>
                    ${isStaff ? `
                      <td>
                        <select class="form-control form-control-sm" onchange="app.updateComplaintStatus('${complaint.id}', this.value)">
                          <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
                          <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                          <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                      </td>
                    ` : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${complaints.length ? '' : this.emptyState('No complaints found', 'Complaint records will appear here.')}
        </div>

        ${this.complaintModal(isStaff)}
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachComplaintHandlers();
    }

    complaintModal(isStaff) {
        const students = dataStore.getStudents();
        return `
      <div class="modal" id="complaintModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Submit Complaint</h3>
            <button class="modal-close" id="closeComplaintModal">x</button>
          </div>
          <div class="modal-body">
            <form id="complaintForm">
              ${isStaff ? `
                <div class="form-group">
                  <label class="form-label">Student *</label>
                  <select class="form-control" id="complaintStudentId" required>
                    ${students.map(student => `<option value="${student.id}">${student.name}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select class="form-control" id="complaintCategory" required>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Food">Food</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Subject *</label>
                <input type="text" class="form-control" id="complaintSubject" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-control" id="complaintDescription" rows="4" required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Priority *</label>
                <select class="form-control" id="complaintPriority" required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelComplaintForm">Cancel</button>
            <button class="btn btn-primary" id="saveComplaint">Submit Complaint</button>
          </div>
        </div>
      </div>
    `;
    }

    loadVisitors() {
        const user = authManager.getCurrentUser();
        const visitors = this.visibleVisitors();
        const isStaff = user.role === 'admin' || user.role === 'warden';

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            'Visitor Log',
            isStaff ? 'Record and monitor visitor entry and exit details.' : 'View visitor entries connected to your hostel profile.',
            '<button class="btn btn-primary" id="addVisitorBtn">Add Visitor</button>'
        )}

        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Visitor</th>
                  <th>Student</th>
                  <th>Relationship</th>
                  <th>Phone</th>
                  <th>Purpose</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                ${visitors.map(visitor => `
                  <tr>
                    <td>${new Date(visitor.date).toLocaleDateString()}</td>
                    <td><strong>${visitor.visitorName}</strong></td>
                    <td>${visitor.studentName}</td>
                    <td>${visitor.relationship}</td>
                    <td>${visitor.phone}</td>
                    <td>${visitor.purpose}</td>
                    <td>${visitor.checkIn}</td>
                    <td>${visitor.checkOut || 'Not checked out'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${visitors.length ? '' : this.emptyState('No visitor records', 'Visitor entries will appear here after being recorded.')}
        </div>

        ${this.visitorModal(isStaff)}
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachVisitorHandlers();
    }

    async loadAttendance() {
        const user = authManager.getCurrentUser();
        const today = new Date().toISOString().slice(0, 10);
        const selectedDate = document.getElementById('attendanceDate')?.value || today;

        if (user.role === 'student') {
            this.loadStudentAttendance();
            return;
        }

        const records = (await dataStore.getAttendanceByDate(selectedDate)).filter(record => this.isInHostelScope(record));
        const present = records.filter(record => record.status === 'Present').length;
        const absent = records.filter(record => record.status === 'Absent').length;
        const leave = records.filter(record => record.status === 'Leave').length;

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader(
            'Daily Attendance',
            'Mark hostel attendance for each student and export records for sharing.',
            `<a class="btn btn-outline" id="exportAttendanceBtn" href="/api/attendance/export?startDate=${selectedDate}&endDate=${selectedDate}" download>Export Excel</a>`
        )}

        <section class="attendance-toolbar card">
          <div class="form-group">
            <label class="form-label">Attendance Date</label>
            <input type="date" class="form-control" id="attendanceDate" value="${selectedDate}">
            <div class="date-preview">${this.formatDate(selectedDate)}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Export Range</label>
            <select class="form-control" id="exportRange">
              <option value="today">Selected day</option>
              <option value="month">Last 1 month</option>
              <option value="six-months">Last 6 months</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          <div class="custom-export-range hidden" id="customExportRange">
            <div class="form-group">
              <label class="form-label">From</label>
              <input type="date" class="form-control" id="exportStartDate" value="${selectedDate}">
            </div>
            <div class="form-group">
              <label class="form-label">To</label>
              <input type="date" class="form-control" id="exportEndDate" value="${selectedDate}">
            </div>
          </div>
          <div class="attendance-summary">
            <div><strong>${records.length}</strong><span>Total</span></div>
            <div><strong>${present}</strong><span>Present</span></div>
            <div><strong>${absent}</strong><span>Absent</span></div>
            <div><strong>${leave}</strong><span>Leave</span></div>
          </div>
        </section>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Roll Call</h3>
            <div class="attendance-actions">
              <button class="btn btn-outline btn-sm" data-bulk-status="Present">All Present</button>
              <button class="btn btn-outline btn-sm" data-bulk-status="Absent">All Absent</button>
              <button class="btn btn-outline btn-sm" data-bulk-status="Leave">All Leave</button>
              <button class="btn btn-primary" id="saveAttendanceBtn">Save Attendance</button>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Block</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(record => `
                  <tr data-student-id="${record.studentId}">
                    <td><strong>${record.studentName}</strong></td>
                    <td>${record.hostelBlock}</td>
                    <td>${record.roomNumber}</td>
                    <td>
                      <div class="attendance-status-group">
                        ${['Present', 'Absent', 'Leave'].map(status => `
                          <button type="button" class="status-choice ${record.status === status ? 'active' : ''}" data-status="${status}">${status}</button>
                        `).join('')}
                      </div>
                    </td>
                    <td><input type="text" class="form-control attendance-remarks" value="${record.remarks || ''}" placeholder="Optional note"></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

        document.getElementById('mainContent').innerHTML = content;
        this.attachAttendanceHandlers();
    }

    loadStudentAttendance() {
        const records = this.visibleAttendance().slice().sort((a, b) => b.date.localeCompare(a.date));
        const present = records.filter(record => record.status === 'Present').length;
        const absent = records.filter(record => record.status === 'Absent').length;
        const leave = records.filter(record => record.status === 'Leave').length;

        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('My Attendance', 'View your daily hostel attendance record.')}
        <section class="attendance-toolbar card">
          <div class="attendance-summary wide">
            <div><strong>${records.length}</strong><span>Total Days</span></div>
            <div><strong>${present}</strong><span>Present</span></div>
            <div><strong>${absent}</strong><span>Absent</span></div>
            <div><strong>${leave}</strong><span>Leave</span></div>
          </div>
        </section>

        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Marked By</th>
                </tr>
              </thead>
              <tbody>
                ${records.map(record => `
                  <tr>
                    <td>${this.formatDate(record.date)}</td>
                    <td><span class="badge ${this.attendanceBadge(record.status)}">${record.status}</span></td>
                    <td>${record.remarks || '<span class="text-muted">No remarks</span>'}</td>
                    <td>${record.markedBy || '<span class="text-muted">Staff</span>'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${records.length ? '' : this.emptyState('No attendance yet', 'Your attendance entries will appear after staff marks roll call.')}
        </div>
      </div>
    `;
        document.getElementById('mainContent').innerHTML = content;
    }

    visitorModal(isStaff) {
        const students = this.visibleStudents();
        return `
      <div class="modal" id="visitorModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Add Visitor</h3>
            <button class="modal-close" id="closeVisitorModal">x</button>
          </div>
          <div class="modal-body">
            <form id="visitorForm">
              ${isStaff ? `
                <div class="form-group">
                  <label class="form-label">Student *</label>
                  <select class="form-control" id="visitorStudentId" required>
                    ${students.map(student => `<option value="${student.id}">${student.name}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Visitor Name *</label>
                  <input type="text" class="form-control" id="visitorName" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Relationship *</label>
                  <input type="text" class="form-control" id="visitorRelationship" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone *</label>
                  <input type="tel" class="form-control" id="visitorPhone" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Purpose *</label>
                  <input type="text" class="form-control" id="visitorPurpose" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Check-in Time *</label>
                  <input type="datetime-local" class="form-control" id="visitorCheckIn" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Check-out Time</label>
                  <input type="datetime-local" class="form-control" id="visitorCheckOut">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancelVisitorForm">Cancel</button>
            <button class="btn btn-primary" id="saveVisitor">Save Visitor</button>
          </div>
        </div>
      </div>
    `;
    }

    loadUsers() {
        const users = dataStore.getUsers();
        const hostels = dataStore.getHostels();
        const content = `
      <div class="content-wrapper">
        ${this.pageHeader('User Access', 'Approve student requests, create staff accounts, and review permissions.')}
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Create Staff Account</h3>
          </div>
          <form id="staffUserForm" class="staff-user-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" id="staffName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" id="staffEmail" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="staffPassword" required>
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <select class="form-control" id="staffRole" required>
                <option value="warden">Warden</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Assigned Hostel</label>
              <select class="form-control" id="staffHostelId">
                <option value="">All / Not assigned</option>
                ${hostels.map(hostel => `<option value="${hostel.id}">${hostel.name}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Add Staff</button>
          </form>
          <div id="staffMessage" class="success-note hidden">Staff account created.</div>
        </div>
        <div class="card">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Access</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(user => `
                  <tr>
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td><span class="badge badge-primary">${this.roleConfig(user.role).label}</span><br><span class="muted-cell">${user.hostelId ? this.getHostelName(user.hostelId) : 'All hostels'}</span></td>
                    <td><span class="badge ${this.userStatusBadge(user.status)}">${user.status || 'Approved'}</span></td>
                    <td>${this.roleConfig(user.role).routes.map(route => `<span class="mini-tag">${route}</span>`).join('')}</td>
                    <td>
                      ${(user.status || 'Approved') === 'Pending' ? `
                        <button class="btn btn-sm btn-success" onclick="app.approveUser('${user.id}')">Approve</button>
                        <button class="btn btn-sm btn-danger" onclick="app.rejectUser('${user.id}')">Reject</button>
                      ` : `
                        ${user.role === 'student' ? `<button class="btn btn-sm ${user.status === 'Suspended' ? 'btn-success' : 'btn-warning'}" onclick="app.toggleUserSuspension('${user.id}', '${user.status === 'Suspended' ? 'Approved' : 'Suspended'}')">${user.status === 'Suspended' ? 'Activate' : 'Suspend'}</button>` : '<span class="text-muted">Staff account</span>'}
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
        document.getElementById('mainContent').innerHTML = content;
        this.attachUserHandlers();
    }

    priorityBadge(priority) {
        return priority === 'High' ? 'badge-danger' : priority === 'Medium' ? 'badge-warning' : 'badge-info';
    }

    statusBadge(status) {
        return status === 'Resolved' ? 'badge-success' : status === 'In Progress' ? 'badge-warning' : 'badge-danger';
    }

    paymentStatusBadge(status = 'Pending') {
        if (['Approved', 'Completed'].includes(status)) return 'badge-success';
        if (status === 'Rejected') return 'badge-danger';
        return 'badge-warning';
    }

    userStatusBadge(status = 'Approved') {
        if (status === 'Approved') return 'badge-success';
        if (status === 'Pending') return 'badge-warning';
        return 'badge-danger';
    }

    attendanceBadge(status = 'Present') {
        if (status === 'Present') return 'badge-success';
        if (status === 'Leave') return 'badge-warning';
        return 'badge-danger';
    }

    filterTable(query) {
        const table = document.querySelector('.filterable-table tbody');
        if (!table) return;
        const needle = query.trim().toLowerCase();
        table.querySelectorAll('tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(needle) ? '' : 'none';
        });
    }

    async approveUser(id) {
        await dataStore.updateUser(id, { status: 'Approved', approvedAt: new Date().toISOString() });
        await dataStore.refresh();
        this.loadUsers();
    }

    async rejectUser(id) {
        await dataStore.updateUser(id, { status: 'Rejected', rejectedAt: new Date().toISOString() });
        this.loadUsers();
    }

    attachNoticeHandlers() {
        document.getElementById('noticeForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await dataStore.addNotice({
                title: document.getElementById('noticeTitle').value.trim(),
                message: document.getElementById('noticeMessage').value.trim(),
                audience: document.getElementById('noticeAudience').value,
                priority: document.getElementById('noticePriority').value,
                date: new Date().toISOString().slice(0, 10),
                createdBy: authManager.getCurrentUser().name
            });
            this.loadNotices();
        });
    }

    async deleteNotice(id) {
        await dataStore.deleteNotice(id);
        this.loadNotices();
    }

    attachLeaveHandlers() {
        document.getElementById('leaveForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const student = this.getCurrentStudent();
            await dataStore.addLeaveRequest({
                studentId: student.id,
                studentName: student.name,
                hostelId: student.hostelId,
                fromDate: document.getElementById('leaveFrom').value,
                toDate: document.getElementById('leaveTo').value,
                reason: document.getElementById('leaveReason').value.trim(),
                status: 'Pending'
            });
            this.loadLeaveRequests();
        });
    }

    attachRoomRequestHandlers() {
        document.getElementById('roomRequestForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const student = this.getCurrentStudent();
            await dataStore.addRoomRequest({
                studentId: student.id,
                studentName: student.name,
                hostelId: student.hostelId,
                preferredBlock: document.getElementById('preferredBlock').value.trim(),
                preferredRoom: document.getElementById('preferredRoom').value.trim(),
                preferredBed: document.getElementById('preferredBed').value.trim(),
                reason: document.getElementById('roomReason').value.trim(),
                status: 'Pending'
            });
            this.loadRoomRequests();
        });
    }

    async reviewRequest(type, id, status) {
        const staffRemark = prompt(`Add ${status.toLowerCase()} remark`, status === 'Approved' ? 'Approved by hostel office' : 'Request rejected by hostel office') || '';
        const payload = { status, staffRemark, reviewedBy: authManager.getCurrentUser().name };
        if (type === 'leave') {
            await dataStore.updateLeaveRequest(id, payload);
        } else {
            await dataStore.updateRoomRequest(id, payload);
        }
        this.render();
    }

    async toggleUserSuspension(id, status) {
        const user = dataStore.getUsers().find(item => item.id === id);
        if (!user) return;
        await dataStore.updateUser(id, { status });
        const student = dataStore.getStudents().find(item => item.id === user.studentId || item.email === user.email);
        if (student) {
            await dataStore.updateStudent(student.id, { status: status === 'Suspended' ? 'Suspended' : 'Active' });
        }
        this.loadUsers();
    }

    attachUserHandlers() {
        document.getElementById('staffUserForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('staffName').value.trim(),
                email: document.getElementById('staffEmail').value.trim(),
                password: document.getElementById('staffPassword').value,
                role: document.getElementById('staffRole').value,
                hostelId: document.getElementById('staffHostelId').value
            };
            await dataStore.addUser(payload);
            const message = document.getElementById('staffMessage');
            message.classList.remove('hidden');
            e.target.reset();
            setTimeout(() => this.loadUsers(), 600);
        });
    }

    attachProfileHandlers() {
        const photoInput = document.getElementById('profilePhoto');
        photoInput?.addEventListener('change', () => {
            const file = photoInput.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('profilePhotoData').value = reader.result;
                document.getElementById('profilePreview').innerHTML = `<img src="${reader.result}" alt="Profile preview">`;
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = authManager.getCurrentUser();
            const student = this.getCurrentStudent();
            const profile = {
                name: document.getElementById('profileName').value.trim(),
                email: document.getElementById('profileEmail').value.trim(),
                phone: document.getElementById('profilePhone').value.trim(),
                guardianName: document.getElementById('profileGuardianName').value.trim(),
                guardianPhone: document.getElementById('profileGuardianPhone').value.trim(),
                joiningDate: document.getElementById('profileJoiningDate').value,
                hostelBlock: student?.hostelBlock || 'Not Assigned',
                roomNumber: student?.roomNumber || 'Not Assigned',
                bedNumber: student?.bedNumber || 'Not Assigned',
                feeStatus: student?.feeStatus || 'Pending',
                status: student?.status || 'Active',
                photo: document.getElementById('profilePhotoData').value
            };

            let saved;
            if (student) {
                saved = await dataStore.updateStudent(student.id, profile);
            } else {
                saved = await dataStore.addStudent(profile);
                await dataStore.updateUser(user.id, { studentId: saved.id, name: saved.name, email: saved.email });
                authManager.updateSession({ studentId: saved.id, name: saved.name, email: saved.email });
            }

            const linkedUser = dataStore.getUsers().find(item => item.id === user.id);
            if (linkedUser) {
                await dataStore.updateUser(user.id, { name: saved.name, email: saved.email, studentId: saved.id });
                authManager.updateSession({ name: saved.name, email: saved.email, studentId: saved.id });
            }

            document.getElementById('profileMessage').classList.remove('hidden');
            setTimeout(() => this.loadProfile(), 700);
        });
    }

    attachAttendanceHandlers() {
        const dateInput = document.getElementById('attendanceDate');
        const exportBtn = document.getElementById('exportAttendanceBtn');
        const rangeInput = document.getElementById('exportRange');
        const customRange = document.getElementById('customExportRange');

        const updateExportLink = () => {
            if (customRange) {
                customRange.classList.toggle('hidden', rangeInput?.value !== 'custom');
            }
            if (exportBtn) exportBtn.href = this.attendanceExportUrl();
        };

        dateInput?.addEventListener('change', () => {
            this.loadAttendance();
        });
        rangeInput?.addEventListener('change', updateExportLink);
        document.getElementById('exportStartDate')?.addEventListener('change', updateExportLink);
        document.getElementById('exportEndDate')?.addEventListener('change', updateExportLink);

        document.querySelectorAll('.status-choice').forEach(button => {
            button.addEventListener('click', () => {
                const group = button.closest('.attendance-status-group');
                group.querySelectorAll('.status-choice').forEach(item => item.classList.remove('active'));
                button.classList.add('active');
            });
        });

        document.querySelectorAll('[data-bulk-status]').forEach(button => {
            button.addEventListener('click', () => {
                const status = button.dataset.bulkStatus;
                document.querySelectorAll('.attendance-status-group').forEach(group => {
                    group.querySelectorAll('.status-choice').forEach(item => {
                        item.classList.toggle('active', item.dataset.status === status);
                    });
                });
            });
        });

        document.getElementById('saveAttendanceBtn')?.addEventListener('click', async (e) => {
            const user = authManager.getCurrentUser();
            const date = document.getElementById('attendanceDate').value;
            const records = Array.from(document.querySelectorAll('tr[data-student-id]')).map(row => ({
                studentId: row.dataset.studentId,
                status: row.querySelector('.status-choice.active')?.dataset.status || 'Present',
                remarks: row.querySelector('.attendance-remarks').value.trim()
            }));

            e.currentTarget.disabled = true;
            e.currentTarget.textContent = 'Saving...';
            await dataStore.markAttendance(date, records, user.name);
            this.loadAttendance();
        });

        updateExportLink();
    }

    attachLoginHandlers() {
        document.getElementById('togglePassword')?.addEventListener('click', (e) => {
            const passwordInput = document.getElementById('loginPassword');
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            e.currentTarget.textContent = isPassword ? 'Hide' : 'Show';
        });

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const submitBtn = e.submitter;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            const result = await authManager.login(email, password);

            if (result.success) {
                window.location.hash = '#/dashboard';
            } else {
                const errorEl = document.getElementById('loginError');
                errorEl.textContent = result.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign in';
            }
        });
    }

    attachRegisterHandlers() {
        document.getElementById('sendRegisterCode')?.addEventListener('click', async (e) => {
            const button = e.currentTarget;
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const errorEl = document.getElementById('registerError');
            errorEl.classList.add('hidden');
            if (!name || !email) {
                errorEl.textContent = 'Enter your name and email before requesting a code.';
                errorEl.classList.remove('hidden');
                return;
            }
            button.disabled = true;
            button.textContent = 'Sending...';
            const result = await authManager.sendRegisterCode(name, email);
            if (result.success) {
                errorEl.textContent = result.message || 'Verification code sent to your email.';
                errorEl.classList.remove('hidden');
                button.textContent = 'Resend Code';
            } else {
                errorEl.textContent = result.message;
                errorEl.classList.remove('hidden');
                button.textContent = 'Send Code';
            }
            button.disabled = false;
        });

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('regName').value.trim(),
                email: document.getElementById('regEmail').value.trim(),
                password: document.getElementById('regPassword').value,
                emailCode: document.getElementById('regEmailCode').value.trim(),
                role: 'student'
            };

            const submitBtn = e.submitter;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';
            const result = await authManager.register(userData);

            if (result.success) {
                alert(result.message || 'Request sent. Admin approval is required before login.');
                window.location.hash = '#/login';
            } else {
                const errorEl = document.getElementById('registerError');
                errorEl.textContent = result.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Request';
            }
        });
    }

    attachForgotPasswordHandlers() {
        const messageEl = document.getElementById('forgotMessage');
        const errorEl = document.getElementById('forgotError');
        const showMessage = (message) => {
            errorEl.classList.add('hidden');
            messageEl.textContent = message;
            messageEl.classList.remove('hidden');
        };
        const showError = (message) => {
            messageEl.classList.add('hidden');
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        };

        document.getElementById('sendResetCode')?.addEventListener('click', async (e) => {
            const button = e.currentTarget;
            const email = document.getElementById('resetEmail').value.trim();
            if (!email) {
                showError('Enter your email before requesting a reset code.');
                return;
            }
            button.disabled = true;
            button.textContent = 'Sending...';
            const result = await authManager.requestPasswordReset(email);
            if (result.success) {
                showMessage(result.message);
                button.textContent = 'Resend Code';
            } else {
                showError(result.message);
                button.textContent = 'Send Reset Code';
            }
            button.disabled = false;
        });

        document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();
            const code = document.getElementById('resetCode').value.trim();
            const password = document.getElementById('newPassword').value;
            const submitBtn = e.submitter;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Resetting...';
            const result = await authManager.resetPassword(email, code, password);
            if (result.success) {
                showMessage(result.message);
                setTimeout(() => { window.location.hash = '#/login'; }, 1200);
            } else {
                showError(result.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
            }
        });
    }

    attachNavHandlers() {
        const logoutBtn = document.getElementById('logoutBtn');
        const menuToggle = document.getElementById('menuToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('mobileBackdrop');

        const closeMenu = () => {
            sidebar?.classList.remove('active');
            backdrop?.classList.remove('active');
        };

        menuToggle?.addEventListener('click', () => {
            sidebar.classList.add('active');
            backdrop.classList.add('active');
        });
        sidebarClose?.addEventListener('click', closeMenu);
        backdrop?.addEventListener('click', closeMenu);
        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
        logoutBtn?.addEventListener('click', () => authManager.logout());
    }

    attachHostelHandlers() {
        const modal = document.getElementById('hostelModal');
        document.getElementById('addHostelBtn')?.addEventListener('click', () => {
            document.getElementById('hostelModalTitle').textContent = 'Add Hostel';
            document.getElementById('hostelForm').reset();
            document.getElementById('hostelId').value = '';
            modal.classList.add('active');
        });
        document.getElementById('closeHostelModal')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancelHostelForm')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('saveHostel')?.addEventListener('click', async () => {
            const form = document.getElementById('hostelForm');
            if (!form.reportValidity()) return;
            const id = document.getElementById('hostelId').value;
            const hostelData = {
                name: document.getElementById('hostelName').value.trim(),
                type: document.getElementById('hostelType').value.trim(),
                code: document.getElementById('hostelCode').value.trim(),
                address: document.getElementById('hostelAddress').value.trim(),
                contact: document.getElementById('hostelContact').value.trim(),
                wardenUserId: document.getElementById('hostelWarden').value,
                status: document.getElementById('hostelStatus').value
            };
            const saved = id ? await dataStore.updateHostel(id, hostelData) : await dataStore.addHostel(hostelData);
            if (hostelData.wardenUserId) await dataStore.updateUser(hostelData.wardenUserId, { hostelId: saved.id || id });
            modal.classList.remove('active');
            this.loadHostels();
        });
    }

    editHostel(id) {
        const hostel = dataStore.getHostelById(id);
        if (!hostel) return;
        document.getElementById('hostelModalTitle').textContent = 'Edit Hostel';
        document.getElementById('hostelId').value = hostel.id;
        document.getElementById('hostelName').value = hostel.name || '';
        document.getElementById('hostelType').value = hostel.type || '';
        document.getElementById('hostelCode').value = hostel.code || '';
        document.getElementById('hostelAddress').value = hostel.address || '';
        document.getElementById('hostelContact').value = hostel.contact || '';
        document.getElementById('hostelWarden').value = hostel.wardenUserId || '';
        document.getElementById('hostelStatus').value = hostel.status || 'Active';
        document.getElementById('hostelModal').classList.add('active');
    }

    async deleteHostel(id) {
        const hasRooms = dataStore.getRooms().some(room => room.hostelId === id);
        const hasStudents = dataStore.getStudents().some(student => student.hostelId === id);
        if (hasRooms || hasStudents) {
            alert('This hostel has rooms or students. Move/delete them before deleting the hostel.');
            return;
        }
        if (!confirm('Are you sure you want to delete this hostel?')) return;
        await dataStore.deleteHostel(id);
        this.loadHostels();
    }

    attachRoomHandlers() {
        const modal = document.getElementById('roomModal');
        document.getElementById('addRoomBtn')?.addEventListener('click', () => {
            document.getElementById('roomModalTitle').textContent = 'Add Room';
            document.getElementById('roomForm').reset();
            document.getElementById('roomId').value = '';
            document.getElementById('roomHostelId').disabled = false;
            document.getElementById('roomNewHostelName').disabled = false;
            document.getElementById('roomNewHostelType').disabled = false;
            document.getElementById('roomNewHostelAddress').disabled = false;
            document.getElementById('roomHostelId').value = this.visibleHostels()[0]?.id || dataStore.getHostels()[0]?.id || '';
            modal.classList.add('active');
        });
        document.getElementById('closeRoomModal')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancelRoomForm')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('saveRoom')?.addEventListener('click', async () => {
            const form = document.getElementById('roomForm');
            if (!form.reportValidity()) return;
            const id = document.getElementById('roomId').value;
            const totalBeds = Number(document.getElementById('roomTotalBeds').value || 0);
            const occupiedBeds = Number(document.getElementById('roomOccupiedBeds').value || 0);
            let hostelId = document.getElementById('roomHostelId').value;
            const newHostelName = document.getElementById('roomNewHostelName').value.trim();
            if (!id && newHostelName) {
                const user = authManager.getCurrentUser();
                const newHostel = await dataStore.addHostel({
                    name: newHostelName,
                    type: document.getElementById('roomNewHostelType').value.trim(),
                    code: '',
                    address: document.getElementById('roomNewHostelAddress').value.trim(),
                    contact: '',
                    wardenUserId: user.role === 'warden' ? user.id : '',
                    status: 'Active'
                });
                hostelId = newHostel.id;
                if (user.role === 'warden' && !user.hostelId) await dataStore.updateUser(user.id, { hostelId });
            }
            if (!hostelId) {
                alert('Please select an existing hostel or type a new hostel name.');
                return;
            }
            const roomData = {
                hostelId,
                hostelBlock: document.getElementById('roomBlock').value.trim(),
                floor: document.getElementById('roomFloor').value.trim(),
                roomNumber: document.getElementById('roomNo').value.trim(),
                totalBeds,
                occupiedBeds,
                available: occupiedBeds < totalBeds
            };
            if (id) await dataStore.updateRoom(id, roomData);
            else await dataStore.addRoom(roomData);
            modal.classList.remove('active');
            this.loadRooms();
        });
    }

    editRoom(id) {
        const room = dataStore.getRooms().find(item => item.id === id);
        if (!room) return;
        document.getElementById('roomModalTitle').textContent = 'Edit Room';
        document.getElementById('roomId').value = room.id;
        document.getElementById('roomHostelId').value = room.hostelId || '';
        document.getElementById('roomHostelId').disabled = true;
        document.getElementById('roomNewHostelName').disabled = true;
        document.getElementById('roomNewHostelType').disabled = true;
        document.getElementById('roomNewHostelAddress').disabled = true;
        document.getElementById('roomBlock').value = room.hostelBlock || '';
        document.getElementById('roomFloor').value = room.floor || '';
        document.getElementById('roomNo').value = room.roomNumber || '';
        document.getElementById('roomTotalBeds').value = room.totalBeds || 1;
        document.getElementById('roomOccupiedBeds').value = room.occupiedBeds || 0;
        document.getElementById('roomModal').classList.add('active');
    }

    async deleteRoom(id) {
        const room = dataStore.getRooms().find(item => item.id === id);
        if (!room) return;
        if (dataStore.getStudents().some(student => student.hostelId === room.hostelId && student.roomNumber === room.roomNumber && student.hostelBlock === room.hostelBlock)) {
            alert('This room has assigned students. Move them before deleting the room.');
            return;
        }
        if (!confirm('Are you sure you want to delete this room?')) return;
        await dataStore.deleteRecord('rooms', id);
        this.loadRooms();
    }

    attachStudentHandlers() {
        const addBtn = document.getElementById('addStudentBtn');
        const modal = document.getElementById('studentModal');
        const closeBtn = document.getElementById('closeStudentModal');
        const cancelBtn = document.getElementById('cancelStudentForm');
        const saveBtn = document.getElementById('saveStudent');

        addBtn?.addEventListener('click', () => {
            document.getElementById('studentModalTitle').textContent = 'Add Student';
            document.getElementById('studentForm').reset();
            document.getElementById('studentId').value = '';
            document.getElementById('studentHostelId').value = this.visibleHostels()[0]?.id || '';
            modal.classList.add('active');
        });

        closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
        cancelBtn?.addEventListener('click', () => modal.classList.remove('active'));

        saveBtn?.addEventListener('click', async () => {
            const form = document.getElementById('studentForm');
            if (!form.reportValidity()) return;

            const id = document.getElementById('studentId').value;
            const studentData = {
                name: document.getElementById('studentName').value.trim(),
                email: document.getElementById('studentEmail').value.trim(),
                phone: document.getElementById('studentPhone').value.trim(),
                guardianName: document.getElementById('guardianName').value.trim(),
                guardianPhone: document.getElementById('guardianPhone').value.trim(),
                joiningDate: document.getElementById('joiningDate').value,
                hostelId: document.getElementById('studentHostelId').value,
                hostelBlock: document.getElementById('hostelBlock').value,
                roomNumber: document.getElementById('roomNumber').value.trim(),
                bedNumber: document.getElementById('bedNumber').value.trim(),
                feeStatus: document.getElementById('feeStatus').value,
                status: document.getElementById('studentStatus').value,
                photo: dataStore.getStudentById(id)?.photo || ''
            };

            if (id) {
                await dataStore.updateStudent(id, studentData);
            } else {
                await dataStore.addStudent(studentData);
            }

            modal.classList.remove('active');
            this.loadStudents();
        });
    }

    editStudent(id) {
        const student = dataStore.getStudentById(id);
        if (!student) return;

        document.getElementById('studentModalTitle').textContent = 'Edit Student';
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentPhone').value = student.phone;
        document.getElementById('guardianName').value = student.guardianName;
        document.getElementById('guardianPhone').value = student.guardianPhone;
        document.getElementById('joiningDate').value = student.joiningDate;
        document.getElementById('studentHostelId').value = student.hostelId || this.visibleHostels()[0]?.id || '';
        document.getElementById('hostelBlock').value = student.hostelBlock;
        document.getElementById('roomNumber').value = student.roomNumber;
        document.getElementById('bedNumber').value = student.bedNumber;
        document.getElementById('feeStatus').value = student.feeStatus;
        document.getElementById('studentStatus').value = student.status || 'Active';
        document.getElementById('studentModal').classList.add('active');
    }

    async toggleStudentStatus(id, status) {
        const student = dataStore.getStudentById(id);
        if (!student) return;
        const action = status === 'Suspended' ? 'suspend' : 'activate';
        if (!confirm(`Are you sure you want to ${action} ${student.name}?`)) return;
        await dataStore.updateStudent(id, { status });
        const linkedUser = dataStore.getUsers().find(user => user.studentId === id || user.email === student.email);
        if (linkedUser) {
            await dataStore.updateUser(linkedUser.id, { status: status === 'Suspended' ? 'Suspended' : 'Approved' });
        }
        this.loadStudents();
    }

    async deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            await dataStore.deleteStudent(id);
            this.loadStudents();
        }
    }

    attachPaymentHandlers() {
        const modal = document.getElementById('paymentModal');
        document.getElementById('addPaymentBtn')?.addEventListener('click', () => {
            document.getElementById('paymentForm').reset();
            document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('paymentReceipt').value = `RCP${Date.now().toString().slice(-6)}`;
            modal.classList.add('active');
        });
        document.getElementById('closePaymentModal')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancelPaymentForm')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('savePayment')?.addEventListener('click', async () => {
            const form = document.getElementById('paymentForm');
            if (!form.reportValidity()) return;
            const studentId = document.getElementById('paymentStudentId').value;
            const student = dataStore.getStudentById(studentId);
            const proofFile = document.getElementById('paymentReceiptProof').files[0];
            if (proofFile && proofFile.size > 3 * 1024 * 1024) {
                alert('Receipt proof must be under 3 MB.');
                return;
            }
            const receiptProof = await this.readFileAsDataUrl(proofFile);
            await dataStore.addPayment({
                studentId,
                studentName: student.name,
                hostelId: student.hostelId,
                amount: Number(document.getElementById('paymentAmount').value),
                paymentDate: document.getElementById('paymentDate').value,
                paymentMethod: document.getElementById('paymentMethod').value,
                status: 'Pending',
                receipt: document.getElementById('paymentReceipt').value.trim(),
                receiptProof,
                submittedBy: authManager.getCurrentUser().name,
                submittedAt: new Date().toISOString()
            });
            modal.classList.remove('active');
            this.loadFees();
        });
    }

    async reviewPayment(id, status) {
        const user = authManager.getCurrentUser();
        const payment = dataStore.getPayments().find(item => item.id === id);
        if (!payment) return;
        const remark = prompt(`Add ${status.toLowerCase()} remark`, status === 'Approved' ? 'Payment verified by hostel office' : 'Payment proof rejected') || '';
        await dataStore.updatePayment(id, {
            status,
            staffRemark: remark,
            reviewedBy: user.name,
            reviewedAt: new Date().toISOString()
        });
        if (status === 'Approved') {
            await dataStore.updateStudent(payment.studentId, { feeStatus: 'Paid' });
        }
        await dataStore.refresh();
        this.loadFees();
    }

    attachComplaintHandlers() {
        const user = authManager.getCurrentUser();
        const isStaff = user.role === 'admin' || user.role === 'warden';
        const modal = document.getElementById('complaintModal');

        document.getElementById('addComplaintBtn')?.addEventListener('click', () => {
            document.getElementById('complaintForm').reset();
            modal.classList.add('active');
        });
        document.getElementById('closeComplaintModal')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancelComplaintForm')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('saveComplaint')?.addEventListener('click', async () => {
            const form = document.getElementById('complaintForm');
            if (!form.reportValidity()) return;

            let student = this.getCurrentStudent();
            if (isStaff) {
                student = dataStore.getStudentById(document.getElementById('complaintStudentId').value);
            }

            await dataStore.addComplaint({
                studentId: student?.id || user.studentId || '1',
                studentName: student?.name || user.name,
                category: document.getElementById('complaintCategory').value,
                subject: document.getElementById('complaintSubject').value.trim(),
                description: document.getElementById('complaintDescription').value.trim(),
                priority: document.getElementById('complaintPriority').value
            });

            modal.classList.remove('active');
            this.loadComplaints();
        });
    }

    async updateComplaintStatus(id, status) {
        const staffRemark = prompt('Staff remark for this update', status === 'Resolved' ? 'Issue resolved.' : `Status updated to ${status}`) || '';
        await dataStore.updateComplaint(id, {
            status,
            staffRemark,
            updatedAt: new Date().toISOString(),
            updatedBy: authManager.getCurrentUser().name
        });
        this.loadComplaints();
    }

    attachVisitorHandlers() {
        const user = authManager.getCurrentUser();
        const isStaff = user.role === 'admin' || user.role === 'warden';
        const modal = document.getElementById('visitorModal');

        document.getElementById('addVisitorBtn')?.addEventListener('click', () => {
            document.getElementById('visitorForm').reset();
            document.getElementById('visitorCheckIn').value = new Date().toISOString().slice(0, 16);
            modal.classList.add('active');
        });
        document.getElementById('closeVisitorModal')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('cancelVisitorForm')?.addEventListener('click', () => modal.classList.remove('active'));
        document.getElementById('saveVisitor')?.addEventListener('click', async () => {
            const form = document.getElementById('visitorForm');
            if (!form.reportValidity()) return;

            let student = this.getCurrentStudent();
            if (isStaff) {
                student = dataStore.getStudentById(document.getElementById('visitorStudentId').value);
            }

            await dataStore.addVisitor({
                studentId: student?.id || user.studentId || '1',
                studentName: student?.name || user.name,
                visitorName: document.getElementById('visitorName').value.trim(),
                relationship: document.getElementById('visitorRelationship').value.trim(),
                phone: document.getElementById('visitorPhone').value.trim(),
                purpose: document.getElementById('visitorPurpose').value.trim(),
                checkIn: document.getElementById('visitorCheckIn').value,
                checkOut: document.getElementById('visitorCheckOut').value
            });

            modal.classList.remove('active');
            this.loadVisitors();
        });
    }
}

let app;
document.addEventListener('DOMContentLoaded', async () => {
    await dataStore.ready;
    app = new App();
    window.app = app;
});
