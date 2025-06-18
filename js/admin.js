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
    
    // Инициализация при загрузке страницы
    updateHeaderCounters();
    // Загрузка начальных данных автомобилей
    loadCars().then(renderCarList);
}

window.initAdminPage = initAdminPage;