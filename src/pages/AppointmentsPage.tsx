import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CalendarX, MapPin, Clock, Stethoscope } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAppointmentStore } from '../store/appointmentStore';
import { usePetStore } from '../store/petStore';
import { useToast } from '../hooks/useToast';
import type { AppointmentStatus } from '../types';

type FilterTab = 'All' | AppointmentStatus;

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, addAppointment } = useAppointmentStore();
  const { pets } = usePetStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({ petId: pets[0]?.id || '', type: '', vetName: '', clinic: '', date: '', time: '9:00 AM' });

  const tabs: FilterTab[] = ['All', 'Upcoming', 'Completed', 'Cancelled'];

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        apt.petName.toLowerCase().includes(search.toLowerCase()) ||
        apt.vetName.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'All' || apt.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [appointments, search, activeTab]);

  const handleAdd = () => {
    const pet = pets.find((p) => p.id === newApt.petId);
    if (!pet || !newApt.type || !newApt.date) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addAppointment({
      petId: pet.id,
      petName: pet.name,
      petEmoji: pet.emoji,
      type: newApt.type,
      vetName: newApt.vetName || pet.vetName,
      clinic: newApt.clinic || pet.vetClinic,
      date: newApt.date,
      time: newApt.time,
    });
    showToast('Appointment booked successfully!', 'success');
    setModalOpen(false);
    setNewApt({ petId: pets[0]?.id || '', type: '', vetName: '', clinic: '', date: '', time: '9:00 AM' });
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Appointments</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          New Appointment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by pet name or vet name..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
            <CalendarX className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">No appointments found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => { setSearch(''); setActiveTab('All'); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((apt) => (
            <Card
              key={apt.id}
              className="p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
              onClick={() => navigate(`/appointments/${apt.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl shrink-0">
                  {apt.petEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{apt.type}</h3>
                    <Badge variant={apt.status === 'Upcoming' ? 'info' : apt.status === 'Completed' ? 'success' : 'danger'}>
                      {apt.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{apt.petName}</p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5" /> {apt.vetName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {apt.clinic}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {apt.date} at {apt.time}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Appointment">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pet</label>
            <select
              value={newApt.petId}
              onChange={(e) => setNewApt({ ...newApt, petId: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
              ))}
            </select>
          </div>
          <Input
            label="Appointment Type"
            placeholder="e.g. Annual Checkup"
            value={newApt.type}
            onChange={(e) => setNewApt({ ...newApt, type: e.target.value })}
          />
          <Input
            label="Vet Name"
            placeholder="e.g. Dr. Sarah Miller"
            value={newApt.vetName}
            onChange={(e) => setNewApt({ ...newApt, vetName: e.target.value })}
          />
          <Input
            label="Clinic"
            placeholder="e.g. City Pet Clinic"
            value={newApt.clinic}
            onChange={(e) => setNewApt({ ...newApt, clinic: e.target.value })}
          />
          <Input
            label="Date"
            type="date"
            value={newApt.date}
            onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Time</label>
            <select
              value={newApt.time}
              onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" fullWidth onClick={handleAdd}>Book Appointment</Button>
        </div>
      </Modal>
    </div>
  );
}
