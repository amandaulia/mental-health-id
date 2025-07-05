
import { useParams } from "react-router-dom";
import { mockPractitioners } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Globe, Instagram, MessageCircle, Video, User } from "lucide-react";

const ModeIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case "text":
      return <MessageCircle className="h-5 w-5" />;
    case "voice":
      return <Phone className="h-5 w-5" />;
    case "video":
      return <Video className="h-5 w-5" />;
    case "offline":
      return <User className="h-5 w-5" />;
    default:
      return null;
  }
};

const PractitionerDetail = () => {
  const { id } = useParams();
  const practitioner = mockPractitioners.find(p => p.id === id);

  if (!practitioner) {
    return <div className="container mx-auto px-4 py-8">Practitioner not found</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "text": return "Text Session";
      case "voice": return "Voice Call Session";
      case "video": return "Video Call Session";
      case "offline": return "Offline Session";
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={practitioner.image}
                alt={practitioner.name}
                className="w-32 h-32 rounded-lg object-cover mx-auto md:mx-0"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{practitioner.name}</h1>
                    {practitioner.isVerified && (
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    )}
                  </div>
                  <p className="text-xl text-muted-foreground">{practitioner.bureauName}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {practitioner.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Experience:</span> {practitioner.experience}
                  </div>
                  <div>
                    <span className="font-medium">Education:</span> {practitioner.education}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {practitioner.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                  <p className="font-medium text-primary">
                    {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{practitioner.location.address}</p>
                  <p className="text-sm text-muted-foreground">{practitioner.city}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p>{practitioner.phoneNumber}</p>
              </div>
              
              <div className="flex gap-3">
                <Button size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <a href={`https://wa.me/${practitioner.phoneNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
                
                {practitioner.website && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={practitioner.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </Button>
                )}
                
                {practitioner.instagram && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <a href={practitioner.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Session Modes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {practitioner.modes.map((mode) => (
                  <div key={mode} className="flex items-center gap-3">
                    <ModeIcon mode={mode} />
                    <span>{getModeLabel(mode)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insurance & Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Insurance Accepted</h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.insurance.map((ins) => (
                    <Badge key={ins} variant="outline">{getInsuranceLabel(ins)}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(practitioner.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Preview Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Map preview coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PractitionerDetail;
