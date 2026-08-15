# ⚡ TaskFlow — Troyz Solutions Enterprise Management Suite

> A modern, real-time enterprise management suite featuring an **Admin Management Dashboard** and **Worker & Intern Portal** with real-time Firebase Cloud database synchronization, file attachment proof uploads, and cloud hosting.

🌐 **Live Production App:** [https://troyz-solutions.web.app/](https://troyz-solutions.web.app/)

---

## 🌟 Key Features

### 🏢 1. Admin Management Panel (`/Work Assigning Pannel/`)
- **Interactive Kanban Board:** Drag-and-drop workflow tracking (`Assigned ➔ In Progress ➔ Submitted ➔ Approved ➔ Completed`).
- **Milestone & Task Assignment:** Due date scheduling, priority tagging, instructions, and acceptance criteria checklists.
- **Worker & Team Management:** Secure worker invitations, SHA-256 password hashing, team assignments, and performance monitoring.
- **Submissions & Reviews:** Inspect worker deliverables, review cloud-stored screenshots/PDFs/ZIPs, and submit multi-metric scorecards.
- **Visual Analytics:** 2-per-row charts powered by Chart.js for completion velocity, department workloads, and KPI metrics.
- **Cloud Sync Control:** Real-time bi-directional data synchronization with Google Cloud Firestore.

### 🛠️ 2. Worker & Intern Portal (`/Working Panel/`)
- **Secure Authentication:** Protected login gate with SHA-256 cryptographic verification.
- **Focus Dashboard & Priority Inbox:** Instant view of urgent tasks and admin revision requests.
- **☁️ Cloud Deliverable Uploads:** Drag-and-drop file upload zone for proof attachments (Images, PDFs, ZIPs, Documents) uploaded directly to Firebase Storage.
- **Live Review Feedback:** Real-time scorecards and comments from managers without refreshing.

### ⚡ 3. Enterprise Hub (`index.html`)
- Unified landing portal connecting both management workspaces under a single web application.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Modern Vanilla HTML5, CSS3 Tokens & Glassmorphism, JavaScript ES6+
- **Data Visualizations:** Chart.js v4
- **Database:** Google Cloud Firestore (Real-time `onSnapshot` listeners)
- **File Storage:** Google Cloud Firebase Storage
- **Hosting:** Firebase Global CDN Hosting

---

## 🚀 Local Development

To run the full suite locally:

```bash
# Start root server (port 8000)
python -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/) in your browser.

---

## 🌐 Cloud Deployment

To deploy updates to Firebase Hosting:

```bash
npx firebase-tools deploy --only hosting --project troyz-solutions
```

---

© 2026 Troyz Solutions. All rights reserved.
