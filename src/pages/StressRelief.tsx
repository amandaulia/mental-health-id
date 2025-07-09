import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, ExternalLink } from "lucide-react";

// Mock data for stress relief activities
const mockData = [
  {
    id: 1,
    name: "Art Therapy Studio Jakarta",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    type: "Art",
    city: "Jakarta",
    price: "150,000",
    website: "https://arttherapyjakarta.com"
  },
  {
    id: 2,
    name: "Harmonic Music Therapy",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    type: "Music",
    city: "Bandung",
    price: "200,000",
    website: "https://harmonictherapy.com"
  },
  {
    id: 3,
    name: "Active Wellness Sports Center",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    type: "Sports",
    city: "Surabaya",
    price: "100,000",
    website: "https://activewellness.com"
  },
  {
    id: 4,
    name: "Creative Expression Workshop",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    type: "Art",
    city: "Yogyakarta",
    price: "120,000",
    website: "https://creativeexpression.com"
  },
  {
    id: 5,
    name: "Melody Minds Music Therapy",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop",
    type: "Music",
    city: "Jakarta",
    price: "180,000",
    website: "https://melodyminds.com"
  },
  {
    id: 6,
    name: "Zen Sports & Meditation",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=400&h=300&fit=crop",
    type: "Sports",
    city: "Bali",
    price: "250,000",
    website: "https://zensports.com"
  },
  {
    id: 7,
    name: "Pottery & Peace Art Studio",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    type: "Art",
    city: "Medan",
    price: "135,000",
    website: "https://potteryandpeace.com"
  },
  {
    id: 8,
    name: "Rhythm Recovery Music Center",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
    type: "Music",
    city: "Makassar",
    price: "160,000",
    website: "https://rhythmrecovery.com"
  },
  {
    id: 9,
    name: "Mindful Movement Sports",
    image: "https://images.unsplash.com/photo-1506629905607-c5b7f8ff6c25?w=400&h=300&fit=crop",
    type: "Sports",
    city: "Semarang",
    price: "90,000",
    website: "https://mindfulmovement.com"
  }
];

const StressRelief = () => {
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
      case "art": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "music": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sports": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Stress Relief</span> Activities
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover therapeutic activities including art therapy, music therapy, and sports programs 
          designed to help you manage stress and improve your mental well-being.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, city, or activity type..."
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
                variant={selectedType === "art" ? "default" : "outline"}
                onClick={() => setSelectedType("art")}
                size="sm"
              >
                Art
              </Button>
              <Button
                variant={selectedType === "music" ? "default" : "outline"}
                onClick={() => setSelectedType("music")}
                size="sm"
              >
                Music
              </Button>
              <Button
                variant={selectedType === "sports" ? "default" : "outline"}
                onClick={() => setSelectedType("sports")}
                size="sm"
              >
                Sports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            <span className="text-primary">{filteredData.length}</span> Activities Found
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Rp {item.price}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => window.open(item.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
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
                No activities found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any stress relief activities matching your criteria. Try adjusting your search terms.
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

export default StressRelief;