
import { useParams, useNavigate } from "react-router-dom";
import { mockPractitioners } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, MapPin, Phone, Globe, Instagram, MessageCircle, Video, User, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ModeIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case "text":
      return <MessageCircle className="h-4 w-4" />;
    case "voice":
      return <Phone className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "offline":
      return <User className="h-4 w-4" />;
    default:
      return null;
  }
};

const PractitionerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "Offline Session";
      default: return mode;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
      default: return ins;
    }
  };

  const handleTagClick = (type: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleBureauClick = () => {
    navigate(`/bureau/${practitioner.bureauId}`);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumbs and Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Practitioner Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <img
                src={practitioner.image}
                alt={practitioner.name}
                className="w-32 h-32 rounded-lg object-cover mx-auto lg:mx-0 flex-shrink-0"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">{practitioner.name}</h1>
                    {practitioner.isVerified && (
                      <Badge className="bg-green-100 text-green-700 w-fit">Verified</Badge>
                    )}
                  </div>
                  <button
                    onClick={handleBureauClick}
                    className="text-lg sm:text-xl text-primary hover:text-primary/80 transition-colors cursor-pointer underline"
                  >
                    {practitioner.bureauName}
                  </button>
                </div>
                
                {/* License Number */}
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">License Number:</span> {practitioner.licenseNumber}
                </div>

                {/* Profession Types */}
                <div>
                  <h4 className="font-medium mb-2">Profession Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.professionTypes.map((type) => (
                      <Badge 
                        key={type} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleTagClick('professionTypes', type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Specializations */}
                <div>
                  <h4 className="font-medium mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.specializations.map((spec) => (
                      <Badge 
                        key={spec} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleTagClick('specializations', spec)}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Session Modes */}
                <div>
                  <h4 className="font-medium mb-2">Available Session Modes</h4>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.modes.map((mode) => (
                      <Badge 
                        key={mode} 
                        variant="outline" 
                        className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                        onClick={() => handleTagClick('modes', mode)}
                      >
                        <ModeIcon mode={mode} />
                        {getModeLabel(mode)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Insurance & Updates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Insurance Accepted</h4>
                    <div className="flex flex-wrap gap-2">
                      {practitioner.insurance.map((ins) => (
                        <Badge 
                          key={ins} 
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleTagClick('insurance', ins)}
                        >
                          {getInsuranceLabel(ins)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Last updated:</span> {new Date(practitioner.lastUpdated).toLocaleDateString()}
                    </p>
                    <div className="mt-2 text-sm">
                      <div><span className="font-medium">Experience:</span> {practitioner.experience}</div>
                      <div><span className="font-medium">Education:</span> {practitioner.education}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Services */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {practitioner.services.map((service, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{service.duration}</p>
                        <p className="font-medium text-primary text-lg">
                          {formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <ModeIcon mode={service.mode} />
                          <span className="text-sm">{getModeLabel(service.mode)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                        {service.bookingUrl && (
                          <Button size="sm" asChild>
                            <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer">
                              Book
                            </a>
                          </Button>
                        )}
                        {service.learnMoreUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={service.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                              Learn More
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <p>{practitioner.phoneNumber}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <a href={`https://wa.me/${practitioner.phoneNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
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

              {/* Location */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{practitioner.location.address}</p>
                    <p className="text-sm text-muted-foreground">{practitioner.city}</p>
                  </div>
                </div>
                
                {/* Map Preview */}
                <div className="space-y-2">
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative group">
                    <p className="text-muted-foreground">Map preview</p>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg cursor-pointer">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <a 
                          href={`https://www.google.com/maps?q=${practitioner.location.lat},${practitioner.location.lng}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open in Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDetail;
