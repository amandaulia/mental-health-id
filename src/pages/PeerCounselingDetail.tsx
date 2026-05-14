import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Instagram, DollarSign, Clock, Users } from "lucide-react";
import { PhoneCallButton } from "@/components/PhoneCallButton";

// Mock detailed data (in real app, this would come from API/database)
const mockDetailData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "Jakarta Anxiety Support Circle",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
    specialization: "Anxiety & Panic Disorders",
    type: "Support Group",
    city: "Jakarta",
    price: "Free",
    description: "Jakarta Anxiety Support Circle is a safe and welcoming community for individuals dealing with anxiety and panic disorders. Our support group meets weekly to provide peer support, share coping strategies, and create connections with others who understand the challenges of living with anxiety.",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "+62-21-1234-5678",
    email: "info@jakartaanxiety.org",
    website: "https://jakartaanxiety.org",
    instagram: "@jakartaanxietysupport",
    schedule: "Every Tuesday 7:00 PM - 9:00 PM",
    groupSize: "8-12 participants",
    facilitator: "Dr. Sarah Indira, M.Psi",
    established: "2019",
    languages: "Indonesian, English"
  },
  "2": {
    id: 2,
    name: "Peer Counseling Indonesia",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    specialization: "Depression & Mood Disorders",
    type: "Peer Counseling",
    city: "Bandung",
    price: "50,000",
    description: "Peer Counseling Indonesia offers trained peer counselors who have lived experience with depression and mood disorders. Our counselors provide emotional support, practical guidance, and hope to individuals navigating similar challenges.",
    address: "Jl. Dago No. 45, Bandung",
    phone: "+62-22-9876-5432",
    email: "help@peercounselingid.org",
    website: "https://peercounselingid.org",
    instagram: "@peercounselingid",
    schedule: "Monday-Friday 9:00 AM - 5:00 PM",
    groupSize: "Individual sessions",
    facilitator: "Trained Peer Counselors",
    established: "2020",
    languages: "Indonesian, Sundanese"
  }
};

const PeerCounselingDetail = () => {
  const { id } = useParams();
  const data = mockDetailData[id || "1"];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
          <p className="text-muted-foreground">The resource you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Image */}
      <div className="mb-8">
        <div className="aspect-[21/9] overflow-hidden rounded-xl">
          <img 
            src={data.image} 
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {data.name}
              </h1>
              <Badge variant={data.type === "Peer Counseling" ? "default" : "secondary"} className="shrink-0">
                {data.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{data.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{data.price === "Free" ? "Free" : `Rp ${data.price}`}</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialization</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-base px-4 py-2">
                {data.specialization}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Schedule</p>
                    <p className="text-sm text-muted-foreground">{data.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Group Size</p>
                    <p className="text-sm text-muted-foreground">{data.groupSize}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm mb-1">Facilitator</p>
                  <p className="text-sm text-muted-foreground">{data.facilitator}</p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Languages</p>
                  <p className="text-sm text-muted-foreground">{data.languages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact & Location */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">Address</p>
                  <p className="text-sm text-muted-foreground">{data.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <PhoneCallButton phone={data.phone} asLink />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <a href={`mailto:${data.email}`} className="text-sm text-primary hover:text-primary-hover">
                    {data.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">Website</p>
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                    Visit Website
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium text-sm">Instagram</p>
                  <a href={`https://instagram.com/${data.instagram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                    {data.instagram}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PhoneCallButton phone={data.phone} className="w-full" />
              <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${data.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.open(data.website, '_blank')}>
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instagram</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <Instagram className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">Follow us for updates and mental health tips</p>
                <a 
                  href={`https://instagram.com/${data.instagram.substring(1)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  {data.instagram}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PeerCounselingDetail;