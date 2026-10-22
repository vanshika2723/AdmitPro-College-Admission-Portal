
/* =========================================
   AdmitPro — College Admission Portal
   Frontend demo with localStorage
========================================= */

"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const STORAGE_KEY = "admitpro_applications_v1";
const STUDENT_KEY = "admitpro_students_v1";
const AUTH_KEY = "admitpro_authenticated_v1";
const THEME_KEY = "admitpro_theme_v1";

const COURSES = [
  {
    name: "B.Tech Computer Science",
    icon: "fa-laptop-code",
    description: "Software development, computing, algorithms and modern technology.",
    duration: "4 Years",
    level: "Undergraduate"
  },
  {
    name: "B.Tech Electronics & Communication",
    icon: "fa-microchip",
    description: "Electronics, communication systems and embedded technologies.",
    duration: "4 Years",
    level: "Undergraduate"
  },
  {
    name: "B.Tech Mechanical Engineering",
    icon: "fa-gears",
    description: "Mechanical design, manufacturing and engineering systems.",
    duration: "4 Years",
    level: "Undergraduate"
  },
  {
    name: "B.Tech Civil Engineering",
    icon: "fa-building",
    description: "Infrastructure, construction, structural design and planning.",
    duration: "4 Years",
    level: "Undergraduate"
  },
  {
    name: "MBA (Business Administration)",
    icon: "fa-briefcase",
    description: "Business strategy, leadership, management and entrepreneurship.",
    duration: "2 Years",
    level: "Postgraduate"
  },
  {
    name: "B.Sc Computer Science",
    icon: "fa-code",
    description: "Computer science fundamentals, programming and data systems.",
    duration: "3 Years",
    level: "Undergraduate"
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: "ADM-2026-001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    dob: "2007-03-14",
    gender: "Male",
    city: "Jaipur",
    address: "Jaipur, Rajasthan",
    course: "B.Tech Computer Science",
    qualification: "Class 12",
    score: 94.5,
    entranceScore: 91,
    session: "2026–27",
    date: "2026-10-12",
    status: "Admitted",
    documents: [],
    declaration: true
  },
  {
    id: "ADM-2026-002",
    name: "Ananya Verma",
    email: "ananya@example.com",
    phone: "9876543211",
    dob: "2007-07-22",
    gender: "Female",
    city: "Delhi",
    address: "New Delhi",
    course: "B.Tech Computer Science",
    qualification: "Class 12",
    score: 92.2,
    entranceScore: 88,
    session: "2026–27",
    date: "2026-10-13",
    status: "Shortlisted",
    documents: [],
    declaration: true
  },
  {
    id: "ADM-2026-003",
    name: "Rohan Mehta",
    email: "rohan@example.com",
    phone: "9876543212",
    dob: "2006-12-02",
    gender: "Male",
    city: "Kota",
    address: "Kota, Rajasthan",
    course: "B.Tech Mechanical Engineering",
    qualification: "Class 12",
    score: 78.4,
    entranceScore: 72,
    session: "2026–27",
    date: "2026-10-14",
    status: "Under Review",
    documents: [],
    declaration: true
  },
  {
    id: "ADM-2026-004",
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876543213",
    dob: "2007-01-19",
    gender: "Female",
    city: "Ajmer",
    address: "Ajmer, Rajasthan",
    course: "B.Sc Computer Science",
    qualification: "Class 12",
    score: 86.8,
    entranceScore: 80,
    session: "2026–27",
    date: "2026-10-15",
    status: "Submitted",
    documents: [],
    declaration: true
  },
  {
    id: "ADM-2026-005",
    name: "Kabir Gupta",
    email: "kabir@example.com",
    phone: "9876543214",
    dob: "2006-09-08",
    gender: "Male",
    city: "Udaipur",
    address: "Udaipur, Rajasthan",
    course: "MBA (Business Administration)",
    qualification: "Graduation",
    score: 81.5,
    entranceScore: 76,
    session: "2026–27",
    date: "2026-10-16",
    status: "Merit List",
    documents: [],
    declaration: true
  },
  {
    id: "ADM-2026-006",
    name: "Meera Joshi",
    email: "meera@example.com",
    phone: "9876543215",
    dob: "2007-05-27",
    gender: "Female",
    city: "Jodhpur",
    address: "Jodhpur, Rajasthan",
    course: "B.Tech Civil Engineering",
    qualification: "Class 12",
    score: 68.3,
    entranceScore: 62,
    session: "2026–27",
    date: "2026-10-17",
    status: "Under Review",
    documents: [],
    declaration: true
  }
];

const DEFAULT_STUDENTS = [];

let applications = loadArray(STORAGE_KEY, DEFAULT_APPLICATIONS);
let students = loadArray(STUDENT_KEY, DEFAULT_STUDENTS);
let currentStep = 1;
let selectedApplicationId = null;
let generatedMerit = [];
let documentRecords = [];
let currentPage = "dashboard";

function loadArray(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Unable to read saved data:", error);
  }

  return fallback.map(item => ({ ...item }));
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    localStorage.setItem(STUDENT_KEY, JSON.stringify(students));
  } catch (error) {
    showToast("Storage unavailable", "Your changes could not be saved in this browser.", true);
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function initials(name) {
  return String(name || "Student")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0] || "")
    .join("")
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHTML(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function todayISO() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");
}

function statusClass(status) {
  return "status-" + String(status || "Pending")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function statusBadge(status) {
  return `<span class="status-badge ${statusClass(status)}">${escapeHTML(status)}</span>`;
}

function showToast(title, message, isError = false) {
  const container = $("#toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.innerHTML = `
    <i class="fa-solid ${isError ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
    <div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div>
  `;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3800);
}

function showModal(title, bodyHTML) {
  $("#actionModalTitle").textContent = title;
  $("#actionModalBody").innerHTML = bodyHTML;
  $("#actionModal").classList.remove("hidden");
}

function closeModal(modal) {
  if (modal) modal.classList.add("hidden");
}

function openPage(pageId) {
  const target = document.getElementById(pageId);
  if (!target || !target.classList.contains("page-section")) return;

  currentPage = pageId;

  $$(".page-section").forEach(section => {
    section.classList.toggle("active", section.id === pageId);
  });

  $$(".nav-link[data-page]").forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageId);
  });

  const title = target.dataset.title || "Dashboard";
  $("#pageTitle").textContent = title;
  $("#breadcrumbPage").textContent = title;

  closeSidebar();

  if (location.hash !== `#${pageId}`) {
    history.replaceState(null, "", `#${pageId}`);
  }

  if (pageId === "application-detail") renderApplicationDetail();
  if (pageId === "reports") renderReports();
  if (pageId === "documents") renderDocuments();
  if (pageId === "review") renderReviewCards();
  if (pageId === "admission") renderAdmissionTable();
  if (pageId === "courses") renderCourses();
}

function closeSidebar() {
  $("#sidebar")?.classList.remove("open");
  $("#sidebarOverlay")?.classList.remove("show");
}

function toggleSidebar() {
  $("#sidebar")?.classList.toggle("open");
  $("#sidebarOverlay")?.classList.toggle("show");
}

function getApplication(id) {
  return applications.find(application => application.id === id);
}

function nextApplicationId() {
  const max = applications.reduce((highest, app) => {
    const number = Number(String(app.id).split("-").pop());
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);

  return `ADM-2026-${String(max + 1).padStart(3, "0")}`;
}

function countStatus(status) {
  return applications.filter(app => app.status === status).length;
}

function renderDashboard() {
  const total = applications.length;
  const review = countStatus("Under Review");
  const shortlisted = countStatus("Shortlisted") + countStatus("Merit List");
  const admitted = countStatus("Admitted");

  setText("statTotal", String(total).padStart(2, "0"));
  setText("statReview", String(review).padStart(2, "0"));
  setText("statShortlisted", String(shortlisted).padStart(2, "0"));
  setText("statAdmitted", String(admitted).padStart(2, "0"));
  setText("navApplicationCount", total);

  const recent = [...applications]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 5);

  $("#recentApplicationsBody").innerHTML = recent.length
    ? recent.map(app => `
      <tr>
        <td>
          <div class="student-cell">
            <div class="mini-avatar">${escapeHTML(initials(app.name))}</div>
            <div><strong>${escapeHTML(app.name)}</strong><small>${escapeHTML(app.email)}</small></div>
          </div>
        </td>
        <td>${escapeHTML(app.course)}</td>
        <td>${formatDate(app.date)}</td>
        <td>${statusBadge(app.status)}</td>
      </tr>
    `).join("")
    : emptyTableRow(4, "No applications yet.");

  renderCourseDistribution();
  renderStatusOverview();
  renderApplicationTable();
  renderReports();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function emptyTableRow(columns, message) {
  return `<tr><td colspan="${columns}" style="text-align:center;padding:28px;color:var(--muted)">${escapeHTML(message)}</td></tr>`;
}

function renderCourseDistribution() {
  const container = $("#courseDistribution");
  if (!container) return;

  const counts = COURSES.map(course => ({
    name: course.name,
    count: applications.filter(app => app.course === course.name).length
  })).sort((a, b) => b.count - a.count);

  const maximum = Math.max(1, ...counts.map(item => item.count));

  container.innerHTML = counts.slice(0, 5).map((item, index) => `
    <div class="distribution-item">
      <div class="distribution-top">
        <span>${escapeHTML(item.name)}</span><strong>${item.count}</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${item.count / maximum * 100}%;opacity:${1 - index * .08}"></div>
      </div>
    </div>
  `).join("");
}

function renderStatusOverview() {
  const container = $("#statusOverview");
  if (!container) return;

  const statuses = [
    ["Submitted", "#3985ed"],
    ["Under Review", "#ed8a25"],
    ["Shortlisted", "#7c3aed"],
    ["Merit List", "#d69a2d"],
    ["Admitted", "#16a36a"],
    ["Rejected", "#e34d59"]
  ];

  container.innerHTML = statuses.map(([status, color]) => `
    <div class="status-row">
      <span class="status-dot" style="background:${color}"></span>
      <span>${status}</span>
      <strong>${countStatus(status)}</strong>
    </div>
  `).join("");
}

function renderApplicationTable() {
  const body = $("#applicationsTableBody");
  if (!body) return;

  const search = ($("#applicationSearch")?.value || "").trim().toLowerCase();
  const status = $("#statusFilter")?.value || "";
  const course = $("#courseFilter")?.value || "";
  const date = $("#dateFilter")?.value || "";

  const filtered = [...applications]
    .filter(app => {
      const matchesSearch = [
        app.name, app.email, app.id, app.course
      ].some(value => String(value || "").toLowerCase().includes(search));

      return matchesSearch
        && (!status || app.status === status)
        && (!course || app.course === course)
        && (!date || app.date === date);
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  body.innerHTML = filtered.length ? filtered.map(app => `
    <tr>
      <td><strong>${escapeHTML(app.id)}</strong></td>
      <td><div class="student-cell"><div class="mini-avatar">${escapeHTML(initials(app.name))}</div><div><strong>${escapeHTML(app.name)}</strong><small>${escapeHTML(app.email)}</small></div></div></td>
      <td>${escapeHTML(app.course)}</td>
      <td><strong>${Number(app.score || 0).toFixed(2)}%</strong></td>
      <td>${formatDate(app.date)}</td>
      <td>${statusBadge(app.status)}</td>
      <td><div class="action-buttons">
        <button class="action-btn" data-action="view" data-id="${escapeHTML(app.id)}" title="View details"><i class="fa-solid fa-eye"></i></button>
        <button class="action-btn" data-action="edit-status" data-id="${escapeHTML(app.id)}" title="Change status"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn danger" data-action="delete" data-id="${escapeHTML(app.id)}" title="Delete application"><i class="fa-solid fa-trash"></i></button>
      </div></td>
    </tr>
  `).join("") : emptyTableRow(7, "No matching applications found.");

  setText("tableResultCount", `Showing ${filtered.length} of ${applications.length} applications`);
  setText("listTotal", applications.length);
  setText("listSubmitted", countStatus("Submitted"));
  setText("listReview", countStatus("Under Review"));
  setText("listAdmitted", countStatus("Admitted"));
}

function renderApplicationDetail() {
  const container = $("#applicationDetailContent");
  if (!container) return;

  const app = getApplication(selectedApplicationId);

  if (!app) {
    container.innerHTML = `
      <div class="panel empty-state">
        <i class="fa-solid fa-file-circle-question"></i>
        <h3>No application selected</h3>
        <p>Choose an application from the listing to see its complete details.</p>
        <button class="btn btn-primary" data-go="applications">Browse Applications</button>
      </div>`;
    return;
  }

  const fields = [
    ["Application ID", app.id],
    ["Full Name", app.name],
    ["Email Address", app.email],
    ["Phone Number", app.phone],
    ["Date of Birth", formatDate(app.dob)],
    ["Gender", app.gender || "Not provided"],
    ["City", app.city || "Not provided"],
    ["Address", app.address || "Not provided"],
    ["Course", app.course],
    ["Qualification", app.qualification],
    ["Academic Score", `${Number(app.score || 0).toFixed(2)}%`],
    ["Entrance Score", app.entranceScore === "" || app.entranceScore == null ? "Not provided" : `${app.entranceScore}%`],
    ["Application Date", formatDate(app.date)],
    ["Admission Session", app.session || "2026–27"]
  ];

  container.innerHTML = `
    <article class="panel">
      <div class="detail-header">
        <div class="mini-avatar">${escapeHTML(initials(app.name))}</div>
        <div style="flex:1">
          <h3>${escapeHTML(app.name)}</h3>
          <p>${escapeHTML(app.id)} · ${statusBadge(app.status)}</p>
        </div>
      </div>
      <div class="detail-grid">
        ${fields.map(([label, value]) => `
          <div class="detail-field"><small>${escapeHTML(label)}</small><strong>${escapeHTML(value)}</strong></div>
        `).join("")}
      </div>
      <div class="detail-actions">
        <button class="btn btn-primary" data-action="edit-status" data-id="${escapeHTML(app.id)}"><i class="fa-solid fa-pen"></i> Update Status</button>
        <button class="btn btn-outline" data-action="print-letter" data-id="${escapeHTML(app.id)}"><i class="fa-solid fa-print"></i> Print Admission Letter</button>
        <button class="btn btn-outline" data-go="applications"><i class="fa-solid fa-arrow-left"></i> Back</button>
      </div>
    </article>
  `;
}

function renderDocuments() {
  const body = $("#documentsTableBody");
  if (!body) return;

  const search = ($("#documentSearch")?.value || "").trim().toLowerCase();
  const filter = $("#documentStatusFilter")?.value || "";

  const records = [];

  applications.forEach(app => {
    const docs = [
      ["Passport Photo", "photo"],
      ["Signature", "signature"],
      ["10th Marksheet", "marksheet10"],
      ["12th Marksheet", "marksheet12"],
      ["Transfer Certificate", "transferCertificate"],
      ["Identity Proof", "identityProof"]
    ];

    docs.forEach(([label, key]) => {
      const savedDoc = (app.documents || []).find(doc => doc.key === key);
      const status = savedDoc ? (savedDoc.status || "Pending") : "Missing";

      records.push({
        app,
        label,
        key,
        status,
        date: savedDoc?.date || ""
      });
    });
  });

  const filtered = records.filter(record => {
    const matchesSearch = `${record.app.name} ${record.label} ${record.app.id}`
      .toLowerCase().includes(search);

    return matchesSearch && (!filter || record.status === filter);
  });

  body.innerHTML = filtered.length ? filtered.map(record => `
    <tr>
      <td>${escapeHTML(record.app.name)}</td>
      <td>${escapeHTML(record.label)}</td>
      <td>${escapeHTML(record.app.id)}</td>
      <td>${record.date ? formatDate(record.date) : "—"}</td>
      <td>${statusBadge(record.status)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn" data-action="document-status" data-id="${escapeHTML(record.app.id)}" data-doc="${escapeHTML(record.key)}" title="Update verification"><i class="fa-solid fa-check"></i></button>
        </div>
      </td>
    </tr>
  `).join("") : emptyTableRow(6, "No document records found.");
}

function renderReviewCards() {
  const container = $("#reviewCards");
  if (!container) return;

  const pending = applications.filter(app =>
    ["Submitted", "Under Review"].includes(app.status)
  );

  container.innerHTML = pending.length ? pending.map(app => `
    <article class="review-card">
      <div class="detail-header">
        <div class="mini-avatar">${escapeHTML(initials(app.name))}</div>
        <div style="flex:1"><h3>${escapeHTML(app.name)}</h3><p>${escapeHTML(app.id)}</p></div>
        ${statusBadge(app.status)}
      </div>
      <p><strong>Course:</strong> ${escapeHTML(app.course)}</p>
      <p><strong>Academic score:</strong> ${Number(app.score || 0).toFixed(2)}%</p>
      <p><strong>Applied:</strong> ${formatDate(app.date)}</p>
      <div class="detail-actions">
        <button class="btn btn-outline" data-action="view" data-id="${escapeHTML(app.id)}">Review Details</button>
        <button class="btn btn-primary" data-action="approve" data-id="${escapeHTML(app.id)}">Shortlist</button>
        <button class="btn btn-outline" data-action="reject" data-id="${escapeHTML(app.id)}">Reject</button>
      </div>
    </article>
  `).join("") : `
    <div class="panel empty-state">
      <i class="fa-solid fa-circle-check"></i>
      <h3>All caught up!</h3>
      <p>There are no submitted or under-review applications waiting for action.</p>
    </div>`;
}

function renderAdmissionTable() {
  const body = $("#admissionTableBody");
  if (!body) return;

  const search = ($("#admissionSearch")?.value || "").trim().toLowerCase();
  const statusFilter = $("#admissionStatusFilter")?.value || "";

  const eligible = applications.filter(app =>
    ["Shortlisted", "Merit List", "Admitted"].includes(app.status)
  ).filter(app => {
    const matchesSearch = `${app.name} ${app.id} ${app.course}`
      .toLowerCase().includes(search);

    return matchesSearch && (!statusFilter || app.status === statusFilter);
  });

  body.innerHTML = eligible.length ? eligible.map(app => `
    <tr>
      <td>${escapeHTML(app.name)}</td>
      <td>${escapeHTML(app.id)}</td>
      <td>${escapeHTML(app.course)}</td>
      <td>${Number(app.score || 0).toFixed(2)}%</td>
      <td>${statusBadge(app.status)}</td>
      <td>
        ${app.status === "Admitted"
          ? `<button class="btn btn-outline btn-small" data-action="print-letter" data-id="${escapeHTML(app.id)}"><i class="fa-solid fa-print"></i> Print Letter</button>`
          : `<button class="btn btn-primary btn-small" data-action="admit" data-id="${escapeHTML(app.id)}"><i class="fa-solid fa-check"></i> Confirm</button>`
        }
      </td>
    </tr>
  `).join("") : emptyTableRow(6, "No eligible applicants found.");
}

function renderCourses() {
  const container = $("#courseCards");
  if (!container) return;

  container.innerHTML = COURSES.map(course => {
    const count = applications.filter(app => app.course === course.name).length;

    return `
      <article class="course-card">
        <div class="course-card-icon"><i class="fa-solid ${course.icon}"></i></div>
        <h3>${escapeHTML(course.name)}</h3>
        <p>${escapeHTML(course.description)}</p>
        <div class="course-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${escapeHTML(course.duration)}</span>
          <span><i class="fa-solid fa-users"></i> ${count} applicants</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderReports() {
  setText("reportTotal", applications.length);

  const average = applications.length
    ? applications.reduce((sum, app) => sum + Number(app.score || 0), 0) / applications.length
    : 0;

  const admitted = countStatus("Admitted");
  const rate = applications.length ? admitted / applications.length * 100 : 0;

  setText("reportAverage", applications.length ? `${average.toFixed(1)}%` : "--%");
  setText("reportRate", applications.length ? `${rate.toFixed(1)}%` : "--%");

  const chart = $("#reportCourseChart");
  if (chart) {
    const counts = COURSES.map(course => ({
      name: course.name,
      count: applications.filter(app => app.course === course.name).length
    }));

    const max = Math.max(1, ...counts.map(item => item.count));

    chart.innerHTML = counts.map(item => `
      <div class="report-chart-row">
        <span>${escapeHTML(item.name)}</span>
        <div class="progress-track"><div class="progress-fill" style="width:${item.count / max * 100}%"></div></div>
        <strong>${item.count}</strong>
      </div>
    `).join("");
  }

  const statusChart = $("#reportStatusChart");
  if (statusChart) {
    const statuses = [
      ["Submitted", "#3985ed"],
      ["Under Review", "#ed8a25"],
      ["Shortlisted", "#7c3aed"],
      ["Merit List", "#d69a2d"],
      ["Admitted", "#16a36a"],
      ["Rejected", "#e34d59"]
    ];

    statusChart.innerHTML = statuses.map(([name, color]) => `
      <div class="report-status-item">
        <span class="status-dot" style="background:${color}"></span>
        <span>${name}</span><strong>${countStatus(name)}</strong>
      </div>
    `).join("");
  }

  const reportBody = $("#reportTableBody");
  if (reportBody) {
    reportBody.innerHTML = COURSES.map(course => {
      const group = applications.filter(app => app.course === course.name);
      const female = group.filter(app => app.gender === "Female").length;
      const male = group.filter(app => app.gender === "Male").length;
      const avg = group.length
        ? group.reduce((sum, app) => sum + Number(app.score || 0), 0) / group.length
        : 0;
      const admittedCount = group.filter(app => app.status === "Admitted").length;

      return `
        <tr>
          <td>${escapeHTML(course.name)}</td>
          <td>${group.length}</td>
          <td>${female}</td>
          <td>${male}</td>
          <td>${group.length ? avg.toFixed(1) + "%" : "—"}</td>
          <td>${admittedCount}</td>
        </tr>
      `;
    }).join("");
  }
}

/* STUDENT REGISTRATION */

function handleRegistration(event) {
  event.preventDefault();

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = Object.fromEntries(new FormData(form).entries());

  const duplicateEmail = students.some(student =>
    student.email.toLowerCase() === data.email.toLowerCase()
  );

  if (duplicateEmail) {
    showToast("Student already registered", "This email address is already in the student register.", true);
    return;
  }

  students.push({
    id: `STU-${String(students.length + 1).padStart(4, "0")}`,
    ...data,
    createdAt: todayISO()
  });

  saveData();

  form.reset();
  showToast("Student registered", `${data.name} has been added to the student register.`);

  showModal("Registration successful", `
    <div class="empty-state">
      <i class="fa-solid fa-circle-check"></i>
      <h3>${escapeHTML(data.name)}</h3>
      <p>Student registration has been saved in this browser.</p>
      <p><strong>Student ID:</strong> STU-${String(students.length).padStart(4, "0")}</p>
      <button class="btn btn-primary" data-close-modal>Done</button>
    </div>
  `);
}

/* MULTI-STEP APPLICATION FORM */

function showWizardStep(step) {
  currentStep = Math.max(1, Math.min(3, step));

  $$(".wizard-page").forEach(page => {
    page.classList.toggle("active", Number(page.dataset.step) === currentStep);
  });

  $$(".wizard-step").forEach(indicator => {
    const number = Number(indicator.dataset.stepIndicator);
    indicator.classList.toggle("active", number === currentStep);
    indicator.classList.toggle("completed", number < currentStep);
  });

  $("#prevStep").disabled = currentStep === 1;
  $("#nextStep").classList.toggle("hidden", currentStep === 3);
  $("#submitApplication").classList.toggle("hidden", currentStep !== 3);
  setText("stepCounter", `Step ${currentStep} of 3`);

  if (currentStep === 3) updateApplicationSummary();

  const wizard = $(".wizard-panel");
  if (wizard) wizard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateWizardPage(step) {
  const page = $(`.wizard-page[data-step="${step}"]`);
  if (!page) return true;

  const fields = $$("input, select, textarea", page).filter(field =>
    field.required && field.type !== "file"
  );

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }

  return true;
}

function updateApplicationSummary() {
  const container = $("#applicationSummary");
  if (!container) return;

  const form = $("#applicationForm");
  const formData = new FormData(form);

  const fields = [
    ["Full Name", formData.get("name")],
    ["Email", formData.get("email")],
    ["Phone", formData.get("phone")],
    ["Course", formData.get("course")],
    ["Qualification", formData.get("qualification")],
    ["Academic Percentage", formData.get("score") ? `${formData.get("score")}%` : ""]
  ];

  container.innerHTML = `
    <h4><i class="fa-solid fa-clipboard-list"></i> Application Summary</h4>
    <div class="summary-grid">
      ${fields.map(([label, value]) => `
        <div class="summary-item">
          <small>${escapeHTML(label)}</small>
          <strong>${escapeHTML(value || "Not provided")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function handleApplicationSubmit(event) {
  event.preventDefault();

  if (!validateWizardPage(3)) return;

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const score = Number(formData.get("score"));

  if (score < 0 || score > 100) {
    showToast("Invalid score", "Academic percentage must be between 0 and 100.", true);
    showWizardStep(2);
    return;
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (applications.some(app => app.email.toLowerCase() === email)) {
    showToast("Application already exists", "An application with this email already exists.", true);
    showWizardStep(1);
    return;
  }

  const documents = [
    ["photo", "Passport Photo"],
    ["signature", "Signature"],
    ["marksheet10", "10th Marksheet"],
    ["marksheet12", "12th Marksheet"],
    ["transferCertificate", "Transfer Certificate"],
    ["identityProof", "Identity Proof"]
  ].map(([key, label]) => {
    const file = formData.get(key);
    return file && file.name ? {
      key,
      label,
      fileName: file.name,
      status: "Pending",
      date: todayISO()
    } : null;
  }).filter(Boolean);

  const app = {
    id: nextApplicationId(),
    name: String(formData.get("name") || "").trim(),
    email,
    phone: String(formData.get("phone") || "").trim(),
    dob: formData.get("dob") || "",
    gender: formData.get("gender") || "",
    city: String(formData.get("city") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    course: formData.get("course") || "",
    qualification: formData.get("qualification") || "",
    score,
    entranceScore: formData.get("entranceScore") === "" ? "" : Number(formData.get("entranceScore")),
    session: "2026–27",
    date: todayISO(),
    status: "Submitted",
    documents,
    declaration: $("#appDeclaration").checked
  };

  applications.push(app);
  saveData();
  renderDashboard();

  form.reset();
  $$("[data-file-name]").forEach(item => item.textContent = "No file chosen");
  showWizardStep(1);

  showToast("Application submitted", `${app.id} has been created successfully.`);
  showModal("Application submitted successfully", `
    <div class="empty-state">
      <i class="fa-solid fa-circle-check"></i>
      <h3>Thank you, ${escapeHTML(app.name)}!</h3>
      <p>Your application has been saved in this browser demo.</p>
      <p><strong>Application ID:</strong> ${escapeHTML(app.id)}</p>
      <p><strong>Course:</strong> ${escapeHTML(app.course)}</p>
      <p><strong>Status:</strong> ${escapeHTML(app.status)}</p>
      <button class="btn btn-primary" data-action="open-application" data-id="${escapeHTML(app.id)}">View Application</button>
    </div>
  `);
}

/* APPLICATION ACTIONS */

function changeApplicationStatus(id, newStatus) {
  const app = getApplication(id);
  if (!app) return;

  app.status = newStatus;
  saveData();
  renderDashboard();
  renderReviewCards();
  renderAdmissionTable();
  renderApplicationDetail();

  showToast("Status updated", `${app.name}'s status is now ${newStatus}.`);
}

function askStatusChange(id) {
  const app = getApplication(id);
  if (!app) return;

  const statuses = [
    "Submitted",
    "Under Review",
    "Shortlisted",
    "Merit List",
    "Admitted",
    "Rejected"
  ];

  showModal("Update Application Status", `
    <p class="modal-description">Select a new status for ${escapeHTML(app.name)}.</p>
    <form id="statusChangeForm">
      <div class="form-group">
        <label for="newApplicationStatus">Application Status</label>
        <select id="newApplicationStatus" required>
          ${statuses.map(status => `
            <option ${app.status === status ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      </div>
      <div class="detail-actions">
        <button type="button" class="btn btn-outline" data-close-modal>Cancel</button>
        <button type="submit" class="btn btn-primary">Save Status</button>
      </div>
    </form>
  `);

  $("#statusChangeForm").addEventListener("submit", event => {
    event.preventDefault();
    const status = $("#newApplicationStatus").value;
    closeModal($("#actionModal"));
    changeApplicationStatus(id, status);
  });
}

function confirmDelete(id) {
  const app = getApplication(id);
  if (!app) return;

  showModal("Delete Application", `
    <p class="modal-description">Are you sure you want to delete the application for <strong>${escapeHTML(app.name)}</strong>? This action cannot be undone.</p>
    <div class="detail-actions">
      <button class="btn btn-outline" data-close-modal>Cancel</button>
      <button class="btn btn-primary" style="background:#e34d59" data-action="confirm-delete" data-id="${escapeHTML(id)}">Delete Application</button>
    </div>
  `);
}

function deleteApplication(id) {
  applications = applications.filter(app => app.id !== id);
  saveData();
  renderDashboard();
  renderDocuments();
  renderReviewCards();
  renderAdmissionTable();
  renderReports();
  closeModal($("#actionModal"));
  showToast("Application deleted", `${id} has been removed.`);
}

function printAdmissionLetter(id) {
  const app = getApplication(id);
  if (!app) return;

  if (app.status !== "Admitted") {
    showToast("Admission not confirmed", "Confirm admission before printing an admission letter.", true);
    return;
  }

  const printWindow = window.open("", "_blank", "width=850,height=700");

  if (!printWindow) {
    showToast("Popup blocked", "Allow popups in your browser to print the letter.", true);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Admission Letter - ${escapeHTML(app.id)}</title>
      <style>
        body{font-family:Arial,sans-serif;color:#20213a;padding:50px;line-height:1.7}
        .letter{max-width:700px;margin:auto;border:2px solid #7c3aed;padding:40px}
        h1{color:#7c3aed;text-align:center}
        .muted{color:#777}
        .sign{margin-top:70px}
        @media print{body{padding:0}.letter{border:1px solid #7c3aed}}
      </style>
    </head>
    <body>
      <article class="letter">
        <h1>ADMISSION CONFIRMATION</h1>
        <p class="muted">AdmitPro College Admission Portal · Session 2026–27</p>
        <hr>
        <p>Date: ${formatDate(todayISO())}</p>
        <p>Application ID: <strong>${escapeHTML(app.id)}</strong></p>
        <p>Dear <strong>${escapeHTML(app.name)}</strong>,</p>
        <p>We are pleased to confirm that your admission has been recorded in the AdmitPro demonstration portal.</p>
        <p><strong>Programme:</strong> ${escapeHTML(app.course)}</p>
        <p><strong>Academic score:</strong> ${Number(app.score || 0).toFixed(2)}%</p>
        <p><strong>Admission status:</strong> Admitted</p>
        <p>This letter is generated by a frontend demonstration and is not an official institutional admission document.</p>
        <div class="sign"><strong>Admission Office</strong><br>AdmitPro Demo Portal</div>
      </article>
      <script>window.onload=()=>window.print();<\/script>
    </body>
    </html>
  `);

  printWindow.document.close();
}

function updateDocumentStatus(id, key) {
  const app = getApplication(id);
  if (!app) return;

  const docLabels = {
    photo: "Passport Photo",
    signature: "Signature",
    marksheet10: "10th Marksheet",
    marksheet12: "12th Marksheet",
    transferCertificate: "Transfer Certificate",
    identityProof: "Identity Proof"
  };

  const existing = (app.documents || []).find(doc => doc.key === key);
  const options = ["Pending", "Verified", "Missing"];

  showModal("Verify Document", `
    <p class="modal-description">${escapeHTML(app.name)} · ${escapeHTML(docLabels[key] || key)}</p>
    <form id="documentStatusForm">
      <div class="form-group">
        <label for="newDocumentStatus">Verification Status</label>
        <select id="newDocumentStatus">
          ${options.map(status => `
            <option ${((existing?.status || "Pending") === status) ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      </div>
      <div class="detail-actions">
        <button class="btn btn-outline" type="button" data-close-modal>Cancel</button>
        <button class="btn btn-primary" type="submit">Save</button>
      </div>
    </form>
  `);

  $("#documentStatusForm").addEventListener("submit", event => {
    event.preventDefault();

    const status = $("#newDocumentStatus").value;
    app.documents = app.documents || [];

    if (existing) {
      existing.status = status;
      existing.date = todayISO();
    } else {
      app.documents.push({
        key,
        label: docLabels[key] || key,
        fileName: "",
        status,
        date: todayISO()
      });
    }

    saveData();
    closeModal($("#actionModal"));
    renderDocuments();
    showToast("Document status updated", `${docLabels[key]}: ${status}.`);
  });
}

/* MERIT LIST */

function generateMeritList() {
  const course = $("#meritCourseFilter").value;
  const cutoff = Number($("#meritCutoff").value || 0);

  if (cutoff < 0 || cutoff > 100) {
    showToast("Invalid cutoff", "Minimum percentage must be between 0 and 100.", true);
    return;
  }

  generatedMerit = applications
    .filter(app => (!course || app.course === course) && Number(app.score || 0) >= cutoff)
    .filter(app => app.status !== "Rejected")
    .sort((a, b) => {
      const scoreDifference = Number(b.score || 0) - Number(a.score || 0);
      if (scoreDifference !== 0) return scoreDifference;
      return Number(b.entranceScore || 0) - Number(a.entranceScore || 0);
    });

  $("#meritTableBody").innerHTML = generatedMerit.length
    ? generatedMerit.map((app, index) => `
      <tr>
        <td><strong>#${index + 1}</strong></td>
        <td>${escapeHTML(app.name)}</td>
        <td>${escapeHTML(app.id)}</td>
        <td>${escapeHTML(app.course)}</td>
        <td>${Number(app.score || 0).toFixed(2)}%</td>
        <td>${app.entranceScore === "" || app.entranceScore == null ? "—" : Number(app.entranceScore).toFixed(2) + "%"}</td>
        <td>${statusBadge(app.status)}</td>
      </tr>
    `).join("")
    : emptyTableRow(7, "No eligible candidates match this cutoff.");

  setText("meritCount", `${generatedMerit.length} Candidates`);
  setText("meritDescription", `Candidates with at least ${cutoff}% academic score${course ? ` in ${course}` : ""}, ranked by academic score.`);
  showToast("Merit list generated", `${generatedMerit.length} eligible candidates found.`);
}

function downloadCSV(filename, rows) {
  const csv = rows.map(row => row.map(value => {
    let text = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  }).map(value => value).join(",")).join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportMeritList() {
  if (!generatedMerit.length) {
    showToast("No merit list", "Generate a merit list before exporting.", true);
    return;
  }

  const rows = [
    ["Rank", "Student", "Application ID", "Course", "Academic Score", "Entrance Score", "Status"],
    ...generatedMerit.map((app, index) => [
      index + 1,
      app.name,
      app.id,
      app.course,
      app.score,
      app.entranceScore ?? "",
      app.status
    ])
  ];

  downloadCSV("admitpro-merit-list.csv", rows);
  showToast("CSV exported", "Merit list downloaded.");
}

function exportReports() {
  const rows = [
    ["Application ID", "Student", "Email", "Phone", "Course", "Qualification", "Academic Score", "Entrance Score", "Date", "Status"],
    ...applications.map(app => [
      app.id, app.name, app.email, app.phone, app.course,
      app.qualification, app.score, app.entranceScore ?? "", app.date, app.status
    ])
  ];

  downloadCSV("admitpro-admission-report.csv", rows);
  showToast("Report exported", "Admission report downloaded.");
}

/* GLOBAL CLICK HANDLERS */

document.addEventListener("click", event => {
  const goButton = event.target.closest("[data-go]");
  if (goButton) {
    event.preventDefault();
    openPage(goButton.dataset.go);
    return;
  }

  const navLink = event.target.closest(".nav-link[data-page]");
  if (navLink) {
    event.preventDefault();
    openPage(navLink.dataset.page);
    return;
  }

  const closeButton = event.target.closest("[data-close-modal]");
  if (closeButton) {
    closeModal(closeButton.closest(".modal-backdrop"));
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const { action, id, doc } = actionButton.dataset;

  switch (action) {
    case "view":
      selectedApplicationId = id;
      closeModal($("#actionModal"));
      openPage("application-detail");
      break;

    case "edit-status":
      askStatusChange(id);
      break;

    case "delete":
      confirmDelete(id);
      break;

    case "confirm-delete":
      deleteApplication(id);
      break;

    case "approve":
      changeApplicationStatus(id, "Shortlisted");
      break;

    case "reject":
      changeApplicationStatus(id, "Rejected");
      break;

    case "admit": {
      const app = getApplication(id);
      if (app && ["Shortlisted", "Merit List"].includes(app.status)) {
        changeApplicationStatus(id, "Admitted");
      } else {
        showToast("Not eligible", "Only shortlisted or merit-listed applicants can be confirmed.", true);
      }
      break;
    }

    case "print-letter":
      printAdmissionLetter(id);
      break;

    case "document-status":
      updateDocumentStatus(id, doc);
      break;

    case "open-application":
      selectedApplicationId = id;
      closeModal($("#actionModal"));
      openPage("application-detail");
      break;
  }
});

/* AUTHENTICATION DEMO */

function showAuthModal() {
  $("#authModal")?.classList.remove("hidden");
}

function handleLogin(event) {
  event.preventDefault();

  const email = $("#loginEmail").value.trim();
  const password = $("#loginPassword").value;

  if (email === "admin@admitpro.demo" && password === "admin123") {
    sessionStorage.setItem(AUTH_KEY, "true");
    closeModal($("#authModal"));
    showToast("Welcome back", "You are signed in to the AdmitPro demo.");
    return;
  }

  showToast("Sign in failed", "Use admin@admitpro.demo and admin123 for this demo.", true);
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  showAuthModal();
  showToast("Signed out", "Demo sign-in has been cleared.");
}

/* THEME */

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);

  const icon = $("#themeToggle i");
  if (icon) {
    icon.className = `fa-solid ${isDark ? "fa-sun" : "fa-moon"}`;
  }

  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

/* EVENT LISTENERS */

function bindEvents() {
  $("#registrationForm")?.addEventListener("submit", handleRegistration);
  $("#applicationForm")?.addEventListener("submit", handleApplicationSubmit);
  $("#loginForm")?.addEventListener("submit", handleLogin);

  $("#menuToggle")?.addEventListener("click", toggleSidebar);
  $("#sidebarClose")?.addEventListener("click", closeSidebar);
  $("#sidebarOverlay")?.addEventListener("click", closeSidebar);

  $("#themeToggle")?.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("dark-mode") ? "light" : "dark");
  });

  $("#logoutBtn")?.addEventListener("click", logout);

  $("#notificationBtn")?.addEventListener("click", () => {
    const pending = countStatus("Submitted") + countStatus("Under Review");
    showModal("Admission Notifications", `
      <div class="detail-field">
        <strong>${pending} applications need attention</strong>
        <small>Submitted or under-review applications</small>
      </div>
      <div class="detail-actions">
        <button class="btn btn-outline" data-close-modal>Close</button>
        <button class="btn btn-primary" data-go="review">Review Applications</button>
      </div>
    `);
  });

  $("#refreshDashboard")?.addEventListener("click", () => {
    applications = loadArray(STORAGE_KEY, DEFAULT_APPLICATIONS);
    students = loadArray(STUDENT_KEY, DEFAULT_STUDENTS);
    renderDashboard();
    showToast("Dashboard refreshed", "The latest saved data is now displayed.");
  });

  ["applicationSearch", "statusFilter", "courseFilter", "dateFilter"].forEach(id => {
    const element = document.getElementById(id);
    element?.addEventListener("input", renderApplicationTable);
    element?.addEventListener("change", renderApplicationTable);
  });

  $("#clearFilters")?.addEventListener("click", () => {
    ["applicationSearch", "statusFilter", "courseFilter", "dateFilter"].forEach(id => {
      const element = document.getElementById(id);
      if (element) element.value = "";
    });
    renderApplicationTable();
  });

  $("#documentSearch")?.addEventListener("input", renderDocuments);
  $("#documentStatusFilter")?.addEventListener("change", renderDocuments);
  $("#admissionSearch")?.addEventListener("input", renderAdmissionTable);
  $("#admissionStatusFilter")?.addEventListener("change", renderAdmissionTable);

  $("#prevStep")?.addEventListener("click", () => {
    showWizardStep(currentStep - 1);
  });

  $("#nextStep")?.addEventListener("click", () => {
    if (!validateWizardPage(currentStep)) return;
    showWizardStep(currentStep + 1);
  });

  $("#applicationForm")?.addEventListener("input", () => {
    if (currentStep === 3) updateApplicationSummary();
  });

  $$("[data-file-name]").forEach(label => {
    const input = document.getElementById(label.dataset.fileName);
    input?.addEventListener("change", () => {
      const file = input.files?.[0];
      label.textContent = file ? file.name : "No file chosen";
    });
  });

  $("#generateMerit")?.addEventListener("click", generateMeritList);
  $("#exportMerit")?.addEventListener("click", exportMeritList);
  $("#exportReport")?.addEventListener("click", exportReports);

  $$(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".modal-backdrop:not(.hidden)").forEach(closeModal);
      closeSidebar();
    }
  });

  window.addEventListener("hashchange", () => {
    const page = location.hash.replace("#", "");
    if (document.getElementById(page)?.classList.contains("page-section")) {
      openPage(page);
    }
  });
}

/* INITIALIZATION */

function init() {
  bindEvents();

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  renderDashboard();
  renderDocuments();
  renderReviewCards();
  renderAdmissionTable();
  renderCourses();
  renderReports();
  showWizardStep(1);

  const initialPage = location.hash.replace("#", "");
  if (document.getElementById(initialPage)?.classList.contains("page-section")) {
    openPage(initialPage);
  } else {
    openPage("dashboard");
  }

  // This is a frontend demo. The sign-in modal is optional.
  // To require sign-in on every new session, uncomment the next line:
  // if (sessionStorage.getItem(AUTH_KEY) !== "true") showAuthModal();
}

document.addEventListener("DOMContentLoaded", init);
