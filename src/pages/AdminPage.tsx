import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  name: string;
  phone: string;
  product: string;
  serviceType: string;
  message: string;
};

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-md rounded-lg p-4 border"
            >
              <h2 className="font-bold text-lg">{b.name}</h2>

              <p className="text-sm text-gray-600 mt-1">
                📞 {b.phone}
              </p>

              <p className="text-sm mt-2">
                🛒 {b.product}
              </p>

              <p className="text-sm text-blue-600">
                🔧 {b.serviceType}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                💬 {b.message}
              </p>

              <span className="inline-block mt-3 px-2 py-1 text-xs bg-gray-100 rounded">
                New Booking
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}