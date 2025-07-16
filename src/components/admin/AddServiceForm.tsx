import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelectField } from './MultiSelectField';

interface AddServiceFormProps {
  onAdd: (data: any) => void;
}

export function AddServiceForm({ onAdd }: AddServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    session_mode: []
  });

  const sessionModeOptions = [
    'Chat',
    'Voice Call',
    'Video Call',
    'Offline'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      duration: formData.duration ? parseFloat(formData.duration) : null,
      price: formData.price ? parseFloat(formData.price) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          />
        </div>
      </div>

      <MultiSelectField
        label="Session Mode"
        options={sessionModeOptions}
        value={formData.session_mode}
        onChange={(value) => setFormData(prev => ({ ...prev, session_mode: value }))}
      />

      <Button type="submit" className="w-full">Add Service</Button>
    </form>
  );
}