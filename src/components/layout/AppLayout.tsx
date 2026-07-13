import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSettingsStore } from '../../store/settingsStore';

export default function AppLayout({ children }: { children?: ReactNode }) {
  const { darkMode } = useSettingsStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:block fixed left-0 top-0 h-full z-20">
        <Sidebar />
      </div>
      <Navbar />
      <main className="lg:ml-[260px] pt-16 lg:pt-0 min-h-screen">
        <div className="page-enter">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
