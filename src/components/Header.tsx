import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="brand-gradient shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <img 
              src="/lovable-uploads/3be71bd4-b94e-4b75-817d-3f5bf5125610.png" 
              alt="Elysium Mental Care"
              className="h-8 sm:h-10 w-auto"
            />
            <img 
              src="/lovable-uploads/a33b743b-d652-4614-9ab5-d0c279a825eb.png" 
              alt="Mental Wellness Movie Club"
              className="h-6 sm:h-8 w-auto hidden sm:block"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/about" className="text-white hover:text-accent-foreground transition-colors font-medium">
              About
            </a>
            <a href="/professional-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium">
              Professional Counseling
            </a>
            <a href="/peer-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium">
              Peer Counseling & Support Group
            </a>
            <a href="/stress-relief" className="text-white hover:text-accent-foreground transition-colors font-medium">
              Stress Relief Activities
            </a>
            <a href="/organizations" className="text-white hover:text-accent-foreground transition-colors font-medium">
              Organizations & Communities
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg m-2 p-4">
            <nav className="flex flex-col space-y-3">
              <a href="/about" className="text-white hover:text-accent-foreground transition-colors font-medium py-2">
                About
              </a>
              <a href="/professional-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium py-2">
                Professional Counseling
              </a>
              <a href="/peer-counseling" className="text-white hover:text-accent-foreground transition-colors font-medium py-2">
                Peer Counseling & Support Group
              </a>
              <a href="/stress-relief" className="text-white hover:text-accent-foreground transition-colors font-medium py-2">
                Stress Relief Activities
              </a>
              <a href="/organizations" className="text-white hover:text-accent-foreground transition-colors font-medium py-2">
                Organizations & Communities
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};