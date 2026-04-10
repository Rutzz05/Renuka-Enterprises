import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { bookingsAPI, invoicesAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar, FileText, Plus, ClipboardList, CheckCircle2,
  Clock, ArrowRight, ShoppingBag, User, Mail, Shield, Loader2, Wrench,
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, invoicesRes] = await Promise.all([
          bookingsAPI.getMyBookings(),
          invoicesAPI.getMyInvoices(),
        ]);
        setBookings(bookingsRes.data);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" />, dot: 'bg-amber-400' };
      case 'in-progress':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Loader2 className="w-3 h-3 animate-spin" />, dot: 'bg-blue-400' };
      case 'completed':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" />, dot: 'bg-emerald-400' };
      default:
        return { bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: null, dot: 'bg-gray-400' };
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
  const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
  const totalInvoiceAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/[0.03]">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0E3C59 0%, #0A2647 50%, #0F766E 100%)'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
        }} />
        <div className="relative container py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white/80 text-sm font-semibold">Welcome back,</p>
                <h1 className="text-white font-bold" style={{ fontSize: '1.75rem', lineHeight: '2.25rem' }}>
                  {user?.name}
                </h1>
                <p className="text-white/70 text-sm mt-0.5">Manage your services and view your history</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-sm font-semibold"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container -mt-6 relative z-10 pb-12">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/products" className="group">
            <Card className="border-0 shadow-md overflow-hidden h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-50/50 border-l-4 border-blue-500">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">View Products</p>
                  <p className="text-xs text-muted-foreground mt-1">Browse available items</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/services" className="group">
            <Card className="border-0 shadow-md overflow-hidden h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-50/50 border-l-4 border-emerald-500">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <Wrench className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Services</p>
                  <p className="text-xs text-muted-foreground mt-1">Our service offerings</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/booking" className="group">
            <Card className="border-0 shadow-md overflow-hidden h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-gradient-to-br from-purple-50 to-purple-50/50 border-l-4 border-purple-500">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">New Booking</p>
                  <p className="text-xs text-muted-foreground mt-1">Book a service now</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/" className="group">
            <Card className="border-0 shadow-md overflow-hidden h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-gradient-to-br from-amber-50 to-amber-50/50 border-l-4 border-amber-500">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                  <ArrowRight className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Home</p>
                  <p className="text-xs text-muted-foreground mt-1">Back to home page</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: totalBookings, icon: ClipboardList, color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100 text-blue-600' },
            { label: 'Pending', value: pendingBookings, icon: Clock, color: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100 text-amber-600' },
            { label: 'Completed', value: completedBookings, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-100 text-emerald-600' },
            { label: 'Total Billed', value: `₹${totalInvoiceAmount.toLocaleString()}`, icon: FileText, color: 'from-violet-500 to-violet-600', iconBg: 'bg-violet-100 text-violet-600' },
          ].map((stat) => (
            <Card key={stat.label} className="card-elevated border-0 shadow-md overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1.5">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className={`h-1 w-full rounded-full bg-gradient-to-r ${stat.color} mt-4 opacity-60`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bookings - Takes 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/[0.03] to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle style={{ fontSize: '1.1rem' }}>Service Bookings</CardTitle>
                      <CardDescription className="text-xs">Your recent service requests</CardDescription>
                    </div>
                  </div>
                  <Link to="/booking">
                    <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90">
                      <Plus className="w-3.5 h-3.5" />
                      New Booking
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No bookings yet</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Book your first service to get started</p>
                    <Link to="/booking" className="mt-4">
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        Book a Service
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {bookings.slice(0, 5).map((booking: any) => {
                      const statusConfig = getStatusConfig(booking.status);
                      return (
                        <div key={booking._id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                            <div>
                              <p className="font-semibold text-sm">{booking.serviceType}</p>
                              <p className="text-xs text-muted-foreground">{booking.issueType}</p>
                            </div>
                          </div>
                          <Badge className={`${statusConfig.bg} border gap-1 text-xs font-medium`}>
                            {statusConfig.icon}
                            {booking.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-3 border-b bg-gradient-to-r from-violet-500/[0.03] to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle style={{ fontSize: '1.1rem' }}>Invoices</CardTitle>
                    <CardDescription className="text-xs">Your billing history</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {invoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No invoices yet</p>
                    <p className="text-muted-foreground/60 text-sm mt-1">Invoices will appear here after service</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {invoices.slice(0, 5).map((invoice: any) => (
                      <Link key={invoice._id} to={`/invoice/${invoice._id}`} className="block">
                        <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{invoice.invoiceId}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-sm">₹{invoice.totalAmount?.toLocaleString()}</p>
                              <Badge
                                variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                                className="text-[10px] px-1.5 py-0"
                              >
                                {invoice.status}
                              </Badge>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <CardTitle style={{ fontSize: '1.1rem' }}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Link to="/booking">
                  <Button className="w-full justify-start gap-3 h-12 bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary transition-all" variant="outline">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    Book a Service
                  </Button>
                </Link>
                <Link to="/products">
                  <Button className="w-full justify-start gap-3 h-12 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white border border-secondary/20 hover:border-secondary transition-all mt-2" variant="outline">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    View Products
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <CardTitle style={{ fontSize: '1.1rem' }}>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-sm">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Type</p>
                    <p className="font-semibold text-sm capitalize">{user?.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;