function initAboutPage() {
  // Обновление счетчиков в хедере
  function updateHeaderCounters() {
    const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
    const cartIcon = document.getElementById('cart-icon');
    const favIcon = document.getElementById('favorites-icon');
    
    if (state.cart.length > 0) {
      cartIcon.setAttribute('data-count', state.cart.length);
    } else {
      cartIcon.removeAttribute('data-count');
    }
    
    if (state.favorites.length > 0) {
      favIcon.setAttribute('data-count', state.favorites.length);
    } else {
      favIcon.removeAttribute('data-count');
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
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Инициализация страницы
  updateHeaderCounters();
  
  // Обработка кликов по соцсетям команды
  document.querySelectorAll('.team-social a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const memberName = this.closest('.team-info').querySelector('h3').textContent;
      showNotification(`Вы выбрали контакт ${memberName}. Социальная сеть откроется в новом окне.`);
    });
  });
}

window.initAboutPage = initAboutPage;