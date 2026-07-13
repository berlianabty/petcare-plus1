import { useNavigate } from 'react-router-dom';
import { PawPrint, Home, LayoutDashboard } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="relative inline-flex items-center justify-center mb-6">
          <span className="text-8xl font-bold text-blue-500">404</span>
          <div className="absolute -top-2 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <PawPrint className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Oops! This page doesn't exist.</h1>
        <p className="mt-2 text-sm text-gray-500">We couldn't find what you were looking for.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" leftIcon={<Home className="h-4 w-4" />} onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="outline" leftIcon={<LayoutDashboard className="h-4 w-4" />} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
