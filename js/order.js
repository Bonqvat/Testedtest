function initOrderPage() {
    // Проверка и инициализация состояния
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
        localStorage.setItem('futureAutoState', JSON.stringify({
            user: null,
            cart: [],
            favorites: []
        }));
    }

    // Данные об автомобилях
    const carData = {
        "Toyota": {
            models: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Hilux"],
            images: {
                "Camry": "https://via.placeholder.com/600x400?text=Toyota+Camry",
                "Corolla": "https://via.placeholder.com/600x400?text=Toyota+Corolla",
                "RAV4": "https://via.placeholder.com/600x400?text=Toyota+RAV4",
                "Land Cruiser": "https://via.placeholder.com/600x400?text=Land+Cruiser",
                "Hilux": "https://via.placeholder.com/600x400?text=Toyota+Hilux"
            }
        },
        "Honda": {
            models: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
            images: {
                "Civic": "https://via.placeholder.com/600x400?text=Honda+Civic",
                "Accord": "https://via.placeholder.com/600x400?text=Honda+Accord",
                "CR-V": "https://via.placeholder.com/600x400?text=Honda+CR-V",
                "Pilot": "https://via.placeholder.com/600x400?text=Honda+Pilot",
                "HR-V": "https://via.placeholder.com/600x400?text=Honda+HR-V"
            }
        },
        "BMW": {
            models: ["X5", "X3", "M3", "X7", "5-Series"],
            images: {
                "X5": "https://via.placeholder.com/600x400?text=BMW+X5",
                "X3": "https://via.placeholder.com/600x400?text=BMW+X3",
                "M3": "https://via.placeholder.com/600x400?text=BMW+M3",
                "X7": "https://via.placeholder.com/600x400?text=BMW+X7",
                "5-Series": "https://via.placeholder.com/600x400?text=BMW+5-Series"
            }
        }
    };

    // Цены автомобилей
    const carPrices = {
        "Camry": 2500000,
        "Corolla": 1800000,
        "RAV4": 2800000,
        "Land Cruiser": 6000000,
        "Hilux": 3000000,
        "Civic": 1900000,
        "Accord": 2300000,
        "CR-V": 2700000,
        "Pilot": 3500000,
        "HR-V": 2200000,
        "X5": 5500000,
        "X3": 4800000,
        "M3": 6000000,
        "X7": 7000000,
        "5-Series": 5000000
    };

    // Обновление списка моделей
    function updateModels() {
        const brand = document.getElementById("brand").value;
        const modelSelect = document.getElementById("model");
        
        modelSelect.innerHTML = '<option value="">Выберите модель автомобиля</option>';
        document.getElementById("carPreview").style.display = 'none';
        
        if (brand) {
            carData[brand].models.forEach(model => {
                let option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
    }

    // Обновление деталей автомобиля
    function updateCarDetails() {
        const brand = document.getElementById("brand").value;
        const model = document.getElementById("model").value;
        
        if (brand && model) {
            const preview = document.getElementById("carPreview");
            preview.src = carData[brand].images[model];
            preview.style.display = 'block';
            updatePrice();
        }
    }

    // Обновление цены
    function updatePrice() {
        const model = document.getElementById("model").value;
        const price = carPrices[model] || 0;
        document.getElementById("carPrice").textContent = price.toLocaleString();
        updateTotal();
    }

    // Обновление карты
    function updateMap() {
        const dealer = document.getElementById('dealer').value;
        if (dealer) {
            document.getElementById('map').innerHTML = `
                <iframe 
                    src="https://www.google.com/maps?q=${dealer}&output=embed" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy">
                </iframe>`;
        }
    }

    // Подтверждение заказа
    function showOrderConfirmation() {
        const brand = document.getElementById("brand").value;
        const model = document.getElementById("model").value;
        
        if (!brand || !model) {
            alert("Пожалуйста, выберите марку и модель автомобиля!");
            return;
        }
        
        const totalPrice = document.getElementById("totalPrice").textContent;
        const dealerSelect = document.getElementById("dealer");
        const selectedDealer = dealerSelect.options[dealerSelect.selectedIndex].text;
        
        if (!selectedDealer) {
            alert("Пожалуйста, выберите автосалон!");
            return;
        }
        
        document.getElementById("orderTotal").textContent = totalPrice;
        document.getElementById("dealerAddress").textContent = selectedDealer;
        document.getElementById("orderModal").style.display = "block";
    }

    // Закрытие модального окна
    function closeOrderModal() {
        document.getElementById("orderModal").style.display = "none";
    }

    // Обновление услуг
    function updateServices(select) {
        Array.from(select.options).forEach(option => {
            option.classList.toggle("selected-item", option.selected);
        });
        updateServicesCost();
    }

    // Обновление опций
    function updateOptions(select) {
        Array.from(select.options).forEach(option => {
            option.classList.toggle("selected-item", option.selected);
        });
        updateOptionsCost();
    }

    // Обновление стоимости услуг
    function updateServicesCost() {
        const selected = Array.from(document.getElementById("services").selectedOptions);
        let total = selected.reduce((sum, opt) => sum + getPriceFromText(opt.text), 0);
        document.getElementById("servicePrice").textContent = total.toLocaleString();
        updateTotal();
    }

    // Обновление стоимости опций
    function updateOptionsCost() {
        const selected = Array.from(document.getElementById("options").selectedOptions);
        let total = selected.reduce((sum, opt) => sum + getPriceFromText(opt.text), 0);
        document.getElementById("insurancePrice").textContent = total.toLocaleString();
        updateTotal();
    }

    // Парсинг цены из текста
    function getPriceFromText(text) {
        const match = text.match(/\((\d+)/);
        return match ? parseInt(match[1].replace(/\s/g, '')) : 0;
    }

    // Обновление итоговой стоимости
    function updateTotal() {
        const car = parseInt(document.getElementById("carPrice").textContent.replace(/\s+/g, '')) || 0;
        const services = parseInt(document.getElementById("servicePrice").textContent.replace(/\s+/g, '')) || 0;
        const options = parseInt(document.getElementById("insurancePrice").textContent.replace(/\s+/g, '')) || 0;
        document.getElementById("totalPrice").textContent = (car + services + options).toLocaleString();
    }

    // Инициализация страницы
    function initPage() {
        // Заполняем список марок
        const brandSelect = document.getElementById("brand");
        Object.keys(carData).forEach(brand => {
            let option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        // Проверяем предварительно выбранный автомобиль
        const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
        
        if (selectedProduct) {
            document.getElementById('brand').value = selectedProduct.brand;
            updateModels();
            
            setTimeout(() => {
                const modelSelect = document.getElementById('model');
                const modelOption = Array.from(modelSelect.options).find(
                    option => option.text.includes(selectedProduct.name.split(' ')[1])
                );
                
                if (modelOption) {
                    modelOption.selected = true;
                    updateCarDetails();
                }
                
                localStorage.removeItem('selectedProduct');
            }, 100);
        }

        // Инициализируем итоговую стоимость
        updateTotal();
    }

    // Вызываем инициализацию
    initPage();

    // Делаем функции доступными глобально для обработчиков в HTML
    window.updateModels = updateModels;
    window.updateCarDetails = updateCarDetails;
    window.updateMap = updateMap;
    window.updateServices = updateServices;
    window.updateOptions = updateOptions;
    window.showOrderConfirmation = showOrderConfirmation;
    window.closeOrderModal = closeOrderModal;
}

window.initOrderPage = initOrderPage;