// localStorage management for Mechanico platform

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'customer' | 'provider' | 'admin';
  phone: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  duration: number;
  icon: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  vehicleId: string;
  serviceId: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  providerId?: string;
  invoiceNumber?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  relatedId?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  skills: string[];
  status: 'active' | 'inactive' | 'on-leave';
  performance: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  location: string;
}

export const STORAGE_KEYS = {
  USERS: 'mechanico_users',
  VEHICLES: 'mechanico_vehicles',
  SERVICES: 'mechanico_services',
  BOOKINGS: 'mechanico_bookings',
  REVIEWS: 'mechanico_reviews',
  CURRENT_USER: 'mechanico_current_user',
  INVOICES: 'mechanico_invoices',
  EXPENSES: 'mechanico_expenses',
  TRANSACTIONS: 'mechanico_transactions',
  EMPLOYEES: 'mechanico_employees',
  INVENTORY: 'mechanico_inventory',
};

// Initialize dummy data
export const initializeDummyData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users: User[] = [
      {
        id: '1',
        email: 'admin@mechanico.ir',
        password: 'admin123',
        fullName: 'مدیر سیستم',
        role: 'admin',
        phone: '09121234567',
        isVerified: true,
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'mechanic@mechanico.ir',
        password: 'mechanic123',
        fullName: 'علی محمدی',
        role: 'provider',
        phone: '09127654321',
        isVerified: true,
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'customer@mechanico.ir',
        password: 'customer123',
        fullName: 'زهرا احمدی',
        role: 'customer',
        phone: '09139876543',
        isVerified: true,
        isApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'mechanic2@mechanico.ir',
        password: 'mechanic123',
        fullName: 'حسین رضایی',
        role: 'provider',
        phone: '09151234567',
        isVerified: true,
        isApproved: false,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    const services: Service[] = [
      {
        id: '1',
        name: 'تعویض روغن موتور',
        category: 'mechanical',
        description: 'تعویض روغن و فیلتر موتور با قطعات اصلی',
        basePrice: 850000,
        duration: 45,
        icon: '🔧',
      },
      {
        id: '2',
        name: 'بالانس و رگلاژ چرخ',
        category: 'tire',
        description: 'بالانس و رگلاژ چهار چرخ خودرو',
        basePrice: 450000,
        duration: 30,
        icon: '⚙️',
      },
      {
        id: '3',
        name: 'سرویس کامل خودرو',
        category: 'maintenance',
        description: 'سرویس دوره‌ای شامل تعویض روغن، فیلترها و بررسی کامل',
        basePrice: 1500000,
        duration: 120,
        icon: '🛠️',
      },
      {
        id: '4',
        name: 'شست‌وشوی کامل',
        category: 'wash',
        description: 'شست‌وشوی داخل و خارج با واکس و پولیش',
        basePrice: 350000,
        duration: 60,
        icon: '🧼',
      },
      {
        id: '5',
        name: 'تعمیر سیستم ترمز',
        category: 'brake',
        description: 'بررسی و تعویض لنت و دیسک ترمز',
        basePrice: 1200000,
        duration: 90,
        icon: '🛑',
      },
      {
        id: '6',
        name: 'باتری‌سازی و شارژ',
        category: 'electrical',
        description: 'تست و تعویض باتری خودرو',
        basePrice: 650000,
        duration: 30,
        icon: '🔋',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }

  if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
    const vehicles: Vehicle[] = [
      {
        id: '1',
        ownerId: '3',
        make: 'ایران خودرو',
        model: 'پژو ۲۰۶',
        year: 1399,
        licensePlate: '۱۲ ب ۳۴۵ ایران ۶۷',
        color: 'سفید',
        mileage: 45000,
      },
      {
        id: '2',
        ownerId: '3',
        make: 'سایپا',
        model: 'تیبا',
        year: 1400,
        licensePlate: '۲۳ د ۴۵۶ ایران ۸۹',
        color: 'نقره‌ای',
        mileage: 28000,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    const now = new Date();
    const bookings: Booking[] = [
      {
        id: '1',
        customerId: '3',
        providerId: '2',
        vehicleId: '1',
        serviceId: '1',
        scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        price: 850000,
        notes: 'لطفاً از روغن موبیل ۱ استفاده شود',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        customerId: '3',
        providerId: '2',
        vehicleId: '1',
        serviceId: '3',
        scheduledAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        price: 1500000,
        createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        customerId: '3',
        providerId: '2',
        vehicleId: '2',
        serviceId: '4',
        scheduledAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        price: 350000,
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        customerId: '3',
        providerId: '4',
        vehicleId: '1',
        serviceId: '2',
        scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        price: 450000,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const reviews: Review[] = [
      {
        id: '1',
        bookingId: '2',
        customerId: '3',
        providerId: '2',
        rating: 5,
        comment: 'سرویس عالی و دقیق. کاملاً راضی هستم.',
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        bookingId: '3',
        customerId: '3',
        providerId: '2',
        rating: 4,
        comment: 'خوب بود اما زمان انتظار کمی طولانی شد.',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    const invoices: Invoice[] = [
      {
        id: '1',
        bookingId: '2',
        customerId: '3',
        providerId: '2',
        invoiceNumber: 'INV-2024-001',
        date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { id: '1', description: 'سرویس کامل خودرو', quantity: 1, unitPrice: 1500000, total: 1500000 },
          { id: '2', description: 'روغن موبیل ۱', quantity: 4, unitPrice: 150000, total: 600000 },
        ],
        subtotal: 2100000,
        tax: 189000,
        discount: 0,
        total: 2289000,
        status: 'paid',
        createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        bookingId: '1',
        customerId: '3',
        providerId: '2',
        invoiceNumber: 'INV-2024-002',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          { id: '1', description: 'تعویض روغن موتور', quantity: 1, unitPrice: 850000, total: 850000 },
        ],
        subtotal: 850000,
        tax: 76500,
        discount: 50000,
        total: 876500,
        status: 'sent',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    const expenses: Expense[] = [
      {
        id: '1',
        category: 'قطعات',
        description: 'خرید روغن موتور - ۱۰ عدد',
        amount: 1200000,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'نقدی',
        providerId: '2',
        invoiceNumber: 'EXP-001',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        category: 'اجاره',
        description: 'اجاره ماهانه تعمیرگاه',
        amount: 25000000,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'چک',
        invoiceNumber: 'EXP-002',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        category: 'برق و آب',
        description: 'قبض برق و آب',
        amount: 3500000,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'کارت بانکی',
        invoiceNumber: 'EXP-003',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    const employees: Employee[] = [
      {
        id: '1',
        userId: '2',
        position: 'مکانیک ارشد',
        department: 'فنی',
        salary: 45000000,
        hireDate: '2022-03-15',
        skills: ['تعمیرات موتور', 'برق خودرو', 'سیستم تعلیق'],
        status: 'active',
        performance: 95,
      },
      {
        id: '2',
        userId: '4',
        position: 'مکانیک جونیور',
        department: 'فنی',
        salary: 28000000,
        hireDate: '2023-09-01',
        skills: ['تعویض روغن', 'بالانس چرخ', 'شست‌وشو'],
        status: 'active',
        performance: 78,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    const inventory: InventoryItem[] = [
      {
        id: '1',
        name: 'روغن موتور ۵W-۳۰',
        category: 'روغنیات',
        quantity: 45,
        minQuantity: 20,
        unitPrice: 180000,
        supplier: 'شرکت پخش روغن پارس',
        lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'قفسه A-۱',
      },
      {
        id: '2',
        name: 'فیلتر روغن',
        category: 'فیلتر',
        quantity: 15,
        minQuantity: 25,
        unitPrice: 95000,
        supplier: 'قطعات یدکی مهر',
        lastRestocked: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'قفسه B-۳',
      },
      {
        id: '3',
        name: 'لنت ترمز جلو',
        category: 'ترمز',
        quantity: 32,
        minQuantity: 15,
        unitPrice: 450000,
        supplier: 'پخش قطعات آرین',
        lastRestocked: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'قفسه C-۲',
      },
      {
        id: '4',
        name: 'باتری ۶۰ آمپر',
        category: 'برقی',
        quantity: 8,
        minQuantity: 10,
        unitPrice: 2800000,
        supplier: 'شرکت باتری سازی صبا',
        lastRestocked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'انبار اصلی',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }
};

// Storage functions
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getVehicles = (): Vehicle[] => {
  const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
  return data ? JSON.parse(data) : [];
};

export const saveVehicles = (vehicles: Vehicle[]) => {
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
};

export const getServices = (): Service[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return data ? JSON.parse(data) : [];
};

export const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

export const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const getReviews = (): Review[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  return data ? JSON.parse(data) : [];
};

export const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Auth functions
export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

export const logout = () => {
  setCurrentUser(null);
};

export const register = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// New storage functions
export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

export const saveInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return data ? JSON.parse(data) : [];
};

export const saveEmployees = (employees: Employee[]) => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const getInventory = (): InventoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  return data ? JSON.parse(data) : [];
};

export const saveInventory = (inventory: InventoryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

export const resetStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initializeDummyData();
};