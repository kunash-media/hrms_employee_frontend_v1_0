

/**
 * dashboard.js
 * SIEC Employee Portal — Dashboard
 *
 * Responsibilities:
 *   - Sidebar collapse / mobile toggle
 *   - Profile dropdown toggle
 *   - Date/time ticker
 *   - Chart rendering
 *
 * NOTE: auth.js (linked on the page) handles:
 *   - Session guard (redirect if not logged in)
 *   - User name / role / avatar population
 *   - ALL logout triggers → confirmation overlay
 *
 * DO NOT add logout confirm() calls, handleLogout(), or
 * any localStorage token reads for user display here.
 */

(function () {
  'use strict';

  const sidebar      = document.getElementById('sidebar');
  const mainContent  = document.getElementById('mainContent');
  const collapseBtn  = document.getElementById('collapseSidebarBtn');
  const mobileToggle = document.getElementById('mobileToggleBtn');
  const profileBtn   = document.getElementById('profileDropdownBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  let isProgrammaticResize = false;

  /* ─────────────────────────────────────────────
   * SIDEBAR COLLAPSE
   * ───────────────────────────────────────────── */
  function setSidebarCollapsed(isCollapsed, skipStorage = false) {
    sidebar.classList.toggle('collapsed', isCollapsed);
    mainContent.classList.toggle('sidebar-collapsed', isCollapsed);

    const icon = collapseBtn?.querySelector('i');
    if (icon) icon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';

    if (!skipStorage) {
      localStorage.setItem('hrms_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    }
  }

  function toggleCollapse() {
    setSidebarCollapsed(!sidebar.classList.contains('collapsed'));
  }

  if (collapseBtn) collapseBtn.addEventListener('click', toggleCollapse);

  /* ─────────────────────────────────────────────
   * MOBILE SIDEBAR
   * ───────────────────────────────────────────── */
  if (mobileToggle) {
    mobileToggle.addEventListener('click', e => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
  }

  document.addEventListener('click', e => {
    // Close mobile sidebar on outside click
    if (
      window.innerWidth <= 768 &&
      sidebar &&
      mobileToggle &&
      !sidebar.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) {
      sidebar.classList.remove('mobile-open');
    }

    // Close profile dropdown on outside click
    if (profileDropdown && profileBtn && !profileBtn.contains(e.target)) {
      profileDropdown.classList.remove('active');
    }
  });

  /* ─────────────────────────────────────────────
   * PROFILE DROPDOWN
   * ───────────────────────────────────────────── */
  if (profileBtn) {
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
  }

  // ── LOGOUT BUTTONS ────────────────────────────
  // auth.js rebinds ALL logout triggers after DOMContentLoaded.
  // Nothing to do here — do not add confirm() or handleLogout().

  /* ─────────────────────────────────────────────
   * DATE / TIME
   * ───────────────────────────────────────────── */
  function updateDateTime() {
    const el = document.getElementById('currentDateTime');
    if (!el) return;
    el.innerText = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    });
  }

  updateDateTime();
  setInterval(updateDateTime, 60000);

  /* ─────────────────────────────────────────────
   * CHARTS
   * ───────────────────────────────────────────── */
  const attendanceCtxEl = document.getElementById('attendanceChart');
  if (attendanceCtxEl) {
    new Chart(attendanceCtxEl.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Hours Worked',
          data: [8, 7.5, 8.5, 8, 7.5, 4],
          borderColor: '#1F6F7F',
          backgroundColor: 'rgba(31,111,127,0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
      },
    });
  }

  const taskCtxEl = document.getElementById('taskChart');
  if (taskCtxEl) {
    new Chart(taskCtxEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Tasks Completed',
          data: [5, 7, 6, 8, 6, 2],
          backgroundColor: '#6FAF2E',
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
      },
    });
  }

  /* ─────────────────────────────────────────────
   * SIDEBAR RESTORE on load
   * ───────────────────────────────────────────── */
  if (window.innerWidth > 768) {
    const saved = localStorage.getItem('hrms_sidebar_collapsed') === 'true';
    setSidebarCollapsed(saved, true);
  }

  /* ─────────────────────────────────────────────
   * RESIZE HANDLER
   * ───────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    if (isProgrammaticResize) return;
    isProgrammaticResize = true;

    if (window.innerWidth <= 768) {
      sidebar.classList.remove('collapsed', 'mobile-open');
      mainContent.classList.remove('sidebar-collapsed');
    } else {
      const stored = localStorage.getItem('hrms_sidebar_collapsed') === 'true';
      setSidebarCollapsed(stored, true);
    }

    setTimeout(() => { isProgrammaticResize = false; }, 100);
  });

})();

