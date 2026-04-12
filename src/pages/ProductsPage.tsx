import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Package, AlertCircle } from "lucide-react";
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

const LoadingSkeleton = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden bg-slate-100 animate-pulse">
        <div className="w-full h-48 bg-slate-200" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-20" />
          <div className="h-5 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-32" />
          <div className="h-10 bg-slate-200 rounded mt-4" />
        </div>
      </div>
    ))}
  </div>
);

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
      <section className="hero relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/10" />
        <div className="container relative text-center text-primary-foreground py-16 md:py-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">Our Premium Products</h1>
          <p className="opacity-90 max-w-2xl mx-auto text-lg md:text-xl">
            Explore our comprehensive range of Aquaguard water purifiers and advanced inverter solutions for your home and business
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        {loading ? (
          <div>
            <div className="flex justify-center items-center py-8 mb-8">
              <div className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                </div>
                <p className="text-slate-600 font-medium">Loading our amazing products...</p>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-red-900 max-w-md mx-auto text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <p className="font-semibold mb-2 text-lg">Error loading products</p>
            <p className="text-sm mb-5 text-red-800">{error}</p>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Products Available</h3>
            <p className="text-slate-600">Our product inventory is being updated. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, idx) => (
              <div 
                key={p._id} 
                className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 animate-in fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-slate-100 h-48">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Product";
                    }}
                  />
                  {p.stock !== undefined && (
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm transition-all ${
                        p.stock > 0 
                          ? 'text-emerald-700 bg-emerald-100/90 border border-emerald-300' 
                          : 'text-red-700 bg-red-100/90 border border-red-300'
                      }`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Category Badge */}
                  <div className="mb-3 inline-block">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                      {p.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-base mb-1.5 line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Price & Stock Info */}
                  <div className="flex justify-between items-end mb-5 pb-4 border-t border-slate-100">
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Price</p>
                      <p className="font-bold text-lg text-primary">
                        ₹{p.price?.toLocaleString() || "Contact"}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a href={`tel:${PHONE}`} className="block">
                    <Button 
                      className="w-full gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold transition-all hover:shadow-lg group/btn"
                      disabled={p.stock !== undefined && p.stock === 0}
                    >
                      <Phone className="w-4 h-4 group-hover/btn:animate-pulse" /> 
                      {p.stock !== undefined && p.stock === 0 ? 'Notify Me' : 'Enquire Now'}
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