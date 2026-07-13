import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, X, Plus, Calendar, Syringe, Stethoscope, Phone, User as UserIcon } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { usePetStore } from '../store/petStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import type { Vaccination } from '../types';

type Tab = 'overview' | 'medical' | 'vaccinations' | 'appointments';

function getVaccineStatus(nextDue: string): { label: string; variant: 'success' | 'warning' | 'danger' } {
  const due = new Date(nextDue);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  if (days < 0) return { label: 'Overdue', variant: 'danger' };
  if (days < 30) return { label: 'Due Soon', variant: 'warning' };
  return { label: 'Current', variant: 'success' };
}

export default function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, updatePet, addVaccination, addAllergy, removeAllergy } = usePetStore();
  const { appointments } = useAppointmentStore();
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [vacModalOpen, setVacModalOpen] = useState(false);
  const [newVac, setNewVac] = useState({ name: '', dateGiven: '', nextDue: '' });
  const [newAllergy, setNewAllergy] = useState('');

  const pet = pets.find((p) => p.id === id);
  const petAppointments = appointments.filter((a) => a.petId === id);

  if (!pet) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-gray-500">Pet not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/pets')}>Back to Pets</Button>
      </div>
    );
  }

  const startEdit = () => {
    setEditing(true);
    setEditData({ ...pet });
  };

  const saveEdit = () => {
    updatePet(pet.id, editData);
    setEditing(false);
    showToast('Pet profile updated!', 'success');
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditData({});
  };

  const handleAddVac = () => {
    if (!newVac.name || !newVac.dateGiven || !newVac.nextDue) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    addVaccination(pet.id, newVac);
    showToast('Vaccination added!', 'success');
    setVacModalOpen(false);
    setNewVac({ name: '', dateGiven: '', nextDue: '' });
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    addAllergy(pet.id, newAllergy.trim());
    setNewAllergy('');
    showToast('Allergy added', 'info');
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'medical', label: 'Medical' },
    { key: 'vaccinations', label: 'Vaccinations' },
    { key: 'appointments', label: 'Appointments' },
  ];

  const maxWeight = Math.max(...pet.weightHistory.map((w) => w.weight));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/pets')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Pets
      </button>

      {/* Hero */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-4xl shrink-0">
            {pet.emoji}
          </div>
          <div className="flex-1">
            {editing ? (
              <Input
                value={editData.name as string || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="max-w-xs"
              />
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{pet.name}</h1>
                <p className="text-sm text-gray-500">{pet.breed} · {pet.species}</p>
              </>
            )}
          </div>
          {editing ? (
            <div className="flex gap-2">
              <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={saveEdit}>Save</Button>
              <Button variant="outline" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={cancelEdit}>Cancel</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={startEdit}>Edit</Button>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.age} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.weight} kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.gender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Species</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.species}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.color}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Microchip ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.microchipId}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <UserIcon className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vet</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pet.vetName}</p>
                  <p className="text-xs text-gray-500">{pet.vetClinic} · {pet.vetPhone}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Weight History (Last 4 Months)</h3>
            <div className="flex items-end justify-around gap-4 h-40">
              {pet.weightHistory.map((w, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{w.weight}kg</span>
                  <div
                    className="w-full max-w-[60px] bg-gradient-to-t from-blue-400 to-sky-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(w.weight / maxWeight) * 100}%` }}
                  />
                  <span className="text-xs text-gray-500">{w.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Medical Tab */}
      {activeTab === 'medical' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Medical Notes</h3>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => {
                  const notes = prompt('Edit medical notes:', pet.medicalNotes);
                  if (notes !== null) {
                    updatePet(pet.id, { medicalNotes: notes });
                    showToast('Medical notes updated!', 'success');
                  }
                }}
              >
                Edit
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{pet.medicalNotes || 'No medical notes recorded.'}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Allergies</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {pet.allergies.length === 0 ? (
                <p className="text-sm text-gray-500">No known allergies</p>
              ) : (
                pet.allergies.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full px-3 py-1 text-xs font-medium">
                    {a}
                    <button onClick={() => { removeAllergy(pet.id, a); showToast('Allergy removed', 'info'); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add allergy..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                className="max-w-xs"
              />
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddAllergy}>Add</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Current Medications</h3>
            {pet.medications.length === 0 ? (
              <p className="text-sm text-gray-500">No current medications</p>
            ) : (
              <ul className="space-y-2">
                {pet.medications.map((med, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {med}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Last Checkup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pet.lastCheckup}</p>
          </Card>
        </div>
      )}

      {/* Vaccinations Tab */}
      {activeTab === 'vaccinations' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Vaccination Records</h3>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setVacModalOpen(true)}>
              Add Vaccination
            </Button>
          </div>
          {pet.vaccinations.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No vaccinations recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-2">Vaccine</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-2">Date Given</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-2">Next Due</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pet.vaccinations.map((vac: Vaccination) => {
                    const status = getVaccineStatus(vac.nextDue);
                    return (
                      <tr key={vac.id} className="border-b border-gray-50 dark:border-gray-700/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Syringe className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{vac.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">{vac.dateGiven}</td>
                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">{vac.nextDue}</td>
                        <td className="py-3 px-2"><Badge variant={status.variant}>{status.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{pet.name}'s Appointments</h3>
            <Button variant="primary" size="sm" leftIcon={<Calendar className="h-4 w-4" />} onClick={() => navigate('/appointments')}>
              Book New Appointment
            </Button>
          </div>
          {petAppointments.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-gray-500">No appointments yet for {pet.name}.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {petAppointments.map((apt) => (
                <Card key={apt.id} className="p-4" onClick={() => navigate(`/appointments/${apt.id}`)}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{apt.type}</p>
                      <p className="text-xs text-gray-500">{apt.vetName} · {apt.date} at {apt.time}</p>
                    </div>
                    <Badge variant={apt.status === 'Upcoming' ? 'info' : apt.status === 'Completed' ? 'success' : 'danger'}>
                      {apt.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Vaccination Modal */}
      <Modal isOpen={vacModalOpen} onClose={() => setVacModalOpen(false)} title="Add Vaccination">
        <div className="space-y-4">
          <Input
            label="Vaccine Name"
            placeholder="e.g. Rabies"
            value={newVac.name}
            onChange={(e) => setNewVac({ ...newVac, name: e.target.value })}
          />
          <Input
            label="Date Given"
            type="date"
            value={newVac.dateGiven}
            onChange={(e) => setNewVac({ ...newVac, dateGiven: e.target.value })}
          />
          <Input
            label="Next Due Date"
            type="date"
            value={newVac.nextDue}
            onChange={(e) => setNewVac({ ...newVac, nextDue: e.target.value })}
          />
          <Button variant="primary" fullWidth onClick={handleAddVac}>Add Vaccination</Button>
        </div>
      </Modal>
    </div>
  );
}
