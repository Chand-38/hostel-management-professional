// ========================================
// Hostel Management System - Authentication
// ========================================

class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // Login
    async login(email, password) {
        let user;

        try {
            const result = await dataStore.request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            user = result.user;
        } catch (error) {
            return { success: false, message: error.message || 'Unable to login' };
        }

        // Store session
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status || 'Approved',
            studentId: user.studentId || null
        };

        localStorage.setItem('hms_session', JSON.stringify(session));
        this.currentUser = session;

        return { success: true, user: session };
    }

    // Register
    async register(userData) {
        const existingUser = dataStore.getUserByEmail(userData.email);

        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = await dataStore.addUser(userData);

        return {
            success: true,
            user: newUser,
            message: 'Request sent. Admin approval is required before login.'
        };
    }

    // Logout
    logout() {
        localStorage.removeItem('hms_session');
        this.currentUser = null;
        window.location.href = '#/login';
    }

    // Get current user
    getCurrentUser() {
        const session = localStorage.getItem('hms_session');
        return session ? JSON.parse(session) : null;
    }

    // Check if authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Check if user has any of the roles
    hasAnyRole(roles) {
        return this.currentUser && roles.includes(this.currentUser.role);
    }

    updateSession(patch) {
        this.currentUser = { ...this.currentUser, ...patch };
        localStorage.setItem('hms_session', JSON.stringify(this.currentUser));
    }
}

// Export singleton
const authManager = new AuthManager();
