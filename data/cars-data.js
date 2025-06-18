// Полные данные об автомобилях с расширенными характеристиками
const carDetailsData = {
  1: {
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 2450000,
    description: '2.5 (181 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Кожаный салон'],
    type: 'sedan',
    images: {
      black: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      gray: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
      white: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "181 ЛС" },
        { name: "Объем двигателя", value: "2.5 л" },
        { name: "Разгон 0-100 км/ч", value: "8.2 с" },
        { name: "Расход топлива", value: "7.2 л / 100 км" },
        { name: "Привод", value: "Передний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "2494 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6000 об/мин" },
        { name: "Крутящий момент", value: "231 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4885 мм" },
        { name: "Ширина", value: "1840 мм" },
        { name: "Высота", value: "1445 мм" },
        { name: "Колесная база", value: "2825 мм" },
        { name: "Объем багажника", value: "524 л" }
      ],
      general: [
        { name: "Страна", value: "Япония" },
        { name: "Год", value: "2024" },
        { name: "Кузов", value: "Седан" },
        { name: "Комплектация", value: "Prestige" },
        { name: "Количество дверей", value: "4" }
      ]
    }
  },
  2: {
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    price: 6890000,
    description: '3.0 (249 л.с.), автомат, полный привод',
    features: ['Автомат', 'Панор. крыша', 'Кожаный салон', 'Подогрев сидений'],
    type: 'suv',
    images: {
      black: 'https://www.bmw.ru/content/dam/bmw/marketRU/bmw_ru/all-models/x-series/X5/2023/images-and-videos/images/BMW-X5-M60i-xDrive-Facelift-Exterior-05.jpg',
      silver: 'https://www.bmw.ru/content/dam/bmw/marketRU/bmw_ru/all-models/x-series/X5/2023/images-and-videos/images/BMW-X5-xDrive30d-Facelift-Exterior-01.jpg',
      blue: 'https://www.bmw.ru/content/dam/bmw/marketRU/bmw_ru/all-models/x-series/X5/2023/images-and-videos/images/BMW-X5-M60i-xDrive-Facelift-Exterior-03.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "249 ЛС" },
        { name: "Объем двигателя", value: "3.0 л" },
        { name: "Разгон 0-100 км/ч", value: "6.5 с" },
        { name: "Расход топлива", value: "9.1 л / 100 км" },
        { name: "Привод", value: "Полный" }
      ],
      engine: [
        { name: "Рабочий объем", value: "2998 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6500 об/мин" },
        { name: "Крутящий момент", value: "400 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4922 мм" },
        { name: "Ширина", value: "2004 мм" },
        { name: "Высота", value: "1745 мм" },
        { name: "Колесная база", value: "2975 мм" },
        { name: "Объем багажника", value: "645 л" }
      ],
      general: [
        { name: "Страна", value: "Германия" },
        { name: "Год", value: "2023" },
        { name: "Кузов", value: "Внедорожник" },
        { name: "Комплектация", value: "xDrive40i" },
        { name: "Количество дверей", value: "5" }
      ]
    }
  },
  3: {
    brand: 'Audi',
    model: 'A6',
    year: 2023,
    price: 4120000,
    description: '2.0 (190 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Круиз-контроль'],
    type: 'sedan',
    images: {
      black: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n/1920x1080_A213561_large.jpg',
      gray: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n/1920x1080_A213568_large.jpg',
      blue: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n/1920x1080_A213569_large.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "190 ЛС" },
        { name: "Объем двигателя", value: "2.0 л" },
        { name: "Разгон 0-100 км/ч", value: "8.1 с" },
        { name: "Расход топлива", value: "6.8 л / 100 км" },
        { name: "Привод", value: "Полный" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1984 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6200 об/мин" },
        { name: "Крутящий момент", value: "320 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4939 мм" },
        { name: "Ширина", value: "1886 мм" },
        { name: "Высота", value: "1457 мм" },
        { name: "Колесная база", value: "2924 мм" },
        { name: "Объем багажника", value: "530 л" }
      ],
      general: [
        { name: "Страна", value: "Германия" },
        { name: "Год", value: "2023" },
        { name: "Кузов", value: "Седан" },
        { name: "Комплектация", value: "Premium" },
        { name: "Количество дверей", value: "4" }
      ]
    }
  },
  4: {
    brand: 'Skoda',
    model: 'Superb',
    year: 2023,
    price: 2950000,
    description: '2.0 (190 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Парктроник'],
    type: 'sedan',
    images: {
      black: 'images/image0.png',
      silver: 'images/image1.png',
      green: 'images/image2.png'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "190 ЛС" },
        { name: "Объем двигателя", value: "2.0 л" },
        { name: "Разгон 0-100 км/ч", value: "8.0 с" },
        { name: "Расход топлива", value: "6.7 л / 100 км" },
        { name: "Привод", value: "Передний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1984 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6000 об/мин" },
        { name: "Крутящий момент", value: "320 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4869 мм" },
        { name: "Ширина", value: "1864 мм" },
        { name: "Высота", value: "1468 мм" },
        { name: "Колесная база", value: "2841 мм" },
        { name: "Объем багажника", value: "625 л" }
      ],
      general: [
        { name: "Страна", value: "Чехия" },
        { name: "Год", value: "2023" },
        { name: "Кузов", value: "Седан" },
        { name: "Комплектация", value: "Style" },
        { name: "Количество дверей", value: "4" }
      ]
    }
  },
  5: {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    price: 2850000,
    description: '2.5 (180 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Камера 360'],
    type: 'suv',
    images: {
      black: 'https://www.hyundai.com/content/hyundai/ww/data/news/data/2023/0000016718/image/newsroom-2023-tucson-design-01.jpg',
      gray: 'https://www.hyundai.com/content/hyundai/ww/data/news/data/2023/0000016718/image/newsroom-2023-tucson-design-02.jpg',
      red: 'https://www.hyundai.com/content/hyundai/ww/data/news/data/2023/0000016718/image/newsroom-2023-tucson-design-03.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "180 ЛС" },
        { name: "Объем двигателя", value: "2.5 л" },
        { name: "Разгон 0-100 км/ч", value: "9.5 с" },
        { name: "Расход топлива", value: "8.2 л / 100 км" },
        { name: "Привод", value: "Полный" }
      ],
      engine: [
        { name: "Рабочий объем", value: "2497 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6000 об/мин" },
        { name: "Крутящий момент", value: "232 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4630 мм" },
        { name: "Ширина", value: "1865 мм" },
        { name: "Высота", value: "1665 мм" },
        { name: "Колесная база", value: "2755 мм" },
        { name: "Объем багажника", value: "620 л" }
      ],
      general: [
        { name: "Страна", value: "Южная Корея" },
        { name: "Год", value: "2024" },
        { name: "Кузов", value: "Внедорожник" },
        { name: "Комплектация", value: "Prestige" },
        { name: "Количество дверей", value: "5" }
      ]
    }
  },
  6: {
    brand: 'Kia',
    model: 'Sportage',
    year: 2024,
    price: 2750000,
    description: '2.0 (150 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Подогрев руля'],
    type: 'suv',
    images: {
      black: 'https://www.kia.com/content/dam/kia/us/en/home/hero/sportage/sportage_my24_hero_desktop.jpg',
      white: 'https://www.kia.com/content/dam/kia/us/en/home/hero/sportage/sportage_my24_hero_desktop_2.jpg',
      blue: 'https://www.kia.com/content/dam/kia/us/en/vehicles/sportage/2024/gallery/exterior/desktop/kia-2024-sportage-exterior-gallery-desktop-01.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "150 ЛС" },
        { name: "Объем двигателя", value: "2.0 л" },
        { name: "Разгон 0-100 км/ч", value: "10.5 с" },
        { name: "Расход топлива", value: "7.8 л / 100 км" },
        { name: "Привод", value: "Передний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1999 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6200 об/мин" },
        { name: "Крутящий момент", value: "192 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4660 мм" },
        { name: "Ширина", value: "1865 мм" },
        { name: "Высота", value: "1660 мм" },
        { name: "Колесная база", value: "2755 мм" },
        { name: "Объем багажника", value: "591 л" }
      ],
      general: [
        { name: "Страна", value: "Южная Корея" },
        { name: "Год", value: "2024" },
        { name: "Кузов", value: "Внедорожник" },
        { name: "Комплектация", value: "Style" },
        { name: "Количество дверей", value: "5" }
      ]
    }
  },
  7: {
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    price: 1950000,
    description: '1.4 (150 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Мультимедия'],
    type: 'hatchback',
    images: {
      black: 'images/image3.png',
      gray: 'images/image4.png',
      red: 'images/image5.png'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "150 ЛС" },
        { name: "Объем двигателя", value: "1.4 л" },
        { name: "Разгон 0-100 км/ч", value: "8.2 с" },
        { name: "Расход топлива", value: "5.8 л / 100 км" },
        { name: "Привод", value: "Передний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1395 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6000 об/мин" },
        { name: "Крутящий момент", value: "250 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4284 мм" },
        { name: "Ширина", value: "1789 мм" },
        { name: "Высота", value: "1456 мм" },
        { name: "Колесная база", value: "2636 мм" },
        { name: "Объем багажника", value: "380 л" }
      ],
      general: [
        { name: "Страна", value: "Германия" },
        { name: "Год", value: "2023" },
        { name: "Кузов", value: "Хэтчбэк" },
        { name: "Комплектация", value: "Comfortline" },
        { name: "Количество дверей", value: "5" }
      ]
    }
  },
  8: {
    brand: 'Ford',
    model: 'Mustang',
    year: 2023,
    price: 5890000,
    description: '5.0 (450 л.с.), автомат, задний привод',
    features: ['Автомат', 'Спорт режим', 'Кожаный салон'],
    type: 'coupe',
    images: {
      black: 'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/3_2/24_FRD_MST_53895.jpg',
      red: 'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/3_2/24_FRD_MST_53890.jpg',
      blue: 'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang/2024/collections/3_2/24_FRD_MST_53888.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "450 ЛС" },
        { name: "Объем двигателя", value: "5.0 л" },
        { name: "Разгон 0-100 км/ч", value: "4.8 с" },
        { name: "Расход топлива", value: "13.5 л / 100 км" },
        { name: "Привод", value: "Задний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "5038 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "V8" },
        { name: "Обороты макс.", value: "7000 об/мин" },
        { name: "Крутящий момент", value: "529 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4789 мм" },
        { name: "Ширина", value: "1916 мм" },
        { name: "Высота", value: "1381 мм" },
        { name: "Колесная база", value: "2720 мм" },
        { name: "Объем багажника", value: "382 л" }
      ],
      general: [
        { name: "Страна", value: "США" },
        { name: "Год", value: "2023" },
        { name: "Кузов", value: "Купе" },
        { name: "Комплектация", value: "GT" },
        { name: "Количество дверей", value: "2" }
      ]
    }
  },
  9: {
    brand: 'Lada',
    model: 'Vesta',
    year: 2024,
    price: 1250000,
    description: '1.6 (106 л.с.), механика, передний привод',
    features: ['Кондиционер', 'Электростеклоподъемники'],
    type: 'sedan',
    images: {
      black: 'https://static.lada.ru/images/v6/cars/vesta/sedan/gallery/vesta-sedan-21.jpg',
      white: 'https://static.lada.ru/images/v6/cars/vesta/sedan/gallery/vesta-sedan-12.jpg',
      brown: 'https://static.lada.ru/images/v6/cars/vesta/sedan/gallery/vesta-sedan-14.jpg'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "106 ЛС" },
        { name: "Объем двигателя", value: "1.6 л" },
        { name: "Разгон 0-100 км/ч", value: "12.5 с" },
        { name: "Расход топлива", value: "7.5 л / 100 км" },
        { name: "Привод", value: "Передний" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1596 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "5800 об/мин" },
        { name: "Крутящий момент", value: "148 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4410 мм" },
        { name: "Ширина", value: "1764 мм" },
        { name: "Высота", value: "1497 мм" },
        { name: "Колесная база", value: "2635 мм" },
        { name: "Объем багажника", value: "480 л" }
      ],
      general: [
        { name: "Страна", value: "Россия" },
        { name: "Год", value: "2024" },
        { name: "Кузов", value: "Седан" },
        { name: "Комплектация", value: "Comfort" },
        { name: "Количество дверей", value: "4" }
      ]
    }
  },
  10: {
    brand: 'Toyota',
    model: 'RAV4',
    year: 2024,
    price: 3450000,
    description: '2.0 (150 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Камера заднего вида'],
    type: 'suv',
    images: {
      black: 'images/image6.png',
      white: 'images/image7.png',
      silver: 'images/image0.png'
    },
    specs: {
      main: [
        { name: "Мощность двигателя", value: "150 ЛС" },
        { name: "Объем двигателя", value: "2.0 л" },
        { name: "Разгон 0-100 км/ч", value: "10.5 с" },
        { name: "Расход топлива", value: "7.0 л / 100 км" },
        { name: "Привод", value: "Полный" }
      ],
      engine: [
        { name: "Рабочий объем", value: "1987 см³" },
        { name: "Тип двигателя", value: "Бензиновый" },
        { name: "Конфигурация", value: "Рядный" },
        { name: "Обороты макс.", value: "6000 об/мин" },
        { name: "Крутящий момент", value: "192 Нм" }
      ],
      dimensions: [
        { name: "Длина", value: "4600 мм" },
        { name: "Ширина", value: "1855 мм" },
        { name: "Высота", value: "1685 мм" },
        { name: "Колесная база", value: "2690 мм" },
        { name: "Объем багажника", value: "580 л" }
      ],
      general: [
        { name: "Страна", value: "Япония" },
        { name: "Год", value: "2024" },
        { name: "Кузов", value: "Внедорожник" },
        { name: "Комплектация", value: "Comfort" },
        { name: "Количество дверей", value: "5" }
      ]
    }
  }
};

const carBrands = [
  "BMW", "Audi", "Mercedes", "Toyota", "Honda", "Ford", "Chevrolet", "Volkswagen",
  "Nissan", "Hyundai", "Kia", "Peugeot", "Renault", "Skoda", "Mazda", "Subaru",
  "Volvo", "Land Rover", "Jaguar", "Lexus", "Porsche", "Ferrari", "Lamborghini",
  "Tesla", "Jeep", "Dodge", "Chrysler", "Suzuki", "Mitsubishi", "Opel", "Mini",
  "Alfa Romeo", "Citroen", "FIAT", "Genesis", "Geely", "Great Wall", "BYD", "Chery",
  "MG", "SSANGYONG", "Isuzu", "MAZ", "Lada"
];

const modelsByBrand = {
  "BMW": ["X5", "X3", "3 Series", "5 Series", "7 Series"],
  "Audi": ["A4", "A6", "Q5", "Q7"],
  "Mercedes": ["C-Class", "E-Class", "GLC", "GLE"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander"],
  "Honda": ["Civic", "Accord", "CR-V", "HR-V"],
  "Ford": ["Focus", "Mustang", "Explorer", "F-150"],
  "Chevrolet": ["Malibu", "Tahoe", "Camaro"],
  "Volkswagen": ["Golf", "Passat", "Tiguan"],
  "Nissan": ["Altima", "Sentra", "Rogue"],
  "Hyundai": ["Elantra", "Tucson", "Santa Fe"],
  "Kia": ["Sportage", "Sorento", "Optima"],
  "Peugeot": ["208", "308", "3008"],
  "Renault": ["Clio", "Megane", "Koleos"],
  "Skoda": ["Octavia", "Superb", "Kodiaq"],
  "Mazda": ["Mazda3", "CX-5", "MX-5"],
  "Subaru": ["Impreza", "Forester", "Outback"],
  "Volvo": ["XC40", "XC60", "XC90"],
  "Land Rover": ["Range Rover", "Discovery"],
  "Jaguar": ["F-Type", "XF"],
  "Lexus": ["RX", "NX", "IS"],
  "Porsche": ["911", "Cayenne", "Panamera"],
  "Ferrari": ["488", "F8", "Roma"],
  "Lamborghini": ["Huracan", "Urus", "Aventador"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
  "Jeep": ["Wrangler", "Cherokee", "Grand Cherokee"],
  "Dodge": ["Charger", "Challenger", "Durango"],
  "Chrysler": ["300", "Pacifica"],
  "Suzuki": ["Swift", "Vitara", "Jimny"],
  "Mitsubishi": ["Outlander", "Lancer"],
  "Opel": ["Astra", "Insignia"],
  "Mini": ["Cooper", "Countryman"],
  "Alfa Romeo": ["Giulia", "Stelvio"],
  "Citroen": ["C3", "C5 Aircross"],
  "FIAT": ["500", "Panda"],
  "Genesis": ["G70", "G80"],
  "Geely": ["Atlas", "Coolray"],
  "Great Wall": ["Haval H6"],
  "BYD": ["Han", "Tang"],
  "Chery": ["Tiggo 7", "Arrizo 5"],
  "MG": ["ZS", "HS"],
  "SSANGYONG": ["Korando", "Tivoli"],
  "Isuzu": ["D-Max", "MU-X"],
  "MAZ": ["MAZ-5440"],
  "Lada": ["Granta", "Vesta", "Xray", "Niva"]
};

const recommendedCars = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 2450000,
    image: 'https://gaztormoz.ru/_next/image?url=https%3A%2F%2Fstatic.gaztormoz.ru%2Fchina%2FModels%2FImages%2F1714470011720.jpeg&w=2048&q=75/1200x900nimages/camry.jpg',
    description: '2.5 (181 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Кожаный салон'],
    type: 'sedan'
  },
  {
    id: 2,
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    price: 6890000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2021936/a4e06ec3ec1f96d539a96eb1c9f9b1c3/1200x900n',
    description: '3.0 (249 л.с.), автомат, полный привод',
    features: ['Автомат', 'Панор. крыша', 'Кожаный салон', 'Подогрев сидений'],
    type: 'suv'
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'A6',
    year: 2023,
    price: 4120000,
    image: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/1200x900n',
    description: '2.0 (190 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Круиз-контроль'],
    type: 'sedan'
  },
  {
    id: 4,
    brand: 'Skoda',
    model: 'Superb',
    year: 2023,
    price: 2950000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2177055/e49e3cbe7278978151aa5a83e7f1b8e0/1200x900',
    description: '2.0 (190 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Парктроник'],
    type: 'sedan'
  }
];

const allCars = [
  ...recommendedCars,
  {
    id: 5,
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    price: 2850000,
    image: 'images/tucson.jpg',
    description: '2.5 (180 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Камера 360'],
    type: 'suv'
  },
  {
    id: 6,
    brand: 'Kia',
    model: 'Sportage',
    year: 2024,
    price: 2750000,
    image: 'images/sportage.jpg',
    description: '2.0 (150 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Подогрев руля'],
    type: 'suv'
  },
  {
    id: 7,
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    price: 1950000,
    image: 'images/golf.jpg',
    description: '1.4 (150 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Мультимедия'],
    type: 'hatchback'
  },
  {
    id: 8,
    brand: 'Ford',
    model: 'Mustang',
    year: 2023,
    price: 5890000,
    image: 'images/mustang.jpg',
    description: '5.0 (450 л.с.), автомат, задний привод',
    features: ['Автомат', 'Спорт режим', 'Кожаный салон'],
    type: 'coupe'
  },
  {
    id: 9,
    brand: 'Lada',
    model: 'Vesta',
    year: 2024,
    price: 1250000,
    image: 'images/vesta.jpg',
    description: '1.6 (106 л.с.), механика, передний привод',
    features: ['Кондиционер', 'Электростеклоподъемники'],
    type: 'sedan'
  },
  {
    id: 10,
    brand: 'Toyota',
    model: 'RAV4',
    year: 2024,
    price: 3450000,
    image: 'images/rav4.jpg',
    description: '2.0 (150 л.с.), автомат, полный привод',
    features: ['Автомат', 'Климат-контроль', 'Камера заднего вида'],
    type: 'suv'
  }
];

const carsData = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    bodyType: 'sedan',
    drive: 'front',
    power: 181,
    price: 2450000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '2.5 (181 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Кожаный салон'],
    status: 'Новый'
  },
  {
    id: 2,
    brand: 'Audi',
    model: 'A6',
    year: 2023,
    bodyType: 'sedan',
    drive: 'full',
    power: 245,
    price: 4120000,
    image: 'https://avatars.mds.yandex.net/i?id=c0ea7b8d75d1b28d365e538c651c14a0_l-8498375-images-thumbs&n=13/',
    description: '2.0 TFSI (245 л.с.), автомат, полный привод',
    features: ['Автомат', 'Полный привод', 'Парктроник'],
    status: 'Новый'
  },
  {
    id: 3,
    brand: 'BMW',
    model: 'X5',
    year: 2025,
    bodyType: 'suv',
    drive: 'full',
    power: 340,
    price: 6890000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2021936/a4e06ec3ec1f96d539a96eb1c9f9b1c3/1200x900n',
    description: '3.0 (340 л.с.), автомат, полный привод',
    features: ['Автомат', 'Полный привод', 'Панорамная крыша'],
    status: 'Новый'
  },
  {
    id: 4,
    brand: 'Skoda',
    model: 'Superb',
    year: 2024,
    bodyType: 'hatchback',
    drive: 'front',
    power: 190,
    price: 2950000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '2.0 TSI (190 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Круиз-контроль'],
    status: 'Новый'
  },
  {
    id: 5,
    brand: 'Toyota',
    model: 'RAV4',
    year: 2023,
    bodyType: 'crossover',
    drive: 'full',
    power: 194,
    price: 3200000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '2.5 (194 л.с.), автомат, полный привод',
    features: ['Автомат', 'Полный привод', 'Камера заднего вида'],
    status: 'Новый'
  },
  {
    id: 6,
    brand: 'Audi',
    model: 'Q5',
    year: 2024,
    bodyType: 'suv',
    drive: 'full',
    power: 265,
    price: 4850000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '2.0 TFSI (265 л.с.), автомат, полный привод',
    features: ['Автомат', 'Полный привод', 'Кожаный салон'],
    status: 'Новый'
  },
  {
    id: 7,
    brand: 'BMW',
    model: '3 Series',
    year: 2024,
    bodyType: 'sedan',
    drive: 'rear',
    power: 184,
    price: 3750000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '2.0 (184 л.с.), автомат, задний привод',
    features: ['Автомат', 'Задний привод', 'Спортивный пакет'],
    status: 'Новый'
  },
  {
    id: 8,
    brand: 'Skoda',
    model: 'Octavia',
    year: 2024,
    bodyType: 'hatchback',
    drive: 'front',
    power: 150,
    price: 2200000,
    image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n',
    description: '1.4 TSI (150 л.с.), автомат, передний привод',
    features: ['Автомат', 'Климат-контроль', 'Мультимедия'],
    status: 'Новый'
  }
];

const modelsData = {
  toyota: [
    { name: 'Camry', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'RAV4', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Corolla', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Land Cruiser', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' }
  ],
  audi: [
    { name: 'A6', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'A4', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Q5', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Q7', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' }
  ],
  bmw: [
    { name: 'X5', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: '3 Series', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: '5 Series', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'X3', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' }
  ],
  skoda: [
    { name: 'Superb', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Octavia', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Kodiaq', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' },
    { name: 'Karoq', image: 'https://avatars.mds.yandex.net/get-autoru-vos/2051780/3f8b3e2d6f4f0c2b6e3b4f3b4f3b4f3b/1200x900n' }
  ]
};

// Экспорт данных для использования в других файлах
export { carDetailsData, carBrands, modelsByBrand, recommendedCars, allCars, carsData, modelsData };