# Smart Office Seat Occupancy System

## Requirement Gathering Questions
Use this document during client discovery meetings to gather all necessary information before development begins.

---

## 1. Project Overview

1. What is the main goal of this system?
   - The main goal of the office seat occupancy system is to provide real-time visibility of which seats are occupied, available, or reserved in the office.
   - It helps the company to:
     - Track employee presence automatically using the biometric check-in/check-out system
     - Reduce confusion about available desks/seats
     - Improve space utilization in the office
     - Help HR/Admin monitor attendance and seating usage
     - Make hybrid/WFH planning easier
     - Allow employees to quickly find available seats
     - Generate reports on office occupancy and usage trends

2. What problems are currently being faced with seat management?
   - Employees cannot easily know which seats are free or occupied
   - People sometimes occupy seats unofficially or change desks frequently
   - Hybrid/WFH employees make seat planning difficult
   - Manual tracking by admin/HR becomes confusing and time-consuming
   - Teams may not get seats together
   - Visitors or new employees may not know where to sit
   - Empty seats may appear occupied because nobody updates the status
   - No real-time visibility of office occupancy
   - Peak-day overcrowding and underutilization on other days
   - Difficulty in tracking attendance vs actual desk usage
   - Employees waste time searching for seats
   - No historical data or analytics on seat utilization
   - Facility planning becomes difficult without accurate occupancy data
   - Cleaning/security teams may not know which areas are actively used
   - Last-minute seating conflicts during meetings or office events

3. Who will use this system? (Employees / HR / Admin / Management)
   - All

4. Is this system for one office location or multiple offices?
   - One office

---

## 2. Office & Seating Details

### Basic Office Information

1. How many employees are currently working in the office?
   - Total emp 73 staff
   - 71 employees need desk
   - 3 interns need desk
   - 2 Admin staff don’t need desk

2. How many floors are there in the office building?
   - 1

3. How many total seats/desks are available across all floors?
   - 56 seats

4. Are there separate zones or departments on each floor?
   - Yes: Client servicing, creative (art), and Studio

5. Do interns, freelancers, or vendors also occupy seats?
   - Interns & freelancers yes
   - No vendors

6. Are meeting room seats to be included in the system?
   - No

### Seating Structure

1. Is seating fixed, hot-desking/flexible, or a hybrid model?
   - Flexible

2. Does every employee have a permanently assigned seat?
   - Only cabins, IT, and HR

3. Can employees change seats during the day?
   - [Answer required]

4. Are there reserved seats for specific roles or departments?
   - HR, IT, and Finance

### Future Expansion

1. What is the expected employee headcount growth in the next 1–2 years?
   - [Answer required]

2. Are there plans to add new floors or office locations later?
   - [Answer required]

---

## 3. Biometric System Questions ⚠️ (Most Critical Section)

### Existing System Details

1. Which biometric system/device brand is currently being used?
   - ESSL

2. Who manages the biometric system — internal IT team or external vendor?
   - Internal IT. We do the biometric registration and extract attendance report.

3. Is there an API available to access the biometric data?
   - In the internal network it’s connected to the admin system for attendance report; for external we need to check with vendor.

4. Is technical documentation or an SDK available for the biometric system?
   - No. Will take help from the vendor if needed.

### Data Availability

1. What data fields are available from the system?
   - Employee ID, Name, Check-in time, Check-out time, IN/OUT status, Department, Location

2. Is data available in real time, or is it synced at regular intervals?
   - Yes (real time)

3. Is attendance data stored locally on-premises or in the cloud?
   - Locally on-premises

4. What happens to data logging if the internet or server goes down?
   - Stalled

### Integration

1. How can external systems connect to the biometric software? (API / Direct database access / File export)
   - [Answer required]

2. Are there any authentication or security restrictions for external access?
   - Right now there is no access from outside

---

## 4. Employee Master Data

1. What employee details are available?
   - Employee ID, Full Name, Department, Designation, Floor, Assigned Seat, Joining Date, Active/Inactive Status
   - [Additional fields to confirm]

2. Who manages employee data — HR or Admin?
   - HR & Admin, Accounts

3. Is there an existing HRMS or ERP system we should integrate with?
   - NIL

---

## 5. Seat Occupancy Logic

### Occupancy Rules

1. When should a seat be marked as occupied — on biometric check-in or manual confirmation?
   - [Answer required]

2. When should a seat be released — on check-out, after inactivity, or manual release?
   - [Answer required]

3. Should admin be able to manually override a seat's status?
   - [Answer required]

### Flexible Seating

1. Can employees sit anywhere they choose, or only at assigned seats?
   - [Answer required]

2. Is a seat booking/reservation feature needed before arriving at the office?
   - [Answer required]

3. Should temporary seat reservations be supported?
   - [Answer required]

### Edge Cases & Exceptions

1. What happens if an employee checks in but works remotely that day?
   - [Answer required]

2. What if an employee changes seats multiple times during the day?
   - [Answer required]

3. What if an employee forgets to check out — how should the system handle it?
   - [Answer required]

---

## 6. Dashboard & Application Requirements

### Platform

1. Is a web app, mobile app, or both required?
   - [Answer required]

2. Should there be a TV/display mode for showing occupancy on office screens?
   - [Answer required]

### Dashboard Features

1. Is a real-time live seat map required?
   - [Answer required]

2. Is a floor-by-floor view required?
   - [Answer required]

3. Is filtering by department required?
   - [Answer required]

4. Should employees be able to search by name, employee ID, or seat number?
   - [Answer required]

5. What should the color indicators be?
   - Green = Free, Red = Occupied, Yellow = Reserved

6. What refresh interval is acceptable for seat status updates?
   - [Answer required]

### Employee Self-Service View

1. Should employees be able to see who else is currently in the office?
   - [Answer required]

2. Should employees be able to see available seats?
   - [Answer required]

3. Should employees be able to book a seat in advance?
   - [Answer required]

---

## 7. Admin Panel Requirements

1. Should admin be able to add, edit, or delete seats and floors?
   - [Answer required]

2. Should admin be able to assign or reassign seats to employees?
   - [Answer required]

3. Should admin be able to manage employee records within the system?
   - [Answer required]

4. Should admin be able to create new floors or zones?
   - [Answer required]

5. What user roles are required? (Super Admin / HR / Facility Team / Employee)
   - [Answer required]

---

## 8. Reports & Analytics

1. What reports are needed?
   - Daily occupancy, Floor utilization, Department occupancy, Attendance trends, Peak office hours

2. Should reports be exportable to Excel or PDF?
   - [Answer required]

3. Should reports be emailed automatically on a schedule?
   - [Answer required]

---

## 9. Notifications & Alerts

1. Are notifications needed for seat availability changes?
   - [Answer required]

2. Should alerts be triggered when the office reaches full capacity?
   - [Answer required]

3. Should unauthorized seating trigger any alerts?
   - [Answer required]

4. Should notifications be sent via email, SMS, or mobile push?
   - [Answer required]

---

## 10. Technical Infrastructure

1. Is there a preferred backend technology or programming language?
   - [Answer required]

2. Is there a preferred frontend technology or framework?
   - [Answer required]

3. Is there a preferred database system?
   - [Answer required]

4. Should the system be hosted on cloud or on-premises servers?
   - [Answer required]

5. Is multi-office support needed in the future?
   - [Answer required]

6. Is SSO, Google, or Microsoft login required for authentication?
   - [Answer required]

7. Are there any existing security or compliance restrictions?
   - [Answer required]

---

## 11. Floor Map & Layout

1. Is a digital floor layout already available? (CAD file, image, or diagram)
   - [Answer required]

2. Is a drag-and-drop seat management interface required for admin?
   - [Answer required]

3. Should the floor map be interactive for employees?
   - [Answer required]

---

## 12. MVP vs Advanced Version

### Minimum Viable Product — Must-Have for First Release
- Biometric integration (check-in/check-out data)
- Employee master data
- Floor and seat mapping
- Real-time occupied/free seat status
- Basic web dashboard with color indicators

### Advanced Features — Future Phases
- Seat booking and reservations
- Analytics and occupancy reports
- Mobile app
- AI-based utilization prediction
- Meeting room integration

---

## 13. Deployment & Maintenance

1. Who will maintain the system after launch — internal IT team or external vendor?
   - [Answer required]

2. Is user training or documentation required?
   - [Answer required]

3. Is a data backup and recovery setup required?
   - [Answer required]

---

## 14. Final Clarification Questions

1. What is the expected go-live timeline or deadline?
   - [Answer required]

2. Are there any budget constraints?
   - [Answer required]

3. Are there any reference systems or competitor products you like?
   - [Answer required]

4. What does a successful outcome look like for this project?
   - [Answer required]

---

## Note to Developer
You are currently in the Requirement Gathering phase. Do NOT try to sound like you know everything technically. Instead, say:

> "I am currently understanding the workflow and requirements so I can design the system properly."

This approach is professional and builds trust with the client.

---

## Development Phase Roadmap (Post Requirements)

| Phase | Name | Key Deliverables |
| --- | --- | --- |
| Phase 1 | Requirement Gathering | This document — all questions answered and documented |
| Phase 2 | Architecture Design | Database schema, API design, tech stack finalized |
| Phase 3 | MVP Development | Biometric integration, seat map, basic dashboard |
| Phase 4 | Testing & UAT | Client testing, bug fixes, performance tuning |
| Phase 5 | Go Live | Deployment, training, documentation |
| Phase 6 | Advanced Features | Booking, analytics, mobile app, AI prediction |
