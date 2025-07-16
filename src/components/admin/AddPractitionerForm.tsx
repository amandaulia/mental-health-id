import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectField } from './MultiSelectField';

interface AddPractitionerFormProps {
  onAdd: (data: any) => void;
}

export function AddPractitionerForm({ onAdd }: AddPractitionerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    experience: '',
    education: [],
    license_number: '',
    profession_type: [],
    specialization: [],
    insurance: [],
    verified: false
  });

  const professionTypes = [
    'Psychologist',
    'Psychiatrist',
    'Therapist'
  ];

  const specializations = [
    'Personality Disorders',
    'Trauma',
    'Mood Disorders',
    'ADHD',
    'Anxiety',
    'Relationship',
    'Career',
    'OCD',
    'Self Development',
    'Gender',
    'Family',
    'Depression',
    'Interpersonal',
    'Education'
  ];

  const insuranceTypes = [
    'Private Insurance',
    'BPJS'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      experience: formData.experience ? parseFloat(formData.experience) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Practitioner Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="experience">Experience (years)</Label>
          <Input
            id="experience"
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="license_number">License Number</Label>
          <Input
            id="license_number"
            value={formData.license_number}
            onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
          />
        </div>
      </div>

      <MultiSelectField
        label="Profession Types"
        options={professionTypes}
        value={formData.profession_type}
        onChange={(value) => setFormData(prev => ({ ...prev, profession_type: value }))}
      />

      <MultiSelectField
        label="Specializations"
        options={specializations}
        value={formData.specialization}
        onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
      />

      <MultiSelectField
        label="Insurance"
        options={insuranceTypes}
        value={formData.insurance}
        onChange={(value) => setFormData(prev => ({ ...prev, insurance: value }))}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={formData.verified}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: !!checked }))}
        />
        <Label htmlFor="verified">Verified</Label>
      </div>

      <Button type="submit" className="w-full">Add Practitioner</Button>
    </form>
  );
}