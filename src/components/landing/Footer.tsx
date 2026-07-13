import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Mobile App', 'Integrations', 'Updates'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Contact'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Community', 'Privacy Policy', 'Terms of Service', 'FAQ'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500">
                <PawPrint className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PetCare+</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              The all-in-one platform for pet owners to manage their pets' health and care.
            </p>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">© 2025 PetCare+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
