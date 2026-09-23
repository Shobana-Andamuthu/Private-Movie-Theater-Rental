/* ==========================================================================
   VELLORA — Interactive JavaScript Controller
   Features: Theme Switcher, RTL Switcher, Navigation, Modals, Booking & Tabs
   ========================================================================== */

// --- 0. Cinematic Page Preloader Controller ---
function initVelloraPreloader() {
  const preloader = document.getElementById('vellora-preloader');
  if (!preloader) return;

  const dismiss = () => {
    preloader.classList.add('loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  };

  if (document.readyState === 'complete') {
    setTimeout(dismiss, 500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismiss, 500);
    });
    // Guaranteed fallback dismissal
    setTimeout(dismiss, 2200);
  }
}
initVelloraPreloader();

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Management (Light / Dark) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('vellora_theme') || 'light';
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vellora_theme', theme);
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // --- 2. RTL / LTR Direction Management ---
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const savedDir = localStorage.getItem('vellora_dir') || 'ltr';

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('vellora_dir', dir);
    rtlToggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
    });
  }

  applyDir(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDir(newDir);
    });
  });

  // --- 2.5 Navigation Dropdown (Click & Hover Support) ---
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        navDropdowns.forEach(d => d.classList.remove('open'));
        if (!isOpen) {
          dropdown.classList.add('open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      navDropdowns.forEach(d => d.classList.remove('open'));
    }
  });

  // --- 3. Mobile Navigation Drawer ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (hamburgerBtn && mobileDrawer) {
    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      hamburgerBtn.classList.remove('active');
    };

    const toggleDrawer = () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        mobileDrawer.classList.add('open');
        hamburgerBtn.classList.add('active');
      }
    };

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeDrawer();
      }
    });
  }

  // --- 4. Header Scroll State ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // --- 5. Back to Top Button ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 6. Password Visibility Toggle ---
  const passwordToggles = document.querySelectorAll('.toggle-password-btn');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      if (input) {
        const isPass = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPass ? 'text' : 'password');
        toggle.innerHTML = isPass
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      }
    });
  });

  // --- 7. VELLORA Rooms Page Data & Advanced Multi-Filter Engine ---
  const roomsGrid = document.getElementById('rooms-grid');
  if (roomsGrid) {
    const VELLORA_ROOMS = [
      {
        id: 'room-1',
        name: 'Velvet Starlight Duo',
        capacityGroup: 'couples',
        capacityMin: 1,
        capacityMax: 2,
        guestBadge: '⭐ 1–2 Guests',
        availabilityTag: '⏱ Available Today',
        availabilityType: 'today',
        pillTag: '★ BESPOKE',
        location: '📍 Level 2 • Suite A',
        description: 'Plush motorized velvet love-lounger, fiber-optic starlight ceiling, and curated sommelier champagne service.',
        optics: '130" 4K',
        acoustics: '7.1 Atmos',
        features: ['atmos', 'laser', 'sommelier', 'starlight', 'recliners'],
        price: 130,
        oldPrice: 165,
        period: '/ 2.5 hrs',
        image: 'assets/images/room-couple-starlight.jpg',
        alt: 'Velvet Starlight Duo 2 Guests Private Suite'
      },
      {
        id: 'room-2',
        name: 'The Romance Cocoon',
        capacityGroup: 'couples',
        capacityMin: 1,
        capacityMax: 2,
        guestBadge: '⭐ 1–2 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ ISOLATED',
        location: '📍 Level 2 • Suite B',
        description: 'Dual heated leather recliners with cashmere blankets, 135″ 4K OLED display, and dimmable amber mood lighting.',
        optics: '135" OLED',
        acoustics: 'THX Spatial',
        features: ['soundproof', 'recliners', 'heated'],
        price: 145,
        oldPrice: 180,
        period: '/ 2.5 hrs',
        image: 'assets/images/room-couple-romance.jpg',
        alt: 'The Romance Cocoon Intimate 2 Guests Private Cinema'
      },
      {
        id: 'room-3',
        name: 'Skyline Midnight Sanctuary',
        capacityGroup: 'couples',
        capacityMin: 1,
        capacityMax: 2,
        guestBadge: '⭐ 1–2 Guests',
        availabilityTag: '⏱ Available Today',
        availabilityType: 'today',
        pillTag: '★ PREMIUM',
        location: '📍 Starlight Deck',
        description: 'Velvet recliner daybed with panoramic ambient false-window projection, acoustic isolation, and wine service.',
        optics: '140" Laser',
        acoustics: '7.2 Atmos',
        features: ['atmos', 'laser', 'sommelier', 'recliners'],
        price: 160,
        oldPrice: 195,
        period: '/ 2.5 hrs',
        image: 'assets/images/room-couple-skyline.jpg',
        alt: 'Skyline Midnight Sanctuary 2 Guests Suite'
      },
      {
        id: 'room-4',
        name: 'Artisan Family Lounge',
        capacityGroup: 'family',
        capacityMin: 4,
        capacityMax: 6,
        guestBadge: '🔥 4–6 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ FAMILY',
        location: '📍 Wing A • Suite 1',
        description: 'Plush wraparound sectional sofa, customizable warm lighting, kids beanbags, and private snack staging counter.',
        optics: '155" HDR',
        acoustics: '7.1 Sound',
        features: ['atmos', 'recliners'],
        price: 195,
        oldPrice: 240,
        period: '/ 2.5 hrs',
        image: 'assets/images/room-family-artisan.jpg',
        alt: 'Artisan Family Lounge 4-6 Guests Private Cinema'
      },
      {
        id: 'room-5',
        name: 'The Hearth Family Theater',
        capacityGroup: 'family',
        capacityMin: 4,
        capacityMax: 6,
        guestBadge: '🔥 4–6 Guests',
        availabilityTag: '⏱ Available Today',
        availabilityType: 'today',
        pillTag: '★ HEATED',
        location: '📍 Wing A • Suite 2',
        description: 'Tiered luxury micro-suede couches, cup warmers, kid-friendly vault, and fresh popcorn staging counter.',
        optics: '165" Laser',
        acoustics: '7.2 Dolby',
        features: ['laser', 'heated', 'recliners'],
        price: 210,
        oldPrice: 260,
        period: '/ 2.5 hrs',
        image: 'assets/images/room-family-hearth.jpg',
        alt: 'The Hearth Family Theater 4-6 Guests Suite'
      },
      {
        id: 'room-6',
        name: 'Cozy Haven Screening Den',
        capacityGroup: 'family',
        capacityMin: 4,
        capacityMax: 6,
        guestBadge: '🔥 4–6 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ DEN',
        location: '📍 Wing A • Suite 3',
        description: 'Low-profile plush daybeds, acoustic fabric walls, wireless headphones option, and kid-safe snack buffet.',
        optics: '150" Wide',
        acoustics: 'THX Spatial',
        features: ['soundproof', 'heated'],
        price: 225,
        oldPrice: 275,
        period: '/ 3 hrs',
        image: 'assets/images/room-family-haven.jpg',
        alt: 'Cozy Haven Screening Den 4-6 Guests Private Room'
      },
      {
        id: 'room-7',
        name: 'The Noir Sanctuary',
        capacityGroup: 'vip',
        capacityMin: 7,
        capacityMax: 10,
        guestBadge: '✨ 8–10 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ VIP',
        location: '📍 VIP Wing • Suite 1',
        description: 'Italian aniline leather recliners with wireless charging, walnut acoustic slats, and dedicated butler bell.',
        optics: '180" 4K',
        acoustics: '9.2 Atmos',
        features: ['atmos', 'laser', 'recliners', 'sommelier', 'soundproof'],
        price: 290,
        oldPrice: 350,
        period: '/ 3 hrs',
        image: 'assets/images/room-vip-noir.jpg',
        alt: 'The Noir Sanctuary VIP 8-10 Guests Private Cinema'
      },
      {
        id: 'room-8',
        name: 'The Executive Screening Suite',
        capacityGroup: 'vip',
        capacityMin: 7,
        capacityMax: 10,
        guestBadge: '✨ 8–10 Guests',
        availabilityTag: '⏱ Available Today',
        availabilityType: 'today',
        pillTag: '★ SOMMELIER',
        location: '📍 VIP Wing • Suite 2',
        description: 'Boardroom acoustics with 10 motorized loungers, 200″ micro-perforated laser screen, and sommelier tasting bar.',
        optics: '200" Laser',
        acoustics: '11.4 Atmos',
        features: ['atmos', 'laser', 'sommelier', 'recliners', 'soundproof'],
        price: 330,
        oldPrice: 400,
        period: '/ 3 hrs',
        image: 'assets/images/room-vip-executive.jpg',
        alt: 'Executive Screening Suite 8-10 Guests Private Hall'
      },
      {
        id: 'room-9',
        name: 'The Sovereign Chamber',
        capacityGroup: 'vip',
        capacityMin: 7,
        capacityMax: 10,
        guestBadge: '✨ 8–10 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ FLAGSHIP',
        location: '📍 Penthouse Suite',
        description: 'Bespoke acoustic baffling, 10 deep velvet club recliners, 11.4.6 Dolby Atmos array, and private arrival foyer.',
        optics: '210" 4K',
        acoustics: '11.4 Atmos',
        features: ['atmos', 'laser', 'recliners', 'starlight', 'soundproof'],
        price: 380,
        oldPrice: 460,
        period: '/ 3 hrs',
        image: 'assets/images/room-vip-sovereign.jpg',
        alt: 'The Sovereign Cinema Chamber 8-10 Guests VIP Suite'
      },
      {
        id: 'room-10',
        name: 'Celebration Party Suite',
        capacityGroup: 'parties',
        capacityMin: 10,
        capacityMax: 16,
        guestBadge: '🎉 Up to 16 Guests',
        availabilityTag: '⏱ Available Today',
        availabilityType: 'today',
        pillTag: '★ PARTY',
        location: '📍 Gala Hall A',
        description: 'Equipped with customizable RGB party lighting, celebration dessert buffet counter, and wireless toast microphones.',
        optics: '220" Screen',
        acoustics: 'THX Sound',
        features: ['atmos', 'sommelier', 'starlight', 'soundproof'],
        price: 350,
        oldPrice: 420,
        period: '/ 3 hrs',
        image: 'assets/images/room-party-celebration.jpg',
        alt: 'Celebration Suite Up to 16 Guests Private Theater'
      },
      {
        id: 'room-11',
        name: 'Esports & Gaming Arena',
        capacityGroup: 'parties',
        capacityMin: 10,
        capacityMax: 16,
        guestBadge: '🎮 Up to 16 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ 120HZ',
        location: '📍 Arena Wing',
        description: '120Hz 4K low-latency projector, PS5 / Xbox docking, eight wireless controllers, and stadium seating.',
        optics: '120Hz Laser',
        acoustics: '3D Spatial',
        features: ['gaming', 'laser', 'soundproof'],
        price: 390,
        oldPrice: 475,
        period: '/ 3 hrs',
        image: 'assets/images/room-party-gaming.jpg',
        alt: 'Esports and Gaming Private Cinema Den Up to 16 Guests'
      },
      {
        id: 'room-12',
        name: 'Grand Private Auditorium',
        capacityGroup: 'parties',
        capacityMin: 10,
        capacityMax: 16,
        guestBadge: '👑 Up to 16 Guests',
        availabilityTag: '⚡ Instant Booking',
        availabilityType: 'instant',
        pillTag: '★ AUDITORIUM',
        location: '📍 Main Premiere Hall',
        description: 'Tiered luxury leather armchairs, automated stage curtain reveal, and private foyer for exclusive premiere galas.',
        optics: '240" Laser',
        acoustics: '11.4 Atmos',
        features: ['atmos', 'laser', 'recliners', 'sommelier', 'soundproof'],
        price: 450,
        oldPrice: 550,
        period: '/ 3.5 hrs',
        image: 'assets/images/room-party-auditorium.jpg',
        alt: 'Grand Private Auditorium Movie Suite Up to 16 Guests'
      }
    ];

    const capacityPills = document.querySelectorAll('#rooms-capacity-filter .pill-btn');
    const featureSelect = document.getElementById('filter-feature');
    const availabilitySelect = document.getElementById('filter-availability');
    const sortSelect = document.getElementById('filter-sort');
    const resetBtn = document.getElementById('btn-reset-filters');
    const emptyResetBtn = document.getElementById('btn-empty-reset');
    const countNumber = document.getElementById('count-number');
    const emptyState = document.getElementById('rooms-empty-state');

    let activeCapacity = 'all';

    function renderRooms() {
      const selectedFeature = featureSelect ? featureSelect.value : 'all';
      const selectedAvailability = availabilitySelect ? availabilitySelect.value : 'all';
      const selectedSort = sortSelect ? sortSelect.value : 'default';

      let filtered = VELLORA_ROOMS.filter(room => {
        // Capacity filter
        if (activeCapacity !== 'all' && room.capacityGroup !== activeCapacity) {
          return false;
        }
        // Feature filter
        if (selectedFeature !== 'all' && !room.features.includes(selectedFeature)) {
          return false;
        }
        // Availability filter
        if (selectedAvailability !== 'all' && room.availabilityType !== selectedAvailability) {
          return false;
        }
        return true;
      });

      // Sorting
      if (selectedSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (selectedSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (selectedSort === 'capacity-asc') {
        filtered.sort((a, b) => a.capacityMin - b.capacityMin);
      } else if (selectedSort === 'capacity-desc') {
        filtered.sort((a, b) => b.capacityMax - a.capacityMax);
      }

      // Update count text
      if (countNumber) {
        countNumber.textContent = filtered.length;
      }

      // Render cards or empty state
      if (filtered.length === 0) {
        roomsGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        roomsGrid.innerHTML = filtered.map(room => `
          <div class="cinema-card" data-category="${room.capacityGroup}" data-room-id="${room.id}">
            <div class="card-media">
              <img src="${room.image}" alt="${room.alt}" loading="lazy">
              <span class="card-badge">${room.guestBadge}</span>
              <span class="card-badge-bottom">${room.availabilityTag}</span>
            </div>
            <div class="card-body">
              <div class="card-meta-row">
                <span class="card-meta-pill">${room.pillTag}</span>
                <span class="card-location">${room.location}</span>
              </div>
              <h3 class="card-title">${room.name}</h3>
              <p class="card-desc">${room.description}</p>
              <div class="card-spec-box">
                <span><strong>Optics:</strong> ${room.optics}</span>
                <span><strong>Acoustics:</strong> ${room.acoustics}</span>
              </div>
              <div class="card-footer">
                <div class="price-tag">
                  <span class="amount">$${room.price}</span>
                  <span class="old-price">$${room.oldPrice}</span>
                  <span class="period">${room.period}</span>
                </div>
                <button class="btn-card-action" onclick="location.href='dashboard.html'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Book Suite
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // Capacity pill listeners
    capacityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        capacityPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCapacity = pill.getAttribute('data-capacity') || 'all';
        renderRooms();
      });
    });

    // Secondary filter listeners
    if (featureSelect) featureSelect.addEventListener('change', renderRooms);
    if (availabilitySelect) availabilitySelect.addEventListener('change', renderRooms);
    if (sortSelect) sortSelect.addEventListener('change', renderRooms);

    function resetAllFilters() {
      activeCapacity = 'all';
      capacityPills.forEach(p => {
        if (p.getAttribute('data-capacity') === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      if (featureSelect) featureSelect.value = 'all';
      if (availabilitySelect) availabilitySelect.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      renderRooms();
    }

    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

    // Initial render
    renderRooms();
  } else {
    // Generic fallback for other pages (like movies-snacks.html)
    const genericPills = document.querySelectorAll('.category-pill-filter .pill-btn');
    genericPills.forEach(pill => {
      pill.addEventListener('click', () => {
        genericPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const targetCat = pill.getAttribute('data-filter') || pill.getAttribute('data-capacity');
        const cards = document.querySelectorAll('[data-category]');
        cards.forEach(card => {
          const itemCat = card.getAttribute('data-category');
          if (targetCat === 'all' || itemCat === targetCat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 8. Dashboard Tab Navigation (Desktop Sidebar & Mobile Horizontal Tabs) ---
  const dashMenuItems = document.querySelectorAll('.dash-menu-item');
  const dashTabPills = document.querySelectorAll('.dash-tab-pill');
  const dashTabPanes = document.querySelectorAll('.dash-tab-pane');

  function activateDashboardTab(targetTab) {
    if (!targetTab) return;

    dashMenuItems.forEach(i => {
      if (i.getAttribute('data-tab') === targetTab) {
        i.classList.add('active');
      } else {
        i.classList.remove('active');
      }
    });

    dashTabPills.forEach(p => {
      if (p.getAttribute('data-tab') === targetTab) {
        p.classList.add('active');
        p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        p.classList.remove('active');
      }
    });

    dashTabPanes.forEach(pane => {
      if (pane.id === `tab-${targetTab}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  dashMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      activateDashboardTab(targetTab);
    });
  });

  dashTabPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetTab = pill.getAttribute('data-tab');
      activateDashboardTab(targetTab);
    });
  });

  // --- 9. Modal Management (Booking Modal) ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, [data-modal-close]');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // --- 10. FAQ Accordion Dropdowns ---
  const faqHeaders = document.querySelectorAll('.faq-accordion-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-accordion-item');
      const isActive = item.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-accordion-item').forEach(i => i.classList.remove('active'));
      
      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- 11. Simple Toast Feedback ---
  let velloraToastTimer = null;
  window.showVelloraToast = function(message) {
    let toast = document.getElementById('vellora-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vellora-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color: #10B981; font-weight: 800; font-size: 1.05rem;">✓</span> <span>${message}</span>`;
    toast.classList.add('show');

    if (velloraToastTimer) clearTimeout(velloraToastTimer);
    velloraToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };
});

