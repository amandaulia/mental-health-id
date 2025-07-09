import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, ChevronDown } from "lucide-react";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { FilterTags } from "@/components/FilterTags";
import { FilterState } from "@/types";

// Mock data for peer counseling and support groups
const mockData = [
  {
    id: 1,
    name: "Jakarta Anxiety Support Circle",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    specialization: "Anxiety & Panic Disorders",
    type: "Support Group",
    city: "Jakarta",
    price: "Free"
  },
  {
    id: 2,
    name: "Peer Counseling Indonesia",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    specialization: "Depression & Mood Disorders",
    type: "Peer Counseling",
    city: "Bandung",
    price: "50,000"
  },
  {
    id: 3,
    name: "Trauma Recovery Community",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
    specialization: "Trauma & PTSD",
    type: "Support Group",
    city: "Surabaya",
    price: "Free"
  },
  {
    id: 4,
    name: "Young Adults Mental Health Support",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    specialization: "Young Adult Issues",
    type: "Peer Counseling",
    city: "Yogyakarta",
    price: "75,000"
  },
  {
    id: 5,
    name: "Family Support Network",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
    specialization: "Family Therapy",
    type: "Support Group",
    city: "Jakarta",
    price: "Free"
  },
  {
    id: 6,
    name: "Addiction Recovery Circle",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    specialization: "Addiction Recovery",
    type: "Support Group",
    city: "Medan",
    price: "Free"
  }
];

interface DropdownProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasActiveFilters?: boolean;
}

const Dropdown = ({ title, icon, isOpen, onToggle, children, hasActiveFilters }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={onToggle}
        className={`flex items-center gap-2 bg-lavender border-lavender hover:bg-lavender/90 transition-colors text-lavender-foreground ${
          hasActiveFilters ? 'ring-2 ring-lavender shadow-md bg-lavender' : ''
        }`}
      >
        {icon}
        <span className="font-medium">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-card border rounded-xl shadow-lg z-50 min-w-[280px] card-shadow">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const FilterChip = ({ label, isSelected, onClick }: FilterChipProps) => (
  <Button
    size="sm"
    onClick={onClick}
    className={`text-sm transition-colors border ${
      isSelected 
      ? 'bg-lavender text-lavender-foreground hover:bg-lavender/90 border-lavender shadow-md' 
      : 'bg-lavender/50 hover:bg-lavender/70 border-[hsl(var(--lavender-mist)/0.6)] text-lavender-foreground'
    }`}
  >
    {label}
  </Button>
);

const PeerCounseling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Create filters state for FilterTags component
  const filters: FilterState = {
    search: searchTerm,
    locations: selectedCity !== "all" ? [selectedCity] : [],
    institutions: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    insurance: []
  };

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    if (type === 'locations') {
      setSelectedCity("all");
    }
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCity("all");
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesCity = selectedCity === "all" || item.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesType && matchesCity;
  });

  const uniqueCities = [...new Set(mockData.map(item => item.city))].sort();
  const types = ["Peer Counseling", "Support Group"];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Peer Counseling</span> & Support Groups
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Connect with peer counselors and join support groups where you can share experiences 
          and receive support from others who understand your journey.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filter Dropdown */}
            <Dropdown
              title="Type"
              icon={<DollarSign className="h-4 w-4" />}
              isOpen={openDropdown === 'type'}
              onToggle={() => toggleDropdown('type')}
              hasActiveFilters={selectedType !== "all"}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Service Type</h3>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All Types"
                    isSelected={selectedType === "all"}
                    onClick={() => { setSelectedType("all"); setOpenDropdown(null); }}
                  />
                  {types.map((type) => (
                    <FilterChip
                      key={type}
                      label={type}
                      isSelected={selectedType.toLowerCase() === type.toLowerCase()}
                      onClick={() => { setSelectedType(type.toLowerCase()); setOpenDropdown(null); }}
                    />
                  ))}
                </div>
              </div>
            </Dropdown>

            {/* City Filter Dropdown */}
            <Dropdown
              title="City"
              icon={<MapPin className="h-4 w-4" />}
              isOpen={openDropdown === 'city'}
              onToggle={() => toggleDropdown('city')}
              hasActiveFilters={selectedCity !== "all"}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All Cities"
                    isSelected={selectedCity === "all"}
                    onClick={() => { setSelectedCity("all"); setOpenDropdown(null); }}
                  />
                  {uniqueCities.map((city) => (
                    <FilterChip
                      key={city}
                      label={city}
                      isSelected={selectedCity.toLowerCase() === city.toLowerCase()}
                      onClick={() => { setSelectedCity(city.toLowerCase()); setOpenDropdown(null); }}
                    />
                  ))}
                </div>
              </div>
            </Dropdown>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-lavender-foreground placeholder:text-lavender-foreground border-lavender focus:outline-none focus:ring-2 focus:ring-lavender focus:border-lavender"
              />
            </div>
          </div>
        </div>

        {/* FilterTags component */}
        <div className="mt-4">
          <FilterTags
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            <span className="text-primary">{filteredData.length}</span> Resources Found
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const cardData: UnifiedCardData = {
              type: item.type === "Peer Counseling" ? "peer-counseling" : "support-group",
              id: item.id.toString(),
              image: item.image,
              name: item.name,
              city: item.city,
              specialization: item.specialization,
              serviceType: item.type,
              price: item.price
            };

            return (
              <UnifiedCard 
                key={item.id} 
                data={cardData} 
                linkTo={`/peer-counseling/${item.id}`}
              />
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                No resources found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any peer counseling or support groups matching your criteria. Try adjusting your search terms.
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedType("all"); }}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerCounseling;
