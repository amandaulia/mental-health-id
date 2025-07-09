import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

// Mock data for organizations and communities
const mockData = [
  {
    id: 1,
    name: "Indonesian Mental Health Association",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c77734?w=400&h=300&fit=crop",
    type: "Education",
    city: "Jakarta"
  },
  {
    id: 2,
    name: "Youth Mental Wellness Community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    type: "Community",
    city: "Bandung"
  },
  {
    id: 3,
    name: "Mindfulness Experience Center",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Yogyakarta"
  },
  {
    id: 4,
    name: "Mental Health Education Foundation",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    type: "Education",
    city: "Surabaya"
  },
  {
    id: 5,
    name: "Wellness Warriors Community",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
    type: "Community",
    city: "Medan"
  },
  {
    id: 6,
    name: "Therapeutic Adventure Experiences",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Bali"
  },
  {
    id: 7,
    name: "Mental Health Research Institute",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    type: "Education",
    city: "Jakarta"
  },
  {
    id: 8,
    name: "Healing Hearts Community",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    type: "Community",
    city: "Makassar"
  },
  {
    id: 9,
    name: "Transformative Wellness Experiences",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Semarang"
  }
];

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "education": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "experience": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "community": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Organizations</span> & Communities
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Connect with mental health organizations, educational institutions, and communities 
          dedicated to promoting mental wellness and providing support resources.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, city, or type..."
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
                variant={selectedType === "education" ? "default" : "outline"}
                onClick={() => setSelectedType("education")}
                size="sm"
              >
                Education
              </Button>
              <Button
                variant={selectedType === "experience" ? "default" : "outline"}
                onClick={() => setSelectedType("experience")}
                size="sm"
              >
                Experience
              </Button>
              <Button
                variant={selectedType === "community" ? "default" : "outline"}
                onClick={() => setSelectedType("community")}
                size="sm"
              >
                Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            <span className="text-primary">{filteredData.length}</span> Organizations Found
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
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{item.city}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => window.location.href = `/organizations/${item.id}`}
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
                No organizations found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any organizations matching your criteria. Try adjusting your search terms.
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

export default Organizations;