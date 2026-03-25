// Mock booking service — replace with real API calls later

export type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled" | string;

export type Booking = {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: BookingStatus;
  date: string; // human friendly date string for display
  preferredDate?: string; // ISO date selected by user
  timeSlot?: string;
  notes?: string;
  submittedAt?: string;
};

let store: Booking[] = [
  { id: "SR-001", name: "Rajesh Patil", phone: "9876543210", service: "Aquaguard Repair", status: "Pending", date: "15 Feb 2026", submittedAt: new Date().toISOString() },
  { id: "SR-002", name: "Priya Deshmukh", phone: "9123456789", service: "Inverter Installation", status: "Completed", date: "14 Feb 2026", submittedAt: new Date().toISOString() },
  { id: "SR-003", name: "Suresh Kulkarni", phone: "9988776655", service: "Battery Replacement", status: "In Progress", date: "14 Feb 2026", submittedAt: new Date().toISOString() },
  { id: "SR-004", name: "Anita Joshi", phone: "9112233445", service: "Aquaguard Servicing", status: "Pending", date: "13 Feb 2026", submittedAt: new Date().toISOString() },
  { id: "SR-005", name: "Vikram Sharma", phone: "9556677889", service: "Inverter Repair", status: "Completed", date: "12 Feb 2026", submittedAt: new Date().toISOString() },
];

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

function generateId() {
  const max = store.length + 100;
  const n = Math.floor(Math.random() * max) + 1;
  return `SR-${String(n).padStart(3, "0")}`;
}

// Simulate GET /bookings
export async function getBookings(): Promise<Booking[]> {
  await delay(300);
  // return a copy to simulate network transfer
  return JSON.parse(JSON.stringify(store));
}

// Simulate POST /bookings
export async function createBooking(payload: Partial<Booking>): Promise<Booking> {
  await delay(500);

  const id = generateId();
  const created: Booking = {
    id,
    name: payload.name || "Unknown",
    phone: payload.phone || "",
    service: payload.service || payload.service || "Service Request",
    status: (payload.status as BookingStatus) || "Pending",
    date: payload.preferredDate ? new Date(payload.preferredDate).toLocaleDateString() : new Date().toLocaleDateString(),
    preferredDate: payload.preferredDate,
    timeSlot: payload.timeSlot,
    notes: payload.notes,
    submittedAt: payload.submittedAt || new Date().toISOString(),
  };

  // push to mock store
  store = [created, ...store];
  return JSON.parse(JSON.stringify(created));
}

// Simulate PUT /bookings/:id/status
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  await delay(300);
  const idx = store.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Booking not found");
  store[idx] = { ...store[idx], status };
  return JSON.parse(JSON.stringify(store[idx]));
}
