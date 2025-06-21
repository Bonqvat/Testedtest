function initAdminPage() {
    // Обновление счетчиков в хедере
    function updateHeaderCounters() {
        const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
        const cartIcon = document.getElementById('cart-icon');
        const favIcon = document.getElementById('favorites-icon');
        
        if (cartIcon) {
            if (state.cart.length > 0) {
                cartIcon.setAttribute('data-count', state.cart.length);
            } else {
                cartIcon.removeAttribute('data-count');
            }
        }
        
        if (favIcon) {
            if (state.favorites.length > 0) {
                favIcon.setAttribute('data-count', state.favorites.length);
            } else {
                favIcon.removeAttribute('data-count');
            }
        }
    }
    
    // Функция показа уведомлений
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    // Переключение вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Предпросмотр изображения
    const carImageInput = document.getElementById('car-image');
    if (carImageInput) {
        carImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Обработка формы добавления автомобиля
    const carForm = document.getElementById('car-form');
    if (carForm) {
        carForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const brand = document.getElementById('car-brand').value;
            const model = document.getElementById('car-model').value;
            
            if (!brand || !model) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }
            
            showNotification('Автомобиль успешно добавлен в каталог', 'success');
            this.reset();
            
            const preview = document.getElementById('image-preview');
            if (preview) preview.style.display = 'none';
        });
    }
    
    // Кнопка обновления списка автомобилей
    document.getElementById('refreshCars').addEventListener('click', async () => {
        await loadCars();
        renderCarList();
    });

    // Загрузка автомобилей
    async function loadCars() {
        try {
            const response = await fetch('ajax.php?action=getCars');
            window.adminCars = await response.json();
        } catch (error) {
            console.error('Error loading cars:', error);
            showNotification('Ошибка загрузки данных', 'error');
        }
    }

    // Рендеринг списка автомобилей
    function renderCarList() {
        const tableBody = document.querySelector('#car-list tbody');
        tableBody.innerHTML = '';
        
        window.adminCars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.id}</td>
                <td>${car.brand}</td>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.price.toLocaleString()} ₽</td>
                <td>
                    <button class="action-btn edit" data-id="${car.id}">Edit</button>
                    <button class="action-btn delete" data-id="${car.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Добавляем обработчики для новых кнопок удаления
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const id = row.querySelector('td:first-child').textContent;
                
                if (confirm(`Вы уверены, что хотите удалить запись ${id}?`)) {
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        showNotification(`Запись ${id} удалена`, 'success');
                    }, 500);
                }
            });
        });
    }

    // ============== ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАЯВКАМИ ==============
    
    // Загрузка заявок с сервера
    async function loadFeedback() {
        try {
            const response = await fetch('ajax.php?action=getFeedback');
            window.adminFeedback = await response.json();
        } catch (error) {
            console.error('Error loading feedback:', error);
            showNotification('Ошибка загрузки заявок', 'error');
        }
    }

    // Отрисовка таблицы заявок
    function renderFeedback() {
        const tableBody = document.querySelector('#requests tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        window.adminFeedback.forEach(fb => {
            const date = new Date(fb.created_at);
            const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${fb.id}</td>
                <td>${fb.name}</td>
                <td>${fb.phone}</td>
                <td>${fb.subject}</td>
                <td>${dateStr}</td>
                <td><span class="status status-${fb.status}">${getStatusText(fb.status)}</span></td>
                <td>
                    <button class="action-btn edit" data-id="${fb.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" data-id="${fb.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Преобразование статуса в текст
    function getStatusText(status) {
        const statuses = {
            'new': 'Новая',
            'in_progress': 'В обработке',
            'resolved': 'Завершена'
        };
        return statuses[status] || status;
    }

    // Удаление заявки
    function deleteFeedback(id) {
        const row = document.querySelector(`#requests tr[data-id="${id}"]`);
        if (!row) return;
        
        if (confirm(`Удалить заявку #${id}?`)) {
            row.style.opacity = '0.5';
            setTimeout(() => {
                row.remove();
                showNotification(`Заявка #${id} удалена`, 'success');
            }, 500);
        }
    }

    // Редактирование статуса заявки
    function editFeedback(id) {
        const statusCell = document.querySelector(`#requests tr[data-id="${id}"] .status`);
        if (!statusCell) return;
        
        const statuses = ['new', 'in_progress', 'resolved'];
        const currentStatus = statusCell.className.replace('status status-', '');
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];
        
        statusCell.className = `status status-${newStatus}`;
        statusCell.textContent = getStatusText(newStatus);
        
        showNotification(`Статус заявки #${id} изменен`, 'success');
    }

    // Обработчики для таблицы заявок
    document.querySelector('#requests')?.addEventListener('click', function(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        
        const id = btn.dataset.id;
        
        if (btn.classList.contains('delete')) {
            deleteFeedback(id);
        } 
        else if (btn.classList.contains('edit')) {
            editFeedback(id);
        }
    });

    // ============== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==============
    
    updateHeaderCounters();
    
    // Загрузка начальных данных
    loadCars().then(renderCarList);
    loadFeedback().then(renderFeedback);
}

window.initAdminPage = initAdminPage;