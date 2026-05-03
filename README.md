# ðŸ¢ Hostel Management System

A comprehensive, modern web-based Hostel Management System (HMS) built with vanilla JavaScript, HTML, and CSS. This Single Page Application (SPA) provides a complete solution for managing hostel operations including student management, room allocation, fee tracking, complaint handling, and visitor logs.

![Hostel Management System](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## âœ¨ Features

### ðŸ” Authentication & Role-Based Access
- Secure login/logout system
- Role-based access control (Admin, Warden, Student)
- Session management using LocalStorage
- Protected routes based on user roles

### ðŸ‘¥ Student Management
- Complete CRUD operations for student records
- Student information including:
  - Personal details (Name, Email, Phone)
  - Guardian information
  - Room allocation (Block, Room Number, Bed Number)
  - Fee status tracking
  - Joining date
- Easy-to-use modal forms for adding/editing students
- Real-time data updates

### ðŸ  Room & Bed Management
- Multi-block hostel structure (Block A, B, C)
- Room occupancy tracking
- Bed allocation system
- Real-time availability status
- Total/Occupied/Available bed counts per room
- Visual status indicators for room availability

### ðŸ’° Fees & Payment Tracking
- Payment record management
- Receipt generation with unique IDs
- Multiple payment methods (UPI, Bank Transfer, Cash)
- Payment status tracking
- Monthly revenue calculations
- Student-wise fee status monitoring

### ðŸ“ Complaint Management System
- Students can submit complaints
- Multiple complaint categories:
  - Maintenance
  - Food
  - Cleanliness
  - Security
  - Other
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Resolved)
- Admin/Warden can update complaint status
- Complete complaint history

### ðŸ‘¤ Visitor Log System
- Visitor registration and tracking
- Check-in/Check-out time recording
- Visitor information:
  - Visitor name and phone
  - Relationship with student
  - Purpose of visit
  - Visit date and duration
- Complete visitor history

### ðŸ“Š Dashboard & Analytics
- Real-time statistics:
  - Total students count
  - Available/Occupied beds
  - Pending complaints
  - Monthly revenue
- Recent activities feed
- Role-specific dashboard views
- Visual stat cards with icons

## ðŸš€ Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18 or later for the backend server

### Installation

1. **Open the Project Folder**
   ```bash
   cd hostel-management
   ```

2. **Start the Backend**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Visit `http://localhost:3000`.

4. **Login**
   Use credentials issued by the hostel administrator.

### Backend Notes
- `server.js` serves the frontend and provides REST APIs under `/api`.
- `db.json` is created automatically on first run and stores students, rooms, payments, complaints, visitors, and users.
- No external npm packages are required.


## Access

Credentials are managed by the hostel administrator. Do not publish shared demo passwords on a hosted deployment.

## Email Setup

Registration verification, password reset, and approval emails use Gmail SMTP or Resend when configured.

For Gmail SMTP, set these Railway variables:

- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `465`
- `SMTP_SECURE`: `true`
- `SMTP_USER`: Gmail address used for sending
- `SMTP_PASS`: Google App Password for that Gmail account
- `MAIL_FROM`: sender label, for example `HostelPro <veriffy.hms@gmail.com>`

Alternatively, Resend is also supported:

- `RESEND_API_KEY`: API key from Resend
- `MAIL_FROM`: verified sender, for example `HostelPro <noreply@yourdomain.com>`

Without these variables, emails are saved locally to `email-outbox.json` for testing.

## ðŸ“ Project Structure

```
hostel-management/
â”œâ”€â”€ index.html              # Main HTML file
â”œâ”€â”€ css/
â”‚   â””â”€â”€ style.css          # All styling and design
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ data.js            # Data layer and LocalStorage management
â”‚   â”œâ”€â”€ auth.js            # Authentication and session management
â”‚   â””â”€â”€ app.js             # Main application logic and UI
â””â”€â”€ README.md              # This file
```

### Code Architecture

#### **index.html**
- Minimal HTML structure
- Links to CSS and JavaScript files
- Single `<div id="app">` container for dynamic content

#### **css/style.css**
- Modern, responsive design system
- CSS custom properties for theming
- Glassmorphism effects and smooth animations
- Mobile-responsive layouts
- Professional color scheme with:
  - Primary: Blue (#2563eb)
  - Success: Green (#10b981)
  - Warning: Orange (#f59e0b)
  - Danger: Red (#ef4444)

#### **js/data.js**
- `DataStore` class for data management
- LocalStorage integration
- CRUD operations for all entities
- Seed data initialization
- Dashboard statistics calculation

#### **js/auth.js**
- `AuthManager` class for authentication
- Login/Logout functionality
- Session management
- Role-based access control methods
- User registration

#### **js/app.js**
- `App` class - main application controller
- Hash-based routing system
- Dynamic page rendering
- Modal management
- Form handling
- Event listeners
- UI updates

## ðŸŽ¨ Design Features

### Modern UI/UX
- **Clean Interface:** Minimal, professional design
- **Glassmorphism:** Modern glass-effect cards
- **Smooth Animations:** Hover effects and transitions
- **Color-Coded Status:** Visual indicators for different states
- **Responsive Layout:** Works on desktop and mobile devices
- **Typography:** Clear, readable fonts with proper hierarchy

### User Experience
- **Single Page Application:** No page reloads
- **Modal Dialogs:** Non-intrusive forms
- **Instant Feedback:** Real-time updates
- **Intuitive Navigation:** Clear sidebar menu
- **Status Badges:** Visual status indicators
- **Table Views:** Easy-to-read data tables

## ðŸ’¾ Data Persistence

The application uses **LocalStorage** for data persistence:

- **Storage Keys:**
  - `hms_students` - Student records
  - `hms_rooms` - Room information
  - `hms_payments` - Payment records
  - `hms_complaints` - Complaint data
  - `hms_visitors` - Visitor logs
  - `hms_users` - User accounts
  - `hms_session` - Current session

- **Data Format:** JSON
- **Persistence:** Data persists across browser sessions
- **Reset:** Clear browser's LocalStorage to reset data

## ðŸ”’ Security Considerations

> [!WARNING]
> **This is a demo application. For production use, implement the following security measures:**

1. **Password Security**
   - Replace plain-text passwords with hashed passwords (bcrypt, Argon2)
   - Implement password strength requirements
   - Add password recovery mechanism

2. **Authentication**
   - Implement JWT or server-side sessions
   - Add CSRF protection
   - Implement rate limiting for login attempts

3. **Data Storage**
   - Move from LocalStorage to secure backend database
   - Implement server-side validation
   - Use HTTPS for all communications

4. **Authorization**
   - Implement proper role-based access control on the backend
   - Validate permissions server-side
   - Add audit logging

## ðŸ› ï¸ Customization

### Adding New Features

1. **Add Data Entity:**
   - Update `initialData` in `data.js`
   - Add getter/setter methods in `DataStore` class

2. **Add New Page:**
   - Create page rendering method in `app.js` (e.g., `loadNewPage()`)
   - Add route in `router()` method
   - Add navigation link in `getAppLayout()`

3. **Modify Styling:**
   - Update CSS variables in `:root` selector for global changes
   - Add custom classes in `style.css`

### Configuration

Edit these constants in the respective files:

- **Hostel Blocks:** Modify block options in student and room forms
- **Complaint Categories:** Update category list in complaint form
- **Payment Methods:** Modify payment method options in fee tracking
- **Dashboard Stats:** Customize calculations in `getDashboardStats()`

## ðŸ“± Browser Compatibility

- âœ… Chrome (Recommended)
- âœ… Firefox
- âœ… Safari
- âœ… Edge
- âš ï¸ IE11 (Limited support - requires polyfills)

## ðŸ› Known Limitations

1. **No Backend:** All data is stored in browser LocalStorage
2. **Single User:** No multi-user collaboration support
3. **No File Upload:** Student photos use placeholder SVG avatars
4. **Limited Validation:** Basic client-side validation only
5. **No Reports:** PDF/Excel export functionality not included

## ðŸ”„ Future Enhancements

- [ ] Backend integration (Node.js/Express)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload for student photos
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Advanced analytics and charts
- [ ] Mobile app version
- [ ] Attendance tracking
- [ ] Mess menu management
- [ ] Leave application system

## ðŸ“„ License

This project is licensed under the MIT License - see below for details:

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.
```

## ðŸ‘¥ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ðŸ’¬ Support

For support, questions, or suggestions:
- Create an issue in the repository
- Contact the development team

## ðŸ™ Acknowledgments

- Icons: Unicode Emoji
- Design Inspiration: Modern SaaS applications
- Color Palette: Tailwind CSS defaults

---

**Built with â¤ï¸ for educational purposes**

*Last Updated: December 2024*
