class Router {
  constructor() {
    this.routes = {
      '/': 'index.html',
      '/catalog': 'catalog.html',
      '/car': 'car-page.html',
      '/favorites': 'favorites.html',
      '/user': 'user.html',
      '/login': 'login.html',
      '/order': 'order.html',
      '/about': 'about.html',
      '/services': 'services.html',
      '/contacts': 'contacts.html',
      '/support': 'support.html',
      '/registration': this.getRegistrationPage.bind(this),
      '/admin': 'admin.html'
    };
    
    this.init();
  }
  
  // Добавленный метод для получения контента страницы регистрации
  getRegistrationPage() {
    return `
      <section class="registration-page">
        <h2>Создать аккаунт</h2>
        <form id="registrationForm">
          <!-- Содержимое формы из registration.html -->
          <div class="form-group">
            <label for="name">Имя</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div class="form-group">
            <label for="confirm-password">Подтвердите пароль</label>
            <input type="password" id="confirm-password" name="confirm-password" required>
          </div>
          <button type="submit" class="btn">Зарегистрироваться</button>
        </form>
      </section>
    `;
  }
  
  init() {
    window.addEventListener('popstate', () => this.route());
    document.addEventListener('DOMContentLoaded', () => this.route());
    
    document.addEventListener('click', (e) => {
      // Обработка кнопок поиска
      if (e.target.closest('.car-type-btn') || 
          (e.target.closest('.btn') && e.target.closest('.search-box'))) {
        e.preventDefault();
        if (typeof window.performSearch === 'function') {
          window.performSearch();
        }
        return;
      }
      
      let target = e.target;
      
      // Если кликнули по иконке внутри ссылки
      if (target.tagName === 'I' && target.parentElement.tagName === 'A') {
        target = target.parentElement;
      }
      
      // Если кликнули по тексту внутри ссылки
      if (target.tagName === 'SPAN' && target.parentElement.tagName === 'A') {
        target = target.parentElement;
      }
      
      if (target.tagName === 'A' && target.getAttribute('href')) {
        const href = target.getAttribute('href');
        
        // Игнорируем внешние ссылки, якоря и JavaScript-действия
        if (href.startsWith('http') || 
            href.startsWith('mailto') || 
            href.startsWith('tel') || 
            href.startsWith('#') ||
            href.startsWith('javascript')) {
          return;
        }
        
        e.preventDefault();
        this.navigate(href);
      }
      
      // Обработка табов в избранном/корзине
      if (e.target.classList.contains('tab-btn')) {
        const tabId = e.target.getAttribute('data-tab');
        this.switchTab(tabId);
      }
    });
  }
  
  navigate(path) {
    window.history.pushState({}, '', path);
    this.route();
  }
  
  switchTab(tabId) {
    // Убираем активный класс у всех кнопок и контента
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Добавляем активный класс выбранному табу
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);
    
    if (tabButton) tabButton.classList.add('active');
    if (tabContent) tabContent.classList.add('active');
    
    // Обновляем URL без перезагрузки
    const newUrl = `${window.location.pathname}?tab=${tabId}`;
    window.history.pushState({}, '', newUrl);
    
    // Рендерим контент таба
    if (window.app) {
      if (tabId === 'favorites') {
        window.app.renderFavorites();
      } else if (tabId === 'cart') {
        window.app.renderCart();
      }
    }
  }
  
  async route() {
    const path = window.location.pathname;
    const routeHandler = this.routes[path] || '404.html';
    
    try {
      let html;
      
      if (typeof routeHandler === 'function') {
        // Если маршрут обрабатывается функцией
        html = routeHandler();
      } else {
        // Если маршрут ведет к HTML-файлу
        const response = await fetch(routeHandler);
        html = await response.text();
      }
      
      document.querySelector('main').innerHTML = html;
      
      // Инициализация страницы
      if (window.app && window.app.renderContent) {
        window.app.renderContent();
        
        // Проверяем параметр таба в URL
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && (tab === 'favorites' || tab === 'cart')) {
          this.switchTab(tab);
        }
      }
      
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Failed to load page:', err);
    }
  }
}

new Router();