document.addEventListener('DOMContentLoaded', function() {
  // Загрузка хедера
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);
      // Инициализация обработчиков после загрузки
      initHeaderFunctionality();
      updateHeaderCounters();
    });

  // Загрузка футера
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      // Инициализация обработчиков после загрузки
      initFooterFunctionality();
    });
});

function initHeaderFunctionality() {
  // Инициализация модального окна
  document.getElementById('loginModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal('loginModal');
    }
  });
}

function initFooterFunctionality() {
  // Инициализация подписки
  document.querySelector('.footer-subscribe button')?.addEventListener('click', subscribe);
}

// Функция для обновления счетчиков в хедере
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

// Функция подписки (для футера)
function subscribe() {
  const email = document.getElementById('footerEmail').value;
  if (email && email.includes('@')) {
    showNotification('Спасибо за подписку! На ваш email будут приходить новости и акции.');
    document.getElementById('footerEmail').value = '';
  } else {
    showNotification('Пожалуйста, введите корректный email адрес');
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