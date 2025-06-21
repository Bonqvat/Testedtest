function initOrderPage() {
    // Проверка и инициализация состояния
    if (!JSON.parse(localStorage.getItem('futureAutoState'))) {
        localStorage.setItem('futureAutoState', JSON.stringify({
            user: null,
            cart: [],
            favorites: []
        }));
    }

    // Данные об автомобилях (обновлены в соответствии с таблицей)
    const carData = {
        "Toyota": {
            models: ["Camry", "RAV4"],
            images: {
                "Camry": "https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n",
                "RAV4": "https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n"
            }
        },
        "BMW": {
            models: ["X5"],
            images: {
                "X5": "https://www.bmw.ru/content/dam/bmw/marketRU/bmw_ru/all-models/x-series/X5/2023/images-and-videos/images/BMW-X5-M60i-xDrive-Facelift-Exterior-05.jpg"
            }
        },
        "Audi": {
            models: ["A6"],
            images: {
                "A6": "https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n/1920x1080_A213561_large.jpg"
            }
        },
        "Skoda": {
            models: ["Superb"],
            images: {
                "Superb": "https://avatars.mds.yandex.net/get-autoru-vos/2177055/e49e3cbe7278978151aa5a83e7f1b8e0/1200x900"
            }
        },
        "Hyundai": {
            models: ["Tucson"],
            images: {
                "Tucson": "https://www.hyundai.com/content/hyundai/ww/data/news/data/2023/0000016718/image/newsroom-2023-tucson-design-01.jpg"
            }
        },
        "Kia": {
            models: ["Sportage"],
            images: {
                "Sportage": "https://www.kia.com/content/dam/kia/us/en/home/hero/sportage/sportage_my24_hero_desktop.jpg"
            }
        },
        "Volkswagen": {
            models: ["Golf"],
            images: {
                "Golf": "https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n"
            }
        },
        "Ford": {
            models: ["Mustang"],
            images: {
                "Mustang": "https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/3_2/24_FRD_MST_53895.jpg"
            }
        },
        "Lada": {
            models: ["Vesta"],
            images: {
                "Vesta": "https://static.lada.ru/images/v6/cars/vesta/sedan/gallery/vesta-sedan-21.jpg"
            }
        }
    };

    // Цены автомобилей (обновлены в соответствии с таблицей)
    const carPrices = {
        "Camry": 2450000,
        "RAV4": 3450000,
        "X5": 6890000,
        "A6": 4120000,
        "Superb": 2950000,
        "Tucson": 2850000,
        "Sportage": 2750000,
        "Golf": 1950000,
        "Mustang": 5890000,
        "Vesta": 1250000
    };

    // Карта соответствия автомобилей ID (обновлена в соответствии с таблицей)
    const carIds = {
        "Toyota": {
            "Camry": 1,
            "RAV4": 10
        },
        "BMW": {
            "X5": 2
        },
        "Audi": {
            "A6": 3
        },
        "Skoda": {
            "Superb": 4
        },
        "Hyundai": {
            "Tucson": 5
        },
        "Kia": {
            "Sportage": 6
        },
        "Volkswagen": {
            "Golf": 7
        },
        "Ford": {
            "Mustang": 8
        },
        "Lada": {
            "Vesta": 9
        }
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
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /^\+7\d{10}$/;
        
        if (!brand || !model) {
            alert("Пожалуйста, выберите марку и модель автомобиля!");
            return;
        }
        
        if (!phoneRegex.test(phone)) {
            alert("Пожалуйста, введите номер телефона в формате +7XXXXXXXXXX");
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

    // Получение ID автомобиля
    function findCarId(brand, model) {
        return carIds[brand]?.[model] || null;
    }

    // Отправка заказа на сервер
    function submitOrder() {
        const brand = document.getElementById("brand").value;
        const model = document.getElementById("model").value;
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /^\+7\d{10}$/;
        const carId = findCarId(brand, model);
        
        if (!carId) {
            alert("Ошибка: Не удалось определить ID автомобиля");
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert("Пожалуйста, введите номер телефона в формате +7XXXXXXXXXX");
            return;
        }

        const selectedServices = Array.from(
            document.getElementById("services").selectedOptions
        ).map(opt => opt.text);
        
        const selectedOptions = Array.from(
            document.getElementById("options").selectedOptions
        ).map(opt => opt.text);
        
        const dealerSelect = document.getElementById("dealer");
        const dealer = dealerSelect.options[dealerSelect.selectedIndex].text;
        const totalPrice = parseInt(
            document.getElementById("totalPrice").textContent.replace(/\s+/g, '')
        );

        // Проверка обязательных полей
        if (!brand || !model || !dealer || totalPrice <= 0) {
            alert("Пожалуйста, заполните все обязательные поля!");
            return;
        }

        fetch('script.php?action=placeOrder', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                carId: carId,
                services: selectedServices,
                options: selectedOptions,
                dealer: dealer,
                totalPrice: totalPrice,
                phone: phone
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(`Заказ #${data.orderId} успешно оформлен!`);
                closeOrderModal();
                
                // Сброс формы после успешного оформления
                document.getElementById("brand").value = "";
                document.getElementById("model").innerHTML = '<option value="">Выберите модель автомобиля</option>';
                document.getElementById("carPreview").style.display = 'none';
                document.getElementById("services").selectedIndex = -1;
                document.getElementById("options").selectedIndex = -1;
                document.getElementById("dealer").selectedIndex = 0;
                document.getElementById("phone").value = "";
                updateServices(document.getElementById("services"));
                updateOptions(document.getElementById("options"));
                updateTotal();
            } else {
                throw new Error(data.error || 'Неизвестная ошибка сервера');
            }
        })
        .catch(error => {
            alert(`Ошибка оформления заказа: ${error.message}`);
        });
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
    window.submitOrder = submitOrder;
}

window.initOrderPage = initOrderPage;