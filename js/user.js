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
                break;
            case 'notifications':
                title.textContent = 'Настройки уведомлений';
                document.getElementById('notificationsFields').style.display = 'block';
                break;
        }
        
        modal.style.display = 'block';
    }
    
    function saveChanges() {
        showNotification('Изменения успешно сохранены');
        // Прямая замена вызова closeModal
        document.getElementById('editModal').style.display = 'none';
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

    // Проверка авторизации пользователя
    const state = JSON.parse(localStorage.getItem('futureAutoState'));
    if (!state || !state.user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = '#index';
        return;
    }

    // Обработчики событий
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            // Прямая замена вызова closeModal
            document.getElementById('editModal').style.display = 'none';
        }
    };

    // Экспорт функций в глобальную область видимости
    window.openEditModal = openEditModal;
    window.saveChanges = saveChanges;
    window.viewOrderDetails = viewOrderDetails;
    window.repeatOrder = repeatOrder;
    window.cancelOrder = cancelOrder;
}

window.initUserPage = initUserPage;