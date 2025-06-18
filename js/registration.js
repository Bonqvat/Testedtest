function initRegistrationPage() {
    // Инициализация состояния приложения
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
        localStorage.setItem('futureAutoState', JSON.stringify({
            user: null,
            cart: [],
            favorites: []
        }));
    }

    // Обработчики событий
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleFormSubmit);
    }

    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoChange);
    }

    const successButton = document.querySelector('#successMessage button');
    if (successButton) {
        successButton.addEventListener('click', hideSuccessMessage);
    }

    // Функции валидации и обработки
    function handleFormSubmit(e) {
        e.preventDefault();
        let isValid = true;

        // Валидация email
        const emailInput = document.getElementById('register_email');
        const email = emailInput.value.trim().toLowerCase();
        if (!email.includes('@')) {
            showError('emailError', 'Email должен содержать символ "@"');
            emailInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('emailError');
            emailInput.classList.remove('input-error');
        }

        // Валидация пароля
        const passwordInput = document.getElementById('register_password');
        const password = passwordInput.value;
        if (password.length < 6) {
            showError('passwordError', 'Пароль должен быть минимум 6 символов');
            passwordInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('passwordError');
            passwordInput.classList.remove('input-error');
        }

        // Валидация ФИО
        const fioInput = document.getElementById('register_fio');
        const fio = fioInput.value.trim();
        if (fio.length < 3) {
            showError('fioError', 'Введите ваше ФИО');
            fioInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('fioError');
            fioInput.classList.remove('input-error');
        }

        // Валидация адреса
        const addressInput = document.getElementById('register_address');
        if (addressInput.value.trim().length < 5) {
            showError('addressError', 'Введите адрес');
            addressInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('addressError');
            addressInput.classList.remove('input-error');
        }

        // Валидация телефона
        const phoneInput = document.getElementById('register_phone');
        const phone = phoneInput.value.trim();
        if (phone.length < 6) {
            showError('phoneError', 'Введите номер телефона');
            phoneInput.classList.add('input-error');
            isValid = false;
        } else {
            hideError('phoneError');
            phoneInput.classList.remove('input-error');
        }

        // Проверка согласия
        const consentInput = document.getElementById('consent');
        if (!consentInput.checked) {
            showError('consentError', 'Подтвердите согласие');
            isValid = false;
        } else {
            hideError('consentError');
        }

        // Сохранение данных
        if (isValid) {
            const userData = {
                email,
                fio,
                address: addressInput.value,
                phone,
                newsletter: document.getElementById('newsletter').checked
            };

            const appState = JSON.parse(localStorage.getItem('futureAutoState')) || {};
            appState.user = userData;
            localStorage.setItem('futureAutoState', JSON.stringify(appState));
            
            showSuccessMessage();
        }
    }

    function handlePhotoChange(e) {
        const fileNameElement = document.getElementById('fileName');
        if (this.files.length > 0) {
            fileNameElement.textContent = this.files[0].name;
            fileNameElement.style.display = 'block';
            
            if (this.files[0].size > 5 * 1024 * 1024) {
                fileNameElement.textContent = 'Файл слишком большой (макс. 5MB)';
                fileNameElement.style.color = '#dc3545';
                this.value = '';
            } else {
                fileNameElement.style.color = '#6c757d';
            }
        } else {
            fileNameElement.style.display = 'none';
        }
    }

    function showError(id, message) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function hideError(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    function showSuccessMessage() {
        const overlay = document.getElementById('overlay');
        const successMessage = document.getElementById('successMessage');
        if (overlay && successMessage) {
            overlay.style.display = 'block';
            successMessage.style.display = 'block';
        }
    }

    function hideSuccessMessage() {
        const overlay = document.getElementById('overlay');
        const successMessage = document.getElementById('successMessage');
        if (overlay && successMessage) {
            overlay.style.display = 'none';
            successMessage.style.display = 'none';
            window.location.href = '#index';
        }
    }
}

window.initRegistrationPage = initRegistrationPage;