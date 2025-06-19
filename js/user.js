function initUserPage() {
    // Инициализация состояния приложения
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
        localStorage.setItem('futureAutoState', JSON.stringify({
            user: null,
            cart: [],
            favorites: []
        }));
    }

    let currentEditType = '';

    // Загружаем данные пользователя с сервера
    loadUserData();

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
                // Предзаполняем поля текущими значениями
                document.getElementById('editName').value = document.getElementById('userFullName').textContent;
                document.getElementById('editPhone').value = document.getElementById('userPhone').textContent;
                break;
            case 'address':
                title.textContent = 'Редактирование адреса';
                document.getElementById('addressFields').style.display = 'block';
                document.getElementById('editAddress').value = document.getElementById('userAddress').textContent;
                break;
            case 'security':
                title.textContent = 'Изменение пароля';
                document.getElementById('securityFields').style.display = 'block';
                // Очищаем поля паролей
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                break;
            case 'notifications':
                title.textContent = 'Настройки уведомлений';
                document.getElementById('notificationsFields').style.display = 'block';
                break;
        }
        
        modal.style.display = 'block';
    }
    
    function closeModal() {
        document.getElementById('editModal').style.display = 'none';
    }
    
    function saveChanges() {
        const formData = {};
        switch(currentEditType) {
            case 'personal':
                formData.type = 'personal';
                formData.name = document.getElementById('editName').value;
                formData.phone = document.getElementById('editPhone').value;
                break;
            case 'address':
                formData.type = 'address';
                formData.address = document.getElementById('editAddress').value;
                break;
            case 'security':
                formData.type = 'security';
                formData.currentPassword = document.getElementById('currentPassword').value;
                formData.newPassword = document.getElementById('newPassword').value;
                formData.confirmPassword = document.getElementById('confirmPassword').value;
                break;
            case 'notifications':
                // Локальная обработка без сервера
                showNotification('Настройки уведомлений сохранены');
                document.getElementById('editModal').style.display = 'none';
                return;
        }

        fetch('script.php?action=updateUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                showNotification('Изменения успешно сохранены');
                document.getElementById('editModal').style.display = 'none';
                loadUserData(); // Обновляем данные
            }
        })
        .catch(error => {
            showNotification('Ошибка сети: ' + error.message, 'error');
        });
    }

    // Функция загрузки данных пользователя
    function loadUserData() {
        fetch('script.php?action=getUserData')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showNotification(data.error, 'error');
                    // Если ошибка авторизации - перенаправляем на главную
                    if (data.error.includes('Not authorized')) {
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    }
                    return;
                }
                updateUserUI(data);
            })
            .catch(error => {
                showNotification('Ошибка загрузки данных: ' + error.message, 'error');
            });
    }

    // Обновление UI данными пользователя
    function updateUserUI(user) {
        document.getElementById('userName').textContent = user.name || user.email;
        document.getElementById('userFullName').textContent = user.name || 'Не указано';
        document.getElementById('userEmail').textContent = user.email || 'Не указан';
        document.getElementById('userPhone').textContent = user.phone || 'Не указан';
        document.getElementById('userAddress').textContent = user.address || 'Не указан';
        
        // Форматируем дату последнего входа
        if (user.last_login) {
            const lastLogin = new Date(user.last_login);
            document.getElementById('userLastLogin').textContent = 
                lastLogin.toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
        } else {
            document.getElementById('userLastLogin').textContent = 'Никогда';
        }
        
        // Сохраняем данные в state
        const state = JSON.parse(localStorage.getItem('futureAutoState'));
        if (state) {
            state.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                last_login: user.last_login
            };
            localStorage.setItem('futureAutoState', JSON.stringify(state));
        }
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
    
    function logout() {
        localStorage.removeItem('futureAutoState');
        window.location.href = 'index.html';
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

    // Проверка авторизации пользователя
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    if (!state || !state.user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'index.html';
        return;
    }

    // Обработчики событий
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            document.getElementById('editModal').style.display = 'none';
        }
    };

    // Экспорт функций в глобальную область видимости
    window.openEditModal = openEditModal;
    window.closeModal = closeModal;
    window.saveChanges = saveChanges;
    window.viewOrderDetails = viewOrderDetails;
    window.repeatOrder = repeatOrder;
    window.cancelOrder = cancelOrder;
    window.logout = logout;
}
