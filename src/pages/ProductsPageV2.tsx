import { useEffect, useState } from "react";
import { Phone, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { productsAPI } from "@/services/apiClient";

const PHONE = "+919823021804";

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
};

export default function ProductsPageV2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAllProducts();
        setProducts(response.data || []);
      } catch (_error) {
        toast.error("We could not load products right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[linear-gradient(180deg,#fbfdff_0%,#eef6ff_25%,#ffffff_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(12,74,110,0.96),rgba(13,148,136,0.92))]" />
        <div className="relative container py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Products</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Trusted systems for clean water and reliable backup power.</h1>
          <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
            Browse the core models we frequently recommend, install, and service for homes, shops, and offices across Nashik.
          </p>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Curated range", value: "Field-tested products only", icon: Sparkles },
            { label: "Installation support", value: "Setup and service by our team", icon: ShieldCheck },
            { label: "Quick assistance", value: "Call for pricing and stock checks", icon: Phone },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)]">
              <item.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-[28px] border bg-white/70" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[28px] border border-dashed bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No products available right now</p>
              <p className="mt-2 text-sm text-slate-500">
                Please check back shortly or call us for the latest stock details.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_-35px_rgba(15,23,42,0.5)]"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80"}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Price</p>
                        <p className="mt-1 text-lg font-bold text-emerald-700">Rs. {product.price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                      <span className="text-slate-500">Availability</span>
                      <span className="font-semibold text-slate-900">
                        {product.stock > 0 ? `${product.stock} in stock` : "Check availability"}
                      </span>
                    </div>

                    <a href={`tel:${PHONE}`} className="mt-5 block">
                      <Button className="w-full gap-2 rounded-xl">
                        <Phone className="h-4 w-4" />
                        Enquire now
                      </Button>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
