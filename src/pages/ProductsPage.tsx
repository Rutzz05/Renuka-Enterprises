import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import { productsAPI } from "@/services/api";

const PHONE = "+919876543210";

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await productsAPI.getAllProducts();
      console.log("Products API:", res.data); // debug

      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  return (
    <>
      <section className="hero" style={{ background: "var(--hero-gradient)" }}>
        <div className="container text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Products</h1>
          <p className="opacity-90 max-w-lg mx-auto">
            Explore our range of Aquaguard water purifiers and Inverter solutions
          </p>
        </div>
      </section>

      <section className="container section">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive max-w-md mx-auto">
            <p className="font-semibold mb-1">Error loading products</p>
            <p className="text-sm">{error}</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id} className="card-elevated rounded-lg bg-card border-0 overflow-hidden shadow-md hover:shadow-lg transition-all">
                <img
                  src={p.image || "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop"}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />

                <div className="p-5">
                  <div className="mb-2 inline-block">
                    <p className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{p.category}</p>
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-2 text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                  
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="font-bold text-lg text-primary">₹{p.price?.toLocaleString()}</p>
                    </div>
                    {p.stock !== undefined && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.stock > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    )}
                  </div>

                  <a href={`tel:${PHONE}`} className="block">
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <Phone className="w-4 h-4" /> Enquire Now
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}