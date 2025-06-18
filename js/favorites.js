import { cars } from '/data/data.js';

const state = {
  cart: [],
  favorites: []
};

function initFavoritesPage() {
  const savedState = localStorage.getItem('futureAutoState');
  if (savedState) {
    const stateObj = JSON.parse(savedState);
    if (!stateObj.user) {
      alert('Пожалуйста, войдите в систему');
      loadPage('index');
      return;
    }
    state.cart = stateObj.cart || [];
    state.favorites = stateObj.favorites || [];
  }
  renderCart(); 
  renderFavorites();
  updateHeaderCounters();
}

// Восстановленная функция отображения корзины
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartItemsContainer || !cartSummary) return;
  
  if (state.cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-message">Ваша корзина пуста</div>';
    cartSummary.style.display = 'none';
  } else {
    cartItemsContainer.innerHTML = '';
    state.cart.forEach(carId => {
      const car = cars.find(c => c.id == carId);
      if (!car) return;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <img src="${car.images.black}" alt="${car.brand} ${car.model}">
        <div class="item-details">
          <h3>${car.brand} ${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">${formatPrice(car.price)}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-outline" onclick="removeFromCart(${car.id})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
    
    // Обновление итоговой суммы
    const subtotal = state.cart.reduce((sum, carId) => {
      const car = cars.find(c => c.id == carId);
      return sum + (car ? car.price : 0);
    }, 0);
    
    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-total').textContent = formatPrice(subtotal);
    cartSummary.style.display = 'block';
  }
  
  // Обновление счетчика в шапке
  document.getElementById('cart-count').textContent = state.cart.length;
}

// Функция удаления из корзины
function removeFromCart(productId) {
  state.cart = state.cart.filter(id => id !== productId);
  saveState();
  renderCart();
  updateHeaderCounters();
  
  const car = cars.find(c => c.id == productId);
  if (car) {
    showNotification(`${car.brand} ${car.model} удален из корзины`);
  } else {
    showNotification(`Товар удален из корзины`);
  }
}

function renderFavorites() {
  const favoritesContainer = document.getElementById('favorites-items');
  if (!favoritesContainer) return;
  
  if (state.favorites.length === 0) {
    favoritesContainer.innerHTML = '<div class="empty-message">У вас пока нет избранных товаров</div>';
  } else {
    favoritesContainer.innerHTML = '';
    state.favorites.forEach(carId => {
      const car = cars.find(c => c.id == carId);
      if (!car) return;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'fav-item';
      itemElement.innerHTML = `
        <img src="${car.images.black}" alt="${car.brand} ${car.model}">
        <div class="item-details">
          <h3>${car.brand} ${car.model}</h3>
          <p>${car.description}</p>
          <p class="price">${formatPrice(car.price)}</p>
        </div>
        <div class="item-actions">
          <button class="btn btn-primary" onclick="addToCart(${car.id})">
            <i class="fas fa-shopping-cart"></i> В корзину
          </button>
          <button class="btn btn-outline" onclick="removeFromFavorites(${car.id})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      `;
      favoritesContainer.appendChild(itemElement);
    });
  }
  document.getElementById('favorites-count').textContent = state.favorites.length;
}

function updateHeaderCounters() {
  const cartIcon = document.querySelector('.icons .fa-shopping-cart');
  const favIcon = document.querySelector('.icons .fa-star');
  
  if (cartIcon) {
    cartIcon.toggleAttribute('data-count', state.cart.length > 0);
    if (state.cart.length > 0) {
      cartIcon.setAttribute('data-count', state.cart.length);
    }
  }
  
  if (favIcon) {
    favIcon.toggleAttribute('data-count', state.favorites.length > 0);
    if (state.favorites.length > 0) {
      favIcon.setAttribute('data-count', state.favorites.length);
    }
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0 
  }).format(price);
}

function addToCart(productId) {
  if (!state.cart.includes(productId)) {
    state.cart.push(productId);
    saveState();
    
    const car = cars.find(c => c.id == productId);
    if (car) {
      showNotification(`${car.brand} ${car.model} добавлен в корзину`);
    } else {
      showNotification(`Товар добавлен в корзину`);
    }
    
    updateHeaderCounters();
    renderCart(); // Обновляем отображение корзины
  }
}

function removeFromFavorites(productId) {
  state.favorites = state.favorites.filter(id => id !== productId);
  saveState();
  renderFavorites();
  updateHeaderCounters();
  showNotification(`Товар удален из избранного`);
}

function saveState() {
  const appState = JSON.parse(localStorage.getItem('futureAutoState')) || {};
  appState.cart = state.cart;
  appState.favorites = state.favorites;
  localStorage.setItem('futureAutoState', JSON.stringify(appState));
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  if (!notification) return;
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

window.initFavoritesPage = initFavoritesPage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.removeFromFavorites = removeFromFavorites;