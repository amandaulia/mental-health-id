import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddContactFormProps {
  onAdd: (data: any) => void;
}

export function AddContactForm({ onAdd }: AddContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact_type: '',
    value: '',
    link: ''
  });

  const contactTypes = [
    'WhatsApp',
    'Phone', 
    'Website',
    'Instagram',
    'Email'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Contact Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <Label>Contact Type</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, contact_type: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select contact type" />
          </SelectTrigger>
          <SelectContent>
            {contactTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="value">Contact Value</Label>
        <Input
          id="value"
          value={formData.value}
          onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full">Add Contact</Button>
    </form>
  );
}