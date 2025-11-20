export const translations = {
  uz: {
    // Navigation
    marketplace: 'Marketplace',
    inventory: 'Inventorim',
    cart: 'Savat',
    login: 'Kirish',
    logout: 'Chiqish',
    register: 'Ro\'yxatdan o\'tish',
    
    // Auth
    email: 'Email',
    password: 'Parol',
    username: 'Username',
    loginTitle: 'Tizimga kirish',
    registerTitle: 'Ro\'yxatdan o\'tish',
    steamLogin: 'Steam orqali kirish',
    or: 'Yoki',
    alreadyHaveAccount: 'Akkauntingiz bormi?',
    dontHaveAccount: 'Akkauntingiz yo\'qmi?',
    
    // Marketplace
    search: 'Qidirish...',
    allRarities: 'Barcha raritylar',
    minPrice: 'Min narx',
    maxPrice: 'Max narx',
    newest: 'Yangi',
    cheapest: 'Arzon',
    expensive: 'Qimmat',
    nameAZ: 'Nom (A-Z)',
    addToCart: 'Cartga',
    noSkinsFound: 'Skinlar topilmadi',
    
    // Cart
    cartTitle: 'Savat',
    emptyCart: 'Savat bo\'sh',
    clearAll: 'Hammasini o\'chirish',
    remove: 'O\'chirish',
    total: 'Jami',
    checkout: 'To\'lovga o\'tish',
    items: 'Mahsulotlar',
    
    // Inventory
    myInventory: 'Mening Inventorim',
    emptyInventory: 'Inventoringiz bo\'sh',
    listForSale: 'Sotuvga qo\'yish',
    unlist: 'Sotuvdan olib tashlash',
    onSale: 'Sotuvda',
    confirm: 'Tasdiqlash',
    cancel: 'Bekor qilish',
    price: 'Narx',
    
    // Common
    loading: 'Yuklanmoqda...',
    goToMarketplace: 'Marketplace\'ga o\'tish',
    currency: 'so\'m',
  },
  ru: {
    // Navigation
    marketplace: 'Маркетплейс',
    inventory: 'Мой инвентарь',
    cart: 'Корзина',
    login: 'Войти',
    logout: 'Выйти',
    register: 'Регистрация',
    
    // Auth
    email: 'Email',
    password: 'Пароль',
    username: 'Имя пользователя',
    loginTitle: 'Вход в систему',
    registerTitle: 'Регистрация',
    steamLogin: 'Войти через Steam',
    or: 'Или',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    
    // Marketplace
    search: 'Поиск...',
    allRarities: 'Все редкости',
    minPrice: 'Мин цена',
    maxPrice: 'Макс цена',
    newest: 'Новые',
    cheapest: 'Дешевые',
    expensive: 'Дорогие',
    nameAZ: 'Имя (A-Z)',
    addToCart: 'В корзину',
    noSkinsFound: 'Скины не найдены',
    
    // Cart
    cartTitle: 'Корзина',
    emptyCart: 'Корзина пуста',
    clearAll: 'Очистить все',
    remove: 'Удалить',
    total: 'Итого',
    checkout: 'Оформить заказ',
    items: 'Товары',
    
    // Inventory
    myInventory: 'Мой инвентарь',
    emptyInventory: 'Ваш инвентарь пуст',
    listForSale: 'Выставить на продажу',
    unlist: 'Снять с продажи',
    onSale: 'В продаже',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    price: 'Цена',
    
    // Common
    loading: 'Загрузка...',
    goToMarketplace: 'Перейти в маркетплейс',
    currency: 'сум',
  },
  en: {
    // Navigation
    marketplace: 'Marketplace',
    inventory: 'My Inventory',
    cart: 'Cart',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    
    // Auth
    email: 'Email',
    password: 'Password',
    username: 'Username',
    loginTitle: 'Login',
    registerTitle: 'Register',
    steamLogin: 'Login with Steam',
    or: 'Or',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    
    // Marketplace
    search: 'Search...',
    allRarities: 'All rarities',
    minPrice: 'Min price',
    maxPrice: 'Max price',
    newest: 'Newest',
    cheapest: 'Cheapest',
    expensive: 'Most expensive',
    nameAZ: 'Name (A-Z)',
    addToCart: 'Add to cart',
    noSkinsFound: 'No skins found',
    
    // Cart
    cartTitle: 'Cart',
    emptyCart: 'Cart is empty',
    clearAll: 'Clear all',
    remove: 'Remove',
    total: 'Total',
    checkout: 'Checkout',
    items: 'Items',
    
    // Inventory
    myInventory: 'My Inventory',
    emptyInventory: 'Your inventory is empty',
    listForSale: 'List for sale',
    unlist: 'Unlist',
    onSale: 'On sale',
    confirm: 'Confirm',
    cancel: 'Cancel',
    price: 'Price',
    
    // Common
    loading: 'Loading...',
    goToMarketplace: 'Go to marketplace',
    currency: 'sum',
  },
};

export type TranslationKey = keyof typeof translations.uz;
