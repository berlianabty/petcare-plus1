import { PawPrint, CalendarDays, HeartPulse, Syringe, MessageSquare, Bell } from 'lucide-react';

const features = [
  { icon: PawPrint, title: 'Pet Profiles', desc: 'Create detailed profiles for each pet with photos, breed info, and vital stats.' },
  { icon: CalendarDays, title: 'Appointment Scheduling', desc: 'Book, reschedule, and manage vet appointments with smart reminders.' },
  { icon: HeartPulse, title: 'Health Records', desc: 'Track medical history, weight, allergies, and medications in one place.' },
  { icon: Syringe, title: 'Vaccination Tracking', desc: 'Never miss a booster. Get alerts when vaccines are due or expiring.' },
  { icon: MessageSquare, title: 'Vet Messaging', desc: 'Chat directly with your vets and pet care providers within the app.' },
  { icon: Bell, title: 'Smart Reminders', desc: 'Automated notifications for appointments, vaccines, and checkups.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need in one app</h2>
          <p className="mt-3 text-lg text-gray-600">Powerful features designed to make pet care effortless</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group rounded-2xl bg-white shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-500 transition-colors duration-200">
                  <Icon className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
