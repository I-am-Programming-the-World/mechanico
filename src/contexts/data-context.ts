import { createContext } from "react";

import type {
  Booking,
  Employee,
  Expense,
  InventoryItem,
  Invoice,
  Review,
  Service,
  Transaction,
  User,
  Vehicle,
} from "@/lib/storage";

export type BookingPayload = Omit<Booking, "id" | "createdAt"> & { id?: string };
export type InvoicePayload = Omit<Invoice, "id" | "createdAt"> & { id?: string };
export type ExpensePayload = Omit<Expense, "id" | "createdAt">;
export type EmployeePayload = Omit<Employee, "id"> & { id?: string };
export type InventoryPayload = Omit<InventoryItem, "id"> & { id?: string };
export type VehiclePayload = Omit<Vehicle, "id"> & { id?: string };

export interface DataContextValue {
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
}

export const DataContext = createContext<DataContextValue | undefined>(undefined);
