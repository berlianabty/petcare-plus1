import { create } from 'zustand';
import type { Pet } from '../types';
import { initialPets, generateId } from '../data/mockData';

interface PetStore {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'emoji' | 'weightHistory' | 'vaccinations' | 'medicalNotes' | 'allergies' | 'medications' | 'lastCheckup' | 'color' | 'microchipId'>) => void;
  updatePet: (id: string, data: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  addVaccination: (petId: string, vac: { name: string; dateGiven: string; nextDue: string }) => void;
  addAllergy: (petId: string, allergy: string) => void;
  removeAllergy: (petId: string, allergy: string) => void;
}

const speciesEmoji: Record<string, string> = {
  Dog: '🐕',
  Cat: '🐈',
  Bird: '🦜',
  Other: '🐾',
};

export const usePetStore = create<PetStore>((set) => ({
  pets: initialPets,
  addPet: (pet) =>
    set((state) => ({
      pets: [
        ...state.pets,
        {
          ...pet,
          id: generateId(),
          emoji: speciesEmoji[pet.species] || '🐾',
          color: 'Unknown',
          microchipId: 'N/A',
          lastCheckup: 'Not recorded',
          medicalNotes: '',
          allergies: [],
          medications: [],
          vaccinations: [],
          weightHistory: [
            { month: 'Current', weight: pet.weight },
          ],
        },
      ],
    })),
  updatePet: (id, data) =>
    set((state) => ({
      pets: state.pets.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePet: (id) =>
    set((state) => ({
      pets: state.pets.filter((p) => p.id !== id),
    })),
  addVaccination: (petId, vac) =>
    set((state) => ({
      pets: state.pets.map((p) =>
        p.id === petId
          ? { ...p, vaccinations: [...p.vaccinations, { ...vac, id: generateId() }] }
          : p
      ),
    })),
  addAllergy: (petId, allergy) =>
    set((state) => ({
      pets: state.pets.map((p) =>
        p.id === petId ? { ...p, allergies: [...p.allergies, allergy] } : p
      ),
    })),
  removeAllergy: (petId, allergy) =>
    set((state) => ({
      pets: state.pets.map((p) =>
        p.id === petId
          ? { ...p, allergies: p.allergies.filter((a) => a !== allergy) }
          : p
      ),
    })),
}));
