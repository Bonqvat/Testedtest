function initServicesPage() {
    // Функция обновления счетчиков в хедере
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
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Основная инициализация страницы
    updateHeaderCounters();
    
    // Обработка кликов по кнопкам "Подробнее"
    const serviceButtons = document.querySelectorAll('.service-btn');
    if (serviceButtons.length > 0) {
        serviceButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceContent = this.closest('.service-content');
                if (serviceContent) {
                    const serviceName = serviceContent.querySelector('h2').textContent;
                    showNotification(`Вы выбрали услугу "${serviceName}". Наш менеджер скоро свяжется с вами!`);
                }
            });
        });
    }
    
    // Обработка клика по баннеру
    const bannerButton = document.querySelector('.banner-btn');
    if (bannerButton) {
        bannerButton.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Специалист по акциям свяжется с вами для уточнения деталей предложения.');
        });
    }
}

window.initServicesPage = initServicesPage;