export type SeatingPreference = 'Indoor' | 'Outdoor' | 'Window' | 'Private Dining';

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No Show';

export type TableStatus = 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isPopular: boolean;
  imageUrl: string;
}

export interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  location: SeatingPreference;
  status: TableStatus;
  currentReservation?: {
    customerName: string;
    time: string;
  } | null;
}

export interface Reservation {
  id: number;
  reservationId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: SeatingPreference;
  specialRequest?: string;
  status: ReservationStatus;
  tableId?: number;
  tableNumber?: number;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface AvailabilityResponse {
  available: boolean;
  statusText: 'Available' | 'Limited availability' | 'Fully booked';
  availableTablesCount: number;
  availableTables: Table[];
}
