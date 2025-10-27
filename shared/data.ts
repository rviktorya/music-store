// shared/data.ts

import type { Address, AdminPermission, Category, CategoryKey, Order, Product, Review, User, UserRole, UUID } from "@shared/api";

function uid(prefix: string = "id"): UUID {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const categories: Category[] = [
  { key: "guitars", title: "Гитары", icon: "guitar" },
  { key: "keyboards", title: "Клавишные", icon: "piano" },
  { key: "drums", title: "Ударные", icon: "drums" },
  { key: "brass", title: "Духовые", icon: "trumpet" },
  { key: "strings", title: "Смычковые", icon: "violin" },
  { key: "studio", title: "Студия", icon: "mic" },
  { key: "dj", title: "DJ", icon: "disc" },
  { key: "accessories", title: "Аксессуары", icon: "cable" },
];

// Функция для генерации случайных цен в диапазоне
const randomPrice = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
const randomRating = () => Number((Math.random() * 1.5 + 3.5).toFixed(1));
const randomReviews = () => Math.floor(Math.random() * 300);
const randomStock = () => Math.floor(Math.random() * 50);

export const products: Product[] = [
  // Гитары (50 товаров)
  {
    id: uid("prd"),
    name: "Fender Stratocaster",
    brand: "Fender",
    category: "guitars",
    price: 89990,
    currency: "RUB",
    rating: 4.8,
    reviews: 124,
    image: "/images/Fender Stratocaster.webp",
    description: "Легендарная электрогитара для рока, блюза и не только.",
    inStock: 12,
  },
  {
    id: uid("prd"),
    name: "Gibson Les Paul Standard",
    brand: "Gibson",
    category: "guitars",
    price: 129990,
    currency: "RUB",
    rating: 4.9,
    reviews: 89,
    image: "/images/guitars/Gibson Les Paul Standard.webp",
    description: "Классическая электрогитара с хамбакерами.",
    inStock: 8,
  },
  {
    id: uid("prd"),
    name: "Ibanez RG550",
    brand: "Ibanez",
    category: "guitars",
    price: 75990,
    currency: "RUB",
    rating: 4.7,
    reviews: 67,
    image: "/images/guitars/Ibanez RG550.webp",
    description: "Электрогитара для металла и рока.",
    inStock: 15,
  },
  {
    id: uid("prd"),
    name: "Yamaha C40",
    brand: "Yamaha",
    category: "guitars",
    price: 15990,
    currency: "RUB",
    rating: 4.5,
    reviews: 203,
    image: "/images/guitars/Yamaha C40.webp",
    description: "Качественная классическая гитара для начинающих.",
    inStock: 25,
  },
  {
    id: uid("prd"),
    name: "Taylor 314ce",
    brand: "Taylor",
    category: "guitars",
    price: 145990,
    currency: "RUB",
    rating: 4.9,
    reviews: 45,
    image: "/images/guitars/Taylor 314ce.webp",
    description: "Акустическая гитара премиум-класса.",
    inStock: 6,
  },
  {
    id: uid("prd"),
    name: "Fender Telecaster",
    brand: "Fender",
    category: "guitars",
    price: 82990,
    currency: "RUB",
    rating: 4.7,
    reviews: 98,
    image: "/images/guitars/Fender Telecaster.webp",
    description: "Универсальная электрогитара с чистым звучанием.",
    inStock: 10,
  },
  {
    id: uid("prd"),
    name: "Epiphone SG Standard",
    brand: "Epiphone",
    category: "guitars",
    price: 45990,
    currency: "RUB",
    rating: 4.4,
    reviews: 156,
    image: "/images/guitars/Epiphone SG Standard.webp",
    description: "Доступная версия классической модели SG.",
    inStock: 18,
  },
  {
    id: uid("prd"),
    name: "Cort X100",
    brand: "Cort",
    category: "guitars",
    price: 32990,
    currency: "RUB",
    rating: 4.3,
    reviews: 87,
    image: "/images/guitars/Cort X100.webp",
    description: "Бюджетная электрогитара с отличным звуком.",
    inStock: 22,
  },
  {
    id: uid("prd"),
    name: "Jackson Dinky",
    brand: "Jackson",
    category: "guitars",
    price: 68990,
    currency: "RUB",
    rating: 4.6,
    reviews: 54,
    image: "/images/guitars/Jackson Dinky.webp",
    description: "Скоростная гитара для хард-рока и метала.",
    inStock: 9,
  },
  {
    id: uid("prd"),
    name: "PRS SE Custom 24",
    brand: "PRS",
    category: "guitars",
    price: 89990,
    currency: "RUB",
    rating: 4.8,
    reviews: 76,
    image: "/images/guitars/prs-se-custom24.webp",
    description: "Универсальная гитара с превосходной отделкой.",
    inStock: 11,
  },

  // Клавишные (45 товаров)
  {
    id: uid("prd"),
    name: "Yamaha P-125",
    brand: "Yamaha",
    category: "keyboards",
    price: 63990,
    currency: "RUB",
    rating: 4.7,
    reviews: 85,
    image: "/images/Yamaha P-125.webp",
    description: "Компактное цифровое пианино с натуральной клавиатурой.",
    inStock: 8,
  },
  {
    id: uid("prd"),
    name: "Roland FP-30X",
    brand: "Roland",
    category: "keyboards",
    price: 78990,
    currency: "RUB",
    rating: 4.8,
    reviews: 63,
    image: "/images/keyboards/roland-fp30x.webp",
    description: "Цифровое пианино с улучшенной механикой.",
    inStock: 7,
  },
  {
    id: uid("prd"),
    name: "Korg B2",
    brand: "Korg",
    category: "keyboards",
    price: 54990,
    currency: "RUB",
    rating: 4.6,
    reviews: 92,
    image: "/images/keyboards/korg-b2.webp",
    description: "Домашнее цифровое пианино начального уровня.",
    inStock: 12,
  },
  {
    id: uid("prd"),
    name: "Casio CDP-S150",
    brand: "Casio",
    category: "keyboards",
    price: 42990,
    currency: "RUB",
    rating: 4.4,
    reviews: 118,
    image: "/images/keyboards/Casio CDP-S150.webp",
    description: "Ультратонкое цифровое пианино.",
    inStock: 15,
  },
  {
    id: uid("prd"),
    name: "Nord Stage 3",
    brand: "Nord",
    category: "keyboards",
    price: 289990,
    currency: "RUB",
    rating: 4.9,
    reviews: 34,
    image: "/images/keyboards/Nord Stage 3.webp",
    description: "Профессиональная клавишная рабочая станция.",
    inStock: 3,
  },

  // Ударные (40 товаров)
  {
    id: uid("prd"),
    name: "Roland TD-1DMK",
    brand: "Roland",
    category: "drums",
    price: 114990,
    currency: "RUB",
    rating: 4.6,
    reviews: 42,
    image: "/images/Roland TD-1DMK.webp",
    description: "Электронная ударная установка для дома и студии.",
    inStock: 5,
  },
  {
    id: uid("prd"),
    name: "Yamaha DTX402K",
    brand: "Yamaha",
    category: "drums",
    price: 59990,
    currency: "RUB",
    rating: 4.5,
    reviews: 78,
    image: "/images/drums/Yamaha DTX402K.webp",
    description: "Электронная ударная установка начального уровня.",
    inStock: 9,
  },
  {
    id: uid("prd"),
    name: "Pearl Export",
    brand: "Pearl",
    category: "drums",
    price: 89990,
    currency: "RUB",
    rating: 4.7,
    reviews: 56,
    image: "/images/drums/Pearl Export.webp",
    description: "Акустическая ударная установка для репетиций.",
    inStock: 6,
  },

  // Духовые (35 товаров)
  {
    id: uid("prd"),
    name: "Yamaha YTR-2330",
    brand: "Yamaha",
    category: "brass",
    price: 45990,
    currency: "RUB",
    rating: 4.5,
    reviews: 23,
    image: "/images/brass/Yamaha YTR-2330.webp",
    description: "Труба для начинающих и студентов.",
    inStock: 8,
  },
  {
    id: uid("prd"),
    name: "Selmer SAS280",
    brand: "Selmer",
    category: "brass",
    price: 189990,
    currency: "RUB",
    rating: 4.9,
    reviews: 15,
    image: "/images/brass/Selmer SAS280.webp",
    description: "Профессиональный альт-саксофон.",
    inStock: 2,
  },

  // Смычковые (30 товаров)
  {
    id: uid("prd"),
    name: "Yamaha V5SG",
    brand: "Yamaha",
    category: "strings",
    price: 32990,
    currency: "RUB",
    rating: 4.4,
    reviews: 31,
    image: "/images/strings/Yamaha V5SG.webp",
    description: "Скрипка для начинающих с полным комплектом.",
    inStock: 11,
  },
  {
    id: uid("prd"),
    name: "Stentor Student II",
    brand: "Stentor",
    category: "strings",
    price: 28990,
    currency: "RUB",
    rating: 4.3,
    reviews: 45,
    image: "/images/strings/Stentor Student II.webp",
    description: "Качественная студенческая скрипка.",
    inStock: 14,
  },

  // Студийное оборудование (50 товаров)
  {
    id: uid("prd"),
    name: "Shure SM7B",
    brand: "Shure",
    category: "studio",
    price: 39990,
    currency: "RUB",
    rating: 4.9,
    reviews: 210,
    image: "/images/Shure SM7B.webp",
    description: "Студийный динамический микрофон для подкастов и вокала.",
    inStock: 20,
  },
  {
    id: uid("prd"),
    name: "Focusrite Scarlett 2i2",
    brand: "Focusrite",
    category: "studio",
    price: 15990,
    currency: "RUB",
    rating: 4.8,
    reviews: 342,
    image: "/images/studio/Focusrite Scarlett 2i2.webp",
    description: "Популярный аудиоинтерфейс для домашней студии.",
    inStock: 25,
  },
  {
    id: uid("prd"),
    name: "Rode NT1-A",
    brand: "Rode",
    category: "studio",
    price: 18990,
    currency: "RUB",
    rating: 4.7,
    reviews: 189,
    image: "/images/studio/Rode NT1-A.webp",
    description: "Конденсаторный микрофон для студийной записи.",
    inStock: 18,
  },

  // DJ оборудование (30 товаров)
  {
    id: uid("prd"),
    name: "Native Instruments Traktor Kontrol S4",
    brand: "NI",
    category: "dj",
    price: 89990,
    currency: "RUB",
    rating: 4.5,
    reviews: 60,
    image: "/images/Native Instruments Traktor Kontrol S4.webp",
    description: "Профессиональный DJ-контроллер для выступлений и студии.",
    inStock: 7,
  },
  {
    id: uid("prd"),
    name: "Pioneer DJ DDJ-400",
    brand: "Pioneer",
    category: "dj",
    price: 45990,
    currency: "RUB",
    rating: 4.6,
    reviews: 156,
    image: "/images/dj/Pioneer DJ DDJ-400.webp",
    description: "DJ-контроллер для начинающих с Rekordbox.",
    inStock: 12,
  },

  // Аксессуары (40 товаров)
  {
    id: uid("prd"),
    name: "D'Addario EXL110",
    brand: "D'Addario",
    category: "accessories",
    price: 690,
    currency: "RUB",
    rating: 4.4,
    reviews: 340,
    image: "/images/D'Addario EXL110.webp",
    description: "Комплект струн для электрогитары, 10-46.",
    inStock: 120,
  },
  {
    id: uid("prd"),
    name: "Ernie Ball Regular Slinky",
    brand: "Ernie Ball",
    category: "accessories",
    price: 790,
    currency: "RUB",
    rating: 4.5,
    reviews: 287,
    image: "/images/accessories/Ernie Ball Regular Slinky.webp",
    description: "Популярные струны для электрогитары.",
    inStock: 95,
  },
  
  // Дополнительные гитары
  {
    id: uid("prd"),
    name: "Fender American Professional II",
    brand: "Fender",
    category: "guitars",
    price: 149990,
    currency: "RUB",
    rating: 4.9,
    reviews: 47,
    image: "/images/guitars/Fender American Professional II.webp",
    description: "Профессиональная серия с улучшенной электроникой.",
    inStock: 5,
  },
  {
    id: uid("prd"),
    name: "Gibson SG Standard",
    brand: "Gibson",
    category: "guitars",
    price: 119990,
    currency: "RUB",
    rating: 4.8,
    reviews: 38,
    image: "/images/guitars/Gibson SG Standard.webp",
    description: "Классическая модель с характерным дизайном.",
    inStock: 7,
  },
  //

  // Генерация оставшихся товаров
  ...Array.from({ length: 200 }, (_, i) => {
    const categoriesList: CategoryKey[] = ["guitars", "keyboards", "drums", "brass", "strings", "studio", "dj", "accessories"];
    const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
    
    const brands: Record<CategoryKey, string[]> = {
      guitars: ["Fender", "Gibson", "Ibanez", "Jackson", "ESP", "PRS", "Yamaha", "Cort", "Epiphone", "Schecter"],
      keyboards: ["Yamaha", "Korg", "Roland", "Casio", "Nord", "Kawai", "M-Audio", "Arturia"],
      drums: ["Roland", "Yamaha", "Pearl", "Tama", "DW", "Mapex", "Gretsch", "Ludwig"],
      brass: ["Yamaha", "Bach", "Conn", "King", "Jupiter", "Schilke", "Getzen", "Besson"],
      strings: ["Yamaha", "Stentor", "Cremona", "Knilling", "Scott Cao", "Cecilio"],
      studio: ["Shure", "AKG", "Neumann", "Sennheiser", "Audio-Technica", "Rode", "Focusrite", "PreSonus"],
      dj: ["Pioneer", "Numark", "Denon", "Reloop", "Allen & Heath", "Rane", "Technics"],
      accessories: ["D'Addario", "Ernie Ball", "Elixir", "Roland", "Korg", "Fender", "Gibson", "Planet Waves"]
    };

    const models: Record<CategoryKey, string[]> = {
      guitars: ["Standard", "Custom", "Pro", "Deluxe", "Vintage", "Modern", "Classic"],
      keyboards: ["Stage", "Grand", "Digital", "Workstation", "Portable", "Synth"],
      drums: ["Acoustic", "Electronic", "Hybrid", "Compact", "Professional"],
      brass: ["Student", "Professional", "Artist", "Custom"],
      strings: ["Student", "Intermediate", "Professional", "Master"],
      studio: ["Studio", "Live", "Broadcast", "Recording"],
      dj: ["Controller", "Mixer", "Turntable", "CDJ"],
      accessories: ["Strings", "Cables", "Stands", "Cases", "Picks"]
    };

    const brand = brands[category][Math.floor(Math.random() * brands[category].length)];
    const model = models[category][Math.floor(Math.random() * models[category].length)];
    
    return {
      id: uid("prd"),
      name: `${brand} ${model}`,
      brand,
      category,
      price: randomPrice(500, 200000),
      currency: "RUB" as const,
      rating: randomRating(),
      reviews: randomReviews(),
      image: `/images/${category}/${brand.toLowerCase()}-${model.toLowerCase().replace(' ', '-')}.webp`,
      description: `Качественный ${category === 'guitars' ? 'инструмент' : 'продукт'} от ${brand}.`,
      inStock: randomStock(),
    };
  })
];

// Используем те же ID, что и в основном массиве products
export const popularProducts: Product[] = [
  // Используем существующие товары из основного массива
  products[0],  // Fender Stratocaster
  products[6],
  products[10], // Yamaha P-125
  products[14], // Roland FP-30X
  products[15],
  products[23],
  products[21], // Focusrite Scarlett 2i2
  products[24], // Native Instruments Traktor Kontrol S4
].filter(Boolean); // Фильтруем undefined на случай если индекс не существует

// Права доступа для разных ролей
export const ROLE_PERMISSIONS: Record<UserRole, AdminPermission[]> = {
  admin: [
    'users:read', 'users:write', 'users:delete',
    'products:read', 'products:write', 'products:delete',
    'orders:read', 'orders:write', 'orders:delete',
    'reviews:read', 'reviews:write', 'reviews:delete',
    'analytics:read', 'system:config'
  ],
  manager: [
    'users:read', 
    'products:read', 'products:write',
    'orders:read', 'orders:write',
    'reviews:read', 'reviews:write',
    'analytics:read'
  ],
  customer: [] // У покупателей нет прав администрирования
};

// Обновите пользователей с дополнительными полями
export const users: User[] = [
  {
    id: uid("usr"),
    name: "Алексей Петров",
    email: "admin@musemart.ru",
<<<<<<< HEAD
    password: "password123", // Добавьте пароль
=======
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    role: "admin",
    createdAt: new Date().toISOString(),
    status: "active",
    department: "IT",
    position: "Главный администратор",
    permissions: ROLE_PERMISSIONS.admin
  },
  {
    id: uid("usr"),
    name: "Марина Сидорова",
    email: "marina@musemart.ru",
<<<<<<< HEAD
    password: "manager123", // Добавьте пароль
=======
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    role: "manager",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: "active",
    department: "Отдел продаж",
    position: "Старший менеджер",
    permissions: ROLE_PERMISSIONS.manager
  },
  {
    id: uid("usr"),
    name: "Иван Козлов",
<<<<<<< HEAD
    email: "ivan@example2.com",
    password: "user123", // Добавьте пароль
    role: "customer",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "active",
=======
    email: "ivan@example_2.com",
    role: "customer",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "active",

>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
  },
  {
    id: uid("usr"),
    name: "Петр Иванов",
    email: "petr@example.com",
<<<<<<< HEAD
    password: "user123", // Добавьте пароль
=======
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    role: "customer",
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    status: "blocked",
  },
<<<<<<< HEAD
  {
    id: uid("usr"),
    name: "Антон Сидоров",
    email: "ant@gmail.com",
    password: "1234567890", // Добавьте пароль
    role: "customer",
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    status: "active",
  },
=======
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
];

export function getProductsByCategory(key?: CategoryKey): Product[] {
  if (!key) return products;
  return products.filter((p) => p.category === key);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUserDraft(): User {
  return {
    id: uid("usr"),
    name: "",
    email: "",
    role: "customer",
    createdAt: new Date().toISOString(),
    status: "active",
  };
}

// Моковые адреса
export const addresses: Address[] = [
  {
    id: uid("addr"),
<<<<<<< HEAD
    userId: users[4].id, // Антон
    title: "Дом",
    fullName: "Антон Сидоров",
=======
    userId: users[2].id, // Петр
    title: "Дом",
    fullName: "Петр Иванов",
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    street: "ул. Ленина, д. 123, кв. 45",
    city: "Москва",
    postalCode: "123456",
    country: "Россия",
    phone: "+7 (999) 123-45-67",
    isDefault: true,
  },
  {
    id: uid("addr"),
<<<<<<< HEAD
    userId: users[4].id,
    title: "Работа",
    fullName: "Антон Сидоров",
=======
    userId: users[2].id,
    title: "Работа",
    fullName: "Петр Иванов",
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    street: "ул. Пушкина, д. 67, офис 12",
    city: "Москва",
    postalCode: "123457",
    country: "Россия",
    phone: "+7 (999) 123-45-68",
    isDefault: false,
  },
];

// Моковые заказы
export const orders: Order[] = [
  {
    id: uid("ord"),
<<<<<<< HEAD
    userId: users[4].id, // Петр
=======
    userId: users[2].id, // Петр
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    orderNumber: "ORD-001",
    items: [
      {
        id: uid("item"),
        productId: products[0].id,
        productName: products[0].name,
        quantity: 1,
        price: products[0].price,
        image: products[0].image,
      },
      {
        id: uid("item"),
        productId: products[3].id,
        productName: products[3].name,
        quantity: 2,
        price: products[3].price,
        image: products[3].image,
      },
    ],
    totalAmount: products[0].price + products[3].price * 2,
    status: "delivered",
    paymentMethod: "card",
    paymentStatus: "paid",
    shippingAddress: addresses[0],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedDelivery: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: uid("ord"),
<<<<<<< HEAD
    userId: users[4].id,
=======
    userId: users[2].id,
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    orderNumber: "ORD-002",
    items: [
      {
        id: uid("item"),
        productId: products[1].id,
        productName: products[1].name,
        quantity: 1,
        price: products[1].price,
        image: products[1].image,
      },
    ],
    totalAmount: products[1].price,
    status: "processing",
    paymentMethod: "online",
    paymentStatus: "paid",
    shippingAddress: addresses[1],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
];

// Моковые отзывы
export const reviews: Review[] = [
  {
    id: uid("rev"),
<<<<<<< HEAD
    userId: users[4].id,
=======
    userId: users[2].id,
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    productId: products[0].id,
    productName: products[0].name,
    rating: 5,
    comment: "Отличная гитара! Качество звука превосходное.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isVerified: true,
  },
  {
    id: uid("rev"),
<<<<<<< HEAD
    userId: users[4].id,
=======
    userId: users[2].id,
>>>>>>> c50f7566cd8b979c67bb43c2356529a4179cef19
    productId: products[3].id,
    productName: products[3].name,
    rating: 4,
    comment: "Хороший микрофон, но немного тяжеловат.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isVerified: true,
  },
];

// Обновим пользователей с дополнительными данными
export const enhancedUsers: User[] = users.map(user => {
  const userOrders = orders.filter(order => order.userId === user.id);
  const userReviews = reviews.filter(review => review.userId === user.id);
  const userAddresses = addresses.filter(address => address.userId === user.id);
  
  return {
    ...user,
    addresses: userAddresses,
    orders: userOrders,
    reviews: userReviews,
    totalOrders: userOrders.length,
    totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    lastLogin: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    phone: user.id === users[2].id ? "+7 (999) 123-45-67" : undefined,
  };
});