import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import Button from '../ui/Button';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
              <PawPrint className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetCare+</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</button>
            <button onClick={() => scrollTo('testimonials')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Testimonials</button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
