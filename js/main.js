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
    checkOfflinePreview();

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
        const banner = document.getElementById('rfq-success-banner');
        if (banner) {
          banner.style.display = 'block';
        }
        setTimeout(() => {
          showToast('✅ RFQ Submitted Successfully! Your drawings and specifications have been sent to Yash Industries.');
          if (banner) {
            banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
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
    const filesizeLabel = document.getElementById('filesize-label');
    const btnBrowseFile = document.getElementById('btn-browse-file');
    const btnChangeAttachment = document.getElementById('btn-change-attachment');
    const btnRemoveAttachment = document.getElementById('btn-remove-attachment');
    const hiddenDrawingName = document.getElementById('rfq-hidden-drawing-name');
    const hiddenDrawingSize = document.getElementById('rfq-hidden-drawing-size');

    const btnSubmitWhatsapp = document.getElementById('btn-rfq-submit-whatsapp');
    const btnSubmitEmail = document.getElementById('btn-rfq-submit-email');

    let uploadedFileName = '';

    // Set default min date for delivery date picker (tomorrow)
    if (deliveryDateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Drag and drop & manual file upload handling
    if (dropzone && fileInput) {
      // Clicking prompt or browse button triggers native file chooser
      if (dropzonePrompt) {
        dropzonePrompt.addEventListener('click', () => {
          fileInput.click();
        });
      }

      if (btnBrowseFile) {
        btnBrowseFile.addEventListener('click', (e) => {
          e.stopPropagation();
          fileInput.click();
        });
      }

      if (btnChangeAttachment) {
        btnChangeAttachment.addEventListener('click', (e) => {
          e.stopPropagation();
          fileInput.click();
        });
      }

      if (btnRemoveAttachment) {
        btnRemoveAttachment.addEventListener('click', (e) => {
          e.stopPropagation();
          clearFile();
        });
      }

      // Drag & drop handlers
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0];
          try {
            fileInput.files = e.dataTransfer.files;
          } catch (err) {
            console.warn('DataTransfer files assignment:', err);
          }
          handleFile(file);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length) {
          handleFile(e.target.files[0]);
        }
      });

      function handleFile(file) {
        if (!file) return;

        // FormSubmit strict 10MB limit check
        const MAX_BYTES = 10 * 1024 * 1024;
        if (file.size > MAX_BYTES) {
          showToast(`⚠️ File "${file.name}" exceeds 10MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please compress or ZIP.`);
          clearFile();
          return;
        }

        uploadedFileName = file.name;
        const sizeFormatted = file.size >= 1024 * 1024 
          ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
          : (file.size / 1024).toFixed(1) + ' KB';

        if (filenameLabel) filenameLabel.textContent = file.name;
        if (filesizeLabel) filesizeLabel.textContent = sizeFormatted;

        if (hiddenDrawingName) hiddenDrawingName.value = file.name;
        if (hiddenDrawingSize) hiddenDrawingSize.value = sizeFormatted;

        if (dropzonePrompt) dropzonePrompt.style.display = 'none';
        if (fileChosenTag) fileChosenTag.style.display = 'block';

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }

      function clearFile() {
        uploadedFileName = '';
        fileInput.value = '';
        if (hiddenDrawingName) hiddenDrawingName.value = 'None Attached';
        if (hiddenDrawingSize) hiddenDrawingSize.value = 'N/A';
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
      if (!phone) {
        showToast('Please enter your Phone or WhatsApp number');
        phoneInput?.focus();
        return false;
      }

      return {
        name,
        company: company || 'Industrial Client',
        phone,
        email: email || 'N/A',
        component: component || 'Precision Component',
        material: material || 'As per Drawing',
        quantity: quantity || '1',
        deliveryDate: deliveryDate || 'Standard Schedule',
        drawing: uploadedFileName || 'Not attached (will share via WhatsApp)',
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

    // Form Submit Handler: Direct native submission and redirect to FormSubmit, then to Gmail
    if (rfqForm) {
      rfqForm.addEventListener('submit', (e) => {
        // Sync CC to user email so they also get a direct copy in their Gmail inbox
        const userEmail = emailInput ? emailInput.value.trim() : '';
        const ccInput = document.getElementById('rfq-formsubmit-cc');
        if (ccInput && userEmail) {
          ccInput.value = userEmail;
        }

        // Sync metadata fields if attachment exists
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          if (file.size > 10 * 1024 * 1024) {
            e.preventDefault();
            alert(`File "${file.name}" exceeds the 10MB limit. Please choose a file under 10MB.`);
            return;
          }
          if (hiddenDrawingName) hiddenDrawingName.value = file.name;
          if (hiddenDrawingSize) {
            hiddenDrawingSize.value = file.size >= 1024 * 1024 
              ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
              : (file.size / 1024).toFixed(1) + ' KB';
          }
        } else {
          if (hiddenDrawingName) hiddenDrawingName.value = 'None Attached';
          if (hiddenDrawingSize) hiddenDrawingSize.value = 'N/A';
        }

        // Visual button status while redirecting (no popup message)
        const submitBtn = document.getElementById('btn-rfq-submit-email');
        if (submitBtn) {
          submitBtn.innerHTML = `
            <svg style="width: 18px; height: 18px; animation: spin 1s linear infinite; margin-right: 0.5rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
            </svg>
            <span>Submitting &amp; Opening Gmail...</span>
          `;
        }
        // Direct native browser POST & redirect to FormSubmit: NO popups, NO e.preventDefault()!
      });
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

  // Offline File Preview Banner
  function checkOfflinePreview() {
    if (window.location.protocol === 'file:') {
      const banner = document.createElement('div');
      banner.id = 'offline-preview-alert-bar';
      banner.style.cssText = 'background: #dc2626; color: #fff; padding: 10px 16px; text-align: center; font-weight: 600; font-size: 14px; position: fixed; top: 0; left: 0; width: 100%; z-index: 999999; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;';
      banner.innerHTML = `
        <span>⚠️ You are browsing an offline local file (file:///). Online form submissions &amp; drawing uploads require the live website.</span>
        <a href="https://royal6655.github.io/yash-industery/#rfq" style="background: #fff; color: #dc2626; padding: 4px 12px; border-radius: 4px; text-decoration: none; font-weight: 700;">Open Live Website</a>
      `;
      document.body.prepend(banner);
      document.body.style.paddingTop = '45px';
    }
  }

  window.showPortalToast = showToast;
})();
