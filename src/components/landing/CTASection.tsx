import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-500 to-sky-500 px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to give your pet the best care?</h2>
            <p className="mt-4 text-lg text-blue-50">Start for free — no credit card required</p>
            <div className="mt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 hover:bg-blue-50"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
