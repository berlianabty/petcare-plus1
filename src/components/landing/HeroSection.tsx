import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Calendar, PawPrint, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-sky-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
              The smarter way to care for your pets
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Manage appointments, track health records, and stay on top of your pet's care — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="primary" size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="h-4 w-4" />}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollTo('how-it-works')}>
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['A', 'S', 'J', 'M', 'K'].map((initial, i) => (
                  <div key={i} className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white ${['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500', 'bg-rose-500'][i]}`}>
                    {initial}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">Trusted by 10,000+ pet owners</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                    <PawPrint className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">PetCare+</span>
                </div>
                <span className="text-xs text-gray-500">Dashboard</span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">🐕</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Max</p>
                    <p className="text-xs text-gray-500">Annual Checkup · Jan 20</p>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-xl">🐈</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Luna</p>
                    <p className="text-xs text-gray-500">Dental Cleaning · Jan 22</p>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Upcoming</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Health Score</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">92%</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {[60, 75, 68, 85, 72, 90, 92].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-400 to-sky-400 rounded-t-md" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i} className="text-[10px] text-gray-400">{d}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>2 appointments this week</span>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 p-3 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <PawPrint className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Vaccines Up to Date</p>
                  <p className="text-[10px] text-gray-500">All 3 pets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
