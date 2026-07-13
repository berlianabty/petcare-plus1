import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Bell, CalendarPlus, PawPrint, FileText, MessageSquare, ArrowRight, Calendar, Stethoscope, Syringe, MessageCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { usePetStore } from '../store/petStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useMessageStore } from '../store/messageStore';
import { initialActivities, initialNotifications } from '../data/mockData';
import type { AppNotification } from '../types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { pets } = usePetStore();
  const { appointments } = useAppointmentStore();
  const { conversations } = useMessageStore();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = conversations.filter((c) => c.unread).length;
  const upcomingAppts = appointments.filter((a) => a.status === 'Upcoming');
  const todaysDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const quickActions = [
    { label: 'Book Appointment', icon: CalendarPlus, path: '/appointments' },
    { label: 'Add Pet', icon: PawPrint, path: '/pets' },
    { label: 'View Records', icon: FileText, path: '/pets' },
    { label: 'Send Message', icon: MessageSquare, path: '/messages' },
  ];

  const activityIcons: Record<string, typeof Calendar> = {
    appointment: Calendar,
    pet: PawPrint,
    message: MessageCircle,
    vaccination: Syringe,
    profile: Stethoscope,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-sky-500 border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Good morning, {user?.name?.split(' ')[0] || 'Alex'}! 👋</h1>
            <p className="mt-1 text-blue-50">You have {upcomingAppts.length} upcoming appointments this week.</p>
            <p className="mt-0.5 text-sm text-blue-100">{todaysDate}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-white">
              <PawPrint className="h-4 w-4" /> {pets.length} Pets
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-white">
              <Calendar className="h-4 w-4" /> {upcomingAppts.length} Upcoming
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-white">
              <MessageSquare className="h-4 w-4" /> {unreadCount} Unread
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">This Week's Schedule</h2>
            <button onClick={() => navigate('/appointments')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <Card key={apt.id} className="p-4" onClick={() => navigate(`/appointments/${apt.id}`)}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                    {apt.petEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{apt.petName}</p>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{apt.type}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.vetName} · {apt.date} at {apt.time}</p>
                  </div>
                  <Badge variant={apt.status === 'Upcoming' ? 'info' : apt.status === 'Completed' ? 'success' : 'danger'}>
                    {apt.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pet Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Pets</h2>
            <button onClick={() => navigate('/pets')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {pets.map((pet) => (
              <Card key={pet.id} className="p-4" onClick={() => navigate(`/pets/${pet.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                    {pet.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{pet.name}</p>
                    <p className="text-xs text-gray-500">{pet.breed} · {pet.age} yrs · {pet.weight}kg</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all hover:-translate-y-0.5 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
              >
                <Icon className="h-7 w-7" />
                <span className="text-sm font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity + Notification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {initialActivities.map((activity, i) => {
                const Icon = activityIcons[activity.type] || Calendar;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${i === initialActivities.length - 1 ? '' : 'relative'}`}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                        <Icon className="h-4 w-4 text-blue-500" />
                      </div>
                      {i < initialActivities.length - 1 && (
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-px h-full bg-gray-100 dark:bg-gray-700" style={{ height: 'calc(100% + 16px)' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Notification Widget */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notifications</h2>
          <div className="relative" ref={notifRef}>
            <Card className="p-4">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notifications.filter((n) => !n.read).length} new notifications
                  </span>
                </div>
              </button>

              {notifOpen && (
                <div className="mt-3 space-y-2 animate-fade-in-up">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-50 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="mt-1.5 h-2 w-2 bg-blue-500 rounded-full shrink-0" />}
                        <div className={n.read ? 'pl-4' : ''}>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
