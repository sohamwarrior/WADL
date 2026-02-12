// appointment.js
(function () {
  const form = document.getElementById('appointmentForm');
  const statusDiv = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');

  function showMessage(msg, type = 'info') {
    statusDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${msg}</div>`;
  }

  function validate(fd) {
    if (!fd.get('name') || !fd.get('email') || !fd.get('phone')) return false;
    return true;
  }

  function saveToLocal(obj) {
    try {
      const key = 'appointments';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push(obj);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) { console.warn('localStorage error', e); }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    submitBtn.disabled = true;
    showMessage('Submitting... Please wait.', 'info');

    const fd = new FormData(form);

    if (!validate(fd)) {
      showMessage('Please fill Name, Email and Phone.', 'warning');
      submitBtn.disabled = false;
      return;
    }

    // build object
    const obj = {};
    fd.forEach((v,k) => {
      if (k === 'days') {
        if (!obj.preferredDays) obj.preferredDays = [];
        obj.preferredDays.push(v);
      } else obj[k] = v;
    });
    obj.submittedAt = new Date().toISOString();

    // POST to backend
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_appointment.php', true);

    xhr.onload = function () {
      submitBtn.disabled = false;
      if (xhr.status >=200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success) {
            saveToLocal(obj);
            showMessage('Appointment saved. Redirecting to list...', 'success');
            setTimeout(() => { window.location.href = 'appointments.html'; }, 800);
            return;
          } else {
            showMessage('Server error: ' + (res.message||'Unknown'), 'danger');
          }
        } catch (e) {
          showMessage('Invalid server response.', 'danger');
        }
      } else {
        showMessage('Request failed with status ' + xhr.status, 'danger');
      }
    };

    xhr.onerror = function () {
      submitBtn.disabled = false;
      saveToLocal(obj);
      showMessage('Network error: saved locally. Redirecting to appointments list.', 'warning');
      setTimeout(() => { window.location.href = 'appointments.html'; }, 800);
    };

    xhr.send(fd);
  });
})();