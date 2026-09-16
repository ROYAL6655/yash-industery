/**
 * YASH INDUSTRIES - TABBED MULTI-PAGE APPLICATION ROUTER
 * Switches between dedicated page views on click, manages browser hash history,
 * Day/Night theme switcher, filterable products, RFQ calculator, and downloads.
 */

(function () {
  'use strict';

  // Available Page Tabs (9 Active Corporate Pages)
  const VALID_TABS = [
    'home',
    'about',
    'capabilities',
    'infrastructure',
    'rfq',
    'customers',
    'gallery',
    'downloads',
    'contact'
  ];

  // Comprehensive Product Database for Modals & RFQ Integration
  const PRODUCTS_DATA = {
    'conveyor-roller': {
      title: 'Heavy-Duty Industrial Conveyor & Drive Rollers',
      category: 'Rollers & Shafts',
      badge: 'Dynamic Balancing G2.5',
      description: 'Precision engineered conveyor, guide, and drive rollers manufactured from heavy-wall seamless steel tubing and solid forged shafts. Dynamically balanced for high-speed material handling, packaging, and mining conveyor systems.',
      specs: {
        'Diameter Range': 'Ø 50 mm to Ø 400 mm (Length up to 3,500 mm)',
        'Material Grades': 'Carbon Steel, SS 304, SS 316, Rubber-Lagged, Polyurethane Coated',
        'Shaft Journals': 'Precision ground for standard 6200/6300 series bearings with circlip grooves',
        'Balancing Standard': 'ISO 1940 Grade G2.5 dynamic balancing for vibration-free rotation',
        'Surface Finish': 'Hard Chrome Plated, Black Oxide, or Diamond-Pattern Rubber Lagging',
        'Applications': 'Automated logistics sortation, belt conveyors, steel rolling mills, printing lines'
      }
    },
    'sprocket': {
      title: 'Precision Industrial Sprockets (Simplex, Duplex, Triplex)',
      category: 'Transmission & Gearing',
      badge: 'Induction Hardened Teeth',
      description: 'Manufactured to ANSI, BS, and DIN 8187 standards with induction hardened teeth for maximum wear resistance. Available in pilot bore, finished bore with keyway, or taper-lock bushing configurations.',
      specs: {
        'Standard': 'DIN 8187, ISO 606, ANSI B29.1 (Pitch 3/8" to 2-1/2")',
        'Configurations': 'Simplex, Duplex, Triplex, Plate Wheels, Taper-Lock Hubs',
        'Material Grades': 'C45 Carbon Steel, EN8, EN19, SS 304, Cast Iron FG 260',
        'Tooth Hardness': '45 - 55 HRC (Induction Hardened to 2-3 mm depth)',
        'Bore Tolerance': 'H7 tolerance with standard DIN 6885 keyways and set screws',
        'Applications': 'Chain drives, bucket elevators, agricultural machinery, assembly lines'
      }
    },
    'spur-gear': {
      title: 'High-Precision Spur & Helical Gears',
      category: 'Gears & Pinions',
      badge: 'DIN Grade 6 Accuracy',
      description: 'Precision hobbed, profile-ground spur and helical gears engineered for smooth power transmission, high torque loading, and low acoustic noise.',
      specs: {
        'Module Range': 'Module 1.0 to Module 12.0 (Up to Ø 800 mm)',
        'Tooth Profile': 'Involute tooth profile with profile shift optimization and crowning',
        'Material Grades': '20MnCr5, EN24 (Alloy 4340), EN19, Delrin / Nylon for silent drives',
        'Heat Treatment': 'Case Carburized & Quenched (58-62 HRC) with shot peening',
        'Tooth Grinding': 'CNC Profile Ground to DIN 3962 Class 6 / AGMA 12',
        'Applications': 'Industrial gearboxes, crane hoists, machine tool heads, robotics'
      }
    },
    'pinion-shaft': {
      title: 'Integrated Pinion & Spline Shafts',
      category: 'Gears & Pinions',
      badge: 'Zero Backlash Fit',
      description: 'Single-piece forged pinion shafts featuring precision involute or straight-sided splines, ground bearing seats, and hardened pinion gears for extreme torsional rigidity.',
      specs: {
        'Spline Standard': 'DIN 5480, DIN 5482, ANSI B92.1 Involute Splines',
        'Length Capacity': 'Up to 1,200 mm shaft length',
        'Material Grades': 'Case Hardening Steel 20MnCr5, AISI 8620, EN36C',
        'Runout & Concentricity': 'Total Indicator Reading (TIR) under 0.005 mm',
        'Applications': 'Planetary gear reducers, excavator swing drives, automotive differentials'
      }
    },
    'lead-screw': {
      title: 'Precision Trapezoidal & Ball Lead Screws',
      category: 'Lead Screws & Actuation',
      badge: 'Lead Error: ±0.01 mm / 300 mm',
      description: 'Thread-whirled and precision rolled lead screws paired with phosphor bronze or preloaded ball nuts for accurate linear positioning and heavy-load lifting.',
      specs: {
        'Thread Types': 'Trapezoidal (Tr 10x2 to Tr 100x12), Acme 2G/3G, Ball Screw ISO C5/C7',
        'Shaft Straightness': '0.05 mm per meter runout maximum',
        'Material Grades': 'Alloy Steel EN19/AISI 4140, SS 316, Bronze RG7 / PB1 for mating nuts',
        'Surface Hardness': 'Induction hardened thread surface (50-55 HRC)',
        'Applications': 'CNC machine slides, hydraulic press lifts, valve actuators, medical tables'
      }
    },
    'socket-bolt': {
      title: 'High-Tensile Hex Socket Head Cap Screws',
      category: 'Industrial Fasteners',
      badge: 'DIN 912 / ISO 4762',
      description: 'Cold-forged and precision-threaded socket head bolts engineered for high vibrational shock and maximum tensile clamping strength.',
      specs: {
        'Standard': 'DIN 912, ISO 4762, ASME B18.3',
        'Size Range': 'M3 to M36 (Length 6 mm to 300 mm)',
        'Material Grades': 'Alloy Steel (Grade 8.8, 10.9, 12.9), SS 304, SS 316, Inconel',
        'Tensile Strength': 'Up to 1,220 N/mm²',
        'Surface Finish': 'Black Oxide, Zinc Trivalent, Geomet 500, Phosphate',
        'Applications': 'Automotive powertrains, press dies, machine tool frames, turbines'
      }
    },
    'turned-shaft': {
      title: 'Multi-Axis CNC Precision Turned Shafts',
      category: 'Precision Machining',
      badge: 'Runout: ±0.002 mm',
      description: 'Complex multi-step shafts with keyways, external threads, and ground journal seats machined on twin-spindle CNC turning centers.',
      specs: {
        'Tolerance Range': '±0.002 mm (2 microns)',
        'Diameter Capacity': 'Ø 3 mm to Ø 250 mm',
        'Material Grades': 'EN24, EN19, AISI 4140, SS 316L, 17-4 PH Stainless',
        'Surface Finish': 'Ra 0.2 µm (Cylindrically Ground)',
        'Inspection': '100% CMM Runout & Concentricity Verified',
        'Applications': 'Hydraulic pumps, aerospace actuator shafts, high-speed spindles'
      }
    },
    'vmc-housing': {
      title: '4-Axis & 5-Axis VMC Milled Valve Housings',
      category: 'Precision Machining',
      badge: '5-Axis Synchronous',
      description: 'Prismatic valve blocks and manifolds milled from solid forged billets featuring deep internal cross-drilled oil channels and tight true positions.',
      specs: {
        'Tolerance Range': 'True Position within 0.008 mm',
        'Envelope Size': 'Up to 800 x 600 x 500 mm',
        'Material Grades': 'Aerospace Aluminum 6061-T6 / 7075, Duplex SS 2205, SG Iron',
        'Pressure Rating': 'Hydro-tested up to 350 bar (5,000 PSI)',
        'Applications': 'Oil & gas manifolds, aerospace valves, hydraulic steering systems'
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initTelemetryClock();
    initDayNightTheme();
    initTabRouter();
    initMobileNav();
    initStatsCounter();
    initProductFilters();
    initProductModal();
    initRfqCalculator();
    initGalleryFilter();
    initDownloadsManager();
    initContactForm();
    initScrollToTop();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // 0. Live Pune Shopfloor Telemetry Clock (IST UTC+5:30)
  function initTelemetryClock() {
    const clockEl = document.getElementById('telemetry-clock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      try {
        const timeString = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        clockEl.textContent = timeString;
      } catch (e) {
        clockEl.textContent = now.toTimeString().split(' ')[0];
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // =========================================================================
  // TAB ROUTER: OPENS SELECTED PAGE TAB, HIDES OTHERS, SCROLLS TO TOP
  // =========================================================================
  function initTabRouter() {
    function switchTab(tabId) {
      if (tabId === 'rfq-success') {
        tabId = 'rfq';
        setTimeout(() => {
          showToast('✅ RFQ Submitted Successfully! Your drawings and specifications have been sent to Yash Industries.');
        }, 300);
      }

      if (!VALID_TABS.includes(tabId)) {
        tabId = 'home';
      }

      // 1. Hide all pages
      document.querySelectorAll('.page-view').forEach(page => {
        page.classList.remove('active-page');
      });

      // 2. Show selected page
      const targetPage = document.getElementById(`page-${tabId}`);
      if (targetPage) {
        targetPage.classList.add('active-page');
      }

      // 3. Update active tab on Desktop nav and Mobile drawer
      document.querySelectorAll('[data-tab]').forEach(el => {
        if (el.getAttribute('data-tab') === tabId) {
          el.classList.add('active-tab');
        } else {
          el.classList.remove('active-tab');
        }
      });

      // 4. Update browser URL hash
      if (window.location.hash !== `#${tabId}`) {
        window.history.pushState(null, '', `#${tabId}`);
      }

      // 5. Scroll smoothly to the top of the newly opened tab
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 6. Close mobile drawer if open
      const drawer = document.getElementById('mobile-drawer');
      const overlay = document.getElementById('mobile-drawer-overlay');
      const toggleBtn = document.getElementById('mobile-menu-toggle');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      }

      // 7. Special page hooks
      if (tabId === 'home') {
        window.dispatchEvent(new Event('resize'));
        initStatsCounter();
      }

      // Re-render icons if needed
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    // Attach click handlers to all tab triggers
    document.querySelectorAll('[data-tab]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = trigger.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Handle browser Back / Forward buttons
    window.addEventListener('hashchange', () => {
      const currentTab = window.location.hash.replace('#', '') || 'home';
      switchTab(currentTab);
    });

    // Handle initial page load from hash or default to home
    const initialHash = window.location.hash.replace('#', '') || 'home';
    switchTab(initialHash);

    window.navigateToTab = switchTab;
  }

  // 1. Day / Night Theme Switcher Engine
  function initDayNightTheme() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    const mobileThemeBtn = document.getElementById('btn-theme-toggle-mobile');
    
    const savedTheme = localStorage.getItem('yash_theme') || 'light';
    applyTheme(savedTheme);

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('yash_theme', theme);

      const iconMarkup = theme === 'light' 
        ? '<i data-lucide="moon" style="width: 18px; height: 18px;"></i>'
        : '<i data-lucide="sun" style="width: 18px; height: 18px;"></i>';

      const themeThumb = document.getElementById('theme-switch-thumb');
      if (themeThumb) {
        themeThumb.innerHTML = theme === 'light'
          ? '<i data-lucide="sun" style="width: 13px; height: 13px;"></i>'
          : '<i data-lucide="moon" style="width: 13px; height: 13px;"></i>';
      } else if (themeBtn) {
        themeBtn.innerHTML = iconMarkup;
      }

      if (themeBtn) {
        themeBtn.setAttribute('title', theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode');
      }
      if (mobileThemeBtn) {
        mobileThemeBtn.innerHTML = (theme === 'light' 
          ? '<i data-lucide="moon" style="width: 16px; height: 16px;"></i>' 
          : '<i data-lucide="sun" style="width: 16px; height: 16px;"></i>') 
          + ` <span style="font-size: 0.85rem; margin-left: 6px; font-weight: 600;">${theme === 'light' ? 'Night Mode' : 'Day Mode'}</span>`;
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'light' ? 'Day Mode (Clean Industrial)' : 'Night Mode (Cyber-Precision)'}`);
    }

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);
  }

  // 2. Mobile Navigation Drawer
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');

    if (!toggleBtn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('active');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    overlay.addEventListener('click', closeDrawer);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  // 3. Animated Stats Counter with Intersection Observer
  function initStatsCounter() {
    const statBoxes = document.querySelectorAll('.stat-number');
    if (!statBoxes.length) return;

    statBoxes.forEach(box => {
      const target = parseFloat(box.getAttribute('data-target') || '0');
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = target * easeProgress;

        if (isDecimal) {
          box.querySelector('.val').textContent = current.toFixed(3);
        } else {
          box.querySelector('.val').textContent = Math.floor(current).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (isDecimal) {
            box.querySelector('.val').textContent = target.toFixed(3);
          } else {
            box.querySelector('.val').textContent = target.toLocaleString();
          }
        }
      }
      requestAnimationFrame(update);
    });
  }

  // 4. Product Catalog Filter System
  function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 5. Product Technical Spec Modal Dialog
  function initProductModal() {
    const modalOverlay = document.getElementById('spec-modal-overlay');
    const modalTitle = document.getElementById('modal-product-title');
    const modalCategory = document.getElementById('modal-product-category');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalSpecsTable = document.getElementById('modal-specs-tbody');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalRfqBtn = document.getElementById('modal-btn-rfq');

    if (!modalOverlay || !closeBtn) return;

    document.querySelectorAll('.btn-card-spec').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-product-id');
        const data = PRODUCTS_DATA[productId];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.description;

        let rowsHtml = '';
        for (const [key, value] of Object.entries(data.specs)) {
          rowsHtml += `
            <tr>
              <td class="prop-name">${key}</td>
              <td class="prop-val">${value}</td>
            </tr>
          `;
        }
        modalSpecsTable.innerHTML = rowsHtml;

        if (modalRfqBtn) {
          modalRfqBtn.onclick = () => {
            closeModal();
            selectRfqProduct(productId);
          };
        }

        openModal();
      });
    });

    document.querySelectorAll('.btn-card-quote').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-product-id');
        selectRfqProduct(productId);
      });
    });

    function openModal() {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    function selectRfqProduct(productId) {
      if (window.navigateToTab) {
        window.navigateToTab('rfq');
      }

      const compInput = document.getElementById('rfq-component');
      const matSelect = document.getElementById('rfq-material');
      const data = PRODUCTS_DATA[productId];

      if (compInput && data) {
        compInput.value = data.title;
      }

      if (matSelect && data) {
        if (productId.includes('roller')) matSelect.value = 'Carbon Steel (C45 / EN8 / EN9)';
        else if (productId.includes('sprocket')) matSelect.value = 'Carbon Steel (C45 / EN8 / EN9)';
        else if (productId.includes('gear')) matSelect.value = 'Case Hardening Steel (20MnCr5 / 8620)';
        else if (productId.includes('pinion')) matSelect.value = 'Case Hardening Steel (20MnCr5 / 8620)';
        else if (productId.includes('lead-screw')) matSelect.value = 'Alloy Steel (EN24 / 4140 / 4340)';
        else if (productId.includes('bolt')) matSelect.value = 'Alloy Steel (EN24 / 4140 / 4340)';
        else if (productId.includes('vmc')) matSelect.value = 'Aerospace Aluminum (6061-T6 / 7075-T6)';
      }

      showToast(`Selected "${data?.title || 'Component'}" for Request a Quote!`);
    }
  }

  // 6. Dedicated Engineering RFQ Engine (All 10 Fields)
  function initRfqCalculator() {
    const rfqForm = document.getElementById('dedicated-rfq-form');
    const nameInput = document.getElementById('rfq-name');
    const companyInput = document.getElementById('rfq-company');
    const phoneInput = document.getElementById('rfq-phone');
    const emailInput = document.getElementById('rfq-email');
    const componentInput = document.getElementById('rfq-component');
    const materialSelect = document.getElementById('rfq-material');
    const quantityInput = document.getElementById('rfq-quantity');
    const deliveryDateInput = document.getElementById('rfq-delivery-date');
    const requirementsInput = document.getElementById('rfq-requirements');

    const dropzone = document.getElementById('rfq-dropzone');
    const fileInput = document.getElementById('rfq-drawing-file');
    const dropzonePrompt = document.getElementById('dropzone-prompt');
    const fileChosenTag = document.getElementById('file-chosen-tag');
    const filenameLabel = document.getElementById('filename-label');
    const btnRemoveAttachment = document.getElementById('btn-remove-attachment');

    const btnSubmitWhatsapp = document.getElementById('btn-rfq-submit-whatsapp');
    const btnSubmitEmail = document.getElementById('btn-rfq-submit-email');

    let uploadedFileName = '';

    // Set default min date for delivery date picker (tomorrow)
    if (deliveryDateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Drag and drop drawing upload handling
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', (e) => {
        if (e.target !== fileInput && e.target !== btnRemoveAttachment && !btnRemoveAttachment?.contains(e.target)) {
          fileInput.click();
        }
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) {
          handleFile(e.target.files[0]);
        }
      });

      if (btnRemoveAttachment) {
        btnRemoveAttachment.addEventListener('click', (e) => {
          e.stopPropagation();
          clearFile();
        });
      }

      function handleFile(file) {
        uploadedFileName = file.name;
        if (filenameLabel) {
          filenameLabel.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        }
        if (dropzonePrompt) dropzonePrompt.style.display = 'none';
        if (fileChosenTag) fileChosenTag.style.display = 'inline-flex';
        showToast(`CAD file "${file.name}" attached successfully!`);
      }

      function clearFile() {
        uploadedFileName = '';
        fileInput.value = '';
        if (dropzonePrompt) dropzonePrompt.style.display = 'block';
        if (fileChosenTag) fileChosenTag.style.display = 'none';
      }
    }

    // Validation helper
    function validateForm() {
      const name = nameInput?.value.trim();
      const company = companyInput?.value.trim();
      const phone = phoneInput?.value.trim();
      const email = emailInput?.value.trim();
      const component = componentInput?.value.trim();
      const material = materialSelect?.value;
      const quantity = quantityInput?.value.trim();
      const deliveryDate = deliveryDateInput?.value;

      if (!name) {
        showToast('Please enter your Name');
        nameInput?.focus();
        return false;
      }
      if (!company) {
        showToast('Please enter your Company name');
        companyInput?.focus();
        return false;
      }
      if (!phone) {
        showToast('Please enter your Phone or WhatsApp number');
        phoneInput?.focus();
        return false;
      }
      if (!email) {
        showToast('Please enter your Business Email');
        emailInput?.focus();
        return false;
      }
      if (!component) {
        showToast('Please enter the Component Name / Part Description');
        componentInput?.focus();
        return false;
      }
      if (!material) {
        showToast('Please select a Material Grade');
        materialSelect?.focus();
        return false;
      }
      if (!quantity || parseInt(quantity) <= 0) {
        showToast('Please enter a valid Quantity');
        quantityInput?.focus();
        return false;
      }
      if (!deliveryDate) {
        showToast('Please select your Required Delivery Date');
        deliveryDateInput?.focus();
        return false;
      }

      return {
        name,
        company,
        phone,
        email,
        component,
        material,
        quantity,
        deliveryDate,
        drawing: uploadedFileName || 'Not attached (will email separately)',
        requirements: requirementsInput?.value.trim() || 'Standard tolerances & finishing as per drawing'
      };
    }

    // Submit via WhatsApp
    if (btnSubmitWhatsapp) {
      btnSubmitWhatsapp.addEventListener('click', (e) => {
        e.preventDefault();
        const data = validateForm();
        if (!data) return;

        const waMessage = 
          `*NEW RFQ - YASH INDUSTRIES*\n` +
          `================================\n` +
          `*1. Name:* ${data.name}\n` +
          `*2. Company:* ${data.company}\n` +
          `*3. Phone:* ${data.phone}\n` +
          `*4. Email:* ${data.email}\n` +
          `*5. Component:* ${data.component}\n` +
          `*6. Material:* ${data.material}\n` +
          `*7. Quantity:* ${data.quantity} Pcs\n` +
          `*8. Delivery Date:* ${data.deliveryDate}\n` +
          `*9. Drawing:* ${data.drawing}\n` +
          `*10. Requirements:*\n${data.requirements}\n` +
          `================================\n` +
          `_Submitted via Yash Industries Official RFQ Desk_`;

        const encodedMsg = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/919822050017?text=${encodedMsg}`;

        showToast('Generating official WhatsApp RFQ ticket...');
        setTimeout(() => window.open(waUrl, '_blank'), 600);
      });
    }

    // Form Submit Handler (Seamless In-Page AJAX Submission with File Upload)
    if (rfqForm) {
      rfqForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = validateForm();
        if (!data) return;

        const submitBtn = document.getElementById('btn-rfq-submit-email');
        const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

        // If opened locally via file:/// protocol, redirect to live site where web server APIs work
        if (window.location.protocol === 'file:') {
          showToast('Notice: Testing on offline file. Opening live website for file upload...');
          setTimeout(() => {
            window.open('https://royal6655.github.io/yash-industery/#rfq', '_blank');
          }, 600);
          return;
        }

        // Show loading spinner on button
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.75';
          submitBtn.innerHTML = `
            <svg style="width: 18px; height: 18px; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
            </svg>
            <span>Uploading Drawing &amp; Submitting RFQ...</span>
          `;
        }

        try {
          const formData = new FormData(rfqForm);
          formData.set('_captcha', 'false');

          const response = await fetch('https://formsubmit.co/ajax/yashindustries018@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          const result = await response.json();

          if (result && (result.success === 'true' || result.success === true)) {
            showSuccessBanner(data.name, data.component);
            rfqForm.reset();
            clearFile();
            showToast('✅ RFQ and CAD Drawing successfully submitted to Yash Industries!');
          } else {
            throw new Error(result.message || 'Submission failed');
          }
        } catch (err) {
          console.error('Submission error:', err);
          showToast('Form submission encountered an error. Opening WhatsApp ticket...');
          if (btnSubmitWhatsapp) {
            btnSubmitWhatsapp.click();
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = originalBtnHtml;
          }
        }
      });
    }

    function showSuccessBanner(name, component) {
      const existing = document.getElementById('rfq-success-banner');
      if (existing) existing.remove();

      const banner = document.createElement('div');
      banner.id = 'rfq-success-banner';
      banner.style.cssText = 'background: rgba(22, 163, 74, 0.12); border: 1.5px solid #22c55e; border-radius: 12px; padding: 1.75rem; margin-bottom: 2rem; text-align: center; color: var(--text-primary);';
      banner.innerHTML = `
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; font-size: 24px; font-weight: bold;">✓</div>
        <h3 style="color: #22c55e; margin-bottom: 0.5rem; font-size: 1.3rem; font-family: var(--font-heading);">RFQ &amp; Drawing Submitted Successfully!</h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 620px; margin: 0 auto 0.75rem auto; line-height: 1.6;">
          Thank you, <strong>${name || 'Client'}</strong>. Your technical parameters for <strong>${component || 'your component'}</strong> and attached drawing have been sent to <strong>yashindustries018@gmail.com</strong>.
        </p>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Our engineering team will assess your specifications and provide a formal quotation within 24 hours.
        </div>
      `;

      rfqForm.prepend(banner);
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // 7. Gallery Category Filter
  function initGalleryFilter() {
    const galleryBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryBtns.length || !galleryItems.length) return;

    galleryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galleryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-gallery-filter');

        galleryItems.forEach(item => {
          const cat = item.getAttribute('data-gallery-cat');
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; }, 30);
          } else {
            item.style.opacity = '0';
            setTimeout(() => { item.style.display = 'none'; }, 250);
          }
        });
      });
    });

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.gallery-title')?.textContent || 'Factory Asset';
        showToast(`Viewing high-resolution preview of "${title}"`);
      });
    });
  }

  // 8. Downloads Manager
  function initDownloadsManager() {
    document.querySelectorAll('.btn-download-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        const docName = btn.getAttribute('data-doc-name') || 'Document';

        if (href && href !== '#' && !href.startsWith('javascript:')) {
          showToast(`Downloading: ${docName}...`);
          return; // Allow native download
        }

        e.preventDefault();
        showToast(`Document "${docName}" is being prepared. Contact engineering desk.`);
      });
    });
  }

  // 9. General Contact Form
  function initContactForm() {
    const form = document.getElementById('contact-inquiry-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const company = document.getElementById('contact-company')?.value.trim();
      const msg = document.getElementById('contact-message')?.value.trim();

      const subject = encodeURIComponent(`Inquiry from ${name}${company ? ' (' + company + ')' : ''} - Yash Industries`);
      const body = encodeURIComponent(
        `Dear Yash Industries Team,\n\n` +
        `Name: ${name}\n` +
        (email ? `Email: ${email}\n` : '') +
        (company ? `Company: ${company}\n` : '') +
        `\nMessage:\n${msg}\n\n` +
        `Thank you.`
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yashindustries018@gmail.com&su=${subject}&body=${body}`;

      showToast('Thank you! Opening Gmail to send your inquiry...');
      setTimeout(() => window.open(gmailUrl, '_blank'), 700);
    });
  }

  // 10. Floating Scroll to Top
  function initScrollToTop() {
    const scrollBtn = document.getElementById('fab-scroll-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Helper: Toast HUD Notification
  function showToast(message) {
    let toast = document.getElementById('toast-hud-box');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-hud-box';
      toast.className = 'toast-hud';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  window.showPortalToast = showToast;
})();
