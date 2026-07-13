import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, PawPrint, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { usePetStore } from '../store/petStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useToast } from '../hooks/useToast';
import type { Species, Gender } from '../types';

export default function PetsPage() {
  const navigate = useNavigate();
  const { pets, addPet } = usePetStore();
  const { appointments } = useAppointmentStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '', species: 'Dog' as Species, breed: '', age: 0, weight: 0, gender: 'Male' as Gender,
    vetName: '', vetPhone: '',
  });

  const filtered = useMemo(() => {
    return pets.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase())
    );
  }, [pets, search]);

  const handleAdd = () => {
    if (!newPet.name || !newPet.breed) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addPet({
      name: newPet.name,
      species: newPet.species,
      breed: newPet.breed,
      age: Number(newPet.age) || 0,
      weight: Number(newPet.weight) || 0,
      gender: newPet.gender,
      vetName: newPet.vetName,
      vetClinic: '',
      vetPhone: newPet.vetPhone,
    });
    showToast(`${newPet.name} has been added!`, 'success');
    setModalOpen(false);
    setNewPet({ name: '', species: 'Dog', breed: '', age: 0, weight: 0, gender: 'Male', vetName: '', vetPhone: '' });
  };

  const getNextAppointment = (petId: string) => {
    return appointments.find((a) => a.petId === petId && a.status === 'Upcoming');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">My Pets</h1>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          Add Pet
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by name or breed..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
            <PawPrint className="h-10 w-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {search ? 'No pets found' : 'No pets yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'Try a different search' : 'Add your first pet to get started!'}
          </p>
          {!search && (
            <Button variant="primary" className="mt-4" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
              Add Your First Pet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pet) => {
            const nextApt = getNextAppointment(pet.id);
            return (
              <Card
                key={pet.id}
                className="p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                onClick={() => navigate(`/pets/${pet.id}`)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-3xl shrink-0">
                    {pet.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{pet.name}</h3>
                    <p className="text-xs text-gray-500">{pet.breed}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">{pet.age} yrs</Badge>
                      <Badge variant="default">{pet.weight}kg</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  {pet.gender === 'Male' ? <span className="text-blue-500 font-bold text-xs">♂</span> : <span className="text-pink-500 font-bold text-xs">♀</span>}
                  <span>{pet.gender}</span>
                </div>
                {nextApt && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                      Next: {nextApt.type} · {nextApt.date}
                    </p>
                  </div>
                )}
                <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={(e) => { e.stopPropagation(); navigate(`/pets/${pet.id}`); }}>
                  View Profile
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Pet">
        <div className="space-y-4">
          <Input
            label="Pet Name *"
            placeholder="e.g. Rocky"
            value={newPet.name}
            onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Species</label>
            <select
              value={newPet.species}
              onChange={(e) => setNewPet({ ...newPet, species: e.target.value as Species })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Breed *"
            placeholder="e.g. Labrador"
            value={newPet.breed}
            onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age (years)"
              type="number"
              placeholder="3"
              value={newPet.age || ''}
              onChange={(e) => setNewPet({ ...newPet, age: Number(e.target.value) })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              placeholder="15"
              value={newPet.weight || ''}
              onChange={(e) => setNewPet({ ...newPet, weight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
            <select
              value={newPet.gender}
              onChange={(e) => setNewPet({ ...newPet, gender: e.target.value as Gender })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <Input
            label="Vet Name"
            placeholder="e.g. Dr. Sarah Miller"
            value={newPet.vetName}
            onChange={(e) => setNewPet({ ...newPet, vetName: e.target.value })}
          />
          <Input
            label="Vet Phone"
            placeholder="e.g. +1 (555) 123-4567"
            value={newPet.vetPhone}
            onChange={(e) => setNewPet({ ...newPet, vetPhone: e.target.value })}
          />
          <Button variant="primary" fullWidth onClick={handleAdd}>Add Pet</Button>
        </div>
      </Modal>
    </div>
  );
}
