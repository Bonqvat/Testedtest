import { cars } from '/data/data.js';

function initCarPage() {
  // Инициализация состояния приложения
  if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
    localStorage.setItem('futureAutoState', JSON.stringify({
      user: null,
      cart: [],
      favorites: [],
      currentCarId: null
    }));
  }

  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  const carId = state?.currentCarId;
  
  if (carId) {
    // Поиск автомобиля в локальных данных
    const car = cars.find(c => c.id === carId);
    if (car) {
      renderCar(car);
      // Сохраняем текущий автомобиль для быстрого доступа
      window.currentCar = car;
    } else {
      showError('Автомобиль не найден');
    }
  } else {
    showError('Не выбран автомобиль для просмотра');
  }

  // Обработчики форм
  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Ваш заказ успешно оформлен! С вами свяжется менеджер для подтверждения.');
    closeModal('orderModal');
  });

  document.getElementById('testDriveForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Вы успешно записаны на тест-драйв! С вами свяжется менеджер для подтверждения.');
    closeModal('testDriveModal');
  });
}

function showError(message) {
  const container = document.querySelector('.container');
  container.innerHTML = `<div class="error">${message}</div>`;
}

// Функция отображения данных автомобиля
function renderCar(car) {
  // Обновляем данные на странице
  document.getElementById('car-title').textContent = `${car.brand} ${car.model}`;
  document.getElementById('car-price').textContent = `${car.price.toLocaleString('ru-RU')}₽`;
  document.getElementById('car-description').textContent = car.description;
  
  // Устанавливаем изображение автомобиля (с заглушкой при ошибке)
  const img = document.getElementById('mainImage');
  img.src = car.images.black;
  img.alt = `${car.brand} ${car.model}`;
  img.onerror = function() {
    this.src = 'images/car-placeholder.png';
    this.classList.add('placeholder-image');
  };
  
  // Обновляем характеристики из объекта specs
  document.getElementById('specs-main').innerHTML = `
    <tr><td>Мощность двигателя</td><td>${car.specs.power} л.с.</td></tr>
    <tr><td>Объем двигателя</td><td>${car.specs.engineVolume}</td></tr>
    <tr><td>Разгон 0-100 км/ч</td><td>${car.specs.acceleration}</td></tr>
    <tr><td>Расход топлива</td><td>${car.specs.fuelConsumption}</td></tr>
    <tr><td>Привод</td><td>${car.specs.driveType}</td></tr>
  `;
  
  document.getElementById('specs-engine').innerHTML = `
    <tr><td>Рабочий объем</td><td>${car.specs.engineVolume}</td></tr>
    <tr><td>Тип двигателя</td><td>${car.specs.engineType}</td></tr>
    <tr><td>Конфигурация</td><td>${car.specs.engineConfig}</td></tr>
    <tr><td>Обороты макс.</td><td>${car.specs.maxRPM}</td></tr>
    <tr><td>Крутящий момент</td><td>${car.specs.torque}</td></tr>
  `;
  
  document.getElementById('specs-general').innerHTML = `
    <tr><td>Страна</td><td>${car.specs.country}</td></tr>
    <tr><td>Год</td><td>${car.year}</td></tr>
    <tr><td>Кузов</td><td>${car.specs.bodyType}</td></tr>
    <tr><td>Комплектация</td><td>${car.specs.trim}</td></tr>
    <tr><td>Количество дверей</td><td>${car.specs.doors}</td></tr>
  `;
}

// Функция смены цвета автомобиля
function changeColor(color, imageUrl) {
  document.getElementById('mainImage').src = imageUrl;
  
  // Обновление активного цвета
  const colors = document.querySelectorAll('.color');
  colors.forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
}

// Функция добавления в корзину
function addToCart() {
  if (!window.currentCar) {
    alert('Ошибка: данные автомобиля не загружены');
    return;
  }
  
  const car = window.currentCar;
  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  
  // Обновление состояния корзины
  const existingItem = state.cart.find(item => item.id === car.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: car.id,
      brand: car.brand,
      model: car.model,
      price: car.price,
      quantity: 1
    });
  }
  
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  updateHeaderCounters();
  alert(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
}

// Функция добавления в избранное
function addToFavorites() {
  if (!window.currentCar) {
    alert('Ошибка: данные автомобиля не загружены');
    return;
  }

  const car = window.currentCar;
  const state = JSON.parse(localStorage.getItem('futureAutoState'));
  
  // Обновляем состояние
  if (!state.favorites.includes(car.id)) {
    state.favorites.push(car.id);
    localStorage.setItem('futureAutoState', JSON.stringify(state));
    updateHeaderCounters();
    alert(`Автомобиль ${car.brand} ${car.model} добавлен в избранное!`);
  } else {
    alert('Этот автомобиль уже в избранном');
  }
}

function showOrderModal() {
  document.getElementById('orderModal').style.display = 'block';
}

function showTestDriveModal() {
  document.getElementById('testDriveModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};

window.initCarPage = initCarPage;