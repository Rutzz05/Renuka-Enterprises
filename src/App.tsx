import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LayoutV2 from "./components/LayoutV2";
import HomePageV2 from "./pages/HomePageV2";
import ServicesPage from "./pages/ServicesPage";
import ProductsPageV2 from "./pages/ProductsPageV2";
import ContactPage from "./pages/ContactPage";
import AdminPageV2 from "./pages/AdminPageV2";
import NotFound from "./pages/NotFound";
import SelectLoginType from "./pages/SelectLoginType";
import CustomerLogin from "./pages/CustomerLogin";
import AdminLogin from "./pages/AdminLogin";
import CustomerDashboardV3 from "./pages/CustomerDashboardV3";
import BookingPage from "./pages/BookingPage";
import InvoicePageV3 from "./pages/InvoicePageV3";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutV2 />}>
              <Route path="/" element={<HomePageV2 />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/products" element={<ProductsPageV2 />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<SelectLoginType />} />
              <Route path="/login/customer" element={<CustomerLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboardV3 /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPageV2 /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePageV3 /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
