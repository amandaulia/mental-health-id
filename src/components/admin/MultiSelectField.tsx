import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MultiSelectFieldProps {
  label: string;
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelectField({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "Select options" 
}: MultiSelectFieldProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleAdd = (option: string) => {
    if (option && !value.includes(option)) {
      onChange([...value, option]);
    }
    setSelectedValue("");
  };

  const handleRemove = (option: string) => {
    onChange(value.filter(item => item !== option));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Selected Items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-2">
              {item}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Select New */}
      <Select value={selectedValue} onValueChange={handleAdd}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.filter(option => !value.includes(option)).map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}