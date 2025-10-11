import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type Booking,
  type Employee,
  type Expense,
  type InventoryItem,
  type Invoice,
  type Review,
  type Service,
  type Transaction,
  type User,
  type Vehicle,
  getBookings,
  getEmployees,
  getExpenses,
  getInventory,
  getInvoices,
  getReviews,
  getServices,
  getTransactions,
  getUsers,
  getVehicles,
  initializeDummyData,
  resetStorage,
  saveBookings,
  saveEmployees,
  saveExpenses,
  saveInventory,
  saveInvoices,
  saveUsers,
  saveVehicles,
} from "@/lib/storage";

type BookingPayload = Omit<Booking, "id" | "createdAt"> & { id?: string };
type InvoicePayload = Omit<Invoice, "id" | "createdAt"> & { id?: string };
type ExpensePayload = Omit<Expense, "id" | "createdAt">;
type EmployeePayload = Omit<Employee, "id"> & { id?: string };
type InventoryPayload = Omit<InventoryItem, "id"> & { id?: string };
type VehiclePayload = Omit<Vehicle, "id"> & { id?: string };

type DataContextValue = {
  bookings: Booking[];
  services: Service[];
  users: User[];
  vehicles: Vehicle[];
  invoices: Invoice[];
  expenses: Expense[];
  employees: Employee[];
  inventory: InventoryItem[];
  reviews: Review[];
  transactions: Transaction[];
  isReady: boolean;
  addBooking: (payload: BookingPayload) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  deleteBooking: (bookingId: string) => void;
  addInvoice: (payload: InvoicePayload) => Invoice;
  updateInvoiceStatus: (invoiceId: string, status: Invoice["status"]) => void;
  addExpense: (payload: ExpensePayload) => Expense;
  addEmployee: (payload: EmployeePayload) => Employee;
  updateEmployeeStatus: (employeeId: string, status: Employee["status"]) => void;
  addInventoryItem: (payload: InventoryPayload) => InventoryItem;
  adjustInventoryQuantity: (itemId: string, quantity: number) => void;
  addVehicle: (payload: VehiclePayload) => Vehicle;
  updateVehicle: (vehicleId: string, payload: Partial<Vehicle>) => void;
  deleteVehicle: (vehicleId: string) => void;
  updateUserApproval: (userId: string, approved: boolean) => void;
  resetDemoData: () => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

const createPersistedSetter = <T,>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  saveFn: (value: T) => void,
) => {
  return (updater: React.SetStateAction<T>) => {
    setState((previous) => {
      const next = typeof updater === "function" ? (updater as (value: T) => T)(previous) : updater;
      saveFn(next);
      return next;
    });
  };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isReady, setIsReady] = useState(false);

  const loadAllData = () => {
    setUsers(getUsers());
    setVehicles(getVehicles());
    setServices(getServices());
    setBookings(getBookings());
    setInvoices(getInvoices());
    setExpenses(getExpenses());
    setEmployees(getEmployees());
    setInventory(getInventory());
    setReviews(getReviews());
    setTransactions(getTransactions());
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    initializeDummyData();
    loadAllData();
    setIsReady(true);

    const handleStorage = (event: StorageEvent) => {
      // A full reload is simpler than checking which key changed
      loadAllData();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const persistBookings = useMemo(() => createPersistedSetter(setBookings, saveBookings), []);
  const persistUsers = useMemo(() => createPersistedSetter(setUsers, saveUsers), []);
  const persistInvoices = useMemo(() => createPersistedSetter(setInvoices, saveInvoices), []);
  const persistExpenses = useMemo(() => createPersistedSetter(setExpenses, saveExpenses), []);
  const persistEmployees = useMemo(() => createPersistedSetter(setEmployees, saveEmployees), []);
  const persistInventory = useMemo(() => createPersistedSetter(setInventory, saveInventory), []);
  const persistVehicles = useMemo(() => createPersistedSetter(setVehicles, saveVehicles), []);

  const value = useMemo<DataContextValue>(() => {
    const addBooking = (payload: BookingPayload): Booking => {
      const newBooking: Booking = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persistBookings((previous) => [...previous, newBooking]);
      return newBooking;
    };

    const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
      persistBookings((previous) =>
        previous.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
      );
    };

    const deleteBooking = (bookingId: string) => {
      persistBookings((previous) => previous.filter((booking) => booking.id !== bookingId));
    };

    const addInvoice = (payload: InvoicePayload): Invoice => {
      const newInvoice: Invoice = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
        createdAt: payload.createdAt ?? new Date().toISOString(),
      };
      persistInvoices((previous) => [...previous, newInvoice]);
      return newInvoice;
    };

    const updateInvoiceStatus = (invoiceId: string, status: Invoice["status"]) => {
      persistInvoices((previous) =>
        previous.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status } : invoice)),
      );
    };

    const addExpense = (payload: ExpensePayload): Expense => {
      const newExpense: Expense = {
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persistExpenses((previous) => [...previous, newExpense]);
      return newExpense;
    };

    const addEmployee = (payload: EmployeePayload): Employee => {
      const newEmployee: Employee = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistEmployees((previous) => [...previous, newEmployee]);
      return newEmployee;
    };

    const updateEmployeeStatus = (employeeId: string, status: Employee["status"]) => {
      persistEmployees((previous) =>
        previous.map((employee) =>
          employee.id === employeeId ? { ...employee, status } : employee,
        ),
      );
    };

    const addInventoryItem = (payload: InventoryPayload): InventoryItem => {
      const newItem: InventoryItem = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistInventory((previous) => [...previous, newItem]);
      return newItem;
    };

    const adjustInventoryQuantity = (itemId: string, quantity: number) => {
      persistInventory((previous) =>
        previous.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + quantity),
                lastRestocked: quantity > 0 ? new Date().toISOString() : item.lastRestocked,
              }
            : item,
        ),
      );
    };

    const addVehicle = (payload: VehiclePayload): Vehicle => {
      const newVehicle: Vehicle = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistVehicles((previous) => [...previous, newVehicle]);
      return newVehicle;
    };

    const updateVehicle = (vehicleId: string, payload: Partial<Vehicle>) => {
      persistVehicles((previous) =>
        previous.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...payload } : vehicle)),
      );
    };

    const deleteVehicle = (vehicleId: string) => {
      persistVehicles((previous) => previous.filter((vehicle) => vehicle.id !== vehicleId));
    };

    const updateUserApproval = (userId: string, approved: boolean) => {
      persistUsers((previous) =>
        previous.map((user) => (user.id === userId ? { ...user, isApproved: approved } : user)),
      );
    };

    const resetDemoData = () => {
      resetStorage();
      loadAllData();
    };

    return {
      bookings,
      services,
      users,
      vehicles,
      invoices,
      expenses,
      employees,
      inventory,
      reviews,
      transactions,
      isReady,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      addInvoice,
      updateInvoiceStatus,
      addExpense,
      addEmployee,
      updateEmployeeStatus,
      addInventoryItem,
      adjustInventoryQuantity,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      updateUserApproval,
      resetDemoData,
    };
  }, [
    bookings,
    services,
    users,
    vehicles,
    invoices,
    expenses,
    employees,
    inventory,
    reviews,
    transactions,
    isReady,
    persistBookings,
    persistInvoices,
    persistExpenses,
    persistEmployees,
    persistInventory,
    persistVehicles,
    persistUsers,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};