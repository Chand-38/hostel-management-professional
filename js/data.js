// ========================================
// Hostel Management System - Data Layer
// ========================================

const initialData = {
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
        { id: '1', studentId: '1', studentName: 'Raj Kumar', amount: 15000, paymentDate: '2024-01-15', paymentMethod: 'UPI', status: 'Completed', receipt: 'RCP001' },
        { id: '2', studentId: '3', studentName: 'Amit Patel', amount: 15000, paymentDate: '2024-03-10', paymentMethod: 'Bank Transfer', status: 'Completed', receipt: 'RCP002' }
    ],
    complaints: [
        { id: '1', studentId: '1', studentName: 'Raj Kumar', category: 'Maintenance', subject: 'AC not working', description: 'The air conditioner in room 101 is not cooling properly.', date: '2024-12-10', status: 'In Progress', priority: 'High' },
        { id: '2', studentId: '2', studentName: 'Priya Sharma', category: 'Food', subject: 'Mess food quality', description: 'The quality of mess food needs improvement.', date: '2024-12-12', status: 'Pending', priority: 'Medium' }
    ],
    visitors: [
        { id: '1', studentId: '1', studentName: 'Raj Kumar', visitorName: 'Mr. Kumar', relationship: 'Father', phone: '9876543211', purpose: 'Personal Visit', checkIn: '2024-12-13 10:00', checkOut: '2024-12-13 15:00', date: '2024-12-13' },
        { id: '2', studentId: '2', studentName: 'Priya Sharma', visitorName: 'Mrs. Sharma', relationship: 'Mother', phone: '9876543213', purpose: 'Parent-Teacher Meeting', checkIn: '2024-12-12 14:00', checkOut: '2024-12-12 17:00', date: '2024-12-12' }
    ],
    attendance: [],
    notices: [
        { id: '1', title: 'Mess timing update', message: 'Dinner timing is 7:30 PM to 9:30 PM from this week.', audience: 'All', priority: 'Normal', date: new Date().toISOString().slice(0, 10), createdBy: 'Admin User' }
    ],
    leaveRequests: [],
    roomRequests: [],
    users: [
        { id: '1', name: 'Admin User', email: 'admin@hostel.com', role: 'admin', status: 'Approved' },
        { id: '2', name: 'Raj Kumar', email: 'raj.kumar@example.com', role: 'student', studentId: '1', status: 'Approved' },
        { id: '3', name: 'Warden Singh', email: 'warden@hostel.com', role: 'warden', hostelId: 'h1', status: 'Approved' }
    ]
};

class DataStore {
    constructor() {
        this.state = JSON.parse(JSON.stringify(initialData));
        this.ready = this.initializeData();
    }

    async initializeData() {
        try {
            const data = await this.request('/api/bootstrap');
            this.state = this.normalizeData({ ...this.state, ...data });
            this.syncLocalCache();
        } catch (error) {
            this.loadLocalCache();
            this.state = this.normalizeData(this.state);
            this.syncLocalCache();
            console.warn('Backend unavailable, using browser storage fallback.', error);
        }
    }

    async refresh() {
        await this.initializeData();
        return this.state;
    }

    normalizeData(data) {
        const state = { ...initialData, ...data };
        state.hostels = Array.isArray(state.hostels) && state.hostels.length ? state.hostels : initialData.hostels;
        state.hostels = state.hostels.map(hostel => ({ type: '', ...hostel }));
        const defaultHostelId = state.hostels[0]?.id || 'h1';
        state.rooms = (state.rooms || []).map(room => ({
            ...room,
            hostelId: room.hostelId || defaultHostelId,
            floor: room.floor || '',
        }));
        state.students = (state.students || []).map(student => ({
            ...student,
            hostelId: student.hostelId || this.findHostelIdForRoom(state.rooms, student) || defaultHostelId,
        }));
        state.users = (state.users || []).map(user => ({
            ...user,
            hostelId: user.hostelId || (user.role === 'warden' ? defaultHostelId : user.hostelId)
        }));
        return state;
    }

    findHostelIdForRoom(rooms, student) {
        return rooms.find(room => room.hostelBlock === student.hostelBlock && room.roomNumber === student.roomNumber)?.hostelId;
    }

    async request(url, options = {}) {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options
        });

        const data = response.status === 204 ? null : await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Request failed');
        }
        return data;
    }

    loadLocalCache() {
        for (const key of Object.keys(initialData)) {
            const value = localStorage.getItem(`hms_${key}`);
            if (value) {
                this.state[key] = JSON.parse(value);
            } else {
                localStorage.setItem(`hms_${key}`, JSON.stringify(this.state[key]));
            }
        }
    }

    syncLocalCache() {
        for (const key of Object.keys(this.state)) {
            localStorage.setItem(`hms_${key}`, JSON.stringify(this.state[key]));
        }
    }

    getCollection(key) {
        return this.state[key] || [];
    }

    getHostels() {
        return this.getCollection('hostels');
    }

    getHostelById(id) {
        return this.getHostels().find(hostel => hostel.id === id);
    }

    addHostel(hostel) {
        return this.createRecord('hostels', hostel);
    }

    updateHostel(id, updatedData) {
        return this.updateRecord('hostels', id, updatedData);
    }

    deleteHostel(id) {
        return this.deleteRecord('hostels', id);
    }

    async createRecord(key, payload) {
        const fallback = { ...payload, id: Date.now().toString() };
        try {
            const saved = await this.request(`/api/${key}`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            this.state[key].push(saved);
            this.syncLocalCache();
            return saved;
        } catch (error) {
            if (key === 'complaints') {
                fallback.date = new Date().toISOString().split('T')[0];
                fallback.status = 'Pending';
            }
            if (key === 'visitors') {
                fallback.date = new Date().toISOString().split('T')[0];
            }
            this.state[key].push(fallback);
            this.syncLocalCache();
            return fallback;
        }
    }

    async updateRecord(key, id, payload) {
        const index = this.state[key].findIndex(item => item.id === id);
        if (index === -1) return null;
        this.state[key][index] = { ...this.state[key][index], ...payload };
        this.syncLocalCache();

        try {
            const saved = await this.request(`/api/${key}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            this.state[key][index] = saved;
            this.syncLocalCache();
            return saved;
        } catch (error) {
            return this.state[key][index];
        }
    }

    async deleteRecord(key, id) {
        this.state[key] = this.state[key].filter(item => item.id !== id);
        this.syncLocalCache();

        try {
            await this.request(`/api/${key}/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.warn(`Could not delete ${key} record on backend.`, error);
        }

        return true;
    }

    getStudents() {
        return this.getCollection('students');
    }

    addStudent(student) {
        return this.createRecord('students', student);
    }

    updateStudent(id, updatedData) {
        return this.updateRecord('students', id, updatedData);
    }

    deleteStudent(id) {
        return this.deleteRecord('students', id);
    }

    getStudentById(id) {
        return this.getStudents().find(student => student.id === id);
    }

    getRooms() {
        return this.getCollection('rooms');
    }

    addRoom(room) {
        return this.createRecord('rooms', room);
    }

    updateRoom(id, updatedData) {
        return this.updateRecord('rooms', id, updatedData);
    }

    getPayments() {
        return this.getCollection('payments');
    }

    addPayment(payment) {
        return this.createRecord('payments', payment);
    }

    getComplaints() {
        return this.getCollection('complaints');
    }

    addComplaint(complaint) {
        return this.createRecord('complaints', complaint);
    }

    updateComplaint(id, updatedData) {
        return this.updateRecord('complaints', id, updatedData);
    }

    getVisitors() {
        return this.getCollection('visitors');
    }

    addVisitor(visitor) {
        return this.createRecord('visitors', visitor);
    }

    getNotices() {
        return this.getCollection('notices');
    }

    addNotice(notice) {
        return this.createRecord('notices', notice);
    }

    deleteNotice(id) {
        return this.deleteRecord('notices', id);
    }

    getLeaveRequests() {
        return this.getCollection('leaveRequests');
    }

    addLeaveRequest(request) {
        return this.createRecord('leaveRequests', request);
    }

    updateLeaveRequest(id, updatedData) {
        return this.updateRecord('leaveRequests', id, updatedData);
    }

    getRoomRequests() {
        return this.getCollection('roomRequests');
    }

    addRoomRequest(request) {
        return this.createRecord('roomRequests', request);
    }

    updateRoomRequest(id, updatedData) {
        return this.updateRecord('roomRequests', id, updatedData);
    }

    getAttendance() {
        return this.getCollection('attendance');
    }

    async getAttendanceByDate(date) {
        try {
            return await this.request(`/api/attendance?date=${encodeURIComponent(date)}`);
        } catch (error) {
            return this.getStudents().map(student => {
                const record = this.state.attendance.find(item => item.date === date && item.studentId === student.id);
                return record || {
                    date,
                    studentId: student.id,
                    studentName: student.name,
                    hostelBlock: student.hostelBlock,
                    roomNumber: student.roomNumber,
                    status: 'Present',
                    remarks: ''
                };
            });
        }
    }

    async markAttendance(date, records, markedBy) {
        try {
            const result = await this.request('/api/attendance/mark', {
                method: 'POST',
                body: JSON.stringify({ date, records, markedBy })
            });
            for (const record of result.records) {
                const index = this.state.attendance.findIndex(item => item.date === record.date && item.studentId === record.studentId);
                if (index >= 0) this.state.attendance[index] = record;
                else this.state.attendance.push(record);
            }
            this.syncLocalCache();
            return result.records;
        } catch (error) {
            const saved = records.map(record => {
                const student = this.getStudentById(record.studentId);
                return {
                    ...record,
                    id: `${date}-${record.studentId}`,
                    date,
                    studentName: student?.name || record.studentName,
                    hostelBlock: student?.hostelBlock || record.hostelBlock,
                    roomNumber: student?.roomNumber || record.roomNumber,
                    markedBy,
                    markedAt: new Date().toISOString()
                };
            });
            for (const record of saved) {
                const index = this.state.attendance.findIndex(item => item.date === record.date && item.studentId === record.studentId);
                if (index >= 0) this.state.attendance[index] = record;
                else this.state.attendance.push(record);
            }
            this.syncLocalCache();
            return saved;
        }
    }

    getUsers() {
        return this.getCollection('users');
    }

    getUserByEmail(email) {
        return this.getUsers().find(user => user.email === email);
    }

    async addUser(user) {
        try {
            const endpoint = user.role === 'admin' || user.role === 'warden' ? '/api/users' : '/api/auth/register';
            const result = await this.request(endpoint, {
                method: 'POST',
                body: JSON.stringify(user)
            });
            this.state.users.push(result.user || result);
            this.syncLocalCache();
            return result.user || result;
        } catch (error) {
            const fallback = {
                ...user,
                id: Date.now().toString(),
                role: user.role === 'admin' || user.role === 'warden' ? user.role : 'student',
                status: user.role === 'admin' || user.role === 'warden' ? 'Approved' : 'Pending'
            };
            delete fallback.password;
            this.state.users.push(fallback);
            this.syncLocalCache();
            return fallback;
        }
    }

    updateUser(id, updatedData) {
        return this.updateRecord('users', id, updatedData);
    }

    deleteUser(id) {
        return this.deleteRecord('users', id);
    }

    getDashboardStats() {
        const students = this.getStudents();
        const rooms = this.getRooms();
        const complaints = this.getComplaints();
        const payments = this.getPayments();

        const totalBeds = rooms.reduce((sum, room) => sum + room.totalBeds, 0);
        const occupiedBeds = rooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
        const availableBeds = totalBeds - occupiedBeds;
        const pendingComplaints = complaints.filter(complaint => complaint.status === 'Pending').length;
        const monthlyRevenue = payments
            .filter(payment => {
                const paymentDate = new Date(payment.paymentDate);
                const now = new Date();
                return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

        return {
            totalStudents: students.length,
            availableBeds,
            occupiedBeds,
            totalBeds,
            pendingComplaints,
            monthlyRevenue,
            totalComplaints: complaints.length,
            totalPayments: payments.length
        };
    }
}

const dataStore = new DataStore();
