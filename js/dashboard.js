/**
 * dashboard.js  — API integration
 *
 * Endpoint: GET /api/employees/dashboard/{employeePrimeId}
 *
 * Assumes hrms_employee_prime_id is stored in localStorage after login.
 */

const BASE_EMP_URL = 'http://localhost:8086';

async function initDashboardCharts() {
  const employeePrimeId = localStorage.getItem('hrms_employee_prime_id');

  let data = null;

  if (employeePrimeId) {
    try {
      const res = await fetch(`${BASE_EMP_URL}/api/employees/dashboard/${employeePrimeId}`);
      if (res.ok) {
        data = await res.json();
      } else {
        console.warn('Dashboard API returned', res.status);
      }
    } catch (err) {
      console.warn('Dashboard API unreachable', err);
    }
  }

  if (!data) return; // nothing to render if API failed and no fallback needed

  // ── Stat cards ────────────────────────────────────────────────────────────

  const todayStatusEl = document.querySelector('.stat-card.blue .stat-value');
  if (todayStatusEl) todayStatusEl.textContent = data.todayStatus ?? 'Not Marked';

  const workingHoursEl = document.querySelector('.stat-card.green .stat-value');
  if (workingHoursEl) workingHoursEl.textContent = `${data.todayHours ?? 0} hrs`;

  // leaveRemaining  → the big number shown as "X Days"
  // leaveUsed       → the "Used: X" subtext
  // leaveAllotted   → total (optional tooltip/title if you want to show it)
  const leaveBalanceEl = document.querySelector('.stat-card.orange .stat-value');
  if (leaveBalanceEl) leaveBalanceEl.textContent = `${data.leaveRemaining ?? 0} Days`;

  const leaveUsedEl = document.querySelector('.stat-card.orange .stat-text');
  if (leaveUsedEl) leaveUsedEl.textContent = `Used: ${data.leaveUsed ?? 0}`;

  // ── Weekly line chart ─────────────────────────────────────────────────────
  const attendanceCtxEl = document.getElementById('attendanceChart');
  if (attendanceCtxEl) {
    new Chart(attendanceCtxEl.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.weeklyLabels,
        datasets: [{
          label: 'Hours Worked',
          data: data.weeklyHours,
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
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 10,
            ticks: { stepSize: 2 },
          },
        },
      },
    });
  }

  // ── Monthly bar chart ─────────────────────────────────────────────────────
  const taskCtxEl = document.getElementById('taskChart');
  if (taskCtxEl) {
    new Chart(taskCtxEl.getContext('2d'), {
      type: 'bar',
      data: {
        labels: data.monthlyLabels,
        datasets: [{
          label: 'Hours Worked',
          data: data.monthlyHours,
          backgroundColor: '#6FAF2E',
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 10,
            ticks: { stepSize: 2 },
          },
        },
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', initDashboardCharts);