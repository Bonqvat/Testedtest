// footer.js - динамическая загрузка футера
function loadFooter() {
  const footer = document.createElement('footer');
  
  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-left">
        <div class="footer-about">
          <h2>О компании</h2>
          <p>Наша компания предлагает широкий ассортимент автомобилей различных марок и моделей.</p>
        </div>
        <div class="footer-grid">
          <div>
            <h4>Категории</h4>
            <ul>
              <li><a href="#catalog">Автомобили</a></li>
              <li><a href="#catalog">Тип кузова</a></li>
              <li><a href="#services">Запчасти</a></li>
              <li><a href="#support">Акции</a></li>
            </ul>
          </div>
          <div>
            <h4>Компания</h4>
            <ul>
              <li><a href="#about">О нас</a></li>
              <li><a href="#services">Услуги</a></li>
              <li><a href="#contacts">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4>Поддержка</h4>
            <ul>
              <li><a href="#support">Часто задаваемые вопросы</a></li>
              <li><a href="#support">Обратная связь</a></li>
            </ul>
          </div>
          <div>
            <h4>Дополнительно</h4>
            <ul>
              <li><a href="#termsprivacy">Условия использования</a></li>
              <li><a href="#termsprivacy">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-right-content">
          <h2>Подписка</h2>
          <div class="footer-subscribe">
            <input type="email" id="footerEmail" placeholder="Ваш email">
            <button onclick="subscribe()">Подписаться</button>
          </div>
          <div class="footer-social-container">
            <h4>Социальные сети</h4>
            <div class="footer-social">
              <a href="#about" title="Gmail"><i class="fas fa-envelope"></i></a>
              <a href="#about" title="ВКонтакте"><i class="fab fa-vk"></i></a>
              <a href="#about" title="Telegram"><i class="fab fa-telegram"></i></a>
            </div>
          </div>
          <div class="footer-contacts">
            <h4>Контакты</h4>
            <p><i class="fas fa-phone"></i> +7 (8422) 56-34-89</p>
            <p><i class="fas fa-envelope"></i> info@futureauto.com</p>
            <h4>Адрес</h4>
            <p><i class="fas fa-map-marker-alt"></i> г. Ульяновск</p>
            <p>ул. Автомобильная, 42</p>
            <p>Пн-Пт: 9:00-18:00</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} FutureAuto. Все права защищены.</p>
    </div>
  `;
  
  document.body.appendChild(footer);
  
  // Загружаем стили для футера
  loadFooterStyles();
}

function loadFooterStyles() {
  // Проверяем, не добавлены ли стили уже
  if (!document.getElementById('footer-styles')) {
    const link = document.createElement('link');
    link.id = 'footer-styles';
    link.rel = 'stylesheet';
    link.href = 'css/footer.css';
    document.head.appendChild(link);
  }
}

// Функция подписки (для футера)
window.subscribe = function() {
  const emailInput = document.getElementById('footerEmail');
  const email = emailInput.value.trim();
  
  if (email && validateEmail(email)) {
    // Сохраняем email в localStorage
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [];
    if (!subscriptions.includes(email)) {
      subscriptions.push(email);
      localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
    }
    
    showNotification('Спасибо за подписку! На ваш email будут приходить новости и акции.');
    emailInput.value = '';
  } else {
    showNotification('Пожалуйста, введите корректный email адрес');
  }
};

// Вспомогательная функция для валидации email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
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
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Загружаем футер при загрузке страницы
document.addEventListener('DOMContentLoaded', loadFooter);