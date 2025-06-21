import { cars, recommendedCarIds, brands, modelsByBrand } from '/data/data.js';

// Функция обновления счетчиков в хедере
function updateHeaderCounters() {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
  
  // Обновление счетчика избранного
  const favIcon = document.getElementById('favorites-icon');
  if (favIcon) {
    if (state.favorites.length > 0) {
      favIcon.setAttribute('data-count', state.favorites.length);
    } else {
      favIcon.removeAttribute('data-count');
    }
  }
  
  // Обновление счетчика корзины
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    if (state.cart.length > 0) {
      cartIcon.setAttribute('data-count', state.cart.length);
    } else {
      cartIcon.removeAttribute('data-count');
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
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

// Функция добавления в корзину
function addToCart(carId) {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
  
  // Проверяем, нет ли уже этого автомобиля в корзине
  if (!state.cart.includes(carId)) {
    state.cart.push(carId);
    localStorage.setItem('futureAutoState', JSON.stringify(state));
    
    // Обновляем счетчики в хедере
    updateHeaderCounters();
    
    // Показываем уведомление
    const car = cars.find(c => c.id === carId);
    if (car) {
      showNotification(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
    } else {
      showNotification('Автомобиль добавлен в корзину!');
    }
  } else {
    showNotification('Этот автомобиль уже в корзине');
  }
}

function initIndexPage() {
  populateBrandList();
  loadRecommendedCars();
  setupEventListeners();
  updateHeaderCounters(); // Инициализируем счетчики
}

function populateBrandList() {
  const brandList = document.getElementById('brandList');
  brandList.innerHTML = '';
  
  brands.forEach(brand => {
    const p = document.createElement('p');
    p.textContent = brand;
    p.addEventListener('click', () => selectBrand(brand));
    brandList.appendChild(p);
  });
}

function loadRecommendedCars() {
  const container = document.getElementById('recommendedCars');
  container.innerHTML = '';
  
  recommendedCarIds.forEach(carId => {
    const car = cars.find(c => c.id === carId);
    if (!car) return;
    
    const carElement = document.createElement('div');
    carElement.className = 'recommended-car';
    carElement.innerHTML = `
      <img src="${car.images.black}" alt="${car.brand} ${car.model}">
      <h3>${car.brand} ${car.model}</h3>
      <p>${car.price.toLocaleString('ru-RU')} ₽</p>
      <button class="btn add-to-cart" data-id="${car.id}">В корзину</button>
    `;
    container.appendChild(carElement);
  });
}

function setupEventListeners() {
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      setFilter(this);
    });
  });
  
  document.getElementById('searchButton').addEventListener('click', performSearch);
  
  document.querySelectorAll('.car-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      navigateToCatalog(this.dataset.type);
    });
  });
  
  // Обработчик для кнопок "В корзину"
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const carId = parseInt(e.target.dataset.id);
      addToCart(carId);
    }
  });
}

function performSearch() {
  const brand = document.getElementById('brandButton').textContent;
  const model = document.getElementById('modelButton').textContent;
  const price = document.querySelector('.price-input').value;
  
  const params = new URLSearchParams();
  
  if (brand !== 'Любые марки') params.set('brand', brand);
  if (model !== 'Любые модели') params.set('model', model);
  if (price) params.set('maxPrice', price);
  
  window.location.href = `#catalog?${params.toString()}`;
}

function navigateToCatalog(type) {
  window.location.href = `catalog.html?bodyType=${type}`;
}

function setFilter(selected) {
  document.querySelectorAll(".filter-option").forEach(el => el.classList.remove("selected"));
  selected.classList.add("selected");
}

function selectBrand(brand) {
  document.getElementById("brandButton").textContent = brand;
  updateModels(brand);
}

function updateModels(brand) {
  let modelList = document.getElementById("modelList");
  modelList.innerHTML = "";
  
  if (modelsByBrand[brand]) {
    modelsByBrand[brand].forEach(model => {
      let p = document.createElement("p");
      p.textContent = model;
      p.onclick = function () {
        document.getElementById("modelButton").textContent = model;
      };
      modelList.appendChild(p);
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadRecommendedCars();
  updateHeaderCounters(); // Обновляем счетчики при загрузке
});

window.initIndexPage = initIndexPage;