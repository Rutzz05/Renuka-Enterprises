import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const PHONE = "+919876543210";

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
};

export default function ProductsPage() {

  // ✅ INSIDE component
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <section className="container p-6">
        <h1 className="text-2xl font-bold mb-4">Our Products</h1>

        {products.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded shadow">
                
                <img
                  src={p.image || "https://via.placeholder.com/150"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />

                <h3 className="font-bold mt-2">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="text-sm">{p.description}</p>
                <p className="font-bold text-green-600">₹{p.price}</p>

                <a href={`tel:${PHONE}`}>
                  <Button className="mt-3 w-full">Enquire Now</Button>
                </a>

              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}