import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectField } from './MultiSelectField';

interface AddInstitutionFormProps {
  onAdd: (data: any) => void;
}

export function AddInstitutionForm({ onAdd }: AddInstitutionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    institution_type: '',
    profession_type: [],
    specialization: [],
    insurance: [],
    verified: false
  });

  const institutionTypes = [
    { value: 'Private Practice', label: 'Private Practice' },
    { value: 'Clinic', label: 'Clinic' },
    { value: 'Hospital', label: 'Hospital' }
  ];

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
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Institution Name</Label>
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

      <div>
        <Label>Institution Type</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, institution_type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select institution type" />
          </SelectTrigger>
          <SelectContent>
            {institutionTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <Button type="submit" className="w-full">Add Institution</Button>
    </form>
  );
}