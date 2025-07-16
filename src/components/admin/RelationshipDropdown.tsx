import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RelationshipDropdownProps {
  label: string;
  options: any[];
  selected: any[];
  onSelect: (item: any) => void;
  onRemove: (item: any) => void;
  renderOption: (option: any) => string;
  renderSelected: (item: any) => string;
  AddNewComponent: React.ComponentType<{ onAdd: (data: any) => void }>;
  onAddNew: (data: any) => void;
}

export function RelationshipDropdown({
  label,
  options,
  selected,
  onSelect,
  onRemove,
  renderOption,
  renderSelected,
  AddNewComponent,
  onAddNew
}: RelationshipDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  const availableOptions = options.filter(option => 
    !selected.some(sel => sel.id === option.id)
  );

  const handleSelect = (value: string) => {
    if (value === 'add-new') {
      setShowAddNew(true);
      return;
    }
    
    const option = options.find(opt => opt.id.toString() === value);
    if (option) {
      onSelect(option);
    }
  };

  const handleAddNew = (data: any) => {
    onAddNew(data);
    setShowAddNew(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      <Select onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map(option => (
            <SelectItem key={option.id} value={option.id.toString()}>
              {renderOption(option)}
            </SelectItem>
          ))}
          <SelectItem value="add-new" className="text-primary">
            <div className="flex items-center gap-2">
              <Plus size={16} />
              Add New
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1"
            >
              {renderSelected(item)}
              <button
                onClick={() => onRemove(item)}
                className="ml-1 text-xs hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Dialog open={showAddNew} onOpenChange={setShowAddNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {label.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <AddNewComponent onAdd={handleAddNew} />
        </DialogContent>
      </Dialog>
    </div>
  );
}