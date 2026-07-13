import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Thompson', pet: 'Max & Bella', color: 'bg-blue-500', quote: "PetCare+ has completely transformed how I manage my pets' health. I never miss a vaccination or checkup anymore!" },
  { name: 'Michael Chen', pet: 'Whiskers', color: 'bg-emerald-500', quote: "The appointment scheduling is so easy. I can book and reschedule vet visits in seconds. My cat is healthier than ever." },
  { name: 'Emily Rodriguez', pet: 'Rocky', color: 'bg-amber-500', quote: "Being able to message my vet directly has been a game changer. No more phone tag — I just send a quick message." },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Loved by pet owners</h2>
          <p className="mt-3 text-lg text-gray-600">See what our community has to say</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center text-white font-semibold text-sm`}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">Owner of {t.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
