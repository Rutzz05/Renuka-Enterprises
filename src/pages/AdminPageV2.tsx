import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, ClipboardList, FileText, Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI, bookingsAPI, invoicesAPI, productsAPI } from "@/services/apiClient";

const bookingStatuses = ["pending", "in-progress", "completed"];
const dashboardTabs = ["bookings", "products", "invoices"] as const;

type DashboardTab = (typeof dashboardTabs)[number];

const emptyProductForm = {
  id: "",
  name: "",
  category: "",
  description: "",
  price: "",
  stock: "",
  image: "",
};

const createEmptyInvoiceItem = () => ({
  description: "",
  hsnCode: "",
  quantity: "1",
  unitPrice: "0",
});

const emptyManualCustomer = {
  name: "",
  phone: "",
  address: "",
};

export default function AdminPageV2() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [invoiceForm, setInvoiceForm] = useState({
    customerMode: "existing",
    customerId: "",
    bookingId: "",
    type: "service",
    tax: "0",
    dueDate: "",
    notes: "",
    status: "generated",
    manualCustomer: emptyManualCustomer,
    items: [createEmptyInvoiceItem()],
  });

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [bookingsResponse, productsResponse, invoicesResponse, customersResponse] = await Promise.all([
        bookingsAPI.getAllBookings(),
        productsAPI.getAllProducts(),
        invoicesAPI.getAllInvoices(),
        authAPI.getCustomers(),
      ]);

      setBookings(bookingsResponse.data);
      setProducts(productsResponse.data);
      setInvoices(invoicesResponse.data);
      setCustomers(customersResponse.data);
    } catch (_error) {
      toast.error("We could not load the admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const bookingOptionsForCustomer = useMemo(
    () => bookings.filter((booking) => booking.customer?._id === invoiceForm.customerId),
    [bookings, invoiceForm.customerId]
  );

  const invoicePreview = useMemo(() => {
    const subtotal = invoiceForm.items.reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);
      return sum + quantity * unitPrice;
    }, 0);
    const tax = Number(invoiceForm.tax || 0);

    return {
      subtotal,
      total: subtotal + tax,
    };
  }, [invoiceForm.items, invoiceForm.tax]);

  const startBusy = (key: string) => setBusyKey(key);
  const stopBusy = () => setBusyKey(null);

  const submitProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    startBusy("product-form");

    try {
      if (productForm.id) {
        await productsAPI.updateProduct(productForm.id, {
          name: productForm.name,
          category: productForm.category,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          image: productForm.image,
        });
      } else {
        await productsAPI.createProduct({
          name: productForm.name,
          category: productForm.category,
          description: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          image: productForm.image,
        });
      }

      setProductForm(emptyProductForm);
      toast.success(productForm.id ? "Product updated successfully." : "Product created successfully.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to save product details.");
    } finally {
      stopBusy();
    }
  };

  const deleteProduct = async (productId: string) => {
    startBusy(`delete-product-${productId}`);
    try {
      await productsAPI.deleteProduct(productId);
      toast.success("Product deleted successfully.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to delete this product.");
    } finally {
      stopBusy();
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    startBusy(`booking-${bookingId}`);
    try {
      await bookingsAPI.updateBooking(bookingId, { status });
      toast.success("Booking status updated.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to update booking status.");
    } finally {
      stopBusy();
    }
  };

  const deleteBooking = async (bookingId: string) => {
    startBusy(`delete-booking-${bookingId}`);
    try {
      await bookingsAPI.deleteBooking(bookingId);
      toast.success("Booking deleted successfully.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to delete this booking.");
    } finally {
      stopBusy();
    }
  };

  const submitInvoice = async (event: React.FormEvent) => {
    event.preventDefault();
    startBusy("invoice-form");

    try {
      // Validate that all items have description and unitPrice > 0
      const invalidItems = invoiceForm.items.filter(
        (item) => !item.description.trim() || Number(item.unitPrice || 0) <= 0
      );
      if (invalidItems.length > 0) {
        toast.error("Please complete each item and keep unit prices above 0.");
        stopBusy();
        return;
      }

      if (invoiceForm.customerMode === "existing" && !invoiceForm.customerId) {
        toast.error("Please select an existing customer.");
        stopBusy();
        return;
      }

      if (
        invoiceForm.customerMode === "manual" &&
        (!invoiceForm.manualCustomer.name.trim() || !invoiceForm.manualCustomer.phone.trim())
      ) {
        toast.error("Please enter the manual customer name and phone number.");
        stopBusy();
        return;
      }

      await invoicesAPI.createInvoice({
        customerId: invoiceForm.customerMode === "existing" ? invoiceForm.customerId : null,
        bookingId: invoiceForm.customerMode === "existing" ? invoiceForm.bookingId || null : null,
        type: invoiceForm.type,
        tax: Number(invoiceForm.tax || 0),
        dueDate: invoiceForm.dueDate || null,
        notes: invoiceForm.notes,
        status: invoiceForm.status,
        customerDetails:
          invoiceForm.customerMode === "manual"
            ? {
                name: invoiceForm.manualCustomer.name,
                phone: invoiceForm.manualCustomer.phone,
                address: invoiceForm.manualCustomer.address,
              }
            : {
                address: invoiceForm.manualCustomer.address,
              },
        items: invoiceForm.items.map((item) => ({
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      });

      setInvoiceForm({
        customerMode: "existing",
        customerId: "",
        bookingId: "",
        type: "service",
        tax: "0",
        dueDate: "",
        notes: "",
        status: "generated",
        manualCustomer: emptyManualCustomer,
        items: [createEmptyInvoiceItem()],
      });
      toast.success("Invoice created successfully.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to create invoice.");
    } finally {
      stopBusy();
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    startBusy(`invoice-${invoiceId}`);
    try {
      await invoicesAPI.updateInvoiceStatus(invoiceId, { status });
      toast.success("Invoice status updated.");
      await loadDashboard();
    } catch (_error) {
      toast.error("Unable to update invoice status.");
    } finally {
      stopBusy();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fb_0%,#ffffff_50%,#eef5f1_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,60,89,0.96),rgba(15,118,110,0.94))]" />
        <div className="relative container py-12 text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Admin control room</p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">Operations for Renuka Enterprises.</h1>
              <p className="mt-3 max-w-2xl text-base text-white/75 md:text-lg">
                Review bookings, maintain inventory, and generate invoices from one responsive dashboard.
              </p>
              <p className="mt-3 text-sm text-white/70">Welcome, {user?.name || "Admin"}.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/products">
                <Button variant="outline" className="border-white/25 bg-white/10 text-white hover:bg-white/20">
                  View site
                </Button>
              </Link>
              <Button variant="outline" onClick={logout} className="border-white/25 bg-white/10 text-white hover:bg-white/20">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Bookings", value: bookings.length, icon: ClipboardList },
            { label: "Products", value: products.length, icon: Boxes },
            { label: "Invoices", value: invoices.length, icon: FileText },
            { label: "Customers", value: customers.length, icon: Plus },
          ].map((item) => (
            <Card key={item.label} className="rounded-[24px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 p-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2 !bg-slate-100 text-slate-700 hover:!bg-slate-200">
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="gap-2 !bg-blue-50 text-blue-700 hover:!bg-blue-100 border-blue-200">
              View Site Products
            </Button>
          </Link>
          {dashboardTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-600 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)] hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "bookings" && (
          <Card className="mt-6 rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl">Booking management</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 pb-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="rounded-[24px] border bg-slate-50/70 p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold capitalize text-slate-900">{booking.serviceType}</h3>
                        <Badge variant="outline">{booking.source}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{booking.issueType}</p>
                      <div className="grid gap-1 text-sm text-slate-500 sm:grid-cols-2">
                        <p><span className="font-semibold text-slate-900">Customer:</span> {booking.name}</p>
                        <p><span className="font-semibold text-slate-900">Phone:</span> {booking.phone}</p>
                        <p><span className="font-semibold text-slate-900">Email:</span> {booking.email || booking.customer?.email || "Not provided"}</p>
                        <p>
                          <span className="font-semibold text-slate-900">Preferred slot:</span>{" "}
                          {new Date(booking.preferredDate).toLocaleDateString("en-IN")} at {booking.preferredTime}
                        </p>
                      </div>
                      {booking.notes && <p className="rounded-2xl bg-white p-3 text-sm text-slate-600">{booking.notes}</p>}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                        className="h-11 rounded-xl border bg-white px-3 text-sm"
                        disabled={busyKey === `booking-${booking._id}`}
                      >
                        {bookingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/5"
                        onClick={() => deleteBooking(booking._id)}
                        disabled={busyKey === `delete-booking-${booking._id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "products" && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">{productForm.id ? "Edit product" : "Add product"}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={submitProduct} className="space-y-4">
                  <Input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm((current) => ({ ...current, name: e.target.value }))} />
                  <Input placeholder="Category" value={productForm.category} onChange={(e) => setProductForm((current) => ({ ...current, category: e.target.value }))} />
                  <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm((current) => ({ ...current, description: e.target.value }))} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm((current) => ({ ...current, price: e.target.value }))} />
                    <Input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm((current) => ({ ...current, stock: e.target.value }))} />
                  </div>
                  <Input placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm((current) => ({ ...current, image: e.target.value }))} />
                  <div className="flex gap-3">
                    <Button type="submit" disabled={busyKey === "product-form"}>
                      {productForm.id ? "Update product" : "Create product"}
                    </Button>
                    {productForm.id && (
                      <Button type="button" variant="outline" onClick={() => setProductForm(emptyProductForm)}>
                        Cancel edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product._id} className="rounded-[24px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
                  <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80"}
                        alt={product.name}
                        className="h-24 w-24 rounded-2xl object-cover"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          Rs. {product.price.toLocaleString("en-IN")} - {product.stock} in stock
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setProductForm({
                            id: product._id,
                            name: product.name,
                            category: product.category,
                            description: product.description,
                            price: String(product.price),
                            stock: String(product.stock),
                            image: product.image || "",
                          })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/5"
                        onClick={() => deleteProduct(product._id)}
                        disabled={busyKey === `delete-product-${product._id}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[28px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
              <CardHeader className="p-6">
                <CardTitle className="text-2xl">Create invoice</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={submitInvoice} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        invoiceForm.customerMode === "existing"
                          ? "border-primary bg-primary/5 text-slate-900"
                          : "border-border bg-background text-slate-600"
                      }`}
                      onClick={() =>
                        setInvoiceForm((current) => ({
                          ...current,
                          customerMode: "existing",
                          bookingId: "",
                        }))
                      }
                    >
                      <p className="font-semibold">Select existing customer</p>
                      <p className="mt-1 text-sm text-slate-500">Link this invoice to a registered customer.</p>
                    </button>
                    <button
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        invoiceForm.customerMode === "manual"
                          ? "border-primary bg-primary/5 text-slate-900"
                          : "border-border bg-background text-slate-600"
                      }`}
                      onClick={() =>
                        setInvoiceForm((current) => ({
                          ...current,
                          customerMode: "manual",
                          customerId: "",
                          bookingId: "",
                        }))
                      }
                    >
                      <p className="font-semibold">Enter customer manually</p>
                      <p className="mt-1 text-sm text-slate-500">Use this for walk-in or offline customers.</p>
                    </button>
                  </div>

                  {invoiceForm.customerMode === "existing" ? (
                    <>
                      <select
                        value={invoiceForm.customerId}
                        onChange={(e) => setInvoiceForm((current) => ({ ...current, customerId: e.target.value, bookingId: "" }))}
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      >
                        <option value="">Select customer</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </option>
                        ))}
                      </select>

                      <select
                        value={invoiceForm.bookingId}
                        onChange={(e) => setInvoiceForm((current) => ({ ...current, bookingId: e.target.value }))}
                        className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
                      >
                        <option value="">Link booking (optional)</option>
                        {bookingOptionsForCustomer.map((booking) => (
                          <option key={booking._id} value={booking._id}>
                            {booking.issueType} - {new Date(booking.preferredDate).toLocaleDateString("en-IN")}
                          </option>
                        ))}
                      </select>

                      <Input
                        placeholder="Address for invoice (optional)"
                        value={invoiceForm.manualCustomer.address}
                        onChange={(e) =>
                          setInvoiceForm((current) => ({
                            ...current,
                            manualCustomer: { ...current.manualCustomer, address: e.target.value },
                          }))
                        }
                      />
                    </>
                  ) : (
                    <div className="grid gap-4">
                      <Input
                        placeholder="Customer name"
                        value={invoiceForm.manualCustomer.name}
                        onChange={(e) =>
                          setInvoiceForm((current) => ({
                            ...current,
                            manualCustomer: { ...current.manualCustomer, name: e.target.value },
                          }))
                        }
                      />
                      <Input
                        placeholder="Phone number"
                        value={invoiceForm.manualCustomer.phone}
                        onChange={(e) =>
                          setInvoiceForm((current) => ({
                            ...current,
                            manualCustomer: { ...current.manualCustomer, phone: e.target.value },
                          }))
                        }
                      />
                      <Textarea
                        placeholder="Address"
                        value={invoiceForm.manualCustomer.address}
                        onChange={(e) =>
                          setInvoiceForm((current) => ({
                            ...current,
                            manualCustomer: { ...current.manualCustomer, address: e.target.value },
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={invoiceForm.type}
                      onChange={(e) => setInvoiceForm((current) => ({ ...current, type: e.target.value }))}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
                    >
                      <option value="service">Service</option>
                      <option value="product">Product</option>
                    </select>
                    <select
                      value={invoiceForm.status}
                      onChange={(e) => setInvoiceForm((current) => ({ ...current, status: e.target.value }))}
                      className="h-11 rounded-xl border bg-background px-3 text-sm"
                    >
                      <option value="generated">Generated</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  {invoiceForm.items.map((item, index) => (
                    <div key={index} className="rounded-2xl border bg-slate-50/80 p-4">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          setInvoiceForm((current) => ({
                            ...current,
                            items: current.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, description: e.target.value } : entry
                            ),
                          }))
                        }
                      />
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <Input
                          placeholder="HSN code"
                          value={item.hsnCode}
                          onChange={(e) =>
                            setInvoiceForm((current) => ({
                              ...current,
                              items: current.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, hsnCode: e.target.value } : entry
                              ),
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            setInvoiceForm((current) => ({
                              ...current,
                              items: current.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, quantity: e.target.value } : entry
                              ),
                            }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Unit price"
                          value={item.unitPrice}
                          onChange={(e) =>
                            setInvoiceForm((current) => ({
                              ...current,
                              items: current.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, unitPrice: e.target.value } : entry
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setInvoiceForm((current) => ({ ...current, items: [...current.items, createEmptyInvoiceItem()] }))}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add item
                    </Button>
                    {invoiceForm.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setInvoiceForm((current) => ({ ...current, items: current.items.slice(0, -1) }))
                        }
                      >
                        Remove last item
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input type="number" placeholder="Tax" value={invoiceForm.tax} onChange={(e) => setInvoiceForm((current) => ({ ...current, tax: e.target.value }))} />
                    <Input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm((current) => ({ ...current, dueDate: e.target.value }))} />
                  </div>

                  <Textarea placeholder="Invoice notes" value={invoiceForm.notes} onChange={(e) => setInvoiceForm((current) => ({ ...current, notes: e.target.value }))} />

                  <div className="rounded-2xl border border-dashed bg-primary/[0.03] p-4 text-sm">
                    <p className="font-semibold text-slate-900">Invoice preview</p>
                    <p className="mt-2 text-slate-600">Subtotal: Rs. {invoicePreview.subtotal.toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-slate-600">Total: Rs. {invoicePreview.total.toLocaleString("en-IN")}</p>
                  </div>

                  <Button type="submit" disabled={busyKey === "invoice-form"}>
                    Create invoice
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {invoices.map((invoice) => (
                <Card key={invoice._id} className="rounded-[24px] border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)]">
                  <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{invoice.invoiceId}</h3>
                        <Badge className={invoice.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {invoice.customer?.name || invoice.customerDetails?.name} - {invoice.customer?.phone || invoice.customerDetails?.phone || "No phone"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Rs. {invoice.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={invoice.status}
                        onChange={(e) => updateInvoiceStatus(invoice._id, e.target.value)}
                        className="h-11 rounded-xl border bg-background px-3 text-sm"
                        disabled={busyKey === `invoice-${invoice._id}`}
                      >
                        <option value="generated">generated</option>
                        <option value="paid">paid</option>
                      </select>
                      <Link to={`/invoice/${invoice._id}`}>
                        <Button variant="outline">Open invoice</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
