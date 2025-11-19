// Basic site JS: mobile menu, progress observer, timeline rendering + filters

// Mobile menu toggle
document.querySelectorAll('.mobile-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const nav = btn.closest('header').querySelector('nav ul');
        if (nav) nav.classList.toggle('show');
    });
});

// Progress observer (robust)
(function() {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.2 };
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector ? entry.target.querySelector('.progress-fill') : null;
                if (progressFill) {
                    const cls = Array.from(progressFill.classList).find(c => /^progress-(\d+)$/.test(c));
                    let width = 0;
                    if (cls) {
                        const match = cls.match(/^progress-(\d+)$/);
                        width = match ? match[1] : 0;
                    }
                    progressFill.style.width = (parseInt(width, 10) || 0) + '%';
                }
                progressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.progress-card').forEach(card => {
        progressObserver.observe(card);
    });
})();

// Timeline data (from provided schedule)
const timelineData = [
    { week: 0, date: "Monday, October 6, 2025", activity: "Team formation and Advisor Assignment", responsible: "Coordinators and HoDs", venue: "", category: "coordinators" },
    { week: 1, date: "Monday, October 6, 2025", activity: "IETP Guideline release", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 1, date: "Tuesday, October 7, 2025", activity: "Team and advisor announcement", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 1, date: "Wednesday, October 8, 2025", activity: "Orientation - Introduction to IETP", responsible: "Coordinators, students, advisors", venue: "", category: "coordinators students advisors" },
    { week: 1, date: "Friday, October 10, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 1, date: "Wednesday, October 15, 2025", activity: "Training/Visiting in Mechanical Workshop (safety & operation)", responsible: "Students, advisors, Coordinators and HoDs", venue: "", category: "students coordinators advisors" },
    { week: 1, date: "Friday, October 17, 2025", activity: "Training/Visiting in Mechanical Workshop (safety & operation)", responsible: "Students, advisors, Coordinators and HoDs", venue: "", category: "students coordinators advisors" },
    { week: 2, date: "Monday, October 20, 2025", activity: "IETP Lecture 1: Team Dynamics and Communication", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 2, date: "Friday, October 24, 2025", activity: "Submit project ideas to advisor [Form A]", responsible: "Students", venue: "", category: "students" },
    { week: 2, date: "Friday, October 24, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 3, date: "Monday, October 27, 2025", activity: "IETP Lecture 2: Design Process", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 3, date: "Friday, October 31, 2025", activity: "Project idea selection [Form B]", responsible: "Students, advisors", venue: "", category: "students advisors" },
    { week: 3, date: "Friday, October 31, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 4, date: "Monday, November 3, 2025", activity: "IETP Lecture 3: Project Methodology", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 4, date: "Friday, November 7, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 5, date: "Monday, November 10, 2025", activity: "IETP Lecture 4: Fabrication Process and Lab Safety", responsible: "Coordinators", venue: "eLearning/LMS", category: "coordinators" },
    { week: 5, date: "Friday, November 14, 2025", activity: "Submission of project proposal", responsible: "Students", venue: "", category: "students" },
    { week: 5, date: "Friday, November 14, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 6, date: "Friday, November 21, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 7, date: "Friday, November 28, 2025", activity: "BoM and procurement plan", responsible: "Students", venue: "", category: "students" },
    { week: 7, date: "Friday, November 28, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 8, date: "Friday, December 5, 2025", activity: "Submission of progress report", responsible: "Student", venue: "", category: "students" },
    { week: 8, date: "Friday, December 5, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 9, date: "Friday, December 12, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 10, date: "Friday, December 19, 2025", activity: "Group meet with Advisor", responsible: "Students, advisors", venue: "", category: "advisors students" },
    { week: 11, date: "Friday, December 26, 2025", activity: "Evaluation of prototype fabrication", responsible: "Students, advisors", venue: "", category: "evaluation" },
    { week: 12, date: "Wednesday, January 1, 2025", activity: "Poster evaluation", responsible: "Students, Evaluators", venue: "", category: "evaluation" },
    { week: 12, date: "Wednesday, January 1, 2025", activity: "Prototype demonstration", responsible: "Students, Evaluators", venue: "", category: "evaluation" },
    { week: 12, date: "Wednesday, January 1, 2025", activity: "Group and individual oral presentation", responsible: "Students, Evaluators", venue: "", category: "evaluation" },
    { week: 13, date: "Friday, January 3, 2025", activity: "Peer evaluation", responsible: "Students", venue: "", category: "students evaluation" },
    { week: 13, date: "Friday, January 3, 2025", activity: "e-portfolio evaluation", responsible: "Advisors", venue: "", category: "advisors evaluation" },
    { week: 13, date: "Friday, January 3, 2025", activity: "Final report submission", responsible: "Students to Advisors", venue: "", category: "students advisors" },
    { week: 15, date: "Friday, January 17, 2025", activity: "Innovation Exhibition Day", responsible: "Coordinators and HoDs", venue: "", category: "coordinators" }
];

// Render timeline items into container
function renderTimeline(data) {
    const container = document.querySelector('.timeline-container');
    if (!container) return;
    container.innerHTML = '';

    // sort by week numeric then date string
    const sorted = data.slice().sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week;
        return a.date.localeCompare(b.date);
    });

    const frag = document.createDocumentFragment();

    sorted.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        if (item.category) el.setAttribute('data-category', item.category);

        const weekLabel = item.week !== undefined ? `Wk${item.week}` : '';
        const dateLabel = item.date || '';
        const activity = item.activity || '';
        const responsible = item.responsible || '';
        const venue = item.venue || '';

        el.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-week">${weekLabel}</div>
                <div class="timeline-date">${dateLabel}</div>
                <div class="timeline-activity">${activity}</div>
                <div class="timeline-responsible">Responsible: ${responsible}</div>
                ${venue ? `<div class="timeline-venue">Venue: ${venue}</div>` : ''}
            </div>
        `;
        frag.appendChild(el);
    });

    container.appendChild(frag);
}

// Setup filter buttons (shows/hides by data-category)
function setupTimelineFilters() {
    const container = document.querySelector('.timeline-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!container || !filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            container.querySelectorAll('.timeline-item').forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('faded');
                } else {
                    const cats = (item.getAttribute('data-category') || '').split(/\s+/);
                    if (cats.includes(filter)) item.classList.remove('faded');
                    else item.classList.add('faded');
                }
            });
        });
    });
}

// Ensure groupMembers is defined (if already present, keep that data). If not, use this array:
const groupMembers = [
    { slug: "kirubel-teshome", name: "Kirubel Teshome", reg: "ETS0798/15", email: "kirubel.teshome@aastustudent.edu.et", photo: "assets/img/kira.jpg" },
    { slug: "amhasilasie-mulugeta", name: "Amhasilasie Mulugeta", reg: "ETS0181/14", email: "amhasilasie.mulugeta@aastustudent.edu.et", photo: "assets/img/amha.jpg" },
    { slug: "hermela-dereje", name: "Hermela Dereje", reg: "ETS0794/14", email: "hermela.dereje@aastustudent.edu.et" },
    { slug: "samrawit-zegeye", name: "Samrawit Zegeye", reg: "ETS1191/15", email: "samrawit.zegeye@aastustudent.edu.et", photo: "assets/img/samri.jpg" },
    { slug: "fares-haile", name: "Fares Haile Kifle", reg: "ETS0530/15", email: "fares.haile@aastustudent.edu.et", photo: "assets/img/fares.jpg" },
    { slug: "faysel-nesru", name: "Faysel Nesru", reg: "ETS0533/15", email: "faysel.nesru@aastustudent.edu.et", photo: "assets/img/faysel.jpg" },
    { slug: "emmanuel-yonas", name: "Emmanuel Yonas", reg: "ETS0449/15", email: "emmanuel.yonas@aastustudent.edu.et", photo: "assets/img/emmanuel.jpg" },
    { slug: "eden-yedemie", name: "Eden Yedemie Ejigu", reg: "ETS0410/15", email: "eden.yedemie@aastustudent.edu.et", photo: "assets/img/eden.png" }
];

function getInitials(fullName) {
    return fullName.split(' ').map(n => n[0] || '').slice(0,2).join('').toUpperCase();
}

function renderTeam(members) {
    const container = document.getElementById('timeline-team');
    if (!container) return;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    members.forEach(m => {
        const el = document.createElement('div');
        el.className = 'team-member';

        // show photo if provided, otherwise show initials avatar
        const avatarHtml = m.photo
            ? `<img src="${m.photo}" alt="${m.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 16px;">`
            : `<div class="member-avatar">${getInitials(m.name)}</div>`;

        el.innerHTML = `
            ${avatarHtml}
            <div class="member-info">
                <h3>${m.name}</h3>
                <p>${m.reg}</p>
                <p class="member-email">${m.email}</p>
            </div>
        `;
        frag.appendChild(el);
    });

    container.appendChild(frag);
}

// Initialize timeline and team rendering after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    renderTimeline(timelineData);
    setupTimelineFilters();
    renderTeam(groupMembers);
});

// Contact form prevention (placeholder)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sending is disabled in this demo.');
    });
}

// Helper: render progress team grid (progress.html)
function renderProgressTeam(members = groupMembers) {
    const container = document.getElementById('progress-team');
    if (!container) return;
    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    members.forEach(m => {
        const card = document.createElement('div');
        card.className = 'team-member';
        const photo = m.photo ? `<img src="${m.photo}" alt="${m.name}" class="member-photo">` : `<div class="member-avatar">${getInitials(m.name)}</div>`;
        card.innerHTML = `
            <a href="progress-member.html?member=${encodeURIComponent(m.slug)}" class="member-link" style="text-decoration:none;color:inherit;">
                ${photo}
                <div class="member-info">
                    <h3>${m.name}</h3>
                    <p class="member-reg">${m.reg || ''}</p>
                </div>
            </a>
        `;
        frag.appendChild(card);
    });

    container.appendChild(frag);
}

// Helper: get member by slug
function getMemberBySlug(slug) {
    return groupMembers.find(m => m.slug === slug) || null;
}

// Journal storage helpers (localStorage)
function loadJournals(slug) {
    try {
        const raw = localStorage.getItem('journals_' + slug);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}
function saveJournals(slug, entries) {
    localStorage.setItem('journals_' + slug, JSON.stringify(entries));
}

// Render member journal page if on progress-member.html
function initMemberJournal() {
    const headerEl = document.getElementById('member-header');
    const journalEl = document.getElementById('member-journal');
    if (!journalEl || !headerEl) return;

    const params = new URLSearchParams(location.search);
    const slug = params.get('member');
    const member = getMemberBySlug(slug);
    if (!member) {
        headerEl.innerHTML = `<div class="section-title"><h2>Member Not Found</h2><p><a href="progress.html">Back to Progress</a></p></div>`;
        journalEl.innerHTML = '';
        return;
    }

    headerEl.innerHTML = `
        <div class="section-title">
            <h2>${member.name}</h2>
            <p>${member.reg || ''} — <a href="progress.html">Back to members</a></p>
        </div>
    `;

    // build journal UI: week select, textarea, save button, entries list
    journalEl.innerHTML = `
        <div class="journal-form">
            <label for="journal-week">Week</label>
            <select id="journal-week">${[...Array(20)].map((_,i)=>`<option value="${i}">Week ${i}</option>`).join('')}</select>
            <label for="journal-text">Progress notes</label>
            <textarea id="journal-text" rows="6" placeholder="Describe progress, tasks completed, blockers, next steps"></textarea>
            <div style="margin-top:8px;">
                <button id="journal-save" class="btn">Save Entry</button>
                <button id="journal-clear" class="btn btn-outline" style="margin-left:8px;">Clear All</button>
            </div>
        </div>
        <hr/>
        <div id="journal-entries"><h3>Entries</h3><div class="entries-list"></div></div>
    `;

    const entriesList = journalEl.querySelector('.entries-list');

    function refreshEntries() {
        const entries = loadJournals(slug).sort((a,b) => (b.week - a.week) || (b.createdAt - a.createdAt));
        if (!entries.length) {
            entriesList.innerHTML = '<p>No entries yet.</p>';
            return;
        }
        entriesList.innerHTML = '';
        entries.forEach((e, idx) => {
            const card = document.createElement('div');
            card.className = 'journal-entry';
            const date = new Date(e.createdAt).toLocaleString();
            card.innerHTML = `
                <div class="journal-meta"><strong>Week ${e.week}</strong> <span class="muted"> — ${date}</span></div>
                <div class="journal-body">${(e.text||'').replace(/\n/g,'<br>')}</div>
                <div style="margin-top:6px;"><button data-idx="${idx}" class="btn btn-danger btn-small journal-delete">Delete</button></div>
            `;
            entriesList.appendChild(card);
        });
    }

    refreshEntries();

    journalEl.querySelector('#journal-save').addEventListener('click', () => {
        const week = Number(journalEl.querySelector('#journal-week').value);
        const text = journalEl.querySelector('#journal-text').value.trim();
        if (!text) {
            alert('Enter some notes before saving.');
            return;
        }
        const entries = loadJournals(slug);
        entries.push({ week, text, createdAt: Date.now() });
        saveJournals(slug, entries);
        journalEl.querySelector('#journal-text').value = '';
        refreshEntries();
    });

    journalEl.querySelector('#journal-clear').addEventListener('click', () => {
        if (!confirm('Clear all journal entries for this member?')) return;
        saveJournals(slug, []);
        refreshEntries();
    });

    journalEl.addEventListener('click', (e) => {
        if (e.target && e.target.matches && e.target.matches('.journal-delete')) {
            const idx = Number(e.target.getAttribute('data-idx'));
            const entries = loadJournals(slug);
            // delete the correct entry by createdAt index to be safe
            entries.splice(idx, 1);
            saveJournals(slug, entries);
            refreshEntries();
        }
    });
}

// wire renderers on DOM ready without breaking existing handlers
document.addEventListener('DOMContentLoaded', () => {
    // existing initializations (timeline, team, etc.) may also run here in your file
    renderProgressTeam();     // renders the members grid on progress.html
    initMemberJournal();      // inits the journal UI on progress-member.html (no-op elsewhere)
});