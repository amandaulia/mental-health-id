import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface RelationManagerProps {
  title: string;
  entityType: string;
  selectedItems: any[];
  availableItems: any[];
  onSelectExisting: (item: any) => void;
  onRemove: (index: number) => void;
  onAddNew: (data: any) => void;
  displayField?: string;
  modalFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
    options?: string[];
    required?: boolean;
  }>;
}

export function RelationManager({
  title,
  entityType,
  selectedItems,
  availableItems,
  onSelectExisting,
  onRemove,
  onAddNew,
  displayField = 'name',
  modalFields
}: RelationManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleAddNew = () => {
    onAddNew(formData);
    setFormData({});
    setShowModal(false);
  };

  const getDisplayText = (item: any) => {
    if (entityType === 'contact') {
      return `${item.contact_type}: ${item.value}`;
    }
    if (entityType === 'location') {
      return `${item.name || item.city}`;
    }
    return item[displayField] || item.name;
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{title}</Label>
      
      {/* Selected Items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-2">
              {getDisplayText(item)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Select Existing */}
      {availableItems.length > 0 && (
        <Select onValueChange={(value) => {
          const selected = availableItems.find(item => item.id.toString() === value);
          if (selected && !selectedItems.find(s => s.id === selected.id)) {
            onSelectExisting(selected);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder={`Select existing ${entityType}`} />
          </SelectTrigger>
          <SelectContent>
            {availableItems.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {getDisplayText(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Add New Button */}
      <Button 
        onClick={() => setShowModal(true)}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New {entityType}
      </Button>

      {/* Add New Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {entityType}</DialogTitle>
            <DialogDescription>Create a new {entityType}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {modalFields.map((field) => (
              <div key={field.key}>
                <Label>{field.label} {field.required && '*'}</Label>
                {field.type === 'text' && (
                  <Input 
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.label}
                  />
                )}
                {field.type === 'number' && (
                  <Input 
                    type="number"
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.label}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea 
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.label}
                  />
                )}
                {field.type === 'select' && (
                  <Select 
                    value={formData[field.key] || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={formData[field.key] || false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [field.key]: checked }))}
                    />
                    <Label className="text-sm">{field.label}</Label>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNew}>
              Add {entityType}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}