function initSupportPage() {
    // Функция обновления счетчиков
    function updateHeaderCounters() {
        const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
        const cartIcon = document.getElementById('cart-icon');
        const favIcon = document.getElementById('favorites-icon');
        
        if (cartIcon) cartIcon.setAttribute('data-count', state.cart.length || '');
        if (favIcon) favIcon.setAttribute('data-count', state.favorites.length || '');
    }
    
    // Функция показа уведомлений
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Проверка мобильного устройства
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Основная инициализация
    updateHeaderCounters();
    
    // Телефонная поддержка
    document.getElementById('phoneSupport')?.addEventListener('click', function(e) {
        if (!isMobile()) {
            e.preventDefault();
            showNotification('Позвоните нам: +7 (800) 123-45-67');
        }
    });

    // Поддержка по email
    document.getElementById('emailSupport')?.addEventListener('click', function(e) {
        if (!isMobile()) {
            e.preventDefault();
            showNotification('Напишите нам: support@futureauto.com');
        }
    });

    // Обработчик открытия чата
    document.getElementById('openChat')?.addEventListener('click', function(e) {
        e.preventDefault();
        createChatWidget();
    });
    
    // Обработка формы обратной связи
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('support-name').value,
                phone: document.getElementById('support-phone').value,
                email: document.getElementById('support-email').value,
                subject: document.getElementById('support-subject').value,
                message: document.getElementById('support-message').value
            };

            try {
                const response = await fetch('ajax.php?action=addFeedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Ваш запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.');
                    this.reset();
                } else {
                    showNotification(result.error || 'Ошибка при отправке запроса', 'error');
                }
            } catch (error) {
                showNotification('Ошибка сети: ' + error.message, 'error');
            }
        });
    }
    
    // Работа с FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions[0].classList.add('active');
        faqQuestions[0].nextElementSibling?.classList.add('show');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                
                // Закрываем все
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling?.classList.remove('show');
                });
                
                // Открываем текущий если был закрыт
                if (!isActive) {
                    question.classList.add('active');
                    question.nextElementSibling?.classList.add('show');
                }
            });
        });
    }
}

// Создание виджета чата (переработанная версия)
function createChatWidget() {
    // Проверяем, не создан ли уже виджет
    if (document.getElementById('chat-widget')) return;
    
    // Создаем виджет
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-header">
            <h3>Поддержка FutureAuto</h3>
            <button id="close-chat"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-messages">
            <div class="message bot">
                <div class="avatar"><i class="fas fa-robot"></i></div>
                <div class="content">
                    Здравствуйте! Чем мы можем вам помочь?<br><br>
                    Вы можете спросить о:
                    <div class="quick-topics">
                        <div class="topic-btn" data-topic="delivery">Доставке</div>
                        <div class="topic-btn" data-topic="payment">Оплате</div>
                        <div class="topic-btn" data-topic="warranty">Гарантии</div>
                        <div class="topic-btn" data-topic="return">Возврате</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input type="text" id="chat-input" placeholder="Введите сообщение...">
            <button id="send-message"><i class="fas fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(chatWidget);
    
    // Обработчики событий
    document.getElementById('close-chat').addEventListener('click', () => {
        chatWidget.style.transform = 'translateY(20px)';
        chatWidget.style.opacity = '0';
        setTimeout(() => chatWidget.remove(), 300);
    });
    
    // Обработчики быстрых тем
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            const topics = {
                delivery: 'Расскажите о сроках и условиях доставки',
                payment: 'Какие способы оплаты вы принимаете?',
                warranty: 'Какая гарантия на автомобили?',
                return: 'Как оформить возврат?'
            };
            document.getElementById('chat-input').value = topics[topic];
        });
    });
    
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Ответы на частые вопросы
    const responses = {
        'доставк': 'Доставка осуществляется в течение 3-5 рабочих дней по всей России. Стоимость доставки рассчитывается при оформлении заказа.',
        'оплат': 'Мы принимаем карты Visa, Mastercard, МИР. Также доступна оплата наличными при получении.',
        'гаранти': 'На все товары предоставляется гарантия 1 год. Гарантийный ремонт осуществляется в сертифицированных центрах.',
        'возврат': 'Вы можете вернуть товар в течение 14 дней после получения. Товар должен быть в оригинальной упаковке без следов использования.',
        'контакт': 'Наши контакты: +7 (800) 123-45-67, support@futureauto.com',
        'спасиб': 'Спасибо за обращение! Если у вас есть еще вопросы, мы с радостью ответим.',
        'привет': 'Здравствуйте! Чем мы можем вам помочь?'
    };
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Сообщение пользователя
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `
            <div class="avatar"><i class="fas fa-user"></i></div>
            <div class="content">${message}</div>
        `;
        chatMessages.appendChild(userMessage);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Имитация набора текста
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot typing';
        typingIndicator.innerHTML = `
            <div class="avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Поиск ответа
        let responseText = 'Спасибо за ваше сообщение! Наш оператор свяжется с вами в течение 5 минут.';
        const lowerMessage = message.toLowerCase();
        
        for (const [key, value] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                responseText = value;
                break;
            }
        }
        
        // Задержка перед ответом
        setTimeout(() => {
            typingIndicator.remove();
            
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `
                <div class="avatar"><i class="fas fa-robot"></i></div>
                <div class="content">${responseText}</div>
            `;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Фокусировка на поле ввода
    setTimeout(() => chatInput.focus(), 100);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

window.initSupportPage = initSupportPage;