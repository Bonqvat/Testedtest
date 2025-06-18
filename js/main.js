import { cars, recommendedCarIds, brands, modelsByBrand } from '/data/data.js';

function initIndexPage() {
  populateBrandList();
  loadRecommendedCars();
  setupEventListeners();
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
  
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      addToCart(parseInt(e.target.dataset.id));
    }
  });
}

function addToCart(carId) {
  const car = cars.find(c => c.id === carId);
  if (car) {
    alert(`Автомобиль ${car.brand} ${car.model} добавлен в корзину!`);
  }
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
});

window.initIndexPage = initIndexPage;