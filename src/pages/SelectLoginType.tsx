import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

const SelectLoginType = () => {
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Renuka Enterprises</h1>
        <p className="text-muted-foreground">Please select your login type</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Customer Login</CardTitle>
            <CardDescription>
              Book services, view your history, and manage your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link to="/login/customer">
                Login as Customer
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Manage services, products, and customer data
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full">
              <Link to="/login/admin">
                Login as Admin
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Administrative access only
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectLoginType;
