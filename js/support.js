function initSupportPage() {
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
    
    // Обработка формы обратной связи
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Ваш запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
    
    // Открытие чата поддержки
    const openChatBtn = document.getElementById('openChat');
    if (openChatBtn) {
        openChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Чат поддержки будет доступен в ближайшее время. Пожалуйста, воспользуйтесь другими способами связи.');
        });
    }
    
    // Работа с FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');
                
                // Закрываем все ответы
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    if (q.nextElementSibling) {
                        q.nextElementSibling.classList.remove('show');
                    }
                });
                
                // Открываем текущий, если он был закрыт
                if (!isActive && answer) {
                    question.classList.add('active');
                    answer.classList.add('show');
                }
            });
        });
        
        // Открываем первый вопрос FAQ по умолчанию
        faqQuestions[0].classList.add('active');
        if (faqQuestions[0].nextElementSibling) {
            faqQuestions[0].nextElementSibling.classList.add('show');
        }
    }
}

window.initSupportPage = initSupportPage;