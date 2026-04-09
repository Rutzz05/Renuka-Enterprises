import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Wrench } from 'lucide-react';
import ServiceBookingFormV2 from '@/components/ServiceBookingFormV2';
import { useAuth } from '@/contexts/AuthContext';

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_45%,#eef6f2_100%)]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-gradient)] opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative container py-10 text-white">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">Customer support desk</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Schedule service without the back-and-forth.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-white/75 md:text-lg">
                Pick the product type, issue, and preferred slot. We will confirm the visit and send the technician with the right parts.
              </p>
            </div>
            <div className="grid gap-4 rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fast scheduling</p>
                  <p className="text-sm text-white/70">Book installation, maintenance, or urgent repair.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Flexible slots</p>
                  <p className="text-sm text-white/70">Morning and afternoon visits available across Nashik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container -mt-8 relative z-10 pb-14">
        <ServiceBookingFormV2
          source="dashboard"
          initialValues={{
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
          }}
          title="Create a new service booking"
          subtitle="Your details are prefilled from your account. Update them only if this booking is for someone else."
          onSuccess={() => {
            setTimeout(() => navigate('/dashboard'), 1400);
          }}
        />
      </section>
    </div>
  );
};

export default BookingPage;
