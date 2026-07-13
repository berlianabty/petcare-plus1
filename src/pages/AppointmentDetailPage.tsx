import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Stethoscope, FileText, RefreshCw, XCircle, RotateCcw } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAppointmentStore } from '../store/appointmentStore';
import { usePetStore } from '../store/petStore';
import { useToast } from '../hooks/useToast';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointments, cancelAppointment, rescheduleAppointment, updateAppointment } = useAppointmentStore();
  const { pets } = usePetStore();
  const { showToast } = useToast();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '9:00 AM', reason: '' });

  const apt = appointments.find((a) => a.id === id);
  const pet = apt ? pets.find((p) => p.id === apt.petId) : null;

  if (!apt) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-gray-500">Appointment not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/appointments')}>Back to Appointments</Button>
      </div>
    );
  }

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  ];

  const handleReschedule = () => {
    if (!rescheduleData.date) {
      showToast('Please select a new date', 'error');
      return;
    }
    rescheduleAppointment(apt.id, rescheduleData.date, rescheduleData.time, rescheduleData.reason);
    showToast('Appointment rescheduled successfully!', 'success');
    setRescheduleOpen(false);
    setRescheduleData({ date: '', time: '9:00 AM', reason: '' });
  };

  const handleCancel = () => {
    cancelAppointment(apt.id);
    showToast('Appointment cancelled', 'warning');
    setCancelOpen(false);
  };

  const handleSaveNotes = () => {
    updateAppointment(apt.id, { notes });
    showToast('Notes saved!', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/appointments')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-3xl">
            {apt.petEmoji}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{apt.type}</h1>
            <p className="text-sm text-gray-500">{apt.petName}</p>
          </div>
        </div>
        <Badge variant={apt.status === 'Upcoming' ? 'info' : apt.status === 'Completed' ? 'success' : 'danger'}>
          {apt.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Stethoscope className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Veterinarian</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.vetName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{apt.clinic}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Pet Information</h3>
          {pet ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl">
                  {pet.emoji}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.name}</p>
                  <p className="text-xs text-gray-500">{pet.breed} · {pet.age} yrs · {pet.weight}kg</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-50 dark:border-gray-700">
                <p className="text-xs text-gray-500">Vet</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.vetName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{pet.vetPhone}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Pet info unavailable</p>
          )}
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notes</h3>
        </div>
        <textarea
          defaultValue={apt.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this appointment..."
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-none"
        />
        <Button variant="secondary" size="sm" className="mt-3" onClick={handleSaveNotes}>Save Notes</Button>
      </Card>

      <div className="flex flex-wrap gap-3">
        {apt.status === 'Cancelled' ? (
          <Button
            variant="primary"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              updateAppointment(apt.id, { status: 'Upcoming' });
              showToast('Appointment rebooked!', 'success');
            }}
          >
            Book Again
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => setRescheduleOpen(true)}
            >
              Reschedule
            </Button>
            <Button
              variant="danger"
              leftIcon={<XCircle className="h-4 w-4" />}
              onClick={() => setCancelOpen(true)}
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal isOpen={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reschedule Appointment">
        <div className="space-y-4">
          <Input
            label="New Date"
            type="date"
            value={rescheduleData.date}
            onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Time</label>
            <select
              value={rescheduleData.time}
              onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reason for Reschedule</label>
            <textarea
              value={rescheduleData.reason}
              onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
              placeholder="e.g. Schedule conflict..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] resize-none"
            />
          </div>
          <Button variant="primary" fullWidth onClick={handleReschedule}>Confirm Reschedule</Button>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Appointment">
        <div className="text-center py-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-7 w-7 text-red-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Are you sure?</h3>
          <p className="mt-2 text-sm text-gray-500">
            This will cancel the {apt.type} appointment for {apt.petName} on {apt.date}.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setCancelOpen(false)}>Keep Appointment</Button>
            <Button variant="danger" fullWidth onClick={handleCancel}>Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
