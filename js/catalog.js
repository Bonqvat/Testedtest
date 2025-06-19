import { brands, modelsByBrand } from '/data/data.js';

// Текущая страница и количество элементов на странице
let currentPage = 1;
const itemsPerPage = 8;

// Основной массив автомобилей (будет загружаться из БД)
let cars = [];
let carData = []; // Для автодополнения поиска
let currentFilteredCars = []; // Для хранения текущих отфильтрованных автомобилей

// Основная функция инициализации каталога (асинхронная)
async function initCatalogPage() {
  await loadCarsFromDB(); // Загружаем автомобили из БД
  currentFilteredCars = [...cars]; // Инициализируем отфильтрованный массив
  populateBrandFilter(); // Инициализируем фильтр марок
  setupEventListeners(); // Настраиваем обработчики событий
  initPriceSlider();
  
  // Парсим параметры URL
  const urlParams = new URLSearchParams(window.location.search);
  const brand = urlParams.get('brand');
  const model = urlParams.get('model');
  const maxPrice = urlParams.get('maxPrice');
  const bodyType = urlParams.get('bodyType');

  // Устанавливаем параметры в фильтры
  if (brand) {
    document.getElementById('brandSelect').value = brand.toLowerCase();
    updateModels(false); // Обновляем модели без фильтрации
  }
  
  if (model) {
    document.getElementById('modelSelect').value = model.toLowerCase();
  }
  
  if (maxPrice) {
    document.getElementById('maxPrice').value = maxPrice;
  }
  
  if (bodyType) {
    document.getElementById('bodyTypeSelect').value = bodyType;
  }
  
  // Применяем фильтры
  filterCars();
  updatePagination();
  updateHeaderCounters();
}

function setupEventListeners() {
  // Обработчики для фильтров
  document.getElementById('filterToggle')?.addEventListener('click', function(e) {
    e.stopPropagation();
    const panel = document.getElementById('filtersPanel');
    if (panel) {
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
    }
  });

  // Закрытие фильтров при клике вне их
  document.addEventListener('click', function(e) {
    const panel = document.getElementById('filtersPanel');
    const button = document.getElementById('filterToggle');
    
    if (panel && button && !panel.contains(e.target) && !button.contains(e.target)) {
      panel.style.display = 'none';
    }
  });

  // Обработчик поиска
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      showSuggestions(this.value);
    });
  }

  // Обработчик кнопки поиска
  const searchButton = document.querySelector('.search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }

  // Обработчики для слайдера цен
  const priceSlider = document.getElementById('priceSlider');
  if (priceSlider) {
    priceSlider.addEventListener('input', updatePriceInputs);
  }

  const minPriceInput = document.getElementById('minPrice');
  if (minPriceInput) {
    minPriceInput.addEventListener('change', updatePriceSlider);
  }

  const maxPriceInput = document.getElementById('maxPrice');
  if (maxPriceInput) {
    maxPriceInput.addEventListener('change', filterCars);
  }

  // Обработчики для кнопки "Применить фильтры"
  const applyFiltersBtn = document.querySelector('.apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
  }

  // Обработчик изменения марки
  const brandSelect = document.getElementById('brandSelect');
  if (brandSelect) {
    brandSelect.addEventListener('change', updateModels);
  }

  // Обработчик изменения типа кузова
  const bodyTypeSelect = document.getElementById('bodyTypeSelect');
  if (bodyTypeSelect) {
    bodyTypeSelect.addEventListener('change', filterByBodyType);
  }

  // Обработчики для кнопок сброса фильтров
  document.querySelectorAll('.reset-filter').forEach(button => {
    button.addEventListener('click', function() {
      const filterId = this.dataset.filter;
      resetFilter(filterId);
    });
  });

  // Обработчик для кнопки сброса ценового фильтра
  const resetPriceBtn = document.querySelector('.reset-price-filter');
  if (resetPriceBtn) {
    resetPriceBtn.addEventListener('click', resetPriceFilter);
  }
}

// Загрузка автомобилей из БД
async function loadCarsFromDB() {
  try {
    const response = await fetch('script.php?action=getCars');
    const data = await response.json();
    
    if (Array.isArray(data)) {
      cars = data.map(car => ({
        ...car,
        features: car.features ? JSON.parse(car.features) : [],
        images: car.images ? JSON.parse(car.images) : [],
        power: parseInt(car.power) || 0 // Преобразование мощности в число
      }));
      
      // Создаем список автомобилей для автодополнения
      carData = cars.map(car => `${car.brand} ${car.model}`);
    } else {
      console.error('Invalid data format:', data);
    }
  } catch (error) {
    console.error('Error loading cars:', error);
  }
}

// Заполнение фильтра брендами
function populateBrandFilter() {
  const brandSelect = document.getElementById('brandSelect');
  if (!brandSelect) return;
  
  brandSelect.innerHTML = '<option value="" selected>Все марки</option>';
  
  // Используем реальные марки из данных
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand.toLowerCase();
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

// Инициализация слайдера цен
function initPriceSlider() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (!minPrice || !maxPrice || !priceSlider) return;
  
  // Рассчитываем мин/макс цену из данных
  const min = Math.min(...cars.map(car => car.price));
  const max = Math.max(...cars.map(car => car.price));
  
  // Защита от пустого массива
  const safeMin = isFinite(min) ? min : 0;
  const safeMax = isFinite(max) ? max : 10000000;
  
  minPrice.min = safeMin;
  minPrice.max = safeMax;
  minPrice.value = safeMin;
  minPrice.placeholder = `от ${safeMin.toLocaleString()}`;
  
  maxPrice.min = safeMin;
  maxPrice.max = safeMax;
  maxPrice.value = safeMax;
  maxPrice.placeholder = `до ${safeMax.toLocaleString()}`;
  
  priceSlider.min = safeMin;
  priceSlider.max = safeMax;
  priceSlider.value = safeMin;
}

// Обновление полей ввода при изменении слайдера
function updatePriceInputs() {
  const priceSlider = document.getElementById('priceSlider');
  const minPrice = document.getElementById('minPrice');
  
  if (!priceSlider || !minPrice) return;
  
  minPrice.value = priceSlider.value;
  filterCars();
}

// Обновление слайдера при изменении полей ввода
function updatePriceSlider() {
  const minPrice = document.getElementById('minPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (!minPrice || !priceSlider) return;
  
  priceSlider.value = minPrice.value;
  filterCars();
}

// Функция отрисовки каталога
function renderCatalog(carsToShow) {
  const carGrid = document.getElementById('carGrid');
  if (!carGrid) return;
  
  carGrid.innerHTML = '';
  
  if (!carsToShow || carsToShow.length === 0) {
    carGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Автомобили по вашему запросу не найдены</p>';
    return;
  }
  
  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = carsToShow.slice(startIndex, startIndex + itemsPerPage);
  
  paginatedCars.forEach((car, index) => {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';
    carCard.style.animationDelay = `${0.1 * index}s`;
    
    const imageUrl = car.images.length > 0 ? car.images[0] : 'images/no-image.jpg';
    
    carCard.innerHTML = `
      <div class="car-status">${car.status}</div>
      <img src="${imageUrl}" alt="${car.brand} ${car.model}">
      <div class="car-info">
        <h3>${car.brand} ${car.model} ${car.year}</h3>
        <p>${car.description}</p>
        <div class="car-features">
          ${car.features.map(feature => `<span class="car-feature">${feature}</span>`).join('')}
        </div>
        <p class="car-price">${car.price.toLocaleString()} ₽</p>
      </div>
      <div class="card-buttons">
        <button class="favorite-btn">В избранное</button>
        <button class="cart-btn">В корзину</button>
        <button class="details-btn">Подробнее</button>
      </div>
    `;
    
    carCard.querySelector('.favorite-btn')?.addEventListener('click', () => addToFavorites(car.id));
    carCard.querySelector('.cart-btn')?.addEventListener('click', () => addToCart(car.id));
    carCard.querySelector('.details-btn')?.addEventListener('click', () => showCarDetails(car.id));
    
    carGrid.appendChild(carCard);
  });
  
  updatePagination();
}

// Добавление в избранное
function addToFavorites(carId) {
  const car = cars.find(c => c.id === carId);
  if (car) {
    const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
    
    if (!state.favorites.includes(carId)) {
      state.favorites.push(carId);
      localStorage.setItem('futureAutoState', JSON.stringify(state));
      
      // Анимация иконки
      const favIcon = document.getElementById('favorites-icon');
      if (favIcon) {
        favIcon.classList.add('bounce-animation');
        setTimeout(() => favIcon.classList.remove('bounce-animation'), 500);
      }
      
      updateHeaderCounters();
      showNotification(`Автомобиль ${car.brand} ${car.model} добавлен в избранное!`);
    } else {
      showNotification(`Автомобиль ${car.brand} ${car.model} уже в избранном!`);
    }
  }
}

// Добавление в корзину
function addToCart(carId) {
  const car = cars.find(c => c.id === carId);
  if (car) {
    const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
    
    if (!state.cart.includes(carId)) {
      state.cart.push(carId);
      localStorage.setItem('futureAutoState', JSON.stringify(state));
      
      // Анимация иконки
      const cartIcon = document.getElementById('cart-icon');
      if (cartIcon) {
        cartIcon.classList.add('bounce-animation');
        setTimeout(() => cartIcon.classList.remove('bounce-animation'), 500);
      }
      
      updateHeaderCounters();
      showNotification(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
    } else {
      showNotification(`Автомобиль ${car.brand} ${car.model} уже в корзине!`);
    }
  }
}

// Переход на страницу автомобиля
function showCarDetails(carId) {
  const state = JSON.parse(localStorage.getItem('futureAutoState')) || {};
  state.currentCarId = carId;
  localStorage.setItem('futureAutoState', JSON.stringify(state));
  window.location.href = `car-details.html?id=${carId}`;
}

// Функция для обновления доступных опций в селектах
function updateFilterOptions(filteredCars) {
  // Обновляем модели
  const brandSelect = document.getElementById('brandSelect');
  const modelSelect = document.getElementById('modelSelect');
  
  if (!brandSelect || !modelSelect) return;
  
  const selectedBrand = brandSelect.value.toLowerCase();
  
  if (selectedBrand && modelsByBrand[selectedBrand]) {
    modelSelect.innerHTML = '<option value="" selected>Выберите модель</option>';
    modelSelect.disabled = false;
    
    modelsByBrand[selectedBrand].forEach(model => {
      const option = document.createElement('option');
      option.value = model.toLowerCase();
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  } else {
    modelSelect.innerHTML = '<option value="" selected>Сначала выберите марку</option>';
    modelSelect.disabled = true;
  }
  
  // Обновляем годы выпуска
  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    const availableYears = [...new Set(filteredCars.map(car => car.year))].sort((a, b) => b - a);
    yearSelect.innerHTML = '<option value="" selected>Любой</option>';
    availableYears.forEach(year => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });
  }
  
  // Обновляем типы привода
  const driveSelect = document.getElementById('driveTypeSelect');
  if (driveSelect) {
    const availableDrives = [...new Set(filteredCars.map(car => car.drive))];
    driveSelect.innerHTML = '<option value="" selected>Любой</option>';
    availableDrives.forEach(drive => {
      const option = document.createElement('option');
      option.value = drive;
      option.textContent = 
        drive === 'front' ? 'Передний' : 
        drive === 'rear' ? 'Задний' : 'Полный';
      driveSelect.appendChild(option);
    });
    
    // Проверяем текущее значение и сбрасываем, если оно недоступно
    const currentValue = driveSelect.value;
    const isValid = availableDrives.includes(currentValue) || currentValue === '';
    if (!isValid) {
      driveSelect.value = '';
    }
  }
  
  // Обновляем опции мощности
  const powerSelect = document.getElementById('powerSelect');
  if (powerSelect) {
    const powerRanges = [
      { value: 50, label: "до 50 л.с." },
      { value: 100, label: "51-100 л.с." },
      { value: 150, label: "101-150 л.с." },
      { value: 200, label: "151-200 л.с." },
      { value: 300, label: "201-300 л.с." },
      { value: 500, label: "301-500 л.с." },
      { value: 750, label: "501-750 л.с." },
      { value: 1000, label: "751-1000 л.с." },
      { value: 1001, label: "более 1000 л.с." }
    ];
    
    powerSelect.innerHTML = '<option value="" selected>Любая</option>';
    powerRanges.forEach(range => {
      const option = document.createElement('option');
      option.value = range.value;
      option.textContent = range.label;
      powerSelect.appendChild(option);
    });
  }
  
  // Обновляем ценовой диапазон
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (minPriceInput && maxPriceInput && priceSlider && filteredCars.length > 0) {
    const minPrice = Math.min(...filteredCars.map(car => car.price));
    const maxPrice = Math.max(...filteredCars.map(car => car.price));
    
    minPriceInput.min = minPrice;
    minPriceInput.placeholder = `от ${minPrice.toLocaleString()}`;
    maxPriceInput.placeholder = `до ${maxPrice.toLocaleString()}`;
    priceSlider.min = minPrice;
    priceSlider.max = maxPrice;
  }
}

// Автодополнение поиска
function showSuggestions(value) {
  const suggestions = document.getElementById('suggestions');
  if (!suggestions) return;
  
  suggestions.innerHTML = '';
  if (!value) return;
  
  const filteredSuggestions = carData.filter(car => 
    car.toLowerCase().includes(value.toLowerCase())
  );
  
  filteredSuggestions.forEach(suggestion => {
    const suggestionDiv = document.createElement('div');
    suggestionDiv.textContent = suggestion;
    suggestionDiv.onclick = function() {
      document.getElementById('search').value = suggestion;
      suggestions.innerHTML = '';
      filterCars();
    };
    suggestions.appendChild(suggestionDiv);
  });
}

// Обновление моделей при выборе марки
function updateModels(triggerFilter = true) {
  const brandSelect = document.getElementById('brandSelect');
  const modelSelect = document.getElementById('modelSelect');
  
  if (!brandSelect || !modelSelect) return;
  
  const selectedBrand = brandSelect.value.toLowerCase();
  
  modelSelect.innerHTML = '<option value="" selected>Выберите модель</option>';
  modelSelect.disabled = !selectedBrand;
  
  // Проверяем наличие моделей для выбранной марки
  if (selectedBrand && modelsByBrand[selectedBrand]) {
    modelsByBrand[selectedBrand].forEach(model => {
      const option = document.createElement('option');
      option.value = model.toLowerCase();
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
  
  if (triggerFilter) filterCars();
}

// Фильтрация по типу кузова с обновлением других параметров
function filterByBodyType() {
  const bodyTypeSelect = document.getElementById('bodyTypeSelect');
  const bodyType = bodyTypeSelect.value;
  
  let filteredCars = cars;
  if (bodyType) {
    filteredCars = cars.filter(car => car.bodyType === bodyType);
  }
  
  // Обновляем доступные опции в других фильтрах
  updateFilterOptions(filteredCars);
  
  // Применяем фильтрацию
  filterCars();
}
    
// Основная функция фильтрации
function filterCars() {
  const brand = document.getElementById('brandSelect')?.value?.toLowerCase() || '';
  const model = document.getElementById('modelSelect')?.value || '';
  const year = document.getElementById('yearSelect')?.value || '';
  const bodyType = document.getElementById('bodyTypeSelect')?.value || '';
  const driveType = document.getElementById('driveTypeSelect')?.value || '';
  const power = document.getElementById('powerSelect')?.value || '';
  const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
  const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
  const searchText = document.getElementById('search')?.value?.toLowerCase() || '';
  
  currentFilteredCars = cars.filter(car => {
    // Фильтрация по марке
    if (brand && car.brand.toLowerCase() !== brand) return false;
    
    // Фильтрация по модели
    if (model && car.model.toLowerCase() !== model) return false;
    
    // Фильтрация по году
    if (year && car.year !== parseInt(year)) return false;
    
    // Фильтрация по типу кузова
    if (bodyType && car.bodyType !== bodyType) return false;
    
    // Фильтрация по приводу
    if (driveType && car.drive !== driveType) return false;
    
    // Фильтрация по мощности
    if (power) {
      const carPower = car.power;
      const powerValue = parseInt(power);
      if (powerValue === 50 && carPower > 50) return false;
      if (powerValue === 100 && (carPower <= 50 || carPower > 100)) return false;
      if (powerValue === 150 && (carPower <= 100 || carPower > 150)) return false;
      if (powerValue === 200 && (carPower <= 150 || carPower > 200)) return false;
      if (powerValue === 300 && (carPower <= 200 || carPower > 300)) return false;
      if (powerValue === 500 && (carPower <= 300 || carPower > 500)) return false;
      if (powerValue === 750 && (carPower <= 500 || carPower > 750)) return false;
      if (powerValue === 1000 && (carPower <= 750 || carPower > 1000)) return false;
      if (powerValue === 1001 && carPower <= 1000) return false;
    }
    
    // Фильтрация по цене
    const carPrice = car.price;
    if (carPrice < minPrice || carPrice > maxPrice) return false;
    
    // Фильтрация по поисковому запросу
    if (searchText) {
      const carName = `${car.brand} ${car.model}`.toLowerCase();
      if (!carName.includes(searchText)) return false;
    }
    
    return true;
  });
  
  currentPage = 1; // Сбрасываем на первую страницу при фильтрации
  renderCatalog(currentFilteredCars);
}
    
// Применение фильтров
function applyFilters() {
  filterCars();
  const panel = document.getElementById('filtersPanel');
  if (panel) {
    panel.style.display = 'none';
  }
}

// Функция поиска
function performSearch() {
  filterCars();
}

// Сброс фильтра
function resetFilter(filterId) {
  const element = document.getElementById(filterId);
  if (element) {
    element.value = '';
    
    // Если сбрасываем марку, нужно также сбросить модели
    if (filterId === 'brandSelect') {
      const modelSelect = document.getElementById('modelSelect');
      if (modelSelect) {
        modelSelect.innerHTML = '<option value="" selected>Сначала выберите марку</option>';
        modelSelect.disabled = true;
      }
    }
    
    filterCars();
  }
}

// Сброс ценового фильтра
function resetPriceFilter() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const priceSlider = document.getElementById('priceSlider');
  
  if (minPrice && maxPrice && priceSlider) {
    const min = Math.min(...cars.map(car => car.price));
    const max = Math.max(...cars.map(car => car.price));
    
    // Защита от пустого массива
    const safeMin = isFinite(min) ? min : 0;
    const safeMax = isFinite(max) ? max : 10000000;
    
    minPrice.value = safeMin;
    maxPrice.value = safeMax;
    priceSlider.value = safeMin;
  }
  
  filterCars();
}

// Пагинация
function changePage(page) {
  const totalPages = Math.ceil(currentFilteredCars.length / itemsPerPage);
  
  if (page === -1 && currentPage > 1) {
    currentPage--;
  } else if (page === 1 && currentPage < totalPages) {
    currentPage++;
  } else if (page > 0) {
    currentPage = page;
  }
  
  renderCatalog(currentFilteredCars);
}

function updatePagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const totalPages = Math.ceil(currentFilteredCars.length / itemsPerPage);
  
  // Очищаем кнопки пагинации, кроме первой и последней
  while (pagination.children.length > 2) {
    pagination.removeChild(pagination.children[1]);
  }
  
  // Добавляем кнопки страниц
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = function() { changePage(i); };
    if (i === currentPage) {
      button.classList.add('active-page');
    }
    pagination.insertBefore(button, pagination.lastElementChild);
  }
  
  // Обновляем состояние кнопок "Предыдущие" и "Следующие"
  const prevButton = pagination.firstElementChild;
  const nextButton = pagination.lastElementChild;
  
  if (prevButton) prevButton.disabled = currentPage === 1;
  if (nextButton) nextButton.disabled = currentPage === totalPages || totalPages === 0;
}

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

// Загрузка автомобилей при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
  await initCatalogPage();
});

// Экспорт основной функции
window.initCatalogPage = initCatalogPage;