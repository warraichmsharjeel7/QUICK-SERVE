/**
 * QuickServe - Unified Web Application Logic
 */

// Initial Specialists Catalog
const INITIAL_SPECIALISTS = [
    {
        id: "spec-1",
        name: "David Miller",
        category: "Electrical",
        serviceName: "Electrical Repair & Wiring",
        rating: 4.9,
        reviewsCount: 124,
        hourlyRate: 45,
        location: "Chicago, IL",
        description: "Expert electrical repairs, house wiring, circuit breaker maintenance, and smart home lighting installations."
    },
    {
        id: "spec-2",
        name: "Sarah Jenkins",
        category: "AC Repair",
        serviceName: "HVAC & AC Service",
        rating: 4.8,
        reviewsCount: 98,
        hourlyRate: 55,
        location: "Chicago, IL",
        description: "Specialized in central air conditioning repair, duct cleaning, gas refilling, and heating maintenance."
    },
    {
        id: "spec-3",
        name: "Michael Brown",
        category: "Plumbing",
        serviceName: "Plumbing & Pipe Fixing",
        rating: 4.7,
        reviewsCount: 87,
        hourlyRate: 40,
        location: "Chicago, IL",
        description: "Emergency leak fixes, drain cleaning, tap replacement, and bathroom fixture setups."
    },
    {
        id: "spec-4",
        name: "James Wilson",
        category: "Painting",
        serviceName: "Interior & Exterior Painting",
        rating: 4.9,
        reviewsCount: 156,
        hourlyRate: 42,
        location: "Chicago, IL",
        description: "Premium wall painting, texture finish, wallpaper application, and waterproof exterior coatings."
    },
    {
        id: "spec-5",
        name: "Emily Davis",
        category: "Cleaning",
        serviceName: "Full Home Deep Cleaning",
        rating: 4.8,
        reviewsCount: 112,
        hourlyRate: 35,
        location: "Chicago, IL",
        description: "Complete house sanitization, sofa deep wash, carpet cleaning, and kitchen degreasing."
    },
    {
        id: "spec-6",
        name: "Robert Taylor",
        category: "Carpentry",
        serviceName: "Custom Furniture & Repairs",
        rating: 4.6,
        reviewsCount: 76,
        hourlyRate: 50,
        location: "Chicago, IL",
        description: "Door lock repairs, custom wood cabinets, table assembling, and furniture restoration."
    }
];

// Initial Demo Bookings
const DEMO_BOOKINGS = [
    {
        id: "BK-1001",
        serviceName: "Electrical Repair & Wiring",
        providerName: "David Miller",
        date: "2026-11-02",
        time: "10:30",
        address: "Block 5, Clifton, Karachi",
        status: "Pending",
        price: 45,
        notes: "Please inspect main switchboard."
    },
    {
        id: "BK-1002",
        serviceName: "Full Home Deep Cleaning",
        providerName: "Emily Davis",
        date: "2026-10-29",
        time: "14:00",
        address: "DHA Phase 6, Karachi",
        status: "Completed",
        price: 35,
        rating: "5",
        review: "Excellent and prompt deep cleaning service!",
        notes: "Focus on living room carpets."
    }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initBookingsStorage();
    setupNavigation();
    renderSpecialists();
    renderDashboard();
    initCounters();
});

/* LocalStorage Storage Handlers */
function getBookings() {
    return JSON.parse(localStorage.getItem('user_bookings')) || [];
}

function saveBookings(bookings) {
    localStorage.setItem('user_bookings', JSON.stringify(bookings));
}

function initBookingsStorage() {
    if (!localStorage.getItem('user_bookings')) {
        saveBookings(DEMO_BOOKINGS);
    }
}

/* Theme Toggle (Light / Dark) */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        showToast(`Switched to ${newTheme.toUpperCase()} theme`);
    });
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggleBtn');
    btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

/* Page Navigation Management */
function setupNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
}

function handleHashChange() {
    let hash = window.location.hash.replace('#', '');
    if (!hash) hash = 'home';
    switchTab(hash, false);
}

function switchTab(pageId, updateHash = true) {
    if (updateHash) {
        window.location.hash = pageId;
    }

    const pages = document.querySelectorAll('.page-section');
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.getElementById('navMenu').classList.remove('show');

    if (pageId === 'dashboard') {
        renderDashboard();
    }
}

/* Home Search Handlers */
function handleHomeSearch() {
    const q = document.getElementById('homeSearchInput').value.trim();
    if (q) {
        switchTab('services');
        document.getElementById('serviceSearchInput').value = q;
        renderSpecialists();
    }
}

function filterServicesCategory(categoryName) {
    switchTab('services');
    document.getElementById('categorySelectFilter').value = categoryName;
    renderSpecialists();
}

/* Render Specialists */
function renderSpecialists() {
    const container = document.getElementById('specialistsContainer');
    if (!container) return;

    const query = (document.getElementById('serviceSearchInput')?.value || '').toLowerCase();
    const category = document.getElementById('categorySelectFilter')?.value || 'All';

    const filtered = INITIAL_SPECIALISTS.filter(spec => {
        const matchesQuery = spec.name.toLowerCase().includes(query) || 
                             spec.serviceName.toLowerCase().includes(query) ||
                             spec.description.toLowerCase().includes(query);
        const matchesCategory = (category === 'All') || (spec.category === category);
        return matchesQuery && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3.5rem; background: var(--bg-card); border-radius: var(--radius-lg);">
                <i class="fa-solid fa-user-slash" style="font-size: 2.8rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h3>No Specialists Found</h3>
                <p style="color: var(--text-muted);">Try adjusting your search query or category filter.</p>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(spec => `
        <div class="specialist-card">
            <div class="spec-head">
                <div class="avatar-box">${getInitials(spec.name)}</div>
                <div class="spec-head-info">
                    <h3>${spec.name}</h3>
                    <div class="spec-category">${spec.serviceName}</div>
                    <div class="spec-rating">★ ${spec.rating} <span>(${spec.reviewsCount} reviews)</span></div>
                </div>
            </div>
            <div class="spec-body">
                <p class="spec-desc">${spec.description}</p>
            </div>
            <div class="spec-foot">
                <div class="price-tag">$${spec.hourlyRate} <small>/ hr</small></div>
                <button class="btn btn-primary" onclick="openBookingModal('${spec.name}', '${spec.serviceName}', ${spec.hourlyRate})">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

/* Modal Functions */
function openBookingModal(providerName, serviceName, rate) {
    document.getElementById('modalProviderName').value = providerName;
    document.getElementById('modalServiceName').value = serviceName;
    document.getElementById('modalRate').value = rate;
    document.getElementById('modalServiceDisplay').value = `${serviceName} - by ${providerName}`;
    document.getElementById('modalProviderSubtitle').innerText = `Rate: $${rate}/hr • Guaranteed Professional Service`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('bookDate').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('bookTime').value = "10:00";

    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const providerName = document.getElementById('modalProviderName').value;
    const serviceName = document.getElementById('modalServiceName').value;
    const price = parseFloat(document.getElementById('modalRate').value) || 40;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const address = document.getElementById('bookAddress').value;
    const notes = document.getElementById('bookNotes').value;

    const newBooking = {
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceName,
        providerName,
        date,
        time,
        address,
        notes,
        price,
        status: 'Pending'
    };

    const bookings = getBookings();
    bookings.unshift(newBooking);
    saveBookings(bookings);

    closeBookingModal();
    showToast(`Booking Successful! Order ID: ${newBooking.id}`);
    switchTab('dashboard');
}

/* Dashboard Render Workflow */
function renderDashboard() {
    const bookings = getBookings();
    const tbody = document.getElementById('dashboardTableBody');

    document.getElementById('statTotal').innerText = bookings.length;
    document.getElementById('statPending').innerText = bookings.filter(b => b.status === 'Pending').length;
    document.getElementById('statInProgress').innerText = bookings.filter(b => b.status === 'In Progress').length;
    document.getElementById('statCompleted').innerText = bookings.filter(b => b.status === 'Completed').length;

    if (!tbody) return;

    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    No active bookings found. <a href="#services" onclick="switchTab('services')" style="color: var(--primary); font-weight:700;">Book a service now</a>.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>#${b.id}</strong></td>
            <td>
                <div style="font-weight:700;">${b.serviceName}</div>
                <small style="color: var(--text-muted);">Provider: ${b.providerName}</small>
            </td>
            <td>${b.date} <small style="color: var(--text-muted);">(${b.time})</small></td>
            <td>
                <span class="status-pill ${b.status.toLowerCase().replace(' ', '-')}">${b.status}</span>
            </td>
            <td class="text-right">
                ${b.status === 'Pending' ? `<button class="btn btn-outline" style="padding:0.35rem 0.7rem; font-size:0.8rem;" onclick="updateBookingStatus('${b.id}', 'Accepted')">Accept</button>` : ''}
                ${b.status === 'Accepted' ? `<button class="btn btn-primary" style="padding:0.35rem 0.7rem; font-size:0.8rem;" onclick="updateBookingStatus('${b.id}', 'In Progress')">Start Work</button>` : ''}
                ${b.status === 'In Progress' ? `<button class="btn btn-primary" style="padding:0.35rem 0.7rem; font-size:0.8rem; background:#16a34a;" onclick="updateBookingStatus('${b.id}', 'Completed')">Mark Done</button>` : ''}
                
                ${b.status === 'Completed' && !b.rating ? `<button class="btn btn-outline" style="padding:0.35rem 0.7rem; font-size:0.8rem; border-color:#d97706; color:#d97706;" onclick="openReviewModal('${b.id}')">Add Review</button>` : ''}
                ${b.rating ? `<span style="font-size:0.85rem; color:#f59e0b; font-weight:bold;">★ ${b.rating}/5</span>` : ''}

                <button class="btn btn-outline" style="padding:0.35rem 0.7rem; font-size:0.8rem; margin-left:0.3rem;" onclick="viewBookingReceipt('${b.id}')">Receipt</button>
            </td>
        </tr>
    `).join('');
}

function updateBookingStatus(id, newStatus) {
    let bookings = getBookings();
    bookings = bookings.map(b => {
        if (b.id === id) b.status = newStatus;
        return b;
    });
    saveBookings(bookings);
    renderDashboard();
    showToast(`Order #${id} status updated to: ${newStatus}`);
}

/* Review Modal Functions */
function openReviewModal(bookingId) {
    document.getElementById('reviewBookingId').value = bookingId;
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
}

function handleReviewSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('reviewBookingId').value;
    const rating = document.getElementById('ratingScore').value;
    const review = document.getElementById('reviewComment').value;

    let bookings = getBookings();
    bookings = bookings.map(b => {
        if (b.id === id) {
            b.rating = rating;
            b.review = review;
        }
        return b;
    });
    saveBookings(bookings);
    closeReviewModal();
    renderDashboard();
    showToast("Thank you! Feedback recorded successfully.");
}

/* Receipt View */
function viewBookingReceipt(bookingId) {
    const bookings = getBookings();
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return;

    const detailContainer = document.getElementById('bookingDetailContent');
    const basePrice = parseFloat(b.price || 40);
    const platformFee = 5.00;
    const total = basePrice + platformFee;

    detailContainer.innerHTML = `
        <div class="receipt-card">
            <div class="receipt-head">
                <div>
                    <h2>${b.serviceName}</h2>
                    <p>Booking ID: #${b.id}</p>
                </div>
                <span class="status-pill ${b.status.toLowerCase().replace(' ', '-')}">${b.status}</span>
            </div>
            <div class="receipt-body">
                <div>
                    <div style="margin-bottom:1.2rem;">
                        <span class="sub-title">SCHEDULE & TIME</span>
                        <strong style="font-size:1.1rem;">${b.date} at ${b.time}</strong>
                    </div>
                    <div style="margin-bottom:1.2rem;">
                        <span class="sub-title">SERVICE LOCATION</span>
                        <p>${b.address}</p>
                    </div>
                    <div style="margin-bottom:1.2rem;">
                        <span class="sub-title">SPECIAL INSTRUCTIONS</span>
                        <p>${b.notes || 'No special notes provided.'}</p>
                    </div>
                    <div>
                        <span class="sub-title">ASSIGNED SPECIALIST</span>
                        <div style="display:flex; align-items:center; gap:0.8rem; margin-top:0.4rem;">
                            <div class="avatar-box" style="width:44px; height:44px; font-size:1.1rem;">${getInitials(b.providerName)}</div>
                            <strong>${b.providerName}</strong>
                        </div>
                    </div>
                </div>

                <div class="price-summary-box">
                    <h3>Payment Details</h3>
                    <hr style="margin:0.8rem 0; border-color:var(--border-color);">
                    <div class="price-row">
                        <span>Base Rate</span>
                        <span>$${basePrice.toFixed(2)}</span>
                    </div>
                    <div class="price-row">
                        <span>Platform Fee</span>
                        <span>$${platformFee.toFixed(2)}</span>
                    </div>
                    <div class="price-total">
                        <span>Total Paid</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary btn-block" style="margin-top:1.5rem;" onclick="window.print()">
                        <i class="fa-solid fa-print"></i> Print Receipt
                    </button>
                </div>
            </div>
        </div>
    `;

    switchTab('detail');
}

/* Contact Form Handler */
function handleContactSubmit(e) {
    e.preventDefault();
    showToast("Message sent successfully! We will contact you soon.");
    document.getElementById('contactForm').reset();
}

/* Animated Counters */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;

        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.ceil(count) + (target >= 1000 ? 'K+' : '+');
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = (target >= 1000 ? '10K+' : target + '+');
            }
        };
        updateCount();
    });
}

/* Toast System */
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#22c55e;"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}