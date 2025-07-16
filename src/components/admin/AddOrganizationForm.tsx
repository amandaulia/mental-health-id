import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectField } from './MultiSelectField';

interface AddOrganizationFormProps {
  onAdd: (data: any) => void;
}

export function AddOrganizationForm({ onAdd }: AddOrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    specialization: [],
    verified: false
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Organization Name</Label>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <MultiSelectField
        label="Specializations"
        options={specializations}
        value={formData.specialization}
        onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={formData.verified}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: !!checked }))}
        />
        <Label htmlFor="verified">Verified</Label>
      </div>

      <Button type="submit" className="w-full">Add Organization</Button>
    </form>
  );
}