document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointmentForm');

    // Setup Gender Checkbox Mutual Exclusion
    // Ensures only one checkbox with class 'gender-chk' can be checked at a time
    const genderCheckboxes = document.querySelectorAll('.gender-chk');
    genderCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                genderCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            saveDataAndRedirect();
        }
    });

    function validateForm() {
        let isValid = true;

        // Reset previous validation states
        clearValidationErrors();

        // 1. Phone Number Validation
        // Should be 10 digits starting with 6-9
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.trim();
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput);
            isValid = false;
        } else {
            showSuccess(phoneInput);
        }

        // 2. Password Validation
        // One letter capital, one special symbol, 8 chars
        const passwordInput = document.getElementById('password');
        const passwordValue = passwordInput.value;
        // Regex explanation:
        // (?=.*[A-Z]): At least one uppercase letter
        // (?=.*[^a-zA-Z0-9]): At least one special char (anything not letter or number)
        // .{8,}: At least 8 characters long
        const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

        if (!passwordRegex.test(passwordValue)) {
            showError(passwordInput);
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        // 3. Gender Validation
        const genderRadios = document.querySelectorAll('input[name="gender"]');
        let isGenderSelected = false;
        let selectedGender = '';
        genderRadios.forEach(radio => {
            if (radio.checked) {
                isGenderSelected = true;
                selectedGender = radio.value;
            }
        });

        // Visual feedback for radio buttons is handled by browser usually, 
        // but we can add custom if needed. Browser 'required' attribute helps a lot here.
        if (!isGenderSelected) {
            isValid = false;
            // We could add a class to the container to show error if we wanted custom style
        }

        // 4. Multi Checkbox Validation (Preferred Days)
        const dayCheckboxes = document.querySelectorAll('input[name="days"]');
        let isDaySelected = false;
        const selectedDays = [];

        dayCheckboxes.forEach(cb => {
            if (cb.checked) {
                isDaySelected = true;
                selectedDays.push(cb.value);
            }
        });

        const daysContainer = dayCheckboxes[0].closest('.bg-light');
        const daysError = document.getElementById('daysError');

        if (!isDaySelected) {
            daysContainer.classList.add('border', 'border-danger');
            daysError.style.display = 'block';
            isValid = false;
        } else {
            daysContainer.classList.remove('border', 'border-danger');
            daysError.style.display = 'none';
        }

        // 4. Single Checkbox Validation (Terms)
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            termsCheckbox.classList.add('is-invalid');
            isValid = false;
        } else {
            termsCheckbox.classList.remove('is-invalid');
            termsCheckbox.classList.add('is-valid');
        }

        // 5. Other Required Fields (Standard HTML5 validation check, but visually updating)
        const nameInput = document.getElementById('name');
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameValue || !nameRegex.test(nameValue)) { showError(nameInput); isValid = false; } else { showSuccess(nameInput); }

        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim() || !emailInput.checkValidity()) { showError(emailInput); isValid = false; } else { showSuccess(emailInput); }

        const subjectInput = document.getElementById('subject');
        if (!subjectInput.value) { showError(subjectInput); isValid = false; } else { showSuccess(subjectInput); }

        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) { showError(messageInput); isValid = false; } else { showSuccess(messageInput); }

        return isValid;
    }

    function showError(input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    function showSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    function clearValidationErrors() {
        const inputs = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
        });

        // Reset custom containers if any
        const customContainers = form.querySelectorAll('.border-danger');
        customContainers.forEach(el => el.classList.remove('border', 'border-danger'));

        const customErrors = form.querySelectorAll('.invalid-feedback');
        customErrors.forEach(el => {
            if (el.id === 'daysError') el.style.display = 'none';
        });
    }

    function saveDataAndRedirect() {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            gender: document.querySelector('.gender-chk:checked').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            preferredDays: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value),
            submittedAt: new Date().toLocaleString()
        };

        // Store in localStorage
        localStorage.setItem('appointmentData', JSON.stringify(formData));

        // Redirect to card page
        window.location.href = 'appointment-card.html';
    }
});
