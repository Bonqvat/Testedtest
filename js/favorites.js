import { cars } from '/data/data.js';

const state = {
  user: null,
  cart: [],
  favorites: []
};

async function initFavoritesPage() {
  // Проверяем сохраненное состояние
  const savedState = localStorage.getItem('futureAutoState');
  if (savedState) {
    const stateObj = JSON.parse(savedState);
    state.user = stateObj.user;
    state.cart = stateObj.cart || [];
    state.favorites = stateObj.favorites || [];
  }

  if (!state.user) {
    alert('Пожалуйста, войдите в систему');
    loadPage('index');
    return;
  }

  try {
    const [cart, favorites] = await Promise.all([
      fetchCart(),
      fetchFavorites()
    ]);
    
    // Обновляем состояние актуальными данными с сервера
    state.cart = cart;
    state.favorites = favorites;
    
    // Сохраняем обновленное состояние
    saveState();
    
    renderCart(); 
    renderFavorites();
    updateHeaderCounters();
  } catch (error) {
    showNotification(`Ошибка загрузки: ${error.message}`, 'error');
    
    // В случае ошибки используем данные из localStorage
    renderCart();
    renderFavorites();
    updateHeaderCounters();
  }
}

// Функции получения данных с сервера
async function fetchCart() {
  const response = await fetch('script.php?action=getCart');
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function fetchFavorites() {
  const response = await fetch('script.php?action=getFavorites');
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Отображение корзины
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

// Удаление из корзины
async function removeFromCart(productId) {
  try {
    await fetch('script.php?action=removeFromCart', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ carId: productId })
    });

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
  } catch (error) {
    showNotification(`Ошибка: ${error.message}`, 'error');
  }
}

// Отображение избранного
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

// Обновление счетчиков в шапке
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

// Форматирование цены
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0 
  }).format(price);
}

// Добавление в корзину
async function addToCart(productId) {
  try {
    await fetch('script.php?action=addToCart', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ carId: productId })
    });
    
    if (!state.cart.includes(productId)) {
      state.cart.push(productId);
      saveState();
    }
    
    const car = cars.find(c => c.id == productId);
    if (car) {
      showNotification(`${car.brand} ${car.model} добавлен в корзину`);
    } else {
      showNotification(`Товар добавлен в корзину`);
    }
    
    updateHeaderCounters();
    renderCart();
  } catch (error) {
    showNotification(`Ошибка: ${error.message}`, 'error');
  }
}

// Удаление из избранного
async function removeFromFavorites(productId) {
  try {
    await fetch('script.php?action=removeFromFavorite', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ carId: productId })
    });

    state.favorites = state.favorites.filter(id => id !== productId);
    saveState();
    renderFavorites();
    updateHeaderCounters();
    showNotification(`Товар удален из избранного`);
  } catch (error) {
    showNotification(`Ошибка: ${error.message}`, 'error');
  }
}

// Сохранение состояния в localStorage
function saveState() {
  const appState = {
    user: state.user,
    cart: state.cart,
    favorites: state.favorites
  };
  localStorage.setItem('futureAutoState', JSON.stringify(appState));
}

// Показ уведомлений
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.className = 'notification show ' + type;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

window.initFavoritesPage = initFavoritesPage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.removeFromFavorites = removeFromFavorites;