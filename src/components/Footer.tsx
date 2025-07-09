import { Heart, MapPin, Phone, Mail, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="brand-gradient text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Logo and Description */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src="/lovable-uploads/3be71bd4-b94e-4b75-817d-3f5bf5125610.png" 
              alt="Elysium Mental Care"
              className="h-10 w-auto"
            />
            <img 
              src="/lovable-uploads/a33b743b-d652-4614-9ab5-d0c279a825eb.png" 
              alt="Mental Wellness Movie Club"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-white/90 max-w-2xl text-lg">
            Your trusted directory for mental health resources. Connecting you with qualified psychologists, 
            psychiatrists, and mental health clinics across Indonesia.
          </p>
        </div>

        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              Counseling Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#professional-counseling" className="text-white/80 hover:text-white transition-colors">Psychologists</a></li>
              <li><a href="#professional-counseling" className="text-white/80 hover:text-white transition-colors">Mental Health Clinics</a></li>
              <li><a href="#peer-counseling" className="text-white/80 hover:text-white transition-colors">Peer Counselors</a></li>
              <li><a href="#peer-counseling" className="text-white/80 hover:text-white transition-colors">Support Groups</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              Resources Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#stress-relief" className="text-white/80 hover:text-white transition-colors">Activities</a></li>
              <li><a href="#organizations" className="text-white/80 hover:text-white transition-colors">Organizations</a></li>
              <li><a href="#organizations" className="text-white/80 hover:text-white transition-colors">Communities</a></li>
            </ul>
          </div>

          {/* Mental Health Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-medium mb-1">📞 WhatsApp</p>
                <p className="text-white/90">+62-813-2393-1225</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="font-medium mb-1">📧 Email</p>
                <p className="text-white/90">elysium.mcare@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/70 mb-2">
            © 2025 Elysium Mentalcare. Made with ❤️ for mental wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};