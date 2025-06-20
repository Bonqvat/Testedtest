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

      document.querySelector('.cart-btn')?.addEventListener('click', () => addToCart(carId));
      document.querySelector('.favorite-btn')?.addEventListener('click', () => addToFavorites(carId));
      document.querySelector('.order-btn')?.addEventListener('click', showOrderModal);
      document.querySelector('.test-drive-btn')?.addEventListener('click', showTestDriveModal);
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
    this.src = 'images/no-image.jpg';
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