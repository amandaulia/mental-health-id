import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign } from "lucide-react";

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

const PeerCounseling = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, city, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedType === "peer" ? "default" : "outline"}
                onClick={() => setSelectedType("peer")}
                size="sm"
              >
                Peer Counseling
              </Button>
              <Button
                variant={selectedType === "support" ? "default" : "outline"}
                onClick={() => setSelectedType("support")}
                size="sm"
              >
                Support Groups
              </Button>
            </div>
          </div>
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
          {filteredData.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {item.name}
                  </CardTitle>
                  <Badge variant={item.type === "Peer Counseling" ? "default" : "secondary"} className="shrink-0">
                    {item.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Specialization</h4>
                    <p className="text-sm">{item.specialization}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{item.price === "Free" ? "Free" : `Rp ${item.price}`}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => window.location.href = `/peer-counseling/${item.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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