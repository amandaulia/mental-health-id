
import { FilterState, FilterTag } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface FilterTagsProps {
  filters: FilterState;
  onRemoveFilter: (type: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export const FilterTags = ({ filters, onRemoveFilter, onClearAll }: FilterTagsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const getActiveTags = (): FilterTag[] => {
    const tags: FilterTag[] = [];
    
    filters.locations.forEach(location => 
      tags.push({ type: 'locations', value: location, label: location })
    );
    
    filters.institutions.forEach(name => 
      tags.push({ type: 'institutions', value: name, label: name })
    );
    
    filters.professionTypes.forEach(type => 
      tags.push({ type: 'professionTypes', value: type, label: type })
    );
    
    filters.specializations.forEach(spec => 
      tags.push({ type: 'specializations', value: spec, label: spec })
    );
    
    filters.modes.forEach(mode => {
      const label = getModeLabel(mode);
      tags.push({ type: 'modes', value: mode, label });
    });
    
    filters.insurance.forEach(ins => {
      const label = getInsuranceLabel(ins);
      tags.push({ type: 'insurance', value: ins, label });
    });
    
    return tags;
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "text": return t('sessionModes.chat');
      case "voice": return t('sessionModes.voiceCall');
      case "video": return t('sessionModes.videoCall');
      case "offline": return t('sessionModes.offline');
      default: return mode;
    }
  };

  const getInsuranceLabel = (type: string) => {
    switch (type) {
      case "none": return t('insurance.noInsurance');
      case "private": return t('insurance.privateInsurance');
      case "bpjs": return "BPJS";
      default: return type;
    }
  };

  const handleTagClick = (tag: FilterTag) => {
    const searchParams = new URLSearchParams();
    searchParams.set(tag.type, tag.value);
    navigate(`/?${searchParams.toString()}`);
  };

  const activeTags = getActiveTags();

  if (activeTags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">{t('detail.activeFiltersLabel')}</span>
      {activeTags.map((tag, index) => (
        <Badge 
          key={`${tag.type}-${tag.value}-${index}`}
          variant="secondary" 
          className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1"
          onClick={() => handleTagClick(tag)}
        >
          {tag.label}
          <X 
            className="h-3 w-3 hover:text-destructive" 
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter(tag.type, tag.value);
            }}
          />
        </Badge>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-foreground underline"
      >
        {t('filters.clearAll')}
      </button>
    </div>
  );
};
