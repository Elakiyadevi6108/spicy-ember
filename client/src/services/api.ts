import { MenuItem, Reservation, Table, EventItem, AvailabilityResponse, User } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Menu
  getMenuItems: async (category?: string, search?: string, veg?: boolean): Promise<MenuItem[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (veg !== undefined) params.append('veg', String(veg));
    return fetchJson<MenuItem[]>(`${API_BASE}/menu?${params.toString()}`);
  },

  // Availability
  checkAvailability: async (date: string, time: string, guests: number): Promise<AvailabilityResponse> => {
    return fetchJson<AvailabilityResponse>(`${API_BASE}/availability?date=${date}&time=${encodeURIComponent(time)}&guests=${guests}`);
  },

  // Reservations
  createReservation: async (data: {
    customerName: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: string;
    specialRequest?: string;
  }): Promise<{ message: string; reservation: Reservation }> => {
    return fetchJson(`${API_BASE}/reservations`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getReservations: async (filters?: { email?: string; date?: string; status?: string; search?: string }): Promise<Reservation[]> => {
    const params = new URLSearchParams();
    if (filters?.email) params.append('email', filters.email);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    return fetchJson<Reservation[]>(`${API_BASE}/reservations?${params.toString()}`);
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    return fetchJson<Reservation>(`${API_BASE}/reservations/${id}`);
  },

  updateReservation: async (id: string | number, data: Partial<Reservation>): Promise<{ message: string; reservation: Reservation }> => {
    return fetchJson(`${API_BASE}/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  cancelReservation: async (id: string | number): Promise<{ message: string; reservationId: string }> => {
    return fetchJson(`${API_BASE}/reservations/${id}`, {
      method: 'DELETE'
    });
  },

  // Tables
  getTables: async (): Promise<Table[]> => {
    return fetchJson<Table[]>(`${API_BASE}/tables`);
  },

  createTable: async (tableData: Omit<Table, 'id'>): Promise<Table> => {
    return fetchJson<Table>(`${API_BASE}/tables`, {
      method: 'POST',
      body: JSON.stringify(tableData)
    });
  },

  updateTable: async (id: number, tableData: Partial<Table>): Promise<Table> => {
    return fetchJson<Table>(`${API_BASE}/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tableData)
    });
  },

  deleteTable: async (id: number): Promise<{ message: string }> => {
    return fetchJson(`${API_BASE}/tables/${id}`, {
      method: 'DELETE'
    });
  },

  // Events
  getEvents: async (): Promise<EventItem[]> => {
    return fetchJson<EventItem[]>(`${API_BASE}/events`);
  },

  // Contact & Newsletter
  sendContact: async (data: { name: string; email: string; phone?: string; message: string }) => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/contact`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  subscribeNewsletter: async (email: string) => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/newsletter`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    return fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (name: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    return fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }
};
