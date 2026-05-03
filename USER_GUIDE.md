# 📖 Hostel Management System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Features Guide](#features-guide)
4. [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Login

1. **Open the Application**
   - Open `index.html` in your web browser
   - You'll be greeted with the login page

2. **Choose Your Role**
   - Use the appropriate credentials based on your role (see [Demo Credentials](#demo-credentials))

3. **Navigate the Dashboard**
   - After login, you'll see the dashboard with key statistics
   - Use the sidebar menu to navigate between different sections

### Demo Credentials

#### 👨‍💼 Admin
```
Email: admin@hostel.com
Password: admin123
```
**Capabilities:** Full access to all features

#### 🏫 Warden
```
Email: warden@hostel.com
Password: warden123
```
**Capabilities:** Manage students, rooms, fees, complaints, and visitors

#### 🎓 Student
```
Email: raj.kumar@example.com
Password: student123
```
**Capabilities:** View dashboard, submit complaints, view visitor logs

## User Roles

### Admin Role
**Full System Access**

- ✅ View Dashboard & Statistics
- ✅ Manage Students (Add/Edit/Delete)
- ✅ View Room Allocation
- ✅ Manage Fees & Payments
- ✅ Handle Complaints (View/Update Status)
- ✅ Manage Visitor Logs

### Warden Role
**Management Access**

- ✅ View Dashboard & Statistics
- ✅ Manage Students (Add/Edit/Delete)
- ✅ View Room Allocation
- ✅ Manage Fees & Payments
- ✅ Handle Complaints (View/Update Status)
- ✅ Manage Visitor Logs

### Student Role
**Limited Access**

- ✅ View Dashboard
- ✅ Submit Complaints
- ✅ View Complaints Status
- ✅ View Visitor Logs
- ❌ Cannot manage other students
- ❌ Cannot manage rooms or fees

## Features Guide

### 📊 Dashboard

**What You'll See:**
- **Statistics Cards**: Key metrics at a glance
  - Total Students
  - Available Beds
  - Pending Complaints
  - Monthly Revenue

- **Welcome Section**: Personalized greeting with your role

- **Recent Activities**: Quick overview of system activities

**How to Use:**
- Simply navigate to Dashboard from the sidebar
- Statistics update automatically based on system data

---

### 👥 Student Management

#### Adding a New Student

1. **Navigate to Students**
   - Click "Students" in the sidebar menu

2. **Click "Add Student" Button**
   - Located in the top-right corner

3. **Fill in the Form**
   Required fields:
   - Full Name
   - Email
   - Phone Number
   - Guardian Name
   - Guardian Phone
   - Joining Date
   - Hostel Block (A, B, or C)
   - Room Number
   - Bed Number
   - Fee Status (Paid/Pending)

4. **Save**
   - Click "Save Student" button
   - The modal will close and the student will appear in the table

#### Editing a Student

1. **Find the Student**
   - Locate the student in the students table

2. **Click "Edit" Button**
   - The form will open with pre-filled data

3. **Modify Information**
   - Update any fields as needed

4. **Save Changes**
   - Click "Save Student" to update

#### Deleting a Student

1. **Find the Student**
   - Locate the student in the students table

2. **Click "Delete" Button**
   - Confirm the deletion when prompted

> [!WARNING]
> Deleting a student is permanent and cannot be undone!

---

### 🏠 Room Management

**View Room Occupancy:**

1. **Navigate to Rooms**
   - Click "Rooms" in the sidebar

2. **View by Block**
   - Rooms are organized by hostel block (A, B, C)
   - Each room shows:
     - Room Number
     - Total Beds
     - Occupied Beds
     - Available Beds
     - Status Badge (Available/Full)

**Status Indicators:**
- 🟢 **Green Badge (Available)**: Room has vacant beds
- 🔴 **Red Badge (Full)**: Room is fully occupied

> [!NOTE]
> Room occupancy is automatically calculated based on student allocations. To free up a bed, remove or relocate the student from Student Management.

---

### 💰 Fees & Payment Tracking

#### Recording a Payment

1. **Navigate to Fees & Payments**
   - Click "Fees & Payments" in the sidebar

2. **Click "Record Payment"**
   - Fill in payment details:
     - Student Name
     - Amount (₹)
     - Payment Date
     - Payment Method (UPI/Bank Transfer/Cash)

3. **Submit**
   - Payment will be recorded with a unique receipt number

#### Viewing Payment History

- **Payment Table Shows:**
  - Receipt Number
  - Student Name
  - Amount (₹)
  - Payment Date
  - Payment Method
  - Status

- **Filtering Tips:**
  - Payments are displayed in chronological order
  - Receipt numbers are auto-generated (RCP001, RCP002, etc.)

---

### 📝 Complaint Management

#### Submitting a Complaint (Students)

1. **Navigate to Complaints**
   - Click "Complaints" in the sidebar

2. **Click "New Complaint"**
   - A modal form will open

3. **Fill in Details**
   - **Category**: Select from:
     - Maintenance
     - Food
     - Cleanliness
     - Security
     - Other
   
   - **Subject**: Brief title of the issue
   
   - **Description**: Detailed explanation of the problem
   
   - **Priority**: Choose severity
     - Low (Minor issues)
     - Medium (Moderate concerns)
     - High (Urgent problems)

4. **Submit**
   - Click "Submit Complaint"
   - You'll see a confirmation

#### Managing Complaints (Admin/Warden)

1. **View All Complaints**
   - Navigate to Complaints section
   - See complete list with:
     - Date
     - Student Name
     - Category
     - Subject
     - Priority Badge
     - Current Status

2. **Update Status**
   - Use the dropdown in the "Action" column
   - Select new status:
     - **Pending**: Just submitted, not yet addressed
     - **In Progress**: Being worked on
     - **Resolved**: Issue fixed

3. **Priority Indicators**
   - 🔴 High Priority (Red Badge)
   - 🟡 Medium Priority (Orange Badge)
   - 🔵 Low Priority (Blue Badge)

---

### 👤 Visitor Log System

#### Adding a Visitor Entry

1. **Navigate to Visitor Log**
   - Click "Visitor Log" in the sidebar

2. **Click "Add Visitor"**
   - Modal form opens

3. **Fill in Information**
   - **Student**: Select who is being visited
   - **Visitor Name**: Name of the visitor
   - **Relationship**: e.g., Father, Mother, Friend
   - **Phone**: Visitor's contact number
   - **Purpose**: Reason for visit
   - **Check-in Time**: When visitor arrived
   - **Check-out Time**: When visitor left (optional)

4. **Save**
   - Click "Save Visitor"
   - Entry is logged with date/time

#### Viewing Visitor History

- **Table Shows:**
  - Visit Date
  - Visitor Name
  - Student Visited
  - Relationship
  - Phone Number
  - Purpose of Visit
  - Check-in Time
  - Check-out Time

- **Use Cases:**
  - Track who visited students
  - Security purposes
  - Parent-teacher meeting logs
  - Emergency contact history

---

## Common Tasks

### How to Check a Student's Fee Status

1. Go to **Students** section
2. Find the student in the table
3. Check the "Fee Status" column
   - 🟢 **Green Badge (Paid)**: Fees are up to date
   - 🟡 **Orange Badge (Pending)**: Payment pending

### How to Find Available Rooms

1. Go to **Rooms** section
2. Look for rooms with:
   - Green "Available" badge
   - Available count > 0

### How to Track Complaint Resolution

1. Go to **Complaints** section
2. Check the "Status" column
3. Filter mentally by color:
   - 🔴 Red (Pending): Not started
   - 🟡 Orange (In Progress): Being worked on
   - 🟢 Green (Resolved): Completed

### How to Logout

1. Look at the sidebar bottom
2. Click the **"Logout"** button
3. You'll be redirected to the login page

---

## Tips & Best Practices

### For Admins/Wardens

✅ **Regular Updates**
- Update complaint statuses promptly
- Keep payment records current
- Verify room allocations regularly

✅ **Data Accuracy**
- Double-check student information before saving
- Ensure guardian contact details are accurate
- Verify bed assignments to avoid conflicts

✅ **Monitor Statistics**
- Check dashboard regularly for pending complaints
- Track monthly revenue trends
- Monitor bed occupancy rates

### For Students

✅ **Complaint Submission**
- Be specific in complaint descriptions
- Choose appropriate priority levels
- Check status regularly for updates

✅ **Visitor Logs**
- Inform in advance when expecting visitors
- Ensure visitor information is accurate

---

## Troubleshooting

### Login Issues

**Problem:** Cannot log in with credentials

**Solutions:**
1. Verify you're using correct email and password
2. Check for typos (email is case-sensitive)
3. Ensure JavaScript is enabled in browser
4. Clear browser cache and try again
5. Try incognito/private browsing mode

---

### Data Not Saving

**Problem:** Changes don't persist after refresh

**Solutions:**
1. Check if LocalStorage is enabled in browser
2. Ensure you're not in private/incognito mode
3. Verify browser storage isn't full
4. Check browser console for errors (F12)

---

### Missing Students/Data

**Problem:** Previously added data disappeared

**Solutions:**
1. Check if browser cache/storage was cleared
2. Verify you're using the same browser
3. Check if you're in the correct device
4. Note: LocalStorage is browser and device-specific

---

### Modal Won't Close

**Problem:** Form modal is stuck open

**Solutions:**
1. Click the "Cancel" button
2. Click the "×" button in top-right of modal
3. Press "Escape" key
4. Refresh the page if necessary

---

### Page Not Loading

**Problem:** Blank page or navigation not working

**Solutions:**
1. Check browser console for JavaScript errors (F12)
2. Ensure all files (HTML, CSS, JS) are present
3. Verify file paths are correct
4. Clear browser cache
5. Try different browser

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Close Modal | `Esc` |
| Submit Form | `Enter` (when focused on form) |
| Navigate Links | `Tab` (cycle through) |

---

## Data Backup

### Export Data (Manual)

1. Open browser console (F12)
2. Type:
   ```javascript
   localStorage.getItem('hms_students')
   ```
3. Copy the output
4. Save to text file

### Import Data (Manual)

1. Open browser console (F12)
2. Type:
   ```javascript
   localStorage.setItem('hms_students', 'PASTE_YOUR_DATA_HERE')
   ```
3. Refresh page

> [!WARNING]
> **Always backup data before clearing browser storage!**

---

## Support & Feedback

If you encounter issues not covered in this guide:

1. Check the [README.md](README.md) for technical details
2. Review browser console for error messages
3. Contact your system administrator
4. Submit an issue in the project repository

---

**Need More Help?**

- 📧 Email: support@hostel.com
- 📱 Phone: Contact your hostel administration
- 💬 In-Person: Visit the warden's office

---

*User Guide Version 1.0 - Last Updated: December 2024*
