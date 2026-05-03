# 🔧 API Reference & Technical Documentation

## Overview

This document provides technical details about the Hostel Management System's architecture, classes, methods, and data structures.

## Table of Contents

1. [Data Layer (data.js)](#data-layer)
2. [Authentication (auth.js)](#authentication-layer)
3. [Application Logic (app.js)](#application-layer)
4. [Data Structures](#data-structures)
5. [LocalStorage Schema](#localstorage-schema)

---

## Data Layer

### Class: `DataStore`

**Location:** `js/data.js`

The DataStore class manages all data operations and LocalStorage interactions.

#### Constructor

```javascript
constructor()
```

Initializes the data store and seeds initial data if not present.

#### Methods

##### Student Operations

```javascript
getStudents()
```
- **Returns:** `Array<Student>` - All students
- **Description:** Retrieves all student records from LocalStorage

```javascript
getStudentById(id)
```
- **Parameters:** `id` (String) - Student ID
- **Returns:** `Student | undefined` - Student object or undefined
- **Description:** Finds a specific student by ID

```javascript
addStudent(student)
```
- **Parameters:** `student` (Object) - Student data
- **Returns:** `Student` - Created student with generated ID
- **Description:** Adds a new student to the system
- **Side Effects:** Generates ID using `Date.now()`, updates LocalStorage

```javascript
updateStudent(id, updatedData)
```
- **Parameters:** 
  - `id` (String) - Student ID
  - `updatedData` (Object) - Fields to update
- **Returns:** `Student | null` - Updated student or null if not found
- **Description:** Updates an existing student's information

```javascript
deleteStudent(id)
```
- **Parameters:** `id` (String) - Student ID
- **Returns:** `Boolean` - true on success
- **Description:** Removes a student from the system

##### Room Operations

```javascript
getRooms()
```
- **Returns:** `Array<Room>` - All room records
- **Description:** Retrieves all room information

```javascript
updateRoom(id, updatedData)
```
- **Parameters:**
  - `id` (String) - Room ID
  - `updatedData` (Object) - Fields to update
- **Returns:** `Room | null` - Updated room or null
- **Description:** Updates room information (occupancy, availability, etc.)

##### Payment Operations

```javascript
getPayments()
```
- **Returns:** `Array<Payment>` - All payment records
- **Description:** Retrieves all payment history

```javascript
addPayment(payment)
```
- **Parameters:** `payment` (Object) - Payment data
- **Returns:** `Payment` - Created payment record
- **Description:** Records a new payment transaction

##### Complaint Operations

```javascript
getComplaints()
```
- **Returns:** `Array<Complaint>` - All complaints
- **Description:** Retrieves all complaint records

```javascript
addComplaint(complaint)
```
- **Parameters:** `complaint` (Object) - Complaint data
- **Returns:** `Complaint` - Created complaint
- **Description:** Submits a new complaint
- **Side Effects:** Sets date to current date, status to "Pending"

```javascript
updateComplaint(id, updatedData)
```
- **Parameters:**
  - `id` (String) - Complaint ID
  - `updatedData` (Object) - Fields to update
- **Returns:** `Complaint | null` - Updated complaint
- **Description:** Updates complaint status or details

##### Visitor Operations

```javascript
getVisitors()
```
- **Returns:** `Array<Visitor>` - All visitor logs
- **Description:** Retrieves all visitor records

```javascript
addVisitor(visitor)
```
- **Parameters:** `visitor` (Object) - Visitor data
- **Returns:** `Visitor` - Created visitor record
- **Description:** Logs a new visitor entry

##### User Operations

```javascript
getUsers()
```
- **Returns:** `Array<User>` - All user accounts
- **Description:** Retrieves all system users

```javascript
getUserByEmail(email)
```
- **Parameters:** `email` (String) - User email
- **Returns:** `User | undefined` - User object or undefined
- **Description:** Finds a user by email address

```javascript
addUser(user)
```
- **Parameters:** `user` (Object) - User data
- **Returns:** `User` - Created user account
- **Description:** Registers a new user

##### Analytics

```javascript
getDashboardStats()
```
- **Returns:** `DashboardStats` - Calculated statistics
- **Description:** Calculates and returns dashboard metrics
- **Returned Object:**
  ```javascript
  {
    totalStudents: Number,
    availableBeds: Number,
    occupiedBeds: Number,
    totalBeds: Number,
    pendingComplaints: Number,
    monthlyRevenue: Number,
    totalComplaints: Number,
    totalPayments: Number
  }
  ```

---

## Authentication Layer

### Class: `AuthManager`

**Location:** `js/auth.js`

Manages user authentication and session management.

#### Constructor

```javascript
constructor()
```

Initializes authentication manager and loads current session.

#### Properties

```javascript
currentUser: User | null
```

The currently logged-in user, or null if not authenticated.

#### Methods

```javascript
login(email, password)
```
- **Parameters:**
  - `email` (String) - User email
  - `password` (String) - User password
- **Returns:** `LoginResult`
  ```javascript
  {
    success: Boolean,
    message?: String,
    user?: User
  }
  ```
- **Description:** Authenticates user and creates session
- **Side Effects:** Stores session in LocalStorage

```javascript
logout()
```
- **Returns:** void
- **Description:** Logs out current user and redirects to login
- **Side Effects:** Clears session from LocalStorage, sets `currentUser` to null

```javascript
register(userData)
```
- **Parameters:** `userData` (Object) - New user data
- **Returns:** `RegisterResult`
  ```javascript
  {
    success: Boolean,
    message?: String,
    user?: User
  }
  ```
- **Description:** Registers a new user account
- **Validation:** Checks for existing email

```javascript
getCurrentUser()
```
- **Returns:** `User | null` - Current user or null
- **Description:** Retrieves current user from session storage

```javascript
isAuthenticated()
```
- **Returns:** `Boolean` - true if user is logged in
- **Description:** Checks if a user session exists

```javascript
hasRole(role)
```
- **Parameters:** `role` (String) - Role to check
- **Returns:** `Boolean` - true if current user has the role
- **Description:** Checks if user has a specific role

```javascript
hasAnyRole(roles)
```
- **Parameters:** `roles` (Array<String>) - Array of roles
- **Returns:** `Boolean` - true if user has any of the roles
- **Description:** Checks if user has at least one of the specified roles

---

## Application Layer

### Class: `App`

**Location:** `js/app.js`

Main application controller managing routing, rendering, and user interactions.

#### Constructor

```javascript
constructor()
```

Initializes the application and sets up routing.

#### Properties

```javascript
currentPage: String
```

Current active page/route.

#### Methods

##### Core Methods

```javascript
init()
```
- **Returns:** void
- **Description:** Sets up event listeners for routing

```javascript
router()
```
- **Returns:** void
- **Description:** Hash-based router that handles navigation
- **Routes:**
  - `/login` - Login page
  - `/register` - Registration page
  - `/dashboard` - Main dashboard
  - `/students` - Student management
  - `/rooms` - Room management
  - `/fees` - Fee tracking
  - `/complaints` - Complaint system
  - `/visitors` - Visitor logs

```javascript
render()
```
- **Returns:** void
- **Description:** Renders the current page based on route

##### Page Rendering Methods

```javascript
getLoginPage()
```
- **Returns:** `String` - HTML for login page
- **Description:** Generates login page HTML

```javascript
getRegisterPage()
```
- **Returns:** `String` - HTML for registration page
- **Description:** Generates registration page HTML

```javascript
getAppLayout()
```
- **Returns:** `String` - HTML for main app layout
- **Description:** Generates app layout with sidebar and navigation

```javascript
loadDashboard()
```
- **Returns:** void
- **Description:** Renders dashboard with statistics

```javascript
loadStudents()
```
- **Returns:** void
- **Description:** Renders student management page

```javascript
loadRooms()
```
- **Returns:** void
- **Description:** Renders room management page

```javascript
loadFees()
```
- **Returns:** void
- **Description:** Renders fee tracking page

```javascript
loadComplaints()
```
- **Returns:** void
- **Description:** Renders complaints page

```javascript
loadVisitors()
```
- **Returns:** void
- **Description:** Renders visitor log page

##### Event Handler Attachment

```javascript
attachLoginHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for login form

```javascript
attachRegisterHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for registration form

```javascript
attachNavHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for navigation

```javascript
attachStudentHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for student management

```javascript
attachComplaintHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for complaint forms

```javascript
attachVisitorHandlers()
```
- **Returns:** void
- **Description:** Attaches event listeners for visitor forms

##### CRUD Operations

```javascript
editStudent(id)
```
- **Parameters:** `id` (String) - Student ID
- **Returns:** void
- **Description:** Opens edit modal with student data

```javascript
deleteStudent(id)
```
- **Parameters:** `id` (String) - Student ID
- **Returns:** void
- **Description:** Deletes a student after confirmation

```javascript
updateComplaintStatus(id, status)
```
- **Parameters:**
  - `id` (String) - Complaint ID
  - `status` (String) - New status
- **Returns:** void
- **Description:** Updates complaint status and refreshes view

---

## Data Structures

### Student

```javascript
{
  id: String,              // Unique identifier (timestamp)
  name: String,            // Full name
  email: String,           // Email address
  phone: String,           // Phone number
  guardianName: String,    // Guardian's full name
  guardianPhone: String,   // Guardian's phone number
  hostelBlock: String,     // 'A', 'B', or 'C'
  roomNumber: String,      // Room number
  bedNumber: String,       // Bed number
  joiningDate: String,     // ISO date string
  feeStatus: String,       // 'Paid' or 'Pending'
  photo: String            // Data URL or path
}
```

### Room

```javascript
{
  id: String,              // Unique identifier
  hostelBlock: String,     // 'A', 'B', or 'C'
  roomNumber: String,      // Room number
  totalBeds: Number,       // Total bed capacity
  occupiedBeds: Number,    // Currently occupied beds
  available: Boolean       // true if has vacant beds
}
```

### Payment

```javascript
{
  id: String,              // Unique identifier
  studentId: String,       // Reference to student
  studentName: String,     // Student name (denormalized)
  amount: Number,          // Payment amount in rupees
  paymentDate: String,     // ISO date string
  paymentMethod: String,   // 'UPI', 'Bank Transfer', 'Cash'
  status: String,          // 'Completed', 'Pending', 'Failed'
  receipt: String          // Unique receipt number
}
```

### Complaint

```javascript
{
  id: String,              // Unique identifier
  studentId: String,       // Reference to student
  studentName: String,     // Student name (denormalized)
  category: String,        // 'Maintenance', 'Food', 'Cleanliness', 'Security', 'Other'
  subject: String,         // Brief title
  description: String,     // Detailed description
  date: String,            // ISO date string
  status: String,          // 'Pending', 'In Progress', 'Resolved'
  priority: String         // 'Low', 'Medium', 'High'
}
```

### Visitor

```javascript
{
  id: String,              // Unique identifier
  studentId: String,       // Reference to student
  studentName: String,     // Student name (denormalized)
  visitorName: String,     // Visitor's full name
  relationship: String,    // Relationship to student
  phone: String,           // Visitor's phone number
  purpose: String,         // Purpose of visit
  checkIn: String,         // ISO datetime string
  checkOut: String,        // ISO datetime string or null
  date: String             // ISO date string
}
```

### User

```javascript
{
  id: String,              // Unique identifier
  name: String,            // Full name
  email: String,           // Email address (unique)
  password: String,        // Plain text (NOT for production!)
  role: String,            // 'admin', 'warden', 'student'
  studentId?: String       // Reference to student (if role is student)
}
```

---

## LocalStorage Schema

### Storage Keys

| Key | Description | Data Type |
|-----|-------------|-----------|
| `hms_students` | All student records | `Array<Student>` |
| `hms_rooms` | All room records | `Array<Room>` |
| `hms_payments` | All payment records | `Array<Payment>` |
| `hms_complaints` | All complaint records | `Array<Complaint>` |
| `hms_visitors` | All visitor records | `Array<Visitor>` |
| `hms_users` | All user accounts | `Array<User>` |
| `hms_session` | Current user session | `User | null` |

### Data Format

All data is stored as **JSON strings** in LocalStorage.

Example:
```javascript
// Stored
localStorage.setItem('hms_students', JSON.stringify(studentsArray));

// Retrieved
const students = JSON.parse(localStorage.getItem('hms_students'));
```

---

## Routing System

### Hash-Based Routing

The application uses hash-based routing (`#/route`) to enable SPA navigation without page reloads.

**Route Format:**
```
#/[page]
```

**Available Routes:**
- `#/login` - Login page
- `#/register` - Registration
- `#/dashboard` - Main dashboard
- `#/students` - Student management
- `#/rooms` - Room overview
- `#/fees` - Fee tracking
- `#/complaints` - Complaint system
- `#/visitors` - Visitor logs

**Protected Routes:**

All routes except `/login` and `/register` require authentication. The router checks `authManager.isAuthenticated()` and redirects to login if needed.

**Role-Based Access:**

Certain UI elements are hidden based on user role:
- Students see limited navigation (only Dashboard, Complaints, Visitors)
- Admin/Warden see all navigation items

---

## Security Considerations

> [!CAUTION]
> **This implementation is for demonstration/educational purposes only!**

### Current Security Limitations

1. **Plain Text Passwords**
   - Passwords stored without hashing
   - **Fix:** Implement bcrypt or Argon2 hashing

2. **Client-Side Only**
   - All authentication done in browser
   - **Fix:** Implement server-side authentication

3. **LocalStorage Exposure**
   - Sensitive data accessible via DevTools
   - **Fix:** Move to secure backend database

4. **No XSS Protection**
   - Limited input sanitization
   - **Fix:** Implement proper input validation and sanitization

5. **No CSRF Protection**
   - Not applicable (no backend), but required for production
   - **Fix:** Implement CSRF tokens with backend

### Recommended Production Security

```javascript
// Example: Hash passwords (pseudo-code)
import bcrypt from 'bcryptjs';

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

---

## Error Handling

### Current Implementation

- Basic try-catch blocks
- Alert-based error messages
- Console logging for debugging

### Best Practices for Enhancement

```javascript
// Centralized error handler
class ErrorHandler {
  static handle(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly message
    this.showNotification({
      type: 'error',
      message: this.getUserMessage(error)
    });
    
    // Log to server (in production)
    this.logToServer(error, context);
  }
  
  static getUserMessage(error) {
    // Map technical errors to user-friendly messages
    const messages = {
      'NetworkError': 'Please check your internet connection',
      'ValidationError': 'Please check your input',
      'AuthError': 'Please log in again'
    };
    
    return messages[error.name] || 'Something went wrong';
  }
}
```

---

## Performance Considerations

### Current Optimizations

1. **Single Load:** Data loaded once on page load
2. **LocalStorage:** Fast local data access
3. **Minimal DOM Updates:** Selective rendering

### Optimization Opportunities

1. **Virtual Scrolling** for large student lists
2. **Debouncing** search inputs
3. **Lazy Loading** for different sections
4. **Service Workers** for offline support
5. **IndexedDB** for larger datasets

---

## Extending the System

### Adding a New Entity

1. **Define Data Structure** (in this document)
2. **Add to Initial Data** (`data.js`)
3. **Create Data Methods** in `DataStore` class
4. **Create Page Rendering** in `App` class
5. **Add Route** in `router()` method
6. **Add Navigation** in `getAppLayout()`

### Example: Adding "Staff" Entity

```javascript
// 1. data.js - Add to initialData
staff: [
  {
    id: '1',
    name: 'Staff Member',
    role: 'Security',
    phone: '1234567890'
  }
]

// 2. data.js - Add methods
getStaff() {
  return this.getData('staff');
}

addStaff(staff) {
  const staffList = this.getStaff();
  staff.id = Date.now().toString();
  staffList.push(staff);
  this.setData('staff', staffList);
  return staff;
}

// 3. app.js - Add route
case 'staff':
  appContainer.innerHTML = this.getAppLayout();
  this.loadStaff();
  this.attachNavHandlers();
  break;

// 4. app.js - Add rendering method
loadStaff() {
  const staff = dataStore.getStaff();
  // ... render staff list
}
```

---

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Logout functionality
- [ ] Session persistence across refresh

#### Student Management
- [ ] Add new student
- [ ] Edit student information
- [ ] Delete student
- [ ] View student list
- [ ] Form validation

#### Room Management
- [ ] View all rooms
- [ ] Check occupancy calculation
- [ ] Availability status

#### Fee Tracking
- [ ] Record payment
- [ ] View payment history
- [ ] Receipt generation

#### Complaints
- [ ] Submit complaint
- [ ] Update status (Admin)
- [ ] View complaint list
- [ ] Priority and status badges

#### Visitor Logs
- [ ] Add visitor entry
- [ ] View visitor history
- [ ] Check-in/check-out tracking

---

## Browser Developer Tools

### Useful Console Commands

```javascript
// View all students
console.table(JSON.parse(localStorage.getItem('hms_students')));

// View current session
console.log(JSON.parse(localStorage.getItem('hms_session')));

// Clear all data
Object.keys(localStorage)
  .filter(key => key.startsWith('hms_'))
  .forEach(key => localStorage.removeItem(key));

// Reset to initial data
location.reload();
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial release |

---

*API Reference Version 1.0 - Last Updated: December 2024*
