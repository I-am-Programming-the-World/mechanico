import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
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
import { DataContext, type DataContextValue } from "./data-context";

interface DataProviderProps {
  children: ReactNode;
}

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

export const DataProvider = ({ children }: DataProviderProps) => {
  const [bookings, setBookings] = useState<DataContextValue["bookings"]>([]);
  const [services, setServices] = useState<DataContextValue["services"]>([]);
  const [users, setUsers] = useState<DataContextValue["users"]>([]);
  const [vehicles, setVehicles] = useState<DataContextValue["vehicles"]>([]);
  const [invoices, setInvoices] = useState<DataContextValue["invoices"]>([]);
  const [expenses, setExpenses] = useState<DataContextValue["expenses"]>([]);
  const [employees, setEmployees] = useState<DataContextValue["employees"]>([]);
  const [inventory, setInventory] = useState<DataContextValue["inventory"]>([]);
  const [reviews, setReviews] = useState<DataContextValue["reviews"]>([]);
  const [transactions, setTransactions] = useState<DataContextValue["transactions"]>([]);
  const [isReady, setIsReady] = useState(false);

  const loadAll = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    initializeDummyData();
    loadAll();
    setIsReady(true);

    const handleStorage = () => {
      loadAll();
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [loadAll]);

  const persistBookings = useMemo(() => createPersistedSetter(setBookings, saveBookings), []);
  const persistUsers = useMemo(() => createPersistedSetter(setUsers, saveUsers), []);
  const persistInvoices = useMemo(() => createPersistedSetter(setInvoices, saveInvoices), []);
  const persistExpenses = useMemo(() => createPersistedSetter(setExpenses, saveExpenses), []);
  const persistEmployees = useMemo(() => createPersistedSetter(setEmployees, saveEmployees), []);
  const persistInventory = useMemo(() => createPersistedSetter(setInventory, saveInventory), []);
  const persistVehicles = useMemo(() => createPersistedSetter(setVehicles, saveVehicles), []);

  const value = useMemo<DataContextValue>(() => {
    const addBooking: DataContextValue["addBooking"] = (payload) => {
      const newBooking = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persistBookings((previous) => [...previous, newBooking]);
      return newBooking;
    };

    const updateBookingStatus: DataContextValue["updateBookingStatus"] = (bookingId, status) => {
      persistBookings((previous) => previous.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)));
    };

    const deleteBooking: DataContextValue["deleteBooking"] = (bookingId) => {
      persistBookings((previous) => previous.filter((booking) => booking.id !== bookingId));
    };

    const addInvoice: DataContextValue["addInvoice"] = (payload) => {
      const newInvoice = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
        createdAt: payload.createdAt ?? new Date().toISOString(),
      };
      persistInvoices((previous) => [...previous, newInvoice]);
      return newInvoice;
    };

    const updateInvoiceStatus: DataContextValue["updateInvoiceStatus"] = (invoiceId, status) => {
      persistInvoices((previous) => previous.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status } : invoice)));
    };

    const addExpense: DataContextValue["addExpense"] = (payload) => {
      const newExpense = {
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persistExpenses((previous) => [...previous, newExpense]);
      return newExpense;
    };

    const addEmployee: DataContextValue["addEmployee"] = (payload) => {
      const newEmployee = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistEmployees((previous) => [...previous, newEmployee]);
      return newEmployee;
    };

    const updateEmployeeStatus: DataContextValue["updateEmployeeStatus"] = (employeeId, status) => {
      persistEmployees((previous) =>
        previous.map((employee) => (employee.id === employeeId ? { ...employee, status } : employee)),
      );
    };

    const addInventoryItem: DataContextValue["addInventoryItem"] = (payload) => {
      const newItem = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistInventory((previous) => [...previous, newItem]);
      return newItem;
    };

    const adjustInventoryQuantity: DataContextValue["adjustInventoryQuantity"] = (itemId, quantity) => {
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

    const addVehicle: DataContextValue["addVehicle"] = (payload) => {
      const newVehicle = {
        ...payload,
        id: payload.id ?? crypto.randomUUID(),
      };
      persistVehicles((previous) => [...previous, newVehicle]);
      return newVehicle;
    };

    const updateVehicle: DataContextValue["updateVehicle"] = (vehicleId, payload) => {
      persistVehicles((previous) => previous.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...payload } : vehicle)));
    };

    const deleteVehicle: DataContextValue["deleteVehicle"] = (vehicleId) => {
      persistVehicles((previous) => previous.filter((vehicle) => vehicle.id !== vehicleId));
    };

    const updateUserApproval: DataContextValue["updateUserApproval"] = (userId, approved) => {
      persistUsers((previous) => previous.map((user) => (user.id === userId ? { ...user, isApproved: approved } : user)));
    };

    const resetDemoData = () => {
      resetStorage();
      loadAll();
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
    loadAll,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
