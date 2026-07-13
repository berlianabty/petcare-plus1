import { UserPlus, PawPrint, LayoutDashboard } from 'lucide-react';

const steps = [
  { num: '1', icon: UserPlus, title: 'Create Your Account', desc: 'Sign up in seconds and set up your profile with just a few clicks.' },
  { num: '2', icon: PawPrint, title: 'Add Your Pets', desc: 'Create profiles for each of your pets with their details and health info.' },
  { num: '3', icon: LayoutDashboard, title: 'Manage Everything', desc: 'Book appointments, track health, and chat with your vets — all in one place.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          <p className="mt-3 text-lg text-gray-600">Get started in three simple steps</p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] border-t-2 border-dashed border-gray-200" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative text-center">
                <div className="relative inline-flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 relative z-10">
                    <Icon className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold z-20">
                    {step.num}
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-xs mx-auto">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
