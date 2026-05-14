import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Instagram } from "lucide-react";

// Mock detailed data (in real app, this would come from API/database)
const mockDetailData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "Indonesian Mental Health Association",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c77734?w=800&h=400&fit=crop",
    type: "Education",
    city: "Jakarta",
    description: "The Indonesian Mental Health Association (IMHA) is a leading educational organization dedicated to promoting mental health awareness, research, and education throughout Indonesia. We work with healthcare professionals, students, and communities to advance understanding of mental health issues and improve access to quality care. Our programs include professional development workshops, public awareness campaigns, research initiatives, and community outreach programs. Since our establishment in 2015, we have trained over 1,000 mental health professionals and reached more than 50,000 individuals through our educational programs.",
    address: "Jl. Thamrin No. 15, Jakarta Pusat, DKI Jakarta 10340",
    phone: "+62-21-3456-7890",
    email: "info@imha.org.id",
    website: "https://imha.org.id",
    instagram: "@imha_indonesia"
  },
  "2": {
    id: 2,
    name: "Youth Mental Wellness Community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    type: "Community",
    city: "Bandung",
    description: "Youth Mental Wellness Community is a vibrant community-based organization focused on supporting young adults aged 18-30 with their mental health journey. We create safe spaces for young people to share their experiences, learn coping strategies, and build meaningful connections. Our community organizes regular meetups, workshops, peer support groups, and mental health awareness events. We believe that young people supporting young people creates powerful healing and growth opportunities. Our programs are designed by youth, for youth, ensuring relevance and relatability in our approach to mental wellness.",
    address: "Jl. Braga No. 88, Bandung, Jawa Barat 40111",
    phone: "+62-22-2345-6789",
    email: "hello@ymwc.id",
    website: "https://ymwc.id",
    instagram: "@ymwc_bandung"
  },
  "3": {
    id: 3,
    name: "Mindfulness Experience Center",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    type: "Experience",
    city: "Yogyakarta",
    description: "Mindfulness Experience Center offers transformative experiential programs designed to help individuals discover inner peace and develop mindfulness skills. Our center provides immersive experiences including meditation retreats, mindfulness workshops, nature therapy sessions, and contemplative practices. We combine traditional Eastern wisdom with modern psychological approaches to create powerful transformational experiences. Our beautiful retreat center in Yogyakarta provides the perfect setting for deep introspection and healing. Whether you're new to mindfulness or looking to deepen your practice, our experienced facilitators guide you through personalized journeys of self-discovery and wellness.",
    address: "Jl. Malioboro No. 156, Yogyakarta 55213",
    phone: "+62-274-567-8901",
    email: "retreat@mindfulnessyogya.com",
    website: "https://mindfulnessyogya.com",
    instagram: "@mindfulness_yogya"
  }
};

const OrganizationDetail = () => {
  const { id } = useParams();
  const data = mockDetailData[id || "1"];

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Organization Not Found</h1>
          <p className="text-muted-foreground">The organization you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "education": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "experience": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "community": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

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
              <Badge className={getTypeColor(data.type)}>
                {data.type}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>{data.city}</span>
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
              <CardTitle>Organization Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`text-base px-4 py-2 ${getTypeColor(data.type)}`}>
                {data.type}
              </Badge>
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
              <CardTitle>Get in Touch</CardTitle>
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
                <p className="text-sm text-muted-foreground mb-3">Follow us for updates and insights</p>
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

export default OrganizationDetail;