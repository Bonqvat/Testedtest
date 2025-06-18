function initUserPage() {
    // Инициализация состояния приложения
    let state = JSON.parse(localStorage.getItem('futureAutoState'));
    if (!state) {
        state = {
            user: null,
            cart: [],
            favorites: []
        };
        localStorage.setItem('futureAutoState', JSON.stringify(state));
    }

    let currentEditType = '';

    // Проверка авторизации пользователя
    if (!state.user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = '#index';
        return;
    }

    // Загрузка данных пользователя
    function loadUserData() {
        fetch(`script.php?action=getUserData&userId=${state.user.id}`)
            .then(response => response.json())
            .then(userData => {
                // Заполнение профиля
                document.getElementById('userName').textContent = userData.name;
                document.getElementById('userEmail').textContent = userData.email;
                document.getElementById('userPhone').textContent = userData.phone || 'Не указан';
                document.getElementById('userAddress').textContent = userData.address || 'Не указан';
                
                // Заполнение модальных форм
                document.getElementById('editName').value = userData.name;
                document.getElementById('editPhone').value = userData.phone;
                document.getElementById('editAddress').value = userData.address || '';
                document.getElementById('editNotifications').checked = userData.notifications || false;
                
                // Обновление состояния
                state.user = {...state.user, ...userData};
                localStorage.setItem('futureAutoState', JSON.stringify(state));
            })
            .catch(error => {
                console.error('Error loading user data:', error);
                showNotification('Ошибка загрузки данных', 'error');
            });
    }

    // Функции работы с модальными окнами
    function openEditModal(type) {
        currentEditType = type;
        const modal = document.getElementById('editModal');
        const title = document.getElementById('modalTitle');
        
        // Скрыть все поля формы
        document.getElementById('personalFields').style.display = 'none';
        document.getElementById('addressFields').style.display = 'none';
        document.getElementById('securityFields').style.display = 'none';
        document.getElementById('notificationsFields').style.display = 'none';
        
        // Показать нужные поля и установить заголовок
        switch(type) {
            case 'personal':
                title.textContent = 'Редактирование личных данных';
                document.getElementById('personalFields').style.display = 'block';
                break;
            case 'address':
                title.textContent = 'Редактирование адреса';
                document.getElementById('addressFields').style.display = 'block';
                break;
            case 'security':
                title.textContent = 'Изменение пароля';
                document.getElementById('securityFields').style.display = 'block';
                // Очистка полей пароля при открытии
                document.getElementById('editCurrentPassword').value = '';
                document.getElementById('editNewPassword').value = '';
                document.getElementById('editConfirmPassword').value = '';
                break;
            case 'notifications':
                title.textContent = 'Настройки уведомлений';
                document.getElementById('notificationsFields').style.display = 'block';
                break;
        }
        
        modal.style.display = 'block';
    }
    
    function saveChanges() {
        const formData = {
            userId: state.user.id,
            type: currentEditType
        };

        switch(currentEditType) {
            case 'personal':
                formData.name = document.getElementById('editName').value;
                formData.phone = document.getElementById('editPhone').value;
                break;
            case 'address':
                formData.address = document.getElementById('editAddress').value;
                break;
            case 'security':
                formData.password = document.getElementById('editNewPassword').value;
                // Добавьте здесь проверку совпадения паролей при необходимости
                break;
            case 'notifications':
                formData.notifications = document.getElementById('editNotifications').checked;
                break;
        }

        fetch('script.php?action=updateUserData', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Изменения успешно сохранены');
                document.getElementById('editModal').style.display = 'none';
                // Обновляем данные после сохранения
                loadUserData();
            } else {
                showNotification(data.error || 'Ошибка сохранения', 'error');
            }
        })
        .catch(error => {
            console.error('Save error:', error);
            showNotification('Ошибка сети', 'error');
        });
    }

    // Функции работы с заказами
    function viewOrderDetails(orderId) {
        alert('Открытие деталей заказа #' + orderId);
    }
    
    function repeatOrder(orderId) {
        showNotification('Заказ #' + orderId + ' добавлен в корзину');
    }
    
    function cancelOrder(orderId) {
        if (confirm('Вы уверены, что хотите отменить заказ #' + orderId + '?')) {
            showNotification('Заказ #' + orderId + ' отменен');
        }
    }
    
    function subscribe() {
        const email = document.getElementById('subscribeEmail').value;
        if (email && email.includes('@')) {
            showNotification('Спасибо за подписку!');
            document.getElementById('subscribeEmail').value = '';
        } else {
            showNotification('Пожалуйста, введите корректный email', 'error');
        }
    }

    // Вспомогательные функции
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.background = type === 'success' ? '#4c6ef5' : '#dc3545';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Обработчики событий
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            document.getElementById('editModal').style.display = 'none';
        }
    };

    // Загрузка данных пользователя при инициализации
    loadUserData();

    // Экспорт функций в глобальную область видимости
    window.openEditModal = openEditModal;
    window.saveChanges = saveChanges;
    window.viewOrderDetails = viewOrderDetails;
    window.repeatOrder = repeatOrder;
    window.cancelOrder = cancelOrder;
}

window.initUserPage = initUserPage;